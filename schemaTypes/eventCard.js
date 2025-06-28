export default {
    name: 'eventCard',
    title: 'Event Card',
    type: 'document',
    fields: [
        { name: 'title', title: 'Event Title', type: 'string' },
        { name: 'subtitle', title: 'Event Subtitle', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'date', title: 'Date', type: 'date' },
        { name: 'time', title: 'Time', type: 'string' },
        { name: 'venue', title: 'Venue', type: 'string' },
        {
            name: 'image',
            title: 'Event Poster',
            type: 'image',
            options: { hotspot: true },
        },
        { name: 'registerURL', title: 'Register URL', type: 'url' },
        { name: 'reminderButtonText', title: 'Reminder Button Text', type: 'string' },

        // 🔔 Google Calendar Event Fields
        {
            name: 'calendarTitle',
            title: 'Google Calendar Title',
            type: 'string',
            description: 'This will be the event title shown in Google Calendar.',
        },
        {
            name: 'calendarDescription',
            title: 'Google Calendar Description',
            type: 'text',
            description: 'This will be shown as event details in Google Calendar.',
        },
        {
            name: 'calendarLocation',
            title: 'Google Calendar Location',
            type: 'string',
            description: 'Exact location for the calendar event (e.g., Church address)',
        },
        {
            name: 'calendarStartTime',
            title: 'Start DateTime (YYYYMMDDTHHMMSS)',
            type: 'string',
            description: 'Format: YYYYMMDDTHHMMSS (e.g., 20250614T180000)',
        },
        {
            name: 'calendarEndTime',
            title: 'End DateTime (YYYYMMDDTHHMMSS)',
            type: 'string',
            description: 'Format: YYYYMMDDTHHMMSS (e.g., 20250614T210000)',
        },
    ],
};
