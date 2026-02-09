function createChannel() {
  const data = {
    channelId: document.getElementById('channelId').value,
    lang: document.getElementById('lang').value,
    category: document.getElementById('category').value,
    isPublic: document.getElementById('isPublic').checked ? 'on' : undefined,
  }
  fetch('/api/channel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const contentType = res.headers.get('content-type') || ''
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`)
      }
      if (!contentType.includes('application/json')) {
        const text = await res.text()
        throw new Error(text.slice(0, 300))
      }
      return res.json()
    })
    .then((res) => {
      alert('success: ' + JSON.stringify(res))
      location.reload()
    })
    .catch((err) => {
      console.error(err)
      alert('failed: ' + (err?.message || String(err)))
    })
}

function sortTable(columnIndex) {
  const table = document.getElementById('channelTable')
  let switchCount = 0
  let switching = true
  let dir = 'asc'

  let rows = table.rows
  while (switching) {
    switching = false

    for (let i = 1; i < rows.length - 1; i++) {
      const currentRow = rows[i]
      const nextRow = rows[i + 1]

      const currentCell = currentRow.getElementsByTagName('TD')[columnIndex]
      const nextCell = nextRow.getElementsByTagName('TD')[columnIndex]

      let shouldSwitch = decideSwitch(currentCell, nextCell, columnIndex, dir)

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
        switching = true
        switchCount++
      }
    }

    if (switchCount === 0 && dir === 'asc') {
      dir = 'desc'
      switching = true
    }
  }
}

function decideSwitch(currentCell, nextCell, columnIndex, dir) {
  let currentValue = currentCell.innerHTML.toLowerCase()
  let nextValue = nextCell.innerHTML.toLowerCase()
  if (columnIndex === 3) {
    currentValue = +currentValue
    nextValue = +nextValue
  }

  let shouldSwitch = false
  if (dir === 'asc') {
    shouldSwitch = currentValue > nextValue
  } else {
    shouldSwitch = currentValue < nextValue
  }
  return shouldSwitch
}

// 슬라이딩 메뉴 토글 기능
window.onload = function () {
  document.querySelector('.menu-toggle').addEventListener('click', function () {
    document.querySelector('.sliding-menu').classList.toggle('open')
  })
  
  // 저장된 테마 불러오기
  loadTheme()
}

// 테마 관리 함수
function toggleTheme(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const currentTheme = localStorage.getItem('theme') || 'light'
  let newTheme
  
  if (currentTheme === 'light') {
    newTheme = 'dark'
  } else {
    newTheme = 'light'
  }
  
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
  updateThemeButton(newTheme)
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

function updateThemeButton(theme) {
  const button = document.querySelector('.theme-toggle')
  if (button) {
    if (theme === 'light') {
      button.textContent = '☀️'
    } else {
      button.textContent = '🌙'
    }
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light'
  applyTheme(savedTheme)
  updateThemeButton(savedTheme)
}

function remove(videoId) {
  if (confirm('Are you sure?')) {
    fetch('/api/video', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        videoId,
      },
    }).then(function (response) {
      if (response.ok) {
        location.reload()
      } else {
        alert('Something went wrong, please try again later.')
      }
    })
  }
}
