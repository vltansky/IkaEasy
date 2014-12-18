if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
var current_units_costs={citizens:0, wood:0, sulfur:0, wine:0, crystal:0}, resources={}, city_resources={};

function changeMaxValue_barracks(currentElementClass){
    console.log(currentElementClass);//
    var $accumulatedResourcesCosts=$("#accumulatedResourcesCosts"), $each_el=$('ul#units li.unit');//@todo create function for global resources
    current_units_costs={citizens:0, wood:0, sulfur:0, wine:0, crystal:0}
    $each_el.each(function(index) {
        var _this=$('div.forminput input.textfield', this);
        current_units_costs['citizens'] += _this.val() * resources[index]['citizens'];
        current_units_costs['wood'] += _this.val() * resources[index]['wood'];
        current_units_costs['sulfur'] += _this.val() * resources[index]['sulfur'];
        current_units_costs['wine'] += _this.val() * resources[index]['wine'];
        current_units_costs['crystal'] += _this.val() * resources[index]['crystal'];
    });

    $each_el.each(function(index) {
        try {
            var max=[];

            max[0]=(city_resources['citizens']-current_units_costs['citizens'])/resources[index]['citizens'];
            max[1]=(city_resources['wood']-current_units_costs['wood'])/resources[index]['wood']<max[0]?(city_resources['wood']-current_units_costs['wood'])/resources[index]['wood']:max[0];
            max[2]=(city_resources['sulfur']-current_units_costs['sulfur'])/resources[index]['sulfur']<max[0]?(city_resources['sulfur']-current_units_costs['sulfur'])/resources[index]['sulfur']:max[0];
            max[3]=(city_resources['wine']-current_units_costs['wine'])/resources[index]['wine']<max[0]?(city_resources['wine']-current_units_costs['wine'])/resources[index]['wine']:max[0];
            max[4]=(city_resources['crystal']-current_units_costs['crystal'])/resources[index]['crystal']<max[0]?(city_resources['crystal']-current_units_costs['crystal'])/resources[index]['crystal']:max[0];
                var maxVal = Math.floor(Math.min.apply(Math, max)) > 0 ? Math.floor(Math.min.apply(Math, max)) : 0;
                maxVal+=parseInt($('div.forminput input.textfield', this).val());
                $('.ikaeasy_barracks_max', this).text('/ '+maxVal);
        }
        catch(ex) {
        }
    });
}

function addMaxValue_barracks(){//@todo create option - enable\disable
    city_resources['citizens']=$('#js_GlobalMenu_citizens').text().replace(/[^\d+]/g, '');
    city_resources['wood']=$('#js_GlobalMenu_wood').text().replace(/[^\d+]/g, '');
    city_resources['sulfur']=$('#js_GlobalMenu_sulfur').text().replace(/[^\d+]/g, '');
    city_resources['wine']=$('#js_GlobalMenu_wine').text().replace(/[^\d+]/g, '');
    city_resources['crystal']=$('#js_GlobalMenu_crystal').text().replace(/[^\d+]/g, '');
    current_units_costs['example']='HEY HERE';

    $('ul#units:not(.ikaeasy_complete) li.unit').each(function(index) {
        try {
            var $resources=$("ul.resources", this);
            var max=[];
            resources[index]={};
            resources[index]['citizens']=$resources.find('li.citizens')?$resources.find('li.citizens').text().replace(/[^\d+]/g, ''):null;
            resources[index]['wood']=$resources.find('li.wood')?$resources.find('li.wood').text().replace(/[^\d+]/g, ''):null;
            resources[index]['sulfur']=$resources.find('li.sulfur')?$resources.find('li.sulfur').text().replace(/[^\d+]/g, ''):null;
            resources[index]['wine']=$resources.find('li.wine')?$resources.find('li.wine').text().replace(/[^\d+]/g, ''):null;
            resources[index]['crystal']=$resources.find('li.glass')?$resources.find('li.glass').text().replace(/[^\d+]/g, ''):null;
            console.log(resources);

            max[0]=city_resources['citizens']/resources[index]['citizens'];
            max[1]=city_resources['wood']/resources[index]['wood']<max[0]?city_resources['wood']/resources[index]['wood']:max[0];
            max[2]=city_resources['sulfur']/resources[index]['sulfur']<max[0]?city_resources['sulfur']/resources[index]['sulfur']:max[0];
            max[3]=city_resources['wine']/resources[index]['wine']<max[0]?city_resources['wine']/resources[index]['wine']:max[0];
            max[4]=city_resources['crystal']/resources[index]['crystal']<max[0]?city_resources['crystal']/resources[index]['crystal']:max[0];

            var maxVal = Math.floor(Math.min.apply(Math, max));

            var container = $('<span class="ikaeasy_barracks_max"> / ' + maxVal + '</span>');
            $('div.forminput', this).append(container);
            i++;
        }
        catch(ex) {
        }
    });
    $('ul#units').addClass('ikaeasy_complete');
}
function addMaxValue() {
    $('ul#units li.unit').each(function() {
        try {
            $('a.setMax', this).click();
            var maxVal = $('input.textfield', this).val(); //$('input.textfield', this).val();
            $('a.setMin', this).click();
            var container = $('<span class="ikaeasy_barracks_max"> / ' + maxVal + '</span>');
            $('div.forminput', this).append(container);
        }
        catch(ex) {
        }
    });
}

zJS.Page.barracks = {
    init: function() {
        addMaxValue_barracks();
        $(".forminput input.textfield").change(function() {
            changeMaxValue_barracks($(this).parents("li.unit").attr('class').split(" ")[1]);
        });

        $(".sliderinput").click(function(){
            changeMaxValue_barracks($(this).parents("li.unit").attr('class').split(" ")[1]);
        })
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.shipyard = {
    init: function() {
        addMaxValue();
    },

    refresh: function() {
        this.init();
    }
};