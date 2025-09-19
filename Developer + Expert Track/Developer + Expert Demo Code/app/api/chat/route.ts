import { openai } from '@ai-sdk/openai'
import { generateText, convertToCoreMessages } from 'ai'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Fallback echo if API key missing
    if (!process.env.OPENAI_API_KEY) {
      const last: unknown = Array.isArray(messages) ? messages[messages.length - 1] : null
      const parts = (last as { parts?: Array<{ type?: string; text?: string }> } | null)?.parts || []
      const text = (parts.find((p) => p?.type === 'text')?.text as string | undefined) || 'Hello!'
      return new Response(`Echo: ${text}`, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    // Load business context from docs (trim to keep prompt small)
    let docsContext = ''
    try {
      const businessLogicPath = resolve(process.cwd(), 'docs/specs/business-logic/BUSINESS-LOGIC.md')
      const prdPath = resolve(process.cwd(), 'docs/PRD.md')
      const [businessLogic, prd] = await Promise.all([
        readFile(businessLogicPath, 'utf8').catch(() => ''),
        readFile(prdPath, 'utf8').catch(() => ''),
      ])
      const combined = `BUSINESS-LOGIC.md\n\n${businessLogic}\n\nPRD.md\n\n${prd}`
      // Hard trim to ~20k chars to avoid excessive tokens
      docsContext = combined.slice(0, 20000)
    } catch {
      docsContext = ''
    }

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are the SkyMarket Business Assistant.

Stick to answering questions about SkyMarket's business using the docs below as reference, or relate it to the docs. If the question is outside that business scope (e.g., general programming help, unrelated topics, or low-level implementation details), politely refuse with: "Out of scope: I can only discuss SkyMarket business."

When answering:
- Ground responses in the Detroit service area constraints, the four service categories (food_delivery, courier, aerial_imaging, site_mapping), booking lifecycle and status rules, pricing and platform fees, roles and permissions, compliance requirements, and policies described in the docs.
- Keep answers concise, factual, and policy- or process-oriented. Avoid code, APIs, or infrastructure specifics unless they clarify a business policy.
- If the docs do not specify an answer, say "Not specified in docs" and, if helpful, suggest what decision points the business should define.
- Do not provide legal advice or safety guidance beyond what is stated in the docs.

Scope guidance:
- Treat any question that mentions "SkyMarket" or clearly refers to the platform, its services, categories, users, pricing, policies, or operations as in-scope. Do not refuse such queries.
- If the scope is ambiguous, ask a brief clarifying question instead of refusing.
- Only refuse if the request is clearly unrelated to SkyMarket's business.

Your tone is professional and neutral; prefer short paragraphs or bullet points. Typically 1-2 sentences. Unless it's a question that requires more detail, then you can go into more detail.

Context (verbatim excerpts from docs):\n---\n${docsContext}\n---`,
      messages: convertToCoreMessages(messages),
    })

    return new Response(result.text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(`Error: ${message}`, { status: 500 })
  }
}


