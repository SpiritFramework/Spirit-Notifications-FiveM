// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Notifications] NUI Loaded and Ready');
    
    // Force transparent background on entire document
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
});

const container = document.getElementById('notifications-container');
const notifications = [];
const CONFIG = {
    maxNotifications: 5,
    soundEnabled: false
};

function createProgressBar(duration) {
    const progress = document.createElement('div');
    progress.className = 'notification-progress';
    progress.style.animation = `shrink ${duration}ms linear forwards`;
    return progress;
}

function showNotification(type, message, duration) {
    console.log('[Notifications] Creating:', type, message);
    
    // Prevent duplicates
    const recentDuplicate = notifications.find(n => 
        n.message === message && (Date.now() - n.created) < 1000
    );
    if (recentDuplicate) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: '✓',
        error: '✗',
        info: 'ℹ',
        warning: '⚠',
        default: '•'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${iconMap[type] || iconMap.default}</span>
            <span class="notification-message">${escapeHtml(message)}</span>
        </div>
    `;
    
    const progressBar = createProgressBar(duration);
    notification.appendChild(progressBar);
    
    // Add to container
    container.appendChild(notification);
    
    const notifData = {
        element: notification,
        message: message,
        created: Date.now(),
        timeout: setTimeout(() => {
            removeNotification(notification);
        }, duration)
    };
    
    notifications.push(notifData);
    
    // Hover effects
    notification.addEventListener('mouseenter', () => {
        progressBar.style.animationPlayState = 'paused';
        clearTimeout(notifData.timeout);
    });
    
    notification.addEventListener('mouseleave', () => {
        progressBar.style.animationPlayState = 'running';
        const remaining = duration * (progressBar.offsetWidth / notification.offsetWidth);
        notifData.timeout = setTimeout(() => removeNotification(notification), remaining);
    });
    
    notification.addEventListener('click', () => removeNotification(notification, true));
    
    // Enforce limit
    while (notifications.length > CONFIG.maxNotifications) {
        removeNotification(notifications[0].element);
    }
}

function removeNotification(element, immediate = false) {
    const index = notifications.findIndex(n => n.element === element);
    if (index === -1) return;
    
    clearTimeout(notifications[index].timeout);
    notifications.splice(index, 1);
    
    element.classList.add('removing');
    setTimeout(() => {
        if (element.parentNode) element.parentNode.removeChild(element);
    }, immediate ? 0 : 300);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Listen for Lua messages
window.addEventListener('message', function(event) {
    const data = event.data;
    console.log('[Notifications] Received message:', data);
    
    if (data.action === 'showNotification') {
        showNotification(data.type, data.message, data.duration);
    } else if (data.action === 'forceRemoveOldest') {
        if (notifications.length > 0) {
            removeNotification(notifications[0].element);
        }
    } else if (data.action === 'clearAll') {
        notifications.forEach(n => removeNotification(n.element, true));
    }
});