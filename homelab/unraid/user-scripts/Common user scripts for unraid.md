# Common User Scripts for Unraid

This folder contains common operational and maintenance user scripts tailored for Unraid systems.

> **Disclaimer**: These scripts are provided for documentation and knowledge base purposes. Always test on your own hardware and configuration before running them in a production array.

---

## 📜 Script Index (6 scripts)

| Script | Purpose |
| :--- | :--- |
| [`autofanAutostart.sh`](autofanAutostart.sh) | Ensures the Dynamix System Autofan plugin service starts automatically on system boot. |
| [`HBAFanControl.sh`](HBAFanControl.sh) | Monitors LSI/Broadcom HBA chip temperature via storcli and adjusts PWM fan speed dynamically with hysteresis and Unraid alert notifications. |
| [`nvidiaDriverUnlock.sh`](nvidiaDriverUnlock.sh) | Downloads and applies the keylase patch to remove artificial NVENC encoding session limits on consumer NVIDIA GPUs. |
| [`nvidiaPowerState.sh`](nvidiaPowerState.sh) | Enables NVIDIA driver persistence daemon (nvidia-persistenced) to manage power states efficiently. |
| [`nvidiaSpaceInvaderPowerState.sh`](nvidiaSpaceInvaderPowerState.sh) | Advanced script (SpaceInvaderOne pattern) to cycle NVIDIA GPU power states and optimize idle power draw. |
| [`tdarrRollingQueue.sh`](tdarrRollingQueue.sh) | Queries the Tdarr database for media files older than 30 days previously marked as 'Not required' and re-queues them for health check / transcoding. |
