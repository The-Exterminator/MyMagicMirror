#!/bin/bash

echo -e "\033[33;1mDelete the old Node.js version:\033[0m"
sudo apt purge nodejs

echo -e "\033[33;1mDownload and install Node.js version 16:\033[0m"
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "\033[33;1mClone the repository and check out the master branch:\033[0m"
git clone https://github.com/MichMich/MagicMirror
cd MagicMirror/
npm install --only=prod --omit=dev
cp config/config.js.sample config/config.js

echo -e "\033[33;1mUpdate npm to 8.7.0\033[0m"
sudo npm install -g npm@8.7.0

echo -e "\033[33;1mInstall MyMagicMirror\033[0m"
cd ~/MagicMirror/modules

git clone https://github.com/The-Exterminator/MyMagicMirror.git

cd ~/MagicMirror/modules/MyMagicMirror/Install
chmod +x MMM-Install-Choice.sh
./MMM-Install-Choice.sh
