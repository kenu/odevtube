import channelDao from '../dao/channelDao.js'
import vapi from '../services/video.js'

;(async () => {
  const list = await channelDao.findAllChannelList(914)
  list.map((item) => item.channelId).forEach(vapi.addVideos)
})()
