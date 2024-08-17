import express from 'express'
import dayjs from 'dayjs'
import passport from 'passport'
import { YoutubeTranscript } from 'youtube-transcript'
import dao from '../../youtubeDao.js'

const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/', async function (req, res, next) {
  const uri = 'dev'
  const title = '개발 관련 유튜브'
  const hashList = ['AI', 'spring', '자바스크립트']
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  const pageSize = 30
  await goRenderPage(req, res, uri, '', title, hashList, isApi, page, pageSize)
})

router.get('/en', async function (req, res, next) {
  const uri = 'dev'
  const title = 'YouTube for Developers'
  const hashList = ['tutorial', 'spring', 'rust']
  const lang = 'en'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  const pageSize = 30
  await goRenderPage(req, res, uri, lang, title, hashList, isApi, page, pageSize)
})

router.get('/food', async function (req, res, next) {
  const uri = 'food'
  const title = '요리 관련 유튜브'
  const hashList = ['시장', '백종원', '간식']
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  const pageSize = 30
  await goRenderPage(req, res, uri, '', title, hashList, isApi, page, pageSize)
})

router.get('/kpop', async function (req, res, next) {
  const uri = 'kpop'
  const title = 'K-POP YouTube Videos'
  const hashList = ['M/V', 'Official', 'ILLIT', 'BTS']
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  const pageSize = 30
  await goRenderPage(req, res, uri, '', title, hashList, isApi, page, pageSize)
})

async function goRenderPage(
  req,
  res,
  uri,
  lang,
  title,
  hashList,
  isApi = false,
  page,
  pageSize
) {
  const locale = lang === 'en' ? 'en_US' : 'ko_KR'
  const stime = Date.now()
  const data = await dao.getPagedVideos({
    category: uri,
    lang,
    page,
    pageSize,
  })
  const etime = Date.now()
  console.log('elapsed time: ', etime - stime)
  const user = req.user
  building(data.rows)
  const totalPages = Math.ceil(data.count / pageSize)

  if (isApi) {
    res.json(data.rows)
  } else {
    res.render('index', {
      title,
      list: data.rows,
      totalCount: data.count,
      locale,
      uri,
      hashList,
      user,
      currentPage: page,
      totalPages,
      pageSize,
    })
  }
}

const cache = {}
async function getAllVideos(uri, lang) {
  const key = uri + lang
  const interval = Date.now() - cache[key]?.timestamp
  const isAvailable = interval < 1000 * 60 * 20 // 20mins inner
  if (cache[key] && isAvailable) {
    return cache[key]
  } else {
    const list = await dao.findAllVideo(uri, lang)
    cache[key] = list
    cache[key].timestamp = Date.now()
    return list
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

import summarize from '../utils/summary.js'
router.get('/transcript/:videoId', async function (req, res, next) {
  const videoId = req.params.videoId
  // find by videoId
  const item = await dao.findTranscriptByVideoId(videoId)
  if (item) {
    res.json({ videoId, summary: item.summary, text: item.content })
    return
  }
  await upsertTranscript(res, videoId)

})

async function upsertTranscript(res, videoId) {
  try {
    const pattern = /(니다|이죠|하죠|하겠죠|고요|까요|네요|데요|세요|에요|아요|어요)\s/g
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    let fullText = transcript.map((item) => item.text).join(' ')
    fullText = fullText.replaceAll(pattern, '$1. ')
    const cmd = "3줄 단문에, 명사형 어미로 요약(예)'있습니다.' 대신 '있음', '설명드립니다' 대신 '설명함' :\n"
    const messages = [
      {
        role: 'system',
        content: cmd + fullText,
      },
    ]
    const summary = await summarize(messages)
    await dao.createTranscript({
      videoId,
      content: fullText,
      summary: summary,
    })
    res.json({ videoId, summary, text: fullText })
  } catch (error) {
    console.log(error)
    res.json({ videoId, summary: '', text: 'Not Available' })
  }
}

router.get('/login', function (req, res) {
  res.render('login')
})

router.get('/login/github', passport.authenticate('github'))

router.get(
  '/login/github/return',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    let prevSession = req.session
    req.session.regenerate((err) => {
      Object.assign(req.session, prevSession)
      res.redirect('/admin')
    })
  }
)
router.get('/home', function (req, res) {
  res.render('home', { user: req.user })
})

import connectEnsureLogin from 'connect-ensure-login'
router.get(
  '/profile',
  connectEnsureLogin.ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user })
  }
)

router.get('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

export default router
