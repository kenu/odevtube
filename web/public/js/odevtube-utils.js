/**
 * ODevTube 공통 유틸리티 함수
 */

/**
 * 탭 전환 함수 - 차트 또는 섹션 표시
 * @param {string} tabName - 표시할 탭 이름
 * @param {string} sectionType - 섹션 타입 (chart 또는 section)
 */
function showTab(tabName, sectionType = 'chart') {
    // 모든 탭과 섹션 비활성화
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.chart-section').forEach(section => section.classList.remove('active'));
    
    // 선택한 탭과 섹션 활성화
    document.querySelector(`.tab[onclick*="${tabName}"]`).classList.add('active');
    
    // 섹션 타입에 따라 ID 형식 결정
    const sectionId = sectionType === 'chart' 
        ? `${tabName}-chart` 
        : `${tabName}-section`;
    
    document.getElementById(sectionId).classList.add('active');
}
