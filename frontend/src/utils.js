// Utility helpers for IDs, numbering, dates, fees, and storage

export function generateObjectId() {
  // 24-char hex placeholder similar to Mongo ObjectId
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function padNumber(value, length) {
  return String(value).padStart(length, '0')
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export function generateAutoNumber(prefix, year, sequence, pad = 3) {
  return `${prefix}${year}${padNumber(sequence, pad)}`
}

export function parseISODate(value) {
  return value ? new Date(value) : null
}

export function toISODateInput(date) {
  if (!date) return ''
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function calculateLateFee(dueDate, returnDateOrNull, weeklyFee = 100) {
  if (!dueDate) return 0
  const due = new Date(dueDate)
  const end = returnDateOrNull ? new Date(returnDateOrNull) : new Date()
  // If returned/on or before due, no fee
  if (end <= due) return 0
  const msPerDay = 24 * 60 * 60 * 1000
  const daysLate = Math.ceil((end - due) / msPerDay)
  const weeksLate = Math.ceil(daysLate / 7)
  return weeksLate * weeklyFee
}

export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch (e) {
      return fallback
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

export function nextSequence(key) {
  const current = storage.get(key, 0)
  const next = Number(current) + 1
  storage.set(key, next)
  return next
}

export function inferBorrowStatus(dueDate, returnDate) {
  if (returnDate) return 'RETURNED'
  const now = new Date()
  return now > new Date(dueDate) ? 'ACTIVE' : 'ACTIVE'
}


