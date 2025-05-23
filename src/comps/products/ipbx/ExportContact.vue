<template>
  <div tabindex="-1" :class="active ? 'modal modalExportContact is-active' : 'modal modalExportContact'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 600px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Exporter les contacts</p>
          <button @click="cancel" class="delete"></button>
        </div>
        <section class="modal-card-body">
          <div class="container is-fluid supportDiag">
            <div class="level">
              <div class="level_title">Sélectionnez le format d'exportation</div>

              <button type="button" class="button diagBtn is-rounded has-icon" @click="exportContacts('google')">
                <span>Google</span>
              </button>

              <button type="button" class="button diagBtn is-rounded has-icon" @click="exportContacts('outlook')">
                <span>Outlook</span>
              </button>

              <button type="button" class="button diagBtn is-rounded has-icon" @click="exportContacts('vcard')">
                <span>vCard</span>
              </button>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot">
          <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">Annuler</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
    selectedItems: Array
  },
  methods: {
    exportContacts(format) {
      if (!this.selectedItems || this.selectedItems.length === 0) {
        alert("Aucun contact sélectionné pour l'exportation.");
        return;
      }
      
      switch (format) {
        case 'google':
          this.exportToGoogleCSV();
          break;
        case 'outlook':
          this.exportToOutlookCSV();
          break;
        case 'vcard':
          this.exportToVCard();
          break;
      }
      this.cancel();
    },
    exportToGoogleCSV() {
      const headers = [
        'First Name', 'Middle Name', 'Last Name', 'Phonetic First Name', 'Phonetic Middle Name', 'Phonetic Last Name',
        'Name Prefix', 'Name Suffix', 'Nickname', 'File As', 'Organization Name', 'Organization Title', 'Organization Department',
        'Birthday', 'Notes', 'Photo', 'Labels', 'E-mail 1 - Label', 'E-mail 1 - Value', 'E-mail 2 - Label', 'E-mail 2 - Value',
        'Phone 1 - Label', 'Phone 1 - Value'
      ];

      const rows = this.selectedItems.map(contact => {
        const emails = contact.emails || [];
        const phones = contact.phones || [];

        return [
          contact.name?.GIVEN_NAME || '',                         // First Name
          contact.name?.MIDDLE_NAME || '',                       // Middle Name
          contact.name?.FAMILY_NAME || '',                       // Last Name
          contact.name?.PHONETIC_GIVEN_NAME || '',               // Phonetic First Name
          contact.name?.PHONETIC_MIDDLE_NAME || '',              // Phonetic Middle Name
          contact.name?.PHONETIC_FAMILY_NAME || '',              // Phonetic Last Name
          contact.name?.PREFIX || '',                            // Name Prefix
          contact.name?.SUFFIX || '',                            // Name Suffix
          contact.nickname?.NAME || '',                          // Nickname
          '',                                                    // File As
          contact.organization?.COMPANY || '',                   // Organization Name
          contact.organization?.TITLE || '',                     // Organization Title
          contact.organization?.DEPARTMENT || '',                // Organization Department
          contact.additionalData?.birthday || '',                // Birthday
          contact.note?.NOTE || '',                              // Notes
          contact.photo?.PHOTO || '',                            // Photo URL
          '* myContacts',                                        // Labels
          emails[0]?.LABEL || '* Home',                          // E-mail 1 - Label
          emails[0]?.MAIL || '',                                 // E-mail 1 - Value
          emails[1]?.LABEL || 'Work',                            // E-mail 2 - Label
          emails[1]?.MAIL || '',                                 // E-mail 2 - Value
          phones[0]?.LABEL || 'Mobile',                          // Phone 1 - Label
          phones[0]?.NUMBER || ''                                // Phone 1 - Value
        ].map(this.escapeCSVField);
      });

      this.downloadCSV(headers, rows, 'contacts_google.csv');
    },
    exportToOutlookCSV() {
      const headers = [
        'First Name', 'Middle Name', 'Last Name', 'Title', 'Suffix', 'Web Page', 'Birthday', 'Anniversary', 'Notes',
        'E-mail Address', 'E-mail 2 Address', 'E-mail 3 Address', 'Primary Phone', 'Home Phone', 'Home Phone 2',
        'Mobile Phone', 'Pager', 'Home Fax', 'Home Address', 'Home Street', 'Home Street 2', 'Home Street 3',
        'Home Address PO Box', 'Home City', 'Home State', 'Home Postal Code', 'Home Country', 'Spouse', 'Children',
        "Manager's Name", "Assistant's Name", 'Referred By', 'Company Main Phone', 'Business Phone', 'Business Phone 2',
        'Business Fax', "Assistant's Phone", 'Company', 'Job Title', 'Department', 'Business Address', 'Business Street',
        'Business Street 2', 'Business Street 3', 'Business Address PO Box', 'Business City', 'Business State',
        'Business Postal Code', 'Business Country', 'Other Phone', 'Other Fax', 'Other Address', 'Other Street',
        'Other Street 2', 'Other Street 3', 'Other Address PO Box', 'Other City', 'Other State', 'Other Postal Code',
        'Other Country', 'Callback', 'Car Phone', 'ISDN', 'Radio Phone', 'TTY/TDD Phone', 'Telex', 'Categories'
      ];

      const rows = this.selectedItems.map(contact => {
        const emails = contact.emails || [];
        const phones = contact.phones || [];

        return [
          contact.name?.GIVEN_NAME || '',                         // First Name
          contact.name?.MIDDLE_NAME || '',                       // Middle Name
          contact.name?.FAMILY_NAME || '',                       // Last Name
          contact.name?.PREFIX || '',                            // Title
          contact.name?.SUFFIX || '',                            // Suffix
          '',                                                    // Web Page
          contact.additionalData?.birthday || '',                // Birthday
          '',                                                    // Anniversary
          contact.note?.NOTE || '',                              // Notes
          emails[0]?.MAIL || '',                                 // E-mail Address
          emails[1]?.MAIL || '',                                 // E-mail 2 Address
          emails[2]?.MAIL || '',                                 // E-mail 3 Address
          phones[0]?.NUMBER || '',                               // Primary Phone
          phones[1]?.NUMBER || '',                               // Home Phone
          phones[2]?.NUMBER || '',                               // Home Phone 2
          phones[3]?.NUMBER || '',                               // Mobile Phone
          '', '', '',                                            // Pager, Home Fax, Home Address
          '', '', '', '',                                        // Home Street, Home Street 2, Home Street 3, Home Address PO Box
          '', '', '', '', '', '',                                // Home City, Home State, Home Postal Code, Home Country, Spouse, Children
          '', '', '', '',                                        // Manager's Name, Assistant's Name, Referred By, Company Main Phone
          phones[4]?.NUMBER || '',                               // Business Phone
          phones[5]?.NUMBER || '',                               // Business Phone 2
          '',                                                    // Business Fax
          '',                                                    // Assistant's Phone
          contact.organization?.COMPANY || '',                   // Company
          contact.organization?.TITLE || '',                     // Job Title
          contact.organization?.DEPARTMENT || '',                // Department
          '', '', '', '',                                        // Business Address, Business Street, Business Street 2, Business Street 3
          '', '', '', '',                                        // Business Address PO Box, Business City, Business State, Business Postal Code, Business Country
          '', '', '', '',                                        // Other Phone, Other Fax, Other Address, Other Street
          '', '', '', '', '',                                    // Other Street 2, Other Street 3, Other Address PO Box, Other City, Other State
          '* myContacts'                                         // Categories
        ].map(this.escapeCSVField);
      });

      this.downloadCSV(headers, rows, 'contacts_outlook.csv');
    },
    exportToVCard() {
      const vCardContent = this.selectedItems.map(contact => {
        const givenName = contact.name?.GIVEN_NAME || '';
        const familyName = contact.name?.FAMILY_NAME || '';
        const fullName = `${givenName} ${familyName}`.trim();
        const emails = contact.emails || [];
        const phones = contact.phones || [];
        const birthday = contact.additionalData?.birthday ? contact.additionalData.birthday.replace(/-/g, '') : '';
        const categories = 'myContacts';
        const photoUrl = contact.photo?.PHOTO || '';

        const emailEntries = emails.map(email => `EMAIL;TYPE=INTERNET;TYPE=${email.LABEL || 'OTHER'}:${email.MAIL}`).join('\n');
        const phoneEntries = phones.map(phone => `TEL;TYPE=${phone.LABEL || 'OTHER'}:${phone.NUMBER}`).join('\n');

        return `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
N:${familyName};${givenName};;;
${emailEntries}
${phoneEntries}
${birthday ? `BDAY:${birthday}` : ''}
${photoUrl ? `PHOTO:${photoUrl}` : ''}
CATEGORIES:${categories}
END:VCARD`;
      }).join('\n');
      
      this.downloadFile(vCardContent, 'contacts.vcf', 'text/vcard;charset=utf-8;');
    },
    downloadCSV(headers, rows, filename) {
      const csvContent = [headers.map(this.escapeCSVField).join(','), ...rows.map(row => row.join(','))].join('\n');
      this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    },
    escapeCSVField(value) {
      if (typeof value === 'string') {
        // Escape double quotes by doubling them, and wrap the field in double quotes if it contains special characters
        const escapedValue = value.replace(/"/g, '""');
        return /[",\n]/.test(value) ? `"${escapedValue}"` : escapedValue;
      }
      return value;
    },
    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    cancel() {
      this.$emit('closeModal');
    }
  }
};
</script>

<style scoped>
.modalExportContact .modal-card {
  width: 100%;
}
</style>
