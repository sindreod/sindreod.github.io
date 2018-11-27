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