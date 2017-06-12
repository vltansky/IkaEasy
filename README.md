# [IkaEasy](http://ikariam-easy.com/)
Extension stable on version **0.6.2**.

IkaEasy - extension for chrome browser that add many useful features to ikariam. Make your ikariam really easier!

Old website (gh-pages branch): http://swat-web.github.io/IkaEasy/

## Table of contents

- [Quick start](#quick-start)       
- [Community](#community)
- [Features](#features)
- [Supported languages](#supported-languages)
- [Structure](#structure)
- [Adding new script](#adding-new-script)
- [How it works](#how-it-works)
- [How script works](#how-script-works)
- [Adding script](#adding-script)
- [Adding images](#adding-images)
- [Adding translation](#adding-translation)
- [Copyright and license](#copyright-and-license)
- [Building & minifying](#Building-and-minifying)

## Quick start
If you're using chrome - install [main extension (with stable version)](https://chrome.google.com/webstore/detail/ikariam-easy/eflmkpkfklepiajpjpmjbneomenkbpdl?hl=en) or [test extension (latest version)](https://chrome.google.com/webstore/detail/ikariam-easy-test/nbgafacaepgodomleebpcjcfgeiceidb) and enjoy!

## Community

Keep track of development and community news.

- Like our [Facebook page](https://www.facebook.com/ikariam.easy).
- Follow us on [VK.com](http://vk.com/ikariam_easy).

## Features:

- Building levels (green circle - enough resources to update, red - not enough. When mouseover - how much resources you need to upgare)
- City levels and there action points (on island)
- Alliance and score of player right on the island
- Movements tabs in military advisor (you can choose what type of movements you want too see)
- Movements arrival date in military advisor 
- Movements pictures of units (without clicking on search icon) in military advisor 
- Highlighing movement when mouseover
- Making links and images active in diplomacy advisor
- Sending message with Ctrl+enter
- Alliance members tab in diplomacy advisor
- Intergration with ikalogs (save battle log. Much easier publish your battle with it)
- Gold per hour (on all screens)
- Resources per hour (on all screens)
- How much days left with wine
- Send half\all units
- "Transport" button moved upper in port
- Marker (can mark cities of another alliances with other color)

## Supported languages:

- Croatian 
- English           
- German  
- Hebrew (modern)
- Polish   
- Russian   
- Turkish

## Structure:
Main files and folders:
```
IkaEasy/
├── css/
│   └── ikaeasy.css
├── icon/
├── images/
├── inner/
│   └── ikaeasy.js
├── langs/
├── page/
│   ├── __common.js
│   ├── attack.js
│   ├── city.js
│   ├── diplomacyAdvisor.js
│   ├── finances.js
│   ├── generalAttacksToAlly.js
│   ├── island.js
│   ├── militaryAdvisor.js
│   ├── militaryAdvisorReportView.js
│   ├── options.js
│   ├── pirateFortess.js
│   ├── resource.js
│   ├── sendIKMessage.js
│   ├── tavern.js
│   ├── topLists.js
│   ├── townHall.js
│   ├── transport.js
│   └── units.js
└── zJS/
│   ├── db.js
│   ├── lng.js
│   ├── navigation.js
│   ├── utils.js
│   ├── var.js
├── background.js
├── hotkeysPlugin.js
├── ikalogs.js
├── init.js
├── jquery.min.js
├── json.js
└── manifest.json
```

## Adding new script
Create new file with custom name in directory `page`.

Default script template:

        if (typeof zJS == "undefined") {
            zJS = {};
        }

        if (typeof zJS.Page == "undefined") {
            zJS.Page = {};
        }

        zJS.Page.TEMPLATE_ID = {
            dont_refresh : false,

            init : function() {

            },

            refresh : function() {

            }
        };

`zJS.Page.TEMPLATE_ID` - instead `TEMPLATE_ID` - value of variable `ikariam.templateView.id` or
`ikariam.backgroundView.id`. When this variables changes - script will be executed.

And finally add this file to `manifest.json`, to the end of the long line.


## How it works
All scripts, that must be executed on pages are located in directory `page`.

Script `__common.js` executing on all pages.

All other pages call by changes values of `ikariam.templateView.id` or `ikariam.backgroundView.id`.


### How script works
Value `dont_refresh` define if script must be reinitialize when page refreshed (by ikariam).

Function `init` calling when page execute.

Function `refresh` by refreshing pages (e.g city change, or by timeout).


## Adding script
When adding (deleting, moving, renaming) script files, you must update information about it in `manifest.json`

## Adding images
When adding (deleting, moving, renaming) images in directory `image`, you must update information about it in `manifest.json`

## Adding translation

Files for internationalization are located [here](https://github.com/swat-web/IkaEasy/tree/swat/master/langs). To add a new language, create a new file in that directory. 

The language has to be referenced in the `/zJS/lng.js` file and `/manifest.json` file to be picked up.

Note: The name of the file should be the two-letters [ISO-639-1 language code](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

## Building and minifying

`master` is the main folder where all the file sources in readable view.
`dist` is the folder after minifying & concating. The content of this folder goes to releasing updated in chrome web store.

Use grunt to minify, concat & etc (already configured. Just use `grunt` command in the root of the project).

## Copyright and license

Code and documentation copyright 2014 Vlad Tansky. Code released under [the MIT license](https://github.com/swat-web/IkaEasy/blob/swat/LICENSE.md).
