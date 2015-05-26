//	MWT - W11 - JSON
//	ver 1.9
//	JavaScript file
//	by Andrei Rjabokon
//	21/05/2015
																		// Variables
var searchButton = '#searchButton';										// handle for search button
var inputField = '#inputField';											// handle for input field
var imageDiv = '#images';												// handle for div with thumbs
var imgPopups = '#imgPopups';											// handle for div with popups
var searchString = '';
var imgArray = [];														// to keep URLs, no duplicate search results
var imgId = 0;
var searchForImages = 5;												// limit of results displayed
var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

function bodyInitialise() {												// onload and event handler for button(s)
	$(searchButton).on("click", startSearch);
	picsLoad(searchString);												// load first pics 
}

function startSearch() {												// Main Search button click
	searchString = $(inputField).val();									// get the value
	picsLoad(searchString);												// get pics according to search string
}

function picsLoad(searchString) {
	$.getJSON( flickerAPI, {											// define JSON parameters
		tags: searchString,
		tagmode: "any",
		format: "json"
	})
    
	.done(function(data) {												// when done - call
		var imgCounter = 0;												// count images in each search
		$.each( data.items, function( i, item ) {
			var imgSource = item.media.m;								// save thumbnail src
			var testForDubs = imgArray.indexOf(imgSource);				// check in array for duplicates				
			
			if (testForDubs == -1) {									// if not duplicate, then
				imgArray.push(imgSource); 								// store src in array
				imgId = imgId + 1;										// id for new thumbnail
	
				var temp = $("<img>");									// create img tag
				temp.attr("id", imgId);									// add id
				temp.attr("src", imgSource);							// add src attribute from item			
				$(imageDiv).prepend(temp);								// prepend the div, new searches appear on top
				$(temp).on("click", displayPops);						// bind a function, not <a> !!!
				
				fullImgSrc = imgSource.replace('_m.jpg','.jpg');		// create a link to full image
				var divId = 'div' + imgId;								// id for new div
				
				divString = '<div data-role="popup" id="' + divId + '" data-overlay-theme="b" data-theme="b" data-corners="false" data-position-to="window"><a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" src="' + fullImgSrc + '"></div>';
				
				$(imgPopups).prepend(divString);						// add div to the DOM
				
				divId = '#' + divId;									// update divId for a handle
				$(divId).popup();										// call new div a popup
				
				imgCounter = imgCounter + 1;							// update counter for new search result		
			}

			if (imgCounter === searchForImages) {						// search limit 
				return false;
			}
		});
    });
}

function displayPops() {
	thumbId = $(this).attr('id');										// get thumb id
	divId = '#div' + thumbId;											// create a handle
	$(divId).popup('open');												// open the popup
}
