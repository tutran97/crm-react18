#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export HOME="/home/ubuntu/"
sudo PM2_HOME=/home/ubuntu/.pm2 pm2 list

sudo chown -R ubuntu:ubuntu /home/ubuntu/vhcrm_frontend/
cd /home/ubuntu/vhcrm_frontend/
yarn install
npm run build
pm2 restart all