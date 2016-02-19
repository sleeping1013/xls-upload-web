$(function() {
	// Variable to store your files
	var files;

	// Add events
	$('input[type=file]').on('change', prepareUpload);

	// Grab the files and set them to our variable
	function prepareUpload(event) {
		files = event.target.files;
	}

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
	            if(typeof data.error === 'undefined') {
	                console.log(data);
	            }
	            else {
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