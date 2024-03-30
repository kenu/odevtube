function openModal() {
  document.getElementById('mp4Modal').style.display = 'block'
}

function closeModal() {
  document.getElementById('mp4Modal').style.display = 'none'
  document.getElementById('modalContent').innerText = 'Loading text ...'
}

document.querySelectorAll('.openModal').forEach(i => {
  console.log('open')
  i.addEventListener('click', openModal)
})

// 모달창 바깥 클릭 시 모달창 숨기기
window.onclick = function (event) {
  if (event.target == document.getElementById('mp4Modal')) {
    closeModal()
  }
}
