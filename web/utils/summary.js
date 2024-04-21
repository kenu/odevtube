import OpenAI from 'openai'

const openai = new OpenAI()

async function summarize(messages) {
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-3.5-turbo',
  })

  return completion.choices
}

export default summarize
