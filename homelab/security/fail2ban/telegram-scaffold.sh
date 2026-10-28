#!/bin/bash
# ---
# AI DISCLAIMER: This script was generated with the assistance of an AI. 
# Verify all commands and API endpoints before deployment in production.
# ---

TOKEN=""
CHAT_ID=""
JAIL_NAME=$1
IP_ADDRESS=$2
SECONDS=$3

# 1. Convert seconds to human readable format
if [ "$SECONDS" -ge 2592000 ]; then
    TIME="$((SECONDS/2592000)) months"
elif [ "$SECONDS" -ge 604800 ]; then
    TIME="$((SECONDS/604800)) weeks"
elif [ "$SECONDS" -ge 86400 ]; then
    TIME="$((SECONDS/86400)) days"
elif [ "$SECONDS" -ge 3600 ]; then
    TIME="$((SECONDS/3600)) hours"
else
    TIME="$((SECONDS/60)) minutes"
fi

# 2. Fetch GeoIP Data
# Using ip-api.com (JSON format)
GEO_DATA=$(curl -s "http://ip-api.com/json/$IP_ADDRESS?fields=status,country,city,isp,lat,lon")

if [[ $(echo $GEO_DATA | grep -o '"status":"success"') ]]; then
    COUNTRY=$(echo $GEO_DATA | sed -e 's/.*"country":"\([^"]*\)".*/\1/')
    CITY=$(echo $GEO_DATA | sed -e 's/.*"city":"\([^"]*\)".*/\1/')
    ISP=$(echo $GEO_DATA | sed -e 's/.*"isp":"\([^"]*\)".*/\1/')
    LAT=$(echo $GEO_DATA | sed -e 's/.*"lat":\([^,]*\).*/\1/')
    LON=$(echo $GEO_DATA | sed -e 's/.*"lon":\([^,]*\).*/\1/')
    
    GEO_INFO="📍 Location: $CITY, $COUNTRY\n🏢 ISP: $ISP"
    MAPS_LINK="\n🗺️ [Google Maps](https://www.google.com/maps?q=$LAT,$LON)"
else
    GEO_INFO="📍 Location: Unknown"
    MAPS_LINK=""
fi

# 3. Assemble the Message
WHOIS_LINK="🔍 [Whois Lookup](https://whois.domaintools.com/$IP_ADDRESS)"

# Use printf for better handling of newlines in the message
MESSAGE=$(printf "🚨 *Fail2ban Alert*\n\n*Jail:* [$JAIL_NAME]\n*IP:* $IP_ADDRESS\n*Duration:* $TIME\n\n$GEO_INFO\n\n$WHOIS_LINK$MAPS_LINK")

# 4. Send to Telegram (using Markdown for the links)
curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
    -d "chat_id=$CHAT_ID" \
    -d "parse_mode=Markdown" \
    -d "text=$MESSAGE"