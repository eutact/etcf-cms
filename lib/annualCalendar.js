export const CALENDAR_DOCUMENT_ID = 'annual-calendar'
export const CALENDAR_SCHEMA_TYPE = 'annualCalendar'

export function calendarStructure(S) {
  return S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems().filter((item) => item.getId() !== CALENDAR_SCHEMA_TYPE),
      S.listItem()
        .id(CALENDAR_DOCUMENT_ID)
        .title('Our Year Together')
        .child(S.document().schemaType(CALENDAR_SCHEMA_TYPE).documentId(CALENDAR_DOCUMENT_ID)),
    ])
}

export function calendarTemplates(templates) {
  return templates.filter((template) => template.schemaType !== CALENDAR_SCHEMA_TYPE)
}

export function calendarActions(actions, context, prepareYearAction) {
  if (context.schemaType !== CALENDAR_SCHEMA_TYPE) return actions
  const id = context.documentId?.replace(/^drafts\./, '')
  const allowed = new Set(['publish', 'discardChanges', 'restore'])
  const safeActions = actions.filter((action) => allowed.has(action.action))
  return id === CALENDAR_DOCUMENT_ID ? [...safeActions, prepareYearAction] : []
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  )
}

export function prepareCalendarYear(document, targetYear) {
  if (!Number.isInteger(targetYear) || targetYear < 2000 || targetYear > 2100) {
    throw new Error('Enter a whole year between 2000 and 2100.')
  }
  if (!Number.isInteger(document?.year) || targetYear === document.year) {
    throw new Error('Choose a different calendar year.')
  }
  if (!Array.isArray(document.months) || document.months.length !== 12) {
    throw new Error('Save all twelve month entries before preparing another year.')
  }
  const updateTitle = (value) =>
    typeof value === 'string'
      ? value.replace(new RegExp(`\\b${document.year}\\b`, 'g'), String(targetYear))
      : value
  const set = {year: targetYear}
  const unset = []
  let copiedDates = 0
  let datesToReview = 0
  if (updateTitle(document.title) !== document.title) set.title = updateTitle(document.title)
  for (const month of document.months) {
    if (!month._key)
      throw new Error('A month is missing its saved identifier. Save the calendar and try again.')
    const monthPath = `months[_key==${JSON.stringify(month._key)}]`
    if (updateTitle(month.heading) !== month.heading)
      set[`${monthPath}.heading`] = updateTitle(month.heading)
    for (const event of month.events || []) {
      if (!event._key)
        throw new Error(
          'An event is missing its saved identifier. Save the calendar and try again.',
        )
      const eventPath = `${monthPath}.events[_key==${JSON.stringify(event._key)}]`
      if (updateTitle(event.title) !== event.title)
        set[`${eventPath}.title`] = updateTitle(event.title)
      const nextDate = typeof event.date === 'string' ? `${targetYear}${event.date.slice(4)}` : null
      const sourceMatches =
        validDate(event.date) &&
        Number(event.date.slice(0, 4)) === document.year &&
        Number(event.date.slice(5, 7)) === month.month
      if (sourceMatches && validDate(nextDate)) {
        set[`${eventPath}.date`] = nextDate
        copiedDates++
      } else {
        if (event.date != null) unset.push(`${eventPath}.date`)
        datesToReview++
      }
    }
  }
  return {set, unset, copiedDates, datesToReview}
}
