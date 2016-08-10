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
spotifyApp.getAlbums = function(id) {
	return $.ajax({
		url: 'https://api.spotify.com/v1/artists/' + id + '/albums',
		method: 'GET',
		dataType: 'json',
		data: {
			country: 'CA',
			album_type: 'album',
		}
	})
}

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
			var artistId = matchedArtist[0].id;
			var artistAlbums = spotifyApp.getAlbums(artistId);

			$.when(artistAlbums)
			.then(function(albums){
				// create empty array which stores album IDs 
				spotifyApp.randomIDs = [];
				
				// push each album ID into an array 
				albums.items.forEach(function(item){
					spotifyApp.randomIDs.push(item.id);
				});

				// Get 3 random album IDs 
				spotifyApp.getRandomAlbums = function(albums, number) {
				    var randomArray = [];
				    for (var i = 0; i < number; i++) {
				        randomArray.push(albums[Math.floor(Math.random()*albums.length)]);
				    }
				    return randomArray;
				}

				var randomAlbums = spotifyApp.getRandomAlbums(spotifyApp.randomIDs, 3);
					console.log(randomAlbums);
			}); /* end artistAlbums promise */
		}); /* ends returnedArtist promise */
	}); /* ends submit listener */
}; /* ends init */

//DOCUMENT READY
$(function(){
	//initialize app
	 spotifyApp.init(); 
});

