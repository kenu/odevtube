let repo = ''
function search(evt) {
  // const keyword = evt.currentTarget.value.toLowerCase()
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

window.onload = function () {
  document.getElementById('count').innerHTML =
    document.querySelectorAll('li').length

  const el = document.getElementById('keyword')
  el.addEventListener('keyup', search)

  if (localStorage.getItem('font')) {
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
