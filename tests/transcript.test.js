import fetchTranscript from '../web/utils/transcript.js'

test('', async() => {
  const videoId = 'ulqHnefBFMM'
  const transcript = await fetchTranscript(videoId)
  expect(transcript).not.toBeNull()
})
