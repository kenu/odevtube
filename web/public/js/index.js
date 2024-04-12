function search() {
  const keyword = keywordEl.value.toLowerCase()
  const allData = document.querySelectorAll('li')
  const filtered = [...allData].filter(function (e) {
    const text = e.innerText.toLowerCase()
    return text.includes(keyword)
  })
  document.getElementById('count').innerHTML = filtered.length
  let htmlFiltered = ''
  filtered.forEach(function (e) {
    htmlFiltered += e.outerHTML
  })
  document.getElementById('list').innerHTML = htmlFiltered
}

function clearKeyword() {
  keywordEl.value = ''
  location.hash = ''
  document.getElementById('channelLink').innerHTML = ''
  search()
}

function showChannel(name, customUrl) {
  keywordEl.value = name
  search()
  window.scrollTo(0, 0)
  const html = `<a href="https://www.youtube.com/${customUrl}" target="_blank">➡️<em> ${name}</em></a>`
  document.getElementById('channelLink').innerHTML = html
  location.hash = name
  wcs.event('showChannel', name)
  gtag('event', 'level_end', {
    level_name: '시작됩니다...' + name,
    success: true,
  })
}

function processHash() {
  const hash = decodeURIComponent(location.hash)?.replace('#', '')
  keywordEl.value = hash
  search()
}

window.addEventListener('popstate', function (event) {
  const hash = decodeURIComponent(location.hash)?.replace('#', '')
  if (hash) {
    keywordEl.value = hash
  } else {
    document.getElementById('channelLink').innerHTML = ''
    keywordEl.value = ''
  }
  search()
})
// global element
let keywordEl
window.onload = function () {
  keywordEl = document.getElementById('keyword')
  keywordEl.addEventListener('keyup', search)

  processHash()

  // whole page event listener escape keyup clean keyword
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      clearKeyword()
    }
  })

  addModalHandler()
  localData()
  trivial()
}

function addModalHandler() {
  document.getElementById('closeModal')?.addEventListener('click', closeModal)
  document
    .getElementById('clipboardBtn')
    ?.addEventListener('click', copyTranscript)
  document
    .getElementById('modalContent')
    ?.addEventListener('dblclick', copyTranscript)
}

function checkLocalDataIsNew(pathname) {
  const dataKey = `data${pathname}`
  const data = localStorage.getItem(dataKey)
  if (data) {
    const json = JSON.parse(data)
    const time = json.time
    const now = Date.now()
    const diff = Math.floor((now - time) / 1000 / 60 / 60)
    return diff < 10
  }
  return false
}

function localData() {
  const pathname = location.pathname
  const isNew = checkLocalDataIsNew(pathname)
  if (isNew) {
    return
  }
  const url = pathname + '?a=1'
  fetch(url)
    .then((res) => res.json())
    .then((videos) => {
      if (videos.length === 0) {
        return
      }
      localStorage.setItem(
        `data${pathname}`,
        JSON.stringify({ list: videos, time: Date.now() })
      )
      const lastIndex = getLastVideoIndex(videos)
      const added = videos.map((v, index) => {
        if (index < lastIndex) {
          return ''
        }
        return `<li data-v="${v.videoId}"><a href="https://youtu.be/${v.videoId}">${v.title}</a></li>`
      })
      document.getElementById('listAdded').innerHTML = added.join('')
    })
}

function getLastVideoIndex(videos) {
  const lastLi = document.querySelector('#list>li:last-child')
  const lastVideoId = lastLi.dataset.v
  const lastIndex = videos.findIndex((v) => v.videoId === lastVideoId)
  return lastIndex
}

function openTranscript(v) {
  openModal()
  const videoId = v
  const url = '/transcript/' + videoId
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      document.getElementById('modalContent').innerHTML = res.text
    })
}

function trivial() {
  if (localStorage?.getItem('font')) {
    changeFont()
  }

  document.querySelector('h1+p').addEventListener('click', function () {
    localStorage.setItem('font', localStorage.getItem('font') ? '' : 'true')
    changeFont()
  })
}

function changeFont() {
  const font = new FontFace(
    'KyoboHand',
    'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff)',
    {}
  )

  if (localStorage.getItem('font')) {
    font
      .load()
      .then(function (loadedFont) {
        document.fonts.add(loadedFont)
        document.body.style.fontFamily = 'KyoboHand, sans-serif'
      })
      .catch(function (error) {
        console.error('Failed to load font:', error)
      })
  } else {
    document.body.style.fontFamily = 'Roboto, Arial, sans-serif'
  }
}

export default {
  search,
  clearKeyword,
  showChannel,
  processHash,
  openTranscript,
  trivial,
  getLastVideoIndex,
}
