🧠 AI Notes App
A next-generation note-taking application that uses Retrieval-Augmented Generation (RAG) to make your personal knowledge base intelligent. Built with Next.js 15, Convex, and the Vercel AI SDK.

✨ Features
🤖 AI-Powered Recall: Ask questions about your notes and get accurate answers using RAG (Retrieval-Augmented Generation).

⚡ Real-Time Sync: Powered by Convex, notes sync instantly across all devices and sessions without page reloads.

🔐 Secure Authentication: Robust user session management and data privacy using JWT Authentication.

🔍 Vector Search: High-performance vector embedding pipeline that understands the context of your notes, not just keywords.

📝 Full CRUD: Create, Read, Update, and Delete notes with a snappy, optimistic UI.

🛠️ Tech Stack
Framework: Next.js 15 (App Router)

Backend / Database: Convex (Real-time database + Backend-as-a-Service)

AI & LLM: Vercel AI SDK v5 (StreamText, Tools)

Embeddings: OpenAI / Cohere (via Vercel AI SDK)

Styling: Tailwind CSS

Auth: Custom JWT Integration

🚀 Getting Started
Follow these steps to get the project running locally.

Prerequisites
Node.js 18+ installed

A Convex account

An OpenAI API Key (or other provider) for embeddings

1. Clone the repository
Bash

git clone https://github.com/yourusername/ai-notes-app.git
cd ai-notes-app
2. Install dependencies
Bash

npm install
# or
pnpm install
# or
yarn install
3. Configure Environment Variables
Create a .env.local file in the root directory and add the following keys:

Bash

# Convex Deployment Info (Auto-filled by npx convex dev)
CONVEX_DEPLOYMENT=your_deployment_name
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# AI Provider Keys (Required for RAG & Embeddings)
OPENAI_API_KEY=sk-...

# Authentication (If using external provider like Clerk/Auth0 with JWT)
JWT_ISSUER_URL=...
JWT_SECRET=...
4. Start the Convex Backend
This command initializes your Convex project and starts the real-time sync server.

Bash

npx convex dev
5. Run the Development Server
In a separate terminal window, start the Next.js frontend:

Bash

npm run dev
Open http://localhost:3000 with your browser to see the app.

🧠 How RAG Works in This App
Ingestion: When you create a note, the content is sent to an embedding model via the Vercel AI SDK.

Storage: The resulting vector (a list of numbers representing the meaning of the text) is stored in Convex's native Vector Index.

Retrieval: When you ask a question, we generate a vector for your query and use Convex Vector Search to find the most relevant notes.

Generation: These relevant notes are passed as "context" to the LLM, allowing it to answer your question using your own data.

📂 Project Structure
Bash

├── convex/               # Backend functions & Database schema
│   ├── auth.config.ts    # JWT Auth configuration
│   ├── notes.ts          # CRUD mutations and queries
│   ├── search.ts         # Vector search & embedding logic
│   └── schema.ts         # Database schema with Vector Index definition
├── src/
│   ├── app/              # Next.js 15 App Router pages
│   ├── components/       # React components (NotesList, SearchBar, etc.)
│   └── lib/              # Utilities (AI SDK configurations)
└── public/               # Static assets
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is open source and available under the MIT License.



