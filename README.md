# V313 2025 AI Buildathon Learning Hub

Welcome to the Venture313 AI Buildathon 2025 Learning Hub. This repository brings together track instructions, demo code, and resources to help you build SkyMarket – a Detroit-focused drone and delivery services marketplace – using AI-assisted workflows.

Use this README to choose your track, set up quickly, and navigate all materials.

## Tracks at a Glance

- Beginner Track (2 hours): No-code/low-code build using Lovable. Follow step-by-step prompts to ship an MVP fast.
- Developer Track (12–16 hours): Spec-driven development with Next.js, Supabase, and Cursor + Context7.
- Expert Track (8–12 hours): Advanced AI patterns, Vercel AI SDK, tool calling, streaming, and architecture.

## Repository Map

- Beginner
  - Instructions: `Beginner Track/Beginner Track Instuctions/`
    - Start here: [README](./Beginner%20Track/Beginner%20Track%20Instuctions/README.md)
    - Step-by-step: `step-by-step/` within that folder
    - Build guide and troubleshooting in `instructions/`
    - Knowledge base and specs in `doc/`
  - Demo Code: `Beginner Track/Beginner Track Demo Code/`
    - Project overview and setup: [README](./Beginner%20Track/Beginner%20Track%20Demo%20Code/README.md)

- Developer + Expert
  - Demo Code (Next.js + Supabase): `Developer + Expert Track/Developer + Expert Demo Code/`
    - Project README: [README](./Developer%20+%20Expert%20Track/Developer%20+%20Expert%20Demo%20Code/README.md)
  - Developer Track Instructions (Spec-driven): `Developer + Expert Track/Developer Track Instructions/`
    - Start here: [README](./Developer%20+%20Expert%20Track/Developer%20Track%20Instructions/README.md)
    - Steps: `steps/`
    - Prereqs: `prerequisites.md`, Resources: `resources.md`
  - Expert Track Instruction (AI integration): `Developer + Expert Track/Expert Track Instruction/`
    - Start here: [README](./Developer%20+%20Expert%20Track/Expert%20Track%20Instruction/README.md)
    - Steps: `steps/`

- General Resources
  - YouTube Tutorials: `General Resources/youtube-tutorials/`

For the subtree architecture and how these folders sync with upstream repos, see `PLAN.md`.

## Quick Start – Pick Your Path

1) Beginner (2 hours, no/low code)
- Read: [Beginner Track Instructions README](./Beginner%20Track/Beginner%20Track%20Instuctions/README.md)
- Follow the sequence in `step-by-step/`
- Use the beginner demo code only if needed for reference

2) Developer (12–16 hours)
- Read: [Developer Track Instructions README](./Developer%20+%20Expert%20Track/Developer%20Track%20Instructions/README.md)
- Open the demo code: [Next.js + Supabase README](./Developer%20+%20Expert%20Track/Developer%20+%20Expert%20Demo%20Code/README.md)
- Work through `steps/` with Cursor IDE + Context7

3) Expert (8–12 hours)
- Read: [Expert Track README](./Developer%20+%20Expert%20Track/Expert%20Track%20Instruction/README.md)
- Focus on AI SDK, tool calling, streaming, and production patterns

## Environment & Accounts

Recommended before starting:
- Git and GitHub
- Node.js LTS (18+) for developer/expert demo code
- Supabase account (database, auth)
- Vercel account (deployment)
- Optional: OpenAI and Resend (expert/dev features)

## Running the Demo Code

- Beginner Demo Code
  - See its [README](./Beginner%20Track/Beginner%20Track%20Demo%20Code/README.md) for project details
  - Typical flow: install dependencies and start dev server as instructed inside

- Developer + Expert Demo Code (Next.js)
  - See its [README](./Developer%20+%20Expert%20Track/Developer%20+%20Expert%20Demo%20Code/README.md) for complete setup
  - Common commands:
    ```bash
    npm install
    npm run dev
    ```

## How to Use the Instructions

- Beginner: follow the `step-by-step/` sequence exactly; copy prompts verbatim
- Developer: load specs into Cursor + use Context7; implement per `steps/`
- Expert: analyze existing AI patterns, then extend using the guided steps

## Updating Subtrees (Maintainers)

This hub pulls content from upstream repositories using git subtrees. See `PLAN.md` for exact commands:
- Root-mapped: Beginner Instructions (full), Beginner Demo, Dev+Expert Demo
- Subpath-mapped (split-based):
  - `skymarket-instructions` → `tracks/developer`, `tracks/expert`
  - `tutorial-wncp-ai-beginner-skymarket` → `resources`

## Support During the Buildathon

- Use the troubleshooting docs inside each track
- Ask mentors for help aligning to track goals and timeboxes
- Prioritize finishing core flows before enhancements

Good luck, and have fun building SkyMarket at the Venture313 AI Buildathon!


