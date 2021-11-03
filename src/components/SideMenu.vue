<template>
  <v-navigation-drawer
      permanent
      app
  >
    <v-list>
      <v-list-item>
        <v-img src="/Logo.png"></v-img>
      </v-list-item>

      <v-divider></v-divider>

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
            :to="user.to"
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
            :to="patient.to"
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
      readUsers: false,
      readPatients: false,
      users: [
        { title: 'Add', icon: 'mdi-plus-outline', to: '/users/add' },
        { title: 'List', icon: 'mdi-view-list-outline', to: '/users/list' },
      ],
      patients: [
        { title: 'Add', icon: 'mdi-plus-outline', to: '/patients/add' },
        { title: 'List', icon: 'mdi-view-list-outline', to: '/patients/list' },
      ]
    })
  }
</script>