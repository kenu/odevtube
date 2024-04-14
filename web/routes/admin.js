import express from 'express'
import dao from '../../youtubeDao.js'
import dayjs from 'dayjs'

const router = express.Router()

router.get('/admin', auth, async function (req, res, next) {
  const data = await dao.findAndCountAllYoutube()
  const videos = data.rows
  videos.forEach(v => {
    v.pubdate = dayjs(v.publishedAt).format('MM-DD HH:mm:ss')
    v.credate = dayjs(v.createdAt).format('MM-DD HH:mm:ss')
  })
  res.render('admin/video', {videos})
})

function auth(req, res, next) {
  if (req.query.a === '1') {
    next()
  } else {
    res.end('not admin')
  }
}

export default router
