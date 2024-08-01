<template>
  <div>
    <v-alert
        elevation="20"
        type="success"
        transition="fade-transition"
        :value="alert"
        class="pa-6 mx-2">
      {{ message }}
    </v-alert>
    <v-alert
        elevation="20"
        type="error"
        transition="fade-transition"
        :value="errorAlert"
        class="pa-6 mx-2">
      {{ message }}
    </v-alert>
    <Datatable :fetch-data="fetchData"
               :editData="editData"
               :deleteData="deleteData"
               :headers="headers"
               :page-name="pageName"
               :filterable-headers="filterableHeaders"
               :select-input="selectInput"
               :select-input-values="groups"
               :reset-password="resetPassword"
               :reset-password-action="resetPasswordAction"
    />
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListUser',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Users',
      selectInput: "groupId",
      resetPasswordAction: true,
      groups: [],
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'First Name', value: 'firstName'},
        {text: 'Last Name', value: 'lastName'},
        {text: 'Username', value: 'username'},
        {text: 'Email', value: 'email'},
        {text: 'Group', value: 'groupName'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'First Name', value: 'firstName', hValue: 'firstName', sortable: true, disabled: false, active: true},
        {text: 'Last Name', value: 'lastName', hValue: 'lastName', sortable: true, disabled: false, active: true},
        {text: 'Username', value: 'username', hValue: 'username', sortable: true, disabled: false, active: true},
        {text: 'Email', value: 'email', hValue: 'email', sortable: true, disabled: false, active: true},
        {text: 'Group', value: 'groupId', hValue: 'groupName', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      let searchVal = search !== null ? search : '';
      return axios
          .get("http://localhost:8081/users", {
            params: {
              "size": itemsPerPage,
              "page": pageNumber,
              "sortBy": sortBy,
              "sortDesc": sortDesc,
              "filterBy": select,
              "search": searchVal
            }
          });
    },
    fetchGroups() {
      axios
          .get(
              "http://localhost:8081/groups"
          ).then(response => {
        response.data.forEach(value => {
          let temp = {
            "text": value.name,
            "value": value.id
          };
          this.groups.push(temp);
        });
      });
    },
    resetPassword(item) {
      console.log(item);
      return axios
          .put("http://localhost:8081/users/resetPassword/" + item.id).then(response => {
            this.showAlert("User password reset successfully!");
          })
          .catch(error => {
            console.log(error);
          });
    },
    editData(item) {
      this.$router.push({
        name: "EditUser",
        params: {
          item: item
        }
      });
    },
    deleteData(item) {
      return axios
          .delete("http://localhost:8081/users/" + item.id).then(response => {
            this.showAlert("User deleted successfully!");
          })
          .catch(error => {
            console.log(error);
          });
    },
    showAlert(message) {
      this.alert = true;
      this.message = message;
      setTimeout(() => {
        this.alert = false
      }, 5000);
    },
    showErrorAlert(message) {
      this.errorAlert = true;
      this.message = message;
      setTimeout(() => {
        this.alert = false
      }, 5000);
    },
    resetAlerts() {
      this.alert = false;
      this.errorAlert = false;
    },
  },
  created() {
    if (this.$route.params.alert !== null && this.$route.params.alert === "userRegistered") {
      this.showAlert(this.$route.params.message);
    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "userNotRegistered") {
      this.showErrorAlert(this.$route.params.message);
    } else {
      this.resetAlerts();
    }
  },
  mounted() {
    this.fetchGroups();
  }
}
</script>
