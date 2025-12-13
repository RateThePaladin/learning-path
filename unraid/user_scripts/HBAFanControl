#!/bin/bash

# --- CONFIGURATION ---
# Controller Index (usually c0 for the first card)
CONTROLLER="/c0"

# Fan Paths
PWM_FILE="/sys/devices/platform/nct6775.656/hwmon/hwmon5/pwm1"
ENABLE_FILE="/sys/devices/platform/nct6775.656/hwmon/hwmon5/pwm1_enable"

# Unraid Notification Script Path
NOTIFY_SCRIPT="/usr/local/emhttp/webGui/scripts/notify"

# Check interval in seconds
INTERVAL=60

# Heartbeat: Force a log entry every X intervals if no change occurs
# 60 intervals * 1 minute = 1 hour
HEARTBEAT_INTERVAL=60

# Fan Curve Settings (Temp in Celsius, Speed 0-255)
# 255 = 100%, 128 = ~50%
TEMP_HIGH=72
PWM_HIGH=255

TEMP_MED=65
PWM_MED=150

TEMP_LOW=55
PWM_LOW=90

PWM_IDLE=60  # Speed when cooler than TEMP_LOW

# --- INTERNAL VARIABLES ---
LAST_PWM=""
LOOP_COUNT=0
ERROR_SENT=0 # Flag to prevent alert spam

# --- FUNCTIONS ---

# Log to User Scripts UI and Syslog
log_msg() {
    local MSG="$1"
    local TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] $MSG"
    logger -t "HBA_Fan_Control" "$MSG"
}

# Send Unraid Notification (Appears in top right of GUI / Email / Telegram)
send_alert() {
    local MSG="$1"
    local SEVERITY="$2" # normal, warning, alert
    
    if [ -x "$NOTIFY_SCRIPT" ]; then
        $NOTIFY_SCRIPT -e "HBA Fan Control" -s "HBA Fan Monitor" -d "$MSG" -i "$SEVERITY"
    fi
    log_msg "ALERT SENT ($SEVERITY): $MSG"
}

# --- LOGIC START ---

# Ensure Manual Mode is enabled on script start
if [ -f "$ENABLE_FILE" ]; then
    echo 1 > "$ENABLE_FILE"
    log_msg "Enabled manual control on $ENABLE_FILE"
else
    MSG="ERROR - Enable file not found at $ENABLE_FILE. Script cannot control fan."
    send_alert "$MSG" "alert"
    exit 1
fi

log_msg "Starting loop for controller ${CONTROLLER}. Interval: ${INTERVAL}s. Heartbeat: ${HEARTBEAT_INTERVAL} loops."

while true; do
    # Extract ROC (Chip) Temperature using storcli
    # Updated delimiter to '=' for: "ROC temperature(Degree Celsius) = 61"
    CURRENT_TEMP=$(storcli $CONTROLLER show all | grep -i "ROC Temperature" | awk -F'=' '{print $2}' | grep -oE '[0-9]+')

    # FAILSAFE: If temp is empty (command failed), go full speed
    if [[ -z "$CURRENT_TEMP" ]]; then
        # Only alert once per failure event to avoid spam
        if [[ "$ERROR_SENT" -eq 0 ]]; then
            send_alert "Critical: Could not read HBA Temp. Fan set to MAX to prevent overheating." "alert"
            ERROR_SENT=1
        fi
        
        # Force Max Speed
        echo 255 > "$PWM_FILE"
        
        # Force a log entry on error
        log_msg "FAILSAFE ACTIVE: Temp unreadable. Fan set to 100%."
        
    else
        # RECOVERY: If we were in error state, notify recovery
        if [[ "$ERROR_SENT" -eq 1 ]]; then
            send_alert "Recovery: HBA Temp reading restored ($CURRENT_TEMP C)." "normal"
            ERROR_SENT=0
        fi

        # Calculate Target PWM
        if [[ "$CURRENT_TEMP" -ge "$TEMP_HIGH" ]]; then
            TARGET_PWM=$PWM_HIGH
        elif [[ "$CURRENT_TEMP" -ge "$TEMP_MED" ]]; then
            TARGET_PWM=$PWM_MED
        elif [[ "$CURRENT_TEMP" -ge "$TEMP_LOW" ]]; then
            TARGET_PWM=$PWM_LOW
        else
            TARGET_PWM=$PWM_IDLE
        fi

        # Apply the speed
        echo "$TARGET_PWM" > "$PWM_FILE"
        
        # LOGGING STRATEGY:
        # Only log if PWM changed OR if we hit the heartbeat interval (1 hour)
        # This prevents runaway logs in the User Scripts UI.
        if [[ "$TARGET_PWM" != "$LAST_PWM" ]] || [[ "$LOOP_COUNT" -ge "$HEARTBEAT_INTERVAL" ]]; then
            log_msg "HBA Temp: ${CURRENT_TEMP}C | Fan PWM: $TARGET_PWM"
            LAST_PWM=$TARGET_PWM
            LOOP_COUNT=0
        fi
        
        ((LOOP_COUNT++))
    fi

    sleep $INTERVAL
done
