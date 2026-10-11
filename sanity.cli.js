import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xx91ckl7',
    dataset: 'production'
  },
  deployment: {autoUpdates: true},
})
