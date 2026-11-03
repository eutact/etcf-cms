import test from 'node:test'
import assert from 'node:assert/strict'
import annualCalendar from '../schemaTypes/annualCalendar.js'

test('new calendars use the Edmonton year at the UTC New Year boundary', () => {
  const OriginalDate = globalThis.Date
  try {
    globalThis.Date = class extends OriginalDate {
      constructor(...args) { super(...(args.length ? args : ['2027-01-01T02:00:00Z'])) }
    }
    assert.equal(annualCalendar.initialValue().year, 2026)
  } finally { globalThis.Date = OriginalDate }
})

test('a new calendar is ready for all twelve months without inventing event dates', () => {
  const calendar = annualCalendar.initialValue()
  assert.deepEqual(calendar.months.map(month => month.month), [1,2,3,4,5,6,7,8,9,10,11,12])
  assert.equal(new Set(calendar.months.map(month => month._key)).size, 12)
  assert.ok(calendar.months.every(month => month.events.length === 0))
})
