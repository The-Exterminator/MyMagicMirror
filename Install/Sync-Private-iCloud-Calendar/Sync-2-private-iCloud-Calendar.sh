#!/bin/bash
cd

echo -e "\033[33;1mInstallation of vdirsyncer\033[0m"
sudo apt-get install libxml2 libxslt1.1 zlib1g python3
pip3 install --user --ignore-installed vdirsyncer

echo -e "\033[33;1mAnd change the first line to !/usr/bin/python3\033[0m"
read -p "Press enter to continue."
nano ~/.local/bin/vdirsyncer

sudo ln -s /home/pi/.local/bin/vdirsyncer /usr/bin/vdirsyncer

echo -e "\033[33;1mCreate a folder for the calendar file\033[0m"
mkdir /home/pi/MagicMirror/modules/calendars

echo -e "\033[33;1mConfigure vdirsyncer\033[0m"
mkdir ~/.vdirsyncer
touch ~/.vdirsyncer/config
echo -e "\033[33;1mINSERT YOU AppleID below username and PASSWORD Credentials below password.\033[0m"
echo -e "\033[33;1mRemember to enter both [storage iCloud 1] and [storage iCloud2].\033[0m"
echo -e "\033[31;0mHow to generate an app-specific\033[0m"
echo -e "\033[33;1m1.) Sign in to appleid.apple.com.\033[0m"
echo -e "\033[33;1m2.) In the Sign-In and Security section, click App-Specific Passwords.\033[0m"
echo -e "\033[33;1m3.) Click Generate an app-specific password or click Blue plus sign icon., then follow the steps on your screen.\033[0m"
echo -e "\033[33;1mAfter you generate your app-specific password, enter or paste it into the password field of the app.\033[0m"
read -p "Press enter to continue"
cp ~/MagicMirror/modules/MyMagicMirror/Install/Sync-Private-iCloud-Calendar/Sync-2-private-iCloud-Calendar ~/.vdirsyncer/config
nano ~/.vdirsyncer/config

echo -e "\033[33;1mRunning vdirsyncer as a systemd.timer for automatic sync.\033[0m"
curl https://raw.githubusercontent.com/pimutils/vdirsyncer/master/contrib/vdirsyncer.service | sudo tee /etc/systemd/user/vdirsyncer.service
curl https://raw.githubusercontent.com/pimutils/vdirsyncer/master/contrib/vdirsyncer.timer | sudo tee /etc/systemd/user/vdirsyncer.timer
systemctl --user enable vdirsyncer.timer

vdirsyncer discover

echo -e "\033[33;1mNow replace the HERE-GOES-THE-UUID-OF-THE-CALENDAR-YOU-WANT-TO-SYNC in the config with the UUID of the calendar you want to sync.\033[0m"
echo -e "\033[33;1mRemember to enter both [storage iCloud 1] and [storage iCloud2].\033[0m"
read -p "Press enter to continue."
nano ~/.vdirsyncer/config

vdirsyncer discover
echo -e "\033[33;1mNow we can start the sync.\033[0m"
echo -e "\033[33;1mBy default, the syncer is started every 15 minutes.\033[0m"
read -p "Press enter to continue."

vdirsyncer sync
