let time = 0;

setInterval(() => {
    let min = ~~(time / 60),
        sec = time % 60;

    document.querySelector("#timer").innerText = `${(min < 10) ? "0" : ""}${min}:${(sec < 10) ? "0" : ""}${sec}`;
    document.querySelector("#timer").setAttribute("value", time);
    time++;
}, 1000);