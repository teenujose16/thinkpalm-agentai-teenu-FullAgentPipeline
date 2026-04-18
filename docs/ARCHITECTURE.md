# Architecture Documentation

## Overview
This application is powered by an orchestrator managing three distinct AI agents:
- **PlannerAgent**: Formulates the required UI structures and selects library tools.
- **GeneratorAgent**: Produces granular code fragments leveraging LLMs and Tailwind CSS patterns.
- **SummarizerAgent**: Synthesizes a completion report for generated architectures.

### System Flow
1. User provides PRD input on the Next.js UI.
2. The Planner Agent fetches `completionWithTools` and returns a `ComponentTree`.
3. Generator Agent streams TSX components derived from the Tree.
4. Output is rendered via the React preview integration.

*For more details see codebase inside `src/lib/agents`.*
