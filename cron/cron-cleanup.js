import videoDao from '../dao/videoDao.js'
import videoService from '../services/video.js'
import axios from 'axios'

/**
 * DB에 저장된 모든 영상을 YouTube API로 검증하여
 * 삭제(비공개/제거)된 영상을 DB에서 제거하는 cleanup 작업
 *
 * 실행: node cron/cron-cleanup.js
 * 권장 주기: 주 1회 (일요일 새벽 등 트래픽 적은 시간대)
 *
 * YouTube API quota 소비량:
 *   - videos.list (part: id): 1 unit per 50개 배치
 *   - 예) 5,000개 영상 → 100 batches → 100 units 소비
 */
async function cleanupDeletedVideos() {
  console.log('[cron-cleanup] 시작:', new Date().toISOString())

  // 1. DB에서 모든 videoId 조회 (videoId 컬럼만 읽어 메모리 효율화)
  const videoIds = await videoDao.findAllVideoIds()
  console.log(`[cron-cleanup] DB 영상 수: ${videoIds.length}개`)

  if (videoIds.length === 0) {
    console.log('[cron-cleanup] 검증할 영상 없음.')
    return
  }

  // 2. YouTube API로 존재 여부 검증
  const deletedIds = await videoService.detectDeletedVideos(videoIds)
  console.log(`[cron-cleanup] 삭제된 영상 감지: ${deletedIds.length}개`)

  if (deletedIds.length === 0) {
    console.log('[cron-cleanup] 삭제된 영상 없음. 완료.')
    return
  }

  // 3. 감지된 영상 DB에서 제거
  const removedList = []
  for (const videoId of deletedIds) {
    await videoDao.removeVideo(videoId)
    console.log(`[cron-cleanup] 제거 완료: ${videoId}`)
    removedList.push(videoId)
  }

  // 4. Discord webhook으로 결과 알림 (환경변수 미설정 시 스킵)
  const webhookUrl = process.env.WEBHOOK_DISCORD_MP4_URL
  if (webhookUrl && removedList.length > 0) {
    const lines = removedList.map((id) => `• https://youtu.be/${id}`)
    const content = `🗑️ **삭제된 영상 ${removedList.length}개 정리 완료**\n${lines.join('\n')}`
    try {
      await axios.post(webhookUrl, { content })
      console.log('[cron-cleanup] Discord 알림 전송 완료')
    } catch (err) {
      console.error('[cron-cleanup] Discord 알림 실패:', err.message)
    }
  }

  console.log(`[cron-cleanup] 완료: ${removedList.length}개 제거됨`, new Date().toISOString())
}

cleanupDeletedVideos().catch((err) => {
  console.error('[cron-cleanup] 치명적 오류:', err)
  process.exit(1)
})
