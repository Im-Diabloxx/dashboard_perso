<template>
  
          <div class="fieldset mb-5">
            <label>
              Mes annuaires
            </label>
            <div class="fieldset-content" style="padding-bottom: 1rem;">
              <div class="" style="float: right; padding-bottom: 1.5rem;">
                <div class="field mb-0" style="min-width: 300px">
                  <TagInput :modelValue="search_contacts" />
                </div>
              </div>

              <div v-if="selectedItems.length > 0" class="action-buttons">
                <button class="action-button export-button" @click="showExportContactModal = true">
                  <i class="material-symbols-outlined">file_upload</i>
                  <span>Exporter</span>
                </button>
                <button class="action-button delete-button" @click="deleteSelectedContacts">
                  <i class="material-symbols-outlined">delete</i>
                  <span>Supprimer</span>
                </button>
              </div>

            </div>

            <div v-if="filteredPhonebooks.length == 0" class="fieldset-content d-flex" style="width: 100%; place-content: center;">
              <div v-show="showLoading == true" class="box-content has-text-centered" style="height: 680px; align-content: center">
                <div class="loading-inline">
                  <div class="loading-icon"></div>
                  <div>Veuillez patienter svp..</div>
                  <br>
                </div>
              </div>
            </div>

            <div v-show="showLoading == false" v-if="filteredPhonebooks.length > 0" class="fieldset-content d-flex" style="width: 100%">
              <div class="phonebook-list" style="width: 35%" @click.stop>
                <div class="widget-phonebook">
                  <div class="ibox-content" style="height: 680px; overflow-y: auto; padding-top: 0; padding-left: 0; padding-bottom: 0">
                    <div class="dd" ref="nestableContainer">
                      <ol class="dd-list">
                        <li v-for="(phonebook, index) in filteredPhonebooks" style="margin-bottom: 1rem"
                            :key="index" 
                            class="dd-item" 
                            :data-id="phonebook.id" 
                            :class="{ 'dd-collapsed': phonebook.collapsed }">
                          
                          <div class="dd-handle align-center phonebook-header" 
                              @click="toggleCollapse(phonebook)" 
                              @mouseover="hoveredPhonebookId = phonebook.id" 
                              @mouseleave="hoveredPhonebookId = null">
                            
                            <input type="checkbox" 
                                  :checked="isPhonebookSelected(phonebook)"
                                  @click.stop="togglePhonebookSelection(phonebook)" />
                            
                            <span class="material-symbols-outlined collapse-icon" :class="{'expanded': !phonebook.collapsed}">
                              {{ phonebook.collapsed ? 'expand_more' : 'expand_less' }}
                            </span>
                            
                            <span class="material-symbols-outlined icon" style="margin: 0 1rem">menu_book</span>
                            
                            <span>{{ phonebook.name }}</span>
                            
                            <span class="contact-count" :class="{ 'icon-wrapper': true, 'visible': hoveredPhonebookId === phonebook.id }">
                              Total : {{ phonebook.contacts.length }}
                            </span>
                            
                            <span class="material-symbols-outlined add-icon" 
                                  :class="{ 'visible': hoveredPhonebookId === phonebook.id }" 
                                  @click.stop="showCreateContact(phonebook)">
                              add
                            </span>
                          </div>
                          
                          <ol class="dd-list" v-if="!phonebook.collapsed">
                            <li v-for="(contact, subIndex) in phonebook.contacts" 
                                :key="subIndex" 
                                class="dd-item" 
                                :data-id="`${phonebook.id}-${subIndex}`"
                                @click.stop="selectContact(contact)"
                                @mouseover="hoveredContactId = contact.id"
                                @mouseleave="hoveredContactId = null">
                              
                              <div class="dd-handle contact-item" :class="{ 'selected-contact': selectedContact && selectedContact.id_contact === contact.id_contact }">
                                <div class="contact-info-wrapper">
                                  <input type="checkbox" :value="contact" v-model="selectedItems" />
                                  
                                  <div class="avatar">
                                    <img v-if="contact.photo && contact.photo.PHOTO" :src="contact.photo.PHOTO" alt="Avatar" />
                                    <div v-else class="avatar initials" :style="{ backgroundColor: contact.color }">
                                      {{ getInitials(contact.name) }}
                                    </div>
                                  </div>
                                  
                                  <div class="contact-info">
                                    <span class="contact-name">{{ formatContactName(contact) }}</span>
                                    <span class="contact-email">{{ getEmail(contact) }}</span>
                                  </div>
                                </div>

                                <div class="action-icons">
                                  <span class="material-symbols-outlined edit-icon" 
                                        :class="{ 'visible': hoveredContactId === contact.id }" 
                                        @click.stop="editContact(contact)">
                                    edit
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ol>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>


              <div v-if="filteredPhonebooks.length > 0" class="fieldset-content d-flex" style="width: 65%; padding-left: 20px;">
                <div class="view-contact-panel" style="height: 680px; overflow-y: auto; width: 100%; background: var(--section); border-radius: 10px;">
                  <transition
                    name="fade"
                    @after-leave="showAddContactButton = true"
                  >
                    <div v-show="selectedContact">
                      <component :is="editMode ? 'EditContact' : 'ViewContact'" 
                        :contact="selectedContact" 
                        :editMode="editMode"
                        :phonebooks="myPhoneBooks"
                        :active="true" 
                        @editContact="toggleEditMode"
                        @saveChanges="saveChanges"
                        @cancelEdit="toggleEditMode"
                        @closeModal="closeViewContactModal" />
                    </div>
                  </transition>

                    <div v-show="showAddContactButton" class="add-contact" style="text-align: center">
                      <div class="has-text-centered" style="opacity: 0.4; padding: 30px; margin-top: 20%; margin-right: 2rem;" @click="showCreateContactModal = true">
                        <i class="material-symbols-outlined size-giga">add</i>
                      </div>
                    </div>

                </div>
              </div>




      <CreateContact :phonebooks="myPhoneBooks" :defaultPhonebookId="defaultPhonebookId" :active="showCreateContactModal" @closeModal="closeCreateContactModal" @createContact="createContact" @createMultipleContact="createMultipleContact"/>
      <ExportContact :selectedItems="selectedItems" :active="showExportContactModal" @closeModal="showExportContactModal = false" @export="exportSelected"/>
      <CheckAction
        :emitter="'deleteConfirmation'"
        :emitterStatus="'deleteStatus'"
        @deleteStatus="deleteSelectedContacts"
        @deleteConfirmation="closeCheckActionModal"
        :active="showCheckActionModal"
        title="Confirmer la suppression"
      />

    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import CreateContact from './CreateContact.vue';
