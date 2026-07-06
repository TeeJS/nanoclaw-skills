---
name: caldav
description: Read and manage CalDAV calendars (iCloud, Nextcloud, Fastmail). Use for scheduling, checking availability, or creating events. Triggers on any calendar or scheduling request.
allowed-tools: Bash(node:*)
---

# CalDAV Calendars (iCloud, Nextcloud, Fastmail)

The cal CLI is mounted at `/opt/cal-cli/` and reads CALDAV_ACCOUNTS from the environment.

List calendars:
```bash
node /opt/cal-cli/dist/index.js calendars
```

List events:
```bash
node /opt/cal-cli/dist/index.js events --from today --to "+7d"
```

Create an event:
```bash
node /opt/cal-cli/dist/index.js create "Calendar Name" --title "Meeting" --start "2025-01-15T10:00:00Z" --end "2025-01-15T11:00:00Z"
```

Delete an event:
```bash
node /opt/cal-cli/dist/index.js delete "Calendar Name" --title "Meeting"
```

## Tips

- Default to 7-day lookahead unless the user specifies a range
- When creating events, confirm the time and calendar with the user first
- Use ISO 8601 format for dates/times
