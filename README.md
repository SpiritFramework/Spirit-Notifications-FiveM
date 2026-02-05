# 🔔 Spirit-Notifications

A sleek, customizable notification system for FiveM. Lightweight, modern, and easy to integrate into any resource.

## Quick Start

```lua
-- Client-side usage (Event-based)
TriggerEvent('notifications:show', 'success', 'Operation completed!', 5000)

-- Available types: 'success', 'info', 'warning', 'error'
TriggerEvent('notifications:show', 'error', 'Something went wrong!', 3000)

| Type      | Icon | Color  | Use Case                             |
| --------- | ---- | ------ | ------------------------------------ |
| `success` | ✓    | Green  | Completed actions, positive feedback |
| `info`    | ℹ    | Blue   | General information, updates         |
| `warning` | ⚠    | Yellow | Caution, requires attention          |
| `error`   | ✕    | Red    | Failed operations, critical alerts   |

-- Simple notification
TriggerEvent('notifications:show', 'info', 'Welcome to the server!', 4000)

-- Warning with longer duration
TriggerEvent('notifications:show', 'warning', 'You are entering a restricted area!', 6000)

-- Error notification
TriggerEvent('notifications:show', 'error', 'Insufficient funds!', 3000)
