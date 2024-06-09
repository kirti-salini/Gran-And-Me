mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({color:"#534a45"})
        .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25}) 
        .setHTML(`<h3>${listing.title}'s Location</h3><p><b>${listing.location}</b></p>`)
        )
        .addTo(map);