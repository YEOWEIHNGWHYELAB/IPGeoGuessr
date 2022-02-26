let targetPosition = { lat: 0, lng: 0 };
let targetMarker = undefined;
let map = undefined;
let guessMarker = undefined;

// starts loading of map
function init() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    else
        initMap({ lat: 0, lng: 0 });

    generateTarget();
    setInfoWindowPos();
}


// success callback for geolocator
function geoSuccess(position) {
    initMap({ lat: position.coords.latitude, lng: position.coords.longitude });
}


// error callback for geolocator
function geoError(err) {
    console.error(err);
    initMap({ lat: 0, lng: 0 });
}


// loads map div with google maps
function initMap(position) {
    map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 3,
        center: position,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: nightModeStyles
    });

    // place a guess marker on map click
    google.maps.event.addListener(map, "click", (e) => placeMarker(e));
}


// adds the guess marker onto the map
function placeMarker(e) {
    // clears previous marker if exists
    if (guessMarker != undefined)
        guessMarker.setMap(undefined);

    // puts new guess marker on the map
    guessMarker = new google.maps.Marker({
        position: e.latLng,
        map: map
    });

    guessMarker.setMap(map);
}


// populates info window with values
function generateTarget() {
    let ip = generatePublicIP();
    document.querySelector("#ipValue").innerText = ip;

    let url = `https://api.ipgeolocation.io/ipgeo?ip=${ip}&apiKey=4380280dd62a46dab4914573d171bbaa`;
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            console.log(data);

            document.querySelector("#hintCurrency").innerText = data.currency.code;
            document.querySelector("#hintContinent").innerText = data.continent_name;
            document.querySelector("#hintISP").innerText = data.isp;

            targetPosition.lat = parseFloat(data.latitude);
            targetPosition.lng = parseFloat(data.longitude);
        })
        .catch(error => console.error);
}


// sets info window to bottom left of map
function setInfoWindowPos() {
    let infoWindow = document.querySelector("#infoWindow"),
        map = document.querySelector("#map");

    infoWindow.style.left = map.offsetLeft + 5;
    infoWindow.style.top = map.offsetTop + map.clientHeight - infoWindow.clientHeight - 3;
}


// handles guessing location
document.querySelector("#btnGuess").onclick = () => {
    if (guessMarker == undefined) {
        alert("No marker has been placed yet!");
        return;
    }

    // updates map UI to show results
    let guessPosition = { lat: guessMarker.position.lat(), lng: guessMarker.position.lng() };
    drawTargetMarker();
    drawMarkerLine(guessPosition, targetPosition);

    // pans camera to target position
    map.panTo(targetPosition);

    // shows distance between your guess and the target
    let distance = calculateDistance(guessPosition, targetPosition);
    let timeTaken = document.querySelector("#timer").getAttribute("value");
    alert(`Distance from actual location is ${distance} km\nTime taken: ${timeTaken} seconds`);
};


function drawTargetMarker() {
    targetMarker = new google.maps.Marker({
        position: targetPosition,
        map: map,
        icon: "https://i.imgur.com/TjOKoeA.png"
    });
    targetMarker.setMap(map);
}


function drawMarkerLine(guessPosition, targetPosition) {
    let line = new google.maps.Polyline({
        path: [guessPosition, targetPosition],
        strokeOpacity: 0,
        icons: [{
            icon: {
                path: "M 0,-1 0,1",
                strokeColor: "#FFFFFF",
                strokeOpacity: 1,
                scale: 2
            },
            offset: "1",
            repeat: "10px"
        }]
    })
    line.setMap(map);
}


// resets map and regenerates target
document.querySelector("#btnReset").onclick = () => {
    if (targetMarker != undefined) {
        targetMarker.setMap(null);
        targetMarker = undefined;
    }

    if (guessMarker != undefined) {
        guessMarker.setMap(null);
        guessMarker = undefined;
    }

    document.querySelectorAll(".hint").forEach((hint) => {
        hint.classList.add("hint-blur");
    });

    generateTarget();
};


// shows hint on click
document.querySelectorAll(".hint-blur").forEach((hint) => {
    hint.onclick = () => {
        hint.classList.remove("hint-blur");
    };
});


// resets info window position on resize
window.addEventListener("resize", setInfoWindowPos);