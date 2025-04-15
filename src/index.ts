import fs from 'node:fs'
import process from 'node:process'
import Anthropic from '@anthropic-ai/sdk'
import { Command } from 'commander'
import dotenv from 'dotenv'
import { description, name, version } from '../package.json'

dotenv.config()

const program = new Command()

program
  .name(name)
  .description(description)
  .version(version)
  .option('-f, --file <path>', 'Path to input file')
  .option(
    '-m, --model <alias>',
    'Model alias: sonnet | haiku | opus | sonnet35 | haiku35 | sonnet35v2',
    'sonnet',
  )

program.parse(process.argv)
const options = program.opts()

const modelAliases: Record<string, string> = {
  sonnet: 'claude-3-7-sonnet-20250219',
  haiku: 'claude-3-haiku@20240307',
  opus: 'claude-3-opus@20240229',
  haiku35: 'claude-3-5-haiku@20241022',
  sonnet35: 'claude-3-5-sonnet@20240620',
  sonnet35v2: 'claude-3-5-sonnet-v2@20241022',
}

const alias = options.model.toLowerCase()

if (!(alias in modelAliases)) {
  process.stderr.write(`Unknown model alias: ${alias}\n`)
  process.stderr.write(`→ Available: ${Object.keys(modelAliases).join(', ')}\n`)
  process.exit(1)
}

const modelId = modelAliases[alias]

async function readInput(file?: string): Promise<string> {
  if (file) {
    return fs.promises.readFile(file, 'utf-8')
  }

  if (process.stdin.isTTY) {
    process.stderr.write('No input provided. Use --file or pipe data to stdin.\n')
    process.exit(1)
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
    model: modelId,
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
