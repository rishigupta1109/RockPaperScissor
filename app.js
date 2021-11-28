
const homepage = document.getElementsByClassName("homepage")[0];
const gamepage = document.getElementsByClassName("gamepage")[0];
const navbar = document.getElementsByClassName("navbar")[0];
const socket = io('http://localhost:3000');
let clickable = false;
let playerno = "";
let roomid = "";
const resetoptions = () => {
    Array.from(document.getElementsByTagName("video")).forEach((element) => {
        element.style.transform= "scale(1)";
     })
}
Array.from(document.getElementsByTagName("video")).forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
        e.target.play();
   })
    element.addEventListener("mouseleave", (e) => {
        e.target.pause();
   })
    element.addEventListener("click", (e) => {
        if (clickable) {
            clickable = false;
            e.target.style.transform= "scale(1.3)";
            socket.emit("option-selected", { choosed: e.target.id, roomid: roomid });
            document.getElementsByClassName("status")[0].innerHTML = "waiting for other player to choose";
        }
   })
})
const setGamePage = () => {
    gamepage.style.display = "flex";
    homepage.style.display = "none";
    navbar.style.display = "flex";
}
const Asp1=()=>{
    document.getElementById("p1name").innerText = "You";
    document.getElementById("p2name").innerText = "Enemy";
    document.getElementById("p1pts").innerText = 0;
    document.getElementById("p2pts").innerText = 0;
    playerno = 1;
    document.getElementsByClassName("status")[0].innerHTML = "waitig for p2 to join";
}
const Asp2=()=>{
    document.getElementById("p2name").innerText = "You";
    document.getElementById("p1name").innerText = "Enemy";
    document.getElementById("p2pts").innerText = 0;
    document.getElementById("p1pts").innerText = 0;
    playerno = 2;
    document.getElementsByClassName("status")[0].innerHTML = "choose your option";
}

const createroom = () => {
    let roomname = window.prompt("write room name");
    console.log(roomname);
    if(roomname!==""&&roomname!==null){
        socket.emit("create-room", roomname);
        playerno = 1;
        Asp1();
    }
    console.log(playerno);
}
const joinroom = () => {
    let roomname = window.prompt("write room name");
    console.log(roomname);
    if (roomname !== "" && roomname !== null) {
        socket.emit("join-room", roomname);
        playerno = 2;
        Asp2();
    }
    console.log(playerno);
}
socket.on("error", (message) => {
    alert(message);
})
socket.on("room-created", Roomid => {
    setGamePage();
    roomid = Roomid;
    document.getElementById("room-id").innerHTML = roomid;
})
socket.on("room-joined", Roomid => {
    setGamePage();
    roomid = Roomid;
    document.getElementById("room-id").innerHTML = roomid;
})
socket.on("2p-joined", (pts) => {
    document.getElementById("p1pts").innerText = pts[0];
    document.getElementById("p2pts").innerText = pts[1];
    clickable = true;
    document.getElementsByClassName("status")[0].innerHTML = "choose option";
})
socket.on("draw", () => {
    alert("draw");
    clickable = true;
    resetoptions();
    document.getElementsByClassName("status")[0].innerHTML = "choose your option";
})
socket.on("1p-won", (pts) => {
    if (playerno == 1) {
        alert("you won");
    }
    else {
        alert("you lost");
    }
    console.log(playerno);
    resetoptions();
    clickable = true;
    document.getElementById("p1pts").innerText = pts[0];
    document.getElementById("p2pts").innerText = pts[1];
    document.getElementsByClassName("status")[0].innerHTML = "choose your option";
})
socket.on("2p-won", (pts) => {
    if (playerno == 2) {
        alert("you won");
    }
    else {
        alert("you lost");
    }
    console.log(playerno);
    resetoptions();
    clickable = true;
    document.getElementById("p1pts").innerText = pts[0];
    document.getElementById("p2pts").innerText = pts[1];
    document.getElementsByClassName("status")[0].innerHTML = "choose your option";
})
socket.on("room-over", () => {
    alert("1p-left : room destroyed");
    location.reload();
})
socket.on("room-over", () => {
    alert("1p-left : room destroyed");
    location.reload();
})
socket.on("2p-left", () => {
    alert("2p-left : waiting for rejoining");
    document.getElementsByClassName("status")[0].innerHTML = "waitig for p2 to join";
})




