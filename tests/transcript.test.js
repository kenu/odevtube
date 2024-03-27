const { YoutubeTranscript } = require('youtube-transcript')

const videoId = 'u3j6IH5PFrE'
YoutubeTranscript.fetchTranscript(videoId).then((d) => {
  const textList = d.map((item) => item.text)
  console.log(textList.join(' '))
})
