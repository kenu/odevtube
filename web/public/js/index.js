let repo = []
let repoAdded = []
function search() {
  const keyword = keywordEl.value.toLowerCase()
  if (!repo.length) {
    repo = document.querySelectorAll('#list>li')
  }
  const { htmlFiltered } = getFilteredHtml(keyword, repo)
  document.getElementById('list').innerHTML = htmlFiltered
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
  return { htmlFiltered }
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
  wcs?.event('showChannel', name)
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

  trivial()
}

function localData() {
  let videos = []
  const url = location.pathname + '?a=1'
  const dataKey = `data${location.pathname}/`.replace(/\/\//g, '/')
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      videos = res
      if (!localStorage) {
        return
      }
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

function openTranscript(videoId) {
  openModal()
  const url = '/transcript/' + videoId
  wcs?.event('transcript', videoId)
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      document.getElementById('modalContent').innerHTML =
        res.summary + '<hr />' + res.text
    })
    .catch((err) => {
      console.log(err)
      document.getElementById('modalContent').innerHTML =
        '🤔 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    })
}

function shareTwitter(title, videoId) {
  const url = `https://youtu.be/${videoId}`;
  const text = encodeURIComponent(`${title} ${url}`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

  window.open(twitterUrl, '_blank');

  if (typeof wcs !== 'undefined') {
    wcs.event('shareTwitter', videoId);
  }
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      method: 'Twitter',
      content_type: 'video',
      item_id: videoId,
    });
  }
}
