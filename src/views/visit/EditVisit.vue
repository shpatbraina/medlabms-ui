<template>
  <div>
    <v-card class="col-5 pa-6">
      <v-alert
          elevation="20"
          type="error"
          transition="fade-transition"
          :value="errorAlert"
          class="pa-6 mx-2">
        {{ message }}
      </v-alert>
      <h2>Edit Visit</h2>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="col-12 align-content-center"
      >
        <v-select
            v-model="patientSelect"
            :items="patients"
            item-value="id"
            :item-text="item => item.firstName +' '+ item.lastName"
            :rules="[v => !!v || 'Patient is required']"
            label="Patient"
            required
        >
        </v-select>

        <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="dateFormatted"
                label="Date of visit"
                :rules="dateRules"
                hint="DD/MM/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="date"
              :allowed-dates="(date1) => date1 <= new Date().toISOString().substr(0, 10)"
              @input="dateMenu = false"
          ></v-date-picker>
        </v-menu>
        <VisitAnalyses
            v-bind:analyses="analyses"
            v-bind:selected-analyses="selectedAnalyses"
            v-bind:parent-total="total"
            v-on:totalFromComponent="updateTotal"
        />
        <v-row>
          <v-text-field
              v-model="total"
              suffix="€"
              label="Total Price"
              readonly
          >
          </v-text-field>
        </v-row>
        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit"
        >
          Edit
        </v-btn>

        <v-btn
            color="error"
            class="mr-4"
            @click="reset"
        >
          Clear
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>

import axios from "axios";
import VisitAnalyses from "@/components/VisitAnalyses";

export default {
  name: 'EditVisit',
  components: {VisitAnalyses},
  data: () => ({
    item: null,
    errorAlert: false,
    message: '',
    valid: true,
    patientSelect: null,
    patients: [],
    analyses: [],
    selectedAnalyses: [],
    date: null,
    dateFormatted: null,
    dateMenu: false,
    total: 0,
    dateRules: [
      v => !!v || 'Date of visit is required'
    ],
  }),
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    },
  },
  created() {
    this.fetchPatients();
    this.fetchAnalyses();
    this.item = this.$route.params.item;
    this.patientSelect = parseInt(this.item.patientId);
    this.dateFormatted = this.formatDate(this.item.dateOfVisit);
    this.date = this.item.dateOfVisit;
    this.total = this.item.totalPrice;
    this.fetchSelectedAnalyses();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          "patientId": this.patientSelect,
          "dateOfVisit": this.date,
          "totalPrice": this.total
        };
        axios.put("http://localhost:8081/visits/" + this.item.id, data)
            .then(response => {
              if (response.status === 200) {
                let data2 = [];
                this.selectedAnalyses.forEach(value => {
                  const analysisId = value.analysis.analysisId != null ? value.analysis.analysisId : value.analysis.id;
                  let temp = {
                    "visitId": response.data.id,
                    "analysisId": analysisId,
                    "name": value.analysis.name,
                    "value": value.value,
                    "metric": value.analysis.metric,
                    "metricRange": value.analysis.metricRange,
                    "price": value.analysis.price,
                  };
                  data2.push(temp);
                })
                axios.put("http://localhost:8081/visits/analyses/" + this.item.id, data2)
                    .then(response2 => {
                      this.$router.push({
                        name: "Visits",
                        params: {
                          alert: "visitsRegistered",
                          message: "Visits updated successfully!"
                        }
                      });
                    })
                    .catch(error => {
                      this.errorAlert = true;
                      this.message = error.response.data.errorMessage != null ? error.response.data.errorMessage : error.response.data;
                    });
              }
            });
      }
    },
    reset() {
      this.$refs.form.reset();
      this.selectedAnalyses = [];
      this.fetchAnalyses();
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    fetchPatients() {
      axios
          .get(
              "http://localhost:8081/patients"
          ).then(response => {
        this.patients = response.data;
      });
    },
    fetchAnalyses() {
      axios
          .get(
              "http://localhost:8081/analyses"
          ).then(response => {
        this.analyses = response.data;
      });
    },
    fetchSelectedAnalyses() {
      let self = this;
      axios
          .get("http://localhost:8081/visits/analyses/" + this.item.id)
          .then(response => {
            response.data.forEach(function (item) {
              item.id = item.analysisId;
              let o = {
                "analysis": item,
                "value": item.value,
              }
              self.selectedAnalyses.push(o);
            });
          });
    },
    updateTotal(total) {
      this.total = total;
    }
  },
}
</script>
