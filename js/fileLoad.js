function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5
    });
}

function resetHighlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 1
    })
}

// Load data
function loadBackgroundData() {
    //Water
    jQuery.getJSON("data/water2.geojson" , function (json) {
        L.geoJSON(json, {
            style: function (feature) {
                return {"fill":true,
                    "fillColor": "#00bfff",
                    "fillOpacity": 1,
                    "stroke": false
                }},
            onEachFeature: addBackGroundData
        }).addTo(map);
    });

    //Land
    jQuery.getJSON("data/land2.geojson" , function (json) {
        L.geoJSON(json, {
            style: function (feature) {
                return {"fill": true,
                    "fillColor": "#1ec595",
                    "fillOpacity": 1,
                    "stroke": true,
                    "color": "#000000",
                    "weight": 1
                }
            },
            onEachFeature: addBackGroundData
        }).addTo(map);
    });

    //Ocean
    jQuery.getJSON("data/Ocean.geojson" , function (json) {
        L.geoJSON(json, {
            style: function (feature) {
                return {"fill": true,
                    "fillColor": "#00bcdc",
                    "fillOpacity": 1,
                    "stroke": false
                };
            },
            onEachFeature: addBackGroundData
        }).addTo(map);
    });
}



function loadOverlayData() {
    //Load regions data and apply styling for each region
    jQuery.getJSON("data/political.geojson", function (json) {
        L.geoJSON(json, {
            style: function (feature) {
                var obj = {"fill": true,
                    "fillOpacity": 0.7,
                    "stroke": true,
                    "color": "#000000",
                    "weight": 1
                };
                switch (feature.properties.description) {
                    case "Kanto":
                        obj["fillColor"] = "#ff0000";
                        break;
                    case "Johto":
                        obj["fillColor"] = "#ffff00";
                        break;
                    case "Holon":
                        obj["fillColor"] = "#ff00ff";
                        break;
                    case "Sinnoh":
                        obj["fillColor"] = "#ffffff";
                        break;
                    case "Hoenn":
                        obj["fillColor"] = "#ff0000";
                        break;
                    case "Orange Islands":
                        obj["fillColor"] = "#ff7700";
                        break;
                    case "Sevii Islands":
                        obj["fillColor"] = "#0000ff";
                        break;
                    case "Fiore":
                        obj["fillColor"] = "#2CAA40";
                        break;
                    case "Unova":
                        obj["fillColor"] = "#0000ff";
                        break;
                    case "Almia":
                        obj["fillColor"] = "#00ff00";
                        break;
                    case "Orre":
                        obj["fillColor"] = "#ff0000";
                        break;
                    case "Oblivia":
                        obj["fillColor"] = "#ffffff";
                        break;
                    default:
                        obj["fillColor"] = "#555555";
                        break;
                } return obj;
            }, //Add features in dictionary layers
            onEachFeature: function(feature, layer) {
                if(feature.properties.description in regions) {
                    regions[feature.properties.description].addLayer(layer);
                } else {
                    regions["Rest"].addLayer(layer);
                }
                layer.bindPopup(function(layer) {
                    return "<strong> Geographical region <br> " +
                        "Name: \t\t</strong>" + layer.feature.properties.description +
                            "<br><strong>Area:\t\t</strong> " + getArea(layer) + "km" + "2".sup();
                });
                layer.bindTooltip(function(layer) {
                    return layer.feature.properties.description;
                }, {
                    permanent: false,
                    sticky: true,
                    direction: 'center',
                    className: 'labelRegion',
                    offset: L.point({x: 0, y: 40})
                });
            }
        })
    });

    jQuery.getJSON("data/cities4.geojson", function (json) {
        L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
                var pop = feature.properties.Population;
                var size = Math.pow(Math.E, 0.57*(Math.log(pop)-Math.log(0.1))) < 10 ? 10 : Math.pow(Math.E, 0.57*(Math.log(pop)-Math.log(0.1)));
                var pokeball = new PokeIcon({
                    iconSize: [size,size],
                    iconAnchor: [size/2, size/2],
                    popupAnchor: [0, -size/2]
                });
                return L.marker(latlng, {icon: pokeball});

            },
            onEachFeature: function (feature, layer) {
                if(feature.properties.Name in cities) {
                    cities[feature.properties.Name].addLayer(layer);
                } else {
                    cities[feature.properties.Name] = L.featureGroup();
                    cityLayer.addLayer(cities[feature.properties.Name]);
                    cities[feature.properties.Name].addLayer(layer);

                }
                layer.bindPopup(function(layer) {
                    return "<strong><u>" + layer.feature.properties.Name + "</strong></u>" +
                        "<br><strong>Region:</strong> " + layer.feature.properties.Region +
                        "<br><strong>Population: </strong>" + layer.feature.properties.Population +
                        "<br><strong>Description: </strong>" + layer.feature.properties.Description +
                            "<br><strong>Type: </strong>" + layer.feature.properties.Type;
                });
                layer.bindTooltip(function (layer) {
                    return layer.feature.properties.Name;
                }, {
                    permanent:false,
                    direction: "center",
                    offset: L.point({x: 0, y: 40}),
                    className: 'label',
                    opacity: 0.9
                }).openTooltip();
            }
        });
    });
}



function addBackGroundData(feature, layer) {
    backGroundLayer.addLayer(layer);
}