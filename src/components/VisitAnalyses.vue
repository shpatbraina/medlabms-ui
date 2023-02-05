<template>
  <div>
    <v-row>
      <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Analysis</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form
                  ref="dialogForm"
                  v-model="validDialog"
                  lazy-validation
                  class="col-12 align-content-center"
              >
                <v-row>
                  <v-col
                      cols="12"
                      sm="6"
                  >
                    <v-autocomplete
                        v-model="analysesSelect"
                        :items="analyses"
                        :item-value="item=>item"
                        :item-text="item=>item.name"
                        label="Analysis"
                        :rules="analysisRules"
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                  >
                    <v-text-field
                        v-model="analysesSelectValue"
                        label="Value"
                        :rules="analysisValueRules"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="closeDialog"
            >
              Close
            </v-btn>
            <v-btn
                :disabled="!validDialog"
                color="blue darken-1"
                text
                @click="updateAnalyses"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-dialog
          v-model="metricDialog"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Metric Range</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field v-model="metricRangeAnalysisName" readonly></v-text-field>
              <v-textarea v-model="metricRangeAnalysisValue" readonly></v-textarea>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="metricDialog=false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row class="pa-8 px-3" justify="center">
      <v-card class="flex-grow-0" width="100%">
        <v-card-title class="white--text orange darken-4">
          Visit analyses

          <v-spacer></v-spacer>

          <v-btn
              color="white"
              class="text--primary"
              fab
              small
              @click="openDialog"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-6">
          <v-row>
            <v-col>ID</v-col>
            <v-col>Name</v-col>
            <v-col>Value</v-col>
            <v-col>Metric</v-col>
            <v-col>Price</v-col>
            <v-col>Actions</v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-virtual-scroll
            :items="selectedAnalyses"
            :item-height="50"
            height="300"
        >
          <template v-slot="{ item }">
            <v-list-item>
              <v-row align="center"
                     justify="center">
                  <v-col >
                      <v-avatar
                          color="red"
                          size="32"
                          class="white--text"
                      >
                        {{ item.analysis.id }}
                      </v-avatar>
                  </v-col>
                  <v-col justify="center" >
                    <v-list-item-content>{{ item.analysis.name }}</v-list-item-content>
                  </v-col>
                  <v-col justify="center">
                    <v-list-item-content>{{ item.value }}</v-list-item-content>
                  </v-col>
                  <v-col justify="center">
                    <v-list-item-content>{{ item.analysis.metric }}</v-list-item-content>
                  </v-col>
                  <v-col justify="center">
                    <v-list-item-content>{{ item.analysis.price }} €</v-list-item-content>
                  </v-col>
                <v-list-item-action>
                  <v-btn
                      depressed
                      small
                      @click="openMetric(item)"
                  >
                    Metric Range

                    <v-icon
                        color="orange darken-4"
                        right
                    >
                      mdi-open-in-new
                    </v-icon>
                  </v-btn>
                </v-list-item-action>

                <v-list-item-action>
                  <v-row>
                    <v-col>
                      <v-icon small class="mr-2" @click="editAnalysis(item)">mdi-pencil</v-icon>
                    </v-col>
                    <v-col>
                      <v-icon small class="mr-2" @click="deleteAnalysis(item)">mdi-delete</v-icon>
                    </v-col>
                  </v-row>
                </v-list-item-action>
              </v-row>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "VisitAnalyses",
  data: () => ({
    analysisRules: [
      v => !!v || 'Analysis is required'
    ],
    analysisValueRules: [
      v => !!v || 'Value is required',
      // v => /^(\d*([.,](?=\d{1}))?\d+)?$/.test(v) || 'Value should contain only contain decimal numbers',
    ],
    metricRangeAnalysisName: null,
    metricRangeAnalysisValue: null,
    metricDialog: false,
    dialog: false,
    selectedAnalysesScroll: null,
    benched: 3,
    total: 0,
    analysesSelect: null,
    analysesSelectValue: null,
    validDialog: true
  }),
  mounted() {
    this.total = this.parentTotal;
  },
  props: ['analyses', 'selectedAnalyses', 'parentTotal'],
  methods: {
    updateAnalyses() {
      if (this.$refs.dialogForm.validate()) {
        const index = this.selectedAnalyses.findIndex(value => this.analysesSelect.id === value.analysis.id);
        const updatedElement = {analysis: this.analysesSelect, value: this.analysesSelectValue};
        if(index != -1) {
          this.selectedAnalyses.splice(index, 1, updatedElement);
        }else {
          this.selectedAnalyses.push(updatedElement);
          this.updateTotal(updatedElement.analysis, true);
        }
        this.closeDialog();
      }
    },
    updateTotal(item, add){
      add ? this.total += item.price : this.total -= item.price;
      this.$emit('totalFromComponent', this.total);
    },
    closeDialog() {
      this.$refs.dialogForm.reset();
      this.dialog = false;
    },
    openDialog() {
      this.dialog = true;
    },
    openMetric(item) {
      this.metricDialog = true;
      this.metricRangeAnalysisName = item.analysis.name;
      this.metricRangeAnalysisValue = item.analysis.metricRange;
    },
    editAnalysis(item) {
      let index = this.analyses.findIndex(analysis => item.analysis.name === analysis.name);
      this.analysesSelect = this.analyses[index];
      this.analysesSelectValue = item.value;
      this.openDialog();
    },
    deleteAnalysis(item) {
      let index = this.selectedAnalyses.indexOf(item);
      this.selectedAnalyses.splice(index, 1);
      this.updateTotal(item.analysis, false);
    }
  },
}
</script>

<style scoped>

</style>