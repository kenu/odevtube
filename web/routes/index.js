import express from 'express'
import dayjs from 'dayjs'
import passport from 'passport'
import { getFullText } from '../utils/transcriptUtil.js'
import dao from '../../youtubeDao.js'
import { parseYoutubeUrl } from '../utils/uri.js'
import youtube from '../../youtube.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



// Add a counter to track page calls
let pageCallCounter = 0;

const router = express.Router()
router.use(passport.initialize())
router.use(passport.session())

router.get('/', async function (req, res, _next) {
  const uri = 'dev'
  const title = '개발 관련 유튜브'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, isApi, page)
})

router.get('/en', async function (req, res, _next) {
  const uri = 'dev'
  const title = 'YouTube for Developers'
  const lang = 'en'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, lang, title, isApi, page)
})

router.get('/food', async function (req, res, _next) {
  const uri = 'food'
  const title = '요리 관련 유튜브'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, isApi, page)
})

router.get('/kpop', async function (req, res, _next) {
  const uri = 'kpop'
  const title = 'K-POP YouTube Videos'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, isApi, page)
})

router.get('/actor', async function (req, res, _next) {
  const uri = 'actor'
  const title = '배우 관련 유튜브'
  const isApi = req.query.a === '1'
  const page = parseInt(req.query.page) || 1
  await goRenderPage(req, res, uri, '', title, isApi, page)
})

async function goRenderPage(
  req,
  res,
  uri,
  lang,
  title,
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

  const user = req.user;
  const data = await dao.getPagedVideosWithSearch({
    category: uri,
    lang,
    page,
    pageSize,
    searchKeyword,
    accountId: user?.accountId,
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
        role: 'user',
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
      res.redirect('/my-channel')
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

router.get('/my-channel', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const videos = await dao.getVideosByAccountId(req.user.accountId);
  res.render('my-channel', { user: req.user, videos });
});

router.post('/my-channel/add-video', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const { videoUrl } = req.body;
  const videoId = parseYoutubeUrl(videoUrl);

  if (!videoId) {
    // Handle invalid URL
    return res.redirect('/my-channel');
  }

  const user = req.user;
  const videoCount = await dao.countVideosByAccountId(user.accountId);

  if (user.subscriptionTier === 'free' && videoCount >= 5) {
    // Handle limit for free users
    // For now, just redirect. In the future, we can show a message.
    return res.redirect('/my-channel');
  }

  try {
    const videoResponse = await youtube.videos.list({
      part: 'snippet',
      id: videoId,
    });

    if (videoResponse.data.items.length > 0) {
      const videoData = videoResponse.data.items[0];
      const channelResponse = await youtube.channels.list({
          part: 'snippet',
          id: videoData.snippet.channelId
      });
      const channelData = channelResponse.data.items[0];

      const video = {
        videoId: videoData.id,
        title: videoData.snippet.title,
        thumbnail: videoData.snippet.thumbnails.default.url,
        publishedAt: videoData.snippet.publishedAt,
        ChannelId: channelData.id,
      };
      
      const channel = {
          channelId: channelData.id,
          title: channelData.snippet.title,
          thumbnail: channelData.snippet.thumbnails.default.url,
          customUrl: channelData.snippet.customUrl
      }
      
      const savedChannel = await dao.create(channel);
      video.ChannelId = savedChannel.id;
      await dao.createVideo(video);
      await dao.addVideoToAccount(user.accountId, videoId);
    }
  } catch (error) {
    console.error('Error adding video:', error);
  }

  res.redirect('/my-channel');
});

router.post('/my-channel/remove-video', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const { videoId } = req.body;
  const user = req.user;
  await dao.removeVideoFromAccount(user.accountId, videoId);
  res.redirect('/my-channel');
});


router.get('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

router.get('/statistics', async function (req, res, next) {
  try {
    // Get total videos count
    const totalVideos = (await dao.getVideosCount()) || 0;
    
    // Get unique channels count
    const totalChannels = (await dao.getChannelsCount()) || 0;
    
    // Calculate average videos per channel
    const avgVideosPerChannel = totalChannels > 0 ? totalVideos / totalChannels : 0;
    
    // Get yearly stats
    const yearlyStats = await dao.getYearlyVideoStats();
    
    // Get monthly stats (last 12 months)
    const monthlyStats = await dao.getMonthlyVideoStats(12);
    
    // Get top channels
    const topChannels = await dao.getTopChannels(10);
    
    res.render('statistics', { 
      user: req.user,
      stats: {
        totalVideos,
        totalChannels,
        avgVideosPerChannel,
        yearlyStats,
        monthlyStats,
        topChannels
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    next(error);
  }
});

// Stripe routes
router.get('/subscribe', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render('subscribe', { user: req.user });
});

router.post('/create-checkout-session', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // Replace with your actual Price ID
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/payment-cancel`,
    client_reference_id: req.user.accountId,
  });

  res.redirect(303, session.url);
});

router.get('/payment-success', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  if (session.client_reference_id === req.user.accountId) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    await dao.updateAccount(req.user.accountId, {
      subscriptionTier: 'premium',
      subscriptionExpiry: new Date(subscription.current_period_end * 1000),
    });
  }
  res.redirect('/my-channel');
});

router.get('/payment-cancel', (req, res) => {
  res.redirect('/my-channel');
});

router.post('/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      await dao.updateAccount(invoice.customer, {
          subscriptionTier: 'premium',
          subscriptionExpiry: new Date(subscription.current_period_end * 1000),
      });
      break;
    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      await dao.updateAccount(subscriptionDeleted.customer, {
          subscriptionTier: 'free',
          subscriptionExpiry: null,
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});


export default router
