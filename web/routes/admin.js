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
  const channelQuery = req.query.q;
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
    channelQuery,
  }
  const data = await dao.getPagedVideos(whereClause)
  const videos = data.rows
  videos.forEach((v) => {
    v.pubdate = dayjs(v.publishedAt).format('YYYY-MM-DD HH:mm:ss')
    v.credate = dayjs(v.createdAt).format('YYYY-MM-DD HH:mm:ss')
    v.uri = util.getUri(v.Channel.category, v.Channel.lang)
  })
  const maxVisiblePages = 7
  const totalPages = Math.ceil(data.count / pageSize)
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  const area = category || lang ? `c=${category || ''}&l=${lang || ''}` + '&' : ''
  const channel = channelId ? `channel=${channelId}&` : ''
  const query = channelQuery ? `q=${channelQuery}&` : ''
  res.render('admin/video', {
    videos,
    user: req.user,
    area,
    channel,
    query,
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

// 사용자별 채널 등록 현황
router.get('/admin/user-channels', async function (req, res, next) {
  const userChannels = await dao.getAllUserChannels();
  userChannels.forEach((item) => {
    item.addedDate = dayjs(item.addedAt).format('YYYY-MM-DD HH:mm');
  });
  res.render('admin/user-channels', {
    userChannels,
    user: req.user,
  });
});

// 사용자 통계 관리 페이지
router.get('/admin/stats', async function (req, res, next) {
  const stats = {
    totalUsers: await dao.getUsersCount() || 0,
    totalVideos: await dao.getVideosCount() || 0,
    totalChannels: await dao.getChannelsCount() || 0,
    categoryStats: await dao.getCategoryStats() || []
  }
  
  res.render('admin/stats', {
    user: req.user,
    ...stats
  })
})

// 보안 설정 관리 페이지
router.get('/admin/security', function (req, res, next) {
  // 샘플 데이터
  const securityData = {
    whitelistedIPs: ['127.0.0.1', '192.168.1.100'],
    apiKeys: [
      { id: 1, key: 'sk_live_***************', createdAt: '2024-01-15' },
      { id: 2, key: 'sk_test_***************', createdAt: '2024-02-20' }
    ]
  }
  
  res.render('admin/security', {
    user: req.user,
    ...securityData
  })
})

// 로그 조회 페이지
router.get('/admin/logs', function (req, res, next) {
  const { level, source, start, end } = req.query
  
  // 샘플 로그 데이터
  const sampleLogs = [
    {
      id: 1,
      timestamp: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      level: 'info',
      source: 'api',
      user: 'admin',
      message: 'API 호출 성공: GET /admin/channel'
    },
    {
      id: 2,
      timestamp: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      level: 'warning',
      source: 'auth',
      user: 'user123',
      message: '로그인 실패 시도 감지'
    },
    
  ]
  
  res.render('admin/logs', {
    user: req.user,
    logs: sampleLogs
  })
})

// 시스템 설정 페이지
router.get('/admin/settings', function (req, res, next) {
  res.render('admin/settings', {
    user: req.user,
    process: process
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
