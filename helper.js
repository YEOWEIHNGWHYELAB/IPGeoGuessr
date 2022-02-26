// distance between 2 markers
function calculateDistance(guessPosition, targetPosition) {
    const R = 6371;

    let lat1 = guessPosition.lat,
        lng1 = guessPosition.lng;

    let lat2 = targetPosition.lat,
        lng2 = targetPosition.lng;

    let phi1 = lat1 * Math.PI / 180;
    let phi2 = lat2 * Math.PI / 180;
    let deltaPhi = (lat2 - lat1) * Math.PI / 180;
    let deltaLambda = (lng2 - lng1) * Math.PI / 180;

    let a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    // returns distance in km
    return d.toFixed(2);
}

console.log("hi")