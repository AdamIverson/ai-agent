import express from 'express'
import { runAgent } from './agent'
import { tools } from './tools'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors()) // Enable CORS
app.use(express.json())

app.post('/api/ask', async (req, res) => {
  const { userMessage } = req.body
  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' })
  }

  try {
    const messages = await runAgent({ userMessage, tools })
    res.json(messages)
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