let repo = []
let repoAdded = []
function search() {
  const keyword = keywordEl.value.toLowerCase()
  if (!repo.length) {
    repo = document.querySelectorAll('#list>li')
  }
}

function clearKeyword() {
  keywordEl.value = ''
  document.getElementById('channelLink').innerHTML = ''
  search()
}

function showChannel(name, customUrl) {
  keywordEl.value = name
  search()
  window.scrollTo(0, 0)
  const html = `<a href="https://www.youtube.com/${customUrl}" target="_blank">➡️<em> ${name}</em></a>`
  document.getElementById('channelLink').innerHTML = html
  wcs?.event('showChannel', name)
  gtag('event', 'level_end', {
    level_name: '시작됩니다...' + name,
    success: true,
  })
}

// global element
let keywordEl
window.onload = function () {
  keywordEl = document.getElementById('keyword')
  keywordEl?.addEventListener('keyup', search)

  // whole page event listener escape keyup clean keyword
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      clearKeyword()
    }
  })
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
