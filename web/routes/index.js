import express from 'express'
import dayjs from 'dayjs'
import dao from '../../youtubeDao.js'

const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  const list = await dao.findAllYoutube()
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
    item.profile = item.Channel.dataValues.thumbnail
    item.channame = item.Channel.dataValues.title
    item.customUrl = item.Channel.dataValues.customUrl
    delete item.Channel
  })
  res.render('index', { title: '개발 관련 유튜브', list })
})

/* GET home page. */
router.get('/en', async function (req, res, next) {
  const list = await dao.findAllYoutube('en')
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
  })
  res.render('indexen', { title: 'YouTube for Developers', list })
})

export default router
