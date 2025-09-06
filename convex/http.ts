import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getAuthUserId } from "@convex-dev/auth/server";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/api/chat",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop();
    if (!lastUserMessage || !lastUserMessage.parts.some(p => p.type === 'text')) {
      return Response.json({ error: "No user message found" }, { status: 400 });
    }
    const userQuery = (lastUserMessage.parts.find(p => p.type === 'text') as { type: 'text', text: string }).text;

    const relevantNotes = await ctx.runAction(
      internal.notesActions.findRelevantNotes,
      {
        query: userQuery,
        userId,
      }
    );

    const context = relevantNotes
      .map(
        (note) =>
          `Note ID: ${note._id}\nNote Title: ${note.title}\nNote Body: ${note.body}`
      )
      .join("\n\n---\n\n");

   
    const augmentedQuery = `
      Using the following context, answer the user's question.

      Context from notes:
      ${context}

      User's question:
      ${userQuery}
    `;

    
    const augmentedMessages: UIMessage[] = [
      ...messages.slice(0, -1),
      {
        ...lastUserMessage,
        parts: [{ type: "text", text: augmentedQuery }],
      },
    ];

   
    const result = streamText({
      model: google("models/gemini-1.5-flash-latest"),
       system: `
    You are a helpful assistant for a note-taking app. Your primary goal is to answer the user's question directly based on the context provided in their message.

    After you have provided a complete answer, add a section at the very end titled "Source Notes".
    In this section, provide a bulleted list of links to all the notes you used.

    IMPORTANT: You must use this exact Markdown format for the links, including the note's title as the link text.
    For example: "- [Note Title](/notes?noteId=k123abc...)"

    If the answer is not in the provided context, respond with "Sorry, I can't find that information in your notes".
  `,

      messages: convertToModelMessages(augmentedMessages),
      onError(error) {
        console.error("streamText error:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      headers: new Headers({
        "Access-Control-Allow-Origin": "*",
        Vary: "origin",
      }),
    });
  }),
});

http.route({
  path: "/api/chat",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers":
            "Content-Type, Digest, Authorization",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;