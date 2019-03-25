window.information = {};
information.lastId = 0;

(function() {
    var myConnector = tableau.makeConnector();
    
    myConnector.getSchema = function(schemaCallback) {
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
        }, {
            id: "timestamp",
            dataType: tableau.dataTypeEnum.datetime
        }];
         
         
         var tableInfo = {
             alias: "Incremental Refresh Connector",
             id: "mainTable",
             columns: cols,
             incrementColumnId: "timestamp"
         };
         
         schemaCallback([tableInfo]);
     };


    myConnector.getData = function(table, doneCallback) {
    $.getJSON("https://data.parliament.scot/api/events", function(resp) {

        console.log("HELLO THERE IM IN DATA");
        //console.log(MY.language);

        var time_ticker = (table.incrementValue || new Date()); //ticking as time goes on = lastTimestamp

        //var lastId = parseInt(table.incrementValue || -1);

        console.log("LAST TIMESTAMP");
        console.log(time_ticker);

        // var connectionData = JSON.parse(tableau.connectionData);
        // var orig_date = connectionData.orig_date;  //always staying the same, always the earlier time = max_iterations
        // var lastId = connectionData.lastId; 

        // console.log("orig_date");
        // console.log(orig_date);
        // console.log("lastId");
        // console.log(lastId);

        var data = [];   //TODO: WE NEED TO SAVE AT WHICH i WE STOP
        var now = Date();
        date_and_time = new Date();

        date_only = new Date(date_and_time.getTime());
        date_only.setHours(0, 0, 0, 0);

        var max_iterations = 5;

        console.log("D AND T: " + date_and_time);
        console.log("DATE ONLY: " + date_only);
        console.log("information.lastId: " + information.lastId);
        var start = information.lastId;
        for (var i = start; i < start+max_iterations && information.lastId < resp.length; i++) {
            //information.lastId++;
            //lastId++; //=time_ticker
            var id = information.lastId;
            //console.log("NEW IDDDDD " + id);
            //var millis = date_and_time.getTime();
            //millis += 1000 * i; //add a second
            //date_and_time.setTime(millis);
            //date_only = new Date(date_and_time.getTime());
            //date_only.setHours(0, 0, 0, 0);
            //if (date_and_time > lastTimestamp) {
            //if (max_iterations > lastTimestamp) {
            data.push({
                "id": resp[i].ID,
                "date": resp[i].Date,
                "title": resp[i].Title,
                "sponsor": resp[i].Sponsor,
                "timestamp": date_and_time
            });
            information.lastId++;
            //}
            //console.log(resp[i]);
        }

        table.appendRows(data);
        doneCallback(); 
    });  
};

    // With this sample we will generate some sample date for the columns: id, x, day, date_and _time, true_or_false, and color.
    // The user input for the max iterations determines the number of rows to add. 
//     myConnector.getData = function(table, doneCallback) {
//     $.getJSON("http://api.population.io/1.0/population/2010/United%20States/?format=json", function(resp) {

//         console.log("HELLO THERE IM IN DATA");

//         var lastId = (table.incrementValue || -1);

//         var connectionData = JSON.parse(tableau.connectionData);
//         var max_iterations = connectionData.max_iterations;

//         console.log("incrementValue");
//         console.log(table.incrementValue);

//         console.log("connectionData");
//         console.log(connectionData);

//         console.log("max_iterations");
//         console.log(max_iterations);

//         var data = [];
//         //var now = Date();
//         date_and_time = new Date();
//         //var millis = date_and_time.getTime();
//         var now = date_and_time.toISOString();
//         var i = 0;
//         for (var d = new Date(max_iterations); (d <= date_and_time) && (i < 101); d.setDate(d.getDate() + 1)) {
//             console.log("DDDDDDDDD");
//             console.log(d);
//         //while (dt >= max_iterations && i < 101) {
//         //for (var i = 0; i < max_iterations; i++) {
//             lastId++;
//             var id = lastId;
//             //var millis = date_and_time.getTime();
//             //millis += 1000 * i; //add a second
//             //date_and_time.setTime(millis);
//             //date_only = new Date(date_and_time.getTime());
//             //date_only.setHours(0, 0, 0, 0);
//             //console.log(i);
//             data.push({
//                 "timestamp": date_and_time.toISOString(),
//                 //"timestamp_month": date_only.toISOString(),
//                 "census_year": resp[i].year,
//                 "country": resp[i].country,
//                 "id": id,
//                 "age": resp[i].age,
//                 "total": resp[i].total,
//                 "females": resp[i].females,
//                 "males": resp[i].males
//             });
//             i = i + 1;
//             //millis = date_and_time.getTime();
//             //dt = date_and_time.toISOString();
//             //console.log(date_and_time);
//         }

//         table.appendRows(data);
//         doneCallback(); 
//     });  
// };

    setupConnector = function() {
       // var max_iterations = $("#max_iterations").val();

        //var now = Date();
        var date_and_time = new Date();
        var lastId = -1;
        //var millis = date_and_time.getTime();
        //date_and_time.setTime(millis);
        
        //if (max_iterations) {
            var connectionData = {
                "orig_date": date_and_time,//.toISOString()//parseInt(max_iterations)
                "lastId": lastId
            };
            tableau.connectionData = JSON.stringify(connectionData);
            tableau.submit();
       // }
     };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() { // This event fires when a button is clicked
            setupConnector();
        });
    });
})();
