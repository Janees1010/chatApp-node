var prev;
let chat_id;
let isGroupchat;
let apiUrl ;





const socket = io("http://52.66.241.139:2000");

socket.on("messageRecieved", (new_message) => {
  console.log(chat_id);
  console.log(new_message.chat._id);
  new_message.chat.users.forEach((user) => {
    if (user._id == new_message.sender._id) return;
  });

  if (chat_id == new_message.chat._id) {
    console.log("message reached", new_message);

    const messagesDiv = document.getElementById("messages");
    const messageElement = document.createElement("div");

    messageElement.innerHTML = `<span class="sender">${ new_message.chat.is_groupchat ? new_message.sender.username : ""}</span><br><h5 class="sender-message">${new_message.content}</h5>`;
    messagesDiv.appendChild(messageElement);
  } else {
    // showInAppNotification(new_message);
  }
});


const searchUsers = async(e)=>{
  let username = e.target.value.trim(); // Trim whitespace
  console.log("Input value:", username);

  if (username === "") {
    console.log("Input is empty, displaying default message");
    document.getElementById("search-container").innerHTML = "";
    return; // Exit the function early if the input is empty
  }
  const response = await fetchUsers(username);
  if(response){
    render(response);
  }
}

async function fetchUsers(username) {
  try {
    const response = await fetch("http://52.66.241.139:2000/user",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: username }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
  }
}

const openSearch = (e) => {
  document.getElementById("search-slider").style.left = "0px";
};

const closeSearch = () => {
  fetchChat();
  document.getElementById("search-slider").style.left = "-600px";
};

function render(data) {
  let output = "";
  let a = "";
  data.forEach((user, index) => {
    if (user.users) {
      output += `
    
       <div style="cursur:pointer;" id="user-cards-${index}"  class=" bg-white rounded d-flex px-1 align-items-center mt-2"
        onclick="openMessageBox('${user._id}','${
        user.users[0].username
      }','${index}',${user.is_groupchat},'${user.name}','${user.group_admin}','${user.users[0]._id}')">

        <img style="border-radius:50%;" src="${
          user.users[0].avatar
        }" alt="" width="45px" height="45px">
        <div class="py-2 px-4">
          <h6>${
            user.is_groupchat ? user.name : user.users[0].username
          }<br><span style="font-size: 14px; color:grey">${
        user.is_groupchat ? "Group chat" : user.users[0].email
      }</span></h6>
        </div>
      </div>
   `;
    } else {
      output = "";
      a += `
      <div style="cursur:pointer;"  class="rounded d-flex px-1 align-items-center mt-2" onclick="createChat('${user._id}')">
        <img style="border-radius:50%;" src="${user.avatar}" alt="" width="45px" height="45px">
        <div class="py-2 px-4">
          <h6>${user.username}<br><span style="font-size: 14px; color:grey">${user.email}</span></h6>
        </div>
      </div>
     `;
    }
  });
  if (a) {
    document.getElementById("search-container").innerHTML = a;
  }
  document.getElementById("container").innerHTML = output;
}

async function openMessageBox(_id, username, i, is_groupchat, groupName,groupAdmin) {

  fetchMessages(_id);

  console.log(groupAdmin,"groupAdmin");

  const response = await fetch("http://52.66.241.139:2000/getid",{
    method:"GET"
  })

  document.getElementById("dropdown").style.display = "none";
  document.getElementById("leave-btn").style.display = "none";

  document.getElementById("user").innerHTML = "";

  if(response){
    const data = await response.json()
    let userId = data

    if (is_groupchat) {
      if(userId === groupAdmin){
        document.getElementById("dropdown").style.display = "block";
      }else{
        document.getElementById("leave-btn").style.display = "block"; 
      }
      isGroupchat = is_groupchat;
      document.getElementById("user").innerHTML = `${groupName}`;
    } else {
      document.getElementById("user").innerHTML = `${username}`;
    }

   
  }


  chat_id = _id;
  if (prev) {
    prev.classList.add("bg-white");
  }

  document.getElementById("chat-bar").style.opacity = 100;


 

  document.getElementById("chatbox-header").style.opacity = 100;
  document.getElementById(`user-cards-${i}`).classList.remove("bg-white");
  document.getElementById(`user-cards-${i}`).style.backgroundColor = "#42ed99";
  prev = document.getElementById(`user-cards-${i}`);

 
  socket.emit("join chat", _id);
}



