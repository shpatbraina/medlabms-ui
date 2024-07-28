<!--<template>-->
<!--  <v-container>-->
<!--    <v-row>-->
<!--      &lt;!&ndash; Card 1 &ndash;&gt;-->
<!--      <v-col cols="12" md="3">-->
<!--        <v-card>-->
<!--          <v-card-title>Users</v-card-title>-->
<!--          <v-card-subtitle class="display-1">{{ userCount }}</v-card-subtitle>-->
<!--        </v-card>-->
<!--      </v-col>-->

<!--      &lt;!&ndash; Card 2 &ndash;&gt;-->
<!--      <v-col cols="12" md="3">-->
<!--        <v-card>-->
<!--          <v-card-title>Orders</v-card-title>-->
<!--          <v-card-subtitle class="display-1">{{ orderCount }}</v-card-subtitle>-->
<!--        </v-card>-->
<!--      </v-col>-->

<!--      &lt;!&ndash; Card 3 &ndash;&gt;-->
<!--      <v-col cols="12" md="3">-->
<!--        <v-card>-->
<!--          <v-card-title>Revenue</v-card-title>-->
<!--          <v-card-subtitle class="display-1">{{ revenue | currency }}</v-card-subtitle>-->
<!--        </v-card>-->
<!--      </v-col>-->

<!--      &lt;!&ndash; Card 4 &ndash;&gt;-->
<!--      <v-col cols="12" md="3">-->
<!--        <v-card>-->
<!--          <v-card-title>Visits</v-card-title>-->
<!--          <v-card-subtitle class="display-1">{{ visitCount }}</v-card-subtitle>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--    </v-row>-->

<!--    &lt;!&ndash; Pie Chart &ndash;&gt;-->
<!--    <v-row>-->
<!--      <v-col cols="12">-->
<!--        <v-card>-->
<!--          <v-card-title>Payment Status</v-card-title>-->
<!--          <v-card-text>-->
<!--            <PieChart :data="chartData" />-->
<!--          </v-card-text>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </v-container>-->
<!--</template>-->

<!--<script>-->
<!--import PieChart from '@/views/core/components/PieChart.vue'; // Ensure this path is correct-->

