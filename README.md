# [IkaEasy](http://ikariam-easy.com/)
Extension stable on version **0.6.2**.

IkaEasy - is a chrome extension for browser game Ikariam, that add useful features.

## Table of contents

- [Quick start](#quick-start)
- [Structure](#structure)
- [Adding new script](#adding-new-script)
- [How it works](#how-it-works)
- [How script works](#how-script-works)
- [Adding script](#adding-script)
- [Adding images](#adding-images)
- [Adding translation](#adding-translation)
- [Community](#community)
- [Copyright and license](#copyright-and-license)

## Quick start
If you're using chrome - install [Main extension](https://chrome.google.com/webstore/detail/ikariam-easy/eflmkpkfklepiajpjpmjbneomenkbpdl?hl=en) or [Test extension](https://chrome.google.com/webstore/detail/ikariam-easy-test/nbgafacaepgodomleebpcjcfgeiceidb) and enjoy!

##Structure:
Main files and folders:
```
bootstrap/
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

##Adding new script
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


##How it works
All scripts, that must be executed on pages are located in directory `page`.

Script `__common.js` executing on all pages.

All other pages call by changes values of `ikariam.templateView.id` or `ikariam.backgroundView.id`.


###How script works
Value `dont_refresh` define if script must be reinitialize when page refreshed (by ikariam).

Function `init` calling when page execute.

Function `refresh` by refreshing pages (e.g city change, or by timeout).


##Adding script
When adding (deleting, moving, renaming) script files, you must update information about it in `manifest.json`

##Adding images
When adding (deleting, moving, renaming) images in directory `image`, you must update information about it in `manifest.json`

##Adding translation

Files for internationalization are located [here](https://github.com/swat-web/IkaEasy/tree/swat/langs). To add a new language, create a new file in that directory. 

The language has to be referenced in the `/zJS/lng.js` file and `/manifest.json` file to be picked up.

Note: The name of the file should be the two-letters [ISO-639-1 language code](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

## Community

Keep track of development and community news.

- Like our [Facebook page](https://www.facebook.com/ikariam.easy).
- Follow us on [VK.com](http://vk.com/ikariam_easy).

## Copyright and license

Code and documentation copyright 2014 Vlad Tansky. Code released under [the MIT license](https://github.com/swat-web/IkaEasy/blob/swat/LICENSE.md).

