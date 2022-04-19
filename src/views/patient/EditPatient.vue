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
      <h2>Edit Patient</h2>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="col-6 align-content-center"
      >
        <v-text-field
            v-model="firstName"
            :rules="firstNameRules"
            label="First Name"
            required
        ></v-text-field>

        <v-text-field
            v-model="lastName"
            :rules="lastNameRules"
            label="Last Name"
            required
        ></v-text-field>

        <v-menu
            v-model="birthDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="birthDateFormatted"
                label="Birth date"
                :rules="birthDateRules"
                hint="DD/MM/YYYY format"
                persistent-hint
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                @blur="birthDate = parseDate(birthDateFormatted)"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              v-model="birthDate"
              @input="birthDateMenu = false"
              :allowed-dates="(date1) => date1 <= new Date().toISOString().substr(0, 10)"
          ></v-date-picker>
        </v-menu>

        <v-text-field
            v-model="birthPlace"
            :rules="birthPlaceRules"
            label="Birth place"
            required
        ></v-text-field>

        <v-radio-group
            v-model="gender"
            label="Gender"
            mandatory
            row>
          <v-radio
              label="Male"
              value="male"
          ></v-radio>
          <v-radio
              label="Female"
              value="female"
          ></v-radio>
        </v-radio-group>

        <v-radio-group
            v-model="bloodType"
            label="Blood type"
            mandatory
            row>
          <v-radio
              label="A"
              value="A"
          ></v-radio>
          <v-radio
              label="B"
              value="B"
          ></v-radio>
          <v-radio
              label="AB"
              value="AB"
          ></v-radio>
          <v-radio
              label="0"
              value="0"
          ></v-radio>
        </v-radio-group>
        <v-radio-group
            v-model="bloodTypeRh"
            label="Blood type RH"
            mandatory
            row>
          <v-radio
              label="+"
              value="+"
          ></v-radio>
          <v-radio
              label="-"
              value="-"
          ></v-radio>
        </v-radio-group>

        <v-text-field
            v-model="personalId"
            :rules="personalIdRules"
            label="Personal ID"
            required
        ></v-text-field>

        <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
        ></v-text-field>

        <v-text-field
            v-model="phone"
            :rules="phoneRules"
            label="Phone number"
            required
        ></v-text-field>

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
  name: 'EditPatient',
  components: {},
  data: () => ({
    errorAlert: false,
    message: '',
    item: Object,
    valid: true,
    firstName: '',
    lastName: '',
    gender: null,
    birthDate: null,
    birthDateFormatted: null,
    birthDateMenu: false,
    birthPlace: null,
    bloodType: null,
    bloodTypeRh: null,
    personalId: null,
    email: '',
    phone: '',
    firstNameRules: [
      v => !!v || 'First name is required',
      v => /[a-zA-Z]+$/.test(v) || 'First name should contain only letters',
    ],
    lastNameRules: [
      v => !!v || 'Last Name is required',
      v => /[a-zA-Z]+$/.test(v) || 'Last name should contain only letters',
    ],
    birthDateRules: [
      v => !!v || 'Birth date is required'
    ],
    birthPlaceRules: [
      v => !!v || 'Birth place is required',
      v => /[a-zA-Z]+$/.test(v) || 'Birth place should contain only letters',
    ],
    personalIdRules: [
      v => !!v || 'Personal ID is required',
      v => /[0-9]{10}$/.test(v) || 'Personal ID should contain only numbers',
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    phoneRules: [
      v => !!v || 'Phone number is required',
      v => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(v) || 'Phone number must be valid',
    ],
  }),
  watch: {
    birthDate(val) {
      this.birthDateFormatted = this.formatDate(this.birthDate);
    },
  },
  mounted() {
    this.item = this.$route.params.item;
    this.firstName = this.item.firstName;
    this.lastName = this.item.lastName;
    this.birthDate = this.item.birthDate;
    this.birthPlace = this.item.birthPlace;
    this.gender = this.item.gender;
    this.bloodType = this.item.bloodType;
    this.bloodTypeRh = this.item.bloodTypeRh;
    this.personalId = this.item.personalId;
    this.phone = this.item.phone;
    this.email = this.item.email;
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let data = {
          "firstName": this.firstName,
          "lastName": this.lastName,
          "birthDate": this.birthDate,
          "birthPlace": this.birthPlace,
          "gender": this.gender,
          "bloodType": this.bloodType,
          "bloodTypeRh": this.bloodTypeRh,
          "personalId": this.personalId,
          "email": this.email,
          "phone": this.phone
        };
        axios.put("http://localhost:8081/patients/" + this.item.id, data)
            .then(response => {
              this.$router.push({
                name: "Patients",
                params: {
                  alert: "patientRegistered",
                  message: "Patient edited successfully!"
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
        name: "Patients"
      });
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
  },
}
</script>
