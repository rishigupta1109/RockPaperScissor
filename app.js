const modal = document.getElementsByClassName("modal")[0];
const winner = document.getElementsByClassName("winner")[0];
const img = document.getElementById("image");
const homepage = document.getElementsByClassName("homepage")[0];
const gamepage = document.getElementsByClassName("gamepage")[0];
const navbar = document.getElementsByClassName("navbar")[0];
// const socket = io('http://localhost:3000');
const winsrc = "./images/won.png";
const losesrc = "./images/lost.png";

const winaudio = new Audio("./sounds/win.mp3");
const lostaudio = new Audio("./sounds/lost.mp3");
const notification = new Audio("./sounds/ping.mp3");
const socket = io("https://rpsserver.onrender.com");
let clickable = false;
let playerno = "";
let roomid = "";
let user1 = "";
let user2 = "";
const resetoptions = () => {
  Array.from(document.getElementsByTagName("video")).forEach((element) => {
    element.style.transform = "scale(1)";
  });
};
Array.from(document.getElementsByTagName("video")).forEach((element) => {
  element.addEventListener("mouseenter", (e) => {
    e.target.play();
  });
  element.addEventListener("mouseleave", (e) => {
    e.target.pause();
  });
  element.addEventListener("click", (e) => {
    if (clickable) {
      clickable = false;
      e.target.style.transform = "scale(1.3)";
      socket.emit("option-selected", { choosed: e.target.id, roomid: roomid });
      document.getElementsByClassName("status")[0].innerHTML =
        "waiting for other player to choose";
    }
  });
});
const setGamePage = () => {
  gamepage.style.display = "flex";
  homepage.style.display = "none";
  navbar.style.display = "flex";
};
const Asp1 = () => {
  document.getElementById("p1name").innerText = user1 + ` (You) : `;
  document.getElementById("p2name").innerText = "Enemy : ";
  document.getElementById("p1pts").innerText = 0;
  document.getElementById("p2pts").innerText = 0;
  playerno = 1;
  document.getElementsByClassName("status")[0].innerHTML =
    "waiting for p2 to join";
};
const Asp2 = () => {
  document.getElementById("p2name").innerText = user2 + ` (You) : `;
  document.getElementById("p1name").innerText = "Enemy : ";
  document.getElementById("p2pts").innerText = 0;
  document.getElementById("p1pts").innerText = 0;
  playerno = 2;
  document.getElementsByClassName("status")[0].innerHTML = "choose your option";
};

const createroom = () => {
  let roomname = window.prompt("write room name");
  let username = window.prompt("write user name");
  // console.log(roomname);
  if (
    roomname !== "" &&
    roomname !== null &&
    username !== "" &&
    username !== null
  ) {
    socket.emit("create-room", { roomid: roomname, username });
    playerno = 1;
    user1 = username;
    Asp1();
  }
  console.log(playerno);
};
const joinroom = () => {
  let roomname = window.prompt("write room name");
  let username = window.prompt("write user name");
  // console.log(roomname);
  if (
    roomname !== "" &&
    roomname !== null &&
    username !== "" &&
    username !== null
  ) {
    socket.emit("join-room", { roomid: roomname, username });
    playerno = 2;
    user2 = username;
    Asp2();
  }
  console.log(playerno);
};
socket.on("error", (message) => {
  alert(message);
});
socket.on("room-created", (Roomid) => {
  setGamePage();
  roomid = Roomid;
  document.getElementById("room-id").innerHTML = roomid;
});
socket.on("room-joined", (Roomid) => {
  setGamePage();
  roomid = Roomid;
  document.getElementById("room-id").innerHTML = roomid;
});
socket.on("2p-joined", ([pts, usernames]) => {
  document.getElementById("p1pts").innerText = pts[0];
  document.getElementById("p2pts").innerText = pts[1];
  if (playerno === 1) {
    document.getElementById("p1name").innerText = ` ${usernames[0]} (You) : `;
    document.getElementById(
      "p2name"
    ).innerText = ` ${usernames[1]} (Opponent) : `;
  } else if (playerno === 2) {
    document.getElementById(
      "p1name"
    ).innerText = ` ${usernames[0]} (Opponent) : `;
    document.getElementById("p2name").innerText = ` ${usernames[1]} (You) : `;
  }
  clickable = true;
  user1 = usernames[0];
  user2 = usernames[1];
  appendMsg("player joined", 0);
  document.getElementsByClassName("status")[0].innerHTML = "choose option";
});
socket.on("draw", () => {
  alert("draw");
  clickable = true;
  resetoptions();
  document.getElementsByClassName("status")[0].innerHTML = "choose your option";
});
socket.on("1p-won", (pts) => {
  if (playerno == 1) {
    modal.style.display = "flex";
    winner.innerText = "You Won !";
    winaudio.play();
    img.setAttribute("src", winsrc);
  } else {
    lostaudio.play();
    modal.style.display = "flex";
    winner.innerText = "You Lost !";
    img.setAttribute("src", losesrc);
  }
  console.log(playerno);
  resetoptions();
  clickable = true;
  document.getElementById("p1pts").innerText = pts[0];
  document.getElementById("p2pts").innerText = pts[1];
  document.getElementsByClassName("status")[0].innerHTML = "choose your option";
});
socket.on("2p-won", (pts) => {
  if (playerno == 2) {
    // alert("you won");
    winaudio.play();
    modal.style.display = "flex";
    winner.innerText = "You Won !";
    img.setAttribute("src", winsrc);
  } else {
    lostaudio.play();
    modal.style.display = "flex";
    winner.innerText = "You Lost !";
    img.setAttribute("src", losesrc);
  }
  console.log(playerno);
  resetoptions();
  clickable = true;
  document.getElementById("p1pts").innerText = pts[0];
  document.getElementById("p2pts").innerText = pts[1];
  document.getElementsByClassName("status")[0].innerHTML = "choose your option";
});
socket.on("room-over", () => {
  alert("1p-left : room destroyed");
  location.reload();
});
socket.on("room-over", () => {
  alert("1p-left : room destroyed");
  location.reload();
});
socket.on("2p-left", () => {
  alert("2p-left : waiting for rejoining");
  appendMsg("Left", 0);
  document.getElementsByClassName("status")[0].innerHTML =
    "waitig for p2 to join";
});

//MEssage handling

const message = document.getElementById("message");
const send = document.getElementById("send");
const chats = document.getElementsByClassName("chats")[0];

//sender==1 ->me else sender==0 ->enenemy
const appendMsg = (msg, sender) => {
  const newMsg = document.createElement("div");
  newMsg.innerText = msg;
  newMsg.classList.add("message");
  let users = [user1, user2];
  let i = playerno - 1;
  i = sender ? i : i ? 0 : 1;
  let userno = sender ? "You" : "Opponent";
  if (sender) {
    newMsg.innerText = users[i] + " : " + msg;
    newMsg.classList.add("R");
  } else {
    newMsg.innerText = users[i] + ` : ` + msg;
    newMsg.classList.add("L");
  }
  chats.appendChild(newMsg);
};
send.onclick = () => {
  let msg = message.value;
  appendMsg(msg, 1);
  message.value = "";
  socket.emit("send-message", { msg, roomid });
};

socket.on("recieve-msg", (msg) => {
  notification.play();
  appendMsg(msg, 0);
});

//Modal

const modalBtn = document.getElementById("modalbtn");
modalBtn.onclick = () => {
  modal.style.display = "none";
};
