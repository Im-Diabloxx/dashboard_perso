<template>
<div data-v-65729484="" tabindex="-1" :class="active ? 'modal modalSupportDiag is-active' : 'modal modalSupportDiag'">
  <div class="modal-background"></div>
  <div class="animation-content" style="max-width: 960px;">
    <div data-v-65729484="" class="modal-card">
      <div data-v-65729484="" class="modal-card-head">
        <p data-v-65729484="" class="modal-card-title">
        Activation d'un IPBX à distance
        </p>
        <button @click="quitActivateIPBX()" type="button" class="delete"></button>
      </div>
      <section data-v-65729484="" class="modal-card-body">
        <div data-v-65729484="">
          <div data-v-65729484="" class="container is-fluid supportDiag">
            <div data-v-42540544="" data-v-65729484="">
              <div data-v-42540544="" class="container is-fluid supportDiag">
                <div data-v-42540544="">
                  <div class="level" v-show="showLevelOne != false">
                    <div class="level">
                      <div class="level_title">
                        Veuillez saisir la MAC de l'IPBX
                      </div>
                      <div class="field">
                        <div class="autocomplete control">
                          <div class="control has-icons-right is-clearfix">
                            <input v-model="macIPBX" type="text" autocomplete="off" placeholder="XXXXXXXXXXXX" class="input" style="text-align-last: center">
                            <span class="icon is-right is-clickable"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a @click="nextBis()" class="button is-admin-secondary-light is-small">
                      Suivant
                    </a>
                  </div>

                  <div class="level" v-show="showLevelOneBis != false">
                    <div class="level">
                      <div class="level_title">
                        Veuillez saisir l'adresse IP GUEST de l'IPBX
                      </div>
                      <div class="field">
                        <div class="autocomplete control">
                          <div class="control has-icons-right is-clearfix">
                            <input v-model="ip_guest" type="text" autocomplete="off" placeholder="XXX.XXX.XXX.XXX" class="input" style="text-align-last: center">
                            <span class="icon is-right is-clickable"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a @click="nextBisBis()" class="button is-admin-secondary-light is-small">
                      Suivant
                    </a>
                  </div>

                  <div class="level" v-show="showLevelOneBisBis != false">
                    <div class="level">
                      <div class="level_title">
                        Veuillez saisir l'adresse IP PUBLIC de l'IPBX
                      </div>
                      <div class="field">
                        <div class="autocomplete control">
                          <div class="control has-icons-right is-clearfix">
                            <input v-model="ip_public" type="text" autocomplete="off" placeholder="XXX.XXX.XXX.XXX" class="input" style="text-align-last: center">
                            <span class="icon is-right is-clickable"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                      <a @click="searchIPBXtoActivate()" class="button is-admin-secondary-light is-small">
                        Rechercher mon IPBX
                      </a>
                  </div>
                </div>

                <div class="level" v-show="showLoadingOne != false">
                  <div class="level_title">
                      Veuillez patienter, nous recherchons votre IPBX...
                  </div>
                  <div class="container">
                    <div class="loading-inline">
                      <div class="loading-icon"></div>
                      <br>
                    </div>
                  </div>
                </div>

                <div class="level" v-show="showLoadingTwo != false">
                  <div class="level_title">
                      Attribution de nom à l'IPBX
                  </div>
                  <div class="container">
                    <div class="loading-inline">
                      <div class="loading-icon"></div>
                      <br>
                    </div>
                  </div>
                </div>

                <div class="level" v-show="showLoadingThree != false">
                  <div class="level_title">
                      Ne bougez pas, nous configurons votre IPBX, ceci devrait prendre le temps d'un café :)
                  </div>
                  <div class="container">
                    <div class="loading-inline">
                      <div class="loading-icon"></div>
                      <br>
                    </div>
                  </div>
                </div>


                <div class="container" v-show="showLoading != false">
                  <div class="loading-inline">
                    <div class="loading-icon"></div>
                    <br>
                  </div>
                </div>

                <!--
                <div class="level" v-show="showLevelTwo != false">
                    <div class="level">
                      <div class="level_title">
                        Oups! Il semblerait que nous n'avions pas trouvé votre IPBX
                        <br>
                        Si le problème persiste, vous pouvez ouvrir un ticket ou contacter le support au 0472901070 
                      </div>
                      <a @click="resetToFirstModal()" class="button is-admin-secondary-light is-small">
                        Revenir à l'écran principal
                      </a>
                    </div>
                </div>
                <div class="level" v-show="showLevelTwo != false">
                    <div class="level">
                      <div class="level_title">
                        Veuillez saisir l'adresse IP GUEST de l'IPBX dont vous souhaitez vous approprier
                      </div>
                      <div class="field">
                        <div class="autocomplete control">
                          <div class="control has-icons-right is-clearfix">
                            <input v-model="siret" type="text" autocomplete="off" placeholder="XXXXXXXXXXXX" class="input" style="text-align-last: center">
                            <span class="icon is-right is-clickable"></span>
                          </div>
                        </div>
                      </div>
                      <a @click="validateIP()" class="button is-admin-secondary-light is-small">
                        Valider
                      </a>
                    </div>
                </div>
                
                -->

                <div class="level" v-show="showLevelTwo != false">
                    <div class="level">
                      <div class="level_title">
                        Nous avons trouvez un IPBX à la mac addresse: {{macIPBX.toUpperCase()}}
                        <br>
                        Quel nom souhaitez-vous pour votre IPBX?
                      </div>
                      <div class="field">
                        <div class="autocomplete control">
                          <div class="control has-icons-right is-clearfix">
                            <input v-model="siret" type="text" autocomplete="off" placeholder="XXXXXXXXXXXX" class="input" style="text-align-last: center">
                            <span class="icon is-right is-clickable"></span>
                          </div>
                        </div>
                      </div>
                      <a @click="validateSIRET()" class="button is-admin-secondary-light is-small">
                        Valider
                      </a>
                    </div>
                </div>


                <div class="level" v-show="showLevelThree != false">
                    <div class="level">
                      <div class="level_title">
                        Êtes-vous sûr de vouloir vous approprier cet IPBX?
                      </div>
                      <a @click="appropriateIPBX()" class="button is-admin-secondary-light is-small">
                        S'approprier mon précieux
                      </a>
                    </div>
                </div>
                
                <div class="level" v-show="showReset != false">
                    <div class="level">
                      <div class="level_title">
                        Oups! Il semblerait que nous n'avions pas trouvé votre IPBX
                        <br>
                        <br>
                        Les informations saisies sont incomplètes ou incohérentes
                        <br>
                        <br>
                        Si le problème persiste, vous pouvez ouvrir un ticket
                        <br>
                        ou contacter le support au 0472901070 
                      </div>
                      <a @click="resetToFirstModal()" class="button is-admin-secondary-light is-small">
                        Revenir à l'écran principal
                      </a>
                      <a @click="CreateTicketAssistanceVPN()" class="button is-admin-secondary-light is-small">
                        Créer un ticket
                      </a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'ActivateIPBX',
  props: {
    active: Boolean
  },
  data: () => {
    return {
      showLevelOne: true,
      showLevelTwo: false,
      showLevelThree: false,
      showLoading: false,
      showLoadingOne: false,
      showLevelOneBis: false,
      showLevelOneBisBis: false,
      showLoadingTwo: false,
      showLoadingThree: false,
      showReset: false,
      macIPBX: '',
      ip_guest: '',
      ip_public: '',
      siret: ''
    }
  },
  watch: {
    active: function (newVal, oldVal) {
      if (newVal === true) {
        this.macIPBX = ''
        this.ip_guest = ''
        this.ip_public = ''
        this.showLevelOne = false
        this.showLevelOneBis = false
        this.showLevelOneBisBis = false
        this.showLevelTwo = false
        this.showLevelThree = false
        this.showReset = false
        this.showLoading = true
        this.showLoadingOne = false
        this.showLoadingTwo = false
        this.showLoadingThree = false
        setTimeout(() => {
          this.showLoading = false
          this.showLevelOne = true
        }, 1000)
      }
    },
    macIPBX: function(newVal) {
      this.cleanMacInput();
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    cleanMacInput() {
      this.macIPBX = this.macIPBX.replace(/\s+/g, '').toUpperCase().replace(/[^A-Za-z0-9]/g, '');
    },
    nextBis () {
      this.showLevelOne = false
      this.showLoading = true
      if (this.macIPBX.length < 4) {
        setTimeout(() => {
          this.showLoading = false
          this.showReset = true
        }, 1000)
      } else {
        setTimeout(() => {
          this.showLoading = false
          this.showLevelOneBis = true
        }, 1000)
      }
    },
    nextBisBis () {
      this.showLevelOneBis = false
      this.showLoading = true
      setTimeout(() => {
        this.showLoading = false
        this.showLevelOneBisBis = true
      }, 1000)
    },
    quitActivateIPBX () {
      this.$emit('activateValIPBX', false)
    },
    async searchIPBXtoActivate () {
      this.showLevelOneBisBis = false
      this.showLoadingOne = true
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'mac': this.macIPBX.toUpperCase(),
        'ip_guest': this.ip_guest,
        'ip_public': this.ip_public
      }
      let check = await this.$axios.post(process.env.ODOO_API + 'api/ipbx/check?session_id=' + this.user.session_id, {params}, { headers: header }).then(response => {
        return response.data.result
      })
      if (!check || check.status !== 200) {
        setTimeout(() => {
          this.showLoadingOne = false
          this.showReset = true
        }, 3000)
      } else {
        setTimeout(() => {
          this.showLoadingOne = false
          this.showLevelTwo = true
        }, 3000)
      }
    },
    validateSIRET () {
      this.showLevelTwo = false
      this.showLoadingTwo = true
      setTimeout(() => {
        this.showLoadingTwo = false
        this.showLevelThree = true
      }, 1000)
    },
    async appropriateIPBX () {
      this.showLevelThree = false
      this.showLoadingThree = true
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'mac': this.macIPBX.toUpperCase(),
        'ip_guest': this.ip_guest,
        'ip_public': this.ip_public,
        'siret': this.siret
      }
      let vpnclient = await this.$axios.post(process.env.ODOO_API + 'api/ipbx/claim?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        console.log(response.data)
        return response.data.result
      })
      if (vpnclient && vpnclient.status === 200) {
        this.$toastr.Add({
          name: 'SuccesData',
          title: 'Félicitation pour votre nouvel IPBX :)',
          msg: 'Vous pourrez configurer et manipuler votre IPBX dans quelques secondes',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'success',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
        setTimeout(() => {
          this.showLoadingThree = false
          this.macIPBX = ''
          this.ip_guest = ''
          this.ip_guest = ''
          this.siret = ''
          this.quitActivateIPBX()
        }, 5000)
      } else {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Une erreur s\'est produite',
          msg: 'Veuillez réessayez ultérieurement',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
        setTimeout(() => {
          this.showLoadingThree = false
          this.macIPBX = ''
          this.ip_guest = ''
          this.ip_guest = ''
          this.siret = ''
          this.quitActivateIPBX()
        }, 5000)
      }
    },
    CreateTicketAssistanceVPN () {
      this.showLoadingThree = false
      this.macIPBX = ''
      this.ip_guest = ''
      this.ip_guest = ''
      this.siret = ''
      this.quitActivateIPBX()
    },
    resetToFirstModal () {
      this.showLevelTwo = false
      this.showLevelThree = false
      this.showReset = false
      this.showLoading = true
      setTimeout(() => {
        this.showLoading = false
        this.macIPBX = ''
        this.ip_guest = ''
        this.ip_public = ''
        this.siret = ''
        this.showLevelOne = true
      }, 1000)
    }
  },
  mounted () {
    this.$globalState.loader = false
  }
}
</script>