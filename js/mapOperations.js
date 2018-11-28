function getPolygon(inputLayer) {
    var layerGroup = document.getElementById(inputLayer);
    layer = layerGroup.options[layerGroup.selectedIndex].value;
    overlays =  controls.getOverlays();
    for(var key in overlays) {
        if(layer == overlays[key].name) {
            return overlays[key];
        }
    }
}

function createBuffer(inputLayer, distanceId) {
    var distance = document.getElementById(distanceId).value;
    if (distance < 0) {
        return;
    }
    var bufferLayer = L.layerGroup();
    var overlay = getPolygon(inputLayer);
    var buffered = turf.buffer(overlay.layer.toGeoJSON(), distance/10, {units: 'kilometers'});
    var name = "buffer_" + overlay.name + "_" + distance;
    afterOperation(bufferLayer, buffered, name);
}

function unify(polyList) {
    for (var i = 0; i < polyList.length; ++i) {
        if (i == 0) {
            var unionTemp = polyList[i].toGeoJSON();
        } else {
            unionTemp = turf.union(unionTemp, polyList[i].toGeoJSON());
        }
    }
    return unionTemp;
}

function createUnion(inputLayer1, inputLayer2) {
    var unionLayer = L.layerGroup();
    var polygon1 = getPolygon(inputLayer1);
    var polygon2 = getPolygon(inputLayer2);
    layers1 = polygon1.layer.getLayers();
    layers2 = polygon2.layer.getLayers();
    var features = layers1.concat(layers2);
    var unionTemp = unify(features);
    var name = "union_" + polygon1.name + "_" + polygon2.name;
    afterOperation(unionLayer, unionTemp, name)
}

function createIntersection(inputLayer1, inputLayer2) {
    var intersectLayer = L.layerGroup();
    var polygon1 = getPolygon(inputLayer1);
    var polygon2 = getPolygon(inputLayer2);
    var features1 = polygon1.layer.getLayers();
    var features2 = polygon2.layer.getLayers();

    var features = [];
    for(var i = 0; i<features1.length; i++) {
        features[i] = features1[i].toGeoJSON();
    }
    for(var i = 0; i<features2.length; i++) {
        features[features1.length + i] = features2[i].toGeoJSON();
    }
    var totalIntersection;
    for(var i = 0; i < features.length; i++) {
        for (var j = 0; j < features.length; j++) {
            if(i != j) {
                if(turf.booleanOverlap(features[i], features[j])) {
                    tempIntersection = turf.intersect(features[i], features[j]);
                    if(totalIntersection == undefined) {
                        totalIntersection = tempIntersection;
                    } else {
                        totalIntersection = turf.union(totalIntersection, tempIntersection);
                    }
                }
            }
        }
    }

    var name = "intersection_" + polygon1.name + "_" + polygon2.name;
    afterOperation(intersectLayer, totalIntersection, name)
}

function createDifference(Layer1, differenceMainLayer) {
    var differenceLayer = L.layerGroup();
    var polygon1 = getPolygon(Layer1);
    var polygon2 = getPolygon(differenceMainLayer);
    var features1 = polygon1.layer.getLayers();
    var features2 = polygon2.layer.getLayers();
    var totalDifference;

    // Check if overlap and save features that overlap
    var overlappingClipFeatures = [];
    for(var i = 0; i < features1.length; i++) {
        for(var j = 0; j < features2.length; j++) {
            if(turf.booleanOverlap(features1[i].toGeoJSON(),features2[j].toGeoJSON())) {
                if(! overlappingClipFeatures.includes(features2[j])) {
                    overlappingClipFeatures.push(features2[j]);
                }
            }
        }
    }
    var clipFeature = overlappingClipFeatures.length == 0 ? features2 : overlappingClipFeatures;

    for(var i = 0; i < features1.length; i++) {
        for(var j = 0; j < clipFeature.length; j++) {
            tempDifference = turf.difference(features1[i].toGeoJSON(), clipFeature[j].toGeoJSON());

            if(totalDifference == undefined) {
                totalDifference = tempDifference;
            } else {
                totalDifference = turf.union(totalDifference, tempDifference);
            }
        }
    }
    var name = "difference_" + polygon1.name + "_" + polygon2.name;
    afterOperation(differenceLayer, totalDifference, name);
}

