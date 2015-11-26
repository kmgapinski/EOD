ftp:/* 
 */
    var plot1;
var ch1;
//var dateIn = new Date();
//var dateOut = new Date();
var dateIn = new Date(2015, 4 - 1, 27);
var dateOut = new Date(2015, 5 - 1, 5);
var currentTabIdNumber = 1;
//dateIn = '143323200000';
//dateIn = '1433318400';

function dateToEpoch(dateToConvert) {
    var newDate;
    newDate = new Date(dateToConvert.getFullYear(), dateToConvert.getMonth(), dateToConvert.getDate()).getTime() / 1; // / 1000;
    //alert("Date: " + dateToConvert + "extracted Date should be in format 1431102608000 and it is " + newDate);
    return newDate;
}
//resize charts when window resizes
$(window).resize(function () {
    plot1.replot({ resetAxes: true });
});
//activated on active tab changed
function tabsAction() {
    var id;
    var chid;
    var idtab;
    //for selected tab
    var myClasses = document.getElementsByClassName("selected t");
    //clean tabb content: remove old charts and div data
    for (var i = 0; i < myClasses.length; i++) {
        var id = myClasses[i].getAttribute("id");
        myClasses[i].className = "t";
        var idtab = "tabs-" + id;
        document.getElementById(idtab).style.display = "none";
        chid = 'chart' + id.toString();
        document.getElementById(chid).style.display = "none";
    }
    id = this.getAttribute("id");
    currentTabIdNumber = this.getAttribute("id");
    idtab = "tabs-" + id;
    //assign active tab
    this.className = "selected t";
    //prepare content of the tabs according to activated tab
    //initialize and display chart, replot to anjust resizing
    if (idtab !== "tabs-7" && idtab !== "tabs-6") {
        //manage tab content views
        document.getElementById("tabs-6").style.display = "none";
        document.getElementById("tabs-7").style.display = "none";
        document.getElementById(idtab).style.display = "block";
        chid = 'chart' + id.toString();
        //method to retrevie array from php files and send the date
        if (verifyDates())
            postPHP(getFileName(id), chid, idtab);
    }
        // displays history tab
    else if (idtab === "tabs-7") {
        document.getElementById('tabs-7').style.display = "block";
        document.getElementById("chart7").style.display = "block";
    }
        //displays map which takes user's current location and gives directions to the building
    else if (idtab === "tabs-6") {
        document.getElementById('tabs-6').style.display = "block";
        var lat;
        var lng;
        //take current user location
        if (navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        //succes got current location, give directions
                        lat = position.coords.latitude;
                        lng = position.coords.longitude;
                        giveDirections(lat, lng, idtab);
                    },
                    function errorCallback(error) {
                        //error no current location, display just buiding
                        lat = 61.188753;
                        lng = -149.826814;
                        showbuilding(lat, lng, idtab);
                    },
                    {
                        maximumAge: Infinity,
                        timeout: 5000
                    });
        }
    }
}
;
//if user location is not enabled
function showbuilding(lat, lng, idtabin) {
    document.getElementById("map-canvas").style.display = "block";
    document.getElementById(idtabin).style.display = "block";
    var location = new google.maps.LatLng(lat, lng);
    //declare map parametrs
    var mapOptions =
            {
                center: location,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                streetViewControl: true,
                zoomControl: true,
                overviewMapControl: true,
                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                zoom: 13
            };
    var venueMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //for pin
    var startPosition = new google.maps.Marker({
        position: location,
        map: venueMap,
        icon: "images/go.png"
    });
    google.maps.event.trigger(rootMap, 'resize');
}
;
//shows directions to the building if current position is enabled
function giveDirections(lat, lng, idtabin) {
    document.getElementById("map-canvas").style.display = "block";
    //get current position
    var location = new google.maps.LatLng(lat, lng);
    //prepare destination
    var dest = new google.maps.LatLng(61.188753, -149.826814);
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var request = {
        origin: location,
        destination: dest,
        travelMode: google.maps.TravelMode.DRIVING
    };
    var mapOptions = {
        zoom: 13,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: true,
        overviewMapControl: true,
        panControl: true
    };
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
        ;
    });
    //display map
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    google.maps.event.trigger(map, 'resize');
    //google.maps.event.addDomListener(window, 'load', initialize);
}
;
//bar chart initialization
//to do: this method is not activated yet 
//remeber to add remove pierenderer.js from script declaration on the main page dynamically
//othervise this charts displays as pie chart
function myGraph2(s1, name, chartTitle, idtab) {
    var ticks = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var col = '';
    var Xaxis = '';
    var Yaxis = '';
    if (chartTitle === 'Electricity Graph') {
        col = '#73C774';
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    } else if (chartTitle === 'Electricity Demand') {
        col = '#73C774';
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    }

    else if (chartTitle === 'Water Graph') {
        col = '#2C75FF'; //#2C75FF';
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    }
    else if (chartTitle === 'Gas Graph') {
        col = '#FF00FF';
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    }
    else if (chartTitle === 'Temperature Graph') {
        col = '#FF3300';
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    }
    else {
        col = "#C7754C";
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    }
    $.jqplot.config.enablePlugins = true;
    plot1 = $.jqplot(name, [s1], {//, s3], {
        // The "seriesDefaults" option is an options object that will
        // be applied to all series in the chart.
        title: {
            text: chartTitle,
            textColor: col
        },
        seriesColors: [col], // '#00749F', '#73C774', '#C7754C', '#17BDB8'],
        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            rendererOptions: {
                fillToZero: true,
                textColor: col
            }
        },
        axes: {
            // Use a category axis on the x axis and use our custom ticks.
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks,
                label: Xaxis,
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickOptions: { textColor: col },
                labelOptions: { textColor: col }
            },
            // Pad the y axis just a little so bars can get close to, but
            // not touch, the grid boundaries.  1.2 is the default padding.
            yaxis: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                label: Yaxis,
                pad: 1.05,
                tickOptions: { formatString: '%d', textColor: col },
                labelOptions: { textColor: col }
            }
        }

    });
    //chart resize on changes
    $(idtab).bind('resizestop', function (event, ui) {
        $('#chart1').height($(idtab).height() * 0.96);
        $('#chart1').width($(idtab).width() * 0.96);
        plot1.replot({ resetAxes: true });
    });
    return plot1;
}
;
//find min  from the graph array
function arrayMin(arr) {
    var par = []
    for (var i = 0; i < arr.length; i++) {
        if (!isNaN(arr[i])) {
            par.push(arr[i]);
        }
    }
    return Math.min.apply(Math, par);
}
;
//find max  from the graph array
function arrayMax(arr) {
    var par = [];
    for (var i = 0; i < arr.length; i++) {
        if (!isNaN(arr[i])) {
            par.push(arr[i]);
        }
    }
    return Math.max.apply(Math, par);
}
;
//area chart initialization
//to do: fix max and min to generate automaticaly or to fix max and min retreaval mathods for graph array
//currently, min and max on y axis is hardcoded for demo purposes
function myGraph(s1, name, chartTitle, idtab, miny, maxy) {
    var col = '';
    var Xaxis = '';
    var Yaxis = '';
    //to do: create php files to generate ticks according to the date and time parametrs and retreive it.
    //currently we only retreive data array in $.get method (see tabsaction())
    //var ticks = [[1, '12am'], [2, '2am'], [3, '4am'], [4, '6am'], [5, '8am'], [6, '10am'], [7, '12pm'], [8, '2pm'], [9, '4pm'], [10, '6pm'], [11, '8pm'], [12, '10pm']];
    var ticks = getTicks(s1.length);
    if (chartTitle === 'Electricity Graph') {
        col = '#73C774';
        Xaxis = 'Time Period';
        Yaxis = 'Amount(kW)';
        //maxy=213450;
        // miny = 214300;
    } else if (chartTitle === 'Electricity Demand') {
        col = '#73C774';
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
        //maxy = maxy + 1;
    }
    else if (chartTitle === 'Water Graph') {
        col = '#2C75FF'; //#2C75FF';
        Xaxis = 'Time Period';
        Yaxis = 'Amount(Gallon)';
        //miny = 0;
        //maxy = 300;
    }
    else if (chartTitle === 'Gas Graph') {
        col = '#FF00FF';
        Xaxis = 'Time Period';
        Yaxis = 'Amount (kBtu)';
        //  miny = 0;
        //maxy = 3000;
    }
    else if (chartTitle === 'Temperature Graph') {
        col = '#FF3300';
        Xaxis = 'Time Period';
        Yaxis = 'Amount (Fahrenheit)';
        //   miny = miny-10;
        maxy = maxy + 1;
    }
    else {
        col = "#C7754C";
        Xaxis = 'Time Period';
        Yaxis = 'Amount';
    }
    plot1 = $.jqplot(name, [s1], {
        //    stackSeries: true,
        title: { text: chartTitle, textColor: col },
        //custom color for the graphs        seriesColors: [col], // '#00749F', '#73C774', '#C7754C', '#17BDB8'],
        seriesColors: [col],
        showMarker: true,
        seriesDefaults: {
            fill: true
        },
        dataPoints: { color: col },
        //in case if labe needed
        /*series: [
         {label: 'B'}
         ],
         legend: {
         show: true,
         placement: 'outsideGrid'
         },
         grid: {
         drawBorder: false,
         shadow: false
         },*/
        //show datawhen pointing on the peaks
        highlighter: {
            show: true,
            showTooltip: true,
            sizeAdjust: 7.5,
            lineWidthAdjust: 2.5
        },
        //to do: fix to display trendline
        trendline: {
            show: true, // show the trend line
            color: '#C7754C', // CSS color spec for the trend line.
            label: '', // label for the trend line.
            type: 'linear', // 'linear', 'exponential' or 'exp'
            shadow: true, // show the trend line shadow.
            lineWidth: 1.5, // width of the trend line.
            shadowAngle: 45, // angle of the shadow.  Clockwise from x axis.
            shadowOffset: 1.5, // offset from the line of the shadow.
            shadowDepth: 3, // Number of strokes to make when drawing shadow.
            // Each stroke offset by shadowOffset from the last.
            shadowAlpha: 0.07   // Opacity of the shadow
        },
        cursor: {
            show: true
        },
        axes: {
            xaxis: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                label: Xaxis,
                ticks: ticks,
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    textColor: col,
                    angle: -40,
                    fontSize: '10pt',
                    formatString: '%d'
                },
                labelOptions: { textColor: col },
                drawMajorGridlines: true,
                pad: 0
            },
            yaxis: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                label: Yaxis,
                pad: 0,
                autoscale: true,
                min: miny,
                max: maxy,
                tickOptions: { formatString: '%d', textColor: col },
                labelOptions: { textColor: col }
            }
        }
    });
    //chart resize on changes
    $(idtab).bind('resizestop', function (event, ui) {
        $('#chart1').height($(idtab).height() * 0.96);
        $('#chart1').width($(idtab).width() * 0.96);
        plot1.reload(); //replot({resetAxes: true});
    });
    return plot1;
}
;
$(function () {
    $(".datepicker1").datepicker({
        minDate: new Date(2015, 4 - 1, 24),
        maxDate: new Date(),
        defaultDate: dateIn,
        onSelect: function () {
            var chosenDate = $(this).datepicker("getDate");
            if (!verifyDates())
                return;
            //if (chosenDate < dateOut) {
            dateIn = new Date(chosenDate.valueOf()); //new Date(dateToEpoch(chosenDate));
            idtab = "tabs-" + currentTabIdNumber;
            chid = 'chart' + currentTabIdNumber;
            postPHP(getFileName(currentTabIdNumber), chid, idtab);
            //} else {
            //    alert("This date should be earlier than " + dateOut);
            //}

        }
    });
    $(".datepicker2").datepicker({
        minDate: new Date(2015, 4 - 1, 26),
        maxDate: new Date(),
        defaultDate: dateOut,
        onSelect: function () {
            var chosenDate = $(this).datepicker("getDate");
            if (!verifyDates())
                return;
            // if (chosenDate > dateIn) {
            dateOut = new Date(chosenDate.valueOf()); //new Date(dateToEpoch(chosenDate));
            idtab = "tabs-" + currentTabIdNumber;
            chid = 'chart' + currentTabIdNumber;
            postPHP(getFileName(currentTabIdNumber), chid, idtab);
            //} else {
            //   alert("This date should be later than " + dateIn);
            //

        }
    });
});
//database has regular date and epoch date, but regular dates don't have min, all has 00:00:00
//use can this method if regular date's hour,min,sec are fixed
function extractDate(dateIn) {
    //should be in format of 2015-04-29 00:00:00
    var newDate = dateIn.getFullYear() + "-" + ("0" + (dateIn.getMonth() + 1)).slice(-2) + "-" + ("0" + dateIn.getDate()).slice(-2) + " " + ("0" + dateIn.getUTCHours()).slice(-2) + ":" + ("0" + dateIn.getUTCMinutes()).slice(-2) + ":" + ("0" + dateIn.getUTCSeconds()).slice(-2);
    return newDate;
}

