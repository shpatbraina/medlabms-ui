<template>
  <v-app-bar app>

    <v-spacer></v-spacer>
    <div>
      <span>
        {{this.$store.state.user.name}}
      </span>
    </div>
    <v-menu
        offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            icon
            v-bind="attrs"
            v-on="on"
        >
          <v-avatar>
            <v-icon dark>
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
            v-for="menu in menus"
            :key="menu.title"
            :to="menu.to"
        >
          <v-list-item-icon>
            <v-icon v-text="menu.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ menu.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
export default {
  name: 'BarMenu',
  data: () => ({
    menus: [
      { title: 'Change Password', icon: 'mdi-account-cog-outline', to: '/change-password'},
      { title: 'Logout', icon: 'mdi-logout', to: '/logout' },
    ]
  })
}
</script>