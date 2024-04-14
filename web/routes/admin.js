import express from 'express'

const router = express.Router()

router.get('/admin', auth, async function (req, res, next) {
  res.end('admin')
})

function auth(req, res, next) {
  if (req.query.a === '1') {
    next()
  } else {
    res.end('not admin')
  }
}

export default router
