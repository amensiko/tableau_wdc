(function() {
    var myConnector = tableau.makeConnector();
    var Auth = false;

    myConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom;

        if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
            var curURL = window.location.href;
            curURL = curURL.replace("#", "?");
            var query = getQueryParams(curURL);
            if (query["http://files.tableaujunkie.com/fitbit/html/fitbitconnect.html?access_token"]) {
                var access_token = query["http://files.tableaujunkie.com/fitbit/html/fitbitconnect.html?access_token"];
                Auth = true;
                tableau.password = access_token;
                $('.section-description').html("How many days of data?<p class='centre'></br><label for='days'># of days:  </label><input type='number' name='days' id='days' min='0' max='150' step='1' value='7' style='width: 70px;'/></p>Press the button to get your Fitbit data</br></br><button type='button' class='btn btn-primary' id='getData'>Get Fitbit Data!</a>");
                $('#getData').bind('click', function() {
                    days = $('#days').val()
                    myConnector.setConnection("", query["user_id"], days);
                    if (tableau.phase == tableau.phaseEnum.authPhase) {
                        tableau.submit();
                    }
                })
            }
        }

        if (tableau.phase == tableau.phaseEnum.interactivePhase) {
            console.log("Entering Interactive Phase");
            if (!Auth) {
                $('.section-description').html("Press the button to connect to your Fitbit</br></br><button type='button' class='btn btn-primary' id='authenticate'>Authentication Phase</a>");
                $('#authenticate').bind('click', function() {
                    $('.ajax-loading').show();
                    window.location.href = "https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22CXJJ&redirect_uri=http://files.tableaujunkie.com/fitbit/html/fitbitconnect.html&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=2592000";
                });
            }
        }
        initCallback();
    }

    myConnector.setConnection = function(refresh_token, user_id, days) {
        var connData = [refresh_token, user_id, days];
        tableau.connectionData = JSON.stringify(connData);
        tableau.connectionName = 'Fitbit Activity';
        tableau.submit();
    };

    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "activityMinute",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "steps",
            dataType: tableau.dataTypeEnum.int
        }];

        var tableSchema = {
            id: "steps",
            alias: "steps",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback) {

        var connectionAuth = JSON.parse(tableau.connectionData);
        var access_token = tableau.password;
        var user_id = connectionAuth[1];
        var days = connectionAuth[2];

        var steps = {
            category: 'steps',
            activities: 'activities-steps-intraday'
        };
        
        activity = steps;

        var counter = 0;
        getFitbitData = function(counter) {
            var activityArray = [];
            var date = new Date();
            date.setDate(date.getDate() - counter);
            var d = date.toISOString().substring(0, 10);

            url = 'https://api.fitbit.com/1/user/-/activities/steps/date/' + d + '/1d/1min.json';
            $.ajax({
                url: url,
                dataType: 'json',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                },
                success: function(data) {
                    var activities = data[activity.activities].dataset;
                    for (var i = 0; i < activities.length; i++) {
                        var entry = {};
                        time = activities[i].time;
                        date.setHours(time.substring(0, 2));
                        date.setMinutes(time.substring(3, 5));
                        date.setSeconds(0);
                        entry.activityMinute = new Date(date);
                        entry[activity.category] = activities[i].value;
                        activityArray.push(entry);
                    }
                    table.appendRows(activityArray)
                    counter++;
                    if (counter == days) {
                        doneCallback();
                    } else {
                        getFitbitData(counter);
                    }
                },
            });
        }
        getFitbitData(counter);
    };

    tableau.registerConnector(myConnector);

    function getQueryParams(qer) {
        qer = qer.split("+").join(" ");
        var pars = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qer)) {
            pars[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return pars;
    }

    $(document).ready(function () {      //The jQuery $(document).ready function runs some code when the page loads
        $('.button').click(function () {
            tableau.connectionName = "Fitbit Activity";
            tableau.submit();
        });
    });
    // $(document).ready(function() {
    //     $('.button').hide();
    // });
})();