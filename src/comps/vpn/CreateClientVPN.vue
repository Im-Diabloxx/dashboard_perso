<template>
  <div tabindex="-1" :class="active ? 'modal modalCreateVPNClient is-active' : 'modal modalCreateVPNClient'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Nouveau client VPN</p>
          <button @click="cancel()" class="delete"></button>
        </div>
        <form>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Nom commun (CN)</label>
              <div class="control">
                <input type="text" class="input" v-model="cnLabel">
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input type="text" class="input" v-model="email">
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">Annuler</button>
            <button type="button" class="button is-admin-primary is-large" @click="createVPNClient()">Créer</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateVPNClient',
  props: {
    active: Boolean,
    server: String
  },
  data: () => {
    return {
      cnLabel: '',
      email: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    cancel () {
      this.$emit('createClient', false)
    },
    async createVPNClient () {
      if (this.cnLabel.length <= 1) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Une erreur est survenue lors de la création de votre client',
          msg: 'Veuillez vérifier les informations saisies',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      } else {
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          id_server: parseInt(this.server),
          cn_label: this.cnLabel,
          email: this.email
        }
        let action = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/create?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result
        })
        if (action.status === 200) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Votre client VPN a été crée correctement',
            msg: 'Vous pouvez désormer télécharger ses configurations VPN',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
          this.cancel()
        } else {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Une erreur est survenue lors de la création de votre client',
            msg: 'Veuillez vérifier les informations saisies',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
/* Ajoutez vos styles de modal ici */
</style>
