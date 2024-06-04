import { parse } from 'node-html-parser'

async function fetchTranscript(videoId) {
  const videoPageHtml = await fetchHtml(
    `https://www.youtube.com/watch?v=${videoId}`
  )
  const playerScript = findPlayerScript(videoPageHtml)
  const captionsUrl = extractCaptionsUrl(playerScript)
  const captionsXml = await fetchXml(
    captionsUrl.replace('lang=de-DE', 'lang=ko-KR')
  )
  const transcript = extractTranscriptFromXml(captionsXml)
  return transcript
}

async function fetchHtml(url) {
  const response = await fetch(url)
  const html = await response.text()
  return parse(html)
}

function findPlayerScript(html) {
  const scripts = html.getElementsByTagName('script')
  return scripts.find((script) =>
    script.textContent.includes('var ytInitialPlayerResponse = {')
  )
}

function extractCaptionsUrl(playerScript) {
  const dataString = playerScript.textContent
    ?.split('var ytInitialPlayerResponse = ')?.[1]
    ?.slice(0, -1)
  const data = JSON.parse(dataString.trim())
  return data.captions.playerCaptionsTracklistRenderer.captionTracks[0].baseUrl
}

async function fetchXml(url) {
  const response = await fetch(url)
  const xml = await response.text()
  return parse(xml)
}

function extractTranscriptFromXml(xml) {
  const chunks = xml.getElementsByTagName('text')
  return Array.from(chunks).reduce(
    (transcript, chunk) => transcript + chunk.textContent,
    ''
  )
}

export default fetchTranscript
