# SpecToUI (AI-Powered UI Generator)

Name: Teenu Jose

Track: Frontend Dev

Lab Name: Capstone Sandbox — Full Agent Pipeline

Turn any Product Requirements Document into a complete React component tree — instantly.

SpecToUI is an AI-powered Next.js application where an agentic pipeline reads a PRD, plans a component hierarchy, and generates production-quality TSX code with Tailwind CSS — all streamed live to a 3-panel UI.

What it does
Paste or upload a Product Requirements Document (PRD) in the left panel
Click "Generate UI" — the AI agent pipeline kicks off automatically
Watch the Tree View populate with a live component hierarchy
Browse generated TSX code per component in the Code Export panel
Export as ZIP — a complete, ready-to-use React component library
Agentic Pipeline
This project implements a complete end-to-end agentic pipeline with the following components:

Agents
PlannerAgent (src/lib/agents/PlannerAgent.ts)

Receives the raw PRD text
Uses Groq tool-calling to validate PRD quality, suggest layout patterns, and search NPM for relevant React component libraries
Runs an explicit ReAct loop (Thought → Action → Observation) with bounded tool iterations
Produces a validated, structured ComponentTree (via Zod schema)
Stores the plan in AgentMemory for downstream use
GeneratorAgent (src/lib/agents/GeneratorAgent.ts)

Receives the ComponentTree from PlannerAgent
Iterates over every component in the tree
Uses Groq tool-calling to validate TSX syntax and check accessibility
Uses the same bounded ReAct loop pattern for tool-assisted code refinement
Streams generated TSX code component by component
Stores each result in AgentMemory
SummarizerAgent (src/lib/agents/SummarizerAgent.ts)

Runs after component generation completes
Reads prd_analysis, component_tree, and library_suggestions from AgentMemory
Produces a structured generation report using model completion
Stores the final report in AgentMemory under generation_summary
AgentOrchestrator (src/lib/agents/AgentOrchestrator.ts)

Composes PlannerAgent, GeneratorAgent, and SummarizerAgent
Passes shared AgentMemory to both agents
Emits typed streaming events to the UI: status, tree_ready, component_ready, done, summary_ready, error
Tool-Calling
Each agent is equipped with tools using the Groq function-calling API:

Agent	Tool	Purpose
PlannerAgent	validate_prd_quality	Returns a structured PRD quality report (score, checks, warnings, next actions)
PlannerAgent	suggest_layout_pattern	Returns structured layout guidance based on app type and page complexity
PlannerAgent	search_component_library	Searches NPM for relevant React libraries and returns top package suggestions
GeneratorAgent	validate_tsx_syntax	Checks generated code has valid structure
GeneratorAgent	check_accessibility	Verifies aria labels and semantic HTML
Memory
AgentMemory (src/lib/agents/AgentMemory.ts)

Session memory — stores PRD analysis, component tree, generated codes, and component library suggestions during a session
Persistent memory — saves PRD history to localStorage (client) and all memory keys to a server-side filesystem store (.memory-store.json)
Shared instance passed to both agents, enabling inter-agent communication
Filesystem Memory Store (src/lib/memory-store.ts)

Persists agent memory on the server in .memory-store.json
Supports writing per-key values and reading full memory snapshots across sessions

## Pipeline Flow
User PRD Input
      │
      ▼
PlannerAgent
  ├── Tool: validate_prd_quality
  ├── Tool: suggest_layout_pattern
  ├── Tool: search_component_library
  ├── Generates ComponentTree (JSON)
  ├── Stores in AgentMemory["library_suggestions"]
  └── Stores in AgentMemory["component_tree"]
      │
      ▼
GeneratorAgent
  ├── Reads ComponentTree from AgentMemory
  ├── For each component:
  │     ├── Tool: validate_tsx_syntax
  │     ├── Tool: check_accessibility
  │     └── Yields { componentId, componentName, code }
  └── Stores each in AgentMemory["code_{id}"]
      │
      ▼
SummarizerAgent
  ├── Reads PRD analysis + component tree + library suggestions from memory
  ├── Produces developer-facing generation summary
  └── Stores in AgentMemory["generation_summary"]
      │
      ▼
Streaming API Route (/api/generate)
      │
      ▼
useGenerate Hook (SSE consumer)
      │
      ▼
3-Panel UI (PRD Editor | Tree View | Code Export)