import ExportContact from './ExportContact.vue';
import ViewContact from './ViewContact.vue';
import EditContact from './EditContact.vue';
import TagInput from '../../modal/TagInput.vue';
import CheckAction from '../../modal/CheckAction.vue';

export default {
  name: 'ProductsIpbxPhonebook',
  props: {
    tab: Boolean
  },
  components: {
    CreateContact,
    ViewContact,
    EditContact,
    ExportContact,
    TagInput,
    CheckAction
  },
  data() {
    return {
      showLoading: true,
      editMode: false,
      defaultPhonebookId: null,
      showCheckActionModal: false,
      hoveredContactId: null,
      hoveredPhonebookId: null,
      phonebooks: [],
      selectedItems: [],
      columnsDetected: [],
      columnMapping: [],
      contactsToUpload: [],
      selectedPhonebookId: "",
      newPhonebookName: "",
      uploadedFileName: "",
      showCreateContactModal: false,
      showExportContactModal: false,
      showViewContactModal: false,
      selectedContact: null,
      search_contacts: [],
      avatarColors: {},
      addButtonTimeout: null,
      showEditContactModal: false,
      showAddContactButton: true,
      itemToDelete: null,
      itemTypeToDelete: '',
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    myPhoneBooks() {
      return this.phonebooks
    },
    filteredPhonebooks() {
      if (this.search_contacts.length === 0) return this.phonebooks;

      const matchesSearch = (field) => {
        return this.search_contacts.some(term => field?.toLowerCase().includes(term.toLowerCase()));
      };

      return this.phonebooks
        .map(phonebook => {
          const filteredContacts = phonebook.contacts.filter(contact => {
            const fullName = `${contact.name?.GIVEN_NAME || ''} ${contact.name?.FAMILY_NAME || ''}`.trim();
            
            return (
              matchesSearch(fullName) ||
              matchesSearch(this.getEmail(contact))
            );
          });

          const phonebookMatches = matchesSearch(phonebook.name);

          if (phonebookMatches || filteredContacts.length > 0) {
            return {
              ...phonebook,
              contacts: filteredContacts
            };
          }
          return null;
        })
        .filter(phonebook => phonebook);
    }
  },
  async mounted() {
    await this.fetchPhoneBooksAndContacts()
  },
  methods: {
    toggleSelectContact(contact) {
      this.editMode = false;
      if (this.selectedContact && this.selectedContact.id_contact === contact.id_contact) {
        this.selectedContact = null;
        this.showAddContactButton = true;
      } else {
        this.selectedContact = contact;
        this.showAddContactButton = false;
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    saveChanges(contact) {
      this.updateContact(contact);
      this.toggleEditMode();
    },
    closeViewContactModal() {
      this.selectedContact = null;
      this.editMode = false;
    },
    showCreateContact(value) {
      this.defaultPhonebookId = parseInt(value.id)
      this.showCreateContactModal = true
    },
    closeCreateContactModal() {
      this.defaultPhonebookId = null
      this.showCreateContactModal = false
    },
    closeCheckActionModal() {
      this.showCheckActionModal = false;
      this.itemToDelete = null;
      this.itemTypeToDelete = '';
    },
    confirmDeletion(item, type) {
      this.itemToDelete = item;
      this.itemTypeToDelete = type;
      this.showCheckActionModal = true;
    },
    deletePhonebook(phonebook) {
      this.confirmDeletion(phonebook, 'phonebook');
    },
    /*deleteContact(contact, phonebook) {
      this.confirmDeletion(contact, 'contact');
    },*/
    selectContact(contact) {
      this.showAddContactButton = false;
      this.editMode = false;
      this.selectedContact = contact;
    },
    handleClickOutside(event) {
      const phonebookList = this.$refs.nestableContainer;
      if (phonebookList && !phonebookList.contains(event.target)) {
        this.selectedContact = null;
      }
    },
    editContact(contact) {
      this.selectContact(contact)
      this.editMode = true
    },
    closeEditContactModal() {
      this.showEditContactModal = false;
    },
    setSelectedContact(contact) {
      this.selectedContact = contact;
    },
    getRandomColor() {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    },
    async deleteSelectedContacts() {
      const sessionId = this.user.session_id;
      const cn = this.$store.getters.getCn;

      const contactIds = this.selectedItems.map(contact => contact.id_contact);

      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/v2/ipbx/contact/remove?session_id=${sessionId}&cn=${cn}`,
          { cn: cn, contact_ids: contactIds },
          {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true
          }
        );

        if (response.status === 200) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Suppression de contacts',
            msg: 'Vos contacts ont bien été supprimés de votre annuaire',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });

          this.selectedItems = [];
          await this.fetchPhoneBooksAndContacts();
        } else {
          throw new Error(`API error: status ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression multiple des contacts:", error);
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Échec de la suppression',
          msg: "Les contacts n’ont pas pu être supprimés. Vérifiez l’API IPBX.",
          clickClose: true,
          timeout: 5000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'shakeX'],
          style: { 'margin-top': '20%' }
        });
      }
    },
    
    async fetchPhoneBooksAndContacts() {
      this.showLoading = true
      const sessionId = this.user.session_id;
      const cn = this.$store.getters.getCn;

      try {
        const phoneBookResponse = await this.$axios.get(`${process.env.ODOO_API}api/v2/ipbx/phonebook/list?session_id=${sessionId}&cn=${cn}`);
        if (phoneBookResponse.status !== 200) throw new Error("Erreur lors de la récupération des phonebooks");

        const phoneBooks = phoneBookResponse.data.phonebooks || [];

        const phoneBookMap = {};
        phoneBooks.forEach(phoneBook => {
          phoneBookMap[phoneBook.id] = {
            id: phoneBook.id,
            name: phoneBook.name,
            collapsed: false,
            contacts: []
          };
        });

        const contactResponse = await this.$axios.get(`${process.env.ODOO_API}api/v2/ipbx/contact/list?session_id=${sessionId}&cn=${cn}`);
        if (contactResponse.status !== 200) throw new Error("Erreur lors de la récupération des contacts");

        const contacts = contactResponse.data.data || [];
        this.organizeContactsByPhoneBook(contacts, phoneBookMap);
        this.showLoading = false
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    },

    organizeContactsByPhoneBook(contacts, phoneBookMap) {
      contacts.forEach(contact => {
        const phoneBookId = contact.id_phone_book;
        const phoneBookName = contact.phone_book_name || phoneBookMap[phoneBookId]?.name || "Unknown";

        const contactData = {
          id_contact: contact.id_contact || '',
          phonebook: phoneBookId,
          name: {
            GIVEN_NAME: contact.firstname || '',
            FAMILY_NAME: contact.lastname || '',
            PREFIX: contact.name?.prefix || '',
            MIDDLE_NAME: contact.name?.middle_name || '',
            SUFFIX: contact.name?.suffix || '',
            PHONETIC_GIVEN_NAME: contact.name?.phonetic_given_name || '',
            PHONETIC_FAMILY_NAME: contact.name?.phonetic_family_name || ''
          },
          nickname: { NAME: contact.nickname || '' },
          organization: {
            COMPANY: contact.company?.name || '',
            TITLE: contact.company?.title || '',
            DEPARTMENT: contact.company?.department || '',
            JOB_DESCRIPTION: contact.company?.job_description || '',
            SYMBOL: contact.company?.symbol || '',
            PHONETIC_NAME: contact.company?.phonetic_name || '',
            OFFICE_LOCATION: contact.company?.office_location || ''
          },
          postal_address: {
            STREET: contact.postal_address?.street || '',
            POBOX: contact.postal_address?.pobox || '',
            NEIGHBORHOOD: contact.postal_address?.neighborhood || '',
            CITY: contact.postal_address?.city || '',
            REGION: contact.postal_address?.region || '',
            POSTCODE: contact.postal_address?.postcode || '',
            COUNTRY: contact.postal_address?.country || ''
          },
          phones: contact.phones?.map(phone => ({
            NUMBER: phone.number || '',
            TYPE: phone.type || '',
            LABEL: phone.label || '',
            DEFAULT: phone.default || false
          })) || [],
          emails: contact.mails?.map(mail => ({
            MAIL: mail.mail || '',
            TYPE: mail.type || '',
            LABEL: mail.label || ''
          })) || [],
          websites: contact.websites?.map(site => ({
            URL: site.url || '',
            TYPE: site.type || '',
            LABEL: site.label || ''
          })) || [],
          ims: contact.ims?.map(im => ({
            ADDRESS: im.address || '',
            TYPE: im.type || '',
            LABEL: im.label || '',
            PROTOCOL: im.protocol || '',
            PROTOCOL_CUSTOM: im.protocol_custom || ''
          })) || [],
          note: { NOTE: contact.note || '' },
          photo: { PHOTO: contact.picture || null, PHOTO_FILE_ID: contact.photo_file_id || null },
          additionalData: {
            id_user: contact.id_user || null,
            internal: contact.internal || false
          },
          color: contact.color || this.getRandomColor(),
          phone_book_name: phoneBookName
        };

        if (!phoneBookMap[phoneBookId]) {
          phoneBookMap[phoneBookId] = {
            id: phoneBookId,
            name: phoneBookName,
            collapsed: false,
            contacts: []
          };
        }
        phoneBookMap[phoneBookId].contacts.push(contactData);
      });

      this.phonebooks = Object.values(phoneBookMap);
    },
    viewContact(contact) {
      this.selectedContact = { ...contact };
      this.showViewContactModal = true;
    },
    /*
    closeViewContactModal() {
      this.showViewContactModal = false;
      this.selectedContact = null;
    },
    */
    convertContactToSend(contact) {
      contact = {
        id_contact: contact.id_contact,
        cn: contact.cn,
        phonebook: contact.phonebook || null,
        name: {
          GIVEN_NAME: contact.name?.GIVEN_NAME || "",
          FAMILY_NAME: contact.name?.FAMILY_NAME || "",
          PREFIX: contact.name?.PREFIX || "",
          MIDDLE_NAME: contact.name?.MIDDLE_NAME || "",
          SUFFIX: contact.name?.SUFFIX || "",
          PHONETIC_GIVEN_NAME: contact.name?.PHONETIC_GIVEN_NAME || "",
          PHONETIC_FAMILY_NAME: contact.name?.PHONETIC_FAMILY_NAME || ""
        },
        nickname: {
          NAME: contact.nickname?.NAME || ""
        },
        organization: {
          COMPANY: contact.organization?.COMPANY || "",
          TITLE: contact.organization?.TITLE || "",
          DEPARTMENT: contact.organization?.DEPARTMENT || "",
          JOB_DESCRIPTION: contact.organization?.JOB_DESCRIPTION || "",
          SYMBOL: contact.organization?.SYMBOL || "",
          PHONETIC_NAME: contact.organization?.PHONETIC_NAME || "",
          OFFICE_LOCATION: contact.organization?.OFFICE_LOCATION || ""
        },
        postal_address: {
          STREET: contact.postal_address?.STREET || "",
          POBOX: contact.postal_address?.POBOX || "",
          NEIGHBORHOOD: contact.postal_address?.NEIGHBORHOOD || "",
          CITY: contact.postal_address?.CITY || "",
          REGION: contact.postal_address?.REGION || "",
          POSTCODE: contact.postal_address?.POSTCODE || "",
          COUNTRY: contact.postal_address?.COUNTRY || ""
        },
        im: contact.ims?.map(im => ({
          ADDRESS: im.ADDRESS || '',
          TYPE: im.TYPE || '',
          LABEL: im.LABEL || '',
          PROTOCOL: im.PROTOCOL || '',
          PROTOCOL_CUSTOM: im.PROTOCOL_CUSTOM || ''
        })) || [],
        phones: contact.phones?.map(phone => ({
          NUMBER: phone.NUMBER || '',
          TYPE: phone.TYPE || '',
          LABEL: phone.LABEL || '',
          DEFAULT: phone.DEFAULT || false
        })) || [],
        email: contact.emails?.map(mail => ({
          MAIL: mail.MAIL || '',
          TYPE: mail.TYPE || '',
          LABEL: mail.LABEL || ''
        })) || [],
        websites: contact.websites?.map(site => ({
          URL: site.URL || '',
          TYPE: site.TYPE || '',
          LABEL: site.LABEL || ''
        })) || [],
        note: {
          NOTE: contact.note?.NOTE || ""
        },
        photo: {
          PHOTO: contact.photo?.PHOTO || null,
          PHOTO_FILE_ID: contact.photo?.PHOTO_FILE_ID || null
        }
      };
      let result = {
          "cn": contact.cn,
          "phonebook": contact.phonebook,
          "name": {
            "GIVEN_NAME": contact.name.GIVEN_NAME,
            "FAMILY_NAME": contact.name.FAMILY_NAME,
            "PREFIX": contact.name.PREFIX,
            "MIDDLE_NAME": contact.name.MIDDLE_NAME,
            "SUFFIX": contact.name.SUFFIX,
            "PHONETIC_GIVEN_NAME": contact.name.PHONETIC_GIVEN_NAME,
            "PHONETIC_FAMILY_NAME": contact.name.PHONETIC_FAMILY_NAME
          },
          "nickname": {
            "NAME": contact.nickname.NAME
          },
          "organization": {
            "COMPANY": contact.organization.COMPANY,
            "TITLE": contact.organization.TITLE,
            "DEPARTMENT": contact.organization.DEPARTMENT,
            "JOB_DESCRIPTION": contact.organization.JOB_DESCRIPTION,
            "SYMBOL": contact.organization.SYMBOL,
            "PHONETIC_NAME": contact.organization.PHONETIC_NAME,
            "OFFICE_LOCATION": contact.organization.OFFICE_LOCATION,
          },
          "postal_address": {
            "STREET": contact.postal_address.STREET,
            "POBOX": contact.postal_address.POBOX,
            "NEIGHBORHOOD": contact.postal_address.NEIGHBORHOOD,
            "CITY": contact.postal_address.CITY,
            "REGION": contact.postal_address.REGION,
            "POSTCODE": contact.postal_address.POSTCODE,
            "COUNTRY": contact.postal_address.COUNTRY
          },
          "im": contact.im && contact.im.filter(im => im.ADDRESS && im.ADDRESS.length > 0).length > 0 
            ? contact.im
                .filter(im => im.ADDRESS && im.ADDRESS.length > 0)
                .map(im => ({ "ADDRESS": im.ADDRESS, "TYPE": im.TYPE }))
            : [],

          "phones": contact.phones && contact.phones.filter(phone => phone.NUMBER && phone.NUMBER.length > 0).length > 0 
            ? contact.phones
                .filter(phone => phone.NUMBER && phone.NUMBER.length > 0)
                .map(phone => ({ "NUMBER": phone.NUMBER, "TYPE": phone.TYPE }))
            : [],

          "email": contact.email && contact.email.filter(mail => mail.MAIL && mail.MAIL.length > 0).length > 0 
            ? contact.email
                .filter(mail => mail.MAIL && mail.MAIL.length > 0)
                .map(mail => ({ "ADDRESS": mail.MAIL, "TYPE": mail.TYPE }))
            : [],

          "websites": contact.websites && contact.websites.filter(website => website.URL && website.URL.length > 0).length > 0 
            ? contact.websites
                .filter(website => website.URL && website.URL.length > 0)
                .map(website => ({ "URL": website.URL, "TYPE": website.TYPE }))
            : [],
          "note": {
            "NOTE": contact.note.NOTE
          },
          "photo": {
            "PHOTO": contact.photo.PHOTO,
            "PHOTO_FILE_ID": contact.photo.PHOTO_FILE_ID
          }
      };

      if (contact.id_contact) {
          result.id_contact = Number(contact.id_contact);
      }
      return result;
    },
    async createContact(contact) {
      const sessionId = this.user.session_id;
      const cn = this.$store.getters.getCn;
      contact.cn = cn;

      const contactDataArray = {
        cn: cn,
        contacts: [this.convertContactToSend(contact)]
      };

      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/v2/ipbx/contact/add?session_id=${sessionId}&cn=${cn}`,
          contactDataArray,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            validateStatus: () => true // on gère manuellement tous les statuts
          }
        );

        if (response.status === 201 || response.status === 200) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Ajout de contact',
            msg: 'Votre contact a bien été ajouté à votre annuaire',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
          await this.fetchPhoneBooksAndContacts();
        } else {
          throw new Error(`API error: status ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du contact :", error);
        this.$toastr.Add({
          name: 'ErrorData',
          title: "Échec de l'ajout",
          msg: `Le contact n’a pas été ajouté. Vérifiez que l’API Ipbx est bien à jour ou fonctionne correctement.`,
          clickClose: true,
          timeout: 5000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'shakeX'],
          style: { 'margin-top': '20%' }
        });
      }
    },
    async createMultipleContact(contacts) {
      const sessionId = this.user.session_id;
      const cn = this.$store.getters.getCn;

      const contactDataArray = {
        cn: cn,
        contacts: contacts.map(contact => this.convertContactToSend(contact))
      };

      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/v2/ipbx/contact/add?session_id=${sessionId}&cn=${cn}`,
          contactDataArray,
          {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true
          }
        );

        if (response.status === 201 || response.status === 200) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Ajout de contacts',
            msg: 'Vos contacts ont bien été ajoutés à votre annuaire',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
          await this.fetchPhoneBooksAndContacts();
        } else {
          throw new Error(`API error: status ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout multiple :", error);
        this.$toastr.Add({
          name: 'ErrorData',
          title: "Échec de l’ajout",
          msg: "Les contacts n’ont pas été ajoutés. Vérifiez l’état de l’API IPBX.",
          clickClose: true,
          timeout: 5000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'shakeX'],
          style: { 'margin-top': '20%' }
        });
      }
    },
    async updateContact(contact) {
      const sessionId = this.user.session_id;
      const cn = this.$store.getters.getCn;
      contact.cn = cn;
      const contactData = this.convertContactToSend(contact);

      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/v2/ipbx/contact/edit?session_id=${sessionId}&cn=${cn}`,
          contactData,
          {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true
          }
        );

        if (response.status === 200) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Modification de contact',
            msg: 'Votre contact a bien été modifié',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
          await this.fetchPhoneBooksAndContacts();
        } else {
          throw new Error(`API error: status ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de la modification du contact :", error);
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Échec de la modification',
          msg: "Le contact n’a pas pu être modifié. Vérifiez l’état de l’API IPBX.",
          clickClose: true,
          timeout: 5000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'shakeX'],
          style: { 'margin-top': '20%' }
        });
      }
    },
    getInitials(name) {
      if (!name) return '';
      const { GIVEN_NAME, FAMILY_NAME } = name;
      return `${GIVEN_NAME?.[0] || ''}${FAMILY_NAME?.[0] || ''}`.toUpperCase();
    },

    getEmail(contact) {
      if (contact.emails && contact.emails.length > 0) {
        return contact.emails[0].MAIL || '';
      }
      return '';
    },

    formatContactName(contact) {
      const internalPhone = contact.phones?.find(phone => phone.type === "INTERNAL_NUMBER" && phone.number !== "NULL");
      const formattedName = internalPhone
        ? `${contact.name.GIVEN_NAME} ${contact.name.FAMILY_NAME} (${internalPhone.number})`
        : `${contact.name.GIVEN_NAME} ${contact.name.FAMILY_NAME}`;
      
      return formattedName;
    },
    goToProducts() {
      this.$router.push('/products');
    },
    isPhonebookSelected(phonebook) {
      return phonebook.contacts.length > 0 && phonebook.contacts.every(contact => this.selectedItems.includes(contact));
    },
    togglePhonebookSelection(phonebook) {
      if (this.isPhonebookSelected(phonebook)) {
        this.selectedItems = this.selectedItems.filter(contact => !phonebook.contacts.includes(contact));
      } else {
        this.selectedItems.push(...phonebook.contacts.filter(contact => !this.selectedItems.includes(contact)));
      }
    },
    deleteContact(contact, phonebook) {
      phonebook.contacts = phonebook.contacts.filter(c => c.id !== contact.id);
      this.selectedItems = this.selectedItems.filter(c => c.id !== contact.id);
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadedFileName = file ? file.name : "";
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        this.columnsDetected = sheetData[0];
        this.columnMapping = Array(this.columnsDetected.length).fill("");
        this.contactsToUpload = sheetData.slice(1);
      };
      reader.readAsArrayBuffer(file);
    },
    clearFileSelection() {
      this.uploadedFileName = "";
      this.$refs.fileInput.value = "";
      this.columnsDetected = [];
      this.columnMapping = [];
      this.contactsToUpload = [];
    },
    submitContacts() {
      const mappedContacts = this.contactsToUpload.map(row => {
        const contact = {};
        this.columnMapping.forEach((map, index) => {
          if (map) contact[map] = row[index];
        });
        return contact;
      });

      if (this.selectedPhonebookId) {
        const phonebook = this.phonebooks.find(pb => pb.id === this.selectedPhonebookId);
        if (phonebook) {
          phonebook.contacts.push(...mappedContacts);
        }
      } else {
        this.phonebooks.push({
          id: this.phonebooks.length + 1,
          name: this.newPhonebookName,
          collapsed: false,
          contacts: mappedContacts
        });
        this.newPhonebookName = '';
      }
    },
    toggleCollapse(item) {
      item.collapsed = !item.collapsed;
    },
    exportSelected(format) {
      const selectedContacts = this.selectedItems.filter(item => this.getEmail(item));
      const header = format === 'google' ? ['Name', 'Email'] : ['Full Name', 'E-mail Address'];
      const rows = selectedContacts.map(contact => [contact.name, this.getEmail(contact)]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `contacts_${format}.csv`);
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 10px;
  min-width: 220px;
  justify-content: flex-end;
  padding-right: 10px;
}
.action-button {
  display: flex;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 14px;
  transition: background-color 0.2s;
}
.action-button i {
  margin-right: 5px;
}
.export-button {
  background-color: #3498db;
}
.export-button:hover {
  background-color: #2980b9;
}
.delete-button {
  background-color: #f44336;
}
.delete-button:hover {
  background-color: #d32f2f;
}
.ibox-content {
  background: transparent;
  border-color: transparent;
}

