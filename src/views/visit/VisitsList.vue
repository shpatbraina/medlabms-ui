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
    <v-container>
      <Datatable :fetch-data="fetchData"
                 :editData="editData"
                 :deleteData="deleteData"
                 :headers="headers"
                 :page-name="pageName"
                 :filterable-headers="filterableHeaders"
                 :select-input="selectInput"
                 :select-input-values="patients"
      />
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListVisits',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Visits',
      selectInput: "patientId",
      patients: [],
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'Patient', value: 'patientName'},
        {text: 'Date of visit', value: 'dateOfVisit'},
        {text: 'Total price', value: 'totalPrice'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'Patient', value: 'patientId', hValue: 'patientName', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
        {text: 'DateOfVisit', value: 'dateOfVisit', hValue: 'dateOfVisit', sortable: true, disabled: true},
        {text: 'TotalPrice', value: 'totalPrice', hValue: 'totalPrice', sortable: true, disabled: true},
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      return axios
          .get("http://localhost:8081/visits", {
            params: {
              "size": itemsPerPage,
              "page": pageNumber,
              "sortBy": sortBy,
              "sortDesc": sortDesc,
              "filterBy": select,
              "search": search
            }
          });
    },
    fetchPatients() {
      axios
          .get(
              "http://localhost:8081/patients"
          ).then(response => {
        response.data.forEach(value => {
          let temp = {
            "text": value.fullName,
            "value": value.id
          };
          this.patients.push(temp);
        });
      });
    },
    editData(item) {
      this.$router.push({
        name: "EditVisit",
        params: {
          item: item
        }
      });
    },
    deleteData(item) {
      return axios
          .delete("http://localhost:8081/visits/" + item.id).then(response => {
            this.showAlert("Visits deleted successfully!");
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
    if (this.$route.params.alert !== null && this.$route.params.alert === "visitsRegistered") {
      this.showAlert(this.$route.params.message);
    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "visitsNotRegistered") {
      this.showErrorAlert(this.$route.params.message);
    } else {
      this.resetAlerts();
    }
  },
  mounted() {
    this.fetchPatients();
  }
}
</script>
