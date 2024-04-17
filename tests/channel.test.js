// 채널 목록
import dao from '../youtubeDao'

test('채널 목록 조회', () => {
  const channelList = dao.findAllChannelList()
  expect(channelList).not.toBeNull()
  expect(channelList.length).not.toBe(0)
})