//method to retrevie array from php files and send the date
//in php file should be exactly one echo with json encode for array
//if more than one echo parsing methods should be changed
//FOR THE NEXT DEVELOPER OF THIS PROJECT:this method pulls the data and if there is missing dates it fills it with random value,
//in future data shouldn't be missing in database, the dates should be printed to the graph directly or estimation of the values should be improoved
function postPHP(filename, chid, idtab) {
    var dateFrom;
    var dateTo;

    //if the dates are not chosen, by default take seven days before current date
    if (($('#dateFrom' + currentTabIdNumber).val() == "") || $('#dateTo' + currentTabIdNumber).val() == "") {
        $(".datepicker2").datepicker('setDate', new Date());
        var datee = $('.datepicker2').datepicker('getDate');
        var sevenDaysBefore = new Date();
        sevenDaysBefore.setDate(datee.getDate() - 7);
        $(".datepicker1").datepicker('setDate', sevenDaysBefore);
    }
    dateFrom = $('#dateFrom' + currentTabIdNumber).val();
    dateTo = $('#dateTo' + currentTabIdNumber).val();

    var dateFromObj = Date.parse(dateFrom);
    var dateToObj = Date.parse(dateTo);
    var daysTotal = dayDiff(dateFromObj, dateToObj) + 1;
    if (daysTotal <= 0) {
        plot1.destroy();
        return;
    }

    $.post(filename, { dateFrom: dateFrom, dateTo: dateTo })
            .done(function (result) {
                var arr = JSON.parse("[" + result + "]");
                var avgUnit = arr[0][2];
                avgUnit.shift();
                var dateRecorded = arr[0][3];
                dateRecorded.shift();
                var daysMilli = [];
                for (i = 0; i < dateRecorded.length; i++)
                    daysMilli.push(Date.parse(dateRecorded[i]));

                var min = parseFloat(arr[0][0][0]);
                var max = parseFloat(arr[0][1][0]);
                var startDateString = dateFrom;
                var startDate = Date.parse(startDateString);
                var daysExpected = [];
                for (i = 0; i < daysTotal; i++) {
                    if (i === 0)
                        daysExpected.push(startDate);
                    else
                        daysExpected.push(addDays(startDate, i));
                }

                // generate random points
                var mixedPoints = [];
                for (i = 0; i < daysTotal; i++)
                    mixedPoints.push(Math.random() * (max - min) + min);

                // if there are corresponding dates, replace the randomly generated one
                for (i = 0; i < daysTotal; i++) {
                    var currentDate = daysExpected[i];
                    // get the index of the currentDate
                    var index = daysMilli.indexOf(currentDate);
                    if (index !== -1) {
                        mixedPoints[i] = parseFloat(avgUnit[index]);
                    }
                }

                var title = document.getElementById(chid).title;
                //generate graph
                ch1 = new myGraph(mixedPoints, chid, title, idtab, parseInt(min), parseInt(max));
                document.getElementById(chid).style.display = "block";
                plot1.replot();
            });


}
;

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return Date.parse(result);
}

