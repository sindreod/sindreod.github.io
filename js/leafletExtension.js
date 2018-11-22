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

    getOverlayLayers: function () {
        // Create array for holding layers
        var layers = [];

        // Iterate all layers in control
        this._layers.forEach(function (obj) {

            // Push layer to active array
            if(obj.overlay) {
                layers.push(obj.layer);
            }
        });

        // Return array
        return layers;
    }
});
