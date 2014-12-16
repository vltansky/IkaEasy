# IkaEasy
Extension stable on version **0.6.2**.

Main extension: https://chrome.google.com/webstore/detail/ikariam-easy/eflmkpkfklepiajpjpmjbneomenkbpdl?hl=en

Test extension: https://chrome.google.com/webstore/detail/ikariam-easy-test/nbgafacaepgodomleebpcjcfgeiceidb

##Structure:
* **css**     - stylesheet directory
* **icon**    - icons directory
* **images**  - extensions images directory
* **inner**   - scripts included to page with <script>
* **langs**   - languages
* **page**    - scripts that execute on pages (advisors, views e.g island, city)
* **zJS**     - "engine"

##Adding new script
Create file with custom name in directory `page`.

Default temaplte of script:

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


