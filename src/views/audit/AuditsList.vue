<template>
  <div>
    <v-container>
      <Datatable :fetch-data="fetchData"
                 :headers="headers"
                 :page-name="pageName"
                 :filterable-headers="filterableHeaders"
                 :format-date-time="formatDateTime"
      />
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import Datatable from "@/views/core/components/DataTable";

export default {
  name: 'ListAudits',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Audit',
      headers: [
        {text: 'Id', value: 'id', align: 'start'},
        {text: 'Type', value: 'type'},
        {text: 'Action', value: 'action'},
        {text: 'Description', value: 'description'},
        {text: 'Modified by', value: 'modifiedBy'},
        {text: 'Date of change', value: 'date'},
      ],
      filterableHeaders: [
        {text: 'None', value: 'none', disabled: false, active: false, align: 'start'},
        {text: 'Type', value: 'type', hValue: 'type', sortable: true, disabled: false, active: true},
        {text: 'Action', value: 'action', hValue: 'action', sortable: true, disabled: false, active: true},
        {text: 'Modified by', value: 'modifiedBy', hValue: 'modifiedBy', sortable: true, disabled: false, active: true}
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      return axios
          .get("http://localhost:8081/audits", {
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
    formatDateTime(date) {
      if (!date) return null;
      const d = new Date(date);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString({}, {hour12:false})}`;
    },
  },
  created() {
  },
  mounted() {
  }
}
</script>
