import OpenAI from 'openai'

async function summarize(messages) {
  const openai = new OpenAI()
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-3.5-turbo',
  })

  return completion.choices
}

export default summarize
