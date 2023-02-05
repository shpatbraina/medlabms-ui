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
                 :select-input-values="groups"
      />
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListAnalyses',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Analyses',
      selectInput: "analysisGroupId",
      groups: [],
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'Name', value: 'name'},
        {text: 'Description', value: 'description'},
        {text: 'Metric ranges', value: 'metricRange'},
        {text: 'Metric', value: 'metric'},
        {text: 'Price', value: 'price'},
        {text: 'Group', value: 'analysisGroupName'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'Name', value: 'name', hValue: 'name', sortable: true, disabled: false, active: true},
        {text: 'Group', value: 'analysisGroupId', hValue: 'analysisGroupName', sortable: true, disabled: false, active: true},
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},
        {text: 'Description', value: 'description', hValue: 'description', sortable: true, disabled: true},
        {text: 'Metric ranges', value: 'metricRange', hValue: 'metricRange', sortable: true, disabled: true},
        {text: 'Metric', value: 'metric', hValue: 'metric', sortable: true, disabled: true},
        {text: 'Price', value: 'price', hValue: 'price', sortable: true, disabled: true},
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      let searchVal = search !== null ? search : '';
      return axios
          .get("http://localhost:8081/analyses?size=" +
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
    fetchGroups() {
      axios
          .get(
              "http://localhost:8081/analysesGroups"
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
    editData(item) {
      this.$router.push({
        name: "EditAnalysis",
        params: {
          item: item
        }
      });
    },
    deleteData(item) {
      return axios
          .delete("http://localhost:8081/analyses/" + item.id).then(response => {
            this.showAlert("Analysis deleted successfully!");
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
    if (this.$route.params.alert !== null && this.$route.params.alert === "analysesRegistered") {
      this.showAlert(this.$route.params.message);
    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "analysesNotRegistered") {
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
