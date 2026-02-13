#!/bin/zsh
. ~/.zshrc

cd ~/git/odevtube-dev
git pull origin dev
pnpm i
cd ~/git/odevtube-dev/web
pnpm i
pm2 restart odevtube-dev --update-env
sleep 2
pm2 list


curl -X POST -H 'Content-type: application/json' --data '{"content":"🧪 Dev Deploy Finished!\nhttps://dev.okdevtv.com/"}' $WEBHOOK_DISCORD_MP4_URL
