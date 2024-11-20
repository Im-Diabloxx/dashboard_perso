<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box"  v-if="user.allowed_routes.includes('tickets')" v-show="user.allowed_routes.includes('tickets')">
        <div data-v-65729484="" class="container is-max-widescreen support">
          <h1 data-v-65729484=""><span data-v-65729484="">Mon assistance</span></h1>

          <div class="fadeInRight">
            <div class="row">

              <div class="col-lg-3" style="height: 225px; padding-right: 5px">
                    <div title="Tickets ouverts" class="widget navy-bg p-lg text-center" :style="order === 'open' ? 'box-shadow: 0 0 0 3px white; height: 209px; cursor: pointer' : 'height: 209px; cursor: pointer'" @click="orderByState('open')">
                    <div class="m-b-md">
                        <i class="material-symbols-outlined size-xxl">auto_stories</i>
                        <br>
                        <span style="font-size: 2em" class="m-xs">{{tickets_stats.open_tickets}}</span>
                        <br>
                        <span style="font-size: 1em" class="no-margins">
                            Tickets ouverts
                        </span>
                    </div>
                </div>
              </div>

              <div class="col-lg-3" style="height: 225px; padding-left: 5px; padding-right: 5px">
                <div title="Tickets IPBX" class="widget style1 blue-bg" :style="order === 'ipbx' ? 'box-shadow: 0 0 0 3px white; height: 100px; cursor: pointer;' : 'height: 100px; cursor: pointer'" @click="orderByState('ipbx')">
                    <div class="row vertical-align" style="margin-top: 10px;">
                        <div class="col-3" style="margin-top: 10px;">
                            <i class="material-symbols-outlined size-xxl">dns</i>
                        </div>
                        <div class="col-8 text-right" style="margin: auto;">
                            <span class="mytext"> IPBX </span>
                            <h2 class="font-bold">{{tickets_stats.ipbx_tickets}}</h2>
                        </div>
                    </div>
                </div>
                <div title="Tickets Opérateur" class="widget style1 blue-bg" :style="order === 'operator' ? 'box-shadow: 0 0 0 3px white; height: 100px; cursor: pointer;' : 'height: 100px; cursor: pointer;'" @click="orderByState('operator')">
                    <div class="row vertical-align" style="margin-top: 10px;">
                        <div class="col-3" style="margin-top: 10px;">
                            <i class="material-symbols-outlined size-xxl">phone</i>
                        </div>
                        <div class="col-8 text-right" style="margin: auto;">
                            <span class="mytext">OPERATEUR </span>
                            <h2 class="font-bold">{{tickets_stats.operator_tickets}}</h2>
                        </div>
                    </div>
                </div>
              </div>

              <div class="col-lg-3" style="height: 225px; padding-left: 5px; padding-right: 5px">
                <div title="Tickets pris en charge" class="widget style1 yellow-bg" :style="order === 'in-progress' ? 'box-shadow: 0 0 0 3px white; height: 63.33px; margin-bottom: 3px; cursor: pointer' : 'height: 63.33px; margin-bottom: 3px; cursor: pointer'" @click="orderByState('in-progress')">
                    <div class="row vertical-align">
                        <div class="col-3">
                            <i class="material-symbols-outlined size-xxl">hourglass_top</i>
                        </div>
                        <div class="col-9 text-right">
                            <h2 class="font-bold">{{tickets_stats.in_progress_tickets}}</h2>
                        </div>
                    </div>
                </div>
                <div title="Tickets à clôturer" class="widget style1 red-bg" :style="order === 'to-close' ? 'box-shadow: 0 0 0 3px white; height: 63.33px; margin-bottom: 3px; cursor: pointer' : 'height: 63.33px; margin-bottom: 3px; cursor: pointer'" @click="orderByState('to-close')">
                    <div class="row vertical-align">
                        <div class="col-3">
                            <i class="material-symbols-outlined size-xxl">schedule</i>
                        </div>
                        <div class="col-9 text-right">
                            <h2 class="font-bold">{{tickets_stats.to_close_tickets}}</h2>
                        </div>
                    </div>
                </div>
                <div title="Tickets clos" class="widget style1" :style="order === 'closed' ? 'box-shadow: 0 0 0 3px white; height: 63.33px; margin-bottom: 3px; cursor: pointer' : 'height: 63.33px; margin-bottom: 3px; cursor: pointer'" @click="orderByState('closed')">
                    <div class="row vertical-align">
                        <div class="col-3">
                          <i class="material-symbols-outlined size-xxl">done</i>
                        </div>
                        <div class="col-9 text-right" >
                            <h2 class="font-bold">{{tickets_stats.closed_tickets}}</h2>
                        </div>
                    </div>
                </div>

              </div>

              <div class="col-lg-3" style="height: 225px; padding-left: 5px">
                    <div title="Top 3 des clients durant le mois" class="widget lazur-bg no-padding" :style="order === 'top-partner' ? 'box-shadow: 0 0 0 3px white; height: 210px; cursor: pointer' : 'height: 210px; cursor: pointer'">
                    <div class="p-m">
                        <span style="font-size: 1em" class="no-margins">
                          Top 3 clients
                        </span>
                        <br>
                        <table style="margin-top: 15px">
                            <tbody v-for="p, index of getTopValsFromTickets" :key="index">
                            <tr style="margin-top: 5px;">
                                <td class="mytext">
                                    <button type="button" class="btn btn-default m-r-sm" style="background-color:  #23c6c8 !important; margin-right: 15px">{{p.nb}}</button>
                                    {{p.name}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>

            </div>

      </div>
      

      <div data-v-65729484="" class="tickets_list" style="overflow-wrap: anywhere; padding-bottom: 50px;">

        <div data-v-65729484="" class="columns mb-0 align-items-center" style="margin-top: 20px">

          <div class="column" style="padding: 0rem; margin-left: 1%">
            <div class="fieldset-content">
              <div class="field mb-0">
                <h4 data-v-65729484="">Mes demandes :</h4>
              </div>
            </div>
          </div>

          <div class="column" style="padding: 0.75rem !important;">
            <div class="fieldset-content">
              <div class="field mb-0" style="min-width: 300px">
                <TagInput
                :modelValue="search_badges">
                </TagInput>

              </div>
            </div>
          </div>

        </div>

        <div style="overflow-y: scroll; max-height: 450px" @scroll="handleScroll">
        <div data-v-65729484="" class="ticket is-resolved" v-for="t of get_tickets" :key="t.id" :style="getStatusBorderColor(t)" @click="updateCurrentTicket(t)">
          <div data-v-65729484="" class="waitingForCust_info">
            <svg data-v-65729484="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
              <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                <path d="m 50,16.229525 c 18.75,0 33.75,12.6 33.75,28.125 0,12.15 -9.225,22.5 -22.1625,26.25 -1.8,5.4 3.4125,13.125 3.4125,13.125 -5.310502,-1.798534 -9.401951,-6.086149 -10.95,-11.475 -1.344724,0.150739 -2.696854,0.225859 -4.05,0.225 -18.75,0 -33.75,-12.6 -33.75,-28.125 0,-15.525 15,-28.125 33.75,-28.125 m 0,-3.75 c -20.6625,0 -37.5,14.2875 -37.5,31.875 0,17.5875 16.8375,31.875 37.5,31.875 h 1.575 c 2.24283,5.420419 6.798341,9.549277 12.4125,11.25 0.335288,0.0546 0.677209,0.0546 1.0125,0 1.206964,-0.0056 2.337465,-0.591765 3.0375,-1.575 0.891776,-1.285481 0.891776,-2.989519 0,-4.275 -1.609031,-2.423291 -2.647571,-5.17992 -3.0375,-8.0625 13.575,-5.025 22.5,-16.5 22.5,-29.2125 0,-17.5875 -16.8375,-31.875 -37.5,-31.875 z"></path>
                /&gt;
                <path d="m 38.599999,44.392025 a 5.5875,5.5875 0 0 1 -5.5875,5.5875 5.5875,5.5875 0 0 1 -5.5875,-5.5875 5.5875,5.5875 0 0 1 5.5875,-5.587499 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                /&gt;
                <path d="M 55.5875,44.392025 A 5.5875,5.5875 0 0 1 50,49.979525 5.5875,5.5875 0 0 1 44.4125,44.392025 5.5875,5.5875 0 0 1 50,38.804526 a 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                /&gt;
                <path d="m 72.575,44.392025 a 5.5875,5.5875 0 0 1 -5.5875,5.5875 5.5875,5.5875 0 0 1 -5.5875,-5.5875 5.5875,5.5875 0 0 1 5.5875,-5.587499 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                /&gt;
              </g>
            </svg>
            <p class="waitingForCust_info" style="white-space: nowrap; margin-left: 7px;" title="Nombre d'échanges">
              <span :title="'Vous avez ' + t.messages_not_seen + ' nouveau message'" v-if="t.messages_not_seen == 1"><i style="color: orange" class="fas fa-envelope"></i></span>
              <span :title="'Vous avez ' + t.messages_not_seen + ' nouveaux messages'" v-if="t.messages_not_seen > 1"><i style="color: orange" class="fas fa-envelope"></i></span>
              <!--
              <span v-else style="" data-v-65729484="">{{t.message_nb}} message</span>
              -->
            </p>
          </div>
          <div data-v-65729484="" class="informations" style="flex: 1 1;">
            <p v-if="t.ip_address && t.cn" data-v-65729484="" :href='t.ip_address'>
              <a target="_blank" :href="'http://' + t.ip_address">
                <strong data-v-65729484="" :title="t.ip_address">
                  {{t.cn}}
                </strong>
              </a>
            </p>
            <p v-else-if="t.cn" data-v-65729484="">
              <strong data-v-65729484="" :title="t.ip_address">
                {{t.cn}}
              </strong>
            </p>
            <p data-v-65729484="" class="tickets-subtitle">
                {{getSubTitle(t.subject)}}
            </p>
          </div>
          <div v-if="t.tags.length > 0" style="flex: 0.5 1 auto !important;">
            <span style="font-size: 10px; border: 1px solid white; margin-left: 1%" class="state" data-v-65729484="">{{t.tags.join(', ')}}</span>
          </div>
          <div data-v-65729484="" class="state_infos">
            <span data-v-65729484="" class="state" :style="getStatusColor(t)" style="font-size: 14px">
              <svg data-v-65729484="" inkscape:version="0.92.3 (2405546, 2018-03-11)" sodipodi:docname="resolved.svg" id="svg8" version="1.1" viewBox="0 0 100 100" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" class="svgicon">
                <metadata xmlns="http://www.w3.org/2000/svg" id="metadata14">
                  <rdf:rdf xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
                    <cc:work xmlns:cc="http://creativecommons.org/ns#" rdf:about="">
                      <dc:format xmlns:dc="http://purl.org/dc/elements/1.1/">image/svg+xml</dc:format>
                      <dc:type xmlns:dc="http://purl.org/dc/elements/1.1/" rdf:resource="http://purl.org/dc/dcmitype/StillImage"></dc:type>
                      <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/"></dc:title>
                    </cc:work>
                  </rdf:rdf>
                </metadata>
                <defs xmlns="http://www.w3.org/2000/svg" id="defs12"></defs>
                <sodipodi:namedview xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1920" inkscape:window-height="1169" id="namedview10" showgrid="false" inkscape:zoom="3.8764268" inkscape:cx="-7.5235991" inkscape:cy="25.364996" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="1" inkscape:current-layer="g6"></sodipodi:namedview>
                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square" id="g6">
                  <path d="M 80.292116,26.680412 47.081831,69.741089 19.471518,45.866413 c -0.723474,-0.626084 -1.815643,-0.549563 -2.448684,0.173913 -0.63304,0.730431 -0.549562,1.8226 0.173912,2.455641 l 29.00161,25.078149 1.133908,0.424346 0.173911,-0.0069 1.203475,-0.667823 34.33028,-44.514584 c 0.584345,-0.765214 0.452172,-1.857383 -0.313041,-2.441728 -0.751302,-0.584345 -1.857384,-0.445216 -2.434773,0.313041" id="path4" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" inkscape:connector-curvature="0" style="stroke-width:1"></path>
                </g>
              </svg>
                {{t.stage}}
            </span>
            <p style="white-space: nowrap; margin-top: 5px;" data-v-65729484="">
              n°{{t.number}}
            </p>
            <p style="white-space: nowrap; margin-top: 5px;" title="Dernière modification">
              <span data-v-65729484="">{{t.write_date}}</span>
            </p>
          </div>
          <div data-v-65729484="">
          </div>

        </div>
        </div>

      </div>

      
    </div>
  </div>
  </div>
            
</template>

<script>
import TagInput from '../modal/TagInput.vue'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

export default {
  name: 'Tickets',
  props: {
    msg: String,
    tab: Boolean,
    name: { type: String, default: '' },
    modelValue: { type: Array, default: () => [] },
    options: { type: [Array, Boolean], default: false },
    allowCustom: { type: Boolean, default: true },
    showCount: { type: Boolean, default: false }
  },
  watch: {
    search_badges: {
      handler: 'getTickets',
      deep: true
    }
  },
  components: {
    TagInput: TagInput
  },
  data () {
    return {
      tickets: [],
      tickets_infos: [],
      tickets_stats: [],
      old_tickets: [],
      tickets_filtered: [],
      isState: false,
      isDate: true,
      isCreateTicket: false,
      search_ticket: '',
      closed_demand: true,
      search_badges: [],
      top_partner: [],
      in_progress_tickets: [],
      awaiting_tickets: [],
      closed_tickets: [],
      new_tickets: [],
      total_tickets: [],
      order: 'open',
      offset: 0,
      limit: 10,
      searchQuery: ''
    }
  },
  async created () {
    if (this.user.allowed_routes.length <= 0 || !this.user.allowed_routes.includes('tickets')) {
      this.$router.push('/products')
    }
    if (this.$route.query.search) {
      this.search_badges.push(this.$route.query.search)
    }
    await this.getTicketsStats()
    await this.getTickets()
    this.$globalState.loader = false
    await this.getTicketsInfos()
    await this.infoToCloseTickets()
    // await this.createChart()
    
    this.$globalState.loader = false
  },
  methods: {
    async loadMoreTickets () {
      this.searchQuery = this.search_badges
      this.offset += this.limit
      let params = {
        offset: this.offset,
        limit: this.limit,
        state: this.order
      }
      if (this.searchQuery.length > 0) {
        params.search_query = this.searchQuery
      }
      const response = await this.$axios.post(process.env.ODOO_API + 'api/tickets/test?session_id=' + this.user.session_id, { params })
      const newTickets = response.data.result
      if (newTickets && newTickets.length > 0) {
        let tmptickets = this.tickets
        tmptickets = tmptickets.concat(newTickets)
        this.tickets = tmptickets
        this.old_tickets = tmptickets
      }
    },
    handleScroll (event) {
      const container = event.target
      const threshold = 10

      if (container.scrollHeight - container.scrollTop <= container.clientHeight + threshold) {
        this.loadMoreTickets()
      }
    },
    async infoToCloseTickets () {
      if (this.getToCloseTickets > 0) {
        this.$toastr.Add({
          name: 'WarningData',
          title: 'Attention',
          msg: 'Vous avez ' + this.getToCloseTickets + ' tickets en état: à cloturé. Veuillez les cloturer.',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'warning',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      }
    },
    async createChart () {
      let ctx = document.getElementById('flot-chart1')
      let graph = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7],
          datasets: [
            {
              label: 'CPU %',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: 'red',
              borderColor: '#47b784',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          stacked: false,
          plugins: {
            title: {
              display: false,
              text: 'Chart.js Line Chart - Multi Axis'
            },
            datalabels: {
              display: false,
            },
          },
          scales: {
            tooltips: {
              mode: 'index'
            },
            yAxes: [
              {
                display: false
              }
            ],
            xAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })
      return graph
    },
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    closedDemandCheck (e) {
      this.closed_demand = e.target.checked
    },
    async orderByState (val) {
      this.offset = 0
      this.limit = 10
      if (this.order !== val) {
        this.order = val
      } else {
        this.order = ''
      }
      await this.getTickets()
    },
    getStatusBorderColor (ticket) {
      if (ticket.stage === 'Nouveau') {
        return 'border-color: gray'
      } else if (ticket.stage === 'Pris en charge') {
        return 'border-color: orange'
      } else if (ticket.stage === 'A Clôturer') {
        return 'border-color: #ff4d4d'
      } else if (ticket.stage === 'Cloturé') {
        return 'border-color: cornflowerblue'
      } else if (ticket.stage === 'Annulé') {
        return 'border-color: #ff4d4d'
      }
    },
    getStatusColor (ticket) {
      if (ticket.stage === 'Nouveau') {
        return 'background-color: gray'
      } else if (ticket.stage === 'Pris en charge') {
        return 'background-color: orange'
      } else if (ticket.stage === 'A Clôturer') {
        return 'background-color: #ff4d4d'
      } else if (ticket.stage === 'Cloturé') {
        return 'background-color: cornflowerblue'
      } else if (ticket.stage === 'Annulé') {
        return 'background-color: #ff4d4d'
      }
    },
    getCreateTicket (value) {
      this.isCreateTicket = value
    },
    CreateTicket () {
      this.isCreateTicket = true
    },
    async getTicketsInfos () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.tickets_infos = await this.$axios.get(process.env.ODOO_API + 'api/tickets/infos?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data
      })
    },
    async getTicketsStats () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.tickets_stats = await this.$axios.get(process.env.ODOO_API + 'api/tickets/stats?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data
      })
    },
    /* async getTickets () {
      this.tickets = await this.$axios.post(process.env.ODOO_API + 'api/ticketsbis?session_id=' + this.user.session_id).then(response => {
        return response.data.list
      })
      this.old_tickets = await this.$axios.post(process.env.ODOO_API + 'api/ticketsbis?session_id=' + this.user.session_id).then(response => {
        return response.data.list
      })
      this.old_tickets = this.tickets.slice().reverse()
      this.tickets = this.tickets.slice().reverse()
    }, */
    async getTickets () {
      this.offset = 0
      this.searchQuery = this.search_badges
      let params = {
        state: this.order
      }
      if (this.searchQuery.length > 0) {
        params.search_query = this.searchQuery
      }
      const response = await this.$axios.post(process.env.ODOO_API + 'api/tickets/test?session_id=' + this.user.session_id, { params })
      const tickets = response.data.result
      this.tickets = tickets
      this.old_tickets = tickets
      this.tickets = tickets
    },
    updateCurrentTicket (ticket) {
      this.currentTicket = ticket
      this.goToTicket()
    },
    goToTicket () {
      this.$globalState.loader = true
      setTimeout(() => {
        this.$router.push('/support/ticket?number=' + this.currentTicket.number)
        this.$globalState.loader = false
      }, 1000)
    },
    updateSearchBadges (index) {
      this.search_badges.splice(index, 1)
    },
    getTitle (t) {
      if (t) {
        return t.split(' - ')[1]
      } else {
        return ''
      }
    },
    getSubTitle (t) {
      if (t) {
        return t.split(' - ')[0]
      } else {
        return ''
      }
    }
  },
  computed: {
    getTopValsFromTickets () {
      return this.tickets_infos.popular_partner
    },
    user () {
      return this.$store.getters.getUser
    },
    get_tickets () {
      return this.tickets
    },
    /* get_tickets () {
      let ctickets = [...this.tickets]

      // Filtre par état
      const statePriority = {
        'Cloturé': 50,
        'Pris en charge': 40,
        'A Clôturer': 30,
        'Nouveau': 20,
        'Annulé': 10
      }
      if (this.isState) {
        ctickets.sort((a, b) => statePriority[b.stage] - statePriority[a.stage])
      }

      // Filtres
      ctickets = ctickets.filter(t => {
        let isValid = true
        if (this.closed_demand === false && t.stage === 'Cloturé') isValid = false
        if (this.orderByClosed && t.stage !== 'Cloturé') isValid = false
        if (this.orderByToClose && t.stage !== 'A Clôturer') isValid = false
        if (this.orderByInProgress && t.stage !== 'Pris en charge') isValid = false
        if (this.orderByIPBX && !t.subject.includes('IPBX')) isValid = false
        if (this.orderByOperator && !t.subject.includes('OPERATEUR')) isValid = false
        if (this.orderByOpen && !['Nouveau', 'Pris en charge', 'A Clôturer'].includes(t.stage)) isValid = false
        if (this.orderByNoneSet && !['Nouveau', 'Pris en charge'].includes(t.stage)) isValid = false
        if (this.orderByNoneAssigned && t.user) isValid = false

        return isValid
      })

      // Filtre de recherche
      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ').toLowerCase()
        ctickets = ctickets.filter(t => {
          let combinedText = [t.subject, t.number, t.stage].concat(t.tags).join(' ').toLowerCase()
          return s.split(' ').every(v => combinedText.includes(v))
        })
      }

      // Ordre par partenaire
      if (this.orderByPartner) {
        let newctickets = []
        for (let i = 0; i < 5; i++) {
          newctickets.push([])
        }
        for (let c of ctickets) {
          let index = this.getTopValsFromTickets.findIndex(top => top.name === c.cn)
          if (index > -1) newctickets[index].push(c)
        }
        ctickets = newctickets.flat()
      }

      this.tickets_filtered = ctickets
      return ctickets
    }, */
    getSearchBadges () {
      return this.search_badges
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
