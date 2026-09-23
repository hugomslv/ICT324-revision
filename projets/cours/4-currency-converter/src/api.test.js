import { expect, test, vi, afterEach } from 'vitest'
import { getLatestRates, getSupportedCurrencies, currencies_flags } from './api.js'

afterEach(() => {
  vi.restoreAllMocks()
  // On restaure fetch
  vi.unstubAllGlobals()
})

test('getLatestRates retourne un objet contenant la devise demandée', async () => {
  const currency = 'eur'
  const rates = await getLatestRates(currency)
  expect(rates).toBeTypeOf('object')
  expect(rates).toHaveProperty(currency)
})

test('getLatestRates pour CHF retourne le taux CHF', async () => {
  const currency = 'eur'
  const rates = await getLatestRates(currency)
  expect(rates).toHaveProperty(currency)
  expect(rates[currency]).toHaveProperty('chf')
  expect(typeof rates[currency]['chf']).toBe('number')
})


/**
 * Vérifie que getLatestRates retourne null lorsque l'API répond avec une erreur.
 * Le test mocke fetch et console.error pour éviter un appel réseau réel.
 */
test('getLatestRates retourne null en cas d’erreur', async () => {
  // Pendant le test, tout appel à fetch() utilise cette fausse fonction. Cela évite un véritable appel réseau.
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  // Observe et remplace temporairement une méthode existante :
  // console.error continue d’être appelé ;
  // son affichage est désactivé ;
  // l’appel peut être vérifié : expect(errorSpy).toHaveBeenCalledOnce()
  vi.spyOn(console, 'error').mockImplementation(() => {})

  const rates = await getLatestRates('eur')

  expect(rates).toBeNull()
  //console.error appelé 0 fois : échec ;
  //console.error appelé 1 fois : succès ;
  //console.error appelé 2 fois : échec.
  expect(console.error).toHaveBeenCalledOnce()
})

/**
 * Vérifie que getSupportedCurrencies retourne un objet vide lorsque l'API répond
 * avec une erreur. Le test mocke fetch et console.error pour isoler ce scénario.
 */
test('getSupportedCurrencies retourne un objet vide en cas d’erreur', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  vi.spyOn(console, 'error').mockImplementation(() => {})

  const currencies = await getSupportedCurrencies()

  expect(currencies).toEqual({})
  expect(console.error).toHaveBeenCalledOnce()
})

test('currencies_flags contient le bon drapeau pour CHF', () => {
  expect(currencies_flags['chf']).toBe('🇨🇭')
})

test('Toutes les devises retournées par getSupportedCurrencies sont dans currencies_flags', async () => {
  const currencies = await getSupportedCurrencies()
  Object.keys(currencies).forEach(devise => {
    expect(currencies_flags).toHaveProperty(devise)
  })
})

test('getLatestRates fonctionne avec une devise en majuscule', async () => {
  const rates = await getLatestRates('USD')
  expect(rates).toBeTypeOf('object')
  expect(rates).toHaveProperty('usd')
})

test('getLatestRates retourne plusieurs taux pour EUR', async () => {
  const rates = await getLatestRates('eur')
  expect(Object.keys(rates['eur']).length).toBeGreaterThan(5)
})

test('currencies_flags contient le drapeau pour une devise exotique', () => {
  expect(currencies_flags['xaf']).toBe('🇨🇲')
})

test('getSupportedCurrencies ne retourne pas de devise non supportée', async () => {
  const currencies = await getSupportedCurrencies()
  Object.keys(currencies).forEach(devise => {
    expect([ 'usd', 'eur', 'chf', 'jpy', ...Object.keys(currencies_flags) ]).toContain(devise)
  })
})