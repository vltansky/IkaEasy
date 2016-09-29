if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
function appendTable(table, i) {
    $("#warehouseLevel"+i).remove();
    $("#isIdle" + i).remove();
    $("#ika_easy_available_in_report" + i).remove();
    $("tr[class=safehouse_to_clean]").remove();
    var tr = $("<tr/>",{class:"safehouse_to_clean"})
        .append($("<td/>", {text: "Warehouse level "}))
        .append($("<td/>").append($("<input/>", {
            style: "width:30px",
            value: "0",
            id: "warehouseLevel" + i,
            class: "textfield"
        }).on("change", refreshResourcesReports)))
        .append($("<td/>", {id: "shipCount" + i}));
    $(table).append(tr);

    tr = $("<tr/>",{class:"safehouse_to_clean"});
    tr.append($("<td/>", {text: "Is idle?"}));
    var checkbox = $("<input/>", {type: "checkbox", id: "isIdle" + i, class: "checkbox  radio image floatleft"});
    checkbox.on("change", refreshResourcesReports);
    tr.append($("<td/>").append(checkbox));
    $(table).append(tr);
    $(table.children[0]).append($("<th/>", {class: "count ", text: "Available to steal ",id:"ika_easy_available_in_report"+i}));
    for (var j = 1; j < table.children.length - 2; ++j) {
        var row = $(table.children[j]);
        $("#res"+j+"_"+i).remove();
        row.append($("<td/>", {class: "count", text: "0",id:"res"+j+"_"+i}));
    }
    refreshResourcesReports({target: checkbox[0]});
}
function overrideResourcesReports() {
    "use strict";
    var resourcesTables = $("table[class*='reportTable resourcesTable']");
    var i = 0;
    for (i = 0; i < resourcesTables.length; ++i) {
        var table = resourcesTables[i].children[0];
        appendTable(table, i);
    }
}

function calculateProtectedWithAllData(isActive, warehouseLevel) {
    "use strict";
    const active = {
        "warehouse": 480,
        "townhall": 100
    };
    var current = { // inactive by default
        "warehouse": 80,
        "townhall": 15
    };
    if (isActive)
        current = active;
    return current.townhall + warehouseLevel * current.warehouse;
}
function refreshResourcesReports(e) {
    var separator = zJS.Var.getSeparators()["thousand"];
    var box = e.target;
    var number = box.id.substr(-1);
    var table = box.parentNode.parentNode.parentNode;
    var rows = $(table.children);
    var isIdle = !$("#isIdle" + number).is(":checked");
    var level = $("#warehouseLevel" + number).val();
    var sum = 0;
    var protectedResources = calculateProtectedWithAllData(isIdle, level);
    for (var i = 1; i < rows.length - 2; ++i) {
        var row = rows[i];
        var value = parseInt(row.cells[1].innerText.replace(separator, ''));
        var toSteal = value - protectedResources;
        sum += toSteal < 0 ? 0 : toSteal;
        row.cells[2].innerText = toSteal < 0 ? 0 : toSteal;
    }
    $("#shipCount" + number).text("Sum : " + sum + " you will need " + Math.ceil(sum / 500) + " ships");
}
zJS.Page.safehouse = {
    init: function () {
        overrideResourcesReports();
    },
    refresh: function () {
        //empty
    }
};