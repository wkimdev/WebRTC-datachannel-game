<template>
  <div id="app">
    <!-- <img width="25%" src="./assets/logo.png"> -->
    <router-view keep-alive></router-view>
    <p>this is app.vue</p>
  </div>
</template>

<script>
import Home from "./components/Home";

export default {
  name: "App",
  data: function() {
    return {
      keyValue: ""
    };
  },
  created: function() {
    this.load();
  },
  methods: {
    load() {
      console.log("init page...");
      // key가 있다.
      if (!this.keyValue) {
        this.$router.push({ path: "/" });
      } else {
        console.log("key value exist..");
        //this.$router.push({ path: "/" });
      }
    }
  },
  components: {
    Home
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
