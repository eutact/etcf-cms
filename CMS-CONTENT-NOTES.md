# ETCF CMS Content Notes

## Known Live Content Issue

As of August 14, 2026, the latest Sanity `eventCard` content is no longer a future event:

- Title: `August 2026 - Tamil Mass`
- Date: `2026-08-08`
- Description still references "this July"
- Ticker says `07:00 AM`
- Event time says `7:00 PM`
- `calendarEndTime` is malformed as `2026808T220000`

The public website now protects visitors from seeing this expired event as an upcoming event. The correct next event details still need to be entered manually in Sanity by an ETCF editor.

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
