<template>
    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box" v-if="user.id_company && user.id_company === 1" v-show="user.id_company && user.id_company === 1">
        
        <div class="dashboard" style="padding-bottom: 0px">
          <div class="container is-max-widescreen">
          
            <section>
              <a data-v-38fdae67="" @click="goToServers()">
                <svg data-v-38fdae67="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                        <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                    </g>
                </svg>
                <h1 class="dashboard-zone">
                    Clients VPN  de {{server}}
                </h1>
              </a>
            </section>
          </div>
        </div>

        <div data-v-65729484="" class="container is-max-widescreen" style="padding-bottom: 1rem;">
          <div class="billinglist">

            <div style="margin-top: 20px" data-v-65729484="" class="columns mb-0 align-items-center">

              <div data-v-65729484="" class="column">
              </div>
            </div>
            
            <section>
              <div class="fieldset mb-5">
                <label>
                  Mes clients VPN
                </label>

                <div class="fieldset-content">
                  <div class="b-table"> 
                    <div class="field table-mobile-sort">
                      <div class="field has-addons">
                      <div class="control is-expanded">
                          <span class="select is-fullwidth">
                            <select>
                              <option value="[object Object]">
                                Référence
                              </option>
                              <option value="[object Object]">
                                Nom
                              </option>
                              <option value="[object Object]">
                                Partenaire
                              </option>
                              <option value="[object Object]">
                                Société
                              </option>
                              <option value="[object Object]">
                                Date de début
                              </option>
                              <option value="[object Object]">
                                Statut
                              </option>
                              <option value="[object Object]">
                                Éditer
                              </option>
                            </select>
                          </span>
                        </div>
                        
                        <div class="control">
                          <button class="button is-primary">
                            <span class="icon is-small is-desc">
                              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                              </svg>
                            </span>
                          </button>
                        </div>


                      </div>
                    </div>


                    <div class="table-wrapper has-mobile-cards" style="word-break: break-all;">
                        <div class="d-flex" style="float: right">
                        <div class="field mb-0" style="min-width: 300px">
                            <TagInput
                            :modelValue="search_clients">
                            </TagInput>
                        </div>
                        <!--
                        <button class="button is-admin-secondary-light">
                        Filtres 0 filtre(s) actif(s)
                        </button>
                        -->
                        </div>

                        <div class="d-flex" style="float: right; margin-right: 2em;">
                            <button class="button is-admin-secondary-light" @click="createClientVPN()">
                                Créer un Client VPN
                            </button>
                        </div>

                      <table class="table">
                        <thead>
                          <tr>
                          
                          <th style="width: 5%" class=""><div class="th-wrap is-centered"> <!----></div></th>

                          <th style="width: 15%" class="is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">CN
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('cn')">
                                          <i :class="sortKey === 'cn' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'cn' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 20%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Common Name
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('common_name')">
                                          <i :class="sortKey === 'common_name' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'common_name' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 15%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">IP Publique
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('public_ip')">
                                          <i :class="sortKey === 'public_ip' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'public_ip' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 15%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">IP Virtuelle
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('virtual_address')">
                                          <i :class="sortKey === 'virtual_address' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'virtual_address' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Date de Connexion
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('connected_since')">
                                          <i :class="sortKey === 'connected_since' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'connected_since' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Date de déconnexion
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('disconnected_since')">
                                          <i :class="sortKey === 'disconnected_since' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'disconnected_since' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 10%" class=""><div class="th-wrap is-centered"> <!----></div></th>
                          
                          </tr>
                        </thead>


                        <tbody v-for="c of get_client" :key="c.index">
                          <tr draggable="false" class="">

                            <td title="État du serveur" class="active-cols has-text-centered"><div class="state_dot  mb-0" :class="getClientStatus(c.active)"></div></td>

                            <td data-label="CN" class="">
                              {{c.cn}}
                            </td>

                            <td data-label="Common Name" class="">
                              {{c.common_name}}
                            </td>


                            <td data-label="IP Publique" class="">
                              {{c.public_ip}}
                            </td>

                            <td data-label="IP Virtuelle" class="">
                              {{c.virtual_address}}
                            </td>

                            <td data-label="Date de connexion" class="">
                              {{c.connected_since}}
                            </td>

                            <td data-label="Date de déconnexion" class="">
                              {{c.disconnected_since}}
                            </td>

                            <td class="has-text-centered">
                              <a @click="revokeClient(c)">
                                  <i class="fal fa-ban" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a @click="downloadClientConfig(c)">
                                  <i class="fal fa-download" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a @click="rebootClient(c)" :style="c.active ? '' : 'opacity:0.5; pointer-events: none'">
                                <i class="fal fa-redo" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                            </td>

                          </tr>
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>
                        
              <CreateClientVPN @createClient="getCreateClientVPN" :server="id_server" :active="isCreateClient ? true : false"></CreateClientVPN>

              <DownloadConfigVPN @downloadClient="getDownloadClient" :client="currentClient" :active="isDownloadClient ? true : false"></DownloadConfigVPN>

              <CheckAction :emitter="'revokeClient'" :emitterStatus="'revokeStatus'" @revokeStatus="getRevokeStatus" @revokeClient="getRevokeClient" :active="isRevokeClient ? true : false"></CheckAction>
              <CheckAction :emitter="'rebootClient'" :emitterStatus="'rebootStatus'" @rebootStatus="getRebootStatus" @rebootClient="getRebootClient" :active="isRebootClient ? true : false"></CheckAction>

            </section>
          </div>
        </div>
      </div>
      
      
    </div>

