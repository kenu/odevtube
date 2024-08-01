import dao from '../youtubeDao.js'
import vapi from '../services/video.js'

;(async () => {
  const list = await dao.findAllChannelList(2914)
  list.map((item) => item.channelId).forEach(vapi.addVideos)
})()
