var PokeIcon = L.Icon.extend({
    options: {
        iconUrl: "pokeball.png"
    }
});

L.Control.Layers.include({
    getOverlays: function () {

        // Create array for holding layers
        var layers = [];

        // Iterate all layers in control
        this._layers.forEach(function (obj) {

            // Push layer to active array
            if(obj.overlay) {
                layers.push(obj);
            }
        });

        // Return array
        return layers;
    },

    getLayer: function(id) {

        return this._getLayer(id);
    },

    getLayerWithId: function(id) {

        this._layers.forEach(function(obj) {
            return obj.getLayer(id);
        });
        return null;
    }


});

L.Map.include({
    hasLayerControl: function (control) {
        console.log(this);
        for(var key in this._controlContainer.children) {
            console.log(this._controlContainer.children[key]);
            if(this._controlContainer.children[key]._layers != null) {
                return true;
            }
        }
        return false;

    }
});

function cloneOptions (options) {
    var ret = {};
    for (var i in options) {
        var item = options[i];
        if (item && item.clone) {
            ret[i] = item.clone();
        } else if (item instanceof L.Layer) {
            ret[i] = cloneLayer(item);
        } else {
            ret[i] = item;
        }
    }
    return ret;
}

function cloneInnerLayers (layer) {
    var layers = [];
    layer.eachLayer(function (inner) {
        layers.push(cloneLayer(inner));
    });
    return layers;
}

function cloneLayer (layer) {
    var options = cloneOptions(layer.options);

    // we need to test for the most specific class first, i.e.
    // Circle before CircleMarker

    // Renderers
    if (layer instanceof L.SVG) {
        return L.svg(options);
    }
    if (layer instanceof L.Canvas) {
        return L.canvas(options);
    }

    // GoogleMutant GridLayer
    if (L.GridLayer.GoogleMutant && layer instanceof L.GridLayer.GoogleMutant) {
        var googleLayer = L.gridLayer.googleMutant(options);

        layer._GAPIPromise.then(function () {
            var subLayers = Object.keys(layer._subLayers);

            for (var i in subLayers) {
                googleLayer.addGoogleLayer(subLayers[i]);
            }
        });

        return googleLayer;
    }

    // Tile layers
    if (layer instanceof L.TileLayer.WMS) {
        return L.tileLayer.wms(layer._url, options);
    }
    if (layer instanceof L.TileLayer) {
        return L.tileLayer(layer._url, options);
    }
    if (layer instanceof L.ImageOverlay) {
        return L.imageOverlay(layer._url, layer._bounds, options);
    }

    // Marker layers
    if (layer instanceof L.Marker) {
        return L.marker(layer.getLatLng(), options);
    }

    if (layer instanceof L.Circle) {
        return L.circle(layer.getLatLng(), layer.getRadius(), options);
    }
    if (layer instanceof L.CircleMarker) {
        return L.circleMarker(layer.getLatLng(), options);
    }

    if (layer instanceof L.Rectangle) {
        return L.rectangle(layer.getBounds(), options);
    }
    if (layer instanceof L.Polygon) {
        return L.polygon(layer.getLatLngs(), options);
    }
    if (layer instanceof L.Polyline) {
        return L.polyline(layer.getLatLngs(), options);
    }

    if (layer instanceof L.GeoJSON) {
        return L.geoJson(layer.toGeoJSON(), options);
    }

    if (layer instanceof L.FeatureGroup) {
        return L.featureGroup(cloneInnerLayers(layer));
    }
    if (layer instanceof L.LayerGroup) {
        return L.layerGroup(cloneInnerLayers(layer));
    }

    throw 'Unknown layer, cannot clone this layer. Leaflet-version: ' + L.version;
}

if (typeof exports === 'object') {
    module.exports = cloneLayer;
}

L.incrementEditControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        //i = myStorage.getItem("drawId");
        // Continue initializing the control plugin here.
    },

    onAdd: function(map) {
        var controlElementTag = 'div';
        var controlElementClass = 'incrementEdit-leaflet-control';
        var controlElement = L.DomUtil.create(controlElementTag, controlElementClass);

        var img = 'div';
        var imgClass = 'increment-Edit-leaflet-control-img';
        var imgElement = L.DomUtil.create(imgTag, imgClass);
        controlElement.appendChild(controlElement);

        // Continue implementing the control here.

        return controlElement;
    },

    onRemove: function(map) {
        map.remove(this);
        // Tear down the control.
    }
});
/*
L.incrementEditControl = function () {
    return new L.IncrementEditControl({});
};

L.incrementEditControl = function(options) {
    return new L.IncrementEditControl(options);
};*/