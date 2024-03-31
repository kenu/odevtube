const fetchTranscript = require('./transcript.js')

test('', async() => {
  const videoId = '4Z8qAzlnue8'
  const transcript = await fetchTranscript(videoId)
  console.log(transcript)
})
