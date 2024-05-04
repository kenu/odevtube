import { parse } from 'node-html-parser'

async function fetchTranscript(videoId) {
  const PAGE = await fetch('https://www.youtube.com/watch?v=' + videoId)
    .then((res) => res.text())
    .then((html) => parse(html))

  const scripts = PAGE.getElementsByTagName('script')
  const playerScript = scripts.find((script) =>
    script.textContent.includes('var ytInitialPlayerResponse = {')
  )

  const dataString = playerScript.textContent
    ?.split('var ytInitialPlayerResponse = ')?.[1]
    ?.slice(0, -1)
  const data = JSON.parse(dataString.trim())
  const captionsUrl =
    data.captions.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl
  const captionsDefault = captionsUrl.replace('lang=de-DE', 'lang=ko-KR')

  const resXML = await fetch(captionsDefault)
    .then((res) => res.text())
    .then((xml) => parse(xml))

  let transcript = ''
  const chunks = resXML.getElementsByTagName('text')
  for (const chunk of chunks) {
    transcript += chunk.textContent
  }
  return transcript
}

export default fetchTranscript
