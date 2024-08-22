import { getFullText } from '../web/utils/transcriptUtil'

test('getTextOnly', async () => {
  const fullText = await getFullText('g09Qn23cYJ8')
  expect(fullText).toContain('니다')
})

test('remove [Object, Object]', async () => {
  const fullText = await getFullText('g09Qn23cYJ8')
  expect(fullText).not.toContain('Object')
})
