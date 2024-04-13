import dao from '../youtubeDao'
/*
 find by videoId
 if empty get from youtube
 save with videoId
 */

const videoId = 'cWn3WjTdpMw'
test('find by videoId', async () => {
  const transcript = await dao.findTranscriptByVideoId(videoId)
  expect(transcript).toBeNull()
  await dao.removeTranscript(videoId)
})

test('save with videoId', async () => {
  const data = {
    videoId: videoId,
    content: 'test1',
  }
  const result = await dao.createTranscript(data)
  expect(result).not.toBeNull()
})

afterEach(async () => {
  return await dao.removeTranscript(videoId);
});
