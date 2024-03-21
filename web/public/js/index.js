let repo = ''
function search() {
  const keyword = document.getElementById('keyword').value.toLowerCase()
  if (!repo) {
    repo = document.querySelectorAll('li')
  }
  let allData = repo
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
  document.getElementById('keyword').value = ''
  document.getElementById('channelLink').innerHTML = ''
  search()
}

function showChannel(name, customUrl) {
  document.getElementById('keyword').value = name
  search()
  window.scrollTo(0, 0)
  const html = `<a href="https://www.youtube.com/${customUrl}" target="_blank">➡️<em> ${name}</em></a>`
  document.getElementById('channelLink').innerHTML = html
}

function processHash() {
  const hash = decodeURIComponent(location.hash).replace('#', '')
  document.getElementById('keyword').value = hash
  location.href += hash
  search()
}

window.onload = function () {
  document.getElementById('count').innerHTML =
    document.querySelectorAll('li').length

  processHash()

  const el = document.getElementById('keyword')
  el.addEventListener('keyup', search)

  // whole page event listener escape keyup clean keyword
  document.addEventListener('keyup', function (e) {
    if (e.key === 'Escape') {
      const el = document.getElementById('keyword')
      if (el.value) {
        localStorage.setItem('keyword', el.value)
        clearKeyword()
      } else {
        const keyword = localStorage.getItem('keyword')
        if (keyword) {
          el.value = keyword
          search()
        }
      }
    }
  })

  if (localStorage?.getItem('font')) {
    changeFont()
  }

  document.querySelector('h1+p').addEventListener('click', function () {
    localStorage.setItem('font', localStorage.getItem('font') ? '' : 'true')
    changeFont()
  })

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
}
