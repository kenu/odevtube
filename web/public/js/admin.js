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

function sortTable(n) {
  const table = document.getElementById('channelTable')
  let switchcount = 0
  let switching = true
  let shouldSwitch = true
  let dir = 'asc'
  let i = 0

  while (switching) {
    switching = false
    const rows = table.rows

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false
      const x = rows[i].getElementsByTagName('TD')[n]
      const y = rows[i + 1].getElementsByTagName('TD')[n]

      if (dir == 'asc') {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true
          break
        }
      } else if (dir == 'desc') {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true
          break
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
      switching = true
      switchcount++
    } else {
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc'
        switching = true
      }
    }
  }
}
