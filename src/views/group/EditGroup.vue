<template>
  <div>
    <v-alert
        elevation="20"
        type="error"
        transition="fade-transition"
        :value="errorAlert"
        class="pa-6 mx-2">
      {{message}}
    </v-alert>
    <h2>Edit User</h2>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        class="col-6 align-content-center"
    >
      <v-text-field
          v-model="firstName"
          :rules="firstNameRules"
          label="First Name"
          required
      ></v-text-field>

      <v-text-field
          v-model="lastName"
          :rules="lastNameRules"
          label="Last Name"
          required
      ></v-text-field>

      <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
      ></v-text-field>

      <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
      ></v-text-field>

      <v-select
          v-model="select"
          :items="groups"
          item-text="name"
          item-value="name"
          :rules="[v => !!v || 'Group is required']"
          label="Group"
          required
      ></v-select>

      <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submit"
      >
        Save
      </v-btn>

      <v-btn
          color="error"
          class="mr-4"
          @click="reset"
      >
        Cancel
      </v-btn>
    </v-form>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'EditUser',
  components: {},
  data: () => ({
    errorAlert: false,
    message: '',
    item: Object,
    valid: true,
    firstName: '',
    lastName: '',
    username: '',
    firstNameRules: [
      v => !!v || 'First name is required',
      v => /[a-zA-Z]+$/.test(v) || 'First name should contain only letters',
    ],
    lastNameRules: [
      v => !!v || 'Last Name is required',
      v => /[a-zA-Z]+$/.test(v) || 'Last name should contain only letters',
    ],
    usernameRules: [
      v => !!v || 'Username is required',
      v => (v && v.length > 3) || 'Username length must be at least 3 characters',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    select: null,
    groups: [],
    checkbox: false,
  }),
  mounted() {
    this.fetchGroups();
    this.item = this.$route.params.item;
    this.firstName = this.item.firstName;
    this.lastName = this.item.lastName;
    this.username = this.item.username;
    this.email = this.item.email;
    this.select = { name: this.item.groupName, path: "/"+this.item.groupName };
  },
  methods: {
    submit () {
      if(this.$refs.form.validate()) {
        let data = {
          "id": this.item.id,
          "firstName": this.firstName,
          "lastName": this.lastName,
          "username": this.username,
          "email": this.email,
          "groups": [this.select]
        };
        if(this.select.name != null) {
          console.log("test");
          console.log(data.groups)
          data.groups = [this.select.name];
        }
        console.log(data);
        console.log(data.groups);
        axios.put("http://localhost:8081/users/"+this.item.id, data)
        .then(response => {
            this.$router.push({
              name: "Users",
              params: {
                alert: "userEdited",
                message: "User edited successfully!"
              }
            });
        })
        .catch(error => {
          this.errorAlert = true;
          this.message = error.response.data.errorMessage;
        });
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    fetchGroups() {
      axios
          .get(
              "http://localhost:8081/groups"
          ).then(response => {
            this.groups = response.data;
          });
    },
  },

}
</script>
