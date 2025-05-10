#!/bin/zsh
. ~/.zshrc

cd ~/git/odevtube
git pull origin main
pnpm i
cd ~/git/odevtube/web
pnpm i
pm2 restart odevtube --update-env
sleep 2
pm2 list


curl -X POST -H 'Content-type: application/json' --data '{"content":"📦 Deploy Finished!\nhttps://mp4.okdevtv.com/"}' $WEBHOOK_DISCORD_MP4_URL
