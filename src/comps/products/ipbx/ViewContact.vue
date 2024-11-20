<template>
  <div class="view-contact-container" v-if="contactData">
    <section class="view-contact-body">
      <div class="avatar-container">
        <img v-if="contactData.photo && contactData.photo.PHOTO" 
             :src="contactData.photo.PHOTO" 
             alt="Avatar" 
             class="large-avatar" />
        <div v-else class="large-avatar initials" 
             :style="{ backgroundColor: contactData.color }">
          {{ getInitials(contactData.name) }}
        </div>
      </div>

      <div class="badge-container" style="text-align: center">
        <span class="badge badge-info">{{ contactData.phone_book_name || 'Annuaire Inconnu' }}</span>
      </div>

      <!-- Contact Details in View Mode -->
      <div class="field" v-if="contactData.name && contactData.name.GIVEN_NAME">
        <label class="label">
          <span class="material-symbols-outlined">badge</span>
          <span class="span-container">Prénom</span>
        </label>
        <div class="contact-field" @click="copyToClipboard(contactData.name.GIVEN_NAME)">
          {{ contactData.name.GIVEN_NAME }}
        </div>
      </div>

      <div class="field" v-if="contactData.name && contactData.name.FAMILY_NAME">
        <label class="label">
          <span class="material-symbols-outlined">person</span>
          <span class="span-container">Nom</span>
        </label>
        <div class="contact-field" @click="copyToClipboard(contactData.name.FAMILY_NAME)">
          {{ contactData.name.FAMILY_NAME }}
        </div>
      </div>

      <!-- Emails -->
      <div class="field" v-if="contactData.emails && contactData.emails.length > 0">
        <label class="label">
          <span class="material-symbols-outlined">email</span>
          <span class="span-container">Email</span>
        </label>
        <div v-for="(email, index) in contactData.emails" :key="'email-' + index" class="contact-field" @click="copyToClipboard(email.MAIL)">
          <span>{{ email.MAIL }}</span>
        </div>
      </div>

      <!-- Phones -->
      <div class="field" v-if="contactData.phones && contactData.phones.length > 0">
        <label class="label">
          <span class="material-symbols-outlined">phone</span>
          <span class="span-container">Téléphone</span>
        </label>
        <div v-for="(phone, index) in contactData.phones" :key="'phone-' + index" class="contact-field" @click="copyToClipboard(phone.NUMBER)">
          <span>{{ phone.NUMBER || 'Non renseigné' }}</span>
          <span class="material-symbols-outlined phone-type">{{ getPhoneIcon(phone.TYPE) }}</span>
        </div>
      </div>

      <!-- Instant Messaging -->
      <div class="field" v-if="contactData.ims && contactData.ims.length > 0">
        <label class="label">
          <span class="material-symbols-outlined">chat</span>
          <span class="span-container">Messagerie Instantanée</span>
        </label>
        <div v-for="(im, index) in contactData.ims" :key="'im-' + index" class="contact-field" @click="copyToClipboard(im.ADDRESS)">
          <span>{{ im.ADDRESS || 'Non renseigné' }}</span>
          <span class="material-symbols-outlined phone-type">{{ getIMIcon(im.TYPE) }}</span>
        </div>
      </div>

      <!-- Websites -->
      <div class="field" v-if="contactData.websites && contactData.websites.length > 0">
        <label class="label">
          <span class="material-symbols-outlined">language</span>
          <span class="span-container">Site Web</span>
        </label>
        <div v-for="(website, index) in contactData.websites" :key="'website-' + index" class="contact-field" @click="copyToClipboard(website.URL)">
          <span>{{ website.URL || 'Non renseigné' }}</span>
          <span class="material-symbols-outlined phone-type">{{ getWebsiteIcon(website.TYPE) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ViewContact',
  props: {
    contact: Object
  },
  data() {
    return {
      contactData: { ...this.contact }
    };
  },
  mounted () {
    console.log('Contact Data:', this.contactData);
  },
  methods: {
    getInitials(name) {
      if (!name) return '';
      const { GIVEN_NAME, FAMILY_NAME } = name || {};
      return `${GIVEN_NAME?.[0] || ''}${FAMILY_NAME?.[0] || ''}`.toUpperCase();
    },
    getPhoneIcon(type) {
      const icons = {
        "TYPE_NONE": "phone_disabled",
        "TYPE_COMPANY_MAIN": "business",
        "TYPE_WORK": "work",
        "TYPE_WORK_MOBILE": "smartphone",
        "TYPE_HOME": "home",
        "TYPE_MOBILE": "smartphone",
        "INTERNAL_NUMBER": "domain",
        "TYPE_FAX_WORK": "print",
        "TYPE_FAX_HOME": "print",
        "TYPE_OTHER": "device_unknown",
        "TYPE_CALLBACK": "call",
        "TYPE_CAR": "directions_car",
        "TYPE_ISDN": "network_check",
        "TYPE_MAIN": "phone",
        "TYPE_OTHER_FAX": "print",
        "TYPE_RADIO": "radio",
        "TYPE_TELEX": "dialer_sip",
        "TYPE_TTY_TDD": "hearing",
        "TYPE_PAGER": "pager",
        "TYPE_WORK_PAGER": "notifications_active",
        "TYPE_ASSISTANT": "assistant",
        "TYPE_MMS": "sms"
      };
      return icons[type] || "phone";
    },
    getIMIcon(type) {
      const icons = {
        "PROTOCOL_NONE": "chat_bubble_outline",
        "PROTOCOL_AIM": "emoji_people",
        "PROTOCOL_GOOGLE_TALK": "google",
        "PROTOCOL_ICQ": "group",
        "PROTOCOL_JABBER": "message",
        "PROTOCOL_MSN": "sms",
        "PROTOCOL_NET_MEETING": "groups",
        "PROTOCOL_QQ": "chat",
        "PROTOCOL_SKYPE": "skype",
        "PROTOCOL_YAHOO": "chat_bubble"
      };
      return icons[type] || "chat";
    },
    getWebsiteIcon(type) {
      const icons = {
        "TYPE_NONE": "language",
        "TYPE_HOMEPAGE": "home",
        "TYPE_BLOG": "rss_feed",
        "TYPE_PROFILE": "person",
        "TYPE_HOME": "house",
        "TYPE_WORK": "business",
        "TYPE_FTP": "cloud_upload",
        "TYPE_OTHER": "public"
      };
      return icons[type] || "language";
    },
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.$toastr.Add({
          title: 'Copié dans le presse-papiers!',
          msg: '',
          type: 'success',
          timeout: 3000
        });
      } catch (e) {
        console.log("Copy to clipboard failed", e);
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
.view-contact-container {
  max-width: 640px;
  margin: auto;
}
.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
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
.contact-field {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 10px;
  background: #28303f;
  color: white;
  cursor: pointer;
}
.phone-type {
  margin-left: auto;
  font-size: 0.85em;
  color: #aaa;
}
.label {
  padding: 0px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  font-weight: bold;
}
.span-container {
  margin-left: 0.5rem;
}
</style>
