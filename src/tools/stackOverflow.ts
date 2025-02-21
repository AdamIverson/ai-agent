import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

export const stackOverflowToolDefinition = {
  name: 'stack_overflow',
  parameters: z.object({
    prompt: z.string().describe('The prompt used to make inquiries specific to software engineering'),
    query: z.string(),
    apiKey: z.string(),
  }).describe('Searches Stack Overflow for the most relevant question based on the query'),
}

type Args = z.infer<typeof stackOverflowToolDefinition.parameters>

export const stackOverflow: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { query, apiKey } = toolArgs
  const res = await fetch(`https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&tagged=typescript&site=stackoverflow&q=${encodeURIComponent(query)}&key=${apiKey}`, {
    headers: {
      Accept: 'application/json',
    },
  })
  const data = await res.json()
  if (data.items && data.items.length > 0) {
    return data.items[0].title
  } else {
    return 'No results found'
  }
}
