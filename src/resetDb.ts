import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbFilePath = path.join(__dirname, '../db.json')

const resetDb = () => {
  const initialState = {
    messages: []
  }

  fs.writeFileSync(dbFilePath, JSON.stringify(initialState, null, 2))
  console.log('Database has been reset to its initial state.')
}

resetDb()