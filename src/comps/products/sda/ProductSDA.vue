<template>
    <div>

    <div class="container is-max-widescreen">
      <div class="columns is-desktop mt-1" style="padding-right: 0.75rem">
        <!--
        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
            <div class="fieldset">
              <label>
                Nombre de minutes consommées
              </label>
              <div class="fieldset-content">
                <div class="no-data">
                  <div class="has-text-centered" style="height: 100px; opacity: 0.4">
                    <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                    Oups! Pas de données disponibles
                  </div>
                </div>

                <div v-show="totalcallvals > 0 && showLoading != true" style="height: 100px">
                  <canvas id="chartLineMinutesUsedSDA"></canvas>
                </div>
                <div v-show="totalcallvals <= 0 && showLoading != true" class="has-text-centered" style="height: 100px; opacity: 0.4">
                  <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                  Oups! Pas de données disponibles
                </div>
                <div v-show="showLoading != false" class="loading-inline has-text-centered" style="height: 100px; opacity: 0.4; padding: 30px;">
                    <div class="loading-icon"></div>
                </div>
                <div class="d-flex justify-content-between">
                  <div>
                  </div>
                  <div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        -->

        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
          <div class="fieldset" title="Liste des IPBX dans les limbes en attente d'attribution à un partenaire">
            <label>
              Mes SDA à dispatcher
            </label>
            <div class="fieldset-content">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="has-text-white">
                  <b>{{totalSdas - occupiedSdas}} SDA</b> à attribuer
                  </span>
                </div>
                <div>
                  <a @click="activateSDA()" class="button is-admin-primary">
                    Attribuer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-left: 0rem; padding-right: 1rem;">
          <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" @click="goToCommand()">
            <i class="material-symbols-outlined size-l">tag</i>
            Commander un SDA
            <span>></span>
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
                        <label class="b-radio radio button" :class="isSDAActif == true ? 'is-admin-white' : ''">
                          Disponible
                        <input type="radio" value="date" @click="updateIsSDAActif()">
                        </label>
                      </div>
                      <div class="control pills-v2">
                        <label class="b-radio radio button" :class="isSDAInactif == true ? 'is-admin-white' : ''">
                          Occupé
                        <input type="radio" value="status" @click="updateIsSDANotActif()">
                        </label>
                      </div>
                      <label class="ml-3" v-if="isSearchError == false">
                        {{ get_sdas.length }} <span v-if="get_sdas.length > 1">résultats</span><span v-else>résultat</span>
                      </label>
                      <label class="ml-3" v-if="isSearchError == true">
                        0 <span>résultat</span>
                      </label>
                    </div>
                  </div>
                  <div class="collapse active" v-show="isSearchError == false" style="overflow-y: auto; overflow-x: hidden; height: 650px">
                    <div class="collapse-trigger" v-for="s, index of get_sdas" :key="index">
                      <div role="button" @click="setCurrentSDA(s)" class="card-header card-ipbx" :class="currentSDA && s.id == currentSDA.id ? 'card-active' : ''" @mouseover="hoveredSda = s.id" @mouseleave="hoveredSda = null">
                        <div class="card-header-title">
                          <a style="align-self: center; margin-right: 20px">
                            <i class="material-icons" :style="s.status == 'free' ? 'color: gray' : 'color: #21bf26'">tag</i>
                          </a>
                          <span style="margin-right: auto;">
                            <input v-if="showCheckboxes" type="checkbox" v-model="selectedSDAs" :value="s.name" style="margin-right: 10px;">
                            <span @click="copyTEXT(s.name)">
                              {{s.name}}
                            </span>
                            <br>
                            <small v-if="s.final_client.length > 0">
                              {{s.final_client}}
                            </small>
                            <small v-else>
                              Non attribué
                            </small>
                          </span>
                          <!--
                          <span style="margin-left: auto;">
                          </span>
                          -->

                          <div class="icon-wrapper" :class="{ 'visible': hoveredSda === s.id }" style="padding-right: 1em; text-align: right;">
                            <a v-if="currentSDA" title="Informations supplémentaires sur la SDA" class="is-admin-secondary-light is-medium" @click="editSDA(s)">
                              <i class="material-symbols-outlined size-l">settings</i>
                            </a>
                          </div>

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
                <div class="datas" style="margin-right: 0;">
                  <div class="fieldset-content wrapper">
                    <div class="field mb-0">
                      <div v-if="showCheckboxes" class="d-flex" style="float: right; margin-right: 2em;">
                        <button class="button is-admin-secondary-light" @click="openResiliationModal">
                          Résilier la séléction
                        </button>
                      </div>
                    </div>
                    <div class="field mb-0" style="min-width: 300px; justify-self: right;">
                      <TagInput
                        :modelValue="search_badges">
                      </TagInput>
                    </div>
                  </div>
                  
                  <div class="wrapper">
                    <div :style="currentSDA && currentSDA.name && currentSDA.name.length > 0 ? '' : 'opacity: 0.4'" class="box-account net-status-bloc is-hoverable" style="height: 370px;">
                      <div class="box-container">
                        <div class="box-title">
                          Ma SDA Kiplink
                          <i class="material-symbols-outlined size-l">tag</i>
                        </div>
                        <div class="box-content" v-if="currentSDA && currentSDA.name && currentSDA.name.length > 0 && showLoading != true">
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Numéro de Contrat
                              </div>
                              <div title="Nombre de canaux entrants, sortant et totaux" class="label" @click="goToContract(currentSDA.contract_number)">
                                {{currentSDA.contract_number}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Numéro
                              </div>
                              <div @click="copyTEXT(currentSDA.name)" title="Numéro SDA" class="label">
                                {{currentSDA.name}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Rio
                              </div>
                              <div @click="copyTEXT(currentSDA.rio)" title="Le code RIO" class="label">
                                {{currentSDA.rio ? currentSDA.rio : '?'}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Trunk Username
                              </div>
                              <div @click="copyTEXT(currentSDA.trunk_infos.username)" title="Le username du trunk rattaché" class="label">
                                {{currentSDA.trunk_infos.username}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Trunk Secret
                              </div>
                              <div @click="copyTEXT(currentSDA.trunk_infos.secret)" title="Le secret du trunk rattaché" class="label">
                                {{currentSDA.trunk_infos.secret}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Trunk Canaux
                              </div>
                              <div @click="copyTEXT(currentSDA.trunk_infos.max_calls)" title="Nombre de canaux du trunk rattaché" class="label">
                                {{currentSDA.trunk_infos.max_calls}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Ville
                              </div>
                              <div @click="copyTEXT(currentSDA.city)" title="Ville associé au SDA" class="label">
                                {{currentSDA.city}}
                              </div>
                            </div>
                          </div>
                          <!--
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Code d'appel
                              </div>
                              <div @click="copyTEXT(currentSDA.call_code)" title="Le code appelant (call_code) associé au SDA" class="label">
                                {{currentSDA.call_code}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Code Pays
                              </div>
                              <div @click="copyTEXT(currentSDA.country_code)" title="Le code pays (country_code +XX) associé au SDA" class="label">
                                {{currentSDA.country_code}}
                              </div>
                            </div>
                          </div>
                          -->
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Code INSEE
                              </div>
                              <div @click="copyTEXT(currentSDA.insee_code)" title="Le code INSEE associé au SDA" class="label">
                                {{currentSDA.insee_code}}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Dernière facturation
                              </div>
                              <div @click="copyTEXT(currentSDA.last_invoice)" title="La dernière date de facturation du SDA" class="label">
                                {{currentSDA.last_invoice}}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div class="signal-list">
                              <div class="label">
                                Date de création
                              </div>
                              <div @click="copyTEXT(currentSDA.create_date)" title="La date de création du SDA" class="label">
                                {{currentSDA.create_date ? currentSDA.create_date.split(',')[0] : currentSDA.create_date}}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="!currentSDA || (currentSDA && !currentSDA.name) && showLoading != true">
                          <div style="height: 120px; margin-top: 25%">
                            <span><i class="fa fa-frown fa-3x"></i></span><br>
                            Oups! Pas de données disponibles
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="showLoading != false">
                          <div class="loading-inline" style="height: 120px; margin-top: 25%">
                            <div class="loading-icon"></div>
                            <br>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div :style="sda_vals.length <= 0 ? 'opacity: 0.4' : ''" class="box-account phone-status-bloc is-hoverable" style="height: 49%">
                      <div class="box-container">
                        <div class="box-title">
                          Appels émis
                          <i class="material-symbols-outlined size-l">show_chart</i>
                        </div>
                        <div class="box-content" v-show="showLoading != true">
                          <div v-show="sda_vals.length > 0" class="has-text-centered" style="height: 100px;">
                            <canvas id="chartLineCpuRam"></canvas>
                          </div>
                          <div v-show="sda_vals.length <= 0" class="has-text-centered" style="height: 120px; margin-top: 10%">
                            <span><i class="fa fa-frown fa-3x"></i></span><br>
                            Oups! Pas de données disponibles
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="showLoading != false">
                          <div class="loading-inline" style="height: 120px; margin-top: 10%">
                            <div class="loading-icon"></div>
                            <br>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div :style="sda_vals.length <= 0 ? 'opacity: 0.4' : ''" class="box-account phone-status-bloc is-hoverable" style="height: 49%; align-self: flex-end">
                      <div class="box-container">
                        <div class="box-title">
                          Appels reçu
                          <i class="material-symbols-outlined size-l">show_chart</i>
                        </div>
                        <div class="box-content"  v-show="showLoading != true">
                          <div v-show="sda_vals.length > 0" class="has-text-centered" style="height: 100px;">
                            <canvas id="chartLineOtherGraph"></canvas>
                          </div>
                          <div v-show="sda_vals.length <= 0" class="has-text-centered" style="height: 120px; margin-top: 10%">
                            <span><i class="fa fa-frown fa-3x"></i></span><br>
                            Oups! Pas de données disponibles
                          </div>
                        </div>
                        <div class="box-content has-text-centered" v-show="showLoading != false">
                          <div class="loading-inline" style="height: 120px; margin-top: 10%">
                            <div class="loading-icon"></div>
                            <br>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--
                    <div class="box-account storage-bloc is-hoverable" style="height: 130px" :style="(!currentSDA || !currentSDA.trunk_infos || !currentSDA.trunk_infos.username) ? 'opacity: 0.4' : 'opacity: 1'">
                    -->
                    <div class="box-account storage-bloc is-hoverable" style="height: 150px; opacity: 0.4">
                    <div class="box-container">
                    <div class="box-title">
                      Détails
                      <i class="material-symbols-outlined size-l">bar_chart</i>
                    </div>
                    <div class="box-content has-text-centered" v-show="showLoading != false">
                      <div class="loading-inline" style="margin-top: 2%">
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
                <div class="box-account options-bloc is-hoverable">
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
                          <div @click="toggleCheckboxes()" class="option active" style="cursor: pointer">
                            <span>
                              <i class="icon-hover material-symbols-outlined size-xxl" style="color: #ed5565">delete</i>
                            </span>
                            <span>
                              Résilier
                            </span>
                          </div>
                          <div class="option">
                            <span>
                              <i class="icon-hover material-symbols-outlined size-xxl">update</i>
                            </span>
                            <span>
                              Associer
                            </span>
                          </div>
                          <div class="option">
                            <span>
                              <i class="icon-hover material-symbols-outlined size-xxl">update</i>
                            </span>
                            <span>
                              Renvoi
                            </span>
                          </div>
                          <div class="option">
                            <span>
                              <i class="icon-hover material-symbols-outlined size-xxl">update</i>
                            </span>
                            <span>
                              File d'attente
                            </span>
                          </div>
                          <div class="option">
                            <span>
                              <i class="icon-hover material-symbols-outlined size-xxl">update</i>
                            </span>
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


      <ModalEditSDA v-if="isEditSDA" :item="itemsdaselected" :allitems="currentSDA.trunk_infos" @editSDA="getEditSDA" :active="isEditSDA ? true : false"></ModalEditSDA>
      <CheckResiliation
        :active="isResiliationModalActive"
        :numbersToResiliate="selectedSDAs"
        @close="isResiliationModalActive = false"
        @confirm="handleResiliationConfirmation"
      />



    </div>
    </div>

    </div>
</template>

<script>
import ModalEditSDA from '../sda/EditSDA.vue'
import CheckResiliation from '../../modal/CheckResiliation.vue'
import TagInput from '../../modal/TagInput.vue'

export default {
  name: 'ProductSDA',
  props: {
    msg: String,
    tab: Boolean,
  },
  components: {
    ModalEditSDA,
    CheckResiliation,
    TagInput
  },
  data () {
    return {
      isResiliationModalActive: false,
      showCheckboxes: false,
      selectedSDAs: [],
      hoveredSda: null,
      servers: [],
      search_badges: [],
      isSearchError: false,
      totalcallvals: 0,
      showLoading: true,
      currentSDA: null,
      timer: '',
      isSDAActif: false,
      isSDAInactif: false,
      sda_vals: [],
      isEditing: null,
      editedCommonName: '',
      sortKey: 'sda',
      sortOrder: 'asc',
      isEditSDA: false,
      itemsdaselected: []
    }
  },
  async mounted () {
    this.$loader = true
    this.showLoading = true
    this.showLoading = false
    this.$loader = false
    await this.getSda()
  },
  methods: {
    openResiliationModal() {
      if (this.selectedSDAs.length > 0) {
        this.isResiliationModalActive = true
      } else {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Vous n\'avez aucune sda séléctionnée',
          msg: 'Veuillez séléctionner les sda que vous souhaitez résilier',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
      }      
    },
    async handleResiliationConfirmation() {
      if (this.selectedSDAs.length === 0) {
          return;
      }
      this.$loader = true
      const header = {
          'Content-Type': 'application/json'
      };
      const params = {
          sda_names: this.selectedSDAs
      };
      try {
          const response = await this.$axios.post(
              `${process.env.ODOO_API}api/v2/products/sda/terminate?session_id=${this.user.session_id}`,
              { params },
              { headers: header }
          );
          if (response.data.result) {
              await this.getSda();
              this.$toastr.Add({
                name: 'SuccesData',
                title: 'Résiliation de SDA',
                msg: 'Votre demande de résiliation a été effectuée',
                clickClose: true,
                timeout: 3000,
                progressBarValue: 0,
                position: 'toast-top-right',
                type: 'success',
                preventDuplicates: true,
                classNames: ['animated', 'slideInRight'],
                style: { 'margin-top': '20%' }
              })
          }
          this.selectedSDAs = [];
      } catch (error) {
          console.error('Error terminating SDAs:', error);
      }
      this.$loader = false
    },
    toggleCheckboxes() {
      this.showCheckboxes = !this.showCheckboxes;
      if (!this.showCheckboxes) {
        this.selectedSDAs = []; // Réinitialise la sélection si on cache les checkboxes
      }
    },
    getEditSDA (value) {
      this.isEditSDA = value
    },
    editSDA (item) {
      this.isEditSDA = true
      this.itemsdaselected = item
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
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products/command?type=contract&number=' + contract)
      }, 1000)
    },
    getNumberofActifSdas () {
      if (this.sdas && this.sdas.length > 0) {
        let connected = 0
        for (let s of this.sdas) {
          if (s.status === 'occupied' && s.final_client.length > 0) {
            connected += 1
          }
        }
        return connected.toString() + ' / ' + (this.sdas.length).toString()
      } else {
        return 'Aucune SDA trouvée'
      }
    },
    updateIsSDAActif () {
      if (this.isSDAActif === true) {
        this.isSDAActif = false
      } else {
        if (this.isSDAInactif === true) {
          this.isSDAInactif = false
        }
        this.isSDAActif = true
      }
    },
    updateIsSDANotActif () {
      if (this.isSDAInactif === true) {
        this.isSDAInactif = false
      } else {
        if (this.isSDAActif === true) {
          this.isSDAActif = false
        }
        this.isSDAInactif = true
      }
    },
    setCurrentSDA (value) {
      this.showLoading = true
      setTimeout(() => {
        this.currentSDA = value
        this.showLoading = false
      }, 500)
    },
    async getSda () {
      await this.$store.dispatch('fetchSDAs')
    }
  },
  watch: {
    get_sdas: {
      handler(newList) {
        if (newList.length > 0 && (!this.currentSDA || !newList.some(item => item.name === this.currentSDA.name))) {
          this.setCurrentSDA(newList[0]);
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    occupiedSdas() {
      return this.$store.getters.totalOccuppiedSdas || 0;
    },
    totalSdas() {
      return this.$store.getters.totalSdas;
    },
    sdas () {
      return this.$store.getters.sdas
    },
    get_sdas () {
      let csdas = this.sdas
      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ').toLowerCase()
        csdas = csdas.filter(sda => {
          return s.toLowerCase().split(' ').every(v =>
            (sda.name && sda.name.toLowerCase().includes(v)) ||
            (sda.final_client && sda.final_client.toLowerCase().includes(v))
          )
        })
      }

      if (this.isSDAActif) {
        csdas = csdas.filter(s => {
          if (s.status === 'free') {
            return s
          }
        })
      }
      if (this.isSDAInactif) {
        csdas = csdas.filter(s => {
          if (s.status === 'occupied') {
            return s
          }
        })
      }
      if (this.currentSDA && this.currentSDA.length < 1 && csdas && csdas.length > 0) {
        this.currentSDA = csdas[0]
      }
      return csdas
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

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid white;
  background-color: transparent;
  cursor: pointer;
  position: relative;
}

input[type="checkbox"]:checked::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
