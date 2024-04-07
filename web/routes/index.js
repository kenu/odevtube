import express from 'express'
import dayjs from 'dayjs'
import dao from '../../youtubeDao.js'

const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  const list = await dao.findAllYoutube()
  building(list)
  const hashList = ['멍슨상', 'spring', 'rust']
  res.render('index', {
    title: '개발 관련 유튜브',
    list,
    locale: 'ko_KR',
    uri: '',
    hashList,
  })
})

router.get('/en', async function (req, res, next) {
  const list = await dao.findAllYoutube('dev', 'en')
  building(list)
  const hashList = ['tutorial', 'spring', 'rust']
  res.render('index', {
    title: 'YouTube for Developers',
    list,
    locale: 'en_US',
    uri: 'en',
    hashList,
  })
})

router.get('/drama', async function (req, res, next) {
  const list = await dao.findAllYoutube('drama')
  building(list)
  const hashList = ['아파트404', '나빌레라', '선공개']
  res.render('drama', {
    title: '드라마 관련 유튜브',
    list,
    locale: 'ko_KR',
    uri: 'drama',
    hashList,
  })
})

router.get('/food', async function (req, res, next) {
  const list = await dao.findAllYoutube('food')
  building(list)
  const hashList = ['시장', '백종원', '간식']
  res.render('food', {
    title: '요리 관련 유튜브',
    list,
    locale: 'ko_KR',
    uri: 'food',
    hashList,
  })
})

router.get('/kpop', async function (req, res, next) {
  const list = await dao.findAllYoutube('kpop')
  building(list)
  const hashList = ['M/V', '백종원', '간식']
  res.render('kpop', {
    title: 'K-POP YouTube Videos',
    list,
    locale: 'ko_KR',
    uri: 'kpop',
    hashList,
  })
})

function building(list) {
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
    item.profile = item.Channel.dataValues.thumbnail
    item.channame = item.Channel.dataValues.title
    item.customUrl = item.Channel.dataValues.customUrl
    delete item.Channel
  })
}

import fetchTranscript from '../transcript.js'
router.get('/transcript/:videoId', async function (req, res, next) {
  const videoId = req.params.videoId
  try {
    const pattern = /(니다|하죠|네요|세요|어요|고요)\s/g
    let transcript = await fetchTranscript(videoId)
    transcript = transcript.replaceAll(pattern, '$1. ')
    res.json({ text: transcript, videoId })
  } catch (error) {
    res.json({ text: 'Not Available', videoId })
  }
})

export default router
