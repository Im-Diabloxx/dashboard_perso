<template>
    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box" v-if="user.id_company && user.id_company === 1" v-show="user.id_company && user.id_company === 1">
        
        <div class="dashboard" style="padding-bottom: 0px">
          <div class="container is-max-widescreen">
          
            <section>
              <h1 class="dashboard-zone">
                 Mon VPN KIPLINK
              </h1>
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
                  VPN Manager
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
                                :modelValue="search_vpn">
                                </TagInput>
                            </div>
                            <!--
                            <button class="button is-admin-secondary-light">
                            Filtres 0 filtre(s) actif(s)
                            </button>
                            -->
                        </div>

                        <div class="d-flex" style="float: right; margin-right: 2em;">
                            <button class="button is-admin-secondary-light" @click="goToRulesVPN()">
                                Rêgles de Firewall
                            </button>
                        </div>

                        <div class="d-flex" style="float: right; margin-right: 2em;">
                            <button class="button is-admin-secondary-light" >
                                Créer un Serveur VPN
                            </button>
                        </div>

                      <table class="table">
                        <thead>
                          <tr>
                          <th style="width: 5%" class="">
                            <!--
                            <div class="th-wrap is-centered" @click="restore_collapse()">
                              <span v-show="isAnyServerExpanded" class="material-symbols-outlined" style="cursor: pointer">
                                restore
                              </span>
                            </div>
                            -->
                          </th>
  
                          <th style="width: 5%" class=""><div class="th-wrap is-centered"> <!----></div></th>

                          <th style="width: 15%" class="is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('ca')">CA
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'ca' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'ca' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 15%" class="is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('ca_root')">CA Root
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'ca_root' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'ca_root' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 10%" class="is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('ca_label')">CA Label
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'ca_label' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'ca_label' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('organisation')">Organisation
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'organisation' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'organisation' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('ip_address')">Addresse IP
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'ip_address' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'ip_address' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('mask')">Mask IP
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'mask' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'mask' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>


                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('port')">Port
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'port' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'port' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 10%" class=""><div class="th-wrap is-centered"> <!----></div></th>

                          </tr>
                        </thead>

                        <tbody v-for="s of get_servers" :key="s.ca">
                          <tr draggable="false" class="">

                            <td class="has-text-centered">
                              <a @click="toggleShowClients(s.id)">
                                <span v-if="!s.showClients" class="material-symbols-outlined">
                                  expand_more
                                </span>
                                <span v-else-if="s.showClients" class="material-symbols-outlined">
                                  expand_less
                                </span>
                              </a>
                            </td>

                            <td title="État du serveur" class="active-cols has-text-centered"><div class="state_dot  mb-0" :class="s.status ? getVPNStatus(s.status) : ''"></div></td>

                            <td data-label="CA Serveur" class="">
                              {{s.ca}}
                            </td>

                            <td data-label="CA Root Serveur" class="">
                              {{s.ca_root}}
                            </td>

                            <td data-label="CA Label" class="">
                              {{s.ca_label}}
                            </td>

                            <td data-label="Organisation" class="">
                              {{s.organisation}}
                            </td>

                            <td data-label="Adresse IP" class="">
                              {{s.ip_address}}
                            </td>

                            <td data-label="MASK" class="">
                              {{s.mask}}
                            </td>

                            <td data-label="Port" class="">
                              {{s.port}}
                            </td>

                            <td class="has-text-centered">
                              <a :title="'Créer un client pour se serveur'" @click="createClientVPN(s.id)">
                                  <i class="fal fa-plus" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a :title="'Stopper le serveur VPN'"  style="opacity:0.5">
                                  <i class="fal fa-power-off" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a :title="'Révoquer le serveur VPN'" style="opacity:0.5">
                                  <i class="fal fa-ban" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                            </td>

                          </tr>


                          <tr v-show="s.showClients" class="" style="box-shadow: none;">
                            <td class="" style="width: 5%; background: transparent !important"><div class=" is-centered"> <!----></div></td>
                            
                            <td style="width: 5%" class=""><div class=" is-centered"> <!----></div></td>

                            <td style="width: 15%" class="is-sortable">
                                <div class="" style="white-space: nowrap; display:flex; cursor: pointer" @click="sortClientTable('cn')">CN
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc" style="margin-left: 0.5rem; margin-right: 0; font-size: 1rem;">
                                            <i :class="sortClientKey === 'cn' && sortClientOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortClientKey === 'cn' && sortClientOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <td style="width: 15%" class="is-sortable">
                                <div class="" style="white-space:  nowrap; display:flex; cursor: pointer" @click="sortClientTable('common_name')">CN Label
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc" style="margin-left: 0.5rem; margin-right: 0; font-size: 1rem;">
                                            <i :class="sortClientKey === 'common_name' && sortClientOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortClientKey === 'common_name' && sortClientOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>
                                </div>
                            </td>

                            <td style="width: 10%" class="is-current-sort is-sortable">
                                <div class="" style="white-space:  nowrap; display:flex; cursor: pointer" @click="sortClientTable('virtual_address')">Addresse IP
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc" style="margin-left: 0.5rem; margin-right: 0; font-size: 1rem;">
                                            <i :class="sortClientKey === 'virtual_address' && sortClientOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortClientKey === 'virtual_address' && sortClientOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </td>

                            <td style="width: 10%" class="is-current-sort is-sortable">
                                <div class="" style="white-space:  nowrap; display:flex; cursor: pointer" @click="sortClientTable('public_ip')">Public IP
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc" style="margin-left: 0.5rem; margin-right: 0; font-size: 1rem;">
                                            <i :class="sortClientKey === 'public_ip' && sortClientOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortClientKey === 'public_ip' && sortClientOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </td>


                            <td style="width: 10%" class="is-current-sort is-sortable">
                                <div class="" style="white-space:  nowrap; display:flex; cursor: pointer" @click="sortClientTable('connected_since')">Connected Since
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc" style="margin-left: 0.5rem; margin-right: 0; font-size: 1rem;">
                                            <i :class="sortClientKey === 'connected_since' && sortClientOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortClientKey === 'connected_since' && sortClientOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </td>

                            <td style="width: 10%" class="is-current-sort is-sortable">
                                <div class="" style="white-space:  nowrap; display:flex; cursor: pointer" @click="sortClientTable('disconnected_since')">Disconnected Since
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc" style="margin-left: 0.5rem; margin-right: 0; font-size: 1rem;">
                                            <i :class="sortClientKey === 'disconnected_since' && sortClientOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortClientKey === 'disconnected_since' && sortClientOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </td>

                            <td style="width: 10%" class=""><div class=" is-centered"> <!----></div></td>

                            <td style="width: 10%" class=""><div class=" is-centered"> <!----></div></td>
                            
                          </tr>

                          <tr v-show="s.showClients" style="box-shadow: none;" draggable="false" class="" v-for="(c, index) of s.clients" :key="c.cn + index">

                            <td style="width: 5%" class="has-text-centered no-background">
                            </td>

                            <td style="width: 5%" title="État du serveur" class="active-cols has-text-centered no-background"><div class="state_dot  mb-0" :class="getClientStatus(c.active)"></div></td>

                            <td style="width: 15%" data-label="CN du client" class="no-background">
                              {{c.cn}}
                            </td>

                            <td style="width: 15%" data-label="CN Label" class="no-background">
                              {{c.common_name}}
                            </td>

                            <td style="width: 10%" data-label="Addresse IP" class="no-background">
                              {{c.virtual_address}}
                            </td>

                            <td style="width: 10%" data-label="Public IP" class="no-background">
                              {{c.public_ip}}
                            </td>

                            <td style="width: 10%" data-label="Connected Since" class="no-background">
                              {{c.connected_since}}
                            </td>

                            <td style="width: 10%" data-label="Disconnected Since" class="no-background">
                              {{c.disconnected_since}}
                            </td>

                            <td style="width: 10%" data-label="" class="no-background">
                            </td>

                            <td class="has-text-centered no-background">
                              <a :title="'Télécharger le fichier VPN'" @click="downloadClientConfig(c)">
                                  <i class="fal fa-download" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a :title="'Redémarrer le client'" @click="rebootClient(c)" :style="c.active ? '' : 'opacity:0.5; pointer-events: none'">
                                <i class="fal fa-redo" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a :title="'Révoquer le client'" @click="revokeClient(c)">
                                  <i class="fal fa-ban" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                            </td>

                          </tr>

                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <CreateServerVPN @createServer="getCreateServerVPN" :active="isCreateServer ? true : false"></CreateServerVPN>
              <CreateClientVPN @createClient="getCreateClientVPN" :server="id_server" :active="isCreateClient ? true : false"></CreateClientVPN>

              <DownloadConfigVPN @downloadClient="getDownloadClient" :client="currentClient" :active="isDownloadClient ? true : false"></DownloadConfigVPN>

              <CheckAction :emitter="'revokeClient'" :emitterStatus="'revokeStatus'" @revokeStatus="getRevokeStatus" @revokeClient="getRevokeClient" :active="isRevokeClient ? true : false"></CheckAction>
              <CheckAction :emitter="'rebootClient'" :emitterStatus="'rebootStatus'" @rebootStatus="getRebootStatus" @rebootClient="getRebootClient" :active="isRebootClient ? true : false"></CheckAction>

            </section>
          </div>
        </div>
      </div>
      
      <tt></tt>
    </div>

