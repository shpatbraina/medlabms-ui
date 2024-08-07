<template>
  <v-card class="">
    <v-card-title>
      <div>
        {{ pageName }}
      </div>
      <v-row class="mx-6">
        <v-select
            v-if="filterableHeaders != null"
            v-model="select"
            :items="filterableHeaders"
            item-text="text"
            :item-value="item=>item"
            label="Filter"
            required
            @change="onSelectionChange"
        ></v-select>
        <v-spacer class="mx-6"></v-spacer>
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
      <template v-slot:[`item.date`]="{ item }">
        <span>{{ formatDateTime(item.date) }}</span>
      </template>
      <template v-slot:[`item.paid`]="{ item }">
        <v-chip v-if="item.paid" variant="elevated" class="success white--text" style="width: 75px; justify-content: center">PAID</v-chip>
        <v-chip v-else variant="elevated" class="red white--text" style="width: 75px; justify-content: center">UNPAID</v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon v-if="item.paid != null" small class="mr-2" @click="markPaid(item)">mdi-wallet</v-icon>
        <v-icon v-if="resetPasswordAction" small class="mr-2" @click="resetPassword(item)">mdi-lock-reset</v-icon>
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
      totalSize: 0,
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
        page: 1,
        sortBy: ['id'],
        sortDesc: [false]
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
      if(this.select.value==="none"){
        this.readDataFromAPI();
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
    sortData() {
      return new Promise((resolve, reject) => {
        const {sortBy, sortDesc, page, itemsPerPage} = this.options;
        let sortHeaderIndex = this.filterableHeaders != null ? this.filterableHeaders.findIndex(value => value.hValue === sortBy[0]) : -1;
        let sort = sortHeaderIndex !== -1 && this.filterableHeaders[sortHeaderIndex].sortable ? this.filterableHeaders[sortHeaderIndex].value : null;
        let pageNumber = page > 0 ? page - 1 : 0;
        let value = this.search !== '' ? this.search : this.selectValue;
        let items;
        this.fetchData(itemsPerPage, pageNumber, sort, sortDesc, this.select != null ? this.select.value : null, value)
            .then((response) => {
              //Then injecting the result to datatable parameters.
              this.loading = false;
              items = response.data.content;
              let totalRows;
              if(response.data.totalSize)
                totalRows = response.data.totalSize;
              else if(response.data.totalElements)
                totalRows = response.data.totalElements;
              const totalPages = response.data.totalPages;

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
    markPaid: {
      type: Function,
      default(e) {
        console.log('Please override this method for mark paid!')
      }
    },
    resetPassword: {
      type: Function,
      default(e) {
        console.log('Please override this method for reset password!')
      }
    },
    resetPasswordAction: {
      type: Boolean,
      default(e) {
        console.log('Please override this boolean for reset password!')
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
    onSelectionChange: {
      type: Function,
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
    },
    formatDateTime: {
      type: Function,
      default(e) {
          if (!e) return null;

          const [year, month, day] = e.split('-');
          const [d, time] = day.split('T');
          const [hour, minutes, seconds] = time.split(':');
          return `${day}/${month}/${year} ${hour}:${minutes}`;
      }
    }
  }
}
</script>
