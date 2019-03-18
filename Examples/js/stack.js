(function() {


// Create the connector object
    var myConnector = tableau.makeConnector();

//Setting up the Basic Authorization Header
$.ajaxSetup({
    headers: {'Authorization': "Basic " + btoa("my_username" + ":" + "my_password")}
})

  //    myConnector.init = function(initCallback) {
  //     tableau.authType = tableau.authTypeEnum.basic;
  //     tableau.username = "my_username";
  //     tableau.password = "my_pass";
  //     initCallback();
  // }

    // Define the schema
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
            //console.log(resp[i]);
        }

        table.appendRows(data);
        doneCallback();
    });
};

    tableau.registerConnector(myConnector);
    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Storage"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();