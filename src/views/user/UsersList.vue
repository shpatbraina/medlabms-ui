<template>
    <Datatable :fetch-data="fetchData"
               :headers="headers"
               :page-name="pageName"
    />
</template>

<script>
import axios from 'axios'
import Datatable from "@/components/DataTable";

export default {
  name: 'ListUser',
  components: {Datatable},
  data () {
    return {
      pageName: 'Users',
      headers:[
        {
          text: 'Id',
          align: 'start',
          value: '_id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Airline Id', value: 'airline[0].id' },
        { text: 'Airline Name', value: 'airline[0].name' },
        { text: 'Country', value: 'airline[0].country' },
        { text: 'Slogan', value: 'airline[0].slogan' },
        { text: 'Website', value: 'airline[0].website' },
        { text: 'Established', value: 'airline[0].established' },
      ]
    }
  },
  methods: {
    fetchData(itemsPerPage, pageNumber) {
      return axios
          .get(
              "https://api.instantwebtools.net/v1/passenger?size=" +
              itemsPerPage +
              "&page=" +
              pageNumber
          );
    },
  },
}
</script>
