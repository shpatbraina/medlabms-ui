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
      />
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListPatient',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Patients',
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'First Name', value: 'firstName'},
        {text: 'Last Name', value: 'lastName'},
        {text: 'Birth Date', value: 'birthDate'},
        {text: 'Birth Place', value: 'birthPlace'},
        {text: 'Blood Type', value: 'bloodType'},
        {text: 'Blood Type RH', value: 'bloodTypeRh'},
        {text: 'Personal ID', value: 'personalId'},
        {text: 'Phone', value: 'phone'},
        {text: 'Email', value: 'email'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'First Name', value: 'firstName', hValue: 'firstName', sortable: true, disabled: false, active: true},
        {text: 'Last Name', value: 'lastName', hValue: 'lastName', sortable: true, disabled: false, active: true},
        {text: 'Personal ID', value: 'personalId', hValue: 'personalId', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
        {text: 'Birth Date', value: 'birthDate', hValue: 'birthDate', sortable: true, disabled: true},
        {text: 'Birth Place', value: 'birthPlace', hValue: 'birthPlace', sortable: true, disabled: true},
        {text: 'Blood Type', value: 'bloodType', hValue: 'bloodType', sortable: true, disabled: true},
        {text: 'Blood Type RH', value: 'bloodTypeRh', hValue: 'bloodTypeRh', sortable: true, disabled: true},
        {text: 'Phone', value: 'phone', hValue: 'phone', sortable: true, disabled: true},
        {text: 'Email', value: 'email', hValue: 'email', sortable: true, disabled: true},
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      let searchVal = search !== null ? search : '';
      return axios
          .get("http://localhost:8081/patients", {
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
        name: "EditPatient",
        params: {
          item: item
        }
      });
    },
    deleteData(item) {
      return axios
          .delete("http://localhost:8081/patients/" + item.id).then(response => {
            this.showAlert("Patient deleted successfully!");
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
    if (this.$route.params.alert !== null && this.$route.params.alert === "patientRegistered") {
      this.showAlert(this.$route.params.message);
    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "patientNotRegistered") {
      this.showErrorAlert(this.$route.params.message);
    } else {
      this.resetAlerts();
    }
  }
}
</script>
