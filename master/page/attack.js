if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

function addAllAndHalfBtns() {
    var allBtnDiv = $('<div class="ikaeasy_attack_btns_div"></div>');

    //All button
    var allBtn = $('<a class="button">' + zJS.Lang.Attack_All + '</a>');
    $(allBtn).click(function() {
        $('ul.assignUnits li').each(function() {
            var count = $('.amount', this).text();
            $('input.textfield', this).val(count).click();
        });
    });

    //Half button
    var halfBtn = $('<a class="button">' + zJS.Lang.Attack_Half + '</a>');
    $(halfBtn).click(function() {
        $('ul.assignUnits li').each(function() {
            var count = $('.amount', this).text();
            $('input.textfield', this).val((count - count % 2) / 2).click();
        });
    });

    //Nothing button
    var nothingBtn = $('<a class="button">' + zJS.Lang.Attack_Nothing + '</a>');
    $(nothingBtn).click(function() {
        $('ul.assignUnits li').each(function() {
            var count = $('.amount', this).text();
            $('input.textfield', this).val(0).click();
        });
    });

    $(allBtnDiv).append($(nothingBtn));
    $(allBtnDiv).append($(halfBtn));
    $(allBtnDiv).append($(allBtn));
    $(allBtnDiv).insertBefore('div.newSummary:not(.ikaeasy_complete)');
    $('div.newSummary').addClass('ikaeasy_complete');
}

zJS.Page.blockade = {
    init: function() {
        addAllAndHalfBtns();
    }
};

zJS.Page.occupy = {
    init: function() {
        addAllAndHalfBtns();
    }
};

zJS.Page.defendCity = {
    init: function() {
        addAllAndHalfBtns();
    }
};

zJS.Page.defendPort = {
    init: function() {
        addAllAndHalfBtns();
    }
};

zJS.Page.deployment = {
    init: function() {
        addAllAndHalfBtns();
    }
};

zJS.Page.plunder = {
    init: function() {
        if($("#ikaeasy_max_ships").length < 1) {
            var a = $('<div href="#reset" class="ikaeasy_max_btn" id="ikaeasy_max_ships"></div>');//why div with href?
            $('#plusminus').append(a);
            $(a).click(function () {
                $('#extraTransporter').val(zJS.Var.getShips());
                $('#totalFreight').text(zJS.Var.getShips() * 500);
            });
            addAllAndHalfBtns();
        }
    }
};