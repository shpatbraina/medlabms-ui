<template>
  <v-card class="col-5 pa-6">
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
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editData(item)">mdi-pencil</v-icon>
        <v-icon small @click="openDeleteDialog(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:top>
        <v-dialog v-model="deleteDialog" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete item with id: {{itemToDelete.id}} ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="confirmDelete">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
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
      deleteDialog: false,
      itemToDelete: Object,
      footerProps: {
        'items-per-page-options': [1, 2, 5, 10, 15, 100, -1],
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
        this.readDataFromAPI();
      },
    },
    search() {
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
              items = response.data.content;
              const totalRows = response.data.totalElements;
              const totalPages = response.data.totalPages;

              if (sortBy.length === 1 && sortDesc.length === 1) {
                items = items.sort((a, b) => {
                  const sortA = a[sortBy[0]]
                  const sortB = b[sortBy[0]]
                  if (sortDesc[0]) {
                    return sortB.toString().toLowerCase().localeCompare(sortA.toString().toLowerCase());
                  } else {
                    return sortA.toString().toLowerCase().localeCompare(sortB.toString().toLowerCase());
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
            .catch((error) => error.message);
      });
    },
    openDeleteDialog(item)  {
      this.deleteDialog = true;
      this.itemToDelete = item;
    },
    closeDelete() {
      this.deleteDialog = false;
    },
    confirmDelete() {
      this.deleteData(this.itemToDelete).then(() => {
        this.readDataFromAPI();
        this.deleteDialog = false;
        this.itemToDelete = '';
      });
    }
  },
  props: {
    fetchData: {
      type: Function,
      default(e) {
        console.log('Please override this method!')
      }
    },
    editData: {
      type: Function,
      default(e) {
        console.log('Please override this method!')
      }
    },
    deleteData: {
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
    }
  }
}
</script>