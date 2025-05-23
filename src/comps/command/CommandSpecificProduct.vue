<template>
<div data-v-65729484="" tabindex="-1" :class="active ? 'modal modalSupportDiag is-active' : 'modal modalSupportDiag'">
  <div class="modal-background"></div>
  <div class="animation-content" style="max-width: 960px;">
    <div data-v-65729484="" class="modal-card">
      <div data-v-65729484="" class="modal-card-head">
        <p data-v-65729484="" class="modal-card-title">
        Nouvelle Commande KIPLINK
        </p>
        <button @click="quitCommandProduct()" type="button" class="delete"></button>
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
                        Que souhaitez-vous commander?
                      </div>
                      <div>
                        <button type="button" class='button diagBtn is-rounded has-icon active'>
                            <span>

                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                <path d="m 15.923531,64.545496 c 0,1.390999 1.125824,2.516823 2.516823,2.516823 1.390998,0 2.516823,-1.125824 2.516823,-2.516823 0,-1.390998 -1.125825,-2.521475 -2.516823,-2.521475 -1.390999,0 -2.516823,1.130477 -2.516823,2.521475"></path>
                                <path d="m 11.531883,48.355949 c -3.1309091,0 -5.6756454,2.549389 -5.6756454,5.680298 v 12.714377 c 0,3.126257 2.5447363,5.675646 5.6756454,5.675646 h 42.711561 c 0.642,0 1.163042,-0.521043 1.163042,-1.163042 0,-0.642 -0.521042,-1.163042 -1.163042,-1.163042 H 11.531883 c -1.8469106,0 -3.349561,-1.507303 -3.349561,-3.349562 V 54.036247 c 0,-1.846911 1.5026504,-3.354214 3.349561,-3.354214 H 45.31128 C 45.101933,49.919078 44.929803,49.15147 44.804194,48.355949 H 11.531883"></path>
                                <path d="m 87.725102,48.355949 h -1.730606 c -0.125609,0.795521 -0.297739,1.563129 -0.507087,2.326084 h 2.237693 c 1.846911,0 3.349562,1.507303 3.349562,3.354214 v 7.196905 c 0,0.646651 0.521043,1.163042 1.163042,1.163042 0.646651,0 1.163042,-0.516391 1.163042,-1.163042 v -7.196905 c 0,-3.130909 -2.544736,-5.680298 -5.675646,-5.680298"></path>
                                <path d="M 41.682589,73.193878 H 29.484602 c -0.641999,0 -1.163042,0.521043 -1.163042,1.163042 0,0.641999 0.521043,1.163042 1.163042,1.163042 h 12.197987 c 0.641999,0 1.163042,-0.521043 1.163042,-1.163042 0,-0.641999 -0.521043,-1.163042 -1.163042,-1.163042"></path>
                                <path d="m 78.183504,50.682033 c -0.888564,0.483826 -1.893432,0.781565 -2.972735,0.781565 -1.079304,0 -2.07952,-0.297739 -2.968084,-0.781565 -1.004868,-0.544303 -1.842259,-1.344476 -2.419128,-2.326084 -0.55826,-0.935086 -0.893216,-2.009737 -0.893216,-3.172779 0,-3.461214 2.819214,-6.280428 6.280428,-6.280428 3.461213,0 6.280427,2.819214 6.280427,6.280428 0,1.163042 -0.334956,2.237693 -0.888564,3.172779 -0.581521,0.981608 -1.418911,1.781781 -2.419128,2.326084 z m -10.164988,0.618739 -0.530347,0.162826 -0.762956,-0.400087 -0.265174,-0.381478 -1.60965,-2.326084 -1.595694,-2.302823 h -2.451693 v 4.48469 l -0.06048,0.144217 c -0.07909,0.432652 -0.409391,0.781565 -0.869956,0.781565 -0.455912,0 -0.786216,-0.348913 -0.865303,-0.781565 l -0.06048,-0.144217 v -5.410472 c 0,-0.516391 0.414043,-0.930434 0.925781,-0.930434 h 4.661473 c 0.953695,0 1.725955,-0.77226 1.725955,-1.725954 0,-0.962999 -0.77226,-1.735259 -1.725955,-1.735259 h -4.266038 c -0.511739,0 -0.925782,-0.418695 -0.925782,-0.930434 0,-0.511739 0.414043,-0.930434 0.925782,-0.930434 h 4.266038 c 1.97252,0 3.58217,1.609651 3.58217,3.58217 0,1.684085 -1.176998,3.028562 -2.726171,3.423996 l 1.721303,2.474954 1.139781,1.65152 0.144217,0.674564 z m -17.785241,0.153521 c -0.451261,0 -0.781565,-0.34426 -0.860651,-0.77226 l -0.06978,-0.153521 v -5.401168 c 0,-0.516391 0.418695,-0.930434 0.930434,-0.930434 h 4.019474 c 0.953694,0 1.725954,-0.77226 1.725954,-1.725954 0,-0.962999 -0.77226,-1.735259 -1.725954,-1.735259 h -3.577518 c -0.511739,0 -0.925782,-0.418695 -0.925782,-0.930434 0,-0.511739 0.414043,-0.930434 0.925782,-0.930434 h 3.577518 c 1.977171,0 3.582169,1.609651 3.582169,3.58217 0,1.991128 -1.604998,3.596127 -3.582169,3.596127 h -3.08904 v 4.475386 l -0.06513,0.153521 c -0.08374,0.428 -0.414043,0.77226 -0.865303,0.77226 z m 36.08222,-6.285079 c 0,-11.551335 -9.364815,-20.911499 -20.91615,-20.911499 -11.551335,0 -20.916151,9.360164 -20.916151,20.911499 0,1.093259 0.162826,2.139997 0.321,3.186735 0.125609,0.795521 0.297739,1.563129 0.507086,2.326084 2.433085,8.862382 10.458076,15.403331 20.088065,15.403331 9.629989,0 17.65498,-6.540949 20.088064,-15.403331 0.209348,-0.762955 0.381478,-1.530563 0.507087,-2.326084 0.158173,-1.046738 0.320999,-2.093476 0.320999,-3.186735 z"></path>
                                <path d="m 75.210769,40.758958 c -2.442389,0 -4.424213,1.986476 -4.424213,4.424212 0,1.251433 0.530347,2.372606 1.367738,3.172779 0.795521,0.767608 1.865519,1.251433 3.056475,1.251433 1.190955,0 2.260954,-0.483825 3.056474,-1.251433 0.837391,-0.800173 1.367738,-1.921346 1.367738,-3.172779 0,-2.437736 -1.986476,-4.424212 -4.424212,-4.424212"></path>
                                </g>
                            </svg>

                            
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                <path d="m 36.24999,7.1302981 c -2.305373,0.00223 -4.460196,1.1884927 -5.698266,3.1332119 l -10.485813,14.788755 -0.02507,0.03341 c -0.593305,0.909318 -0.906224,1.972284 -0.902366,3.058025 v 59.840154 c -0.04577,2.539698 2.072386,4.66621 4.612087,4.620441 h 14.128693 39.052341 0.985914 a 2.1391526,2.1391526 0 0 0 1.963482,-1.236576 c 0.959228,-0.8429 1.629268,-1.983613 1.629268,-3.342092 V 14.098559 C 81.57913,10.343497 78.54774,7.1979527 74.792657,7.1302981 h -0.02524 z m 0,4.2778769 h 38.459117 c 1.443022,0.0261 2.549756,1.172173 2.52328,2.615187 v 0.01673 73.985555 c 0,0.190708 -0.11007,0.300778 -0.300777,0.300778 H 37.87926 23.700435 23.67537 c -0.173669,0.0031 -0.262144,-0.08535 -0.259013,-0.259017 v -0.02524 -59.915347 c -8.91e-4,-0.250782 0.07184,-0.491809 0.20888,-0.701839 l 10.510879,-14.822176 0.02507,-0.05014 c 0.456511,-0.716904 1.238745,-1.143673 2.088805,-1.144495 z"></path>
                                <path d="m 34.453615,44.135609 c -2.238148,0 -4.110772,1.864269 -4.110772,4.102417 v 27.939887 c 0,2.238147 1.872624,4.102416 4.110772,4.102416 h 31.574412 c 2.238147,0 4.102416,-1.864269 4.102416,-4.102416 V 48.238026 c 0,-2.238148 -1.864269,-4.102417 -4.102416,-4.102417 z m 0.167107,4.277877 H 65.852566 V 76.002452 H 34.62072 Z"></path>
                                <path d="m 42.023453,44.093832 v 2.138939 31.950397 2.138939 h 4.277878 V 78.183168 46.232771 44.093832 Z"></path>
                                <path d="m 42.023453,55.13109 v 4.277877 h 2.138939 23.787335 2.138939 V 55.13109 H 67.949727 44.162392 Z"></path>
                                <path d="m 42.023453,65.048745 v 4.277878 h 2.138939 23.787335 2.138939 V 65.048745 H 67.949727 44.162392 Z"></path>
                                </g>
                            </svg>
                            
                            <br>
                                TEST
                            </span>
                        </button>
                        </div>
                    </div>
                    <a @click="nextBis()" class="button is-admin-secondary-light is-small">
                      Suivant
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
  name: 'CommandSpecificProduct',
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
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
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
    quitCommandProduct () {
      this.$emit('activateValComSpec', false)
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
    this.$loader = false
  }
}
</script>