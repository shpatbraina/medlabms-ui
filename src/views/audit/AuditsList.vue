<template>
  <div>
    <v-container>
      <Datatable :fetch-data="fetchData"
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
  name: 'ListAudits',
  components: {Datatable},
  data() {
    return {
      alert: false,
      errorAlert: false,
      message: "",
      pageName: 'Audit',
      selectInput: "patientId",
      patients: [],
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
        {text: 'Id', value: 'id', hValue: 'id', sortable: true, disabled: false, active: true},
        {text: 'Type', value: 'type', hValue: 'type', sortable: true, disabled: true},
        {text: 'Action', value: 'action', hValue: 'action', sortable: true, disabled: true},
        {text: 'Description', value: 'description', hValue: 'description', sortable: false, disabled: true},
        {text: 'Modified by', value: 'modifiedBy', hValue: 'modifiedBy', sortable: true, disabled: true},
        {text: 'Date of change', value: 'date', hValue: 'date', sortable: true, disabled: true},
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber, sortBy, sortDesc, select, search) {
      return axios
          .get("http://localhost:8081/audits?size=" +
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
              search
          );
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
  },
  created() {
  },
  mounted() {
  }
}
</script>
