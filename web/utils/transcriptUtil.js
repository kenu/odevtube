import { YoutubeTranscript } from "youtube-transcript";

async function getFullText(videoId) {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  const fullText = transcript.map((item) => item.text).join(" ");
  const pattern = /(니다|이죠|하죠|하겠죠|고요|까요|네요|데요|세요|에요|아요|어요)\s/g
  return fullText.replace(pattern, "$1. ");
}

export { getFullText };
