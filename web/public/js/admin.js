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
      console.log(res)
      alert('success: ' + JSON.stringify(res))
      document.getElementById('channelId').value = ''
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

