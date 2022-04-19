<template>
  <v-card class="col-5 pa-6">
    <v-card-title>
<!--      <div style="position: absolute; top: 10px; bottom: 30px; left: 10px">-->
      <div class="pb-sm-16">
        {{ pageName }}
      </div>
      <v-row class="ma-1">
        <v-select
            v-model="select"
            :items="filterableHeaders"
            item-text="text"
            :item-value="item=>item"
            label="Filter"
            required
            @change=""
        ></v-select>
        <v-spacer></v-spacer>
        <v-select
            v-if="select != null && select.value === selectInput && active"
            v-model="selectValue"
            :items="selectInputValues"
            item-text="text"
            item-value="value"
            label="Filter"
        ></v-select>
        <v-text-field
            v-if="select != null && select.value !== selectInput && active"
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
      </v-row>
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
      <template v-slot:[`item.birthDate`]="{ item }">
        <span>{{ formatDate(item.birthDate) }}</span>
      </template>
      <template v-slot:[`item.dateOfVisit`]="{ item }">
        <span>{{ formatDate(item.dateOfVisit) }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editData(item)">mdi-pencil</v-icon>
        <v-icon small @click="openDeleteDialog(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:top>
        <v-dialog v-model="deleteDialog" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete item with id: {{ itemToDelete.id }} ?
            </v-card-title>
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
  data() {
    return {
      page: 0,
      totalRows: 0,
      totalPages: 0,
      totalElements: 0,
      select: null,
      selectValue: null,
      active: false,
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
      this.readDataFromAPI();
    },
    selectValue() {
      this.readDataFromAPI();
    },
    select() {
      this.active = this.select.active;
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
        this.search = ''
      });
    },
    sortData() {
      return new Promise((resolve, reject) => {
        const {sortBy, sortDesc, page, itemsPerPage} = this.options;
        console.log(sortBy);
        let sortHeaderIndex = this.filterableHeaders.findIndex(value => value.hValue === sortBy[0]);
        console.log(sortHeaderIndex);
        let sort = sortHeaderIndex !== -1 ? this.filterableHeaders[sortHeaderIndex].value : null;
        console.log(sort);
        let pageNumber = page > 0 ? page - 1 : 0;
        let value = this.search !== '' ? this.search : this.selectValue;
        let items;
        this.fetchData(itemsPerPage, pageNumber, sort, sortDesc, this.select != null ? this.select.value : null, value)
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
    openDeleteDialog(item) {
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
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
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
    filterableHeaders: {
      type: Array,
      default(e) {
        console.log('Please override this array!')
      }
    },
    selectInput: {
      type: String,
      default(e) {
        console.log('Please override this string!')
      }
    },
    selectInputValues: {
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