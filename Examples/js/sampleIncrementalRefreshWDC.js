(function() {
    var myConnector = tableau.makeConnector();
    
    myConnector.getSchema = function(schemaCallback) {
         console.log("HELLO THERE IM IN SCHEMA");

        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "timestamp",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "day",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "year",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "age",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "females",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "males",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "total",
            dataType: tableau.dataTypeEnum.int
        }];
         
         var tableInfo = {
             alias: "Incremental Refresh Connector",
             id: "mainTable",
             columns: cols,
             incrementColumnId: "id"
         };
         
         schemaCallback([tableInfo]);
     };


    // With this sample we will generate some sample date for the columns: id, x, day, date_and _time, true_or_false, and color.
    // The user input for the max iterations determines the number of rows to add. 
    myConnector.getData = function(table, doneCallback) {
    $.getJSON("http://api.population.io/1.0/population/2010/United%20States/?format=json", function(resp) {

        console.log("HELLO THERE IM IN DATA");

        var lastId = parseInt(table.incrementValue || -1);

        var connectionData = JSON.parse(tableau.connectionData);
        var max_iterations = connectionData.max_iterations;

        var data = [];
        var now = Date();
        date_and_time = new Date();
        for (var i = 0; i < max_iterations; i++) {
            lastId++;
            var id = lastId;
            var millis = date_and_time.getTime();
            millis += 1000 * i; //add a second
            date_and_time.setTime(millis);
            date_only = new Date(date_and_time.getTime());
            date_only.setHours(0, 0, 0, 0);
            data.push({
                "timestamp": date_and_time.toISOString(),
                "day": date_only.toISOString(),
                "year": resp[i].year,
                "country": resp[i].country,
                "id": id,
                "age": resp[i].age,
                "total": resp[i].total,
                "females": resp[i].females,
                "males": resp[i].males
            });
            console.log(resp[i]);
        }

        table.appendRows(data);
        doneCallback(); 
    });  
};

    setupConnector = function() {
        var max_iterations = $("#max_iterations").val();
        
        if (max_iterations) {
            var connectionData = {
                "max_iterations": parseInt(max_iterations)
            };
            tableau.connectionData = JSON.stringify(connectionData);
            tableau.submit();
        }
     };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() { // This event fires when a button is clicked
            setupConnector();
        });
        $('#inputForm').submit(function(event) {
            event.preventDefault();
            setupConnector();
        });
    });
})();
