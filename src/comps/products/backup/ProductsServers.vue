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
                Mes sauvegardes sur la machine 
            <span>
                : {{$route.query.name}}
            </span>
        </h1>

        <div class="billinglist">

        <div data-v-65729484="" class="column">
          Réussi
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
                Mes sauvegardes
              </label>

              <div class="fieldset-content">

                <div class="b-table">
                  <div v-if="user.id_company && user.id_company === 1" v-show="user.id_company && user.id_company === 1" class="d-flex" style="float: right; margin-right: 1rem;">
                    <button class="button is-admin-secondary-light" @click="askBackup()">
                        Demander une sauvegarde
                    </button>
                  </div>
                  <div class="field table-mobile-sort">
                    <div class="field has-addons">
                      <div class="control is-expanded">
                        <span class="select is-fullwidth">
                            <select>
                                <option value="[object Object]">
                                    Statut
                                </option>
                                <option value="[object Object]">
                                    Emplacement
                                </option>
                                <option value="[object Object]">
                                  Taille
                                </option>
                                <option value="[object Object]">
                                  Date de création
                                </option>
                                <option value="[object Object]">
                                  Date de demande
                                </option>
                            </select>
                        </span>
                    </div>
                    <div class="control">
                        <button class="button is-primary">
                            <span class="icon is-small is-desc">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path></svg>
                            </span>
                        </button>
                    </div>
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
                                <div class="th-wrap">Emplacement
                                    <span class="icon is-small is-desc">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Taille
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Date de création
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Date de demande
                                    <span class="icon is-small is-desc is-invisible">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                            <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                        </svg>
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div class="th-wrap is-centered">Télécharger</div>
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody v-for="b of getFilteredBackups()" :key="b.id_backup_database">
                        <tr draggable="false" class="">
                            <td data-label="State" class="">
                                <span v-if="b.download == false" class="state" :style="getColorBadge(b.backup_state)" :title="getTitleOfBadge(b.backup_state)">
                                  {{b.backup_state}}
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
                                {{ getDateRequested(b.backup_requested_at) }}
                            </td>
                            <td data-v-fbcb68f2="" class="has-text-centered">
                                <a v-if="b.backup_state == 'RÉUSSI' && b.download == false" style="font-size: 16px" @click="downloadBackup(b.id_database_backup, b.created_at, b, b.download)">
                                    <i class="fa fa-light fa-download"></i>
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
  name: 'ProductsServers',
  props: {
    msg: String,
    tab: Boolean
  },
  data () {
    return {
      backups: [],
      backupServer: '',
      gettingBackup: false,
      ordersCheck: false
    }
  },
  async created () {
    await this.getBackups()
  },
  mounted () {
    this.$loader = false
    this.backupServer = this.$route.query.name
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    async askBackup () {
      const cn = this.$route.query.id
      /*
      this.$toastr.Add({
        name: 'InitiatingBackup',
        title: 'Demande de sauvegarde',
        msg: 'Votre demande de sauvegarde est en cours de traitement...',
        clickClose: true,
        timeout: 3000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'info',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '20%' }
      })
      */

      try {
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          'id_vpn_client': cn,
          'cn': cn
        }
        const response = await this.$axios.post(process.env.ODOO_API + 'api/products/ask_backup', { params }, { headers: header })
        if (response.status === 200) {
          // Successful response
          this.$toastr.Add({
            name: 'BackupRequestSuccess',
            title: 'Demande acceptée',
            msg: 'La demande de backup a bien été prise en compte et sera traitée dans les meilleurs délais.',
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
            name: 'BackupRequestError',
            title: 'Erreur de demande',
            msg: 'La demande de backup n\'a pas pu être traitée.',
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
      } catch (error) {
        console.error(error)
        this.$toastr.Add({
          name: 'BackupRequestFailure',
          title: 'Échec de la demande',
          msg: 'Un problème est survenu lors de la demande de backup.',
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
      await this.getBackups()
    },
    ordersCheckbox (e) {
      this.ordersCheck = e.target.checked
    },
    getFilteredBackups () {
      let backups = this.backups
      if (this.ordersCheck === false) {
        return backups.filter(backup => backup.backup_state === 'RÉUSSI')
      }
      // return backups.filter(backup => backup.backup_state !== 'RÉUSSI')
      return backups
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
        return 'Votre backup est disponible, vous pouvez la télécharger'
      } else if (val === 'SERVEUR INACCESSIBLE') {
        return 'Impossible d\'accéder au serveur, veuillez contacter le support'
      } else if (val === 'EN COURS') {
        return 'Votre backup est en cours de process, veuillez patienter'
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
    async getBackups () {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'cn': this.$route.query.id
      }
      this.backups = await this.$axios.post(process.env.ODOO_API + 'api/products/get_backups', { params }, { headers: header }).then(response => {
        response.data.result.backups.forEach(function (b) {
          if (b.backup_state === 'REQUESTED') {
            b.backup_state = 'DEMANDÉ'
          } else if (b.backup_state === 'FAILED') {
            b.backup_state = 'ÉCHEC'
          } else if (b.backup_state === 'IN_PROGRESS') {
            b.backup_state = 'EN COURS'
          } else if (b.backup_state === 'FAILED_REFUSED_BY_SERVER') {
            b.backup_state = 'SERVEUR INACCESSIBLE'
          } else if (b.backup_state === 'DONE') {
            b.backup_state = 'RÉUSSI'
          } else if (b.backup_state === 'FAILED_NO_SPACE_LEFT') {
            b.backup_state = 'ESPACE INDISPONIBLE'
          } else if (b.backup_state === 'FAILED_BACKUP_SERVER_IS_NOT_ALLOWED_TO_CONNECT_TO_THE_REMOTE_SERVER') {
            b.backup_state = 'SERVEUR INACCESSIBLE'
          } else if ((b.backup_state).includes('DONE_AT_')) {
            let percent = b.backup_state.split('DONE_AT_')[1]
            if (percent.length > 0) {
              b.backup_state = 'FAIT A ' + percent + '%'
            }
          }
          b.download = false
        })
        return response.data.result.backups
      })
      this.$loader = false
    },
    async downloadBackup (id, time, server, download) {
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
      let backup = await this.$axios.get(process.env.ODOO_API + 'api/products/download_backup?id=' + id.toString(), {responseType: 'blob'})
        .then(response => {
          console.log(response)
          if (response && response.data) {
            let FILE = window.URL.createObjectURL(new Blob([response.data], { type: 'application/octet-stream' }))
            let element = document.createElement('a')
            element.href = FILE
            element.setAttribute('download', this.backupServer + '_' + this.$moment.unix(time).format('DD/MM/YYYY') + '.bin')
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
      return backup
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
