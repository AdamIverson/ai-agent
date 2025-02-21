import type OpenAI from 'openai'
import { generateImage } from './tools/generateImage'
import { reddit } from './tools/reddit'
import { stackOverflow } from './tools/stackOverflow'
import { core } from './tools/core'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments),
  }
  switch (toolCall.function.name) {
    case 'generate_image':
      const image = await generateImage(input)
      return image

    case 'reddit':
      return reddit(input)

    case 'stack_overflow':
      return stackOverflow(input)

    case 'core':
      return core(input)

    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
