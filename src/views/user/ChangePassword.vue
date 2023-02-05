<template>
  <div>
    <v-card class="col-5 pa-6">
      <v-alert
          elevation="20"
          type="success"
          transition="fade-transition"
          :value="alert"
          class="pa-6 mx-2">
        {{message}}
      </v-alert>
      <v-alert
          elevation="20"
          type="error"
          transition="fade-transition"
          :value="errorAlert"
          class="pa-6 mx-2">
        {{ message }}
      </v-alert>
      <h2>Change Password</h2>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="col-6 align-content-center"
      >
        <v-text-field
            v-model="newPassword"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            :rules="newPasswordRules"
            label="New Password"
            required
            @click:append="show1 = !show1"
        ></v-text-field>

        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit"
        >
          Change
        </v-btn>

        <v-btn
            color="error"
            class="mr-4"
            @click="reset"
        >
          Clear
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'ChangePassword',
  components: {},
  data: () => ({
    alert: false,
    errorAlert: false,
    successAlert: false,
    show1: false,
    message: '',
    valid: true,
    newPassword: '',
    newPasswordRules: [
      v => !!v || 'New password is required',
      v => (v && v.length > 7) || 'New password length should be at least 8',
    ]
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          "password": this.newPassword
        };
        axios.put("http://localhost:8081/users/changePassword", data)
            .then(response => {
              if (response.status === 200) {
                this.alert = true;
                this.message = "Password changed successfully!";
              } else {
                this.errorAlert = true;
                this.message = response.data.errorMessage;
              }
              this.reset();
            })
            .catch(error => {
              this.errorAlert = true;
              this.message = error.response.data.errorMessage != null ? error.response.data.errorMessage : error.response.data;
            });
      }
    },
    reset() {
      this.$refs.form.reset()
    }
  },
}
</script>
