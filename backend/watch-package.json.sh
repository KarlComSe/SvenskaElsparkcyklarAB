#!/bin/bash
# Created with help of chatGPT / claude.

# Initialize variables
LAST_HASH=$(md5sum /app/package.json | awk '{print $1}')
DEBOUNCE_SECONDS=3
TIMER_PID=""
LOCK_FILE="/tmp/package.json.lock"
LOG_FILE="/var/log/package-monitor.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Create a temporary script that can be run with sudo
create_install_script() {
    cat << 'EOF' > /tmp/npm-install.sh
cd /app && npm install --include=dev
EOF
    chmod +x /tmp/npm-install.sh
}

# Create the install script immediately when this script starts
create_install_script

inotifywait -m -e modify,create,delete /app/package.json |
while read -r directory event filename; do
    # Kill previous timer if it exists
    if [ ! -z "$TIMER_PID" ] && kill -0 $TIMER_PID 2>/dev/null; then
        kill $TIMER_PID
        log_message "Debouncing previous change..."
    fi

    # Start a new timer
    (
        touch "$LOCK_FILE"
        sleep $DEBOUNCE_SECONDS

        if [ ! -f /app/package.json ]; then
            log_message "package.json deleted; skipping..."
            rm -f "$LOCK_FILE"
            exit
        fi
        CURRENT_HASH=$(md5sum /app/package.json | awk '{print $1}')
        if [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
            log_message "Package.json changed ($event), installing dependencies..."
            /tmp/npm-install.sh 1>> "$LOG_FILE" 2>&1
            LAST_HASH=$CURRENT_HASH
        else
            echo "File event triggered but content unchanged, skipping install"
        fi
        rm -f "$LOCK_FILE"
    ) & TIMER_PID=$!
done