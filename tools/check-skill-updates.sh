#!/bin/bash
#
# Monitor blader/humanizer for updates
# If SKILL.md changes, update our copy

REPO_URL="https://raw.githubusercontent.com/blader/humanizer/main/SKILL.md"
LOCAL_PATH="/home/openclaw/.openclaw/workspace/agents/content-designer/SKILL.md"
TEMP_FILE="/tmp/humanizer-skill-check.md"
LOG_FILE="/home/openclaw/.openclaw/workspace/logs/skill-updates.log"

mkdir -p "$(dirname "$LOG_FILE")"

# Download latest version
curl -s "$REPO_URL" -o "$TEMP_FILE" 2>/dev/null

if [ ! -f "$TEMP_FILE" ]; then
    echo "$(date): Failed to download skill from GitHub" >> "$LOG_FILE"
    exit 1
fi

# Check if files differ
if ! diff -q "$TEMP_FILE" "$LOCAL_PATH" > /dev/null 2>&1; then
    echo "$(date): Skill update detected - updating local copy" >> "$LOG_FILE"
    
    # Backup current version
    cp "$LOCAL_PATH" "${LOCAL_PATH}.backup.$(date +%Y%m%d-%H%M%S)"
    
    # Update to new version
    cp "$TEMP_FILE" "$LOCAL_PATH"
    
    # Commit to our repo
    cd /home/openclaw/.openclaw/workspace
    git add agents/content-designer/SKILL.md
    git commit -m "Auto-update: humanizer skill from blader/humanizer"
    git push origin main 2>/dev/null || echo "$(date): Failed to push update" >> "$LOG_FILE"
    
    echo "$(date): Skill updated and committed" >> "$LOG_FILE"
else
    echo "$(date): No changes detected" >> "$LOG_FILE"
fi

rm -f "$TEMP_FILE"
