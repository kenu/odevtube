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
}
