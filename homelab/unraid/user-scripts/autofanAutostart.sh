#!/bin/bash
autofan_script="/usr/local/emhttp/plugins/dynamix.system.autofan/scripts/rc.autofan"
if [[ -x $autofan_script ]]; then
  echo "Starting Dynamix System Autofan plugin..."
  $autofan_script start
else
  echo "Dynamix System Autofan script not found or not executable."
fi