</template>

<script>
import TagInput from '../modal/TagInput.vue'
import CreateServerVPN from './CreateServerVPN.vue'
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
    CreateServerVPN,
    CreateClientVPN,
    DownloadConfigVPN,
    CheckAction
  },
  data () {
    return {
      id_server: null,
      vpn: [],
      search_vpn: [],
      sortKey: 'port',
      sortOrder: 'asc',
      isCreateServer: false,
      search_clients: [],
      sortClientKey: 'common_name',
      sortClientOrder: 'asc',
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
    await this.getServers()
    this.$loader = false
  },
  methods: {
    restore_collapse() {
      this.vpn.forEach(server => {
        server.showClients = false;
      });
      this.search_vpn = [];
      this.search_clients = [];
    },
    rebootClient (c) {
      this.currentClient = c
      this.isRebootClient = true
    },
    async getRebootStatus (value) {
      this.$loader = true
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
      await this.getServers()
      this.$loader = false
    },
    getRebootClient (value) {
      this.isRebootClient = value
    },
    async getCreateClientVPN (value) {
      this.isCreateClient = value
      this.$loader = true
      await this.getServers()
      this.$loader = false
      this.id_server = null
    },
    revokeClient (c) {
      this.currentClient = c
      this.isRevokeClient = true
    },
    async getRevokeStatus (value) {
      this.$loader = true
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
      await this.getServers()
      this.$loader = false
    },
    getRevokeClient (value) {
      this.isRevokeClient = value
    },
    createClientVPN (id_server) {
      this.id_server = id_server.toString()
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
    getCreateServerVPN (value) {
      this.isCreateServer = value
    },
    createServerVPN () {
      this.isCreateServer = true
    },
    getVPNStatus (value) {
      switch (value) {
        case 'active':
          return 'status-active'
        case 'inactive':
          return 'status-danger'
      }
    },
    sortClientTable (key) {
      if (this.sortClientKey !== key) {
        this.sortClientOrder = 'asc'
      } else {
        this.sortClientOrder = this.sortClientOrder === 'asc' ? 'desc' : 'asc'
      }
      this.sortClientKey = key
    },
    sortTable (key) {
      if (this.sortKey !== key) {
        this.sortOrder = 'asc'
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      this.sortKey = key
    },
    goToRulesVPN (vpn) {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/vpn/rules')
      }, 1000)
    },
    async getServers () {
      const header = {
        'Content-Type': 'application/json'
      }
      try {
        const response = await this.$axios.post(
          process.env.ODOO_API + 'api/vpn/server/list?session_id=' + this.user.session_id,
          {},
          { headers: header }
        )
        // Récupérer les clients VPN pour chaque serveur
        await Promise.all(response.data.result.map(async (server) => {
          try {
            let clients = await this.getVPNClientList(server.id)
            server.clients = clients
            server.showClients = false
          } catch (error) {
            console.error(error)
          }
        }))
        this.vpn = response.data.result
      } catch (error) {
        console.error(error)
      }
    },
    async getVPNClientList(serverId) {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'id_server': serverId
      }
      try {
        const response = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/specific/list?session_id=' + this.user.session_id,
          { params },
          { headers: header }
        )
        return response.data.result
      } catch (error) {
        console.error(error)
        return []
      }
    },
    toggleShowClients(serverId) {
      const serverIndex = this.vpn.findIndex(server => server.id === serverId);
      if (serverIndex !== -1) {
        this.vpn[serverIndex].showClients = !this.vpn[serverIndex].showClients;
      }
      this.$forceUpdate()
    }
  },
  computed: {
    isAnyServerExpanded() {
      return this.vpn.some(server => server.showClients);
    },
    getTotalServers () {
      return 10
    },
    getTotalClients () {
      return 10
    },
    user () {
      return this.$store.getters.getUser
    },
    get_servers() {
      let vpn = this.vpn;
      this.search_clients = this.search_vpn

      if (this.search_vpn.length > 0) {
        let text = this.search_vpn.join(' ');
        vpn = vpn.filter(s => {
          // Check if the server matches the search criteria
          const serverMatches = text.toLowerCase().split(' ').every(v =>
            (s.ca_label && s.ca_label.toLowerCase().includes(v)) ||
            (s.organisation && s.organisation.toLowerCase().includes(v)) ||
            (s.ip_address && s.ip_address.toLowerCase().includes(v)) ||
            (s.port && s.port.toLowerCase().includes(v))
          );

          // Check if any client within the server matches the search criteria
          const clientMatches = s.clients && s.clients.some(c => {
            return text.toLowerCase().split(' ').every(v =>
              (c.cn && c.cn.toLowerCase().includes(v)) ||
              (c.common_name && c.common_name.toLowerCase().includes(v)) ||
              (c.virtual_address && c.virtual_address.toLowerCase().includes(v)) ||
              (c.connected_since && c.connected_since.toLowerCase().includes(v)) ||
              (c.disconnected_since && c.disconnected_since.toLowerCase().includes(v)) ||
              (s.ca_label && s.ca_label.toLowerCase().includes(v))
            );
          });

          if (clientMatches) {
            s.showClients = true;
          } else {
            s.showClients = false
          }

          return serverMatches || clientMatches;
        });
      }

      if (this.sortKey && this.sortOrder) {
        vpn.sort((a, b) => {
          const valueA = a[this.sortKey];
          const valueB = b[this.sortKey];
          if (this.sortOrder === 'asc') {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        });
      }

      if (this.search_clients.length > 0 || (this.sortClientKey && this.sortClientOrder)) {
        vpn = vpn.map(server => {
          let clients = server.clients || [];

          if (this.search_clients.length > 0) {
            let clientText = this.search_clients.join(' ');
            clients = clients.filter(c => {
              return clientText.toLowerCase().split(' ').every(v =>
                (c.cn && c.cn.toLowerCase().includes(v)) ||
                (c.common_name && c.common_name.toLowerCase().includes(v)) ||
                (c.virtual_address && c.virtual_address.toLowerCase().includes(v)) ||
                (c.connected_since && c.connected_since.toLowerCase().includes(v)) ||
                (c.disconnected_since && c.disconnected_since.toLowerCase().includes(v)) ||
                (server.ca_label && server.ca_label.toLowerCase().includes(v))
              );
            });
          }

          if (this.sortClientKey && this.sortClientOrder) {
            clients.sort((a, b) => {
              const valueA = a[this.sortClientKey];
              const valueB = b[this.sortClientKey];
              if (this.sortClientOrder === 'asc') {
                return valueA.localeCompare(valueB);
              } else {
                return valueB.localeCompare(valueA);
              }
            });
          }

          return { ...server, clients: clients };
        });
      }

      return vpn;
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no-background {
    background: transparent !important;
  }
</style>
