#!/bin/bash
# doppler-vscode-ssh.sh

# ==============================================================================
# AI-GENERATED CODE DISCLAIMER
# This code was generated with the assistance of an AI. 
# Please review and test thoroughly before using in a production environment.
# ==============================================================================

LOG_FILE="/tmp/doppler-vscode.log"
echo "=== NEW CONNECTION AT $(date) ===" >> "$LOG_FILE"

HOST=""
for ((i=1; i<=$#; i++)); do
    arg="${!i}"
    case "$arg" in
        -[46AaCcfGgKkMNnqQsTtVvXxYy]) ;; 
        -[BbcDEeFIiJLlmOoPpQRrSWw]) ((i++)) ;; 
        -*) ;; 
        *)
            if [ -z "$HOST" ]; then
                HOST="$arg"
            fi
            ;;
    esac
done

if [ -z "$HOST" ]; then
    exec ssh "$@"
fi

NODE="${HOST#*@}"
TEMPLATE_PATH="$HOME/.ssh/${NODE}.key.tmpl"

# If the template exists, we intercept!
if [ -f "$TEMPLATE_PATH" ]; then
    echo "Template found. Preparing Doppler connection..." >> "$LOG_FILE"
    
    # 1. Authorize via Service Token
    if [ -f "$HOME/.ssh/doppler_token" ]; then
        export DOPPLER_TOKEN="$(cat "$HOME/.ssh/doppler_token")"
    else
        echo "FATAL: ~/.ssh/doppler_token not found." >> "$LOG_FILE"
        exit 1
    fi
    
    DOPPLER_BIN=$(command -v doppler || echo "/opt/homebrew/bin/doppler")
    if [ ! -x "$DOPPLER_BIN" ]; then
        DOPPLER_BIN="/usr/local/bin/doppler"
    fi
    
    # 2. Explicitly fetch the exact variables we need (Bypassing VS Code env stripping)
    PREFIX=$(echo "$NODE" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
    USER_VAR="${PREFIX}_USER"
    HOST_VAR="${PREFIX}_HOST"
    
    TARGET_USER=$("$DOPPLER_BIN" secrets get "$USER_VAR" --project ssh-tokens --config dev --plain 2>>"$LOG_FILE")
    TARGET_HOST=$("$DOPPLER_BIN" secrets get "$HOST_VAR" --project ssh-tokens --config dev --plain 2>>"$LOG_FILE")
    
    # 3. If we got them, build the final command and execute
    if [ -n "$TARGET_USER" ] && [ -n "$TARGET_HOST" ]; then
        TARGET="${TARGET_USER}@${TARGET_HOST}"
        echo "SUCCESS: Fetched target -> $TARGET" >> "$LOG_FILE"
        
        # Swap the dummy host for the real target in the argument list
        NEW_ARGS=()
        for arg in "$@"; do
            if [ "$arg" = "$HOST" ]; then
                NEW_ARGS+=("$TARGET")
            else
                NEW_ARGS+=("$arg")
            fi
        done
        
        KEY_FILE="/tmp/doppler-ssh-${NODE}-$$.key"
        
        # Fire the final Doppler command to mount the key and launch SSH
        exec "$DOPPLER_BIN" run --project ssh-tokens --config dev \
            --mount "$KEY_FILE" --mount-template "$TEMPLATE_PATH" \
            --mount-max-reads 3 \
            -- ssh -i "$KEY_FILE" "${NEW_ARGS[@]}"
    else
        echo "FATAL: Failed to fetch $USER_VAR or $HOST_VAR." >> "$LOG_FILE"
        exit 1
    fi
else
    # Standard connection fallback
    exec ssh "$@"
fi