## Tech Stack
| Technology | Purpose |
| :--- | :--- |
| **Next.js 14 (App Router)** | Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Groq SDK + Llama 3.3 70B** | AI model (free) |
| **Zod** | Schema validation |
| **Monaco Editor** | PRD input editor |
| **Framer Motion** | Animations |
| **React Syntax Highlighter** | Code display |
| **JSZip** | ZIP export |
| **StackBlitz SDK** | Live preview |
| **next-themes** | Dark mode |

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

### 2. Clone the repository

git clone https://github.com/teenujose16/thinkpalm-agentai-teenu-FullAgentPipeline.git
cd spectoui

### 3. Installation
Install the project dependencies in your local terminal:
```bash
npm install
```

### 4. Environment Variables
Create a `.env.local` file in the root of the project with your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```
(See `.env.example` for details).

### 5. Running the Development Server
Start up the local development environment:
```bash
npm run dev
```
Navigate to [http://localhost:3000] to see the application.

### 6 .Generate the first UI
1. Click "Sample" and select "E-commerce" to load a sample PRD
2. Click "Generate UI"
3. Watch the component tree populate in real time
4. Click components in the right panel to view their code
5. Click "Export ZIP" to download all components

## Project Structure

src/
├── app/
│   ├── page.tsx                  # Main 3-panel layout
│   ├── layout.tsx                # Root layout with theme provider
│   └── api/generate/route.ts    # Streaming SSE API route
├── lib/
│   ├── agents/
│   │   ├── AgentMemory.ts       # Session + persistent memory
│   │   ├── PlannerAgent.ts      # PRD → ComponentTree agent
│   │   ├── GeneratorAgent.ts    # ComponentTree → TSX agent
│   │   ├── SummarizerAgent.ts   # Generated output → summary report agent
│   │   └── AgentOrchestrator.ts # Composes planner, generator, summarizer
│   ├── prompts.ts               # All AI prompt functions + sample PRDs
│   └── groq-client.ts           # Groq SDK wrapper with streaming helpers
├── hooks/
│   └── useGenerate.ts           # SSE consumer hook
├── components/
│   ├── PrdEditor/               # Left panel: Monaco editor + file upload
│   ├── ComponentPreview/        # Center panel: Tree view + StackBlitz preview
│   └── CodeExport/              # Right panel: Syntax highlighted code + ZIP export
└── types/
    └── component-tree.ts        # Zod schemas + TypeScript types


## Key Features

Streaming pipeline — see each component generate in real time via Server-Sent Events
Recursive component tree — proper parent-child nesting, not a flat list
Tool-calling agents — agents use function tools to validate and improve output
Post-generation summary — a final report is generated and streamed after code generation
Session + persistent memory — history survives page refresh via localStorage
Server-side persistence — agent memory survives server restarts via filesystem-backed store
Accessible code output — every generated component includes aria labels and semantic HTML
Export options — copy individual components or download full ZIP with index.tsx
Sample PRDs — 3 built-in samples to demo instantly (e-commerce, dashboard, onboarding)
Dark mode — full light/dark support via next-themes
Rate limiting — API route protected with 10 requests/minute per IP
Environment Variables
Variable	Description	Required
GROQ_API_KEY	Your Groq API key from console.groq.com	Yes
How the Prompt Engineering Works
The AI pipeline uses 4 specialized prompts in sequence:

System prompt — establishes the AI as a senior frontend architect
PRD parse prompt — extracts structured data (pages, features, user roles) from free-form text
Component plan prompt — converts parsed PRD into a typed ComponentTree JSON
Component code prompt — generates TSX for each node with TypeScript interfaces, Tailwind classes, and accessibility attributes
Each prompt instructs the model to return only valid JSON or raw TSX — no markdown, no explanation — ensuring reliable parsing.

## Environment Variables
Variable	Description	Required
GROQ_API_KEY	Your Groq API key from console.groq.com	Yes

## How the Prompt Engineering Works
The AI pipeline uses 4 specialized prompts in sequence:

1. System prompt — establishes the AI as a senior frontend architect
2. PRD parse prompt — extracts structured data (pages, features, user roles) from free-form text
3. Component plan prompt — converts parsed PRD into a typed ComponentTree JSON
4. Component code prompt — generates TSX for each node with TypeScript interfaces, Tailwind classes, and accessibility attributes
Each prompt instructs the model to return only valid JSON or raw TSX — no markdown, no explanation — ensuring reliable parsing.

## Demo Video
link:- https://www.loom.com/share/b16ae0b5c365446e8c37f48de3dba02c