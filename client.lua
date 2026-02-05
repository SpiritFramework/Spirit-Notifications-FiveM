-- Enhanced Notification System for FiveM
-- Usage: TriggerEvent('notifications:show', type, message, duration)

local Config = {
    DefaultDuration = 5000,
    MaxNotifications = 5,
    DebugMode = false  -- Set to false in production
}

local activeNotifications = 0

-- CRITICAL: Ensure NUI is ready
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    print("[Notifications] Resource started, NUI should load automatically")
end)

function ShowNotification(type, message, duration)
    if not message or message == "" then
        print("[Notifications] Error: Empty message")
        return
    end
    
    type = type or "default"
    duration = tonumber(duration) or Config.DefaultDuration
    duration = math.max(1000, math.min(duration, 30000))
    
    if activeNotifications >= Config.MaxNotifications then
        SendNUIMessage({ action = 'forceRemoveOldest' })
        activeNotifications = activeNotifications - 1
    end
    
    -- CRITICAL: Send the message with correct structure
    SendNUIMessage({
        action = 'showNotification',
        type = type,
        message = tostring(message),
        duration = duration
    })
    
    if Config.DebugMode then
        print("[Notifications] Sent: " .. type .. " | " .. message)
    end
    
    activeNotifications = activeNotifications + 1
    
    Citizen.SetTimeout(duration + 500, function()
        activeNotifications = math.max(0, activeNotifications - 1)
    end)
end

exports('Show', ShowNotification)

RegisterNetEvent('notifications:show')
AddEventHandler('notifications:show', function(type, message, duration)
    ShowNotification(type, message, duration)
end)

RegisterNetEvent('notifications:showFromServer')
AddEventHandler('notifications:showFromServer', function(type, message, duration)
    ShowNotification(type, message, duration)
end)

-- Debug commands
RegisterCommand('notify', function(source, args, rawCommand)
    local notifyType = args[1] or 'info'
    table.remove(args, 1)
    local msg = table.concat(args, ' ') or 'Test notification'
    ShowNotification(notifyType, msg, 5000)
end, false)

RegisterCommand('notifytest', function(source, args, rawCommand)
    ShowNotification('success', 'Success test!', 5000)
    ShowNotification('error', 'Error test!', 5000)
    ShowNotification('info', 'Info test!', 5000)
    ShowNotification('warning', 'Warning test!', 5000)
end, false)

-- Test on player spawn
AddEventHandler('playerSpawned', function()
    Citizen.SetTimeout(3000, function()
        ShowNotification('info', 'Notification system ready!', 4000)
    end)
end)