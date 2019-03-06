<template>
  <div class="app">
    <p>{{ msg }}</p>
    <Spinner></Spinner>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";

export default {
  name: "Home",
  data() {
    return {
      msg: "key generate...."
    };
  },
  created: function() {
    this.nextPage();
  },
  methods: {
    nextPage() {
      setTimeout(() => {
        this.$router.push({ path: "/RoomComponent" });
      }, 2000);
    }
  },
  components: {
    Spinner
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
