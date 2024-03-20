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
}
