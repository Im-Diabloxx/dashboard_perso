<template>
  <div tabindex="-1" :class="active ? 'modal modalCreateContact is-active' : 'modal modalCreateContact'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px; width: 640px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Ajouter un Contact</p>
          <button @click="cancel()" class="delete"></button>
        </div>
        <div>
          <section class="modal-card-body">
            <div class="container is-fluid supportDiag">
              <div class="level" v-if="!isManualEntry && !isImport">
                <div class="level_title">Comment souhaitez-vous ajouter un contact?</div>

                <button type="button" class="button diagBtn is-rounded has-icon" @click="activateManualEntry">
                  <span>
                    <i class="material-symbols-outlined size-xxl">edit_note</i>
                  </span>
                  <span>Saisir</span>
                </button>

                <button type="button" class="button diagBtn is-rounded has-icon" @click="activateImport">
                  <span>
                    <i class="material-symbols-outlined size-xxl">file_upload</i>
                  </span>
                  <span>Importer</span>
                </button>
              </div>

              <div v-if="isManualEntry">
                <div class="level" style="height: 680px; overflow-y: auto">
                  <div class="level_title">Veuillez remplir les informations du contact</div>
                  
                  <component 
                    :is="'EditContact'" 
                    :contact="newContactData" 
                    :active="true" 
                    @createContact="saveChanges"
                    @closeModal="isManualEntry = false"
                    :isCreate="true"
                    :phonebooks="phonebooks"
                  />
                </div>
              </div>

              <!-- Import Section -->
              <div v-if="isImport" class="import-section">
                <button @click="downloadTemplate" class="button is-link mb-3">
                  Télécharger un fichier modèle
                </button>
                
                <div class="level_title">Sélectionnez un fichier pour l'importation</div>
                <input type="file" ref="fileInput" @change="handleFileUpload" class="mb-3" />

                <div v-if="columnsDetected.length" class="mapping-section">
                  <div class="level_title">Fichier sélectionné : {{ uploadedFileName }}</div>
                  <div class="mapping-fields" v-for="(column, index) in columnsDetected" :key="index">
                    <span>{{ column }} :</span>
                    <div class="field control" style="margin-left: 10px;">
                      <select v-model="columnMapping[index]" class="mapping-select">
                        <option value="" disabled>Non défini</option>
                        <option v-for="option in mappingOptions" :key="option.value" :value="option.value">
                          {{ option.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="action-buttons" style="text-align: center; margin-top: 2rem;">
                  <button type="button" class="button is-light" @click="getBack">Annuler</button>
                  <button type="button" class="button is-primary" @click="validateContact">Valider</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import EditContact from './EditContact.vue';

export default {
  name: 'CreateContact',
  props: {
    active: Boolean,
    defaultPhonebookId: Number,
    phonebooks: Array,
  },
  components: {
    EditContact,
  },
  data() {
    return {
      isManualEntry: false,
      isImport: false,
      newContactData: null,
      columnsDetected: [],
      columnMapping: [],
      contactsToUpload: [],
      uploadedFileName: "",
      mappingOptions: [
        { value: 'firstname', name: 'Prénom' },
        { value: 'lastname', name: 'Nom' },
        { value: 'email', name: 'Email' },
        { value: 'phone_mobile', name: 'Téléphone Mobile' },
        { value: 'phone_home', name: 'Téléphone Domicile' },
        { value: 'phone_work', name: 'Téléphone Bureau' },
        { value: 'organization', name: 'Organisation' },
        { value: 'address', name: 'Adresse' },
        { value: 'note', name: 'Note' }
      ]
    };
  },
  methods: {
    getBack() {
      this.resetFields();
      this.isImport = false;
    },
    getPhonebookName(id) {
      for (let p of this.phonebooks) {
        if (p.id === id) {
          return p.name;
        }
      }
    },
    activateManualEntry() {
      this.isManualEntry = true;
      this.isImport = false;
      this.newContactData = {
        id_contact: '',
        phonebook: this.defaultPhonebookId,
        name: {
          GIVEN_NAME: '',
          FAMILY_NAME: '',
          PREFIX: '',
          MIDDLE_NAME: '',
          SUFFIX: '',
          PHONETIC_GIVEN_NAME: '',
          PHONETIC_FAMILY_NAME: ''
        },
        nickname: { NAME: '' },
        organization: {
          COMPANY: '',
          TITLE: '',
          DEPARTMENT: '',
          JOB_DESCRIPTION: '',
          SYMBOL: '',
          PHONETIC_NAME: '',
          OFFICE_LOCATION: ''
        },
        postal_address: {
          STREET: '',
          POBOX: '',
          NEIGHBORHOOD: '',
          CITY: '',
          REGION: '',
          POSTCODE: '',
          COUNTRY: ''
        },
        phones: [],
        emails: [],
        websites: [],
        ims: [],
        note: { NOTE: '' },
        photo: { PHOTO: null, PHOTO_FILE_ID: null },
        additionalData: null,
        color: null,
        phone_book_name: this.getPhonebookName(this.defaultPhonebookId)
      };
    },
    activateImport() {
      this.isManualEntry = false;
      this.isImport = true;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadedFileName = file ? file.name : "";
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', raw: true });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

        this.columnsDetected = sheetData[0];
        this.autoMapColumns();
        this.contactsToUpload = sheetData.slice(1);
      };
      reader.readAsArrayBuffer(file);
    },
    autoMapColumns() {
      const mappingRules = {
        firstname: ["prénom", "prenom", "firstname", "given name"],
        lastname: ["nom", "lastname", "surname", "family name"],
        email: ["email", "courriel", "mail"],
        phone_mobile: ["mobile", "portable"],
        phone_home: ["domicile", "home"],
        phone_work: ["bureau", "work", "office"],
        organization: ["organisation", "company", "entreprise"],
        address: ["adresse", "address", "street"],
        note: ["note", "commentaire"]
      };

      this.columnMapping = this.columnsDetected.map(column => {
        const colLower = column.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        for (const [key, values] of Object.entries(mappingRules)) {
          if (values.includes(colLower)) return key;
        }
        return "";
      });
    },
    getMappingName(value) {
      const option = this.mappingOptions.find(option => option.value === value);
      return option ? option.name : "Non défini";
    },
    downloadTemplate() {
      const headers = [
        ["Prénom", "Nom", "Email", "Téléphone Mobile", "Téléphone Domicile", "Téléphone Bureau", "Organisation", "Adresse", "Note"]
      ];
      const csvContent = headers
        .map(row => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template_contacts.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    validateContact() {
      const mappedContacts = this.contactsToUpload.map(row => {
        const contact = {
          id_contact: '',
          phonebook: this.defaultPhonebookId,
          name: {
            GIVEN_NAME: '',
            FAMILY_NAME: ''
          },
          phones: [],
          emails: [],
          organization: { COMPANY: '' },
          postal_address: { STREET: '' },
          note: { NOTE: '' },
          photo: { PHOTO: null }
        };

        this.columnMapping.forEach((map, index) => {
          const value = row[index];
          if (map === 'firstname') contact.name.GIVEN_NAME = value;
          if (map === 'lastname') contact.name.FAMILY_NAME = value;
          if (map === 'email') contact.emails.push({ MAIL: value });
          if (map === 'phone_mobile') contact.phones.push({ NUMBER: value, TYPE: 'MOBILE' });
          if (map === 'phone_home') contact.phones.push({ NUMBER: value, TYPE: 'HOME' });
          if (map === 'phone_work') contact.phones.push({ NUMBER: value, TYPE: 'WORK' });
          if (map === 'organization') contact.organization.COMPANY = value;
          if (map === 'address') contact.postal_address.STREET = value;
          if (map === 'note') contact.note.NOTE = value;
        });
        return contact;
      });

      this.$emit('createMultipleContact', mappedContacts);
      this.cancel();
    },
    cancel() {
      this.$emit('closeModal', false);
      this.resetFields();
    },
    saveChanges(value) {
      this.isManualEntry = false;
      this.$emit('createContact', value);
      this.newContactData = null;
    },
    resetFields() {
      this.isManualEntry = false;
      this.newContactData = null;
      this.isImport = false;
      this.columnsDetected = [];
      this.columnMapping = [];
      this.contactsToUpload = [];
      this.uploadedFileName = '';
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    }
  }
};
</script>

<style scoped>
.modalCreateContact .modal-card {
  width: 100%;
}
.level_title {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 1em;
}
.diagBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1em;
  padding: 1em;
}
.import-section {
  text-align: center;
}
.mapping-section {
  margin-top: 20px;
  height: 200px;
  overflow-y: auto;
  padding: 1rem;
}
.mapping-fields select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: transparent;
  color: white;
}
.mapping-fields select option {
  background: var(--inner-section);
  color: white;
}
.action-buttons .button {
  margin: 0 10px;
}
</style>
