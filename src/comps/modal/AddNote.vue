<template>
  <div tabindex="-1" :class="active ? 'modal modalSupportDiag is-active' : 'modal modalSupportDiag'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button @click="cancel" class="delete"></button>
        </div>
        <form @submit.prevent="submitNote">
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Ajouter une note :</label>
              <div class="control">
                <textarea class="input input-color" style="padding-right: 0.5em; height: 5rem;" v-model="noteContent" placeholder="Écrivez votre note ici..."></textarea>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button type="button" class="button is-admin-secondary-light is-large" @click="cancel">Annuler</button>
            <button type="submit" class="button is-admin-primary is-large">Valider</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddNote',
  props: {
    active: Boolean,
    title: {
      type: String,
      default: 'Ajouter une note'
    },
    emitter: String,
    client: Object,
  },
  data() {
    return {
      noteContent: this.client.note || ''
    };
  },
  watch: {
    client(newClient) {
      this.noteContent = newClient.note || '';
    }
  },
  methods: {
    cancel() {
      this.$emit(this.emitter, false);
    },
    async submitNote() {
      const apiUrl = process.env.ODOO_API;
      try {
        const header = {
          'Content-Type': 'application/json'
        };
        const params = {
          cn: this.client.client_id,
          note: this.noteContent
        }
        const response = await this.$axios.post(`${apiUrl}api/v2/ipbx/note/update?session_id=${this.user.session_id}`, params, { headers: header });

        console.log(response)

        if (response.status === 200) {
          console.log('HERE')
          this.$emit('note-updated', this.noteContent);
          //await this.$store.dispatch('fetchClientNotes');
        }
      } catch (error) {
        console.error('Erreur lors de la requête de mise à jour de la note :', error);
      }
      this.cancel();
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  }
};
</script>

<style scoped>
.modalAddNote .modal-card {
  width: 100%;
  max-width: 600px;
}
</style>
