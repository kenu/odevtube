import express from 'express'
import dayjs from 'dayjs'
import passport from 'passport'
import dao from '../../youtubeDao.js'

const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/en', async function (req, res, next) {
  const uri = 'dev'
  const title = 'YouTube for Developers'
  const hashList = ['tutorial', 'spring', 'rust']
  const lang = 'en'
  const isApi = req.query.a === '1'
  await goRenderPage(req, res, uri, lang, title, hashList, isApi)
})

router.get('/drama', async function (req, res, next) {
  const uri = 'drama'
  const title = '드라마 관련 유튜브'
  const hashList = ['아파트404', '나빌레라', '선공개']
  const isApi = req.query.a === '1'
  await goRenderPage(req, res, uri, '', title, hashList, isApi)
})

router.get('/food', async function (req, res, next) {
  const uri = 'food'
  const title = '요리 관련 유튜브'
  const hashList = ['시장', '백종원', '간식']
  const isApi = req.query.a === '1'
  await goRenderPage(req, res, uri, '', title, hashList, isApi)
})

router.get('/kpop', async function (req, res, next) {
  const uri = 'kpop'
  const title = 'K-POP YouTube Videos'
  const hashList = ['M/V', 'Official', 'ILLIT', 'BTS']
  const isApi = req.query.a === '1'
  await goRenderPage(req, res, uri, '', title, hashList, isApi)
})

async function goRenderPage(req, res, uri, lang, title, hashList, isApi = false) {
  const locale = lang === 'en' ? 'en_US' : 'ko_KR'
  const list = await dao.findAllYoutube(uri, lang)
  const user = req.user
  console.log(user)
  building(list)
  if (isApi) {
    res.json(list)
  } else {
    res.render('index', {
      title,
      list,
      flist: list.slice(0, 1000),
      locale,
      uri,
      hashList,
      user,
    })
  }
}

function building(list) {
  list.forEach((item) => {
    item.pubdate = dayjs(item.publishedAt).format('YYYY-MM-DD')
    item.profile = item.Channel.dataValues.thumbnail
    item.channame = item.Channel.dataValues.title
    item.customUrl = item.Channel.dataValues.customUrl
    delete item.dataValues.Channel
    delete item.dataValues.ChannelId
    delete item.dataValues.createdAt
    delete item.dataValues.updatedAt
  })
}

import fetchTranscript from '../transcript.js'
router.get('/transcript/:videoId', async function (req, res, next) {
  const videoId = req.params.videoId
  // find by videoId
  const item = await dao.findTranscriptByVideoId(videoId)
  if (item) {
    res.json({ text: item.content, videoId })
    return
  }
  // if empty get from youtube web
  // save with videoId
  try {
    const pattern = /(니다|하죠|네요|세요|어요|고요)\s/g
    let transcript = await fetchTranscript(videoId)
    transcript = transcript.replaceAll(pattern, '$1. ')
    await dao.createTranscript({
      videoId,
      content: transcript,
    })
    res.json({ text: transcript, videoId })
  } catch (error) {
    res.json({ text: 'Not Available', videoId })
  }
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.get('/login/github', passport.authenticate('github'))

router.get(
  '/login/github/return',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (_req, res) {
    res.redirect('/')
  }
)
router.get('/home', function (req, res) {
  console.log(req.user)
  res.render('home', { user: req.user })
})

import connectEnsureLogin from 'connect-ensure-login'
router.get('/profile', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
  res.render('profile', { user: req.user })
})

router.get('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

router.get('/', async function (req, res, next) {
  const uri = 'dev'
  const title = '개발 관련 유튜브'
  const hashList = ['멍슨상', 'spring', 'rust']
  const isApi = req.query.a === '1'
  await goRenderPage(req, res, uri, '', title, hashList, isApi)
})

export default router
