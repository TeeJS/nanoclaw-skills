---
name: google-calendar
description: Read and manage Google Calendar events. Use for scheduling, checking availability, or creating events. Triggers on any Google Calendar or scheduling request.
allowed-tools: Bash(gog:*)
---

# Google Calendar (gog CLI)

**IMPORTANT:** `gog calendar events` only queries ONE calendar at a time (defaults to primary). The user may have multiple calendars (e.g. F1 schedule, shared calendars). **Always query ALL calendars** when listing events:

```bash
for cal in $(gog calendar calendars --plain | tail -n+2 | cut -f1); do
  gog calendar events --from today --to "+7d" "$cal" 2>/dev/null
done
```

List calendars:
```bash
gog calendar calendars
```

Query a specific calendar by ID:
```bash
gog calendar events --from "2025-01-15" --to "2025-01-16" "CALENDAR_ID"
```

Create an event:
```bash
gog calendar create --title "Meeting" --start "2025-01-15T10:00:00" --end "2025-01-15T11:00:00" --calendar "primary"
```

## Tips

- Default to 7-day lookahead unless the user specifies a range
- When creating events, confirm the time and calendar with the user first
- Use ISO 8601 format for dates/times
