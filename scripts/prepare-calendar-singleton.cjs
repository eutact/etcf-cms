const fs = require('node:fs')
const path = require('node:path')
const {getCliClient} = require('sanity/cli')

async function main() {
  const client = getCliClient({apiVersion: '2025-06-27'}).withConfig({
    useCdn: false,
    perspective: 'raw',
  })
  const documents = await client.fetch('*[_type == "annualCalendar"]')
  const existing =
    documents.find((doc) => doc._id === 'drafts.annual-calendar') ||
    documents.find((doc) => doc._id === 'annual-calendar')
  if (existing) {
    console.log(
      JSON.stringify({
        status: 'preserved-existing-calendar',
        id: existing._id,
        year: existing.year,
      }),
    )
    return
  }
  const year = Number(
    new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Edmonton', year: 'numeric'}).format(
      new Date(),
    ),
  )
  const sources = documents
    .filter((doc) => doc.year === year)
    .sort(
      (a, b) =>
        Number(b._id.startsWith('drafts.')) - Number(a._id.startsWith('drafts.')) ||
        String(b._updatedAt).localeCompare(String(a._updatedAt)),
    )
  const source = sources[0]
  if (!source || source.months?.length !== 12)
    throw new Error('A complete current-year calendar is required before migration.')
  const {_id, _rev, _createdAt, _updatedAt, ...content} = source
  const draft = {...content, _id: 'drafts.annual-calendar'}
  fs.mkdirSync(path.resolve('imports'), {recursive: true})
  fs.writeFileSync(
    path.resolve('imports/annual-calendar-singleton.json'),
    JSON.stringify(draft, null, 2) + '\n',
  )
  const saved = await client.createIfNotExists(draft)
  const verified = await client.getDocument(saved._id)
  for (const [key, value] of Object.entries(draft)) {
    if (JSON.stringify(verified[key]) !== JSON.stringify(value))
      throw new Error(`The saved ${key} differs; no existing document was overwritten.`)
  }
  console.log(
    JSON.stringify({
      status: 'draft-created-and-verified',
      id: saved._id,
      sourceId: source._id,
      year: saved.year,
      months: saved.months.length,
      events: saved.months.reduce((n, month) => n + (month.events?.length || 0), 0),
      published: false,
      previousDocumentsPreserved: documents.length,
    }),
  )
}
main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
