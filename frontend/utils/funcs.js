let user = null;
let receiver=null
const namespaceSocket = io("http://localhost:4003/pvs");

export const showPvChats = (pvs, userInfo) => {
  user = userInfo;

  console.log(pvs);

  const chats = document.querySelector(".sidebar__contact-list");
  chats.innerHTML = "";

  pvs.forEach((pv) => {
    if (pv._id !== user._id) {
      chats.insertAdjacentHTML(
        "beforeend",
        `
        <li class="sidebar__contact-item" data-pv="${pv.username}">
          <a class="sidebar__contact-link" href="#">
            <div class="sidebar__contact-left">
              <div class="sidebar__contact-left-left">
                <img
                  class="sidebar__contact-avatar"
                  src="https://banner2.cleanpng.com/20181231/fta/kisspng-computer-icons-user-profile-portable-network-graph-circle-svg-png-icon-free-download-5-4714-onli-5c2a3809d6e8e6.1821006915462707298803.jpg"
                />
              </div>
              <div class="sidebar__contact-left-right">
                <span class="sidebar__contact-title">${pv.username}</span>
                <div class="sidebar__contact-sender">
                  <span class="sidebar__contact-sender-name">${pv.username}: </span>
                  <span class="sidebar__contact-sender-text">سلام داداش خوبی؟</span>
                </div>
              </div>
            </div>
            <div class="sidebar__contact-right">
              <span class="sidebar__contact-clock">15.53</span>
              <span
                class="sidebar__contact-counter sidebar__counter sidebar__counter-active"
                >66</span
              >
            </div>
          </a>
        </li>
      `
      );
    }
  });

  chatroom()
};


 const chatroom=()=>{
  const pvs = document.querySelectorAll(".sidebar__contact-item");
  pvs.forEach(item=>{
    item.addEventListener('click',event=>{
      const msgInput=document.querySelector('.chat__content-bottom-bar-input')
msgInput.value=''
       receiver=item.dataset.pv
      namespaceSocket.emit('joining',{
        sender: user.username,
        receiver,
      })
      namespaceSocket.on('pvInfo',data=>{
        const chatHeader = document.querySelector(".chat__header");
        chatHeader.classList.add("chat__header--active");
        const chatName = document.querySelector(".chat__header-name");
        chatName.innerHTML = data.receiver;
        const chatProfile = document.querySelector(".chat__header-avatar");
        chatProfile.src = `https://banner2.cleanpng.com/20181231/fta/kisspng-computer-icons-user-profile-portable-network-graph-circle-svg-png-icon-free-download-5-4714-onli-5c2a3809d6e8e6.1821006915462707298803.jpg`;

        const chatContent = document.querySelector(".chat__content-main");
        chatContent.innerHTML = "";

        const chatContentMain = document.querySelector(".chat__content");
        chatContentMain.classList.add("chat__content--active");
      })
    })
  })
}

export const sendMasage=()=>{
  const msgInput=document.querySelector('.chat__content-bottom-bar-input')
 
  msgInput.addEventListener('keyup',e=>{
    const message=e.target.value.trim()
    if (e.keyCode===13) {
      if(message){
        namespaceSocket.emit('newMsg',{
          message,
          pv:{
            sender:user.username,
            receiver
          },
        
        })
      }
      msgInput.value=''
    }

  })

}

export const confirmMessage=()=>{
  const chatContainer = document.querySelector(".chat__content-main");
  namespaceSocket.on('confirmMsg',data=>{
    if (data.pv.sender === user.username) {
      chatContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div
            id="msg-${data.msgID}"
            class="chat__content-receiver-wrapper chat__content-wrapper">
            <div class="chat__content-receiver">
              <span class="chat__content-receiver-text">${data.message}</span>
              <span class="chat__content-chat-clock">
                17:55 |
                <i class="fa fa-trash" onclick="removeMsg('msg-${data.msgID}')"></i>
              </span>
            </div>
          </div>
        `
      );
    } else {
      chatContainer.insertAdjacentHTML(
        "beforeend",
        `
          <div
            id="msg-${data.msgID}"
            class="chat__content-sender-wrapper chat__content-wrapper">
            <div class="chat__content-sender">
              <span class="chat__content-sender-text">${data.message}</span>
              <span class="chat__content-chat-clock">17:55</span>
            </div>
          </div>
        `
      );
    }
  })
}

const removeMsg=(msgID)=>{
namespaceSocket.emit('removeMsg',{msgID})
}
export const confirmRemoveMsg=()=>{
  namespaceSocket.on('confirmRemoveMsg',data=>{
    console.log(data);
    const elemchat=document.querySelector(`#${data.msgID}`)
    elemchat.remove()
  })
}
window.removeMsg=removeMsg