#!/bin/zsh
. ~/.zshrc

node ~/git/odevtube/cron/cron-channel.js >> /tmp/channel.log
node ~/git/odevtube/cron/cron-video.js >> /tmp/video.log
node ~/git/odevtube/cron/cron-hourly.js >> /tmp/hourly.log

curl -X POST -H 'Content-type: application/json' --data '{"content":"⏱️ Cron Job Finished!\nhttps://mp4.okdevtv.com/"}' $WEBHOOK_DISCORD_MP4_URL
