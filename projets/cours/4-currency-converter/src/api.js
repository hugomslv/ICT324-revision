const API_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies'
const API_LIST = `${API_BASE}.min.json`

/**
 * Récupère les taux de change les plus récents pour une devise donnée.
 * @param {string} currency - Code de la devise (ex: 'eur', 'usd').
 * @returns {Promise<Object|null>} Un objet contenant les taux ou null en cas d'erreur.
 */
export async function getLatestRates(currency) {
  try {
    currency = currency.toLowerCase()
    const response = await fetch(`${API_BASE}/${currency}.json`)
    if (!response.ok) throw new Error('Erreur lors de la récupération des taux')
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Récupère la liste des devises supportées filtrées par celles ayant un drapeau.
 * @returns {Promise<Object>} Un objet contenant les devises supportées ou un objet vide en cas d'erreur.
 */
export async function getSupportedCurrencies() {
  try {
    const response = await fetch(API_LIST)
    if (!response.ok) throw new Error('Erreur lors de la récupération des devises')
    const currencies = await response.json()
    // Filtrage optimisé
    return Object.fromEntries(
      Object.entries(currencies).filter(([ key ]) => Object.prototype.hasOwnProperty.call(currencies_flags, key))
    )
  } catch (error) {
    console.error(error)
    return {}
  }
}

/**
 * Dictionnaire associant chaque code de devise à son emoji de drapeau.
 * @type {Object.<string, string>}
 */
export const currencies_flags = {
  "aed": "🇦🇪",
  "afn": "🇦🇫",
  "all": "🇦🇱",
  "amd": "🇦🇲",
  "ang": "🇳🇱",
  "aoa": "🇦🇴",
  "ars": "🇦🇷",
  "aud": "🇦🇺",
  "awg": "🇦🇼",
  "azn": "🇦🇿",
  "bam": "🇧🇦",
  "bbd": "🇧🇧",
  "bdt": "🇧🇩",
  "bgn": "🇧🇬",
  "bhd": "🇧🇭",
  "bif": "🇧🇮",
  "bmd": "🇧🇲",
  "bnd": "🇧🇳",
  "bob": "🇧🇴",
  "brl": "🇧🇷",
  "bsd": "🇧🇸",
  "btn": "🇧🇹",
  "bwp": "🇧🇼",
  "byn": "🇧🇾",
  "byr": "🇧🇾",
  "bzd": "🇧🇿",
  "cad": "🇨🇦",
  "cdf": "🇨🇩",
  "chf": "🇨🇭",
  "clf": "🇨🇱",
  "clp": "🇨🇱",
  "cny": "🇨🇳",
  "cop": "🇨🇴",
  "crc": "🇨🇷",
  "cuc": "🇨🇺",
  "cup": "🇨🇺",
  "cve": "🇨🇻",
  "czk": "🇨🇿",
  "djf": "🇩🇯",
  "dkk": "🇩🇰",
  "dop": "🇩🇴",
  "dzd": "🇩🇿",
  "egp": "🇪🇬",
  "ern": "🇪🇷",
  "etb": "🇪🇹",
  "eur": "🇪🇺",
  "fjd": "🇫🇯",
  "fkp": "🇫🇰",
  "gbp": "🇬🇧",
  "gel": "🇬🇪",
  "ghs": "🇬🇭",
  "gip": "🇬🇮",
  "gmd": "🇬🇲",
  "gnf": "🇬🇳",
  "gtq": "🇬🇹",
  "gyd": "🇬🇾",
  "hkd": "🇭🇰",
  "hnl": "🇭🇳",
  "hrk": "🇭🇷",
  "htg": "🇭🇹",
  "huf": "🇭🇺",
  "idr": "🇮🇩",
  "ils": "🇮🇱",
  "inr": "🇮🇳",
  "iqd": "🇮🇶",
  "irr": "🇮🇷",
  "isk": "🇮🇸",
  "jmd": "🇯🇲",
  "jod": "🇯🇴",
  "jpy": "🇯🇵",
  "kes": "🇰🇪",
  "kgs": "🇰🇬",
  "khr": "🇰🇭",
  "kmf": "🇰🇲",
  "kpw": "🇰🇵",
  "krw": "🇰🇷",
  "kwd": "🇰🇼",
  "kyd": "🇰🇾",
  "kzt": "🇰🇿",
  "lak": "🇱🇦",
  "lbp": "🇱🇧",
  "lkr": "🇱🇰",
  "lrd": "🇱🇷",
  "lsl": "🇱🇸",
  "ltl": "🇱🇹",
  "lvl": "🇱🇻",
  "lyd": "🇱🇾",
  "mad": "🇲🇦",
  "mdl": "🇲🇩",
  "mga": "🇲🇬",
  "mkd": "🇲🇰",
  "mmk": "🇲🇲",
  "mnt": "🇲🇳",
  "mop": "🇲🇴",
  "mro": "🇲🇷",
  "mur": "🇲🇺",
  "mvr": "🇲🇻",
  "mwk": "🇲🇼",
  "mxn": "🇲🇽",
  "myr": "🇲🇾",
  "mzn": "🇲🇿",
  "nad": "🇳🇦",
  "ngn": "🇳🇬",
  "nio": "🇳🇮",
  "nok": "🇳🇴",
  "npr": "🇳🇵",
  "nzd": "🇳🇿",
  "omr": "🇴🇲",
  "pab": "🇵🇦",
  "pen": "🇵🇪",
  "pgk": "🇵🇬",
  "php": "🇵🇭",
  "pkr": "🇵🇰",
  "pln": "🇵🇱",
  "pyg": "🇵🇾",
  "qar": "🇶🇦",
  "ron": "🇷🇴",
  "rsd": "🇷🇸",
  "rub": "🇷🇺",
  "rwf": "🇷🇼",
  "sar": "🇸🇦",
  "sbd": "🇸🇧",
  "scr": "🇸🇨",
  "sdg": "🇸🇩",
  "sek": "🇸🇪",
  "sgd": "🇸🇬",
  "shp": "🇸🇭",
  "sle": "🇸🇱",
  "sll": "🇸🇱",
  "sos": "🇸🇴",
  "srd": "🇸🇷",
  "std": "🇸🇹",
  "syp": "🇸🇾",
  "szl": "🇸🇿",
  "thb": "🇹🇭",
  "tjs": "🇹🇯",
  "tmt": "🇹🇲",
  "tnd": "🇹🇳",
  "top": "🇹🇴",
  "try": "🇹🇷",
  "ttd": "🇹🇹",
  "twd": "🇹🇼",
  "tzs": "🇹🇿",
  "uah": "🇺🇦",
  "ugx": "🇺🇬",
  "usd": "🇺🇸",
  "uyu": "🇺🇾",
  "uzs": "🇺🇿",
  "vef": "🇻🇪",
  "ves": "🇻🇪",
  "vnd": "🇻🇳",
  "vuv": "🇻🇺",
  "wst": "🇼🇸",
  "xaf": "🇨🇲",
  "xcd": "🇦🇮",
  "xof": "🇧🇯",
  "xpf": "🇵🇫",
  "yer": "🇾🇪",
  "zar": "🇿🇦",
  "zmw": "🇿🇲",
  "zwl": "🇿🇼"
}