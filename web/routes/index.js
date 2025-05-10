import express from 'express'
import dayjs from 'dayjs'
import passport from 'passport'
import { getFullText } from '../utils/transcriptUtil.js'
import dao from '../../youtubeDao.js'

// Add a counter to track page calls
let pageCallCounter = 0;

const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/', async function (req, res, next) {
  const uri = 'dev'
  const title = '개발 관련 유튜브.'
  const hashList = ['AI', 'spring', '자바스크립트']
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, hashList, isApi, page)
})

router.get('/en', async function (req, res, next) {
  const uri = 'dev'
  const title = 'YouTube for Developers'
  const hashList = ['tutorial', 'spring', 'rust']
  const lang = 'en'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, lang, title, hashList, isApi, page)
})

router.get('/food', async function (req, res, next) {
  const uri = 'food'
  const title = '요리 관련 유튜브'
  const hashList = ['시장', '백종원', '간식']
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, hashList, isApi, page)
})

router.get('/kpop', async function (req, res, next) {
  const uri = 'kpop'
  const title = 'K-POP YouTube Videos'
  const hashList = ['M/V', 'Official', '뉴진스', 'BTS']
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, hashList, isApi, page)
})

async function goRenderPage(
  req,
  res,
  uri,
  lang,
  title,
  hashList,
  isApi = false,
  page
) {
  // Increment the page call counter
  pageCallCounter++;
  
  // Check if garbage collection should be triggered
  if (pageCallCounter >= 10) {
    if (global.gc) {
      console.log('Triggering garbage collection after 10 page calls');
      global.gc();
    } else {
      console.log('Manual garbage collection not available. Run with --expose-gc flag to enable.');
    }
    // Reset the counter
    pageCallCounter = 0;
  }
  
  const locale = lang === 'en' ? 'en_US' : 'ko_KR';
  const stime = Date.now();
  const pageSize = 60;
  const searchKeyword = req.query.search || '';

  const data = await dao.getPagedVideosWithSearch({
    category: uri,
    lang,
    page,
    pageSize,
    searchKeyword,
  });

  const etime = Date.now();
  console.log('elapsed time: ', etime - stime);
  const user = req.user;
  building(data.rows);
  const totalPages = Math.ceil(data.count / pageSize);

  if (isApi) {
    res.json(data.rows);
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
      searchKeyword, // Pass the search keyword to the view
    });
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
    let fullText = await getFullText(videoId)
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
    console.error(error)
    res.json({ videoId, summary: '', text: 'Not Available ' + error.message })
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
