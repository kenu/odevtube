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

  document.querySelector('h1+p').addEventListener('click', function () {
    changeFont()
  })

  function changeFont() {
    const font = new FontFace(
      'KyoboHand',
      'url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff)',
      {}
    )

    font
      .load()
      .then(function (loadedFont) {
        document.fonts.add(loadedFont)
        const setFont = localStorage.getItem('font')
        localStorage.setItem('font', setFont ? '' : 'true')
        document.body.style.fontFamily = setFont
          ? 'KyoboHand, sans-serif'
          : 'Roboto, Arial, sans-serif'
      })
      .catch(function (error) {
        console.error('Failed to load font:', error)
      })
  }
}
