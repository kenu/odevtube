import express from 'express'
import dao from '../../youtubeDao.js'
import dayjs from 'dayjs'
import passport from 'passport'

const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/admin', auth, async function (req, res, next) {
  const category = req.query.c
  const lang = req.query.l
  let page = +req.query.p
  if (!page) {
    page = 1
  }
  const pageSize = 30
  const data = await dao.getPagedYoutubes({
    category,
    lang,
    page,
    pageSize: pageSize,
  })
  const videos = data.rows
  videos.forEach((v) => {
    v.pubdate = dayjs(v.publishedAt).format('MM-DD HH:mm:ss')
    v.credate = dayjs(v.createdAt).format('MM-DD HH:mm:ss')
  })
  const maxVisiblePages = 7
  const totalPages = Math.ceil(data.count / pageSize)
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  const area = `c=${category || 'dev'}&l=${lang || 'ko'}` + '&';
  res.render('admin/video', {
    videos,
    user: req.user,
    area,
    currentPage: page,
    totalPages,
    startPage,
    endPage,
    maxVisiblePages,
  })
})
router.get('/admin/channel', auth, async function (req, res, next) {
  const channelList = await dao.findAllChannelList()
  channelList.forEach((item) => {
    item.credate = dayjs(item.createdAt).format('MM-DD')
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
  })
  res.render('admin/channel', {
    channels: channelList,
    user: req.user,
  })
})

function auth(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

export default router
