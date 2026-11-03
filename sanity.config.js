import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {calendarStructure, calendarTemplates, calendarActions} from './lib/annualCalendar'
import {PrepareCalendarYear} from './actions/PrepareCalendarYear'

export default defineConfig({
  name: 'default',
  title: 'ETCF Web Content Manager',

  projectId: 'xx91ckl7',
  dataset: 'production',

  plugins: [deskTool({structure: calendarStructure}), visionTool()],

  document: {
    actions: (actions, context) => calendarActions(actions, context, PrepareCalendarYear),
  },

  schema: {
    types: schemaTypes,
    templates: calendarTemplates,
  },
})
