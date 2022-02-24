<template>
  <div>
    <v-alert
        elevation="20"
        type="error"
        transition="fade-transition"
        :value="errorAlert"
        class="pa-6 mx-2">
      {{ message }}
    </v-alert>
    <v-alert
        elevation="20"
        type="success"
        transition="fade-transition"
        :value="successAlert"
        class="pa-6 mx-2">
      {{ message }}
    </v-alert>
    <h2>Add Group</h2>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        class="col-6 align-content-center"
    >
      <v-text-field
          v-model="groupName"
          :rules="groupNameRules"
          label="Group Name"
          required
      ></v-text-field>

      <v-combobox
          v-model="select"
          :items="permissions"
          item-text="name"
          item-value="id"
          label="Permissions"
          multiple
          :readonly="activePermissions"
          chips
      ></v-combobox>

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
          @click="reset"
      >
        Clear
      </v-btn>
    </v-form>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'AddGroup',
  components: {},
  data: () => ({
    errorAlert: false,
    successAlert: false,
    message: '',
    valid: true,
    activePermissions: false,
    groupId: '',
    groupName: '',
    groupNameRules: [
      v => !!v || 'Group name is required',
      v => (v && v.length > 3) || 'Group name length must be at least 3 characters',
    ],
    select: null,
    permissions: [],
    checkbox: false,
  }),
  mounted() {
    // this.fetchPermissions();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          "name": this.groupName
        };
        axios.post("http://localhost:8081/groups", data)
            .then(response => {
              // this.$router.push({
              //   name: "Groups",
              //   params: {
              //     alert: "groupRegistered",
              //     message: "Group added successfully!"
              //   }
              // });
              this.groupId = response.data.id;
              this.fetchPermissions(response.data.id);
              this.activePermissions = true;
              this.successAlert = true;
              this.message = "Group added successfully.";
              console.log(response.data.id);
            })
            .catch(error => {
              this.errorAlert = true;
              this.message = error.response.data.errorMessage;
            });
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    fetchPermissions(id) {
      axios
          .get("http://localhost:8081/groups/availableRoles/" + id).then(response => {
        this.permissions = response.data;
      });
    },
    submitPermissions() {
      axios.put("http://localhost:8081/groups/roles/" + this.groupId, this.permissions)
          .then(response => {
            this.$router.push({
              name: "Groups",
              params: {
                alert: "groupRegistered",
                message: "Group added successfully with permissions!"
              }
            });
          }).catch(reason => {
        this.errorAlert = true;
        this.message = reason.response.data.errorMessage;
      })
    }
  },
}
</script>
