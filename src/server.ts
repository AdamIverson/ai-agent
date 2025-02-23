import express from 'express'
import { runAgent } from './agent'
import { tools } from './tools'
import dotenv from 'dotenv'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Use JSON file for storage
const adapter = new JSONFile<DatabaseSchema>('db.json')
interface DatabaseSchema {
  messages: { role: string, content: string, id: string, createdAt: string }[]
}

const db = new Low<DatabaseSchema>(adapter, { messages: [] })

// Read data from JSON file, this will set db.data content
await db.read()

// If db.json doesn't exist, db.data will be null
// Set default data
db.data ||= { messages: [] }

app.use(cors()) // Enable CORS
app.use(express.json())

app.get('/api/messages', (req, res) => {
  const messages = db.data?.messages || []
  res.json(messages)
})

app.post('/api/ask', async (req, res) => {
  const { userMessage } = req.body
  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' })
  }

  try {
    const agentResponse = await runAgent({ userMessage, tools })
    const userMessageEntry = { role: 'user', content: userMessage, id: uuidv4(), createdAt: new Date().toISOString() }
    const assistantMessageEntry = { role: 'assistant', content: agentResponse, id: uuidv4(), createdAt: new Date().toISOString() }
    db.data.messages.push(userMessageEntry)
    db.data.messages.push(assistantMessageEntry)
    await db.write()
    res.json(assistantMessageEntry) // Return only the assistant's message content
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})