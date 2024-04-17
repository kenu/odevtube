import util from '../web/utils/uri'

test('base URI', () => {
  const uri = util.getUri('dev', 'ko')
  expect(uri).toBe('/')
})

test('category URI', () => {
  const uri = util.getUri('food', 'ko')
  expect(uri).toBe('/food/')
})

test('lang URI', () => {
  const uri = util.getUri('dev', 'en')
  expect(uri).toBe('/en')
})
