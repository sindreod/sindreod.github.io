//Tab menu function
function openTab(evt, tabId) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
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
            for(var j = 0; j < dropdown.length; j++) {
                if (dropdown[j] == e.target) {
                    this.classList.toggle("active");
                    var dropdownContent = this.nextElementSibling;
                    if (dropdownContent.style.display === "block") {
                        dropdownContent.style.display = "none";
                    } else {
                        dropdownContent.style.display = "block";
                    }
                } else {
                    dropdown[j].nextElementSibling.style.display = "none";
                    dropdown[j].classList.remove("active");
                }
            }
        });
    }
}

function createBlank() {
    var blank = document.createElement("OPTION");
    blank.disabled = true;
    blank.value = "";
    blank.innerHTML = "-- select something --";
    return blank;
}

// Update layerGroup if function is used (buffer, union, intersection etc)
function updateLayerGroup() {
    blank = createBlank();
    targets = document.getElementsByClassName("dropDownLayerGroup");
    var overlays = controls.getOverlays();
    for(var i = 0; i< targets.length; i++) {
        //Clear dropdown options
        while(targets[i].firstChild) {
            targets[i].removeChild(targets[i].firstChild);
        }
        targets[i].add(blank);
        targets[i].selectedIndex = 0;
        for(var key in overlays) {
            var element = document.createElement("OPTION");
            element.innerHTML = overlays[key].name;
            targets[i].add(element);
        }
    }
}

