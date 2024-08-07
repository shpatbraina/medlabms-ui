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
      <Datatable :fetchData="fetchData"
                 :editData="editData"
                 :deleteData="deleteData"
                 :onSelectionChange="onSelectionChange"
                 :markPaid="markPaid"
                 :headers="headers"
                 :page-name="pageName"
                 :filterable-headers="filterableHeaders"
                 :select-input="selectInput"
                 :select-input-values="selectData"
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
      selectData: [],
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'Patient', value: 'patientName'},
        {text: 'Date of visit', value: 'dateOfVisit'},
        {text: 'Total price', value: 'totalPrice'},
        {text: 'Paid', value: 'paid'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'Patient', value: 'patientId', hValue: 'patientName', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
        {text: 'DateOfVisit', value: 'dateOfVisit', hValue: 'dateOfVisit', sortable: true, disabled: true},
        {text: 'TotalPrice', value: 'totalPrice', hValue: 'totalPrice', sortable: true, disabled: true},
        {text: 'Paid', value: 'paid', hValue: 'paid', sortable: true, disabled: false, active: true},
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
          this.selectData.push(temp);
        });
      });
    },
    markPaid(item) {
      if(item.paid) {
        return axios
            .put("http://localhost:8081/visits/mark-as-unpaid/" + item.id).then(response => {
              this.showAlert("Visit marked as not paid successfully!");
              item.paid = !item.paid;
            })
            .catch(error => {
              this.showErrorAlert(error.response.data.errorMessage);
            });
      } else {
        return axios
            .put("http://localhost:8081/visits/mark-as-paid/" + item.id).then(response => {
              this.showAlert("Visit marked as paid successfully!");
              item.paid = !item.paid;
            })
            .catch(error => {
              this.showErrorAlert(error.response.data.errorMessage);
            });
      }
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
    onSelectionChange(selection) {
      if(selection.value === "patientId") {
        this.selectInput = "patientId";
        this.selectData = [];
        this.fetchPatients();
      }
      else if(selection.value === "paid") {
        this.selectInput = "paid";
          let paid = {
            "text": "Paid",
            "value": "true"
          };
          let unpaid = {
            "text": "Unpaid",
            "value": "false"
          };
          this.selectData = [];
          this.selectData.push(paid, unpaid);
      }
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