function createFilter(layerId, featureId, signId, valueId) {
    layerElement = document.getElementById(layerId);
    featureElement = document.getElementById(featureId);
    signElement = document.getElementById(signId);
    valueElement = document.getElementById(valueId);
    var filterLayer = L.layerGroup();
    // Extract chosen value (number or string)
    var val;
    if(valueElement.tagName == "INPUT") {
        val = valueElement.value;
        if(val < 0) {
            return;
        }
    } else {
        val = valueElement.options[valueElement.selectedIndex].value;
    }
    // Get all features from layer
    layerName = layerElement.options[layerElement.selectedIndex].value;
    polygon = getSelectedLayer(layerName);
    console.log(polygon)
    // Get sign
    sign = signElement.options[signElement.selectedIndex].value;

    // Get filter feature
    filterFeature = featureElement.options[featureElement.selectedIndex].value;

    var filter = [];
    var featureGroups = polygon.getLayers();
    for (var i = 0; i < featureGroups.length; i++) {
        var features = featureGroups[i].getLayers();
        for (var j = 0; j < features.length; j++) {
            if(sign == "=") {
                if(features[j].feature.properties[filterFeature] == val) {
                    filter.push(features[j]);
                    filterLayer.addLayer(features[j]);
                }
            } else if (sign == "!=") {
                if(features[j].feature.properties[filterFeature] != val) {
                    filter.push(features[j]);
                    filterLayer.addLayer(features[j]);
                }
            } else if (sign == ">") {
                if(features[j].feature.properties[filterFeature] > val) {
                    filter.push(features[j]);
                    filterLayer.addLayer(features[j]);
                }
            } else if (sign == "<") {
                if(features[j].feature.properties[filterFeature] < val) {
                    filter.push(features[j]);
                    filterLayer.addLayer(features[j]);
                }
            }

        }
    }
    var name = "filter_" + layerName + "_" + filterFeature + "_" + sign + "_" + val;
    overlay[name] = filterLayer;
    filterLayer.addTo(map);
    controls.addOverlay(filterLayer, name);
    updateLayerGroup();

}

function afterOperation(targetLayer, polygon, name) {
    var color = "#" + Math.floor(Math.random()*16777216).toString(16);
    L.geoJSON(polygon, {
        style: function (feature) {
            return {
                "fill": true,
                "fillOpacity": 0.8,
                "stroke": true,
                "color": "#000000",
                "weight": 1,
                "fillColor": color
            };
        }, //Add features in dictionary layers
        onEachFeature: function(feature, layer) {
            targetLayer.addLayer(layer);
            layer.bindPopup(function(layer) {
                console.log(feature.properties);
                return name;
            })
        }
    });
    overlay[name] = targetLayer;
    targetLayer.addTo(map);
    targetLayer.eachLayer(function (layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    });
    controls.addOverlay(targetLayer, name);
    updateLayerGroup();
}

//Help function
function addFeaturesToMap(feature, name) {
    var color = "#" + Math.floor(Math.random()*16777216).toString(16);
    L.geoJSON(tempDifference, {
        style: function (feature) {
            return {
                "fill": true,
                "fillOpacity": 0.8,
                "stroke": true,
                "color": "#000000",
                "weight": 1,
                "fillColor": color
            };
        }, //Add features in dictionary layers
        onEachFeature: function(feature, layer) {
            L.layerGroup().addLayer(layer);
            layer.bindPopup(function(layer) {
                return name;
            });
            controls.addOverlay(layer, name);
        }
    }).addTo(map);
}