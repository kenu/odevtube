import { YoutubeTranscript } from 'youtube-transcript'

async function fetchTranscript(videoId) {
  const response = await YoutubeTranscript.fetchTranscript(videoId)
  const textList = response.map((item) => item.text)
  return textList.join(' ')
}

fetchTranscript()
