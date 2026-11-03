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

1. Open **Our Year Together** and create one calendar document for the year.
2. Enter the calendar year, section heading, and optional description.
3. New calendars start with twelve month entries and no events. Edit each month heading/theme as needed.
4. Within a month, add events with their confirmed title, category, description, date, time, venue, and optional additional note.
5. Drag events within a month to set their display order. Turn off **Show on Website** to hide an event without deleting it.
6. Publish the calendar. Draft changes do not appear on the public website. Sanity's CDN may take a short time to reflect a publish.

### Validation and display

- There must be exactly one entry for each of the twelve months.
- Event title, date, time, and venue are required. The date must be real and belong to its month and calendar year.
- The website selects the current year's published calendar using Edmonton's timezone. Prepare future-year calendars in advance; keep only one document per year.
- The website keeps months in January-to-December order, with events in the editor's saved order.
- Dates and weekdays come from each event's stored date, independently of the month heading or numeric header marker. The marker continues to identify the month.
- Event counts include visible, valid events. A published empty month shows **0 listed events** and the empty state; it does not reuse the old static event.
- Earlier months and past events within the selected current year remain visible; this calendar is a full-year history, not an upcoming-only list.
- If no published calendar exists for the current year, or Sanity cannot be reached, the website shows a current-year empty/unavailable state. It does not reuse dates from another year.
- If multiple published calendars exist for a year, the most recently updated one is used.

### Existing schedule and release

The previous hardcoded fallback was a 2025 schedule under an automatic current-year label. That fallback is removed in the frontend change so 2025 dates cannot appear as 2026 events. The published 2025 import remains a separate record. A separate 2026 draft now contains the same month/day values with the year changed to 2026, as requested. All twelve dates fall on Sundays in 2026; the frontend calculates those weekdays. Titles, times, venues and notes are retained, with embedded 2025 labels updated to 2026. Review the 2026 draft before publishing it.

The public site redirects to `https://www.edmontontamilcatholics.ca`; that exact origin must be allowed in Sanity CORS with credentials disabled. The non-www origin alone is insufficient. The www origin has been added to the project settings.

Deploy the updated Studio to expose the schema in the hosted CMS, and upload the updated website files to expose the integration on the public site. Starting the local Studio makes the editor available locally; it does not deploy either application or publish calendar content.

For the local Studio, use `http://localhost:3333` and sign in with an authorized Sanity account. The project's current CORS configuration rejects the equivalent `http://127.0.0.1:3333` origin.
