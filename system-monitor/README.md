# System Monitor Script

`system-monitor.sh` records CPU, memory, and disk utilization in a single timestamped line. By default it appends to `/tmp/system-monitor.log` and checks the root filesystem.

## Install

```bash
chmod +x system-monitor.sh
sudo install -m 0755 system-monitor.sh /usr/local/bin/system-monitor
```

## Run once

```bash
/usr/local/bin/system-monitor
```

Example output:

```text
2026-07-31T00:35:12+00:00 cpu=7.4% load=0.14,0.10,0.08 cores=4 memory=38.2%(3129.4/8192.0MiB,available=4754.2MiB) disk=42%(39.11/93.12GiB,available=49.68GiB,path=/)
```

## Run every five minutes with cron

```cron
*/5 * * * * /usr/local/bin/system-monitor >/dev/null 2>&1
```

The script itself performs one sample and exits. Cron provides the requested five-minute interval, preventing duplicate long-running monitor processes.

## Configuration

Override the log location or checked filesystem with environment variables:

```bash
LOG_FILE=/var/log/system-monitor.log DISK_PATH=/home /usr/local/bin/system-monitor
```

Cron example with a custom log:

```cron
*/5 * * * * LOG_FILE=/var/log/system-monitor.log DISK_PATH=/ /usr/local/bin/system-monitor >/dev/null 2>&1
```

Ensure the cron user has write access to the selected log directory.

## Verification

```bash
bash -n system-monitor.sh
LOG_FILE="$(mktemp)" ./system-monitor.sh
cat "$LOG_FILE"
```

The implementation:

- samples `/proc/stat` twice to calculate CPU utilization;
- reads memory figures from `free -b`;
- reads POSIX-formatted disk information from `df -P -B1`;
- includes ISO-8601 timestamps;
- fails clearly when a required command is missing;
- supports custom log and disk paths without editing the script.
