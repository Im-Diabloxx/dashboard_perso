<template>
    <div tabindex="-1" :class="active ? 'modal modalCreateVPNClient is-active' : 'modal modalCreateVPNClient'">
      <div class="modal-background"></div>
      <div class="animation-content" style="max-width: 960px;">
        <div class="modal-card">
          <div class="modal-card-head">
            <p class="modal-card-title">{{client.client_label}} - [{{ client.client_id }}]</p>
            <button @click="cancel()" class="delete"></button>
          </div>
          <form>
            <section class="modal-card-body">
              <div>
                  <div class="container is-fluid supportDiag">
                      <div>
                          <div class="container is-fluid supportDiag">
                              <div>
                                  <div class="level">
                                      <div class="level_title">
                                          Que souhaitez-vous faire?
                                      </div>
  
                                          <button :title="'Télécharger le VPN de l\'IPBX'" type="button" class="button diagBtn is-rounded has-icon" @click="activateDownload()">
                                              <span style="font-size: 40px;">
                                                <i class="material-symbols-outlined size-xxl">download</i>
                                              </span>
                                          </button>

                                            
                                          <button :title="'Révoquer le certificat de mon IPBX'" type="button" class="button diagBtn is-rounded has-icon" @click="activateRevoke()">
                                              <span style="font-size: 40px;">
                                                <i class="material-symbols-outlined size-xxl">vpn_key_off</i>
                                              </span>
                                          </button>
                                  </div>

                                  <div class="level" v-if="isdownload">
                                      <div class="level_title">
                                          Pour quelle version?
                                      </div>
  
                                          <button type="button" class="button diagBtn is-rounded has-icon" @click="DownloadClientConfig('1')">
                                              <span style="font-size: 40px;">
                                                V1
                                              </span>
                                          </button>
  
                                          <button type="button" class="button diagBtn is-rounded has-icon" @click="DownloadClientConfig('2')">
                                              <span style="font-size: 40px;">
                                                  V2
                                              </span>
                                          </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </section>
          </form>
        </div>
      </div>

      <CheckAction :emitter="'revokeClient'" :emitterStatus="'revokeStatus'" @revokeStatus="getRevokeStatus" @revokeClient="getRevokeClient" :active="isrevoke ? true : false"></CheckAction>

    </div>
  </template>
  
  <script>
  import CheckAction from '../modal/CheckAction.vue'

  export default {
    name: 'DownloadRevokeClientVPN',
    props: {
      active: Boolean,
      id: String,
      client: Object
    },
    data: () => {
      return {
        cnLabel: '',
        email: '',
        isrevoke: false,
        isdownload: false
      }
    },
    components: {
      CheckAction
    },
    computed: {
      user () {
        return this.$store.getters.getUser
      }
    },
    methods: {
      getRevokeClient (value) {
        this.isrevoke = value
      },
      activateDownload() {
        this.isdownload = true
        this.isrevoke = false
      },
      activateRevoke() {
        this.isrevoke = true
        this.isdownload = false
      },
      async DownloadClientConfig (version) {
        console.log(this.client)
        this.$globalState.loader = true
        let params = '?id=' + this.client.id + '&version=2'
        if (version === '1') {
          params = '?id=' + this.client.id + '&version=1'
        }
        let vpn = await this.$axios.get(process.env.ODOO_API + 'api/vpn/download/certificate' + params, {responseType: 'blob'})
          .then(response => {
            console.log(response.data)
            let FILE = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' })) // specify content type
            let element = document.createElement('a')
            element.href = FILE
            if (version === '1') {
              element.setAttribute('download', this.client.client_label + '_V1.zip')
            } else {
              element.setAttribute('download', this.client.client_label + '_V2.zip')
            }
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          })
          .catch(error => {
            console.log(error)
          })
        this.$globalState.loader = false
        return vpn
      },
      async getRevokeStatus (value) {
        this.$globalState.loader = true
        if (value) {
          const header = {
            'Content-Type': 'application/json'
          }
          let params = {
            id_client: this.client.id.toString()
          }
          let action = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/revoke?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
            return response.data.result
          })
          if (action.success) {
            this.$store.dispatch('revokeClient', this.client.id)
            this.$toastr.Add({
              name: 'SuccessData',
              title: 'Votre client VPN a été révoqué',
              msg: '',
              clickClose: true,
              timeout: 3000,
              progressBarValue: 0,
              position: 'toast-top-right',
              type: 'success',
              preventDuplicates: true,
              classNames: ['animated', 'slideInRight'],
              style: { 'margin-top': '20%' }
            })
          } else {
            this.$toastr.Add({
              name: 'ErrorData',
              title: 'Une erreur est survenue lors de la révoquation du client',
              msg: 'Veuillez réessayer ultérieurement',
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
        this.isrevoke = false
        this.$globalState.loader = false
        this.cancel()
      },
      cancel () {
        this.$emit('downloadClient', false)
      },
      createVPNClient () {
        const clientVPNData = {
          id_server: this.id,
          cn_label: this.cnLabel,
          email: this.email
        }
        console.log(clientVPNData)
  
        // Faire une requête API pour créer le client VPN
        // Exemple de code Axios :
        // axios.post('VOTRE_URL_API', clientVPNData)
        //   .then(response => {
        //     // Gérer la réussite
        //   })
        //   .catch(error => {
        //     // Gérer l'erreur
        //   })
  
        this.cancel()
      }
    }
  }
  </script>
  
  <style scoped>
  /* Ajoutez vos styles de modal ici */
  </style>
  