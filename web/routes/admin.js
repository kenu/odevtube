import express from 'express'
import dao from '../../youtubeDao.js'
import capi from '../../services/channel.js'
import vapi from '../../services/video.js'
import dayjs from 'dayjs'
import passport from 'passport'
import util from '../utils/uri.js'

const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/admin', async function (req, res, next) {
  const channelId = req.query.channel;
  const category = req.query.c
  const lang = req.query.l
  let page = +req.query.p
  if (!page) {
    page = 1
  }
  const pageSize = 60
  const whereClause = {
    category,
    lang,
    page,
    pageSize: pageSize,
    channelId,
  }
  const data = await dao.getPagedVideos(whereClause)
  const videos = data.rows
  videos.forEach((v) => {
    v.pubdate = dayjs(v.publishedAt).format('MM-DD HH:mm:ss')
    v.credate = dayjs(v.createdAt).format('MM-DD HH:mm:ss')
    v.uri = util.getUri(v.Channel.category, v.Channel.lang)
  })
  const maxVisiblePages = 7
  const totalPages = Math.ceil(data.count / pageSize)
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  const area = `c=${category || 'dev'}&l=${lang || 'ko'}` + '&'
  const channel = channelId ? `channel=${channelId}&` : ''
  res.render('admin/video', {
    videos,
    user: req.user,
    area,
    channel,
    currentPage: page,
    totalPages,
    startPage,
    endPage,
    maxVisiblePages,
  })
})
router.get('/admin/channel', async function (req, res, next) {
  const channelList = await dao.findAllChannelList()
  channelList.forEach((item) => {
    item.credate = dayjs(item.createdAt).format('MM-DD')
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
    item.uri = util.getUri(item.category, item.lang)
  })
  res.render('admin/channel', {
    channels: channelList,
    user: req.user,
  })
})

router.delete('/api/video', auth, async function (req, res, next) {
  const videoId = req.headers.videoid
  const result = await vapi.remove(videoId)
  res.json(result)
})

router.post('/api/channel', async function (req, res, next) {
  const channelId = req.body.channelId
  let channel
  if (channelId.indexOf('@') === 0) {
    channel = await capi.findChannelInfo(channelId)
  } else {
    channel = await capi.getChannelInfo(channelId)
  }
  channel = {
    ...req.body,
    ...channel,
  }

  const result = await dao.create(channel)
  await addVideos(channel.channelId)
  res.json(result.dataValues)
})

async function addVideos(channelId) {
  const videos = await vapi.getLatestVideos(channelId)
  await videos
    .map((item) => item.channelId)
    .forEach(async (channelId) => {
      vapi.addVideos(channelId)
    })
}

function auth(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

export default router
