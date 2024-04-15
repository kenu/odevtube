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
  const resultnull = await dao.createTranscript({})
  expect(resultnull).toBeUndefined()
})

afterEach(async () => {
  return await dao.removeTranscript(videoId);
});

test('newList', async () => {
  const newList = await dao.newList()
  expect(newList).not.toBeNull()
  expect(newList.length).toBe(0)
})

test('findOneByChannelId', async () => {
  const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
  const channel = await dao.findOneByChannelId(channelId)
  expect(channel).toBeNull()
})

test('findAndCountAllYoutube', async () => {
  const result = await dao.findAndCountAllYoutube()
  expect(result).not.toBeNull()
  expect(result.count).not.toBe(0)
})
