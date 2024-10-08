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
    />
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListGroup',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Groups',
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'Group Name', value: 'name'},
        {text: 'Path', value: 'path'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'Group Name', value: 'name', hValue: 'name', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
        {text: 'Path', value: 'path', hValue: 'path', sortable: true, disabled: true}
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      let searchVal = search !== null ? search : '';
      return axios
          .get("http://localhost:8081/groups", {
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
    editData(item) {
      this.$router.push({
        name: "EditGroup",
        params: {
          item: item
        }
      });
    },
    deleteData(item) {
      return axios
          .delete("http://localhost:8081/groups/" + item.id).then(response => {
            this.showAlert("Group deleted successfully!");
          })
          .catch(error => {
            this.showErrorAlert(error.response.data.errorMessage);
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
    if (this.$route.params.alert !== null && this.$route.params.alert === "groupRegistered") {
      this.showAlert(this.$route.params.message);
    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "groupNotRegistered") {
      this.showErrorAlert(this.$route.params.message);
    } else {
      this.resetAlerts();
    }
  }
}
</script>
