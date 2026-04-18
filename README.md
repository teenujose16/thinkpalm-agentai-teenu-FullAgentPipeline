# SpecToUI (AI-Powered UI Generator)

A React/Next.js application where an AI agent reads a Product Requirements Document (PRD) and generates a complete UI component tree using Tailwind CSS. 

## Features
- **AI Prompt Engineering:** Specialized Groq usage with optimized prompt chains for generating high-quality React/Tailwind UI components from plain text PRDs.
- **Component Preview:** Interactive sandboxed preview environment rendering the generated component in real time.
- **Export to Code:** View the raw component code inside a Monaco editor, ready to be copied into your own application or downloaded.

## Agentic Pipeline Architecture
This project successfully implements a complete end-to-end multi-agent pipeline fulfilling all track requirements:
1. **Multi-Agent Orchestration (2+ Agents)**: The system utilizes three specialized agents (`PlannerAgent`, `GeneratorAgent`, and `SummarizerAgent`) managed by an overarching `AgentOrchestrator` to coordinate the generation flow.
2. **Tool-Calling Capability**: The `PlannerAgent` leverages the Groq tool-calling API (`completionWithTools`) to execute operations like validating PRD quality, suggesting UI layout patterns, and simulating NPM library searches.
3. **Memory & State**: The `AgentMemory` class manages memory context, passing serialized component trees between agents, and persisting the user's PRD history to local storage and the file system.
4. **Working UI**: A polished, responsive Next.js frontend with drag-resizable split panes dynamically updates as the agents stream their progress and the generated code.

## Setup Instructions

### 1. Requirements
- Node.js 18+ (Node 20+ recommended)
- npm, pnpm, or yarn
- A [Groq API Key](https://console.groq.com/keys)

### 2. Installation
Install the project dependencies in your local terminal:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project with your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```
(See `.env.example` for details).

### 4. Running the Development Server
Start up the local development environment:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Demo Video
*(Add link to your 8-min Loom/YouTube demo video here)*