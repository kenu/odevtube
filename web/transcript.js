const { YoutubeTranscript } = require('youtube-transcript')

async function fetchTranscript(videoId) {
  const response = await YoutubeTranscript.fetchTranscript(videoId)
  const textList = response.map((item) => item.text)
  return textList.join(' ')
}

module.exports = fetchTranscript
module.exports.fetchTranscript = fetchTranscript
module.exports.default = fetchTranscript
