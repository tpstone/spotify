const spotifyApp = {};

spotifyApp.init = function(){
// User searches for up to 10 artists  (multiple search boxes)
// When user hits select artist, get value of user input
	$("#form").submit(function(e){
		e.preventDefault();
		//Get user input
		var searchArtist = $("input[type=search]").val();
		spotifyApp.getArtist(searchArtist);
	});
};


	//Basic structure of our ajax request to find artists based on user input
	 spotifyApp.getArtist = function(artist){
		$.ajax ({
			url: 'https://api.spotify.com/v1/search',
			method: 'GET',
			dataType: 'json',
			data: {
				q: artist,
				type: 'artist'
			}
		}).then(function(data) {
			console.log(data);
			spotifyApp.array = []
			data.artists.items.forEach(function(artist){
				spotifyApp.array.push(artist.name.toLowerCase());

			});
			console.log(spotifyApp.array);
			// var filteredArtists = data.artists.items.filter(function(item){
			// 	//change data returned from API to lower case to compare with user input
			// 	return item.name.toLowerCase() == searchArtist;
			// })
			//check that a match exists
			// console.log(filteredArtists);
		});
			//filter out artists that don't match exact query
			spotifyApp.filteredArtists = spotifyApp.array.filter(function(artist){
				return artist == searchArtist;

			});
			console.log(spotifyApp.filteredArtists);
	};
	// practice();

//DOCUMENT READY
$(function(){
	 spotifyApp.init(); 
});


// search for each artist and enter songs as user inputs
// Search for artists
// If no match alert user
// pull 2-3 songs from each artist.
// Create playlist 
// display playlist (iframe)
