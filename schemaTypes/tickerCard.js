// remove Icons Build
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'tickerCard',
    title: 'Scrolling Text',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Internal Title',
            type: 'string',
            description: 'For your reference in Studio (not shown on site).',
            validation: r => r.required(),
        }),
        defineField({
            name: 'message',
            title: 'Ticker Message',
            type: 'string',
            description: 'Short text that scrolls in the site banner.',
            validation: r => r.required().max(160),
        }),
        defineField({
            name: 'link',
            title: 'Optional Link',
            type: 'url',
        }),
        defineField({
            name: 'priority',
            title: 'Priority (lower shows first)',
            type: 'number',
            initialValue: 1,
            validation: r => r.min(1).max(99),
        }),
        defineField({
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        }),
        defineField({
            name: 'start',
            title: 'Start Showing',
            type: 'datetime',
        }),
        defineField({
            name: 'end',
            title: 'Stop Showing',
            type: 'datetime',
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'message', active: 'active' },
        prepare: ({ title, subtitle, active }) => ({
            title: `${title} ${active ? '' : '(inactive)'}`,
            subtitle,
        }),
    },
})
