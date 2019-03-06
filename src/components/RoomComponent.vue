<template>
<div class="hello">
  <head>
    <title>WebRTC: Simple RTCDataChannel sample</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="src/main.css" type="text/css" media="all">
    <!--
        <script src="src/adapter.js"></script>
        <script src="src/action.js"></script>
    -->
  </head>

  <body>
    <h1>WebRTC: Simple RTCDataChannel sample</h1>
    <p>1. connect버튼을 누른 후 input box에 가위/바위/보 를 입력합니다.</p>
    <p>2. send 버튼을 누르고 결과를 확인합니다.</p>
    <p>3. disconnect버튼을 눌러 커넥션을 종료합니다.</p>

    <br>
    <div class="controlbox">
      <button
        @click="connectButton()"
        id="connectButton"
        name="connectButton"
        class="buttonleft"
      >Connect</button>
      <button
        @click="disconnectPeers()"
        id="disconnectButton"
        name="disconnectButton"
        class="buttonright"
        disabled
      >Disconnect</button>
    </div>

    <div class="messagebox">
      <label for="message">
        Enter a message:
        <input
          type="text"
          name="message"
          id="message"
          placeholder="가위/바위/보 를 입력해주세요~~"
          inputmode="latin"
          size="60"
          maxlength="120"
          disabled
        >
      </label>
      <button
        @click="sendButton()"
        id="sendButton"
        name="sendButton"
        class="buttonright"
        disabled
      >Send</button>
    </div>
    <div class="messagebox" id="receivebox">
      <!-- <p>Messages received: {{ receiveMsg }}</p> -->
      <!-- <p>Messages received:</p> -->
      <p>game result!! : {{ receiveMsg }}</p>
    </div>
  </body>
</div>
</template>

<script>
let connectButton = null;
let disconnectButton = null;
let sendButton = null;
let messageInputBox = null;
let receiveBox = null;

let localConnection = null; // RTCPeerConnection for our "local" connection
let remoteConnection = null; // RTCPeerConnection for the "remote"

let sendChannel = null; // RTCDataChannel connectButton the local (sender)
let receiveChannel = null; // RTCDataChannel for the remote (receiver)
let test = null;

