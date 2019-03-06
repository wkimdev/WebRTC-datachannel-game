import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home.vue";
import RoomComponent from "@/components/RoomComponent.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  //base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/RoomComponent",
      name: "RoomComponent",
      component: RoomComponent
    }
  ]
});
