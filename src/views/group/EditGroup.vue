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
      <h2>Edit Group</h2>
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
            item-value="name"
            label="Permissions"
            multiple
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
  name: 'EditGroup',
  components: {},
  data: () => ({
    errorAlert: false,
    successAlert: false,
    message: '',
    item: Object,
    valid: true,
    saveButtonText: 'Update Group',
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
  beforeMount() {
  },
  mounted() {
    this.item = this.$route.params.item;
    this.groupId = this.item.id;
    this.groupName = this.item.name;

    console.log("item");
    console.log(this.item);
    this.fetchAvailablePermissions(this.item.id);
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.saveGroup();
      }
    },
    cancel() {
      this.$router.push({
        name: "Groups"
      });
    },
    fetchAvailablePermissions(id) {
      axios
          .get("http://localhost:8081/groups/availableRoles/" + id)
          .then(response => {
            this.permissions = response.data;
            this.fetchEffectivePermissions(this.item.id);
          });
    },
    fetchEffectivePermissions(id) {
      axios
          .get("http://localhost:8081/groups/effectiveRoles/" + id)
          .then(response => {
            this.permissions = this.permissions.concat(response.data);
            this.select = response.data;
          });
    },
    saveGroup() {
      let data = {
        "name": this.groupName
      };
      axios.put("http://localhost:8081/groups/" + this.item.id, data)
          .then(response => {
            if (response.status === 200) {
              this.groupId = response.data.id;
              this.savePermissions();
            }
          })
          .catch(error => {
            console.log(error);
            this.errorAlert = true;
            this.message = error.response.data.errorMessage;
          });
    },
    savePermissions() {
      axios.put("http://localhost:8081/groups/roles/" + this.groupId, this.select)
          .then(response => {
            this.$router.push({
              name: "Groups",
              params: {
                alert: "groupRegistered",
                message: "Group updated successfully!"
              }
            });
          }).catch(reason => {
        console.log(reason);
        this.errorAlert = true;
        this.message = reason.response.data.errorMessage;
      })
    }
  },
}
</script>
