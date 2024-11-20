<template>
  <div tabindex="-1" :class="active ? 'modal modalCreateVPNClient is-active' : 'modal modalCreateVPNClient'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Créer un client VPN</p>
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
                                        Vous voulez une config VPN pour quelle version?
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
  </div>
</template>

<script>
export default {
  name: 'CreateVPNClient',
  props: {
    active: Boolean,
    id: String,
    client: Object
  },
  data: () => {
    return {
      cnLabel: '',
      email: ''
    }
  },
  methods: {
    async DownloadClientConfig (version) {
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
            element.setAttribute('download', this.client.common_name + '_V1.zip')
          } else {
            element.setAttribute('download', this.client.common_name + '_V2.zip')
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
