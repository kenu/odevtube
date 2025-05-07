function openModal() {
  document.getElementById('mp4Modal').style.display = 'block'
}

function closeModal() {
  document.getElementById('mp4Modal').style.display = 'none'
  document.getElementById('modalContent').innerText = 'Loading text ...'
}

function copyTranscript() {
  const text = document.getElementById('modalContent').innerText
  navigator.clipboard.writeText(text)
  alert('클립보드에 복사되었습니다.')
}

// DOM이 로드된 후 모달 관련 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
  // 모달 열기 버튼에 이벤트 리스너 등록
  document.querySelectorAll('.openModal').forEach(i => {
    i.addEventListener('click', openModal)
  })
  
  // 모달 닫기 버튼에 이벤트 리스너 등록
  const closeModalBtn = document.getElementById('closeModal')
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal)
  }
  
  // 클립보드 복사 버튼에 이벤트 리스너 등록
  const clipboardBtn = document.getElementById('clipboardBtn')
  if (clipboardBtn) {
    clipboardBtn.addEventListener('click', copyTranscript)
  }
  
  // 모달 콘텐츠 더블클릭 시 복사 기능 추가
  const modalContent = document.getElementById('modalContent')
  if (modalContent) {
    modalContent.addEventListener('dblclick', copyTranscript)
  }
  
  // 모달창 바깥 클릭 시 모달창 숨기기
  window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('mp4Modal')) {
      closeModal()
    }
  })
})
