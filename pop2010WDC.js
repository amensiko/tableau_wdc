(function () {
    var myConnector = tableau.makeConnector();

	myConnector.getSchema = function (schemaCallback) {  //schema = mapping of data
        console.log("HELLO THERE IM IN SCHEMA");

        var cols = [{
            id: "females",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "age",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "males",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "year",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "total",
            dataType: tableau.dataTypeEnum.int
        }];
		// var cols = [{
  //       	id: "year",
  //       	dataType: tableau.dataTypeEnum.int
  //   	}, {
  //       	id: "country",
  //       	dataType: tableau.dataTypeEnum.string
  //   	}, {
  //       	id: "age",
  //       	dataType: tableau.dataTypeEnum.int
  //       }, {
  //           id: "total",
  //           dataType: tableau.dataTypeEnum.long
  //       }, {
  //           id: "females",
  //           dataType: tableau.dataTypeEnum.long
  //       }, {
  //           id: "males",
  //           dataType: tableau.dataTypeEnum.long
  //   	}];

    	var tableSchema = {
        	id: "population",
        	alias: "US Population in 2010 by Age",
        	columns: cols,
            incrementColumnId: "age"
    	};

        console.log([tableSchema]);
    	schemaCallback([tableSchema]);
	};

    myConnector.getData = function(table, doneCallback) {
    $.getJSON("http://api.population.io/1.0/population/2010/United%20States/?format=json", function(resp) {
        console.log(resp);
        var featrs = resp.features, 
            data = [];

        console.log("HELLO THERE IM IN DATA");

        for (var i = 0, len = resp.length; i < len; i++) {
            data.push({
                "year": resp[i].year,
                "country": resp[i].country,
                "age": resp[i].age,
                "total": resp[i].total,
                "females": resp[i].females,
                "males": resp[i].males
            });
            console.log(resp[i]);
        }

        //console.log(resp);

        // Iterate over the JSON object
        // for (var i = 0, len = featrs.length; i < len; i++) {
        //     data.push({
        //         "designation": featrs[i].designation,
        //         "discovery_date": featrs[i].discovery_date,
        //         "orbit_class": featrs[i].orbit_class
        //     });
        // }

        table.appendRows(data);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);

    $(document).ready(function () {      //The jQuery $(document).ready function runs some code when the page loads
    	$("#submitButton").click(function () {
        	tableau.connectionName = "US Population in 2010 by Age";
        	tableau.submit();
    	});
	});
})();