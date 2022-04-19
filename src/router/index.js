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
    path: '/groups/edit',
    name: 'EditGroup',
    meta: {
      permissions: ['addGroups']
    },
    component: () => import('../views/group/EditGroup.vue')
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
    path: '/patients/edit',
    name: 'EditPatient',
    meta: {
      permissions: ['addPatients']
    },
    component: () => import('../views/patient/EditPatient.vue')
  },
  {
    path: '/patients',
    name: 'Patients',
    meta: {
      permissions: ['readPatients']
    },
    component: () => import('../views/patient/PatientsList.vue')
  },
  {
    path: '/analysesGroups/add',
    name: 'AddAnalysesGroups',
    meta: {
      permissions: ['addAnalysesGroups']
    },
    component: () => import('../views/analysesGroup/AddAnalysesGroup.vue')
  },
  {
    path: '/analysesGroups/edit',
    name: 'EditAnalysesGroups',
    meta: {
      permissions: ['addAnalysesGroups']
    },
    component: () => import('../views/analysesGroup/EditAnalysesGroup.vue')
  },
  {
    path: '/analysesGroups',
    name: 'AnalysesGroups',
    meta: {
      permissions: ['readAnalysesGroups']
    },
    component: () => import('../views/analysesGroup/AnalysesGroupsList.vue')
  },
  {
    path: '/analysis/add',
    name: 'AddAnalysis',
    meta: {
      permissions: ['addAnalyses']
    },
    component: () => import('../views/analysis/AddAnalysis.vue')
  },
  {
    path: '/analysis/edit',
    name: 'EditAnalysis',
    meta: {
      permissions: ['addAnalyses']
    },
    component: () => import('../views/analysis/EditAnalysis.vue')
  },
  {
    path: '/analysis',
    name: 'Analyses',
    meta: {
      permissions: ['readAnalyses']
    },
    component: () => import('../views/analysis/AnalysesList.vue')
  },
  {
    path: '/visit/add',
    name: 'AddVisit',
    meta: {
      permissions: ['addVisits']
    },
    component: () => import('../views/visit/AddVisit.vue')
  },
  {
    path: '/visit/edit',
    name: 'EditVisit',
    meta: {
      permissions: ['addVisits']
    },
    component: () => import('../views/visit/EditVisit.vue')
  },
  {
    path: '/visit',
    name: 'Visits',
    meta: {
      permissions: ['readVisits']
    },
    component: () => import('../views/visit/VisitsList.vue')
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
