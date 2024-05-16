// queryURL
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

// get GeoJSON data
d3.json(queryURL).then(function (data) {
    createFeatures(data.features);
});

// create a map obj
let myMap = L.map("map", {
    center:  [37.09, -95.71],
    zoom: 4,
});

// add a tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(mag) {
    return Math.sqrt(mag) *35000;
};

// create markerColor function to set colors for depths
function markerColor(depth) {
    if (depth <= 10) return "#FAA0A0"; 
    else if (depth <= 30) return "#F88379"; 
    else if (depth <= 50) return "#FA5F55"; 
    else if (depth <= 70) return "#D2042D"; 
    else if (depth <= 90) return "#800020" ; 
    else return "#880808"; 
};

// create circle markers 
function createFeatures(EQdata) {
    for (let i = 0; i < EQdata.length; i++) {
        let coordinates = EQdata[i].geometry.coordinates;
        let magnitude = EQdata[i].properties.mag;
        let location = EQdata[i].properties.place;
        let time = EQdata[i].properties.time;
        let sig = EQdata[i].properties.sig;
        
        let circle = L.circle([coordinates[1], coordinates[0]], {
            color: 'black',
            weight: '1',
            fillColor: markerColor(coordinates[2]),
            fillOpacity: 0.9,
            radius: markerSize(magnitude)
        }).addTo(myMap);

        circle.bindPopup(`<b>Location:</b> ${location}<hr><b>Magnitude:</b> ${magnitude}<hr><b>Depth:</b> ${coordinates[2]}<hr><b>Significance:</b> ${sig}<hr><b>Time:</b> ${new Date(time)}<hr>`);
    }
}

// Add legend to myMap 
let legend = L.control({position: 'bottomleft'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += '<h3 style="text-align: center;">Earthquake Depth</h3>';;

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
        return div;
};
legend.addTo(myMap);