<!--export default {-->
<!--  components: { PieChart },-->
<!--  data() {-->
<!--    return {-->
<!--      userCount: 1200,-->
<!--      orderCount: 320,-->
<!--      revenue: 15000,-->
<!--      visitCount: 2300,-->
<!--      chartData: {-->
<!--        labels: ['Paid', 'Unpaid'],-->
<!--        datasets: [-->
<!--          {-->
<!--            data: [65, 35], // Example data-->
<!--            backgroundColor: ['#42A5F5', '#FF6384']-->
<!--          }-->
<!--        ]-->
<!--      }-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    // Fetch data from your backend here-->
<!--    // For example: this.fetchDashboardData();-->
<!--  },-->
<!--  methods: {-->
<!--    // Define methods to fetch data from the backend-->
<!--    // async fetchDashboardData() {-->
<!--    //   // Fetch data and update data properties-->
<!--    // }-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.display-1 {-->
<!--  font-size: 2rem;-->
<!--}-->
<!--</style>-->

<!--&lt;!&ndash;<script>&ndash;&gt;-->
<!--&lt;!&ndash;import axios from 'axios'&ndash;&gt;-->
<!--&lt;!&ndash;import Datatable from "@/views/core/components/DataTable";&ndash;&gt;-->

<!--&lt;!&ndash;export default {&ndash;&gt;-->
<!--&lt;!&ndash;  name: 'ListGroup',&ndash;&gt;-->
<!--&lt;!&ndash;  components: {Datatable},&ndash;&gt;-->
<!--&lt;!&ndash;  data() {&ndash;&gt;-->
<!--&lt;!&ndash;    return {&ndash;&gt;-->
<!--&lt;!&ndash;      alert: false,&ndash;&gt;-->
<!--&lt;!&ndash;      errorAlert: false,&ndash;&gt;-->
<!--&lt;!&ndash;      message: "",&ndash;&gt;-->
<!--&lt;!&ndash;      pageName: 'Dashboard',&ndash;&gt;-->
<!--&lt;!&ndash;      headers: [&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Id', value: 'id', align: 'start'},&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Group Name', value: 'name'},&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Path', value: 'path'},&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Actions', value: 'actions', sortable: false}&ndash;&gt;-->
<!--&lt;!&ndash;      ],&ndash;&gt;-->
<!--&lt;!&ndash;      filterableHeaders: [&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Group Name', value: 'name', hValue: 'name', sortable: true, disabled: false, active: true},&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: true},&ndash;&gt;-->
<!--&lt;!&ndash;        {text: 'Path', value: 'path', hValue: 'path', sortable: true, disabled: true}&ndash;&gt;-->
<!--&lt;!&ndash;      ]&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  methods: {&ndash;&gt;-->
<!--&lt;!&ndash;    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {&ndash;&gt;-->
<!--&lt;!&ndash;      let searchVal = search !== null ? search : '';&ndash;&gt;-->
<!--&lt;!&ndash;      return axios&ndash;&gt;-->
<!--&lt;!&ndash;          .get("http://localhost:8081/groups", {&ndash;&gt;-->
<!--&lt;!&ndash;            params: {&ndash;&gt;-->
<!--&lt;!&ndash;              "size": itemsPerPage,&ndash;&gt;-->
<!--&lt;!&ndash;              "page": pageNumber,&ndash;&gt;-->
<!--&lt;!&ndash;              "sortBy": sortBy,&ndash;&gt;-->
<!--&lt;!&ndash;              "sortDesc": sortDesc,&ndash;&gt;-->
<!--&lt;!&ndash;              "filterBy": select,&ndash;&gt;-->
<!--&lt;!&ndash;              "search": searchVal&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->
<!--&lt;!&ndash;          });&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    editData(item) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.$router.push({&ndash;&gt;-->
<!--&lt;!&ndash;        name: "EditGroup",&ndash;&gt;-->
<!--&lt;!&ndash;        params: {&ndash;&gt;-->
<!--&lt;!&ndash;          item: item&ndash;&gt;-->
<!--&lt;!&ndash;        }&ndash;&gt;-->
<!--&lt;!&ndash;      });&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    deleteData(item) {&ndash;&gt;-->
<!--&lt;!&ndash;      return axios&ndash;&gt;-->
<!--&lt;!&ndash;          .delete("http://localhost:8081/groups/" + item.id).then(response => {&ndash;&gt;-->
<!--&lt;!&ndash;            this.showAlert("Group deleted successfully!");&ndash;&gt;-->
<!--&lt;!&ndash;          })&ndash;&gt;-->
<!--&lt;!&ndash;          .catch(error => {&ndash;&gt;-->
<!--&lt;!&ndash;            this.showErrorAlert(error.response.data.errorMessage);&ndash;&gt;-->
<!--&lt;!&ndash;          });&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showAlert(message) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.alert = true;&ndash;&gt;-->
<!--&lt;!&ndash;      this.message = message;&ndash;&gt;-->
<!--&lt;!&ndash;      setTimeout(() => {&ndash;&gt;-->
<!--&lt;!&ndash;        this.alert = false&ndash;&gt;-->
<!--&lt;!&ndash;      }, 5000);&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    showErrorAlert(message) {&ndash;&gt;-->
<!--&lt;!&ndash;      this.errorAlert = true;&ndash;&gt;-->
<!--&lt;!&ndash;      this.message = message;&ndash;&gt;-->
<!--&lt;!&ndash;      setTimeout(() => {&ndash;&gt;-->
<!--&lt;!&ndash;        this.alert = false&ndash;&gt;-->
<!--&lt;!&ndash;      }, 5000);&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;    resetAlerts() {&ndash;&gt;-->
<!--&lt;!&ndash;      this.alert = false;&ndash;&gt;-->
<!--&lt;!&ndash;      this.errorAlert = false;&ndash;&gt;-->
<!--&lt;!&ndash;    },&ndash;&gt;-->
<!--&lt;!&ndash;  },&ndash;&gt;-->
<!--&lt;!&ndash;  created() {&ndash;&gt;-->
<!--&lt;!&ndash;    if (this.$route.params.alert !== null && this.$route.params.alert === "groupRegistered") {&ndash;&gt;-->
<!--&lt;!&ndash;      this.showAlert(this.$route.params.message);&ndash;&gt;-->
<!--&lt;!&ndash;    } else if (this.$route.params.errorAlert !== null && this.$route.params.errorAlert === "groupNotRegistered") {&ndash;&gt;-->
<!--&lt;!&ndash;      this.showErrorAlert(this.$route.params.message);&ndash;&gt;-->
<!--&lt;!&ndash;    } else {&ndash;&gt;-->
<!--&lt;!&ndash;      this.resetAlerts();&ndash;&gt;-->
<!--&lt;!&ndash;    }&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;</script>&ndash;&gt;-->
