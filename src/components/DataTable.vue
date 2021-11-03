<template>
  <v-card class="col-5 pa-6 mx-2">
    <v-card-title>
      {{pageName}}
      <v-spacer></v-spacer>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
        :page="page"
        :pageCount="totalPages"
        :headers="headers"
        :items="data"
        :options.sync="options"
        :server-items-length="totalRows"
        :loading="loading"
        :search="search"
        :footer-props="footerProps"
        class="elevation-1"
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'Datatable',
  data () {
    return {
      page: 0,
      totalRows: 0,
      totalPages: 0,
      data: [],
      loading: true,
      footerProps: {
        'items-per-page-options': [5, 10, 15, 100, -1],
        'show-current-page': true,
        'show-first-last-page': true,
      },
      options: {
        page: 1
      },
      pagination: {},
      search: '',
    }
  },
  //this one will populate new data set when user changes current page.
  watch: {
    options: {
      handler() {
        console.log("watch");
        this.readDataFromAPI();
      },
    },
    search: {
      handler() {
        console.log("search watch");
        this.readDataFromSearchAPI();
      }
    },
    deep: true,
  },
  methods: {
    readDataFromAPI() {
      this.loading = true;
      this.sortData().then(data => {
        this.data = data.items
        this.totalRows = data.totalRows
        this.totalPages = data.totalPages
        this.loading = false
      });
    },
    readDataFromSearchAPI() {
      this.loading = true;
      this.sortData().then(data => {
        this.data = data.items
        this.totalRows = data.totalRows
        this.totalPages = data.totalPages
        this.loading = false
      });
    },
    sortData() {
      return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        let pageNumber = page > 0 ? page - 1 : 0;
        let items;
        this.fetchData(itemsPerPage, pageNumber)
            .then((response) => {
              //Then injecting the result to datatable parameters.
              this.loading = false;
              items = response.data.data;
              const totalRows = response.data.totalPassengers;
              const totalPages = response.data.totalPages;

              if (sortBy.length === 1 && sortDesc.length === 1) {
                items = items.sort((a, b) => {
                  const sortA = a[sortBy[0]]
                  const sortB = b[sortBy[0]]
                  if (sortDesc[0]) {
                    return sortB.toLowerCase().localeCompare(sortA.toLowerCase());
                  } else {
                    return sortA.toLowerCase().localeCompare(sortB.toLowerCase());
                  }
                })
              }
              this.loading = false
              resolve({
                items,
                totalRows,
                totalPages
              })
            })
            .catch((error) => console.log(error.message));
      });
    },
  },
  props: {
    fetchData: {
      type: Function,
      default(e) {
        console.log('Please override this method!')
      }
    },
    headers: {
      type: Array,
      default(e) {
        console.log('Please override this array!')
      }
    },
    pageName: {
      type: String,
      default(e) {
        console.log('Please override this string!')
      }
    },
  }
}
</script>