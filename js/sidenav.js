//Tab menu function
function openTab(evt, tabId, tabcontentString, tablinkString) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName(tabcontentString);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinkString" and remove the class "active"
    tablinks = document.getElementsByClassName(tablinkString);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className += " active";
}

// Create dropdowns in sidenav
function addDropdown() {
    var dropdown = document.getElementsByClassName("dropDown");
    for (var i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function(e) {
            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    }
}

// Update layerGroup if function is used (buffer, union, intersection etc)
function updateLayerGroup() {
    targets = document.getElementsByClassName("dropDownLayerGroup");
    var overlays = controls.getOverlays();
    for(var i = 0; i< targets.length; i++) {
        //Clear dropdown options
        while(targets[i].length > 1) {
            targets[i].removeChild(targets[i].children[1]);
        }
        for(var key in overlays) {
            var element = document.createElement("OPTION");
            element.innerHTML = overlays[key].name;
            targets[i].add(element);
        }
    }
}

function updateFilterSelect(targetId, selectId) {
    var target = document.getElementById(targetId);
    while(target.length > 1) {
        target.removeChild(target.children[1]);
    }
    var select = document.getElementById(selectId);
    var layerName = select.options[select.selectedIndex].value;
    var layer = getSelectedLayer(layerName);
    var layers = layer.getLayers();
    var types = [];
    for (var key in layers) {
        features = layers[key].getLayers();
        for (var i = 0; i < features.length; i++) {
            for (var key in features[i].feature.properties) {
                if (!types.includes(key)) {
                    types.push(key);
                }
            }
        }
    }
    for (var i = 0; i < types.length; i++) {
        var element = document.createElement("OPTION");
        element.innerHTML = types[i];
        target.add(element);
    }

}

function updateFilterValue(targetId, selectId1, selectId2) {
    div = document.getElementById(targetId);
    select = document.getElementById(selectId1);
    selectedFeature = document.getElementById(selectId2);
    layerName = select.options[select.selectedIndex].value;
    layer = getSelectedLayer(layerName);
    var layers = layer.getLayers();
    layerVariable = selectedFeature.options[selectedFeature.selectedIndex].value;
    var filter = [];
    for (var key in layers) {
        features = layers[key].getLayers();
        for (var i = 0; i < features.length; i++) {
            for (var key in features[i].feature.properties) {
                if(key == layerVariable) {
                    if(! filter.includes(features[i].feature.properties[key])) {
                        filter.push(features[i].feature.properties[key]);
                    }
                }
            }
        }
    }
    removeElement("filterValues");
    var baseElement;
    if(isNaN(filter[0])) {
        baseElement = document.createElement("SELECT");
        for (var i = 0; i < filter.length; i++) {
            var element = document.createElement("OPTION");
            element.innerHTML = filter[i];
            baseElement.add(element);

        }
    } else {
        var baseElement = document.createElement("INPUT");
        baseElement.type = "number";
        baseElement.style = "width:39%";
    }
    baseElement.id = "filterValues";
    div.insertBefore(baseElement, document.getElementById("break"));
    baseElement.onchange = updateFilterSign('filterSign', 'filterValues');
}

function updateFilterSign(targetId, selectId) {
    var target = document.getElementById(targetId);
    while(target.length > 1) {
        target.removeChild(target.children[1]);
    }
    var select = document.getElementById(selectId);
    var tag = select.tagName;
    var element = document.createElement("OPTION");
    element.innerHTML = "=";
    target.add(element);
    element = document.createElement("OPTION");
    element.innerHTML = "!=";
    target.add(element);
    if (tag == "INPUT") {
        element = document.createElement("OPTION");
        element.innerHTML = ">";
        target.add(element);
        element = document.createElement("OPTION");
        element.innerHTML = "<";
        target.add(element);
    }
}

function removeElement(elementId) {
    var element = document.getElementById(elementId);
    if(element) {
        element.parentNode.removeChild(element);
    }
}

function getSelectedLayer(layerName) {
    overlays = controls.getOverlays();
    for(var i = 0; i < overlays.length; i++) {
        if(overlays[i].name == layerName) {
            return overlays[i].layer;
        }
    }
}

/* For the normal map */
function updateLayers() {
    var i, selectElements, layers;
    layers = normalControl.getOverlays();

    selectElements = $(".dropDownLayersB");
    for (i = 0; i < selectElements.length; i++) {
        while (selectElements[i].length > 1) {
            selectElements[i].removeChild(selectElements[i].children[1]);
        }
    }

    for(i = 0; i < layers.length; i++) {
        $(".dropDownLayersB").append($('<option></option>')
        .html(layers[i].name)
        .val(L.Util.stamp(layers[i])));
    }
}