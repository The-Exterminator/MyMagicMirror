#!/bin/bash

function ask_user_Install_Choice() {

echo -e "
 1.) Install MyMagicMirror without updates in the future (ONLY MagicMirror will Update)
 2.) Install MyMagicMirror with all updates ahead (MagicMirror and ALL modules will update)
\n"

read -e -p "Select 1-2: " choice

if [ "$choice" == "1" ]; then

    chmod +x MMM-Install.sh
    ./MMM-Install.sh

elif [ "$choice" == "2" ]; then

    chmod +x MMM-Github-Install.sh
    ./MMM-Github-Install.sh

else

    echo "Please select 1 or 2." && sleep 2
    clear && ask_user_Install_Choice

fi
}

ask_user_Install_Choice
