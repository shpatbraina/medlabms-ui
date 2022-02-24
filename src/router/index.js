import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/user/UsersList.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component:() => {
      let payloadRefreshedTokens = {
        idToken: "",
        accessToken: ""
      }
      let logoutOptions = { redirectUri : router.app.$store.state.endpoints.redirectUri };
      router.app.$keycloak.logout(logoutOptions).then((success) => {}).catch((error) => {});
      router.app.$store.commit("login", payloadRefreshedTokens);
      router.app.$store.commit("logout");
      localStorage.clear();
    }
  },
  {
    path: '/groups/add',
    name: 'AddGroup',
    meta: {
      permissions: ['addGroups']
    },
    component: () => import('../views/group/AddGroup.vue')
  },
  {
    path: '/groups',
    name: 'Groups',
    meta: {
      permissions: ['readGroups']
    },
    component: () => import('../views/group/GroupsList.vue')
  },
  {
    path: '/users/add',
    name: 'AddUser',
    meta: {
      permissions: ['addUsers']
    },
    component: () => import('../views/user/AddUser.vue')
  },
  {
    path: '/users/edit',
    name: 'EditUser',
    meta: {
      permissions: ['addUsers']
    },
    component: () => import('../views/user/EditUser.vue')
  },
  {
    path: '/users',
    name: 'Users',
    meta: {
      permissions: ['readUsers']
    },
    component: () => import('../views/user/UsersList.vue')
  },
  {
    path: '/patients/add',
    name: 'AddPatient',
    meta: {
      permissions: ['addPatients']
    },
    component: () => import('../views/patient/AddPatient.vue')
  },
  {
    path: '/patients',
    name: 'Patients',
    meta: {
      permissions: ['readPatients']
    },
    component: () => import('../views/patient/PatientsList.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach(((to, from, next) => {
  if(to.meta.permissions && to.meta.permissions.length > 0){
    let json = JSON.parse(localStorage.getItem("permissions"));
    if (!json[to.meta.permissions]) return next(from.path)
  }
  next();
}))

export default router
