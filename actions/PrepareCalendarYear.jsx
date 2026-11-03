import {useState} from 'react'
import {useDocumentOperation} from 'sanity'
import {Button, Card, Stack, Text, TextInput} from '@sanity/ui'
import {prepareCalendarYear} from '../lib/annualCalendar'

export function PrepareCalendarYear(props) {
  const document = props.draft || props.published
  const {patch} = useDocumentOperation(props.id, props.type)
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState('')
  const [revision, setRevision] = useState(null)
  const [error, setError] = useState('')
  let change
  let validation = ''
  if (open) {
    try {
      change = prepareCalendarYear(document, Number(year))
    } catch (cause) {
      validation = cause.message
    }
  }
  const close = () => {
    setOpen(false)
    props.onComplete?.()
  }
  return {
    label: 'Prepare next year',
    disabled: Boolean(patch.disabled) || !Number.isInteger(document?.year),
    onHandle: () => {
      setYear(String(document.year + 1))
      setRevision(document._rev)
      setError('')
      setOpen(true)
    },
    dialog: open && {
      type: 'dialog',
      header: 'Reuse this calendar for another year',
      onClose: close,
      content: (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!change || patch.disabled) return
            if (document._rev !== revision) {
              setError('The calendar changed while this dialog was open. Close it and try again.')
              return
            }
            const patches = [{set: change.set}]
            if (change.unset.length) patches.push({unset: change.unset})
            patch.execute(patches)
            close()
          }}
        >
          <Stack space={4}>
            <label>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Calendar year
                </Text>
                <TextInput
                  aria-label="Calendar year"
                  type="number"
                  min={2000}
                  max={2100}
                  step={1}
                  value={year}
                  onChange={(event) => setYear(event.currentTarget.value)}
                />
              </Stack>
            </label>
            <Text size={1}>
              Keep the same twelve months, event order, descriptions, times and venues. Valid dates
              keep their month and day; year references in titles and headings are updated.
            </Text>
            <Text size={1}>
              Check the dates and weekdays before publishing. This only saves draft changes; the
              published calendar stays unchanged.
            </Text>
            {change && (
              <Text size={1}>
                {change.copiedDates} event dates will carry over to {year}.
              </Text>
            )}
            {Boolean(change?.datesToReview) && (
              <Card padding={3} radius={2} tone="caution">
                <Text size={1}>
                  {change.datesToReview} dates need confirmation, including any February 29 that
                  does not exist in the selected year. Their date fields will be left empty for
                  review.
                </Text>
              </Card>
            )}
            {(validation || error) && (
              <Text size={1} tone="critical" role="alert">
                {validation || error}
              </Text>
            )}
            <Button
              type="submit"
              text="Save draft for this year"
              tone="primary"
              disabled={!change || Boolean(patch.disabled) || Boolean(error)}
            />
            <Button type="button" text="Cancel" mode="ghost" onClick={close} />
          </Stack>
        </form>
      ),
    },
  }
}