</template>

<script>
import TagInput from '../modal/TagInput.vue'
import CreateClientVPN from './CreateClientVPN.vue'
import DownloadConfigVPN from './DownloadConfigVPN.vue'
import CheckAction from '../modal/CheckAction.vue'

export default {
  name: 'OpenVPN',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    TagInput,
    CreateClientVPN,
    DownloadConfigVPN,
    CheckAction
  },
  data () {
    return {
      server: '',
      id_server: null,
      clients: [],
      search_clients: [],
      sortKey: 'common_name',
      sortOrder: 'asc',
      isCreateClient: false,
      isDownloadClient: false,
      isRevokeClient: false,
      currentClient: null,
      isRebootClient: false
    }
  },
  async created () {
    if (!this.user.id_company || this.user.id_company !== 1) {
      this.$router.push('/products')
    }
    this.server = this.$route.query.server
    this.id_server = this.$route.query.id
    await this.getClients()
    this.$globalState.loader = false
  },
  methods: {
    rebootClient (c) {
      this.currentClient = c
      this.isRebootClient = true
    },
    async getRebootStatus (value) {
      this.$globalState.loader = true
      if (value) {
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          'ip_virtual': this.currentClient.virtual_address.toString()
        }
        let action = await this.$axios.post(process.env.ODOO_API + 'api/ipbx/reboot?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result
        })
        if (action.success) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'État IPBX',
            msg: 'Votre IPBX a été redémarrer correctement',
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
            title: 'Une erreur est survenue lors du redémarrage de votre IPBX',
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
      this.isRebootClient = false
      await this.getClients()
      this.$globalState.loader = false
    },
    getRebootClient (value) {
      this.isRebootClient = value
    },
    async getCreateClientVPN (value) {
      this.isCreateClient = value
      this.$globalState.loader = true
      await this.getClients()
      this.$globalState.loader = false
    },
    revokeClient (c) {
      this.currentClient = c
      this.isRevokeClient = true
    },
    async getRevokeStatus (value) {
      this.$globalState.loader = true
      if (value) {
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          id_client: this.currentClient.id.toString()
        }
        let action = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/revoke?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result
        })
        if (action.success) {
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
      this.isRevokeClient = false
      await this.getClients()
      this.$globalState.loader = false
    },
    getRevokeClient (value) {
      this.isRevokeClient = value
    },
    createClientVPN () {
      this.isCreateClient = true
    },
    getDownloadClient (value) {
      this.isDownloadClient = value
    },
    downloadClientConfig (c) {
      this.currentClient = c
      this.isDownloadClient = true
    },
    getClientStatus (value) {
      switch (value) {
        case true:
          return 'status-active'
        case false:
          return 'status-danger'
      }
    },
    sortTable (key) {
      if (this.sortKey !== key) {
        this.sortOrder = 'asc'
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      this.sortKey = key
    },
    goToServers () {
      this.$globalState.loader = true
      setTimeout(() => {
        this.$router.push('/vpn')
      }, 1000)
    },
    async getClients () {
      console.log(this.id_server)
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'id_server': this.id_server
      }
      this.clients = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/specific/list?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data.result
      })
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    get_client () {
      let clients = this.clients

      if (this.search_clients.length > 0) {
        let text = this.search_clients.join(' ')
        clients = clients.filter(s => {
          return text.toLowerCase().split(' ').every(v =>
            (s.cn && s.cn.toLowerCase().includes(v)) ||
            (s.common_name && s.common_name.toLowerCase().includes(v)) ||
            (s.connected_since && s.connected_since.toLowerCase().includes(v)) ||
            (s.disconnected_since && s.disconnected_since.toLowerCase().includes(v))
          )
        })
      }

      if (this.sortKey && this.sortOrder && clients) {
        clients.sort((a, b) => {
          const valueA = a[this.sortKey]
          const valueB = b[this.sortKey]
          if (this.sortOrder === 'asc') {
            return valueA.localeCompare(valueB)
          } else {
            return valueB.localeCompare(valueA)
          }
        })
      }

      return clients
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
