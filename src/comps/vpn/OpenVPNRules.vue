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
                <h1 v-if="id_server" class="dashboard-zone">
                    Rêgles firewall VPN  de {{server}}
                </h1>
                <h1 v-else class="dashboard-zone">
                    Rêgles firewall VPN
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
                  Mes rêgles VPN
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
                            :modelValue="search_rules">
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
                                Créer une rêgle
                            </button>
                        </div>

                      <table class="table">
                        <thead>
                          <tr>
                          
                          <th style="width: 5%" class=""><div class="th-wrap is-centered"> <!----></div></th>

                          <th style="width: 10%" class="is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Rêgle
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('name')">
                                          <i :class="sortKey === 'name' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'name' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>


                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Table
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('table')">
                                          <i :class="sortKey === 'table' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'table' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Chaine
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('chain')">
                                          <i :class="sortKey === 'chain' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'chain' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 5%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Interface IN
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('in_interface')">
                                          <i :class="sortKey === 'in_interface' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'in_interface' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Interface OUT
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('out_interface')">
                                          <i :class="sortKey === 'out_interface' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'out_interface' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>


                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">IP Source
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('source_ip')">
                                          <i :class="sortKey === 'source_ip' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'source_ip' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">IP Destination
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('destination_ip')">
                                          <i :class="sortKey === 'destination_ip' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'destination_ip' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 5%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Protocole
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('protocol')">
                                          <i :class="sortKey === 'protocol' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'protocol' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 5%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">DPORT
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('destination_port')">
                                          <i :class="sortKey === 'destination_port' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'destination_port' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 5%" class="is-current-sort is-sortable">
                              <div class="th-wrap" style="white-space: nowrap;">Action
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc" @click="sortTable('action')">
                                          <i :class="sortKey === 'action' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'action' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 15%" class=""><div class="th-wrap is-centered"> <!----></div></th>
                          
                          </tr>
                        </thead>


                        <tbody v-for="r of get_rule" :key="r.index">
                          <tr draggable="false" class="">

                            <td title="État de la rêgle" class="active-cols has-text-centered"><div class="state_dot  mb-0" :class="getRuleStatus(r.active)"></div></td>

                            <td data-label="Nom de la rêgle" class="">
                              {{r.name}}
                            </td>

                            <td data-label="Table" class="">
                              {{r.table}}
                            </td>

                            <td data-label="Chaîne" class="">
                              {{r.chain}}
                            </td>

                            <td data-label="Interface IN" class="">
                              {{r.in_interface}}
                            </td>

                            <td data-label="Interface OUT" class="">
                              {{r.out_interface}}
                            </td>

                            <td data-label="Source IP" class="">
                              {{r.source_ip_mask ? (r.source_ip + '/' + r.source_ip_mask) : r.source_ip}}
                            </td>

                            <td data-label="Destination IP" class="">
                              {{r.destination_ip_mask ? (r.destination_ip + '/' + r.destination_ip_mask) : r.destination_ip}}
                            </td>

                            <td data-label="Protocole" class="">
                              {{r.protocol}}
                            </td>

                            <td data-label="DPort" class="">
                              {{r.destination_port}}
                            </td>

                            <td data-label="Action" class="">
                              {{r.action}}
                            </td>

                            <td class="has-text-centered">
                              <a >
                                  <i class="fal fa-cog" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a  :style="r.active ? '' : 'opacity:0.5; pointer-events: none'">
                                <i class="fal fa-redo" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <a >
                                  <i class="fal fa-trash" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
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

            </section>
          </div>
        </div>
      </div>
      
      <tt></tt>
    </div>

</template>

<script>
import TagInput from '../modal/TagInput.vue'
import CreateClientVPN from './CreateClientVPN.vue'

export default {
  name: 'OpenVPNRules',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    TagInput,
    CreateClientVPN,
  },
  data () {
    return {
      server: '',
      id_server: null,
      rules: [],
      search_rules: [],
      sortKey: 'cn',
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
    await this.getRules()
    this.$loader = false
  },
  methods: {
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
      await this.getRules()
      this.$loader = false
    },
    getRebootClient (value) {
      this.isRebootClient = value
    },
    async getCreateClientVPN (value) {
      this.isCreateClient = value
      this.$loader = true
      await this.getRules()
      this.$loader = false
    },
    createClientVPN () {
      this.isCreateClient = true
    },
    getRuleStatus (value) {
      switch (value) {
        case 1:
          return 'status-active'
        case 0:
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
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/vpn')
      }, 1000)
    },
    async getRules () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.rules = await this.$axios.post(process.env.ODOO_API + 'api/vpn/rules/list?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.result.data
      })
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    get_rule () {
      let rules = this.rules

      if (this.search_rules.length > 0) {
        let text = this.search_rules.join(' ')
        rules = rules.filter(s => {
          return text.toLowerCase().split(' ').every(v =>
            (s.cn && s.cn.toLowerCase().includes(v)) ||
            (s.table && s.table.toLowerCase().includes(v)) ||
            (s.in_interface && s.in_interface.toLowerCase().includes(v)) ||
            (s.out_interface && s.out_interface.toLowerCase().includes(v)) ||
            (s.action && s.action.toLowerCase().includes(v))
          )
        })
      }

      if (this.sortKey && this.sortOrder && rules) {
        rules.sort((a, b) => {
          const valueA = a[this.sortKey]
          const valueB = b[this.sortKey]
          if (valueA && valueB) {
            if (this.sortOrder === 'asc') {
              return valueA.localeCompare(valueB)
            } else {
              return valueB.localeCompare(valueA)
            }
          }
        })
      }

      return rules
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
