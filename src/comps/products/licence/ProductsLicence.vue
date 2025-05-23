<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box">
        <div class="container is-max-widescreen billing">
        <h1 style="margin-top: 40px; margin-left: 0px;">
            <a @click="goToProducts()" class="router-link-active">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                        <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                    </g>
                </svg>
            </a>
                Mes licences sur la machine 
            <span>
                : {{$route.query.name}}
            </span>
        </h1>

        <div class="billinglist">

        <div data-v-65729484="" class="column">
          Valide
          <label data-v-65729484="" class="switch pl-3 is-rounded">
            <input type="checkbox" true-value="true" value="false" @click="ordersCheckbox($event)">
              <span class="check"></span>
              <span class="control-label"></span>
          </label>
            Toutes
        </div>

          <section>
            <div class="fieldset">
              <label>
                Mes licences
              </label>
              <div class="fieldset-content">
                <div class="b-table">
                  <div class="field table-mobile-sort">
                    <div class="field has-addons">
                      <div class="control is-expanded">
                        <span class="select is-fullwidth">
                            <select>
                                <option value="[object Object]">
                                    Statut
                                </option>
                                <option value="[object Object]">
                                  Quantité
                                </option>
                                <option value="[object Object]">
                                    Module
                                </option>
                                <option value="[object Object]">
                                  Date de début
                                </option>
                                <option value="[object Object]">
                                  Date d'éxpiration
                                </option>
                            </select>
                        </span>
                    </div>
                    <!--
                    <div class="control">
                        <button class="button is-primary">
                            <span class="icon is-small is-desc">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path></svg>
                            </span>
                        </button>
                    </div>
                    -->
                </div>
            </div>
            <div class="table-wrapper has-mobile-cards">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="is-sortable">
                                <div class="th-wrap">Statut
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-current-sort is-sortable">
                                <div class="th-wrap">Quantité
                                    <span class="icon is-small is-desc">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Module
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Date de début
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Date d'éxpiration
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div class="th-wrap is-centered"></div>
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody v-for="b of getFilteredLicences()" :key="b.id_licence_database">
                        <tr draggable="false" class="">
                            <td data-label="State" class="">
                                <span v-if="b.download == false" class="state" :style="getColorBadge(b.licence_state)" :title="getTitleOfBadge(b.licence_state)">
                                  {{b.licence_state}}
                                </span>
                                <span v-else class="state" style="background-color: orange">
                                  EN COURS DE TÉLÉCHARGEMENT
                                </span>
                            </td>
                            <td data-label="Emplacement" class="">
                                {{b.path}}
                            </td>
                            <td data-label="Taille en Ko" class="">
                                {{ getSize(b.size)}}
                            </td>
                            <td data-label="Date de création" class="">
                                {{ getDate(b.created_at) }}
                            </td>
                            <td data-label="Date de création" class="">
                                {{ getDateRequested(b.licence_requested_at) }}
                            </td>
                            <td data-v-fbcb68f2="" class="has-text-centered">
                                <a style="font-size: 16px">
                                    <i class="fa fa-light fa-cog"></i>
                                </a>
                                <a style="font-size: 16px">
                                    <i class="fa fa-light fa-trash"></i>
                                </a>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</section>
</div>
</div>
</div>
<tt></tt>
</div>

</template>

<script>
export default {
  name: 'ProductLicence',
  props: {
    msg: String,
    tab: Boolean
  },
  data () {
    return {
      licences: [],
      licenceServer: '',
      gettingLicence: false,
      ordersCheck: false
    }
  },
  async created () {
    await this.getLicences()
  },
  mounted () {
    this.$loader = false
    this.licenceServer = this.$route.query.name
  },
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    ordersCheckbox (e) {
      this.ordersCheck = e.target.checked
    },
    getFilteredLicences () {
      let licences = this.licences
      if (this.ordersCheck === false) {
        return licences.filter(licence => licence.licence_state === 'RÉUSSI')
      }
      return licences.filter(licence => licence.licence_state !== 'RÉUSSI')
    },
    goToProducts () {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products')
      }, 1000)
    },
    getDate (val) {
      if (val) {
        return this.$moment.unix(val).format('DD/MM/YYYY HH:mm:ss')
      }
      return ''
    },
    getDateRequested (val) {
      if (val) {
        let newval = new Date(val)
        return this.$moment(newval.getTime()).format('DD/MM/YYYY HH:mm:ss')
      }
      return ''
    },
    getTitleOfBadge (val) {
      if (val === 'DEMANDÉ') {
        return 'Votre sauvegarde est en cours de traitement...'
      } else if (val === 'ÉCHEC') {
        return 'Pour une raison inconnue, la sauvegarde a échoué, veuillez contacter le support'
      } else if (val === 'RÉUSSI') {
        return 'Votre licence est disponible, vous pouvez la télécharger'
      } else if (val === 'SERVEUR INACCESSIBLE') {
        return 'Impossible d\'accéder au serveur, veuillez contacter le support'
      } else if (val === 'EN COURS') {
        return 'Votre licence est en cours de process, veuillez patienter'
      } else {
        return ''
      }
    },
    getColorBadge (val) {
      // Undefined is #a0a0a0
      if (val === 'DEMANDÉ') {
        return { 'background-color': 'orange' }
      } else if (val === 'ÉCHEC') {
        return { 'background-color': '#ff4d4d' }
      } else if (val === 'RÉUSSI') {
        return { 'background-color': '#21bf26' }
      } else if (val === 'SERVEUR INACCESSIBLE') {
        return { 'background-color': 'orange' }
      } else if (val === 'EN COURS') {
        return { 'background-color': 'rgb(138 153 119)' }
      } else {
        return { 'background-color': 'gray' }
      }
    },
    getSize (a, b) {
      if (a === 0) return '0' // '0 Bytes'
      // eslint-disable-next-line one-var
      let c = 1024, d = b || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], f = Math.floor(Math.log(a) / Math.log(c))
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
    },
    async getLicences () {
      const header = {
        'Content-Type': 'application/json'
      }
      console.log(this.$route.query.ip)
      let params = {
        'ip_virtual': this.$route.query.ip
      }
      this.licences = await this.$axios.post(process.env.ODOO_API + 'api/ipbx/licence/list?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        console.log(response, 'ICI')
        return response.data.result.licences
      })
      this.$loader = false
    },
    async downloadLicence (id, time, server, download) {
      this.$toastr.Add({
        name: 'WaitingData',
        title: 'Patience',
        msg: 'Nous procédons au téléchargement de votre sauvegarde, veuillez patientez svp...',
        clickClose: true,
        timeout: 3000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'warning',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '20%' }
      })
      server.download = true
      this.$loader = true
      let licence = await this.$axios.get(process.env.ODOO_API + 'api/products/download_licence?id=' + id.toString(), {responseType: 'blob'})
        .then(response => {
          console.log(response)
          if (response && response.data) {
            let FILE = window.URL.createObjectURL(new Blob([response.data], { type: 'application/octet-stream' }))
            let element = document.createElement('a')
            element.href = FILE
            element.setAttribute('download', this.licenceServer + '_' + this.$moment(time).format('DD-MM-YYYY') + '.bin')
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
            this.$toastr.Add({
              name: 'SuccesData',
              title: 'Nickel :)',
              msg: 'Votre sauvegarde a été téléchargé',
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
              title: 'Oups :/',
              msg: 'Nous n\'avons pas pu téléchargé votre sauvegarde',
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
        }).catch(console.error)
      server.download = false
      this.$loader = false
      return licence
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
