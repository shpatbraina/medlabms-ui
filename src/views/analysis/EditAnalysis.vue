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
      <h2>Edit analysis</h2>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="col-6 align-content-center"
      >
        <v-text-field
            v-model="name"
            :rules="nameRules"
            label="First Name"
            required
        ></v-text-field>

        <v-text-field
            v-model="description"
            label="Description"
        ></v-text-field>

        <v-text-field
            v-model="metric"
            :rules="metricRules"
            label="Metric"
            required
        ></v-text-field>

        <v-textarea
            v-model="metricRange"
            :rules="metricRangeRules"
            label="Metric ranges"
            required
            clearable
            clear-icon="mdi-close-circle"
        ></v-textarea>

        <v-text-field
            v-model="price"
            :rules="priceRules"
            label="Price"
            required
        ></v-text-field>

        <v-select
            v-model="select"
            :items="groups"
            item-text="name"
            item-value="id"
            :rules="[v => !!v || 'Group is required']"
            label="Group"
            required
        ></v-select>

        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit"
        >
          Add
        </v-btn>

        <v-btn
            color="error"
            class="mr-4"
            @click="cancel"
        >
          Cancel
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'EditAnalyses',
  components: {},
  data: () => ({
    errorAlert: false,
    message: '',
    item: Object,
    valid: true,
    name: '',
    description: null,
    metric: null,
    metricRange: null,
    price: null,
    select: null,
    groups: [],
    nameRules: [
      v => !!v || 'Name is required',
      v => /[a-zA-Z]+$/.test(v) || 'Name should contain only letters',
    ],
    metricRules: [
      v => !!v || 'Metric is required'
    ],
    metricRangeRules: [
      v => !!v || 'Metric ranges is required'
    ],
    priceRules: [
      v => !!v || 'Price is required',
      v => /^(\d*([.,](?=\d{1}))?\d+)?$/.test(v) || 'Price should contain only contain decimal numbers',
    ]
  }),
  mounted() {
    this.fetchGroups();
    this.item = this.$route.params.item;
    this.name = this.item.name;
    this.description = this.item.description;
    this.metric = this.item.metric;
    this.metricRange = this.item.metricRange;
    this.price = this.item.price;
    this.select = this.item.analysisGroupId;
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          "name": this.name,
          "description": this.description,
          "metric": this.metric,
          "metricRange": this.metricRange,
          "price": this.price,
          "analysisGroupId": [this.select][0]
        };
        axios.put("http://localhost:8081/analyses/" + this.item.id, data)
            .then(response => {
              this.$router.push({
                name: "Analyses",
                params: {
                  alert: "analysesRegistered",
                  message: "Analyses edited successfully!"
                }
              });
            })
            .catch(error => {
              this.errorAlert = true;
              this.message = error.response.data.errorMessage != null ? error.response.data.errorMessage : error.response.data;
            });
      }
    },
    cancel() {
      this.$router.push({
        name: "Analyses"
      });
    },
    fetchGroups() {
      axios
          .get(
              "http://localhost:8081/analysesGroups"
          ).then(response => {
        this.groups = response.data;
      });
    },
  },
}
</script>
