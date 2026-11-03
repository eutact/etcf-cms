# Calendar imports and reusable editor

## Current workflow: one reusable calendar

**Our Year Together** opens the fixed document `annual-calendar` directly. Edit
and publish that document. Each year, use **Prepare next year** in its actions
menu, review the carried-over dates and weekdays, and publish when ready. Do not
create a separate calendar document for each year.

`annual-calendar-singleton.json` is the prepared **2026 draft**, copied from the
published 2026 calendar with all twelve months and twelve events preserved. Its
ID is `drafts.annual-calendar`. It has been created and read back successfully;
on November 3, 2026, the reviewed draft was published as `annual-calendar` after release approval and verified field for field. The old 2025/2026 records remain untouched as backups.

For a repeatable migration in the existing project, sign in and run from
`etcf-cms/`:

```sh
npx sanity login
npx sanity exec scripts/prepare-calendar-singleton.cjs --with-user-token
```

The script copies the current Edmonton year's existing calendar only if the
reusable calendar has no draft or published document. Existing reusable content
is preserved. It never publishes or deletes records. Review the resulting draft
in Studio before publishing. Pushing this repository does not import or publish
Sanity documents.

The frontend prefers the published reusable document. Until its first publish,
it falls back to the existing published current-year record. It never displays
a calendar from another year as the current year.

## Retained original imports

`annual-calendar-2025.json` contains the original website schedule: twelve month
entries and twelve events, with descriptions, dates, times, venues and notes.
The source dates were Saturdays in 2025.

`annual-calendar-2026.json` retains the same month/day values with the year changed
to 2026, as requested. Embedded year labels were updated; times, venues, themes
and event order were preserved. These dates fall on Sundays in 2026. Both source
records are now published in the dataset; the checked-in files retain their
original draft IDs for reference and recovery.

These files are retained for traceability, not for annual document creation.
Project: `xx91ckl7`; dataset: `production`.
