//DOCUMENT READY
$(function(){
	//Basic structure of our ajax request to find artists based on user input
	var practice = function(){
		$.ajax ({
			url: 'https://api.spotify.com/v1/search',
			method: 'GET',
			dataType: 'json',
			data: {
				q: "prince",
				type: 'artist'
			}
		}).then(function(data) {
			//filter out artists that don't match exact query
			var filteredArtists = data.artists.items.filter(function(item){
				//change data returned from API to lower case to compare with user input
				return item.name.toLowerCase() == "prince";
			})
			//check that a match exists
			console.log(filteredArtists);
		});
	};
	practice();
});