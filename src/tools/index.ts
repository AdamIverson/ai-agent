import { coreToolDefinition } from './core'
import { generateImageToolDefinition } from './generateImage'
import { redditToolDefinition } from './reddit'
import { stackOverflowToolDefinition } from './stackOverflow'

export const tools = [
  generateImageToolDefinition,
  redditToolDefinition,
  stackOverflowToolDefinition,
  coreToolDefinition
]
