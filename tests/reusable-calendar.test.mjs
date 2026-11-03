import test from 'node:test'
import assert from 'node:assert/strict'
import {
  prepareCalendarYear,
  calendarTemplates,
  calendarActions,
  calendarStructure,
} from '../lib/annualCalendar.js'

const fixture = (year) => ({
  year,
  title: `Our Year Together ${year}`,
  months: Array.from({length: 12}, (_, index) => ({
    _key: `m${index + 1}`,
    month: index + 1,
    heading: `Month ${index + 1} ${year}`,
    events: [
      {
        _key: `e${index + 1}`,
        title: `Mass ${year}`,
        date: `${year}-${String(index + 1).padStart(2, '0')}-14`,
        time: '7 PM',
        venue: 'Community church',
        description: 'Keep this description',
      },
    ],
  })),
})

test('changing the year reuses every month and event without changing times, venues or the source', () => {
  const source = fixture(2026)
  const original = structuredClone(source)
  const result = prepareCalendarYear(source, 2027)
  assert.equal(result.set.year, 2027)
  assert.equal(result.copiedDates, 12)
  assert.equal(result.datesToReview, 0)
  assert.deepEqual(result.unset, [])
  for (let month = 1; month <= 12; month++) {
    assert.equal(
      result.set[`months[_key=="m${month}"].events[_key=="e${month}"].date`],
      `2027-${String(month).padStart(2, '0')}-14`,
    )
  }
  assert.equal(result.set.title, 'Our Year Together 2027')
  assert.equal(result.set['months[_key=="m8"].events[_key=="e8"].title'], 'Mass 2027')
  assert.ok(
    !Object.keys(result.set).some(
      (key) => key.endsWith('.time') || key.endsWith('.venue') || key.endsWith('.description'),
    ),
  )
  assert.deepEqual(source, original)
})

test('February 29 stays valid in a leap year', () => {
  const source = fixture(2024)
  source.months[1].events[0].date = '2024-02-29'
  const result = prepareCalendarYear(source, 2028)
  assert.equal(result.set['months[_key=="m2"].events[_key=="e2"].date'], '2028-02-29')
  assert.equal(result.datesToReview, 0)
})

test('an impossible February 29 is cleared for review rather than moved to March', () => {
  const source = fixture(2024)
  source.months[1].events[0].date = '2024-02-29'
  const result = prepareCalendarYear(source, 2027)
  assert.equal(result.set['months[_key=="m2"].events[_key=="e2"].date'], undefined)
  assert.deepEqual(result.unset, ['months[_key=="m2"].events[_key=="e2"].date'])
  assert.equal(result.datesToReview, 1)
  assert.equal(source.months[1].events[0].date, '2024-02-29')
})

test('missing, invalid and out-of-month dates require review', () => {
  const source = fixture(2026)
  source.months[0].events[0].date = '2026-02-14'
  delete source.months[1].events[0].date
  source.months[2].events[0].date = '2026-03-32'
  const result = prepareCalendarYear(source, 2027)
  assert.equal(result.datesToReview, 3)
  assert.equal(result.copiedDates, 9)
  assert.equal(result.unset.length, 2)
})

test('invalid years and incomplete calendars are rejected', () => {
  for (const year of [2026, 2027.5, 1999, 2101, NaN])
    assert.throws(() => prepareCalendarYear(fixture(2026), year))
  const incomplete = fixture(2026)
  incomplete.months.pop()
  assert.throws(() => prepareCalendarYear(incomplete, 2027), /twelve/)
})

test('the New menu cannot create duplicate calendars', () => {
  const other = {id: 'eventCard', schemaType: 'eventCard'}
  assert.deepEqual(
    calendarTemplates([{id: 'annualCalendar', schemaType: 'annualCalendar'}, other]),
    [other],
  )
})

test('the single calendar has publish, discard, restore and year preparation but no duplicate/delete', () => {
  const actions = ['publish', 'discardChanges', 'restore', 'delete', 'duplicate', 'unpublish'].map(
    (action) => ({action}),
  )
  const prepare = () => {}
  assert.deepEqual(
    calendarActions(
      actions,
      {schemaType: 'annualCalendar', documentId: 'annual-calendar'},
      prepare,
    ),
    [...actions.slice(0, 3), prepare],
  )
  assert.deepEqual(
    calendarActions(actions, {schemaType: 'annualCalendar', documentId: 'old-2025'}, prepare),
    [],
  )
  assert.equal(calendarActions(actions, {schemaType: 'eventCard'}, prepare), actions)
})

test('the sidebar opens the same calendar editor directly rather than a per-year list', () => {
  const builder = () => ({
    data: {},
    id(value) {
      this.data.id = value
      return this
    },
    title(value) {
      this.data.title = value
      return this
    },
    items(value) {
      this.data.items = value
      return this
    },
    child(value) {
      this.data.child = value
      return this
    },
    schemaType(value) {
      this.data.schemaType = value
      return this
    },
    documentId(value) {
      this.data.documentId = value
      return this
    },
  })
  const S = {
    list: builder,
    listItem: builder,
    document: builder,
    documentTypeListItems: () => [{getId: () => 'eventCard'}, {getId: () => 'annualCalendar'}],
  }
  const items = calendarStructure(S).data.items
  assert.equal(items.length, 2)
  assert.equal(items[1].data.title, 'Our Year Together')
  assert.equal(items[1].data.child.data.documentId, 'annual-calendar')
  assert.equal(items[1].data.child.data.schemaType, 'annualCalendar')
})