const fetchMessages = async (_id) => {
  try {
    const response = await fetch(`http://52.66.241.139:2000/message/${_id}`, {
      method: "get",
    });
    const data = await response.json();

    let output = "";
    data.forEach((elem) => {
   
      
      if (elem.same_user) {
        output += `<div style="display:flex;justify-content:end;"><h5 class="message p-2">${elem.content}</h5></div>`;
      } else {
        output += ` <div><span class="sender">${elem.chat.is_groupchat ?  elem.sender.username : "" }</span><h5 class="sender-message ">${elem.content}</h5></div>`;
      }
    });
    document.getElementById("messages").innerHTML = output;
  } catch (err) {
    console.log(err);
  }
};

async function createChat(_id) {
  try {
    const response = await fetch("http://52.66.241.139:2000/chat/chats", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: _id }),
    });
    if (response) {
      closeSearch();
    } 
  } catch (err) {
    console.log(err);
  }
}

const fetchChat = async () => {
  try {
    const response = await fetch("http://52.66.241.139:2000/chat/chats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    
    if (data) {
      render(data.chats);
      socket.emit("setup", data.user_id);
    }
  } catch (err) {
    console.log(err);
  }
};

fetchChat();

const sendingMessage = async (e) => {
  if (e.key == "Enter" && e.target.value) {
    //  e.preventDefault();
    let message = e.target.value;
    document.getElementById("message-input").value = "";
    updateUIWithMessage(message);

    try {
      const response = await fetch("http://52.66.241.139:2000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, chat_id }),
      });
      const data = await response.json();
      if (response) {
        if(isGroupchat){
          socket.emit("group message", data);
        }else{
          socket.emit("new message", data);
        }
      
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const updateUIWithMessage = (messageContent) => {
  const messagesDiv = document.getElementById("messages");

  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<div style="display:flex;justify-content:end;"><h5 class="message p-2">${messageContent}</h5></div>`;

  messagesDiv.appendChild(messageElement);
};

document.getElementById("display-users").innerHTML = "";

const displayUsers = async (e) => {
  if (e.target.value == "") {
    document.getElementById("display-users").innerHTML = "";
  } else {
    const response = await fetchUsers(e.target.value);

    let output = "";
    response.forEach((user, index) => {
      output += `
      
         <div id="user-cards-${index}"  class=" bg-white rounded d-flex px-1 align-items-center mt-2" onclick="displaySelectedUser('${user._id}','${user.username}','${index}')">
          <img style="border-radius:50%;" src="${user.avatar}" alt="" width="45px" height="45px">
          <div class="py-2 px-4">
            <h6>${user.username}<br><span style="font-size: 14px; color:grey">${user.email}</span></h6>
          </div>
        </div>
     `;
    });
    document.getElementById("display-users").innerHTML = output;
  }
};
let selectedUsers = [];

const displaySelectedUser = (id, username, index) => {
  const repeatCheck = selectedUsers.some((item) => item.username === username);

  if (repeatCheck) {
    renderSelectedUser(selectedUsers);
  } else {
    let user = { id, username };
    selectedUsers.push(user);
    renderSelectedUser(selectedUsers);
  }
};

document.getElementById("user-search").value = "";

function renderSelectedUser(selectedUsers) {

  try {
    document.getElementById("selected-users").innerHTML = "";
    let output = "";
    selectedUsers.forEach((elem, index) => {
      output += ` 
        <div style="font-size:15px;" class="badge text-bg-info ">
             <span>${elem.username}</span><span class="mx-2" onclick="removeSelectedUser('${index}')"><i class="fa-solid fa-xmark"></i></span>
        </div>
      `;
    });
    document.getElementById("selected-users").innerHTML = output;
  } catch (err) {
    console.log(err);
  }
}

const removeSelectedUser = (index) => {
  console.log(index);
  selectedUsers.splice(index, 1);
  renderSelectedUser(selectedUsers);
};

const createGroup = async (e) => {
  try {
    e.preventDefault();
    let groupName = document.getElementById("group-name").value;
    console.log(groupName);
    let userArray = selectedUsers.map((user) => {
      return user.id;
    });
  

    const requestBody = {
      userArray,
      groupName,
    };

    const body = JSON.stringify(requestBody);
    const response = await fetch("http://52.66.241.139:2000/chat/groupchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if(response){
      window.location.reload()
    }
  } catch (error) {}
};
let groupName = (document.getElementById("group-name").value = "");

const deleteGroupchat = async()=>{
  
  try {
    console.log("deleting");
    
    const response  = await fetch("http://52.66.241.139:2000/chat/deletegroupchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({ chatId: chat_id })
    });
    if(response){
      window.location.reload()
    }
  } catch (error) {
    
  }
  
}

const leaveGroupchat = async()=>{
  try {
    console.log(chat_id);
    
    const response  = await fetch("http://52.66.241.139:2000/chat/leavegroupchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({ chatId: chat_id })
    }); 
    console.log(response);
    
    if(response){
       window.location.reload()
    }
  } catch (error) {
    console.log(error);
    
  }
}