.ibox-title, .ibox-footer {
  background: transparent;
  border-color: transparent;
}

.dd-handle {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin: 5px;
  color: white;
  cursor: pointer;
  justify-content: space-between;
  background: var(--inner-section) !important;
  border: 1px solid var(--inner-section);
}

.dd-handle:hover {
  background: var(--inner-section);
}

.contact-item {
  border: 1px solid grey;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contact-info-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: bold;
}

.contact-email {
  color: #777;
  font-size: 0.85em;
}

.action-icons {
  display: flex;
  gap: 8px;
}

.view-icon, .delete-icon {
  cursor: pointer;
  font-size: 24px;
}

.contact-count {
  margin-left: auto;
  font-size: 0.85em;
  color: #bbb;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.icon-wrapper {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.icon-wrapper.visible {
  opacity: 1;
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid white;
  background-color: transparent;
  cursor: pointer;
  position: relative;
}

input[type="checkbox"]:checked::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.dd-list .dd-list {
    margin-left: 0px;
    border: 1px solid var(--inner-section-dark);
    border-top: none;
    border-radius: 10px 10px 10px 10px;
}

.dd-item {
    border: 1px solid var(--inner-section-dark);
    border-radius: 10px;
    background: var(--inner-section) !important;
}

.glow-icon {
  animation: glow 1s ease-in-out infinite alternate;
}

.selected-contact {
  border: 1px solid white;
  animation: glow 1s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}
</style>
