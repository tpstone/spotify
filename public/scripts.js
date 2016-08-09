//DEFINE VARIABLES

//create variable to hold all related code
const spotifyApp = {};

//get artist
spotifyApp.getArtist = function(artist){
	return $.ajax ({
		url: 'https://api.spotify.com/v1/search',
		method: 'GET',
		dataType: 'json',
		data: {
			q: artist,
			type: 'artist'
		}
	})
};

//get songs (2-3 from each artist)

//make random playlist (fall-themed)

//display playlist to user (use iframe/widget)

spotifyApp.init = function(){
// User searches for up to 10 artists  (multiple search boxes)
// When user hits select artist, get value of user input
	$("#form").submit(function(e){
		e.preventDefault();
		//Get user input
		var searchArtist = $("input[type=search]").val();
		//store result of search for that artist
		var returnedArtist = spotifyApp.getArtist(searchArtist);
		//if no artist is returned, alert user
		//Once artist list is returned, run filter
		$.when(returnedArtist)
		.then(function(data) {
			//filter to find exact match of user input
			var matchedArtist = data.artists.items.filter(function(artist){
				//use toLowerCase method to eliminate spelling differences
				return artist.name.toLowerCase() == searchArtist.toLowerCase();
			});
		}); /* ends promise */
	}); /* ends submit listener */
}; /* ends init */

//DOCUMENT READY
$(function(){
	//initialize app
	 spotifyApp.init(); 
});

