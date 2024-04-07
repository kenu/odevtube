import express from 'express'
import dayjs from 'dayjs'
import dao from '../../youtubeDao.js'

const router = express.Router()

router.get('/', async function (req, res, next) {
  const uri = 'dev'
  const hashList = ['멍슨상', 'spring', 'rust']
  const title = '개발 관련 유튜브'
  const lang = 'ko'
  await goRenderPage(res, uri, lang, title, hashList)
})

router.get('/en', async function (req, res, next) {
  const uri = 'dev'
  const hashList = ['tutorial', 'spring', 'rust']
  const title = 'YouTube for Developers'
  const lang = 'en'
  await goRenderPage(res, uri, lang, title, hashList)
})

router.get('/drama', async function (req, res, next) {
  const uri = 'drama'
  const hashList = ['아파트404', '나빌레라', '선공개']
  const title = '드라마 관련 유튜브'
  await goRenderPage(res, uri, '', title, hashList)
})

router.get('/food', async function (req, res, next) {
  const uri = 'food'
  const hashList = ['시장', '백종원', '간식']
  const title = '요리 관련 유튜브'
  await goRenderPage(res, uri, '', title, hashList)
})

router.get('/kpop', async function (req, res, next) {
  const uri = 'kpop'
  const hashList = ['M/V', 'Official', 'ILLIT']
  const title = 'K-POP YouTube Videos'
  await goRenderPage(res, uri, '', title, hashList)
})

async function goRenderPage(res, uri, lang, title, hashList) {
  const locale = lang === 'en'? 'en_US' : 'ko_KR'
  const list = await dao.findAllYoutube(uri, lang)
  building(list)
  const flist = list.slice(0, 300)
  res.render('index', {
    title,
    list,
    flist,
    locale,
    uri,
    hashList,
  })
}

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
