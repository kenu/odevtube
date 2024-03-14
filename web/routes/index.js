import express from 'express'
import dayjs from 'dayjs'
import dao from '../../youtubeDao.js'

const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  const list = await dao.findAll()
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
  })
  res.render('index', { title: '개발 관련 유튜브', list })
})

/* GET home page. */
router.get('/en', async function (req, res, next) {
  const list = await dao.findAllen()
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
  })
  res.render('indexen', { title: 'YouTube for Developers', list })
})

export default router
