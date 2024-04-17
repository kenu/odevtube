import util from '../web/utils/uri'

test('base URI', () => {
  const category = 'dev'
  const lang = 'ko'
  const uri = util.getUri(category, lang)
  expect(uri).toBe('/')
})

test('category URI', () => {
  const category = 'food'
  const lang = 'ko'
  const uri = util.getUri(category, lang)
  expect(uri).toBe('/food/')
})

test('lang URI', () => {
  const category = 'dev'
  const lang = 'en'
  const uri = util.getUri(category, lang)
  expect(uri).toBe('/en')
})
