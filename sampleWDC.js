(function () {
    var myConnector = tableau.makeConnector();

	myConnector.getSchema = function (schemaCallback) {  //schema = mapping of data
        console.log("HELLO THERE IM IN SCHEMA");
		var cols = [{
        	id: "designation",
        	dataType: tableau.dataTypeEnum.string
    	}, {
        	id: "discovery_date",
        	dataType: tableau.dataTypeEnum.string
    	}, {
        	id: "orbit_class",
        	dataType: tableau.dataTypeEnum.string
    	}];

    	var tableSchema = {
        	id: "asteroids",
        	alias: "Asteroids and Comets Discovered in the Past 10 Years",
        	columns: cols
    	};

    	schemaCallback([tableSchema]);
	};

    myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://data.nasa.gov/resource/2vr3-k9wn.json", function(resp) {

        var lastId = parseInt(table.incrementValue || -1);

        var featrs = resp.features, 
            data = [];

        console.log("HELLO THERE IM IN DATA");

        for (var i = 0, len = resp.length; i < len; i++) {
            data.push({
                "designation": resp[i].designation,
                "discovery_date": resp[i].discovery_date,
                "orbit_class": resp[i].orbit_class
            });
            console.log(resp[i]);
        }

        table.appendRows(data);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);

    $(document).ready(function () {      //The jQuery $(document).ready function runs some code when the page loads
    	$("#submitButton").click(function () {
        	tableau.connectionName = "Near-Earth Asteroids and Comets";
        	tableau.submit();
    	});
	});
})();