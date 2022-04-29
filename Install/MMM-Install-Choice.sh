#!/bin/bash

function ask_user_Install_Choice() {

echo -e "
 1.) Install MyMagicMirror without updates in the future (ONLY MagicMirror will Update)
 2.) Install MyMagicMirror with all updates ahead (MagicMirror and ALL modules will update)
 3.) Quit
\n"

read -e -p "Select 1: " choice

if [ "$choice" == "1" ]; then

    chmod +x MMM-Install.sh
    ./MMM-Install.sh

elif [ "$choice" == "2" ]; then

    chmod +x MMM-Github-Install.sh
    ./MMM-Github-Install.sh

elif [ "$choice" == "3" ]; then

    clear && exit 0

else

    echo "Please select 1, 2, or 3." && sleep 3
    clear && ask_user_Install_Choice

fi
}

ask_user_Install_Choice
