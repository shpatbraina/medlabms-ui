<template>
  <v-app id="inspire">
    <side-menu v-if="loaded"/>

    <bar-menu v-if="loaded"/>

    <v-main app>
      <v-container fluid >
        <router-view v-if="loaded"/>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import SideMenu from "@/views/core/components/SideMenu";
import BarMenu from "@/views/core/components/BarMenu";
import axios from "axios";
import Vue from "vue";
import store from "./store";
export default {
  components: {BarMenu, SideMenu},
  computed: {
    loaded() {
      return this.$store.state.loadState == "loaded";
    }
  },
  beforeCreate(){
    axios.interceptors.request.use(
        config => {
          const token = this.$store.state.user.accessToken;
          if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },
        error => {
          Promise.reject(error)
        });

    axios({
      method: 'GET',
      url: 'http://localhost:8081/session',
      headers: {
        'Content-type': 'application/json',
        'Accept': '*/*'
      }
    }).then(success => {
            localStorage.setItem("permissions", JSON.stringify(success.data));
            this.$store.commit("setLoaded");
          });
  },
  beforeMount() {

    Vue.directive('can', {
      inserted: function (el, binding, vnode) {

        const handler = (permissions) => {
          let json = JSON.parse(permissions);
          let permission = json[binding.value];
          if (permission !== true) {
            vnode.elm.style.display = "none";
          }
        };
        handler(localStorage.getItem("permissions"));
      }
    });
  }
}
</script>