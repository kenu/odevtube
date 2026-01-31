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
  const channels = await dao.getChannelsByAccountId(req.user.accountId);
  
  if (channels.length === 0) {
    return res.render('my-channel-feed', { user: req.user, videos: [], channels: [] });
  }

  try {
    // 모든 채널의 최신 비디오를 가져와서 통합
    const allVideos = [];
    for (const channel of channels) {
      const searchResponse = await youtube.search.list({
        part: 'snippet',
        channelId: channel.channelId,
        order: 'date',
        maxResults: 5,
        type: 'video'
      });

      const videos = searchResponse.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        pubdate: new Date(item.snippet.publishedAt).toISOString().split('T')[0],
        channelTitle: channel.title,
        channelThumbnail: channel.thumbnail,
        customUrl: channel.customUrl
      }));
      allVideos.push(...videos);
    }

    // 시간순 정렬 (최신순)
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.render('my-channel-feed', { user: req.user, videos: allVideos, channels });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.render('my-channel-feed', { user: req.user, videos: [], channels });
  }
});

router.get('/my-channel/manage', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const channels = await dao.getChannelsByAccountId(req.user.accountId);
  res.render('my-channel-manage', { user: req.user, channels });
});

router.post('/my-channel/add-channel', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  let { channelUrl } = req.body;
  
  // URL 디코딩 (한글 등 인코딩된 문자 처리)
  channelUrl = decodeURIComponent(channelUrl);
  
  // YouTube 채널 URL에서 채널 ID 또는 customUrl 추출
  // 형식: https://www.youtube.com/@channelname 또는 https://www.youtube.com/channel/UCxxxx
  let channelIdentifier = null;
  let isCustomUrl = false;
  
  const customUrlMatch = channelUrl.match(/@([^\/\?\s]+)/);
  const channelIdMatch = channelUrl.match(/channel\/([a-zA-Z0-9_-]+)/);
  
  if (customUrlMatch) {
    channelIdentifier = '@' + customUrlMatch[1];
    isCustomUrl = true;
  } else if (channelIdMatch) {
    channelIdentifier = channelIdMatch[1];
  } else {
    return res.redirect('/my-channel');
  }

  const user = req.user;
  const channelCount = await dao.countChannelsByAccountId(user.accountId);

  if (user.subscriptionTier === 'free' && channelCount >= 5) {
    return res.redirect('/my-channel');
  }

  try {
    let channelResponse;
    if (isCustomUrl) {
      channelResponse = await youtube.channels.list({
        part: 'snippet',
        forHandle: channelIdentifier.substring(1),
      });
    } else {
      channelResponse = await youtube.channels.list({
        part: 'snippet',
        id: channelIdentifier,
      });
    }

    if (channelResponse.data.items && channelResponse.data.items.length > 0) {
      const channelData = channelResponse.data.items[0];
      
      const channel = {
        channelId: channelData.id,
        title: channelData.snippet.title,
        thumbnail: channelData.snippet.thumbnails.default.url,
        customUrl: channelData.snippet.customUrl
      };
      
      await dao.create(channel);
      await dao.addChannelToAccount(user.accountId, channelData.id);
    }
  } catch (error) {
    console.error('Error adding channel:', error);
  }

  res.redirect('/my-channel/manage');
});

router.post('/my-channel/remove-channel', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const { channelId } = req.body;
  const user = req.user;
  await dao.removeChannelFromAccount(user.accountId, channelId);
  res.redirect('/my-channel/manage');
});

router.get('/my-channel/:channelId', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const { channelId } = req.params;
  const user = req.user;
  
  try {
    const channel = await dao.findOneByChannelId(channelId);
    if (!channel) {
      return res.redirect('/my-channel');
    }

    const searchResponse = await youtube.search.list({
      part: 'snippet',
      channelId: channelId,
      order: 'date',
      maxResults: 20,
      type: 'video'
    });

    const videos = searchResponse.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      pubdate: new Date(item.snippet.publishedAt).toISOString().split('T')[0]
    }));

    res.render('channel-videos', { user, channel, videos });
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    res.redirect('/my-channel');
  }
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
