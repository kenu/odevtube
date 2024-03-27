import express from 'express'
import dayjs from 'dayjs'
import dao from '../../youtubeDao.js'

const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  const list = await dao.findAllYoutube()
  building(list)
  res.render('index', { title: '개발 관련 유튜브', list, locale: 'ko_KR', uri: '' })
})

router.get('/en', async function (req, res, next) {
  const list = await dao.findAllYoutube('dev', 'en')
  building(list)
  res.render('index', { title: 'YouTube for Developers', list, locale: 'en_US', uri: 'en' })
})

router.get('/drama', async function (req, res, next) {
  const list = await dao.findAllYoutube('drama')
  building(list)
  res.render('drama', { title: '드라마 관련 유튜브', list, locale: 'ko_KR', uri: 'drama' })
})

router.get('/food', async function (req, res, next) {
  const list = await dao.findAllYoutube('food')
  building(list)
  res.render('food', { title: '요리 관련 유튜브', list, locale: 'ko_KR', uri: 'food' })
})

export default router
function building(list) {
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
    item.profile = item.Channel.dataValues.thumbnail
    item.channame = item.Channel.dataValues.title
    item.customUrl = item.Channel.dataValues.customUrl
    delete item.Channel
  })
}
