# Existing website calendar import

`annual-calendar-2025.json` contains one **draft** calendar: 12 month entries and
12 events extracted from the website's `AnnualCalendar.jsx` schedule. Event titles,
month themes, descriptions, dates, times, venues and the December note are retained.

The source is a 2025 schedule. Its August title explicitly says 2025, and every
month/day matches Saturday in 2025. The frontend's automatic year label does not
make those dates a confirmed 2026 schedule. No dates were advanced to 2026.

Target: project `xx91ckl7`, dataset `production`, document
`drafts.annual-calendar-2025-website-import`. The draft prefix prevents this import
from publishing the calendar or changing the live website. No schema changes are
required. The website currently displays only the published calendar for the
current Edmonton year; this historical draft does not replace that calendar.

From `etcf-cms/`, sign in if necessary:

```sh
npx sanity login
```

Create the reviewed draft without overwriting an existing document:

```sh
npx sanity documents create imports/annual-calendar-2025.json --dataset production --missing
```

After import, open **Our Year Together → Our Year Together — 2025** in Studio.
Review the contents before publishing. Prepare a separate calendar with confirmed
2026 dates if the current-year calendar is needed.

## Import status

Imported successfully as `drafts.annual-calendar-2025-website-import`. The remote
document was read back and compared with this file: all 12 months, all 12 events
and every imported field match. The calendar remains a draft; this operation did
not publish content. No schema code was changed.

The import file is retained in Git for review and repeatability. Pushing this
repository does not import or publish Sanity documents; the draft was created
separately through the authenticated CLI.
