#!/bin/bash

function ask_user() {

echo -e "
 1.) Sync 1 private iCloud Calendar
 2.) Sync 2 private iCloud Calendar
\n"

read -e -p "Select 1-2: " choice

if [ "$choice" == "1" ]; then

    chmod +x Sync-1-private-iCloud-Calendar.sh
    ./Sync-1-private-iCloud-Calendar.sh

elif [ "$choice" == "2" ]; then

    chmod +x Sync-2-private-iCloud-Calendar.sh
    ./Sync-2-private-iCloud-Calendar.sh

else

    echo "Please select 1 or 2." && sleep 2
    clear && ask_user

fi
}

ask_user
