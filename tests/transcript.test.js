import { YoutubeTranscript } from "youtube-transcript";

const videoId = "vSIb2sPdu9U";
test("getTextOnly", async () => {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  expect(transcript).not.toBeNull();
  const fullText = getTextOnly(transcript);
  expect(fullText).toContain("인데");
});

function getTextOnly(transcript) {
  return transcript.map((item) => item.text).join(" ");
}

test('remove [Object, Object]', async () => {
  const pattern = /(니다|하죠|하겠죠|고요|까요|네요|데요|세요|아요|어요)\s/g
  const transcript = await YoutubeTranscript.fetchTranscript(videoId)
  let fullText = transcript.map((item) => item.text).join(' ')
  fullText = fullText.replaceAll(pattern, '$1. ')
  expect(fullText).not.toContain('Object')
});
