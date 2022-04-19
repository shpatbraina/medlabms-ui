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
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber) {
      return axios
          .get("http://localhost:8081/patients?size=" +
              itemsPerPage +
              "&page=" +
              pageNumber
          );
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
