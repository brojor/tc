import fs from 'node:fs'
import process from 'node:process'
import Anthropic from '@anthropic-ai/sdk'
import { Command } from 'commander'
import dotenv from 'dotenv'

dotenv.config()

const program = new Command()

program
  .name('tc')
  .description('Count tokens in a file or from stdin using Anthropic Claude models')
  .version('1.0.0')
  .option('-f, --file <path>', 'Path to input file')

program.parse(process.argv)

const options = program.opts()

async function readInput(file?: string): Promise<string> {
  if (file) {
    return fs.promises.readFile(file, 'utf-8')
  }

  return new Promise((resolve, reject) => {
    let data = ''
    process.stdin.setEncoding('utf-8')
    process.stdin.on('data', chunk => (data += chunk))
    process.stdin.on('end', () => resolve(data))
    process.stdin.on('error', reject)
  })
}

async function countTokens(text: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const result = await client.beta.messages.countTokens({
    model: 'claude-3-7-sonnet-20250219',
    messages: [{ role: 'user', content: text }],
  })

  process.stdout.write(`${result.input_tokens.toString()}\n`)
}

readInput(options.file)
  .then(countTokens)
  .catch((err) => {
    process.stderr.write(`Error: ${err.message}\n`)
    process.exit(1)
  })
