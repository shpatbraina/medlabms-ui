<template>
  <div>
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
      {{message}}
    </v-alert>
    <v-container>
      <Datatable :fetch-data="fetchData"
                 :editData="editData"
                 :deleteData="deleteData"
                 :headers="headers"
                 :page-name="pageName"
                 :filterable-headers="filterableHeaders"
      />
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListAnalysesGroups',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Analyses groups',
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'Name', value: 'name', hValue: 'name', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
        {text: 'Description', value: 'description', hValue: 'description', sortable: true, disabled: true},
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      let searchVal = search !== null ? search : '';
      return axios
          .get("http://localhost:8081/analysesGroups?size=" +
              itemsPerPage +
              "&page=" +
              pageNumber +
              "&sortBy=" +
              sortBy +
              "&sortDesc=" +
              sortDesc +
              "&filterBy=" +
              select +
              "&search=" +
              searchVal
          );
    },
    editData(item) {
      this.$router.push({
        name: "EditAnalysesGroups",
        params: {
          item: item
        }
      });
    },
    deleteData(item) {
      return axios
          .delete("http://localhost:8081/analysesGroups/" + item.id).then(response => {
            this.showAlert("Analyses group deleted successfully!");
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
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
  },
  created() {
    if (this.$route.params.alert !== null && this.$route.params.alert === "analysesGroupRegistered") {
      this.showAlert(this.$route.params.message);
    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "analysesGroupNotRegistered") {
      this.showErrorAlert(this.$route.params.message);
    } else {
      this.resetAlerts();
    }
  }
}
</script>
