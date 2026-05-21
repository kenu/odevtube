import transcriptDao from '../dao/transcriptDao'
import videoDao from '../dao/videoDao'
import channelDao from '../dao/channelDao'
/*
 find by videoId
 if empty get from youtube
 save with videoId
 */

const videoId = 'cWn3WjTdpMw'
test('find by videoId', async () => {
  const transcript = await transcriptDao.findTranscriptByVideoId(videoId)
  expect(transcript).toBeNull()
  await transcriptDao.removeTranscript(videoId)
})

test('save with videoId', async () => {
  const data = {
    videoId: videoId,
    content: 'test1',
  }
  const result = await transcriptDao.createTranscript(data)
  expect(result).not.toBeNull()
  const resultnull = await transcriptDao.createTranscript({})
  expect(resultnull).toBeUndefined()
})

afterEach(async () => {
  return await transcriptDao.removeTranscript(videoId)
})

test('newList', async () => {
  const newList = await videoDao.newList()
  expect(newList).not.toBeNull()
  expect(newList.length).toBe(0)
})

test('findOneByChannelId', async () => {
  const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
  const channel = await channelDao.findOneByChannelId(channelId)
  expect(channel).toBeNull()
})

test('findAndCountAllVideo', async () => {
  const result = await videoDao.findAndCountAllVideo()
  expect(result).not.toBeNull()
  expect(result.count).not.toBe(0)
})
