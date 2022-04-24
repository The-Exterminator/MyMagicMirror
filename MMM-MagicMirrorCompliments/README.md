# MagicMirror Module: MMM-MagicMirrorCompliments

A MagicMirror Module for compliments in my own language.

[![Platform](https://img.shields.io/badge/platform-MagicMirror-informational)](https://MagicMirror.builders)

## How to add the compliments to your MagicMirror
### Step 1: Check for supported languages
At the moment there are just four languages: 
- Danish ```dk-compliments.json```
- English ```en-compliments.json```
- German ```de-compliments.json```
- Dutch ```nl-compliments.json```
- Chuvash ```cv-compliments.json```

### Step 2: Change config
Open your config:
```bash
sudo nano ~/MagicMirror/config/config.js
```
Scroll till you can see the compliments module. It looks something like this:
```javascript
{
    module: "compliments",
    position: "lower_third"
},
```
Copy the xx-compliments.json to /MagicMirror/modules/default/compliments and change it to:
```javascript
{
    module: "compliments",
    position: "lower_third",
    config: {
        remoteFile: 'dk-compliments.json'"
    }
},
```
Change ```dk-compliments.json``` to your own language like ```en-compliments.json``` or ```nl-compliments.json```. The abbreviation of your language can be found above.

## Credits
Danish language by [The-Exterminator](https://github.com/The-Exterminator),
Dutch and English languages by [Micha den Heijer](https://github.com/michadenheijer), 
German language by [fixing-it](https://github.com/fixing-it),
Chuvash language by [mirontoli](https://github.com/mirontoli).

