//DEFINE VARIABLES

//create variable to hold all related code
const spotifyApp = {};

spotifyApp.tracks = [];

// Smooth Scroll 
$(function() {
		$('a').smoothScroll();
});

//  through user input to get exact match of artist

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

spotifyApp.displayArtistName = function(name) {
	if ($('.userSelection li').length < 10) {
		$('.userSelection').append("<li>" + name + "</li>");
	} 

	if ($('.userSelection li').length === 10) {
		$('#selectArtist').attr('disabled', 'disabled');
	}
}

//get albums
spotifyApp.getAlbums = function(id) {
	return $.ajax({
		url: 'https://api.spotify.com/v1/artists/' + id + '/albums',
		method: 'GET',
		dataType: 'json',
		data: {
			album_type: 'album'
		}
	})
}

// get tracks based on random album generated 
spotifyApp.getTracks = function(id){
	// console.log('tracks')
	return $.ajax({
		url:'https://api.spotify.com/v1/albums/' + id + '/tracks',
		method: 'GET',
		dataType: 'json',
	})
}

// display dynamic playlist to user (use iframe/widget)
spotifyApp.displayPlaylist = function(playlist) {
	// console.log(""playlist)
	$('iframe').attr('src', playlist);
};

spotifyApp.init = function(){

// User clicks on arrow to open app
	$("a").on('click', function(){
		$("#main").removeClass("hidden");
		$("footer").removeClass("hidden");
		$.smoothScroll({
			scrollElement: $('body'),
			scrollTarget: '#main'
		});
	}) /* end open app */

// User searches for up to 10 artists  (multiple search boxes)
// When user hits select artist, get value of user input
	$("#form").submit(function(e){
		e.preventDefault();
		// console.log("submitted");
		//Get user input
		var searchArtist = $("input[type=search]").val();
		$("input[type=search]").val('');
		//store result of search for that artist
		var returnedArtist = spotifyApp.getArtist(searchArtist);
		//if no artist is returned, alert user

		//Once artist list is returned, run filter
		$.when(returnedArtist)
		.then(function(data) {
			// console.log(data);
			//filter to find exact match of user input
			var matchedArtist = data.artists.items.filter(function(artist){
				//use toLowerCase method to eliminate spelling differences
				return artist.name.toLowerCase() == searchArtist.toLowerCase();
				});

			// console.log(matchedArtist);

			if (matchedArtist[0] === undefined) {
				alert("Could not find the artist. Please try again.");
			}

			var displayArtist = matchedArtist[0].name;
			spotifyApp.displayArtistName(displayArtist);


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
				//get popular album tracks 
				$.when(randomAlbums)
				.then(function(data){
					data.forEach(function(album){
						spotifyApp.tracks.push(spotifyApp.getTracks(album));
					});
					$.when.apply($, spotifyApp.tracks)
						.then(function(){
							//turn the array-like element into an array
							let results = Array.prototype.slice.call(arguments);
							// console.log(results);
							//store all album tracks 
							var allTracks = [];
							results.forEach(function(item){
								allTracks.push(item[0].items);
							});
							// console.log(allTracks);
							//store a random track uri
							spotifyApp.randomTracks = [];
							// console.log("random track!!", spotifyApp.randomTracks);
							allTracks.forEach(function(track){
								var randomTrackNumber = Math.floor(Math.random() * track.length);
								spotifyApp.randomTracks.push(track[randomTrackNumber].uri);
							});
							// store random uris in array
							spotifyApp.URIarray = [];
							// console.log("random track!!", spotifyApp.URIarray);
							spotifyApp.randomTracks.forEach(function(uri){
								spotifyApp.URIarray.push(uri.replace('spotify:track:', ''));
							});
							//randomize songs within playlist
							spotifyApp.shuffledArray = _.shuffle(spotifyApp.URIarray);
							console.log("random track!!", spotifyApp.shuffledArray);

							//create embedPlaylist variable with uris from array
							spotifyApp.embedPlaylist = "https://embed.spotify.com/?uri=spotify:trackset:NOW PLAYING:" + spotifyApp.shuffledArray.toString();


						}) /* Get random tracks */
				});/*Get random album*/
			}); /* end artistAlbums promise */
		}); /* ends returnedArtist promise */
	}); /* ends submit listener */

// once user selects artists, submit button to make playlist appear
	$("#generatePlaylist").on('click',function(e){
		e.preventDefault();
		$(".playlist").css("opacity",1).css("z-index", 10);

		// $('iframe').removeAttr('src'); 

		//display playlist to user
		console.log("PLAYLIST", spotifyApp.embedPlaylist)

		spotifyApp.displayPlaylist(spotifyApp.embedPlaylist);


	}); /* ends playlist click listener */ 

// once user selects artists, submit button to make playlist appear
	$("#resetPlaylist").on('click',function(e){
		e.preventDefault();
		// console.log(spotifyApp.shuffledArray);

		// hide iframe after reset button clicked 
		$('iframe').removeAttr('src'); 

		// enable submit button to work
		$('#selectArtist').attr('disabled', false);

		// remove list of artists 
		$('.userSelection').empty();

		// hide playlist 
		$(".playlist").css("opacity",0).css("z-index", -10);

		// empty tracks array 
		spotifyApp.tracks = [];

	}); /* ends playlist click listener */ 	

}; /* ends init */

// $('.play').addClass('animated bounceOutLeft');


//DOCUMENT READY
$(function(){
	//initialize app
	 spotifyApp.init(); 
});

