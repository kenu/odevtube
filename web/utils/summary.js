import OpenAI from 'openai'

async function summarize(messages) {
  const openai = new OpenAI()
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: 'gpt-4o-mini',
  })

  return completion.choices[0].message.content
}

export default summarize