function updateFilterSelect(targetId, selectId) {
    var target = document.getElementById(targetId);
    while (target.firstChild) {
        target.removeChild(target.firstChild);
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
    target.add(blank);
    target.selectedIndex = 0;
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
        baseElement.add(blank);
        baseElement.selectedIndex = 0;
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
    while(target.firstChild) {
        target.removeChild(target.firstChild);
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

/*
$('.quest1_point').change(function(){
    if($('.quest1_point').val() == 1) {
        alert("Correct! Click Next Page to continue.");
        $('#quest1_next1').removeClass("quest_locked");
        document.getElementById('quest1_next1').disabled=false;
    }
});

$("#quest1_next1").click(function(){
    map.setView(new L.LatLng(10.439, 17.292), 7);
    feature_group.removeLayer(exp_locationsJSON);
});

$('.quest1_line').bind('input',function(){
    var lineText = $('.quest1_line').val().toLowerCase();
    if(lineText == "blue fork") {
        alert("Correct!");
        $('#quest1_next2').removeClass("quest_locked");
        document.getElementById('quest1_next2').disabled=false;
    }
});

$("#quest1_next2").click(function(){
    map.setView(new L.LatLng(1.779, 29.795), 5);
    feature_group.addLayer(exp_politicalJSON);
});

$('.quest1_polygon').bind('input',function(){
    var lineText = $('.quest1_polygon').val().toLowerCase();
    if(lineText == "the westerlands" || lineText == "westerlands") {
        alert("Correct!");
        $('#quest1_next3').removeClass("quest_locked");
        document.getElementById('quest1_next3').disabled=false;
    }
});

$("#quest1_next3").click(function(){
    control = L.control.layers({},{"Locations": exp_locationsJSON,"Political": exp_politicalJSON},{collapsed:false}).addTo(map);
    feature_group.removeLayer(exp_politicalJSON);
});

$('.quest1_final1').bind('input',function(){
    var lineText = $('.quest1_final1').val().toLowerCase();
    if(lineText == "pyke") {
        alert("Correct!");
        feature_group.removeLayer(exp_locationsJSON);
        feature_group.removeLayer(exp_politicalJSON);
        setCookie("quest",2,365);
        $('#quest1_next4').removeClass("quest_locked");
        document.getElementById('quest1_next4').disabled=false;
    }
});

//Quest 2
$(".quest2").click(function(){
    startQuest2();
});

function startQuest2() {
    currentQuest = 2;
    nText = 1;
    unlock("2");
    $('.pap_text div').hide();
    $('.quest2_text1').show();
    map.setView(new L.LatLng(34.960, 18.737), 8);
    feature_group.addLayer(exp_locationsJSON);
}

$(".submit_task1").click(function(){
    var selectedValues = $(".buffered_settlements").val();
    if(selectedValues.length == 2 && selectedValues[0] == 4 && selectedValues[1] == 14) {
        alert("Correct! Your progress is now saved and you can start from this point if you leave.");
        setCookie("quest",3,365);
        startMenu();
    }
    else {
        alert("That is unfortunately not the correct answer! Try zooming in to get a clearer view.")
    }
});

//Quest 3
$(".quest3").click(function(){
    startQuest3();
});

function startQuest3() {
    removeControl();
    control = L.control.layers({},{"Swamp": exp_swampJSON, "Forest": exp_forestJSON, "Locations": exp_locationsJSON,"Political": exp_politicalJSON},{collapsed:false}).addTo(map);
    feature_group.addLayer(exp_locationsJSON);
    feature_group.addLayer(exp_forestJSON);
    feature_group.addLayer(exp_swampJSON);
    $(".layer_select option[value='7']").show();
    $(".layer_select option[value='8']").show();
    currentQuest = 3;
    nText = 1;
    unlock("3");
    map.setView(new L.LatLng(14.8665, 13.3566), 9);
    $('.pap_text div').hide();
    $('.quest3_text1').show();
}

$('.quest3_final').bind('input',function(){
    var lineText = $('.quest3_final').val();
    if(lineText == 419) {
        alert("Correct! Your progress is now saved and you can start from this point if you leave.");
        feature_group.removeLayer(exp_forestJSON);
        feature_group.removeLayer(exp_swampJSON);
        setCookie("quest",4,365);
        startMenu();
    }
});

//Quest 4
$(".quest4").click(function(){
    startQuest4();
});

function startQuest4() {
    removeControl();
    control = L.control.layers({},{"Political": exp_politicalJSON, "Locations": exp_locationsJSON, "Mountain": exp_mountainJSON, "Forest": exp_forest2JSON},{collapsed:false}).addTo(map);
    currentQuest = 4;
    nText = 1;
    unlock("4");
    $('.pap_text div').hide();
    $('.quest4_text1').show();
    map.setView(new L.LatLng(13.277, 21.830), 7);
    feature_group.addLayer(exp_locationsJSON);
    feature_group.addLayer(exp_mountainJSON);
    feature_group.addLayer(exp_forest2JSON);
    $(".layer_select option[value='10']").show();
    $(".layer_select option[value='11']").show();
}

$('.quest4_final').bind('input',function(){
    var lineText = $('.quest4_final').val();
    if(lineText == 4508) {
        alert("Correct! Your progress is now saved and you can start from this point if you leave.");
        feature_group.removeLayer(exp_mountainJSON);
        feature_group.removeLayer(exp_forest2JSON);
        setCookie("quest",5,365);
        startMenu();
    }
});

//Quest 5
$(".quest5").click(function(){
    startQuest5();
});

function startQuest5() {
    removeControl();
    control = L.control.layers({},{"Mountain": exp_mountain2JSON, "Desert": exp_desertJSON, "Locations": exp_locationsJSON,"Political": exp_politicalJSON},{collapsed:false}).addTo(map);
    currentQuest = 5;
    nText = 1;
    unlock("5");
    $('.pap_text div').hide();
    $('.quest5_text1').show();
    map.setView(new L.LatLng(-8.440, 21.643), 6);
    //feature_group.addLayer(exp_locationsJSON);
    feature_group.addLayer(exp_desertJSON);
    feature_group.addLayer(exp_mountain2JSON);
    $(".layer_select option[value='12']").show();
    $(".layer_select option[value='13']").show();
}

$('.quest5_final').bind('input',function(){
    var lineText = $('.quest5_final').val();
    if(lineText == 223540) {
        alert("Correct! Your progress is now saved and you can start from this point if you leave.");
        feature_group.removeLayer(exp_mountain2JSON);
        feature_group.removeLayer(exp_desertJSON);
        setCookie("quest",6,365);
        startMenu();
    } else if (lineText == 336719) {
        alert("This is incorrect, you have found the area that is all Mountain but no Desert. HINT: The layer you want to find information about needs to be inputted as the Input Layer.")
    }
});

//Quest 6
$(".quest6").click(function(){
    startQuest6();
});

function startQuest6() {
    removeControl();
    control = L.control.layers({},{"Mountain": exp_mountain2JSON, "Desert": exp_desertJSON, "Locations": exp_locationsJSON,"Political": exp_politicalJSON},{collapsed:false}).addTo(map);
    currentQuest = 6;
    nText = 1;
    unlock("6");
    $('.pap_text div').hide();
    $('.quest6_text1').show();
}

$('.quest6_final1').bind('input',function(){
    var lineText = $('.quest6_final1').val();
    if(lineText == 5) {
        alert("Correct!");
        $('#quest6_next1').removeClass("quest_locked");
        document.getElementById('quest6_next1').disabled=false;
    }
});

$('.quest6_final2').bind('input',function(){
    var lineText = $('.quest6_final2').val();
    if(lineText == 753880) {
        alert("Correct!");
        $('#quest6_next2').removeClass("quest_locked");
        document.getElementById('quest6_next2').disabled=false;
    }
});

$('.quest6_final3').click(function(){
    setCookie("quest",7,365);
    startMenu();
});

//Quest 7
$(".quest7").click(function(){
    startQuest7();
});

function startQuest7() {
    removeControl();
    //feature_group.addLayer(exp_politicalJSON);
    feature_group.addLayer(exp_mountain2JSON);
    control = L.control.layers({},{"Mountain": exp_mountain2JSON, "Locations": exp_locationsJSON,"Political": exp_politicalJSON},{collapsed:false}).addTo(map);
    $(".layer_select option[value='13']").show();
    currentQuest = 7;
    nText = 1;
    $('.pap_text div').hide();
    $('.quest7_text1').show();
}

$('.quest7_final1').bind('input',function(){
    var lineText = $('.quest7_final1').val();
    if(lineText == 548947) {
        alert("Correct!");
        $('#quest7_next1').removeClass("quest_locked");
        document.getElementById('quest7_next1').disabled=false;
        resetMap();
    }
});

$('.quest7_final2').bind('input',function(){
    var lineText = $('.quest7_final2').val();
    if(lineText == 837649) {
        alert("Correct!");
        $('#quest7_next2').removeClass("quest_locked");
        document.getElementById('quest7_next2').disabled=false;
        resetMap();
    }
});*/