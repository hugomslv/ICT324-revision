import './css/style.css'
import { getLatestRates,
  getSupportedCurrencies, currencies_flags } from './src/api.js'

const supportedCurrencies = await getSupportedCurrencies()
const currencySelectorFrom = document.getElementById('from')
currencySelectorFrom.innerHTML = ''
const currencySelectorTo = document.getElementById('to')
currencySelectorTo.innerHTML = ''
for (const currency in supportedCurrencies) {
  const option = document.createElement('option')
  option.value = currency
  option.textContent = `${currencies_flags[currency]} ${currency}`
  option.title = supportedCurrencies[currency]
  currencySelectorFrom.appendChild(option)
  currencySelectorTo.appendChild(option.cloneNode(true))
}

document.querySelector('#from option[value="eur"]')
  .setAttribute('selected', 'selected')
document.querySelector('#to option[value="chf"]')
  .setAttribute('selected', 'selected')

document.getElementById('convert').addEventListener('click', async () => {
  const amount = document.getElementById('amount').value
  const from = currencySelectorFrom.value
  const to = currencySelectorTo.value
  const latestRates = await getLatestRates(from)
  const conversionRate = amount * latestRates[from][to]
  document.getElementById('result').textContent = 
    `${amount} ${from} = ${conversionRate.toFixed(2)} ${to}`
})

document.getElementById('amount').addEventListener('input', () => {
  const amount = document.getElementById('amount').value
  const convertButton = document.getElementById('convert')
  convertButton.disabled = true
  if (amount === '') {
    return
  }
  const numericAmount = parseFloat(amount)
  if (Number.isFinite(numericAmount) && numericAmount > 0) {
    const fixed = numericAmount.toFixed(2)
    convertButton.disabled = false
    document.getElementById('amount').value = fixed
  }
})

document.getElementById('invert').addEventListener('click', () => {
  const from = currencySelectorFrom.value
  const to = currencySelectorTo.value
  document.querySelectorAll('option')
    .forEach(option => option.removeAttribute('selected'))
  currencySelectorFrom.value = to
  currencySelectorTo.value = from
})
