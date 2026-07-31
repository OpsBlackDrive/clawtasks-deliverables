#!/usr/bin/env bash
# system-monitor.sh
# Logs CPU, memory, and disk usage with timestamps.
# Designed to be run every five minutes from cron or a systemd timer.

set -Eeuo pipefail

LOG_FILE="${LOG_FILE:-/tmp/system-monitor.log}"
DISK_PATH="${DISK_PATH:-/}"

log_error() {
  printf '%s ERROR %s\n' "$(date --iso-8601=seconds)" "$*" >&2
}

trap 'log_error "monitor failed on line $LINENO"' ERR

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    log_error "required command not found: $1"
    exit 1
  }
}

for command_name in awk date df free grep head mkdir mktemp mv nproc sed sleep; do
  require_command "$command_name"
done

mkdir -p "$(dirname "$LOG_FILE")"

# Calculate CPU utilization from two /proc/stat samples.
read_cpu_sample() {
  local cpu user nice system idle iowait irq softirq steal guest guest_nice
  read -r cpu user nice system idle iowait irq softirq steal guest guest_nice < /proc/stat

  local idle_all=$((idle + iowait))
  local non_idle=$((user + nice + system + irq + softirq + steal))
  local total=$((idle_all + non_idle))

  printf '%s %s\n' "$total" "$idle_all"
}

read -r total_before idle_before < <(read_cpu_sample)
sleep 1
read -r total_after idle_after < <(read_cpu_sample)

total_delta=$((total_after - total_before))
idle_delta=$((idle_after - idle_before))

if (( total_delta > 0 )); then
  cpu_percent="$(awk -v total="$total_delta" -v idle="$idle_delta" 'BEGIN { printf "%.1f", ((total-idle)/total)*100 }')"
else
  cpu_percent="0.0"
fi

# `free -b` is used to avoid locale-dependent unit parsing.
read -r memory_total memory_used memory_available < <(
  free -b | awk '/^Mem:/ { print $2, $3, $7 }'
)

memory_percent="$(awk -v used="$memory_used" -v total="$memory_total" 'BEGIN { if (total > 0) printf "%.1f", (used/total)*100; else print "0.0" }')"
memory_used_mib="$(awk -v bytes="$memory_used" 'BEGIN { printf "%.1f", bytes/1048576 }')"
memory_total_mib="$(awk -v bytes="$memory_total" 'BEGIN { printf "%.1f", bytes/1048576 }')"
memory_available_mib="$(awk -v bytes="$memory_available" 'BEGIN { printf "%.1f", bytes/1048576 }')"

read -r disk_total disk_used disk_available disk_percent < <(
  df -P -B1 "$DISK_PATH" | awk 'NR==2 { gsub(/%/, "", $5); print $2, $3, $4, $5 }'
)

disk_used_gib="$(awk -v bytes="$disk_used" 'BEGIN { printf "%.2f", bytes/1073741824 }')"
disk_total_gib="$(awk -v bytes="$disk_total" 'BEGIN { printf "%.2f", bytes/1073741824 }')"
disk_available_gib="$(awk -v bytes="$disk_available" 'BEGIN { printf "%.2f", bytes/1073741824 }')"

load_average="$(awk '{ print $1 "," $2 "," $3 }' /proc/loadavg)"
process_count="$(grep -c '^processor' /proc/cpuinfo || nproc)"
timestamp="$(date --iso-8601=seconds)"

line=$(printf '%s cpu=%s%% load=%s cores=%s memory=%s%%(%s/%sMiB,available=%sMiB) disk=%s%%(%s/%sGiB,available=%sGiB,path=%s)' \
  "$timestamp" \
  "$cpu_percent" \
  "$load_average" \
  "$process_count" \
  "$memory_percent" \
  "$memory_used_mib" \
  "$memory_total_mib" \
  "$memory_available_mib" \
  "$disk_percent" \
  "$disk_used_gib" \
  "$disk_total_gib" \
  "$disk_available_gib" \
  "$DISK_PATH")

# Append atomically enough for ordinary single-host cron usage.
printf '%s\n' "$line" >> "$LOG_FILE"
printf '%s\n' "$line"
