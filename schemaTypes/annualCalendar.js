import {defineArrayMember, defineField, defineType} from 'sanity'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

export default defineType({
  name: 'annualCalendar',
  title: 'Our Year Together',
  type: 'document',
  description: 'One calendar per year. Publish confirmed dates to display this calendar on the website.',
  initialValue: () => ({
    year: new Date().getFullYear(),
    title: 'Our Year Together',
    description: 'Journey through a year of faith, worship, fellowship and community with ETCF.',
    months: monthNames.map((heading, index) => ({
      _type: 'annualMonth',
      month: index + 1,
      heading,
      events: [],
    })),
  }),
  fields: [
    defineField({
      name: 'year',
      title: 'Calendar Year',
      type: 'number',
      description: 'The website shows the published calendar for the current year in Edmonton. Prepare future years in advance.',
      validation: rule => rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'title',
      title: 'Section Heading',
      type: 'string',
      validation: rule => rule.required().max(90),
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      rows: 3,
      validation: rule => rule.max(300),
    }),
    defineField({
      name: 'months',
      title: 'Monthly Events',
      type: 'array',
      description: 'Keep one entry for each month. Months are always displayed January to December.',
      validation: rule => rule.required().min(12).max(12).custom(months => {
        if (!months) return true
        const numbers = months.map(entry => entry.month)
        return new Set(numbers).size === numbers.length || 'Each month can appear only once.'
      }),
      of: [defineArrayMember({
        name: 'annualMonth',
        title: 'Month',
        type: 'object',
        fields: [
          defineField({
            name: 'month',
            title: 'Month',
            type: 'number',
            options: {list: monthNames.map((title, index) => ({title, value: index + 1}))},
            validation: rule => rule.required().integer().min(1).max(12),
          }),
          defineField({
            name: 'heading',
            title: 'Month Heading / Theme',
            type: 'string',
            description: 'For example: Holy Rosary or Pongal Celebration. Leave blank to use the month name.',
            validation: rule => rule.max(100),
          }),
          defineField({
            name: 'events',
            title: 'Events',
            type: 'array',
            description: 'Add confirmed events and drag to set their display order. An empty month shows no listed events.',
            validation: rule => rule.custom((events, context) => {
              const year = context.document?.year
              const month = context.parent?.month
              if (!events || !year || !month) return true
              const mismatch = events.find(event => isCalendarDate(event.date)
                && (Number(event.date.slice(0, 4)) !== year || Number(event.date.slice(5, 7)) !== month))
              return !mismatch || `The date for "${mismatch.title || 'this event'}" must be in ${monthNames[month - 1]} ${year}.`
            }),
            of: [defineArrayMember({
              name: 'annualEvent',
              title: 'Event',
              type: 'object',
              initialValue: {active: true, category: 'Tamil Mass'},
              fields: [
                defineField({
                  name: 'title',
                  title: 'Event Title',
                  type: 'string',
                  validation: rule => rule.required().max(120),
                }),
                defineField({
                  name: 'category',
                  title: 'Category',
                  type: 'string',
                  description: 'For example: Tamil Mass, Retreat, or Community Gathering.',
                  validation: rule => rule.max(60),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                  validation: rule => rule.max(600),
                }),
                defineField({
                  name: 'date',
                  title: 'Event Date',
                  type: 'date',
                  description: 'Use the confirmed event date. The website calculates the weekday from this date.',
                  validation: rule => rule.required().custom(value => !value || isCalendarDate(value) || 'Enter a valid calendar date.'),
                }),
                defineField({
                  name: 'time',
                  title: 'Time',
                  type: 'string',
                  description: 'Example: 6:45 PM (Rosary) & 7:15 PM (Mass).',
                  validation: rule => rule.required().max(160),
                }),
                defineField({
                  name: 'venue',
                  title: 'Venue / Address',
                  type: 'string',
                  validation: rule => rule.required().max(300),
                }),
                defineField({
                  name: 'note',
                  title: 'Additional Note',
                  type: 'text',
                  rows: 3,
                  description: 'Optional details such as a luncheon or cultural programme.',
                  validation: rule => rule.max(600),
                }),
                defineField({
                  name: 'active',
                  title: 'Show on Website',
                  type: 'boolean',
                  initialValue: true,
                  description: 'Turn off to hide this event without removing it. Publish to apply the change.',
                }),
              ],
              preview: {
                select: {title: 'title', date: 'date', active: 'active'},
                prepare: ({title, date, active}) => ({
                  title: `${title || 'Untitled event'}${active === false ? ' (hidden)' : ''}`,
                  subtitle: date || 'Date required',
                }),
              },
            })],
          }),
        ],
        preview: {
          select: {month: 'month', heading: 'heading', events: 'events'},
          prepare: ({month, heading, events = []}) => {
            const count = (events || []).filter(event => event.active !== false).length
            return {
              title: `${monthNames[month - 1] || 'Choose a month'}${heading ? ` — ${heading}` : ''}`,
              subtitle: `${count} visible ${count === 1 ? 'event' : 'events'}`,
            }
          },
        },
      })],
    }),
  ],
  orderings: [{title: 'Year, newest first', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', year: 'year'},
    prepare: ({title, year}) => ({title: `${title || 'Our Year Together'} — ${year || 'Year required'}`}),
  },
})
