$(function() {
    // Variable to store your files
    var files;

    // Add events
    $('input[type=file]').on('change', prepareUpload);

    // Grab the files and set them to our variable
    function prepareUpload(event) {
        files = event.target.files;
    }

    var barChart = (function() {
        var rawData,
            chart,
            chartData;

        return {
            setData: function(key, data) {
                // add label to data
                rawData = [{
                    key: key,
                    values: data.map(function(item) {
                        return {
                            label: item.date,
                            value: parseInt(item.visits)
                        };
                    })
                }];
                return this;
            },
            draw: function() {
                nv.addGraph(function() {
                    var height = 500;
                    
                    chart = nv.models.discreteBarChart()
                        .x(function(d) {
                            return d.label
                        })
                        .y(function(d) {
                            return d.value
                        })
                        .staggerLabels(true)
                        //.staggerLabels(historicalBarChart[0].values.length > 8)
                        .showValues(true)
                        .duration(250)
                        .height(height);
                    var xAxis = chart.xAxis.axisLabel('ID')
                        .ticks(20);

                    chartData = d3.select('#chart1 svg')
                        .datum(rawData)
                        .call(chart)
                        .style({ 'height': height });

                    nv.utils.windowResize(chart.update);
                    return chart;
                });
                return this;
            },
            updateRange: function(range) {
                var newData = [{
                    key: rawData[0].key,
                    values: []
                }];
                var inRange = function(date, dateRange) {
                    var date = new Date(date).getTime();
                    return date >= new Date(dateRange.start).getTime() && date <= new Date(dateRange.end).getTime();
                };

                for (var i = 0; i < range.length; i++) {
                    var total = 0, count = 0;
                    rawData[0].values.forEach(function(v) {
                        if(inRange(v.label, range[i])) {
                            total += v.value;
                            count++;
                        }
                    });
                    newData[0].values.push({
                        label: range[i].start + '-' + range[i].end,
                        value: total / count
                    })
                }

                chartData.datum(newData).transition().duration(500).call(chart);
                return this;
            },
            getDateRange: function() {
                var data = rawData[0].values, len = data.length;
                return {
                    minDate: new Date(data[0].label),
                    maxDate: new Date(data[len - 1].label)
                };
            }
        }

    }());

    $('#get-file').click(function() {
        $(this).attr('disabled', true);
        $.ajax({
            url: 'parser',
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR) {
                $('#get-file').attr('disabled', false);
                if (typeof data.error === 'undefined') {
                    // if no error
                    console.log(data);
                    barChart.setData('chart 1', data).draw();
                    // set range selector
                    ranges.init();
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
    
    var ranges = (function() {
        var elements = $('.range-selector'),
            store = [];
        return {
            init: function() {
                this.setRangeStore($('.range-selector').length / 2);
                elements.change(function() {
                    var range = $(this).data('range'),
                        point = $(this).data('point');
                    store[range - 1][point] = $(this).val();
                    console.log(store);
                    ranges.checkUpdate();
                }).datepicker(barChart.getDateRange());
            },
            setRangeStore: function(length) {
                for (; length--; ) {
                    store.push({});
                }
            },
            checkUpdate: function() {
                var result = [];
                store.forEach(function(s) {
                    if(s.start && s.end) {
                        result.push(s);
                    }
                });
                if(result.length) {
                    barChart.updateRange(result);
                }
            }
        };
    }());
/*    (function() {
        var data = [ { "date": "2015-06-13", "Number": "153", "id": 0 }, { "date": "2015-06-14", "Number": "162", "id": 1 }, { "date": "2015-06-15", "Number": "130", "id": 2 }, { "date": "2015-06-16", "Number": "162", "id": 3 }, { "date": "2015-06-17", "Number": "226", "id": 4 }, { "date": "2015-06-18", "Number": "375", "id": 5 }, { "date": "2015-06-19", "Number": "145", "id": 6 }, { "date": "2015-06-20", "Number": "116", "id": 7 }, { "date": "2015-06-21", "Number": "105", "id": 8 }, { "date": "2015-06-22", "Number": "111", "id": 9 }, { "date": "2015-06-23", "Number": "111", "id": 10 }, { "date": "2015-06-24", "Number": "117", "id": 11 }, { "date": "2015-06-25", "Number": "99", "id": 12 }, { "date": "2015-06-26", "Number": "95", "id": 13 }, { "date": "2015-06-27", "Number": "151", "id": 14 }, { "date": "2015-06-28", "Number": "192", "id": 15 }, { "date": "2015-06-29", "Number": "527", "id": 16 }, { "date": "2015-06-30", "Number": "453", "id": 17 }, { "date": "2015-07-01", "Number": "134", "id": 18 }, { "date": "2015-07-02", "Number": "75", "id": 19 }, { "date": "2015-07-03", "Number": "91", "id": 20 }, { "date": "2015-07-04", "Number": "82", "id": 21 }, { "date": "2015-07-05", "Number": "84", "id": 22 }, { "date": "2015-07-06", "Number": "82", "id": 23 }, { "date": "2015-07-07", "Number": "101", "id": 24 }, { "date": "2015-07-08", "Number": "87", "id": 25 }, { "date": "2015-07-09", "Number": "85", "id": 26 }, { "date": "2015-07-10", "Number": "71", "id": 27 }, { "date": "2015-07-11", "Number": "84", "id": 28 }, { "date": "2015-07-12", "Number": "82", "id": 29 }, { "date": "2015-07-13", "Number": "64", "id": 30 }, { "date": "2015-07-14", "Number": "80", "id": 31 }, { "date": "2015-07-15", "Number": "69", "id": 32 }, { "date": "2015-07-16", "Number": "75", "id": 33 }, { "date": "2015-07-17", "Number": "83", "id": 34 }, { "date": "2015-07-18", "Number": "96", "id": 35 }, { "date": "2015-07-19", "Number": "103", "id": 36 }, { "date": "2015-07-20", "Number": "72", "id": 37 }, { "date": "2015-07-21", "Number": "98", "id": 38 }, { "date": "2015-07-22", "Number": "90", "id": 39 }, { "date": "2015-07-23", "Number": "80", "id": 40 }, { "date": "2015-07-24", "Number": "78", "id": 41 }, { "date": "2015-07-25", "Number": "77", "id": 42 }, { "date": "2015-07-26", "Number": "95", "id": 43 }, { "date": "2015-07-27", "Number": "68", "id": 44 }, { "date": "2015-07-28", "Number": "88", "id": 45 }, { "date": "2015-07-29", "Number": "84", "id": 46 }, { "date": "2015-07-30", "Number": "110", "id": 47 }, { "date": "2015-07-31", "Number": "86", "id": 48 }, { "date": "2015-08-01", "Number": "89", "id": 49 }, { "date": "2015-08-02", "Number": "85", "id": 50 }, { "date": "2015-08-03", "Number": "95", "id": 51 }, { "date": "2015-08-04", "Number": "104", "id": 52 }, { "date": "2015-08-05", "Number": "103", "id": 53 }, { "date": "2015-08-06", "Number": "105", "id": 54 }, { "date": "2015-08-07", "Number": "103", "id": 55 }, { "date": "2015-08-08", "Number": "95", "id": 56 }, { "date": "2015-08-09", "Number": "81", "id": 57 }, { "date": "2015-08-10", "Number": "91", "id": 58 }, { "date": "2015-08-11", "Number": "97", "id": 59 }, { "date": "2015-08-12", "Number": "88", "id": 60 }, { "date": "2015-08-13", "Number": "75", "id": 61 }, { "date": "2015-08-14", "Number": "90", "id": 62 }, { "date": "2015-08-15", "Number": "88", "id": 63 }, { "date": "2015-08-16", "Number": "95", "id": 64 }, { "date": "2015-08-17", "Number": "97", "id": 65 }, { "date": "2015-08-18", "Number": "131", "id": 66 }, { "date": "2015-08-19", "Number": "96", "id": 67 }, { "date": "2015-08-20", "Number": "94", "id": 68 }, { "date": "2015-08-21", "Number": "103", "id": 69 }, { "date": "2015-08-22", "Number": "106", "id": 70 }, { "date": "2015-08-23", "Number": "85", "id": 71 }, { "date": "2015-08-24", "Number": "133", "id": 72 }, { "date": "2015-08-25", "Number": "169", "id": 73 }, { "date": "2015-08-26", "Number": "94", "id": 74 }, { "date": "2015-08-27", "Number": "103", "id": 75 }, { "date": "2015-08-28", "Number": "99", "id": 76 }, { "date": "2015-08-29", "Number": "95", "id": 77 }, { "date": "2015-08-30", "Number": "79", "id": 78 }, { "date": "2015-08-31", "Number": "102", "id": 79 }, { "date": "2015-09-01", "Number": "184", "id": 80 }, { "date": "2015-09-02", "Number": "85", "id": 81 }, { "date": "2015-09-03", "Number": "91", "id": 82 }, { "date": "2015-09-04", "Number": "104", "id": 83 }, { "date": "2015-09-05", "Number": "92", "id": 84 }, { "date": "2015-09-06", "Number": "116", "id": 85 }, { "date": "2015-09-07", "Number": "102", "id": 86 }, { "date": "2015-09-08", "Number": "119", "id": 87 }, { "date": "2015-09-09", "Number": "113", "id": 88 }, { "date": "2015-09-10", "Number": "101", "id": 89 } ]; 
        barChart.setData('chart 1', data).draw();
        // set range selector
        ranges.init(); 
    }());*/
});
