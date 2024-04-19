// 채널 목록
import dayjs from 'dayjs'
import dao from '../youtubeDao'

test('채널 목록 조회', async () => {
  const channelList = await dao.findAllChannelList()
  expect(channelList).not.toBeNull()
  expect(channelList.length).not.toBe(0)
})

test('최근 업데이트 목록', async () => {
  const channelList = await dao.findAllChannelList(7)
  console.log(channelList.length)
  expect(channelList).not.toBeNull()
  expect(channelList.length).not.toBe(0)
})
