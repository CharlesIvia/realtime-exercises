const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");
let allChat = [];

// listen for events on the form
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = { user, text };

  ws.send(JSON.stringify(data));
}

const ws = new WebSocket("ws://localhost:8080", ["json"]);

ws.addEventListener("open", () => {
  console.log("connected");
  presence.innerText = "🟢";
});

console.log("ws", ws);

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  allChat = data.msg;

  render();
});

ws.addEventListener("close", () => {
  console.log("disconnected");
  presence.innerText = "🔴";
});

function render() {
  const html = allChat.map(({ user, text }) => template(user, text));
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;
