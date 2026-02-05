# 🔔 Spirit-Notifications

A sleek, customizable notification system for FiveM. Lightweight, modern, and easy to integrate into any resource.

## Quick Start

```lua
-- Client-side usage
exports['YourNotificationSystem']:Notify({
    title = 'Success',
    message = 'Operation completed!',
    type = 'success',
    duration = 5000
})

-- Or simplified
exports['YourNotificationSystem']:Notify('Title', 'Message', 'info', 5000)
