(function () {
    var myConnector = tableau.makeConnector();

	myConnector.getSchema = function (schemaCallback) {  //schema = mapping of data
        console.log("HELLO THERE IM IN SCHEMA");

        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "sponsor",
            dataType: tableau.dataTypeEnum.string
        }];

    	var tableSchema = {
        	id: "scotland",
        	alias: "Scottish Parliament Events",
        	columns: cols
    	};

        console.log([tableSchema]);
    	schemaCallback([tableSchema]);
	};

    myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://data.parliament.scot/api/events", function(resp) {
        console.log(resp);
        var data = [];

        console.log("HELLO THERE IM IN DATA");

        for (var i = 0, len = resp.length; i < len; i++) {

            data.push({
                "id": resp[i].ID,
                "date": resp[i].Date,
                "title": resp[i].Title,
                "sponsor": resp[i].Sponsor
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
        	tableau.connectionName = "Scottish Parliament Events";
        	tableau.submit();
    	});
	});
})();