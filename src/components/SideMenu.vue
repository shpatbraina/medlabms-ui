<template>
  <v-navigation-drawer
      permanent
      app
  >
    <v-list>
      <v-list-item>
        <v-img src="/Logo.png" :max-height="64" ></v-img>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-group
          prepend-icon="mdi-account-circle-outline"
          v-can="readGroups"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Groups</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
            v-for="group in groups"
            :key="group.title"
            @click="navigateTo(group.to)"
            v-can=group.permissionKey
            link
            class="px-6"
        >

          <v-list-item-icon>
            <v-icon v-text="group.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-title v-text="group.title"></v-list-item-title>

        </v-list-item>
      </v-list-group>

      <v-list-group
          prepend-icon="mdi-account-circle-outline"
          v-can="readUsers"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
            v-for="user in users"
            :key="user.title"
            @click="navigateTo(user.to)"
            v-can="user.permissionKey"
            link
            class="px-6"
        >

          <v-list-item-icon>
            <v-icon v-text="user.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-title v-text="user.title"></v-list-item-title>

        </v-list-item>
      </v-list-group>

      <v-list-group
          prepend-icon="mdi-account-heart-outline"
          v-can="readPatients"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Patients</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
            v-for="patient in patients"
            :key="patient.title"
            @click="navigateTo(patient.to)"
            v-can="patient.permissionKey"
            link
            class="px-6"
        >

          <v-list-item-icon>
            <v-icon v-text="patient.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-title v-text="patient.title"></v-list-item-title>

        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

  </v-navigation-drawer>
</template>
<script>
  export default {
    name: 'SideMenu',
    data: () => ({
      readGroups: "readGroups",
      readUsers: "readUsers",
      readPatients: "readPatients",
      groups: [
        { title: 'Add', icon: 'mdi-plus-outline', to: '/groups/add', permissionKey: "addGroups" },
        { title: 'List', icon: 'mdi-view-list-outline', to: '/groups', permissionKey: "readGroups" },
      ],
      users: [
        { title: 'Add', icon: 'mdi-plus-outline', to: '/users/add', permissionKey: "addUsers" },
        { title: 'List', icon: 'mdi-view-list-outline', to: '/users', permissionKey: "readUsers" },
      ],
      patients: [
        { title: 'Add', icon: 'mdi-plus-outline', to: '/patients/add', permissionKey: "addPatients" },
        { title: 'List', icon: 'mdi-view-list-outline', to: '/patients', permissionKey: "readPatients" },
      ]
    }),
    methods: {
      navigateTo(path){
        this.$router.push({path: path}).catch(err => {});
      }
    }
  }
</script>