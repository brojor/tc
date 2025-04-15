# tc – Token Counter CLI for Claude

**tc** is a lightweight CLI tool that counts tokens in your input using [Anthropic Claude](https://www.anthropic.com/) models.
Inspired by the classic Unix tool `wc`, but for LLM prompts.

---

## ✨ Features

- 🔢 Counts tokens using Claude 3 models
- 📂 Supports both file input and stdin
- 🧱 Outputs **only the token number** (stdout)
- 📤 Prints errors to **stderr**
- 🎯 Supports multiple models via short aliases
- 🧑‍💻 Written in TypeScript

---

## 🚀 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourname/tc.git
cd tc
npm install
```

To make the command globally available:

```bash
npm link
```

You can now use `tc` anywhere in your terminal.

---

## 🔐 Setup

You need an [Anthropic API key](https://www.anthropic.com/).
Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Or export it:

```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

---

## 🧪 Usage

### From a file

```bash
tc --file prompt.md
```

### From stdin

```bash
cat prompt.md | tc
```

### Specify model

```bash
tc --file prompt.md --model haiku
tc --model opus < input.txt
```

---

## 🧠 Supported Model Aliases

| Alias        | Claude Model ID                     |
|--------------|-------------------------------------|
| `sonnet`     | `claude-3-7-sonnet-20250219`        |
| `haiku`      | `claude-3-haiku@20240307`           |
| `opus`       | `claude-3-opus@20240229`            |
| `haiku35`    | `claude-3-5-haiku@20241022`         |
| `sonnet35`   | `claude-3-5-sonnet@20240620`        |
| `sonnet35v2` | `claude-3-5-sonnet-v2@20241022`     |

Default model: `sonnet`

---

## 📤 Output

Only the number of tokens is printed to stdout:

```bash
$ tc --file input.md
847
```

Errors and help messages go to stderr:

```bash
❌ Unknown model alias: snafu
   Available: sonnet, haiku, opus, sonnet35, haiku35, sonnet35v2
```

---

## 📦 Development

Run with ts-node:

```bash
npx ts-node tc.ts --file input.md
```

Build:

```bash
npm run build
node dist/tc.js -f input.md
```

---

## 🛠 License

ISC © BroJor

---

## 💡 Inspiration

Built for developers who want to work closely with large language models and need precise token control.
Inspired by `wc`, but LLM-native.
