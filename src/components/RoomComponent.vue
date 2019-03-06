<template>
  <div class="hello">
    <p>{{ msg }}</p>

    <head>
      <title>WebRTC: Simple RTCDataChannel sample</title>
      <meta charset="utf-8" />
      <link rel="stylesheet" href="src/main.css" type="text/css" media="all" />
      <!--
        <script src="src/adapter.js"></script>
        <script src="src/action.js"></script>
      -->
    </head>

    <body>
      <h1>WebRTC: Simple RTCDataChannel sample</h1>
      <p>
        This sample is an admittedly contrived example of how to use an
        <code>RTCDataChannel</code> to exchange data between two objects on the
        same page. See the
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample"
        >
          corresponding article</a
        >
        for details on how it works.
      </p>

      <div class="controlbox">
        <button id="connectButton" name="connectButton" class="buttonleft">
          Connect
        </button>
        <button
          id="disconnectButton"
          name="disconnectButton"
          class="buttonright"
          disabled
        >
          Disconnect
        </button>
      </div>

      <div class="messagebox">
        <label for="message"
          >Enter a message:
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Message text"
            inputmode="latin"
            size="60"
            maxlength="120"
            disabled
          />
        </label>
        <button id="sendButton" name="sendButton" class="buttonright" disabled>
          Send
        </button>
      </div>
      <div class="messagebox" id="receivebox"><p>Messages received:</p></div>
    </body>
  </div>
</template>

<script>
export default {
  name: "RoomComponent",
  data() {
    return {
      msg: "Welcome to Game Room~~~"
    };
  },
  // created() {
  //   let ckeditor = document.createElement('script');
  //   ckeditor.setAttribute('src',"action.js");
  //   document.head.appendChild(ckeditor);
  // },
  methods: {
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
    this.loadJs("action.js", function() {
      //Stuff to do after someScript has loaded
    });
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
