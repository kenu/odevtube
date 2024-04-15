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
  const data = await dao.findAndCountAllYoutube(category, lang)
  const videos = data.rows
  videos.forEach(v => {
    v.pubdate = dayjs(v.publishedAt).format('MM-DD HH:mm:ss')
    v.credate = dayjs(v.createdAt).format('MM-DD HH:mm:ss')
  })
  res.render('admin/video', {videos, user: req.user})
})

function auth(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

export default router
