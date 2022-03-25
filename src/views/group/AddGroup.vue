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
            :readonly="!readOnlyPermissions"
            required
        ></v-text-field>

        <v-combobox
            v-model="select"
            :items="permissions"
            item-text="name"
            item-value="name"
            label="Permissions"
            multiple
            :readonly="readOnlyPermissions"
            chips
        ></v-combobox>

        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit"
        >
          {{ saveButtonText }}
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
  name: 'AddGroup',
  components: {},
  data: () => ({
    errorAlert: false,
    successAlert: false,
    message: '',
    valid: true,
    readOnlyPermissions: true,
    saveButtonText: 'Save Group',
    groupId: '',
    groupName: '',
    groupNameRules: [
      v => !!v || 'Group name is required',
      v => (v && v.length >= 3) || 'Group name length must be at least 3 characters',
    ],
    select: null,
    permissions: [],
    checkbox: false,
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.readOnlyPermissions ? this.saveGroup() : this.savePermissions();
      }
    },
    cancel() {
      this.$router.push({
        name: "Groups"
      });
    },
    fetchPermissions(id) {
      axios
          .get("http://localhost:8081/groups/availableRoles/" + id).then(response => {
        this.permissions = response.data;
      });
    },
    saveGroup() {
      let data = {
        "name": this.groupName
      };
      axios.post("http://localhost:8081/groups", data)
          .then(response => {
            if (response.status === 200) {
              this.groupId = response.data.id;
              this.fetchPermissions(response.data.id);
              this.readOnlyPermissions = false;
              this.saveButtonText = "Save Permissions";
              this.successAlert = true;
              this.message = "Group added successfully.";
            }
          })
          .catch(error => {
            this.errorAlert = true;
            this.message = error.response.data.errorMessage;
          });
    },
    savePermissions() {
      axios.put("http://localhost:8081/groups/roles/" + this.groupId, this.select)
          .then(response => {
            if (response.status === 200) {
              this.$router.push({
                name: "Groups",
                params: {
                  alert: "groupRegistered",
                  message: "Group added successfully!"
                }
              });
            } else {
              throw new Error(response.data.toString());
            }
          }).catch(reason => {
        this.errorAlert = true;
        this.message = reason.response.data.errorMessage;
      })
    }
  },
}
</script>
