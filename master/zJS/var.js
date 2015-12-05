if(typeof  zJS == "undefined") {
    zJS = {};
}

zJS.Var = {
    getIslandId: function() {
        return this.getIsland().islandId;
    },

    getActionRequest: function() {
        return this.getTransferVars()['actionRequest'];
    },

    getTransferVars: function() {
        //console.time('getTransferVars');
        if($('#__ikaeasy').html() != '') {
            var $ikaeasy = $('#__ikaeasy');
            this._transferVars = jQuery.parseJSON($ikaeasy.html());
            $ikaeasy.html('');
        }

        //console.timeEnd('getTransferVars');

        return this._transferVars;
    },

    getShips: function() {
        return this.getTransferVars().ships;
    },

    getAllyId: function() {
        if(!this._ally_id) {
            this._ally_id = parseInt(this.getTransferVars().allyId);
        }
        return this._ally_id;
    },

    getCityResources: function() {
        var _resource = this.getTransferVars()['resources'];

        var resource = {};
        resource.wood = _resource.resource;
        resource.wine = _resource[1];
        resource.marble = _resource[2];
        resource.crystal = _resource[3];
        resource.sulfur = _resource[4];

        return resource;
    },

    getCities: function() {
        return this.getTransferVars()['cities'];
    },

    getCityId: function() {
        var cities = this.getTransferVars()['cities'];

        return cities[cities.selectedCity].id;
    },

    isMyCity: function() {
        var cities = this.getTransferVars()['cities'];

        return (cities[cities.selectedCity].relationship == 'ownCity');
    },

    getIsland: function() {
        return this.getTransferVars()['island'];
    },

    getSeparators: function() {
        if(typeof this._separators == "undefined") {
            this._separators = this.getTransferVars()['separators'];
        }

        return this._separators;
    },

    getWorldActiveIsland: function(){
        return {
            x: parseInt($("#inputXCoord").val()),
            y: parseInt($("#inputYCoord").val())
        }
    },

    getActiveIsland: function(){
        var res = $("#js_citySelectContainer").find("a").text().split(" ");
        if(typeof res !== "undefined") {
            res = res[0].split(':');
            return {
                x: zJS.Utils.format.onlyInt(res[0]),
                y: zJS.Utils.format.onlyInt(res[1])
            }
        }
        return false;
    },

    _now: function(){
        return Math.floor((new Date()).getTime() / 1000);
    }
};