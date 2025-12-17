function createChannel() {
  const data = {
    channelId: document.getElementById('channelId').value,
    lang: document.getElementById('lang').value,
    category: document.getElementById('category').value,
  }
  fetch('/api/channel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      alert('success: ' + JSON.stringify(res))
      location.reload()
    })
    .catch((err) => {
      console.error(err)
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
  
  const currentTheme = localStorage.getItem('theme') || 'system'
  let newTheme
  
  if (currentTheme === 'system') {
    newTheme = 'light'
  } else if (currentTheme === 'light') {
    newTheme = 'dark'
  } else {
    newTheme = 'system'
  }
  
  localStorage.setItem('theme', newTheme)
  applyTheme(newTheme)
  updateThemeButton(newTheme)
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  }
}

function updateThemeButton(theme) {
  const button = document.querySelector('.theme-toggle')
  if (button) {
    if (theme === 'system') {
      button.textContent = '🌓 시스템'
    } else if (theme === 'light') {
      button.textContent = '☀️ 라이트'
    } else {
      button.textContent = '🌙 다크'
    }
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'system'
  applyTheme(savedTheme)
  updateThemeButton(savedTheme)
  
  // 시스템 테마 변경 감지
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('theme') || 'system'
    if (currentTheme === 'system') {
      applyTheme('system')
    }
  })
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
