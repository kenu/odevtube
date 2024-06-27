#!/bin/zsh
. ~/.zshrc

cd ~/git/youtb
git pull origin main
pnpm i
cd ~/git/youtb/web
pnpm i
pm2 restart youtb --update-env
sleep 2
pm2 list


curl -X POST -H 'Content-type: application/json' --data '{"content":"Deploy Finished!\nhttps://mp4.okdevtv.com/"}' $KENUWEBHOOK
