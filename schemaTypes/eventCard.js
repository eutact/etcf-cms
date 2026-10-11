import { defineField, defineType } from 'sanity'

const calendarDateTimePattern = /^\d{8}T\d{6}$/
const calendarDateTimeMessage = 'Use YYYYMMDDTHHMMSS format, for example 20250614T180000.'

export default defineType({
    name: 'eventCard',
    title: 'Event Card',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Event Title',
            type: 'string',
            validation: rule => rule.required().max(90),
        }),
        defineField({
            name: 'subtitle',
            title: 'Event Subtitle',
            type: 'string',
            validation: rule => rule.max(120),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            validation: rule => rule.required().max(400),
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            validation: rule => rule.required(),
        }),
        defineField({
            name: 'time',
            title: 'Time',
            type: 'string',
            description: 'Example: 6:45 PM Rosary | 7:00 PM Tamil Mass',
            validation: rule => rule.required().max(120),
        }),
        defineField({
            name: 'venue',
            title: 'Venue',
            type: 'string',
            validation: rule => rule.required().max(180),
        }),
        defineField({
            name: 'image',
            title: 'Event Poster',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'registerURL',
            title: 'Register URL',
            type: 'url',
        }),
        defineField({
            name: 'reminderButtonText',
            title: 'Reminder Button Text',
            type: 'string',
            initialValue: 'Set Reminder',
            validation: rule => rule.max(40),
        }),
        defineField({
            name: 'calendarTitle',
            title: 'Google Calendar Title',
            type: 'string',
            description: 'This will be the event title shown in Google Calendar.',
            validation: rule => rule.max(120),
        }),
        defineField({
            name: 'calendarDescription',
            title: 'Google Calendar Description',
            type: 'text',
            rows: 3,
            description: 'This will be shown as event details in Google Calendar.',
            validation: rule => rule.max(500),
        }),
        defineField({
            name: 'calendarLocation',
            title: 'Google Calendar Location',
            type: 'string',
            description: 'Exact location for the calendar event, such as the church address.',
            validation: rule => rule.max(180),
        }),
        defineField({
            name: 'calendarStartTime',
            title: 'Start DateTime (YYYYMMDDTHHMMSS)',
            type: 'string',
            description: calendarDateTimeMessage,
            validation: rule =>
                rule.custom(value => {
                    if (!value) return true
                    return calendarDateTimePattern.test(value) || calendarDateTimeMessage
                }),
        }),
        defineField({
            name: 'calendarEndTime',
            title: 'End DateTime (YYYYMMDDTHHMMSS)',
            type: 'string',
            description: calendarDateTimeMessage,
            validation: rule =>
                rule.custom((value, context) => {
                    if (!value) return true
                    if (!calendarDateTimePattern.test(value)) return calendarDateTimeMessage
                    const start = context.document?.calendarStartTime
                    if (start && calendarDateTimePattern.test(start) && value <= start) {
                        return 'End DateTime must be after Start DateTime.'
                    }
                    return true
                }),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'date',
            media: 'image',
        },
    },
})
