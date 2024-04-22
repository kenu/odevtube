let repo = []
let repoAdded = []
function search() {
  const keyword = keywordEl.value.toLowerCase()
  if (!repo.length) {
    repo = document.querySelectorAll('#list>li')
  }
  const { htmlFiltered, count } = getFilteredHtml(keyword, repo)
  document.getElementById('list').innerHTML = htmlFiltered
  document.getElementById('count').innerHTML = count

  if (!repoAdded.length) {
    repoAdded = document.querySelectorAll('#listAdded>li')
  }
  const { htmlFiltered: html } = getFilteredHtml(keyword, repoAdded)
  document.getElementById('listAdded').innerHTML = html
}

function getFilteredHtml(keyword, list) {
  const filtered = [...list].filter(function (e) {
    const text = e.innerText.toLowerCase()
    return text.includes(keyword)
  })
  let htmlFiltered = ''
  filtered.forEach(function (e) {
    htmlFiltered += e.outerHTML
  })
  return { htmlFiltered, count: filtered.length }
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

  document.getElementById('closeModal')?.addEventListener('click', closeModal)
  document
    .getElementById('clipboardBtn')
    ?.addEventListener('click', copyTranscript)
  document
    .getElementById('modalContent')
    ?.addEventListener('dblclick', copyTranscript)

  localData()

  trivial()
}

function localData() {
  let videos = []
  const url = location.pathname + '?a=1'
  const dataKey = `data${location.pathname}`
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      videos = res
      localStorage?.setItem(dataKey, JSON.stringify({ list: videos }))
      const data = localStorage.getItem(dataKey)
      const json = JSON.parse(data)
      const list = json.list
      if (list.length === 0) {
        return
      }
      const lastLi = document.querySelector('#list>li:last-child')
      if (!lastLi) {
        return
      }
      const lastVideoId = lastLi.dataset.v
      const lastIndex = list.findIndex((v) => v.videoId === lastVideoId)
      const added = list.map((v, index) => {
        if (index <= lastIndex) {
          return ''
        }
        return `<li data-v="${v.videoId}"><a href="https://youtu.be/${v.videoId}">${v.title}</a></li>`
      })
      document.getElementById('listAdded').innerHTML = added.join('')
    })
}

function openTranscript(v) {
  openModal()
  const videoId = v
  const url = '/transcript/' + videoId
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      document.getElementById('modalContent').innerHTML =
        res.summary + '<hr />' + res.text
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
