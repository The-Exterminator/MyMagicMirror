#!/bin/bash

cd ~/MagicMirror/modules/MyMagicMirror/Install/

sudo mv ~/MagicMirror/modules/MyMagicMirror/config/config.js ~/MagicMirror/config/

sudo mv ~/MagicMirror/modules/MyMagicMirror/default/calendar/calendar.css ~/MagicMirror/modules/default/calendar

sudo mv ~/MagicMirror/modules/MyMagicMirror/MMM-* ~/MagicMirror/modules/

echo -e "\033[33;1mInstall MMM-GroveGestures\033[0m"
echo
echo -e "\033[33;1m Go to Raspberry config program, set I2C (I2C_1) as enabled. Then shutdown.\033[0m"
echo -e "\033[33;1m Connect Sensor and RPI with cable. Then power on.\033[0m"
echo -e "\033[33;1m Check sudo i2cdetect -y 1 or install it.\033[0m"
read -p "Press enter to continue."
cd ~/MagicMirror/modules/MMM-GroveGestures/
npm install
cd scripts
chmod +x *.sh
cd ~/MagicMirror/modules/MMM-GroveGestures/py
cp grove_gesture_sensor.py.RPI grove_gesture_sensor.py
echo
echo -e "\033[33;1mInstall MMM-MagicMirrorCompliments\033[0m"
function ask_user_MMM-MagicMirrorCompliments() {
echo -e "\033[33;1mSelect your language file\033[0m"
echo -e "\033[33;1m
 1.) Chuvash
 2.) Danish
 3.) Dutch
 4.) English
 5.) German
 6.) Continue
\033[0m"

read -e -p "Choice 1-6: " choice

if [ "$choice" == "1" ]; then
    cp ~/MagicMirror/modules/MMM-MagicMirrorCompliments/cv-compliments.json ~/MagicMirror/modules/default/compliments

elif [ "$choice" == "2" ]; then
    cp ~/MagicMirror/modules/MMM-MagicMirrorCompliments/dk-compliments.json ~/MagicMirror/modules/default/compliments
    
elif [ "$choice" == "3" ]; then
    cp ~/MagicMirror/modules/MMM-MagicMirrorCompliments/nl-compliments.json ~/MagicMirror/modules/default/compliments

elif [ "$choice" == "4" ]; then
    cp ~/MagicMirror/modules/MMM-MagicMirrorCompliments/en-compliments.json ~/MagicMirror/modules/default/compliments

elif [ "$choice" == "5" ]; then
    cp ~/MagicMirror/modules/MMM-MagicMirrorCompliments/de-compliments.json ~/MagicMirror/modules/default/compliments

elif [ "$choice" == "6" ]; then
    cp ~/MagicMirror/modules/MMM-MagicMirrorCompliments/en-compliments.json ~/MagicMirror/modules/default/compliments
else
    echo "Please select 1, 2, 3, 4, 5 or 6." && sleep 6
    exit && ask_user_MMM-MagicMirrorCompliments
fi
}
ask_user_MMM-MagicMirrorCompliments
echo
echo -e "\033[33;1mInstall MMM-Page-Indicator\033[0m"
echo
echo -e "\033[33;1mInstall MMM-pages\033[0m"
echo
echo -e "\033[33;1mInstall MMM-Remote-Control\033[0m"
cd ~/MagicMirror/modules/MMM-Remote-Control/
npm install
echo
echo -e "\033[33;1mInstall MMM-DynamicWeather\033[0m"
cd ~/MagicMirror/modules/MMM-DynamicWeather
npm init -y
npm install request --save
echo
echo -e "\033[33;1mInstall MMM-NewsFeedBT\033[0m"
echo
echo -e "\033[33;1mInstall MMM-WeatherOrNot\033[0m"
echo
echo -e "\033[33;1mWill you install Sync private iCloud Calendar. ???\033[0m"
read -e -p "Press Y or N: "  choice
choice="${choice:-N}"
if [[ $choice =~ ^[Yy]$ ]]; then
echo
echo -e "\033[33;1mInstall calendar (Sync private iCloud Calendar)\033[0m"
cd ~/MagicMirror/modules/MyMagicMirror/Install/Sync-Private-iCloud-Calendar/
chmod +x menu.sh
./menu.sh
fi
echo
echo -e "\033[33;1mInstall MMM-CountDown\033[0m"
echo
echo -e "\033[33;1mInstall MMM-Formula1\033[0m"
cd ~/MagicMirror/modules/MMM-Formula1/
npm install --production
echo
echo -e "\033[33;1mInstall MMM-NewsFeedEB\033[0m"
echo
echo -e "\033[33;1mInstall MMM-DailyPower\033[0m"
echo
echo -e "\033[33;1mInstall MMM-NewsFeedTV2\033[0m"
echo
echo -e "\033[33;1mInstall MMM-Nagioc\033[0m"
cd ~/MagicMirror/modules/MMM-Nagios/
npm install --force 
echo
echo -e "\033[33;1mInstall MMM-Network-Signal\033[0m"
cd ~/MagicMirror/modules/MMM-network-signal/
npm install
echo
echo -e "\033[33;1mInstall MMM-NewsFeedBerlingske\033[0m"
echo
echo -e "\033[33;1mInstall MMM-ServerStatus\033[0m"
cd ~/MagicMirror/modules/MMM-ServerStatus/
npm install
echo
echo -e "\033[33;1mInstall MMM-Tools\033[0m"
cd ~/MagicMirror/modules/MMM-Tools/
npm install

sudo rm -r ~/MagicMirror/modules/MyMagicMirror
echo
echo -e "\033[33;1mInstall pm2 with fixuppm2.sh\033[0m"
bash -c "$(curl -sL https://raw.githubusercontent.com/sdetweil/MagicMirror_scripts/master/fixuppm2.sh)"

echo Finish
