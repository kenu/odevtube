const fetchTranscript = require('../web/transcript.js')

test('', async() => {
  const videoId = 'u3j6IH5PFrE'
  const transcript = await fetchTranscript(videoId)
  console.log(transcript)
})
