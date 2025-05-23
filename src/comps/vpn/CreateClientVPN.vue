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
            <div class="field" v-if="parseInt(this.server) === 29 || parseInt(this.server) === 30">
              <label class="label">IPBX rattaché</label>
              <div class="control">
                <div class="dropdown" :class="{ 'is-active': showMenuIPBX }" style="width: 100%; position: relative;">
                  <div class="dropdown-trigger" style="width: 100%;">
                    <input 
                      @blur="hideMenuIPBX" 
                      @focus="showMenuIPBX = true" 
                      v-model="searchIPBX" 
                      type="text" 
                      class="input" 
                      placeholder="IPBX"
                      style="width: 100%;"
                    >
                  </div>
                  <div class="dropdown-menu" role="menu" style="width: 100%; position: absolute; z-index: 1000;">
                    <div class="dropdown-content" style="max-height: 200px; overflow-y: auto; width: 100%;">
                      <a 
                        class="dropdown-item" 
                        v-for="p in get_ipbx" 
                        :key="p.client_id" 
                        @click="selectIPBX(p)"
                        @mousedown.prevent
                        style="padding: 0.375rem 1rem; cursor: pointer;"
                      >
                        <span>{{p.client_label}}</span>
                      </a>
                    </div>
                  </div>
                </div>
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
      email: '',
      searchIPBX: '',
      showMenuIPBX: false,
      ipbx: null,
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    get_ipbx () {
      let pl = this.$store.getters.clients
      if (this.searchIPBX) {
        let text = this.searchIPBX
        pl = pl.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.client_label.toLowerCase().includes(v))
        })
        return pl
      }
      return pl
    },
  },
  methods: {
    hideMenuIPBX () {
      setTimeout(() => {
        this.showMenuIPBX = false
      }, 250)
    },
    selectIPBX (p) {
      this.searchIPBX = p.client_label
      this.ipbx = p.client_id
      this.showMenuIPBX = false
    },
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
        
        // Check if server is 29 or 30 and ipbx is required but missing
        if ((parseInt(this.server) === 29 || parseInt(this.server) === 30) && !this.ipbx) {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Données manquantes',
            msg: 'Veuillez sélectionner un IPBX rattaché',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
          return;
        }

        let params = {
          id_server: parseInt(this.server),
          cn_label: this.cnLabel,
          email: this.email
        }

        if (parseInt(this.server) === 29 || parseInt(this.server) === 30) {
          params.parent_cn = this.ipbx;
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
