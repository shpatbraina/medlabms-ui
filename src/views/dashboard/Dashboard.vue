<template>
  <v-container>
    <v-row>
      <!-- Card 1 -->
      <v-col cols="12" md="4">
        <v-card class="light-blue">
          <v-card-title style="color: white;">Groups</v-card-title>
          <v-card-subtitle class="display-1" style="color: white;">{{ groupsCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 2 -->
      <v-col cols="12" md="4">
        <v-card class="light-green darken-1">
          <v-card-title style="color: white;">Users</v-card-title>
          <v-card-subtitle class="display-1" style="color: white;">{{ usersCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 3 -->
      <v-col cols="12" md="4">
        <v-card class="brown darken-1">
          <v-card-title style="color: white;">Patients</v-card-title>
          <v-card-subtitle class="display-1" style="color: white;">{{ patientsCount }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Card 1 -->
      <v-col cols="12" md="4">
        <v-card class="deep-orange darken-1">
          <v-card-title style="color: white;">Analyses Groups</v-card-title>
          <v-card-subtitle class="display-1" style="color: white;">{{ analysesGroupsCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 2 -->
      <v-col cols="12" md="4">
        <v-card class="orange darken-1">
          <v-card-title style="color: white;">Analyses</v-card-title>
          <v-card-subtitle class="display-1" style="color: white;">{{ analysesCount }}</v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Card 3 -->
      <v-col cols="12" md="4">
        <v-card class="deep-purple darken-1">
          <v-card-title style="color: white;">Visits</v-card-title>
          <v-card-subtitle class="display-1" style="color: white;">{{ visitsCount }}</v-card-subtitle>
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
import axios from "axios";

export default {
  components: { PieChart, DoughnutChart },
  data() {
    return {
      groupsCount: 0,
      usersCount: 0,
      orderCount: 0,
      patientsCount: 0,
      analysesGroupsCount: 0,
      analysesCount: 0,
      visitsCount: 0,
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
    this.fetchDashboardData().then(response => {
      this.groupsCount = response.data.groupsCount;
      this.usersCount = response.data.usersCount;
      this.patientsCount = response.data.patientsCount;
      this.analysesGroupsCount = response.data.analysesGroupsCount;
      this.analysesCount = response.data.analysesCount;
      this.visitsCount = response.data.visitsCount;
    });
  },
  methods: {
    // Define methods to fetch data from the backend
    fetchDashboardData() {
      return axios
          .get("http://localhost:8081/stats");
    },
  },
};
</script>

<style scoped>
.display-1 {
  font-size: 2rem;
}
</style>
