import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from 'node-fetch'

const CORE_API_KEY = process.env.CORE_API_KEY || 'your-default-api-key'

export const coreToolDefinition = {
  name: 'core',
  parameters: z.object({
    query: z.string(),
    apiKey: z.string(),
  }),
}

type Args = z.infer<typeof coreToolDefinition.parameters>

export const core: ToolFn<Args, string> = async ({ toolArgs }) => {
  const { query, apiKey } = toolArgs
  const res = await fetch(`https://api.core.ac.uk/v3/recommend`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey || CORE_API_KEY}`
    },
    body: JSON.stringify({
      doi: "",
      title: query,
      year: 1970,
      eprints_id: "",
      plugin_id: "",
      referrer: ""
    })
  })
  const data = await res.json()
  if (data.items && data.items.length > 0) {
    return data.items[0].title
  } else {
    return 'No results found'
  }
}
