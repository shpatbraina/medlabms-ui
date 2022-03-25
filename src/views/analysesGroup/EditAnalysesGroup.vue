<template>
  <div>
    <v-card class="col-5 pa-6">
      <v-alert
          elevation="20"
          type="error"
          transition="fade-transition"
          :value="errorAlert"
          class="pa-6 mx-2">
        {{ message }}
      </v-alert>
      <h2>Edit analyses Groups</h2>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="col-6 align-content-center"
      >
        <v-text-field
            v-model="name"
            :rules="nameRules"
            label="First Name"
            required
        ></v-text-field>

        <v-text-field
            v-model="description"
            label="Description"
        ></v-text-field>

        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit"
        >
          Add
        </v-btn>

        <v-btn
            color="error"
            class="mr-4"
            @click="cancel"
        >
          Cancel
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'EditAnalysesGroup',
  components: {},
  data: () => ({
    errorAlert: false,
    message: '',
    item: Object,
    valid: true,
    name: '',
    description: null,
    nameRules: [
      v => !!v || 'Name is required',
      v => /[a-zA-Z]+$/.test(v) || 'Name should contain only letters',
    ],
  }),
  mounted() {
    this.item = this.$route.params.item;
    this.name = this.item.name;
    this.description = this.item.description;
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          "name": this.name,
          "description": this.description
        };
        axios.put("http://localhost:8081/analysesGroups/" + this.item.id, data)
            .then(response => {
              this.$router.push({
                name: "AnalysesGroups",
                params: {
                  alert: "analysesGroupRegistered",
                  message: "Analyses groups edited successfully!"
                }
              });
            })
            .catch(error => {
              this.errorAlert = true;
              this.message = error.response.data.errorMessage != null ? error.response.data.errorMessage : error.response.data;
            });
      }
    },
    cancel() {
      this.$router.push({
        name: "AnalysesGroups"
      });
    }
  },
}
</script>
