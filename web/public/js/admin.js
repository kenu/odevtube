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
