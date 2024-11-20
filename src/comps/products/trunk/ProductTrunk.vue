<template>
    <div>
      <div class="container is-max-widescreen">
        <div class="columns is-desktop mt-3" style="padding-right: 0.75rem">
          <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
              <div class="fieldset">
                <label>
                  Nombre de minutes consommées
                </label>
                <div class="fieldset-content" style="height: 162px;">
                  <div v-show="totalcallvals > 0 && showLoading != true" style="">
                    <canvas id="chartLineMinutesUsedTRUNK"></canvas>
                  </div>
                  <div v-show="totalcallvals <= 0 && showLoading != true" class="has-text-centered" style="opacity: 0.4">
                    <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                    Oups! Pas de données disponibles
                  </div>
                  <div v-show="showLoading != false" class="loading-inline has-text-centered" style="opacity: 0.4; padding: 30px;">
                      <div class="loading-icon"></div>
                  </div>
                  <div class="d-flex justify-content-between"><div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
            <div class="fieldset" title="Liste des IPBX dans les limbes en attente d'attribution à un partenaire">
              <label>
                Mes Trunks commandé
              </label>
              <div class="fieldset-content">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="has-text-white">
                    <b>{{products_infos.total_trunks - products_infos.activ_trunks}} TRUNKS</b> en production
                    </span>
                  </div>
                  <div>
                    <a @click="activateTRUNK()" class="button is-admin-primary">
                      Produire
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" href="/products/command?type=new">
                <i class="material-symbols-outlined size-l">power</i>
                Commander un TRUNK
                <span>
                  >
                </span>
            </a>
          </div>
        </div>
      </div>


      <div class="park-resume">
        <div class="container is-max-widescreen informations">
          <section>
            <div>
              <div class="columns">
                <div class="column services-card" style="padding-top: 0">
                  <div class="column services-card" style ="padding-top: 0; padding-bottom: 0.75em;">
                    <div class="field mb-0 align-items-center has-addons">
                      <label class="mr-3">
                        Filtrer par:
                      </label>
                      <div class="control pills-v2" style="margin-right: 0.5rem">
                        <label class="b-radio radio button" :class="isTrunkReady == true ? 'is-admin-white' : ''">
                          Actif
                        <input type="radio" value="date" @click="updateIsTrunkReady()">
                        </label>
                      </div>
                      <div class="control pills-v2">
                        <label class="b-radio radio button" :class="isTrunkNotReady == true ? 'is-admin-white' : ''">
                          Inactif
                          <input type="radio" value="state" @click="updateIsTrunkNotReady()">
                        </label>
                      </div>
                      <label class="ml-3" v-if="isSearchError == false">
                        {{ get_trunks.length }} <span v-if="get_trunks.length > 1">résultats</span><span v-else>résultat</span>
                      </label>
                      <label class="ml-3" v-if="isSearchError == true">
                        0 <span>résultat</span>
                      </label>
                    </div>
                  </div>

                  <div class="collapse active" v-show="isSearchError == false" style="overflow-y: auto; overflow-x: hidden; height: 650px">
                    <div class="collapse-trigger" v-for="t, index of get_trunks" :key="index">
                      <div role="button" @click="setCurrentTrunk(t)" class="card-header card-ipbx" :class="t.id == currentTrunk.id ? 'card-active' : ''" @mouseover="hoveredTrunk = t.id" @mouseleave="hoveredTrunk = null">
                        <div class="card-header-title">
                          <a style="align-self: center; margin-right: 20px">
                            <i class="material-icons" :style="t.state == 'terminated' ? 'color: #21bf26' : 'color: #ff4d4d'">power</i>
                          </a>
                          <span style="margin-right: auto;">
                              <span>
                                {{t.client}}
                              </span>
                              <br>
                              <span @click="copyTEXT(t.username)">
                              {{t.username}}
                              </span>
                              <br>                          
                          </span>

                          <div class="icon-wrapper" :class="{ 'visible': hoveredTrunk === t.id }" style="padding-right: 1em; text-align: right;">
                            <a v-if="currentTrunk" title="Redirection vers l'IPBX associé" @click="" class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">dns</i>
                            </a>
                            <a v-if="currentTrunk" title="Redirection vers les SDA associés" @click="" class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">phone</i>
                            </a>
                          </div>

                          <!--
                          <div class="align-center" style="padding-right: 1em; text-align: right;">
                            <a v-if="t.server_name" title="Redirection vers mon IPBX" @click="goToIPBXOfTrunk(t)" class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">dns</i>
                            </a>
                          </div>
                          <div class="align-center" style="padding-right: 1em; text-align: right;">
                            <a v-if="t.username" title="Afficher mes SDA" @click="goToSDAOfTrunk(t)" class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">phone_enabled</i>
                            </a>
                          </div>
                          -->

                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="collapse active" v-show="isSearchError == true" style="overflow-y: auto; height: 650px">
                    <div class="collapse-trigger">
                      <div>
                        <p style="text-align-last: center; padding: 20px; color: #ff4d4d; font-size: 15px;">Aucun résultat n'a été trouvé</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="datas" style="margin-right: 0; flex-basis: auto; width: 60%;">
                  <div class="fieldset-content wrapper">
                    <div class="field mb-0"></div>
                    <div class="field mb-0" style="min-width: 300px; justify-self: right;">
                      <div class="control has-icons-left">
                        <input placeholder="Rechercher" v-model="search_text" class="input">
                        <span class="icon is-small is-left">
                          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                              <path d="m 62.452297,13.136071 c -13.307093,0 -24.134766,10.826819 -24.134766,24.132812 0,6.102557 2.281546,11.679292 6.03125,15.933594 L 14.001125,83.589195 a 1.90019,1.90019 0 1 0 2.6875,2.685547 L 47.073391,55.850914 c 4.179184,3.464607 9.539208,5.550781 15.378906,5.550781 13.307092,0 24.134765,-10.82682 24.134765,-24.132812 0,-13.305993 -10.827673,-24.132812 -24.134765,-24.132812 z m 0,3.798827 c 11.253641,1e-6 20.335937,9.081886 20.335937,20.333985 0,11.252099 -9.082296,20.333984 -20.335937,20.333984 -11.253641,0 -20.335938,-9.081885 -20.335938,-20.333984 0,-11.252099 9.082297,-20.333985 20.335938,-20.333985 z"></path>
                            </g>
                          </svg>
                      </span>
                      </div>
                    </div>
                  </div>
                  <div class="wrapper">
                    <div :style="currentTrunk ? '' : 'opacity: 0.4'" class="box-account net-status-bloc is-hoverable" style="height: 370px">
                      <div class="box-container">
                        <div class="box-title">
                          Mon Trunk Kiplink
                          <i class="material-symbols-outlined size-l">info</i>
                          <!-- <i class="fa fa-tachometer-alt-slow"></i> -->
                        </div>
                        <div class="box-content" v-show="showLoading != true">
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Numéro de Contrat
                              </div>
                              <div title="Numéro de contrat associé au trunk" class="label" @click="goToContract(currentTrunk.contract_number)">
                                {{currentTrunk.contract_number}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                IPBX attaché
                              </div>
                              <div title="IPBX rattaché au trunk" class="label" @click="goToIPBX(currentTrunk.server_name)">
                                {{currentTrunk.server_name}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Canaux
                              </div>
                              <div title="Nombre de canaux entrants, sortant et totaux" class="label">
                                {{currentTrunk.max_calls}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Username
                              </div>
                              <div @click="copyTEXT(currentTrunk.username)" title="Username de mon Trunk" class="label">
                                {{currentTrunk.username}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Secret
                              </div>
                              <div @click="copyTEXT(currentTrunk.secret)" title="Secret de mon Trunk" class="label">
                                {{currentTrunk.secret}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Nombre de SDA
                              </div>
                              <div title="Nombre de SDA rattachés à mon Trunk" class="label">
                                {{currentTrunk && currentTrunk.sdas ? currentTrunk.sdas.length : '0'}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Date de dernière facturation
                              </div>
                              <div @click="copyTEXT(currentTrunk.last_invoice)" title="Date de dernière facturation du trunk" class="label">
                                {{currentTrunk.last_invoice}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Date de création
                              </div>
                              <div @click="copyTEXT(currentTrunk.create_date)" title="Date de création du trunk" class="label">
                                {{currentTrunk.create_date}}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="!currentTrunk && showLoading != true">
                          <div style="height: 120px; margin-top: 35%">
                            <span><i class="fa fa-frown fa-3x"></i></span><br>
                            Oups! Pas de données disponibles
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="showLoading != false">
                          <div class="loading-inline" style="height: 120px; margin-top: 35%">
                            <div class="loading-icon"></div>
                            <br>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div :style="currentTrunk ? '' : 'opacity: 0.4'" class="box-account phone-status-bloc is-hoverable" style="height: 370px">
                      <div class="box-container">
                        <div class="box-title">
                          SDA rattachés au Trunk
                          <i class="material-symbols-outlined size-l">phone_enabled</i>
                        </div>

                        <div class="box-content" v-show="showLoading != true">
                          <div class="bottom-part b-table" style="height: 300px; overflow-y: auto; overflow-x: hidden;">
                            <table class="table" style="background-color: transparent; width: 100%;">
                              <tbody v-for="(item, index) in currentTrunk.sdas" :key="index">
                                <tr class="item-table">
                                  <td style="width: 30%">
                                    <a style="align-self: center; margin-right: 20px" :title="item.type">
                                      <span v-html="getIcon(item.type)" :style="item.status == 'free' ? 'color: gray' : 'color: #21bf26'"></span>
                                    </a>
                                  </td>
                                  <td style="width: 50%">{{ getPhoneNumberE164(item.name) }}</td>

                                  <td style="width: 20%">
                                    <span class="material-symbols-outlined" @click="editSDA(item)">
                                      settings
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div class="box-content has-text-centered" v-show="!currentTrunk && showLoading != true">
                          <div style="height: 120px; margin-top: 35%">
                            <span><i class="fa fa-frown fa-3x"></i></span><br>
                            Oups! Pas de données disponibles
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="showLoading != false">
                          <div class="loading-inline" style="height: 120px; margin-top: 35%">
                            <div class="loading-icon"></div>
                            <br>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="box-account storage-bloc is-hoverable" style="height: 150px" :style="!currentTrunk.username || (currentTrunk.username && currentTrunk.username.length <= 0) ? 'opacity: 0.4' : 'opacity: 0.4'"><div class="box-container"><div class="box-title">
                      Détails
                      <i class="material-symbols-outlined size-l">bar_chart</i>
                    </div>
                    <div class="box-content has-text-centered" v-show="showLoading != false">
                      <div class="loading-inline" style="margin-top: 5%">
                        <div class="loading-icon"></div>
                        <br>
                      </div>
                    </div>
                    <div class="box-content" v-show="showLoading != true">
                      <div class="container has-text-centered">
                        <span><i class="fa fa-frown fa-3x"></i></span><br>
                        Oups! Pas de données disponibles
                      </div>
                    </div>
                  </div>
                </div>
                <div class="box-account options-bloc is-hoverable" style="opacity: 0.4">
                  <div class="box-container">
                    <div class="box-title">
                      Mes options
                      <!--
                      <button class="button is-admin-primary">
                        Gérer mes options
                      </button>
                      -->
                    </div>
                    <div class="box-content">
                      <div class="box-options">
                        <div class="list-options">

                          <div class="option">
                            <span><i class="fa fa-cog" style="font-size: 50px"></i></span>
                            <span>
                              Modifier
                            </span>
                          </div>
                          <div class="option">
                            <span><i class="fa fa-light fa-redo" style="font-size: 50px"></i></span>
                            <span>
                              Provisionner
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </section>

          <ModalEditSDA v-if="isEditSDA" :item="itemsdaselected" :allitems="currentTrunk" @editSDA="getEditSDA" :active="isEditSDA ? true : false"></ModalEditSDA>

        </div>
      </div>
    </div>

</template>

<script>
import parsePhoneNumber from 'libphonenumber-js'
import ModalEditSDA from '../sda/EditSDA.vue'

export default {
  name: 'ProductTrunk',
  props: {
    msg: String,
    tab: Boolean,
    products_infos: Object
  },
  components: {
    ModalEditSDA
  },
  data () {
    return {
      servers: [],
      search_text: null,
      isSearchError: false,
      isActif: false,
      isInactif: false,
      isActivateIPBX: false,
      nbPerPage: 6,
      nbOfPage: 1,
      currentPage: 1,
      currentIPBX: [],
      currentSDA: [],
      currentTrunk: [],
      nbOfRows: 50,
      steps: [
        {
          id: 'license_pick',
          title: 'Choisir mes licences',
          icon: 'licence'
        }
      ],
      backups: [],
      backupServer: '',
      gettingBackup: false,
      backupError: false,
      currentServerId: null,
      backupErrorMsg: null,
      zabbix_datas: [],
      graphcpu: null,
      graphram: null,
      graphtotalcall: null,
      cpuvals: 0,
      ramvals: 0,
      totalcallvals: 0,
      showLoading: true,
      timer: '',
      second_timer: '',
      menu: 'IPBX',
      sdas: [],
      isTrunkReady: false,
      isTrunkNotReady: false,
      isSDAActif: false,
      isSDAInactif: false,
      trunk_vals: [],
      sda_vals: [],
      letsencrypt_certs: [],
      isEditing: null,
      editedCommonName: '',
      datas_infos: [],
      isRebootClient: false,
      sortKey: 'sda',
      sortOrder: 'asc',
      isEditSDA: false,
      itemsdaselected: [],
      hoveredTrunk: null
    }
  },
  async mounted () {
    this.$globalState.loader = true
    this.showLoading = true
    this.showLoading = false
    this.$globalState.loader = false
    await this.getTrunk()
  },
  methods: {
    goToSda() {
      this.$store.dispatch('setMenu', 'SDA');
    },
    goToIPBX() {
      this.$store.dispatch('setMenu', 'IPBX');
    },
    goToIPBXOfTrunk (trunk) {
      if (trunk.server_name) {
        let ipbx = this.$store.getters.getVPNClientByCn(trunk.server_cn)
        console.log(ipbx, 'IPBX')
      }
    },
    goToSDAOfTrunk (trunk) {
      if (trunk.username) {
        let sdas = this.$store.getters.getSdasFromTrunk(trunk.username)
        if (sdas) {
          sdas = sdas.sdas
        }
        console.log(sdas, 'SDA')
      }
    },
    getEditSDA (value) {
      this.isEditSDA = value
    },
    editSDA (item) {
      this.isEditSDA = true
      this.itemsdaselected = item
    },
    getPhoneNumberE164 (sda) {
      return parsePhoneNumber(parsePhoneNumber(sda, 'FR').number).formatInternational()
    },
    getIcon(type) {
      if (type.toLowerCase().includes('sda ngéo') || type.toLowerCase().includes('sda ngeo')) {
        return '<span class="material-symbols-outlined">public</span>';
      } else if (type.toLowerCase().includes('sda géo') || type.toLowerCase().includes('sda geo')) {
        return '<span class="material-symbols-outlined">place</span>';
      } else if (type.toLowerCase().includes('sda gold')) {
        return '<span class="material-symbols-outlined">diamond</span>';
      }
      return '<span class="material-symbols-outlined">question_mark</span>';
    },
    async copyTEXT (mytext) {
      try {
        await navigator.clipboard.writeText(mytext)
        this.$toastr.Add({
          name: 'SuccesData',
          title: 'Copie effectué :)',
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
      } catch (e) {
        console.log(e)
      }
    },
    goToContract (contract) {
      this.$globalState.loader = true
      setTimeout(() => {
        this.$router.push('/products/command?type=contract&number=' + contract)
      }, 1000)
    },
    updateIsTrunkReady () {
      if (this.isTrunkReady === true) {
        this.isTrunkReady = false
      } else {
        if (this.isTrunkNotReady === true) {
          this.isTrunkNotReady = false
        }
        this.isTrunkReady = true
      }
    },
    updateIsTrunkNotReady () {
      if (this.isTrunkNotReady === true) {
        this.isTrunkNotReady = false
      } else {
        if (this.isTrunkReady === true) {
          this.isTrunkReady = false
        }
        this.isTrunkNotReady = true
      }
    },
    setCurrentTrunk (value) {
      this.showLoading = true
      setTimeout(() => {
        this.currentTrunk = value
        this.showLoading = false
      }, 500)
    },
    async getTrunk () {
      await this.$store.dispatch('fetchTrunks')
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    trunks () {
      return this.$store.getters.trunks
    },
    get_trunks () {
      let ctrunks = this.trunks
      if (this.search_text) {
        let text = this.search_text
        ctrunks = ctrunks.filter(t => {
          return text.toLowerCase().split(' ').every(v => t.username.toLowerCase().includes(v) || t.secret.toLowerCase().includes(v) || t.client.toLowerCase().includes(v) || t.state.toLowerCase().includes(v))
        })
      }
      if (this.isTrunkReady) {
        ctrunks = ctrunks.filter(s => {
          if (s.state === 'terminated' || s.state === 'on_finish') {
            return s
          }
        })
      }
      if (this.isTrunkNotReady) {
        ctrunks = ctrunks.filter(s => {
          if (s.state === 'quotation' || s.state === 'order') {
            return s
          }
        })
      }
      if (this.currentTrunk && this.currentTrunk.length < 1 && ctrunks && ctrunks.length > 0) {
        this.currentTrunk = ctrunks[0]
      }
      return ctrunks
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon-wrapper {
  opacity: 0;
  transition: opacity 0.5s ease-in-out; /* Transition en douceur pour le fade */
}

.icon-wrapper.visible {
  opacity: 1;
}
</style>
