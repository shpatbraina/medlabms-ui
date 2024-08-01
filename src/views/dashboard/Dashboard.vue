<template>
  <v-container>
    <v-row>
      <!-- Card 1 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Groups</v-card-title>
          <v-card-subtitle class="display-1">{{ groupsCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 2 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Users</v-card-title>
          <v-card-subtitle class="display-1">{{ usersCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 3 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Patients</v-card-title>
          <v-card-subtitle class="display-1">{{ patientsCount }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Card 1 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Analyses Groups</v-card-title>
          <v-card-subtitle class="display-1">{{ analysesGroupsCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 2 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Analyses</v-card-title>
          <v-card-subtitle class="display-1">{{ analysesCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 3 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Visits</v-card-title>
          <v-card-subtitle class="display-1">{{ visitCount }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Pie Chart -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Paid visits</v-card-title>
          <v-card-text>
            <PieChart :chart-data="paidVisitsData"/>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Doughnut Chart -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Visits Total Debt</v-card-title>
          <v-card-text>
            <DoughnutChart :chart-data="totalDebtData"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PieChart from "@/components/PieChart.vue";
import DoughnutChart from "@/components/DoughnutChart.vue";

export default {
  components: { PieChart, DoughnutChart },
  data() {
    return {
      groupsCount: 1200,
      usersCount: 1200,
      orderCount: 320,
      patientsCount: 15000,
      analysesGroupsCount: 15000,
      analysesCount: 0,
      visitCount: 2300,
      paidVisitsData: {
        labels: ['Paid', 'Unpaid'],
        datasets: [
          {
            data: [65, 35], // Example data
            backgroundColor: ['#42A5F5', '#FF6384']
          }
        ]
      },
      totalDebtData: {
        labels: ['Total paid', 'Total unpaid'],
        datasets: [
          {
            data: [30, 70], // Example data
            backgroundColor: ['#42A5F5', '#FF6384']
          }
        ]
      }
    };
  },
  mounted() {
    // Fetch data from your backend here
    // For example: this.fetchDashboardData();
  },
  methods: {
    // Define methods to fetch data from the backend
    // async fetchDashboardData() {
    //   // Fetch data and update data properties
    // }
  },
};
</script>

<style scoped>
.display-1 {
  font-size: 2rem;
}
</style>

<!--<script>-->
<!--import axios from 'axios'-->
<!--import Datatable from "@/views/core/components/DataTable";-->

<!--export default {-->
<!--  name: 'ListGroup',-->
<!--  components: {Datatable},-->
<!--  data() {-->
<!--    return {-->
<!--      alert: false,-->
<!--      errorAlert: false,-->
<!--      message: "",-->
<!--      pageName: 'Dashboard',-->
<!--      headers: [-->
<!--        {text: 'Id', value: 'id', align: 'start'},-->
<!--        {text: 'Group Name', value: 'name'},-->
<!--        {text: 'Path', value: 'path'},-->
<!--        {text: 'Actions', value: 'actions', sortable: false}-->
<!--      ],-->
<!--      filterableHeaders: [-->
<!--        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},-->
<!--        {text: 'Group Name', value: 'name', hValue: 'name', sortable: true, disabled: false, active: true},-->
<!--        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},-->
<!--        {text: 'Path', value: 'path', hValue: 'path', sortable: true, disabled: true}-->
<!--      ]-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {-->
<!--      let searchVal = search !== null ? search : '';-->
<!--      return axios-->
<!--          .get("http://localhost:8081/groups", {-->
<!--            params: {-->
<!--              "size": itemsPerPage,-->
<!--              "page": pageNumber,-->
<!--              "sortBy": sortBy,-->
<!--              "sortDesc": sortDesc,-->
<!--              "filterBy": select,-->
<!--              "search": searchVal-->
<!--            }-->
<!--          });-->
<!--    },-->
<!--    editData(item) {-->
<!--      this.$router.push({-->
<!--        name: "EditGroup",-->
<!--        params: {-->
<!--          item: item-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    deleteData(item) {-->
<!--      return axios-->
<!--          .delete("http://localhost:8081/groups/" + item.id).then(response => {-->
<!--            this.showAlert("Group deleted successfully!");-->
<!--          })-->
<!--          .catch(error => {-->
<!--            this.showErrorAlert(error.response.data.errorMessage);-->
<!--          });-->
<!--    },-->
<!--    showAlert(message) {-->
<!--      this.alert = true;-->
<!--      this.message = message;-->
<!--      setTimeout(() => {-->
<!--        this.alert = false-->
<!--      }, 5000);-->
<!--    },-->
<!--    showErrorAlert(message) {-->
<!--      this.errorAlert = true;-->
<!--      this.message = message;-->
<!--      setTimeout(() => {-->
<!--        this.alert = false-->
<!--      }, 5000);-->
<!--    },-->
<!--    resetAlerts() {-->
<!--      this.alert = false;-->
<!--      this.errorAlert = false;-->
<!--    },-->
<!--  },-->
<!--  created() {-->
<!--    if (this.$route.params.alert !== null && this.$route.params.alert === "groupRegistered") {-->
<!--      this.showAlert(this.$route.params.message);-->
<!--    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "groupNotRegistered") {-->
<!--      this.showErrorAlert(this.$route.params.message);-->
<!--    } else {-->
<!--      this.resetAlerts();-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
