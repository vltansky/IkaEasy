if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

//Запускает все функции советника дипломатии
function startAllFunctions() {
    makeActiveLinks();
    addMembersTab();
    changeTabsText();
}

//Изменение названий закладок
function changeTabsText() {
    var tabs = ['.tab_diplomacyAdvisor', '.tab_diplomacyIslandBoard', '.tab_diplomacyTreaty', '.tab_diplomacyAlly'];
    var vals = [zJS.Lang.Messages, zJS.Lang.Agora, zJS.Lang.Treaty, zJS.Lang.Alliance];
    for(var i = 0; i < 4; i++) {
        var tab = $(tabs[i])[0].innerText;
        console.log(tab);
        var oldTab = tab;
        tab = tab.substring(tab.indexOf('('), tab.length);
        if(tab == oldTab) tab = '';
        console.log(tab);
        $(tabs[i])[0].innerText = vals[i] + " " + tab;
    }
}

//Создание активных ссылок
function makeActiveLinks() {
    console.time('makeActiveLinks');
    $('tr:not(.globalmessage) td.msgText:not(.IkaEasy_links_completed)').each(function() {
        this.innerHTML = this.innerHTML.replace(/<br>/gi, " $&"); //На случай если тег стоит сразу после ссылки, а такое часто бывает

        //URLs начинающиеся с http://, https://
        var __urlRegex = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
        //URLs начинающиеся с "www."
        var __urlRegex_www = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        //IMGs url
        var __imgRegex = /\.(?:jpe?g|gif|png)$/i;

        var __urlRegex_Ikalogs = /(\b(https?):\/\/ikalogs.ru\/report\/.*[-A-Z0-9+&amp;@#\/%=~_|])/ig;

        this.innerHTML = this.innerHTML.replace(__urlRegex, function(match) {
                __imgRegex.lastIndex = 0;
                __urlRegex_Ikalogs.lastIndex = 0;
                if(__imgRegex.test(match)) {
                    return '<a href="' + match + '" target="_blank" class="IkaEasy_msg_img"><img src="' + match + '" /></a>';
                }
                //else if(__urlRegex_Ikalogs.test(match)){
                //	return '<div id="ikaeasy_ikalogs_msg_log"><a href="$1" class="ikaeasy_show_log">Show log</a><a href="$1">Visit</a></div>';
                //}
                else {
                    return '<a href="' + match + '" target="_blank" class="externalURL">' + match + '</a>';
                }
            }
        );

        this.innerHTML = this.innerHTML.replace(__urlRegex_www, '$1<a href="http://$2" target="_blank" class="externalURL">$2</a>');

        $(this).addClass('IkaEasy_links_completed');
        console.timeEnd('makeActiveLinks');
    });
}

//Добавление вкладки со списком игроков альянса
function addMembersTab() {
    $('#js_tab_diplomacyMembers').remove();
    var tabOnClick = "ajaxHandlerCall('?view=diplomacyAlly&listAllyMembers=1'); return false;";
    var allyTab = $('<li class="tab" id="js_tab_diplomacyMembers" onclick="' + tabOnClick + '"><b class="tab_diplomacyMembers">' + zJS.Lang.Ally_members + '</b></li>');
    $('ul.tabmenu').css('table-layout', 'inherit').append(allyTab);
    if($('table#allyMemberList')[0] != null) {
        $('li', 'ul.tabmenu').each(function() {
            $(this).removeClass('selected');
            if(this.id == "js_tab_diplomacyAlly") {
                this.id = "js_tab_diplomacyAllyNotSelected"; //Небольшая хитрость чтобы вкладка не перепрыгивала во время переключения страниц
            }
        });
        $('li#js_tab_diplomacyMembers').addClass('selected');
    }
}

zJS.Page.diplomacyAdvisor = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.diplomacyAdvisorArchiveOutBox = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.diplomacyAdvisorArchive = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.diplomacyAdvisorOutBox = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.diplomacyIslandBoard = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.diplomacyTreaty = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.diplomacyAlly = {
    init: function() {
        startAllFunctions()
    },

    refresh: function() {
        this.init();
    }
};

// $.ajax({
//         type: "GET",
// headers: { 
//         "e": true
//     },
//         url: "http://ikalogs.ru/user/report/get/?id=8767647410f011e4af97002421ef2dfa",
//         processData: false,

//         dataType: "json",
//         success: function(data){
//                 console.log(data);
//         }
// });