//window onload for index page
window.onload = function () {
    //initialize event listeners for the tabs
    var myTabs = document.getElementsByClassName("t");
    for (var i = 0; i < myTabs.length; i++) {
        myTabs[i].addEventListener("click", tabsAction);
    }
    //initialize  very first graph        
    postPHP('http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/ElectricityUsageFromTo.php', 'chart1', "tabs-1");
};
function getFileName(id) {
    var filename = '';
    //assign what file to retrieve from depends on the tab
    if (id == 1) {
        filename = 'http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/ElectricityUsageFromTo.php';
    }
    else if (id == 2) {
        filename = 'http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/ElectricityDemandFromTo.php';
    }
    else if (id == 3) {
        filename = 'http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/WaterUsageFromTo.php';
    }
    else if (id == 4) {
        filename = 'http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/OutsideTemperatureFromTo.php';
    }
    else if (id == 5) {
        filename = 'http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/GasConsumptionFromTo.php';
    }
    else {
        filename = 'http://cannxs.org/eod/EOD_KyleZak/EODProject/queries/eod.php';
    }


    return filename;
}
//prepare xlabels array 
//tekes length of my data array and generates dates
function getTicks(len) {
    var ticks = [];
    //var ticks = [[1, '1-Apr'], [2, '2-Apr'], [3, '3-Apr'], [4, '4-Apr'], [5, '5-Apr'], [6, '6-Apr'], [7, '7-Apr'], [8, '8-Apr'], [9, '9-Apr'], [10, '10-Apr'], [11, '11-Apr'], [12, '12-Apr'], [13, '13-Apr'], [14, '14-Apr'], [15, '15-Apr'], [16, '16-Apr'], [17, '17-Apr'], [18, '18-Apr'], [19, '19-Apr'], [20, '20-Apr'], [21, '21-Apr'], [22, '22-Apr'], [23, '23-Apr'], [24, '24-Apr'], [25, '25-Apr'], [26, '26-Apr']];
    //get current data
    //var currDate = new Date();

    //get chosen data
    var tickDate = new Date(Date.parse($('#dateFrom' + currentTabIdNumber).val()));
    // var tickDate = new Date(currDate.day()-10);    
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    // alert(tickDate.getDate()+1);

    //add one day to each data point
    for (var i = 0; i < (len) ; i++) {
        ticks.push([i + 1, month[tickDate.getMonth()] + "-" + tickDate.getDate()]);
        tickDate.setDate(tickDate.getDate() + 1);
    }
    return ticks;
}
;

function verifyDates() {
    // if there's nothing in the textarea, do nothing
    var dateFrom = $('#dateFrom' + currentTabIdNumber).datepicker("getDate");
    var dateTo = $('#dateTo' + currentTabIdNumber).datepicker("getDate");
    if (dateFrom === null || dateTo === null)
        return false;
    return true;
}

function dayDiff(first, second) {
    return (second - first) / (1000 * 60 * 60 * 24);
}