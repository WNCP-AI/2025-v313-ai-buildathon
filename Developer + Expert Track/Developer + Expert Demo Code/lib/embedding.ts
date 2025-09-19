import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function createEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.textEmbeddingModel('text-embedding-3-small'),
    value: text,
  })
  return embedding
}


