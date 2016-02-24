$(function() {
    // Variable to store your files
    var files;

    // Add events
    $('input[type=file]').on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event) {
        files = event.target.files;
    }

    var barChartData;

    var setBarChartData = function(key, data) {
    	// add label to data
    	var values = _.map(data, function(item) {
    		return {
    			label: item.id,
    			value: item['Number']
    		};
    	});
    	console.log(values);
        barChartData = [{
            key: key,
            values: values
        }];
    };

    var drawBarChart = function() {
        nv.addGraph(function() {
            var chart = nv.models.discreteBarChart()
                .x(function(d) {
                    return d.label
                })
                .y(function(d) {
                    return d.value
                })
                .staggerLabels(true)
                //.staggerLabels(historicalBarChart[0].values.length > 8)
                .showValues(true)
                .duration(250);

            d3.select('#chart1 svg')
                .datum(barChartData)
                .call(chart);

            nv.utils.windowResize(chart.update);
            return chart;
        });
    };

    $('#fileUpload').submit(function(event) {
        event.preventDefault();
        // Create a formdata object and add the files
        var data = new FormData();
        data.append('file', files[0]);
        $.ajax({
            url: 'parser.php',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {
                    // if no error
                    console.log(data);
                    setBarChartData('chart 1', data);
                    drawBarChart();
                } else {
                    // Handle errors here
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });
    });
});
