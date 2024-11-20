<template>
    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
        <div class="admin-box" v-if="user.allowed_routes.length > 0 &&user.allowed_routes.includes('tickets')" v-show="user.allowed_routes.length > 0 &&user.allowed_routes.includes('tickets')">
            <div data-v-38fdae67="" class="container is-max-widescreen">
                <h1 data-v-38fdae67="">
                    <a data-v-38fdae67="" @click="goToAllTicket()">
                        <svg data-v-38fdae67="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                            </g>
                        </svg>
                            Mes Tickets
                    </a>
                    <span data-v-38fdae67="">/ Demande n° {{number}}</span>
                </h1>
                
                <div style="margin-top: 20px" data-v-38fdae67="" class="messages_block" v-if="ticket">
                    <div data-v-38fdae67="" class="tickets_list" style="overflow-wrap: anywhere;">
                        <div data-v-38fdae67="" class="ticket is-resolved" :style="getStatusBorderColor(ticket)">
                            <div data-v-38fdae67="" class="waitingForCust_info" >
                                <svg data-v-38fdae67="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
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
                                  <span :title="'Vous avez ' + ticket.messages_not_seen + ' nouveau message'" v-if="ticket.messages_not_seen == 1"><i style="color: orange" class="fas fa-bell"></i></span>
                                  <span :title="'Vous avez ' + ticket.messages_not_seen + ' nouveaux messages'" v-if="ticket.messages_not_seen > 1"><i style="color: orange" class="fas fa-bell"></i></span>
                                  <!--
                                  <span v-else style="" data-v-65729484="">{{ticket.message_nb}} message</span>
                                  -->
                                </p>
                            </div>
                            
                            <div data-v-65729484="" class="informations" style="flex: 1 1;">
                              <p v-if="ticket.ip_address && ticket.cn" data-v-65729484="" :href='ticket.ip_address'>
                                <a target="_blank" :href="'http://' + ticket.ip_address">
                                  <strong data-v-65729484="" :title="ticket.ip_address">
                                    {{ticket.cn}}
                                  </strong>
                                </a>
                              </p>
                              <p v-else-if="ticket.cn" data-v-65729484="">
                                <strong data-v-65729484="" :title="ticket.ip_address">
                                  {{ticket.cn}}
                                </strong>
                              </p>
                              <p class="tickets-subtitle" >
                                  {{getSubTitle}}
                              </p>
                              <!--
                              <p data-v-65729484="" >
                                Demande n°
                                <span data-v-65729484="">{{t.number}}</span>
                                créée le
                                <span style="margin-right: 20%;" data-v-65729484="">{{t.create_date}}</span>
                                Tags: 
                                <span style="font-size: 8px; border: 1px solid white; margin-left: 1%" class="state" v-for="tag of t.tags" :key="tag.index" data-v-65729484="">{{tag}}</span>
                              </p>
                              -->
                            </div>

                            <div v-if="ticket.tags && ticket.tags.length > 0" style="flex: 0.5 1 auto !important;">
                              <span style="font-size: 10px; border: 1px solid white; margin-left: 1%" class="state" data-v-65729484="">{{ticket.tags.join(', ')}}</span>
                            </div>


                            <div data-v-38fdae67="" class="state_infos">
                                <span data-v-65729484="" class="state is-resolved" :style="getStatusColor(ticket)" style="font-size: 14px" @click="CloseTicketStatus(ticket)">
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
                                    {{ticket.stage}}
                                </span>
                                <p data-v-65729484="" style="white-space: nowrap; margin-top: 5px;">
                                  n°{{ticket.number}}
                                </p>
                                <p style="white-space: nowrap; margin-top: 5px;">
                                  <span data-v-65729484="">{{ticket.write_date}}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                    <div data-v-38fdae67="">
                        <div data-v-38fdae67="" class="messages_list" :style="'height: 350px; overflow-y: scroll'">
                          <div data-v-38fdae67="" class="showMsg" v-show="messages.length > 5">
                              <svg data-v-38fdae67="" viewBox="0 0 100 100" version="1.1" id="svg6" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" class="svgicon svg-left svg-2x">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                      <path d="m 29.158402,13.351182 c -1.730682,1.785547 -1.68614,4.636028 0.0995,6.366631 l 30.16963,30.16965 -29.899454,30.347114 c -4.312302,4.278047 2.206107,10.695505 6.416314,6.316953 L 72.111021,49.837767 35.624476,13.351223 c -1.768958,-1.825216 -4.697144,-1.825212 -6.466114,-6e-6 z"></path>
                                  </g>
                              </svg>
                              <br data-v-38fdae67="">
                                  Voir les échanges précédents
                          </div>

                          <div data-v-38fdae67="" class="showMsg" style="color: #cfd7db; font-size: 20px; pointer-events: none;" v-show="messages.length == 0">
                              <br data-v-38fdae67="">
                                  Aucun message
                          </div>
                              
                          <div data-v-38fdae67="" :class="m.type == 'sent' ? 'message user' : 'message'" v-for="m of messages" :key="m.index">
                              <h3 >
                                  <span>
                                      {{m.email_from}}
                                  </span>
                                  <span>
                                      {{m.date}}
                                  </span>
                              </h3>
                              <div style="padding: 1rem">
                                  <div v-html="m.body" style="word-wrap: break-word;"></div>
                                  <div class="attachments"></div>
                              </div>
                          </div>
                            
                    </div>
                        
                        
                    <div data-v-38fdae67="" class="answer" style="background-color: transparent;">
                <form class="mb-0">
                    <textarea v-model="message" rows="1" placeholder="Vous pouvez apporter des précisions" class="textareaEmbeded"></textarea>
                    <div class="has-text-right">
                        <div class="has-text-left is-size-7" >
                            <span v-show="message.length < 49">Le message doit contenir au moins 50 caractères</span>
                            <span>3 fichiers max</span>
                            <br> <span>Taille maximum : 2 Mo par fichier</span>
                        </div>
                        <div style="background-color: transparent" class="field file help-as-tooltip is-left ml-0 mt-2 mb-3 has-addons">
                            <label class="upload control">
                                <a class="button is-admin-secondary-light is-large">
                                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
                                        <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                            <path d="m 43.327181,17.615033 c 5.084789,-0.03091 9.777023,2.729263 12.220313,7.188678 l 1.509568,2.767542 2.947252,-1.114205 c 1.144878,-0.446347 2.36555,-0.666068 3.594209,-0.646958 4.971296,-0.01222 9.154054,3.72129 9.704367,8.662045 l 0.287536,2.623774 2.587831,0.503189 c 5.134412,0.857481 8.714744,5.56269 8.172281,10.739869 -0.54246,5.177178 -5.020342,9.038053 -10.22098,8.812632 H 27.404832 C 21.016854,57.019044 15.830377,51.947356 15.554902,45.563946 15.279442,39.180532 20.009702,33.680895 26.362511,32.99851 l 2.91131,-0.251595 0.323479,-2.839426 c 0.8013,-6.9842 6.699919,-12.265161 13.729881,-12.292456 m 0,-3.593951 c -8.876544,0 -16.335773,6.669693 -17.324091,15.491044 -7.998119,1.133434 -13.832298,8.148749 -13.488666,16.219468 0.343642,8.070722 6.753006,14.564737 14.818524,15.014214 h 46.724726 c 6.920183,0 12.70933,-5.25458 13.378586,-12.142325 C 88.105513,41.715733 83.436167,35.445329 76.645505,34.112715 75.894254,27.356431 70.18079,22.24683 63.382871,22.251823 c -1.61968,0.0083 -3.225383,0.300332 -4.744357,0.86261 -3.065311,-5.594866 -8.931798,-9.078952 -15.311333,-9.093351 z"></path>
                                            <path d="m 49.590091,41.455013 a 1.7972846,1.7972846 0 0 0 -1.769027,1.825183 v 38.99577 a 1.7972846,1.7972846 0 1 0 3.59421,0 v -38.99577 a 1.7972846,1.7972846 0 0 0 -1.825183,-1.825183 z"></path>
                                            <path d="m 36.118828,69.429477 a 1.7972846,1.7972846 0 0 0 -1.193393,3.102812 l 6.725104,6.472385 6.718082,6.472385 a 1.7972846,1.7972846 0 0 0 2.4991,-0.0072 l 6.682984,-6.465365 6.718081,-6.472384 a 1.7972846,1.7972846 0 1 0 -2.492078,-2.583339 l -6.718084,6.465365 a 1.7972846,1.7972846 0 0 0 -0.0072,0.0072 l -5.440285,5.257937 -5.468533,-5.264957 -6.725101,-6.465365 a 1.7972846,1.7972846 0 0 0 -1.298688,-0.519474 z"></path>
                                        </g>
                                    </svg>
                                      ATTACHER PIÈCE JOINTE
                                </a>
                                
                                <input type="file" multiple="multiple" accept="image/*, application/pdf" @change="uploadFile" ref="file">

                            </label>
                            <span style="color: #cfd7db; align-self: center; margin-left: 20px" v-if="file">{{file.name}}</span>
                            <div></div>
                        </div>

                        <div v-show="attachements.length > 0" class="has-text-left is-size-7" >
                            <span>Liste des pièces jointes</span>
                        </div>
                        
                        <div v-show="attachements.length > 0" style="flex-wrap: wrap; background-color: transparent;" class="field file help-as-tooltip is-left ml-0 mt-2 mb-3 has-addons">
                          <span class="button is-admin-secondary-light is-large" style="color: #cfd7db; align-self: center; margin: 5px;" v-for="f of attachements" :key="f.id" @click="downloadAttachement(f)">
                            {{f.name}}
                          </span>
                        </div>
                        
                        <button type='button' class="button is-admin-primary is-large" v-on:click='sendMessage()'>
                            <span>
                                ENVOYER
                            </span>
                        </button>
                    </div>
                </form>

            </div>

            <ModalCloseTicketStatus @closeTicketStatus="getCloseTicketStatus" :number="number" :active="isCloseTicketStatus ? true : false"></ModalCloseTicketStatus>

        </div>
    </div></div></div> </div>
