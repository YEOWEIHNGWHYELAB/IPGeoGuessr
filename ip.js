function generatePublicIP() {
    let ip = new Array(4);
    ip = ip.fill(0).map(() => Math.ceil(Math.random() * 255));

    while (isReserved(ip)) {
        ip = ip.fill(0).map(() => Math.ceil(Math.random() * 255));
    }

    return ip.join(".");
}

// follows list of reserved IPs here:
// https://en.wikipedia.org/wiki/Reserved_IP_addresses
function isReserved(ip) {
    return (ip[0] == 0 || ip[0] == 10 || ip[0] == 127 || ip[0] == 192 || ip[0] > 224) ||
        (ip[0] == 100 && ip[1] >= 64 && ip[1] <= 127) ||
        (ip[0] == 169 && ip[1] == 254) ||
        (ip[0] == 172 && ip[1] >= 16 && ip[1] <= 31) ||
        (ip[0] == 203 && ip[2] == 113);
}