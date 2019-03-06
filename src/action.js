(function () {
  // Define "global" variables

  let connectButton = null;
  let disconnectButton = null;
  let sendButton = null;
  let messageInputBox = null;
  let receiveBox = null;

  let localConnection = null; // RTCPeerConnection for our "local" connection
  let remoteConnection = null; // RTCPeerConnection for the "remote"

  let sendChannel = null; // RTCDataChannel connectButton the local (sender)
  let receiveChannel = null; // RTCDataChannel for the remote (receiver)

  // Functions

  // Set things up, connect event listeners, etc.

  function startup() {
    connectButton = document.getElementById('connectButton');
    disconnectButton = document.getElementById('disconnectButton');
    sendButton = document.getElementById('sendButton');
    messageInputBox = document.getElementById('message');
    receiveBox = document.getElementById('receivebox');

    // Set event listeners for user interface widgets

    connectButton.addEventListener('click', connectPeers, false);
    disconnectButton.addEventListener('click', disconnectPeers, false);
    sendButton.addEventListener('click', sendMessage, false);
  }

  // Connect the two peers. Normally you look for and connect to a remote
  // machine here, but we're just connecting two local objects, so we can
  // bypass that step.

  function connectPeers() {
    // Create the local connection and its event listeners
    localConnection = new RTCPeerConnection();

    // Create the data channel and establish its event listeners
    // 방 생성
    sendChannel = localConnection.createDataChannel('sendChannel');
    sendChannel.onopen = handleSendChannelStatusChange;
    sendChannel.onclose = handleSendChannelStatusChange;

    // Create the remote connection and its event listeners

    remoteConnection = new RTCPeerConnection();
    remoteConnection.ondatachannel = receiveChannelCallback;

    // Set up the ICE candidates for the two peers

    localConnection.onicecandidate = e =>
      !e.candidate ||
      remoteConnection
        .addIceCandidate(e.candidate)
        .catch(handleAddCandidateError);

    remoteConnection.onicecandidate = e =>
      !e.candidate ||
      localConnection
        .addIceCandidate(e.candidate)
        .catch(handleAddCandidateError);

    // Now create an offer to connect; this starts the process

    localConnection
      .createOffer()
      .then(offer => localConnection.setLocalDescription(offer))
      .then(() =>
        remoteConnection.setRemoteDescription(localConnection.localDescription),
      )
      .then(() => remoteConnection.createAnswer())
      .then(answer => remoteConnection.setLocalDescription(answer))
      .then(() =>
        localConnection.setRemoteDescription(remoteConnection.localDescription),
      )
      .catch(handleCreateDescriptionError);
  }

  // Handle errors attempting to create a description;
  // this can happen both when creating an offer and when
  // creating an answer. In this simple example, we handle
  // both the same way.

  function handleCreateDescriptionError(error) {
    console.log(`Unable to create an offer: ${  error.toString()}`);
  }

  // Handle successful addition of the ICE candidate
  // on the "local" end of the connection.

  function handleLocalAddCandidateSuccess() {
    connectButton.disabled = true;
  }

  // Handle successful addition of the ICE candidate
  // on the "remote" end of the connection.

  function handleRemoteAddCandidateSuccess() {
    disconnectButton.disabled = false;
  }

  // Handle an error that occurs during addition of ICE candidate.

  function handleAddCandidateError() {
    console.log('Oh noes! addICECandidate failed!');
  }

  // Handles clicks on the "Send" button by transmitting
  // a message to the remote peer.

  function sendMessage() {
    const message = messageInputBox.value;
    sendChannel.send(message);

    // Clear the input box and re-focus it, so that we're
    // ready for the next message.

    messageInputBox.value = '';
    messageInputBox.focus();
  }

  // Handle status changes on the local end of the data
  // channel; this is the end doing the sending of data
  // in this example.

  function handleSendChannelStatusChange(event) {
    if (sendChannel) {
      const state = sendChannel.readyState;

      if (state === 'open') {
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
  }

  // Called when the connection opens and the data
  // channel is ready to be connected to the remote.

  function receiveChannelCallback(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = handleReceiveMessage;
    receiveChannel.onopen = handleReceiveChannelStatusChange;
    receiveChannel.onclose = handleReceiveChannelStatusChange;
  }

  // Handle onmessage events for the receiving channel.
  // These are the data messages sent by the sending channel.

  function handleReceiveMessage(event) {
    const el = document.createElement('p');
    // var txtNode = document.createTextNode(event.data);
    let txtNode = '';
    console.log(event.data); // 가위 바위 보
    let rps_value = '';

    switch (event.data) {
      case '가위':
        rps_value = 0;
        break;
      case '바위':
        rps_value = 1;
        break;
      case '보':
        rps_value = 2;
        break;
      default:
        rps_value = event.data;
        return;
    }

    const computer = Math.floor(Math.random() * 3); // 0,1,2가 발생

    if (rps_value == computer) {
      console.log('비겼습니다');
    } else if ((rps_value + 1) % 3 == computer) {
      txtNode = '졌습니다';
    } else {
      txtNode = '이겼습니다';
    }

    // reponse 승 패
    el.appendChild(document.body.appendChild(document.createTextNode(txtNode)));
    receiveBox.appendChild(el);
  }

  // Handle status changes on the receiver's channel.

  function handleReceiveChannelStatusChange(event) {
    if (receiveChannel) {
      console.log(
        `Receive channel's status has changed to ${receiveChannel.readyState}`,
      );
    }

    // Here you would do stuff that needs to be done
    // when the channel's status changes.
  }

  // Close the connection, including data channels if they're open.
  // Also update the UI to reflect the disconnected status.

  function disconnectPeers() {
    console.log('test!!!!!!!!!!!');
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

    messageInputBox.value = '';
    messageInputBox.disabled = true;
  }

  // Set up an event listener which will run the startup
  // function once the page is done loading.

  window.addEventListener('load', startup, false);
}());
