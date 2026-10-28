#!/bin/bash
# Set the host to localhost:8266
HOST="localhost:8265"

# Make a POST request to the '/api/v2/cruddb' endpoint to get all files from the 'FileJSONDB' collection
FILES_RESPONSE=$(curl -s -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"data": {"collection": "FileJSONDB", "mode": "getAll"}}' "$HOST/api/v2/cruddb")

# Calculate the timestamp for 30 days ago
THIRTY_DAYS_AGO=$(($(date +%s) - 30*24*60*60))

# Iterate through all the files in the 'FileJSONDB' collection
echo "$FILES_RESPONSE" | jq -c '.[]' | while read -r FILE; do
    TRANSCODE_DECISION=$(echo "$FILE" | jq -r '.TranscodeDecisionMaker')
    FILE_MTIME=$(echo "$FILE" | jq -r '.statSync.mtimeMs' | cut -d'.' -f1)
    FILE_ID=$(echo "$FILE" | jq -r '._id')
    
    # Convert FILE_MTIME to seconds (from milliseconds)
    FILE_MTIME_SEC=$((FILE_MTIME / 1000))

    # Check if the file's TranscodeDecisionMaker is 'Not required' and its modification time is older than 30 days
    if [[ "$TRANSCODE_DECISION" == "Not required" && $FILE_MTIME_SEC -lt $THIRTY_DAYS_AGO ]]; then
        # Log that the file is older than 30 days
        echo "${FILE_ID} is older than 30 days."

        # Make a POST request to update the file's TranscodeDecisionMaker to 'Queued'
        UPDATE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d "{\"data\": {\"collection\": \"FileJSONDB\", \"mode\": \"update\", \"docID\": \"$FILE_ID\", \"obj\": {\"TranscodeDecisionMaker\": \"Queued\"}}}" "$HOST/api/v2/cruddb")
        
        # Log the updated file's ID and response code
        echo "Updated ${FILE_ID}: ${UPDATE_RESPONSE}"
    fi
done
