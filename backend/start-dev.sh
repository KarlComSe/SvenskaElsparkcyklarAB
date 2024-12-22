#!/bin/sh
#Original version:
#./watch-package.json.sh &
#npm run start:dev

#improved proposed version by chatGPT / claude

# Exit on error
set -e

echo "=== Starting development server ==="
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la
# Create log directory if it doesn't exist
mkdir -p /var/log
touch /var/log/package-monitor.log

# Handle cleanup on script exit
cleanup() {
    echo "Cleaning up..."
    # Remove lock file if it exists
    rm -f /tmp/package.json.lock
    # Kill all child processes
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Set up signal trapping
trap cleanup INT TERM

# Start the package.json watcher in the background
./watch-package.json.sh &
WATCHER_PID=$!

# If RESET_DB is true, run the database reset
if [ "$RESET_DB" = "true" ]; then
    echo "Resetting database..."
    npm run prestart:dev
fi

# Start the development server
echo "Starting NestJS development server..."
npm run start:dev &
SERVER_PID=$!

# Tail the package monitor log in the background
tail -f /var/log/package-monitor.log &

# Wait for any process to exit
while jobs %% > /dev/null 2>&1; do
    sleep 1
done

# If either process exits, cleanup and exit
cleanup