</template>


<script>

import ModalCloseTicketStatus from './CloseTicketStatus.vue'

export default {
  name: 'TicketMessage',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    ModalCloseTicketStatus
  },
  data () {
    return {
      number: '',
      messages: [],
      attachements: [],
      message: '',
      ticket: [],
      file: null,
      isCloseTicketStatus: false
    }
  },
  async created () {
    this.$globalState.loader = false
    this.number = this.$route.query.number
    await this.updateTicketReadStatus()
    await this.getTicketInfos()
  },
  methods: {
    async getCloseTicketStatus (value) {
      this.isCloseTicketStatus = value
      await this.getTicketInfos()
    },
    CloseTicketStatus (t) {
      if (t.stage === 'A Clôturer') {
        this.isCloseTicketStatus = true
      }
    },
    async updateTicketReadStatus () {
      await this.$axios.post(process.env.ODOO_API + 'api/tickets/messages/read?session_id=' + this.user.session_id + '&number=' + this.number).then(response => {
        return response.data
      })
    },
    goToAllTicket () {
      this.$globalState.loader = true
      setTimeout(() => {
        this.$router.push('/support')
        this.$globalState.loader = false
      }, 1000)
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
        return 'background-color: #ff4d4d; cursor: pointer'
      } else if (ticket.stage === 'Cloturé') {
        return 'background-color: cornflowerblue'
      } else if (ticket.stage === 'Annulé') {
        return 'background-color: #ff4d4d'
      }
    },
    scrollToElement () {
      const [el] = this.$refs.last
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    async uploadFile () {
      this.file = this.$refs.file.files[0]
      const formData = new FormData()
      formData.append('ufile', this.file)
      formData.append('id', this.ticket.id)
      formData.append('model', 'helpdesk.ticket')
      const headers = { 'Content-Type': 'multipart/form-data' }
      await this.$axios.post(process.env.ODOO_API + 'api/tickets/messages/send/file?session_id=' + this.user.session_id + '&number=' + this.number, formData, { headers }).then(response => {
        return response.data.list[0]
      })
    },
    async getTicketInfos () {
      this.ticket = await this.$axios.post(process.env.ODOO_API + 'api/tickets/info?session_id=' + this.user.session_id + '&number=' + this.number).then(response => {
        if ((response.data.list).length === 0) {
          console.log('IM HERE')
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Ticket introuvable ou inéxistant',
            msg: 'Veuillez vérifier le numéro de ticket',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
          this.goToAllTicket()
        } else {
          console.log('IM HERE')
          this.getMessages()
          this.getAttachements()
          return response.data.list[0]
        }
      })
    },
    async getMessages () {
      this.messages = await this.$axios.post(process.env.ODOO_API + 'api/tickets/messages?session_id=' + this.user.session_id + '&number=' + this.number).then(response => {
        return response.data.list
      })
      this.messages = this.messages.slice().reverse()
    },
    async getAttachements () {
      this.attachements = await this.$axios.post(process.env.ODOO_API + 'api/tickets/attachements?session_id=' + this.user.session_id + '&number=' + this.number).then(response => {
        return response.data.list
      })
    },
    async downloadAttachement (file) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', process.env.ODOO_API + 'api/content/ir.attachment/' + (file.id).toString() + '/datas?download=true&session_id=' + this.user.session_id, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          this.downloadStatus = 200
          let blob = new Blob([xhr.response])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.name
          link.click()
        }
      }
      xhr.send()
    },
    async sendMessage () {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'msg': this.message,
        'number': this.number
      }
      if (!this.message || this.message.length < 49) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Oups :/',
          msg: 'Le message doit contenir au moins 50 caractères, merci de votre compréhension',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
        return
      }
      this.$globalState.loader = true
      let sendmessage = await this.$axios.post(process.env.ODOO_API + 'api/tickets/messages/send?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data
      })
      this.$toastr.Add({
        name: 'SuccesData',
        title: 'Envoyé :)',
        msg: 'Nous revenons vers vous dans un délai très bref',
        clickClose: true,
        timeout: 3000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'success',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '20%' }
      })
      this.getMessages()
      this.message = ''
      this.$globalState.loader = false
      return sendmessage
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    getTitle () {
      if (this.ticket.subject && this.ticket.subject) {
        return (this.ticket.subject).split(' - ')[1]
      } else {
        return ''
      }
    },
    getSubTitle () {
      if (this.ticket.subject) {
        return (this.ticket.subject).split(' - ')[0]
      } else {
        return ''
      }
    }
  },
  mounted () {
    // this.scrollToElement()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.message {
    border: 1px solid transparent;
}

/* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}


/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: black;
}

p {
  margin-bottom: 0rem
}

</style>
