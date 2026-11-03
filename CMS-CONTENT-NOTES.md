# ETCF CMS Content Notes

## Historical Content Snapshot — August 14, 2026

As of August 14, 2026, the latest Sanity `eventCard` content is no longer a future event:

- Title: `August 2026 - Tamil Mass`
- Date: `2026-08-08`
- Description still references "this July"
- Ticker says `07:00 AM`
- Event time says `7:00 PM`
- `calendarEndTime` is malformed as `2026808T220000`

The local website now protects visitors from seeing expired events as upcoming events. This snapshot is historical; check the current published records before editing content.

## Editor Guidance

For each future event:

- Enter a clear title.
- Use the actual event date.
- Keep the description aligned with the month and devotion.
- Confirm time, venue, registration URL, and ticker text all agree.
- Use calendar datetime fields in `YYYYMMDDTHHMMSS` format.

Example:

```text
20250614T180000
```

Do not invent event information until the committee confirms it.

## Our Year Together

The `annualCalendar` schema adds **Our Year Together** to Sanity Studio. This is separate from the homepage's single upcoming `eventCard` and the scrolling `tickerCard`.

### Editor workflow

1. Open **Our Year Together** in the sidebar. It opens the same calendar directly every time.
2. Edit the section heading, description, twelve months and their events. Drag events to set their order; turn off **Show on Website** to hide an event.
3. Publish when ready. Draft changes stay private; the website reads only published content.
4. To reuse the calendar for another year, open the document actions menu and choose **Prepare next year**. Confirm the target year and save the draft.
5. Review the carried-over month/day values and their new weekdays, update event details, then publish when that year should replace the live calendar. Do not publish a future-year calendar early: the website displays only the current Edmonton year.

The year field is read-only; **Prepare next year** updates it together with the event dates. The action preserves all twelve months, event order, descriptions, times and venues. It updates year references in titles/headings. Invalid dates, including February 29 in a non-leap year, are cleared for review and must be completed before publishing. It does not publish automatically.

There is one reusable document (`annual-calendar`). Calendar creation, duplication and deletion actions are removed from the normal editor workflow. The previous 2025/2026 records remain in the dataset as backups, outside the sidebar workflow; do not create a new document each year.

### Validation and display

- There must be exactly one entry for each of the twelve months.
- Event title, date, time and venue are required. Dates must be real and belong to their month and calendar year.
- The website reads the published reusable calendar and displays it only when its year matches the current Edmonton year.
- Months appear January to December; events retain the editor's saved order.
- Weekdays come from stored event dates. Earlier months and past events remain visible for the whole current year.
- A published empty month shows **0 listed events**; it does not reuse an old static event.
- A missing, unreachable or different-year calendar shows an empty/unavailable state, never relabeled dates from another year.

### Migration and release

The reusable 2026 draft was copied from the existing published 2026 calendar, preserving all twelve months and twelve events. The migration initially created `drafts.annual-calendar` without publishing. Following release approval on November 3, 2026, that reviewed draft was published as `annual-calendar` and read back field for field. The previous 2025 and 2026 records were not modified or deleted.

Deploy the Studio and frontend updates together. The frontend prefers the published reusable document. Its legacy fallback remains available for installations that have not yet completed the migration. Pushing Git code does not publish Sanity documents.

The imported 2026 schedule retains the original month/day values as requested; those twelve dates fall on Sundays in 2026. Maintainers should confirm future-year dates rather than assuming the same weekdays recur.

The public site redirects to `https://www.edmontontamilcatholics.ca`; that exact origin must be allowed in Sanity CORS with credentials disabled. The non-www origin alone is insufficient. The www origin has been added to the project settings.

Deploy the updated Studio to expose the schema in the hosted CMS, and upload the updated website files to expose the integration on the public site. Starting the local Studio makes the editor available locally; it does not deploy either application or publish calendar content.

For the local Studio, use `http://localhost:3333` and sign in with an authorized Sanity account. The project's current CORS configuration rejects the equivalent `http://127.0.0.1:3333` origin.