export default {
  name: "RoomComponent",
  data() {
    return {
      msg: "Welcome to Game Room",
      receiveMsg: ""
    };
  },
  methods: {
    startup() {
      // test = document.getElementById("test");
      // console.log("test :" + test);
      // connectButton = document.getElementById("connectButton");
      // disconnectButton = document.getElementById("disconnectButton");
      // sendButton = document.getElementById("sendButton");
      // messageInputBox = document.getElementById("message");
      // // console.log("messageInputBox test : " + messageInputBox);
      // receiveBox = document.getElementById("receivebox");
      // Set event listeners for user interface widgets
      // connectButton.addEventListener("click", connectPeers, false);
      // disconnectButton.addEventListener("click", disconnectPeers, false);
      // sendButton.addEventListener("click", sendMessage, false);
    },
    connectButton() {
      console.log("connected!!");
      // Create the local connection and its event listeners
      localConnection = new RTCPeerConnection();

      // Create the data channel and establish its event listeners
      // 방 생성
      sendChannel = localConnection.createDataChannel("sendChannel");
      sendChannel.onopen = this.handleSendChannelStatusChange;
      sendChannel.onclose = this.handleSendChannelStatusChange;

      // Create the remote connection and its event listeners

      remoteConnection = new RTCPeerConnection();
      remoteConnection.ondatachannel = this.receiveChannelCallback;

      // Set up the ICE candidates for the two peers

      localConnection.onicecandidate = e =>
        !e.candidate ||
        remoteConnection
          .addIceCandidate(e.candidate)
          .catch(this.handleAddCandidateError);

      remoteConnection.onicecandidate = e =>
        !e.candidate ||
        localConnection
          .addIceCandidate(e.candidate)
          .catch(this.handleAddCandidateError);

      // Now create an offer to connect; this starts the process

      localConnection
        .createOffer()
        .then(offer => localConnection.setLocalDescription(offer))
        .then(() =>
          remoteConnection.setRemoteDescription(
            localConnection.localDescription
          )
        )
        .then(() => remoteConnection.createAnswer())
        .then(answer => remoteConnection.setLocalDescription(answer))
        .then(() =>
          localConnection.setRemoteDescription(
            remoteConnection.localDescription
          )
        )
        .catch(this.handleCreateDescriptionError);
    },
    sendButton() {
      console.log("sendButton start!!");
      var message = messageInputBox.value;
      sendChannel.send(message);

      // Clear the input box and re-focus it, so that we're
      // ready for the next message.

      messageInputBox.value = "";
      messageInputBox.focus();
    },
    handleSendChannelStatusChange(event) {
      if (sendChannel) {
        const state = sendChannel.readyState;

        if (state === "open") {
          messageInputBox.disabled = false;
          messageInputBox.focus();
          sendButton.disabled = false;
          disconnectButton.disabled = false;
          connectButton.disabled = true;
        } else {
          messageInputBox.disabled = true;
          sendButton.disabled = true;
          connectButton.disabled = false;
          disconnectButton.disabled = true;
        }
      }
    },
    receiveChannelCallback(event) {
      receiveChannel = event.channel;
      receiveChannel.onmessage = this.handleReceiveMessage;
      receiveChannel.onopen = this.handleReceiveChannelStatusChange;
      receiveChannel.onclose = this.handleReceiveChannelStatusChange;
    },
    handleReceiveMessage(event) {
      const el = document.createElement("p");
      // var txtNode = document.createTextNode(event.data);
      let txtNode = "";
      console.log("입력을 받았습니다 : " + event.data); // 가위 바위 보
      let rps_value = "";

      switch (event.data) {
        case "가위":
          rps_value = 0;
          break;
        case "바위":
          rps_value = 1;
          break;
        case "보":
          rps_value = 2;
          break;
        default:
          rps_value = event.data;
          return;
      }

      const computer = Math.floor(Math.random() * 3); // 0,1,2가 발생

      if (rps_value == computer) {
        console.log("비겼습니다");
        txtNode = "비겼습니다";
      } else if ((rps_value + 1) % 3 == computer) {
        console.log("졌습니다");
        txtNode = "졌습니다";
      } else {
        console.log("이겼습니다");
        txtNode = "이겼습니다";
      }

      // reponse 승 패
      // el.appendChild(
      //   document.body.appendChild(document.createTextNode(txtNode))
      // );
      // receiveBox.appendChild(el);
      this.receiveMsg = txtNode;
    },
    disconnectPeers() {
      console.log("connection closed!");
      // Close the RTCDataChannels if they're open.

      sendChannel.close();
      receiveChannel.close();

      // Close the RTCPeerConnections

      localConnection.close();
      remoteConnection.close();

      sendChannel = null;
      receiveChannel = null;
      localConnection = null;
      remoteConnection = null;

      // Update user interface elements

      connectButton.disabled = false;
      disconnectButton.disabled = true;
      sendButton.disabled = true;

      messageInputBox.value = "";
      messageInputBox.disabled = true;
    },
    handleCreateDescriptionError(error) {
      console.log(`Unable to create an offer: ${error.toString()}`);
    },
    handleAddCandidateError() {
      console.log("Oh noes! addICECandidate failed!");
    },
    handleReceiveChannelStatusChange(event) {
      if (receiveChannel) {
        console.log(
          `Receive channel's status has changed to ${receiveChannel.readyState}`
        );
      }

      // Here you would do stuff that needs to be done
      // when the channel's status changes.
    },
    loadJs(url, callback) {
      jQuery.ajax({
        url: url,
        dataType: "script",
        success: callback,
        async: true
      });
    }
  },
  mounted() {
    connectButton = document.getElementById("connectButton");
    disconnectButton = document.getElementById("disconnectButton");
    sendButton = document.getElementById("sendButton");
    messageInputBox = document.getElementById("message");
    receiveBox = document.getElementById("receivebox");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
