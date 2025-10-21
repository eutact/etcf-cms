// schemaTypes/tickerCard.js
import { defineType, defineField } from 'sanity'
import { Megaphone } from '@phosphor-icons/react'

export default defineType({
    name: 'tickerCard',
    title: 'Scrolling Text',
    type: 'document',
    icon: Megaphone,
    fields: [
        defineField({
            name: 'title',
            title: 'Internal Title',
            type: 'string',
            description: 'For your reference in Studio (not shown on site).',
            validation: r => r.required()
        }),
        defineField({
            name: 'message',
            title: 'Ticker Message',
            type: 'string',
            description: 'Short text that scrolls in the site banner.',
            validation: r => r.required().max(160)
        }),
        defineField({
            name: 'link',
            title: 'Optional Link',
            type: 'url',
            description: 'Send users somewhere if they click the ticker item.'
        }),
        defineField({
            name: 'priority',
            title: 'Priority (lower shows first)',
            type: 'number',
            initialValue: 1,
            validation: r => r.min(1).max(99)
        }),
        defineField({
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true
        }),
        defineField({
            name: 'start',
            title: 'Start Showing',
            type: 'datetime',
            description: 'Optional start time'
        }),
        defineField({
            name: 'end',
            title: 'Stop Showing',
            type: 'datetime',
            description: 'Optional end time'
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'message', active: 'active' },
        prepare: ({ title, subtitle, active }) => ({
            title: `${title} ${active ? '' : '(inactive)'}`,
            subtitle
        })
    }
})
