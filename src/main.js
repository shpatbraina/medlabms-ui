import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Keycloak from 'keycloak-js'
import VueLogger from 'vuejs-logger'
import './assets/css/wfmi-style.css'

Vue.config.productionTip = false

Vue.use(VueLogger);

let currentHostname = window.location.hostname;
let urls;

let perms = {
  readUsers: "false",
  readPatients: "false"
}

//localStorage.setItem("permissions", JSON.stringify(perms));
if (currentHostname.indexOf('localhost') > -1) {
  urls = {
    api: 'http://localhost:8082',
    login: 'http://localhost:8180/',
    cns: 'http://localhost:8081' // Verify the shown ports
  }
  store.commit("setAPIAndLogin", urls);
}
else {
  let keycloakUrl = window.VUE_APP_KEYCLOAK;
  let webapiUrl = window.VUE_APP_WEBAPI;
  let cnsRedirectUrl = 'http://' + currentHostname + window.VUE_APP_ROOT; // logout
  urls = {
    api: webapiUrl,
    login: keycloakUrl,
    cns: cnsRedirectUrl
  }
  store.commit("setAPIAndLogin", urls);
}

let initOptions = {
  url: store.state.endpoints.login, realm: 'MedLabMS', clientId: 'ui-client', onLoad: 'login-required'
}

let keycloak = new Keycloak(initOptions);
Vue.prototype.$keycloak = keycloak;

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload();
  }

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App, { props: { keycloak: keycloak } })
  }).$mount('#app')

  let payload = {
    idToken: keycloak.idToken,
    accessToken: keycloak.token
  }

  if ((keycloak.token && keycloak.idToken) != '' && (keycloak.idToken != '')) {
    store.commit("login", payload);
    payload = {
      name: keycloak.tokenParsed.preferred_username,
      idToken: keycloak.idToken,
      accessToken: keycloak.token
    };
    store.commit("setName", payload);
    store.commit("login",payload);
  }
  else {
    payload = {
      idToken: "",
      accessToken: ""
    }
    store.commit("login", payload);
    store.commit("logout");
  }

//Token Refresh
  setInterval(() => {
    keycloak.updateToken().then((refreshed) => {
      if (store.state.user.isAuthenticated != false ) {
        if (refreshed) {
          let payloadRefreshedTokens = {
            idToken: keycloak.idToken,
            accessToken: keycloak.token
          }

          if ((keycloak.token && keycloak.idToken != '') && (keycloak.idToken != '')) {
            store.commit("login", payloadRefreshedTokens);
          }
          else {
            payloadRefreshedTokens = {
              idToken: "",
              accessToken: ""
            }
            store.commit("login", payloadRefreshedTokens);
            store.commit("logout");
          }
        }
      } else {

        var logoutOptions = { redirectUri : urls.cns };

        keycloak.logout(logoutOptions).then((success) => {
        }).catch((error) => {
        });
        store.commit("logout");
      }
    }).catch(() => {
    });
  }, 10000)
}).catch(() => {});
