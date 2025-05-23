<template>
  <div class="view-contact-container" v-if="contactData" style="width: 100%">
    <section class="view-contact-body" style="padding: 1rem;">
      <div class="avatar-container" @click="triggerPhotoUpload">
        <img v-if="contactData.photo && contactData.photo.PHOTO" 
             :src="contactData.photo.PHOTO" 
             alt="Avatar" 
             class="large-avatar" />
        <div v-else class="large-avatar initials" 
             :style="{ backgroundColor: contactData.color }">
          {{ getInitials(contactData.name) }}
        </div>
        <input type="file" ref="photoInput" @change="updatePhoto" style="display: none;" />
      </div>

      <div class="badge-container" style="text-align: center">
        <span class="badge badge-info">{{ contactData.phone_book_name || 'Annuaire Inconnu' }}</span>
      </div>

      <div class="field">
        <label class="label">
          <span class="material-symbols-outlined">badge</span>
          <span class="span-container">Prénom</span>
        </label>
        <input v-model="contactData.name.GIVEN_NAME" class="input-field" placeholder="Prénom" />
      </div>

      <div class="field">
        <label class="label">
          <span class="material-symbols-outlined">person</span>
          <span class="span-container">Nom</span>
        </label>
        <input v-model="contactData.name.FAMILY_NAME" class="input-field" placeholder="Nom" />
      </div>

      <div class="field">
        <label class="label">
          <span class="material-symbols-outlined">email</span>
          <span class="span-container">Email</span>
        </label>
        <div v-for="(email, index) in contactData.emails" :key="'email-' + index" class="email-field">
          <input v-model="email.MAIL" class="input-field" placeholder="Email" @click.stop />
          <select v-model="email.TYPE" @click.stop class="type-select">
            <option v-for="type in TYPES" :key="type.value" :value="type.value">{{ type.name }}</option>
          </select>
          <span class="material-symbols-outlined delete-icon" @click="removeEmail(index)">delete</span>
        </div>
        <button @click="addEmail" class="add-button">Ajouter un email</button>
      </div>

      <div class="field">
        <label class="label">
          <span class="material-symbols-outlined">phone</span>
          <span class="span-container">Téléphone</span>
        </label>
        <div v-for="(phone, index) in contactData.phones" :key="'phone-' + index" class="phone-field">
          <input v-model="phone.NUMBER" class="input-field" placeholder="Téléphone" @click.stop />
          <select v-model="phone.TYPE" @click.stop class="type-select">
            <option v-for="type in PHONE_TYPES" :key="type.value" :value="type.value">{{ type.name }}</option>
          </select>
          <span class="material-symbols-outlined delete-icon" @click="removePhone(index)">delete</span>
        </div>
        <button @click="addPhone" class="add-button">Ajouter un téléphone</button>
      </div>

      <button @click="saveContact" class="save-button">Enregistrer les modifications</button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ViewContact',
  props: {
    contact: Object,
    isCreate: Boolean
  },
  data() {
    return {
      contactData: { ...this.contact },
      PHONE_TYPES: [
        { name: 'Standard', value: "TYPE_COMPANY_MAIN" },
        { name: 'Bureau', value: "TYPE_WORK" },
        { name: 'Mobile Bureau', value: "TYPE_WORK_MOBILE" },
        { name: 'Domicile', value: "TYPE_HOME" },
        { name: 'Mobile', value: "TYPE_MOBILE" },
        { name: 'Abrégé', value: "TYPE_ABBREVIATED" },
      ],
      TYPES: [
        { name: 'Aucun libellé', value: "TYPE_NONE" },
        { name: 'Domicile', value: "TYPE_HOME" },
        { name: 'Bureau', value: "TYPE_OFFICE" },
        { name: 'Autre', value: "TYPE_OTHER" },
      ],
    };
  },
  mounted() {
  },
  methods: {
    getInitials(name) {
      if (!name) return '';
      const { GIVEN_NAME, FAMILY_NAME } = name || {};
      return `${GIVEN_NAME?.[0] || ''}${FAMILY_NAME?.[0] || ''}`.toUpperCase();
    },
    triggerPhotoUpload() {
      this.$refs.photoInput.click();
    },
    updatePhoto(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.contactData.photo = { PHOTO: e.target.result };
        };
        reader.readAsDataURL(file);
      }
    },
    addEmail() {
      this.contactData.emails.push({ MAIL: '', TYPE: 'TYPE_NONE' });
    },
    removeEmail(index) {
      this.contactData.emails.splice(index, 1);
    },
    addPhone() {
      this.contactData.phones.push({ NUMBER: '', TYPE: 'TYPE_NONE' });
    },
    removePhone(index) {
      this.contactData.phones.splice(index, 1);
    },
    saveContact() {
      if (this.isCreate) {
        this.$emit('createContact', this.contactData);
      } else {
        this.$emit('saveChanges', this.contactData);
      }
    }
  },
  watch: {
    contact(newContact) {
      this.contactData = { ...newContact };
    }
  }
};
</script>

<style scoped>
.field {
  margin-bottom: 0.5rem !important;
}
.view-contact-container {
  max-width: 640px;
  margin: auto;
}
.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
}
.large-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}
.initials {
  font-size: 2.5rem;
  color: white;
}
.input-field, .type-select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: transparent;
  color: white;
  height: 40px;
}
.email-field, .phone-field {
  display: flex;
  gap: 10px;
  align-items: center;
}
.label {
  padding: 0px;
  margin-bottom: 0px !important;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: white;
}
.span-container {
  margin-left: 0.5rem;
}
.delete-icon {
  cursor: pointer;
  color: #e74c3c;
  font-size: 24px;
}
.add-button, .save-button {
  padding: 6px 12px;
  margin: 5px 0;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
.add-button {
  background-color: #3498db;
  color: white;
}
.save-button {
  background-color: #2ecc71;
  color: white;
  width: 100%;
  padding: 10px;
  margin-top: 15px;
}
select option {
  background: var(--inner-section) !important;
  color: white;
}
</style>
