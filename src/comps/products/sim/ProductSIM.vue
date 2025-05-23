<template>
  <div>
    <div class="container is-max-widescreen">
      <div class="columns is-desktop mt-1" style="padding-right: 0.75rem">

        <!--
        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
          <div class="fieldset">
            <label>
              Consommation de mon parc
            </label>
            <div class="fieldset-content">
              <div class="no-data">
                <div class="has-text-centered" style="height: 100px; opacity: 0.4">
                  <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                  Oups! Pas de données disponibles
                </div>
              </div>
              <div class="">
                <div class="columns mb-3">
                  <div class="column">
                    au 14/02/2025
                  </div>
                  <div class="column has-text-right"><a href="#/pay-consumption" class="">
                    <button disabled="disabled" class="button is-admin-primary">
                      Régler mon encours
                    </button></a>
                  </div>
                </div>
                <p class="has-text-right oneline status-success" style="width: max-content;">
                  0,00 €
                </p>
                <div class="progress-wrapper status-success mb-2" style="--value: 0;"><progress max="100" class="progress is-small is-darkgrey" value="0">0</progress></div> <div class="d-flex justify-content-between"><div>
                  0
                </div>
                <div>
                  120,00 €
                </div>
                </div></div>

            </div>
          </div>
        </div>
        -->

        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
          <div
            :style="totalSIMNotActivated === 0 ? 'pointer-events: none; opacity: 0.5;' : ''"
            class="fieldset" 
            title="Liste des SIM à activer">
            <label>
              Mes forfaits à activer
            </label>
            <div class="fieldset-content">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="has-text-white">
                    <b>{{ totalSIMNotActivated }} forfait </b> à activer
                  </span>
                </div>
                <div>
                  <a @click="activateSIM()" class="button is-admin-primary">
                    Activer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-left: 0rem; padding-right: 1rem;">
          <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" @click="goToCommand()">
            <i class="material-symbols-outlined size-l">sim_card</i>
            Commander une SIM
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
                <div class="column services-card" style="padding-top: 0; padding-bottom: 0.75em;">
                  <div class="field mb-0 align-items-center has-addons">
                    <label class="mr-3">
                      Filtrer par:
                    </label>
                    <div class="control pills-v2" style="margin-right: 0.5rem">
                      <label class="b-radio radio button" :class="isActif == true ? 'is-admin-white' : ''">
                        Disponible
                        <input type="radio" value="date" @click="updateIsActif()">
                      </label>
                    </div>
                    <div class="control pills-v2">
                      <label class="b-radio radio button" :class="isInactif == true ? 'is-admin-white' : ''">
                        Occupé
                        <input type="radio" value="state" @click="updateIsInActif()">
                      </label>
                    </div>
                    <label class="ml-3" v-if="isSearchError == false">
                      {{ filteredSims.length }} <span v-if="filteredSims.length > 1">résultats</span><span
                        v-else>résultat</span>
                    </label>
                    <label class="ml-3" v-if="isSearchError == true">
                      0 <span>résultat</span>
                    </label>
                  </div>
                </div>

                <div class="collapse active" v-show="isSearchError == false" style="overflow-y: auto; overflow-x: hidden; height: 680px">
                  <div class="collapse-trigger" v-for="sim of filteredSims" :key="sim.id">
                    <div role="button" @click="setCurrentSim(sim)" class="card-header card-ipbx"
                      :class="currentSim && sim.id == currentSim.id ? 'card-active' : ''" 
                      @mouseover="hoveredSim = sim.id" 
                      @mouseleave="hoveredSim = null">
                      <div class="card-header-title">
                        <a style="align-self: center; margin-right: 20px">
                          <i class="material-icons"
                            :style="sim.status == 'free' ? 'color: gray' : 'color: #21bf26'">sim_card</i>
                        </a>
                        <span style="margin-right: auto;">
                          <span @click="copyTEXT(sim.name)">{{ sim.name }}</span> <span v-if="sim.label">({{sim.label}})</span>
                          <br>
                          <small @click="copyTEXT(sim.contract_name)" v-if="sim.contract_name.length > 0">
                            {{sim.contract_name}}
                          </small>
                          <small v-else>
                            Non attribué
                          </small>
                        </span>

                        <!--
                        <div class="icon-wrapper" :class="{ 'visible': hoveredSim === sim.id }" style="padding-right: 1em; text-align: right;">
                          <a v-if="currentSim" title="Révoquer" @click="revokeSim()" class="is-admin-secondary-light is-medium">
                            <i class="material-symbols-outlined size-l" style="color: #ed5565">delete</i>
                          </a>
                        </div>
                        -->
                      </div>
                    </div>
                  </div>
                </div>

                <div class="collapse active" v-show="isSearchError == true" style="overflow-y: auto; height: 680px">
                  <div class="collapse-trigger">
                    <div>
                      <p style="text-align-last: center; padding: 20px; color: #ff4d4d; font-size: 15px;">
                        Aucun résultat n'a été trouvé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="datas" style="margin-right: 0;">
                <div class="fieldset-content wrapper">
                  <div class="field mb-0"></div>
                  <div class="field mb-0" style="min-width: 300px; justify-self: right;">
                    <TagInput
                    :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="wrapper">
                  <div class="box-account net-status-bloc is-hoverable" style="height: 370px" :style="!currentSimFullInfos ? 'opacity: 0.4' : ''">
                    <div class="box-container">
                      <div class="box-title">
                        Détails de la SIM
                        <i class="material-symbols-outlined size-l">info</i>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading == true">
                        <div class="loading-inline" style="margin-top: 20%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                      <div class="box-content" v-show="showLoading == false">
                        <div v-if="currentSim && currentSimFullInfos">
                          <div class="signal-list">
                            <div class="label">Numéro de contrat</div>
                            <div title="Numéro de contrat associé au trunk" class="label" @click="goToContract(currentSim.contract_number)">
                              {{ currentSim.contract_number }}
                            </div>
                          </div>
                          <div class="signal-list" @click="copyTEXT(currentSimFullInfos.parent.offer)">
                            <div class="label">Offre</div>
                            <div class="label">{{ currentSimFullInfos ? currentSimFullInfos.parent.offer : 'N/A' }}</div>
                          </div>
                          <div class="signal-list" @click="copyTEXT(currentSimFullInfos.parent.user)">
                            <div class="label">Utilisateur</div>
                            <div class="label">{{ currentSimFullInfos ? currentSimFullInfos.parent.user : 'N/A' }}</div>
                          </div>
                          <!--
                          <div class="signal-list" @click="copyTEXT(currentSimFullInfos.parent.price_monthly)">
                            <div class="label">Prix mensuel</div>
                            <div class="label">{{ currentSimFullInfos ? currentSimFullInfos.parent.price_monthly + '€' : 'N/A' }}</div>
                          </div>
                          -->
                          <div class="signal-list" @click="copyTEXT(currentSimFullInfos.parent.engagement)">
                            <div class="label">Engagement</div>
                            <div class="label">{{ currentSimFullInfos ? currentSimFullInfos.parent.engagement : 'N/A' }}</div>
                          </div>
                          <div class="signal-list">
                            <div class="label">NDI</div>
                            <div class="label">{{ currentSimFullInfos ? currentSimFullInfos.parent.ndi : 'N/A' }}</div>
                          </div>
                        </div>
                        <div v-if="currentSimFullInfos && currentSimFullInfos.parent && currentSimFullInfos.parent.characteristics">
                          <div v-for="(c, index) in currentSimFullInfos.parent.characteristics" :key="index">
                            <div class="signal-list">
                              <div class="label">{{ c.name }}</div>
                              <div class="label" @click="copyTEXT(c.value)">
                                {{ c.value }}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-else class="has-text-centered">
                          <div style="height: 120px; margin-top: 25%">
                            <span><i class="fa fa-frown fa-3x"></i></span><br>
                            Oups! Pas de données disponibles
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="box-account phone-status-bloc is-hoverable" style="height: 49%" :style="!currentSimFullInfos ? 'opacity: 0.4' : ''">
                    <div class="box-container">
                      <div class="box-title">
                        Mes Ressources
                        <i class="material-symbols-outlined size-l">inventory</i>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading == true">
                        <div class="loading-inline" style="margin-top: 10%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                      <div class="box-content" v-show="showLoading == false">
                        <div v-if="currentSimFullInfos && currentSimFullInfos.parent && currentSimFullInfos.parent.resource_details" style="overflow: auto; height: 100px;">
                          <div v-for="(r, key) in currentSimFullInfos.parent.resource_details" :key="key">
                            <div class="signal-list">
                              <div class="label">{{ r.name }}</div>
                              <div class="label" @click="copyTEXT(r.value)">
                                {{ r.value }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="has-text-centered" v-else>
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="box-account phone-status-bloc is-hoverable" style="height: 49%; align-self: flex-end" 
                    :style="!currentSimFullInfos ? 'opacity: 0.4' : ''">
                    <div class="box-container">
                      <div class="box-title">
                        Ma consommation
                        <i class="material-symbols-outlined size-l">bar_chart</i>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading == true">
                        <div class="loading-inline" style="margin-top: 2%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                      <div class="box-content" v-show="showLoading == false">
                        <div class="container" v-if="currentSim && currentSimFullInfos">
                          <div class="storage">
                            {{ getConsommationName() }}
                          </div>
                          <div class="custom-progress-bar" :class="getConsommationColor()" :title="getProgressTooltip()">
                            <div
                              class="forecast-segment"
                              :style="{ width: getForecastPercentage() + '%' }"
                              v-if="currentSimFullInfos.parent.projected_consumed_mo">
                            </div>
                            <div
                              class="real-segment"
                              :style="{ width: getPercentageUsedData() + '%' }">
                            </div>
                          </div>
                          <span>{{ getTotalConsumedMo() }}</span>
                          /
                          <span :class="getConsommationColor()" v-if="currentSimFullInfos.parent.projected_consumed_mo">{{ getGo(currentSimFullInfos.parent.projected_consumed_mo) + ' /' }}</span>
                          <span>{{ getTotalConsumableMo() }}</span>
                        </div>
                        <div v-else class="container has-text-centered">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                    </div>
                  </div>


                  <div class="box-account storage-bloc is-hoverable" style="height: 150px"
                    :style="!currentSimFullInfos ? 'opacity: 0.4' : ''">
                    <div class="box-container">
                      <div class="box-title">
                        Mes Options
                        <i class="material-symbols-outlined size-l">settings</i>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading == true">
                        <div class="loading-inline" style="margin-top: 2%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                      <div class="box-content" v-show="showLoading == false">
                        <div class="options" v-if="currentSimFullInfos && currentSimFullInfos.options.length">
                          <div class="list-options">
                            <div v-for="opt in currentSimFullInfos.options" 
                                :key="opt.idsale" 
                                :title="opt.product"
                                class="option" :class="opt.product_state === 'Actif' ? 'active' : ''">
                                <span>
                                  <i class="icon-hover material-symbols-outlined size-xxl">{{ getOptionIcon(opt.product) }}</i>
                                </span>
                                <!--
                                <span>{{opt.product}}</span>
                                -->
                            </div>
                          </div>
                        </div>
                        <div v-else class="has-text-centered">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                    </div>
                  </div>
                  

                  <div class="box-account options-bloc is-hoverable">
                    <div class="box-container">
                      <div class="box-title">
                        Mes actions
                      </div>
                      <div class="box-content">
                        <div class="box-options">
                          <div class="list-options">
                            <div @click="viewDetails()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">data_usage</i>
                              </span>
                              <span>Détails des consommations</span>
                            </div>

                            <div @click="blockLine()" class="option" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">block</i>
                              </span>
                              <span>Bloquer la ligne</span>
                            </div>

                            <div @click="terminateContract()" class="option" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">cancel</i>
                              </span>
                              <span>Résilier</span>
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
      </div>
    </div>
    
  </div>
</template>

<script>
import Chart from 'chart.js';
//import CheckAction from '../../modal/CheckAction.vue';
import TagInput from '../../modal/TagInput.vue'

export default {
  name: 'ProductSIM',
  
  components: {
    TagInput,
    //CheckAction
  },

  props: {
    msg: String,
    tab: Boolean
  },

  data() {
    return {
      hoveredSim: null,
      search_badges: [],
      isSearchError: false,
      isActif: false,
      isInactif: false,
      isActivateSim: false,
      currentSim: null,
      currentSimFullInfos: null,
      showLoading: false,
      usageData: null,
      isRevokeSim: false,
      pendingSims: []
    };
  },

  async mounted () {
    await this.getSim()
  },
  watch: {
    filteredSims: {
      handler(newList) {
        if (newList.length > 0 && (!this.currentSim || !newList.some(item => item.name === this.currentSim.name))) {
          this.setCurrentSim(this.sortedSims(newList)[0]);
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },

    sims() {
      return this.$store.getters.sims;
    },

    filteredSims() {
      let filtered = this.sims || [];
      
      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ').toLowerCase()
        filtered = filtered.filter(sim => {
          return s.toLowerCase().split(' ').every(v =>
            (sim.name && sim.name.toLowerCase().includes(v)) ||
            (sim.label && sim.label.toLowerCase().includes(v)) ||
            (sim.contract_name && sim.contract_name.toLowerCase().includes(v))
          )
        })
      }
      if (this.isActif) {
        filtered = filtered.filter(sim => sim.status === 'free');
      }
      if (this.isInactif) {
        filtered = filtered.filter(sim => sim.status !== 'free');
      }
      this.isSearchError = filtered.length === 0;
      return this.sortedSims(filtered);
    },

    totalSIMNotActivated() {
      return (this.$store.getters.totalSims - this.$store.getters.totalOccuppiedSims) || 0
    },

    totalSIM() {
      return this.$store.getters.totalSims || 0
    },
  },

  methods: {
    async copyTEXT(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
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
        });
      } catch (e) {
        console.log(e);
      }
    },
    viewDetails () {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/sim/consommation?name=' + this.currentSim.reference);
      }, 1000);
    },
    async getSim () {
      await this.$store.dispatch('fetchSIMs')
    },
    getOptionIcon(optionName) {
      let icon = ""
      if (optionName.toLowerCase().includes('5g')) {
        icon = "5g"
      } else if (optionName.toLowerCase().includes('conférence')) {
        icon = "groups";
      } else if (optionName.toLowerCase().includes('cut off')) {
        icon = "public_off";
      } else if (optionName.toLowerCase().includes('messagerie')) {
        icon = "voicemail";
      } else if (optionName.toLowerCase().includes('sva')) {
        icon = "phone_disabled";
      }
      return icon
    },
    getProgressTooltip() {
      const data = this.currentSimFullInfos?.parent?.balance?.[0];
      const projStr = this.currentSimFullInfos?.parent?.projected_consumed_mo;

      if (!data) return 'Aucune donnée disponible.';

      const consumed = parseFloat(data.consumed_mo.replace(/[^\d.]/g, '')) || 0;
      const total = parseFloat(data.total_consumable_mo.replace(/[^\d.]/g, '')) || 0;
      const percentUsed = total ? ((consumed / total) * 100).toFixed(1) : 0;

      if (!projStr) {
        return `Utilisation actuelle : ${percentUsed}%\nEstimation : non disponible.`;
      }

      let projected = parseFloat(projStr.replace(/[^\d.]/g, '')) || 0;
      const diff = ((total - projected) / total) * 100;
      let colorMeaning = '';

      if (diff >= 20) colorMeaning = 'Prévision confortable';
      else if (diff >= 10) colorMeaning = 'Prévision modérée';
      else colorMeaning = 'Prévision critique';
      projected = projected ? `${(projected / 1024).toFixed(2)} Go` : "N/A";

      return `Utilisation actuelle : ${percentUsed}%\nEstimation mensuelle : ${projected}\n${colorMeaning}`;
    },
    getForecastPercentage() {
      const data = this.currentSimFullInfos?.parent?.balance?.[0];
      const projStr = this.currentSimFullInfos?.parent?.projected_consumed_mo;

      if (!data || !projStr) return 0;

      const projected = parseFloat(projStr.replace(/[^\d.]/g, '')) || 0;
      const total = parseFloat(data.total_consumable_mo.replace(/[^\d.]/g, '')) || 0;

      return total ? ((projected / total) * 100).toFixed(1) : 0;
    },
    getConsommationColor() {
      const data = this.currentSimFullInfos?.parent?.balance?.[0];
      const projStr = this.currentSimFullInfos?.parent?.projected_consumed_mo;

      if (!data || !projStr) return 'custom-grey';

      const projected = parseFloat(projStr.replace(/[^\d.]/g, '')) || 0;
      const total = parseFloat(data.total_consumable_mo.replace(/[^\d.]/g, '')) || 0;
      if (total === 0) return 'custom-grey';

      const diffPercent = ((total - projected) / total) * 100;

      if (diffPercent >= 20) return 'custom-green';
      if (diffPercent >= 10) return 'custom-orange';
      return 'custom-red';
    },
    getConsommationName() {
      if (!this.currentSimFullInfos || !this.currentSimFullInfos.parent.balance || this.currentSimFullInfos.parent.balance.length === 0) {
        return "";
      }
      return this.currentSimFullInfos.parent.balance[0].name ? this.currentSimFullInfos.parent.balance[0].name : ''
    },
    getGo(val) {
      if (!val) {
        return "N/A";
      }
      const total = parseFloat(val.replace(/[^\d.]/g, '')) || 0;
      return total ? `${(total / 1024).toFixed(2)} Go` : "N/A";
    },
    getTotalConsumableMo() {
      if (!this.currentSimFullInfos || !this.currentSimFullInfos.parent.balance || this.currentSimFullInfos.parent.balance.length === 0) {
        return "N/A";
      }
      const firstItem = this.currentSimFullInfos.parent.balance[0];
      const total = parseFloat(firstItem.total_consumable_mo.replace(/[^\d.]/g, '')) || 0;
      return total ? `${(total / 1024).toFixed(2)} Go` : "N/A"; // Conversion Mo → Go
    },
    getTotalConsumedMo() {
      if (!this.currentSimFullInfos || !this.currentSimFullInfos.parent.balance || this.currentSimFullInfos.parent.balance.length === 0) {
        return "N/A";
      }
      const firstItem = this.currentSimFullInfos.parent.balance[0];
      const total = parseFloat(firstItem.consumed_mo.replace(/[^\d.]/g, '')) || 0;
      return total ? `${(total / 1024).toFixed(2)} Go` : "N/A"; // Conversion Mo → Go
    },
    getPercentageUsedData() {
      if (!this.currentSimFullInfos || !this.currentSimFullInfos.parent.balance || this.currentSimFullInfos.parent.balance.length === 0) {
        return 0;
      }
      const firstItem = this.currentSimFullInfos.parent.balance[0];
      const totalConsumable = parseFloat(firstItem.total_consumable_mo.replace(/[^\d.]/g, '')) || 0;
      const totalConsumed = parseFloat(firstItem.consumed_mo.replace(/[^\d.]/g, '')) || 0;
      return totalConsumable !== 0 ? (totalConsumed / totalConsumable) * 100 : 0;
    },
    async getUsageData() {
      try {
        const response = await this.$axios.get(
          `${process.env.ODOO_API}api/v2/usage?session_id=${this.user.session_id}`
        );
        this.usageData = response.data;
      } catch (error) {
        console.error('Error fetching usage data:', error);
      }
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    },

    getStatusClass(amount) {
      return amount > 80 ? 'status-warning' : 'status-success';
    },

    getUsagePercentage(amount) {
      return (amount / 90) * 100;
    },

    updateIsActif() {
      this.isActif = !this.isActif;
      if (this.isActif) {
        this.isInactif = false;
      }
    },

    updateIsInActif() {
      this.isInactif = !this.isInactif;
      if (this.isInactif) {
        this.isActif = false;
      }
    },

    sortedSims(sims) {
      return sims.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    },

    async activatePendingSims() {
      const simIds = this.pendingSims.map(sim => sim.id);
      try {
        await this.$axios.post(
          `${process.env.ODOO_API}api/v2/sim/activate`,
          { sim_ids: simIds },
          { params: { session_id: this.user.session_id } }
        );
        await this.getSimsData();
        this.$toastr.success('Les cartes SIM ont été activées avec succès');
      } catch (error) {
        this.$toastr.error('Erreur lors de l\'activation des cartes SIM');
      }
    },

    async setCurrentSim(sim) {
      this.showLoading = true;
      this.currentSim = sim;
      try {
        const response = await this.$axios.get(
          `${process.env.ODOO_API}api/v2/sim/infos?resource=${sim.reference}`,
          { params: { session_id: this.user.session_id } }
        );

        if (response.data && response.data.response === false) {
          this.currentSimFullInfos = null;
        } else {
          this.currentSimFullInfos = response.data;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos SIM:', error);
        this.$toastr.error('Impossible de récupérer les informations du forfait.');
      }
      this.showLoading = false;
    },

    goToContract (contract) {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products/command?type=contract&number=' + contract)
      }, 1000)
    },

    goToCommand() {
      this.$router.push('/products/command?type=sim');
    },

    goToUsage() {
      if (this.currentSim) {
        this.$router.push(`/products/sim/usage?id=${this.currentSim.id}`);
      }
    },

    goToSettings() {
      if (this.currentSim) {
        this.$router.push(`/products/sim/settings?id=${this.currentSim.id}`);
      }
    },

    revokeSim() {
      this.isRevokeSim = true;
    },

    async getRevokeStatus(value) {
      if (value && this.currentSim) {
        try {
          await this.$axios.post(
            `${process.env.ODOO_API}api/v2/sim/revoke`,
            { sim_id: this.currentSim.id },
            { params: { session_id: this.user.session_id } }
          );
          await this.getSimsData();
          this.$toastr.success('La carte SIM a été révoquée avec succès');
        } catch (error) {
          this.$toastr.error('Erreur lors de la révocation de la carte SIM');
        }
      }
      this.isRevokeSim = false;
    },

    getRevokeSim(value) {
      this.isRevokeSim = value;
    },

  }
};
</script>

<style scoped>
.custom-progress-bar {
  position: relative;
  height: 8px;
  margin-bottom: 0.5rem;
  width: 100%;
  background-color: var(--iprateur-menu-list-background-color);
  border-radius: 290486px;
  overflow: hidden;
}

/* Prévision (en fond, semi-transparent bleu) */
.forecast-segment {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(33, 150, 243, 0.3);
  z-index: 1;
}

.real-segment {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 2;
  background-color: #21bf26; /* par défaut */
  transition: width 0.3s ease;
}
.custom-green {
  color: #21bf26;
}
.custom-orange {
  color: #ff9800;
}
.custom-red {
  color: #f44336;
}

.custom-green .forecast-segment {
  background-color: rgba(33, 191, 38, 0.2);
}
.custom-orange .forecast-segment {
  background-color: rgba(255, 152, 0, 0.2);
}
.custom-red .forecast-segment {
  background-color: rgba(244, 67, 54, 0.2);
}

.custom-green .real-segment {
  background-color: #21bf26;
}
.custom-orange .real-segment {
  background-color: #ff9800;
}
.custom-red .real-segment {
  background-color: #f44336;
}

@keyframes heartbeat {
    0% {
      color: white; /* Couleur initiale */
    }
    50% {
      color: #00a4c3; /* Couleur de surbrillance */
    }
    100% {
      color: black; /* Couleur initiale */
    }
  }

  .heartbeat {
    animation: heartbeat 3s infinite; /* Animation avec une durée de 1 seconde, en boucle */
  }

  .yellow-icon {
    color: yellow;
  }

.icon-wrapper {
  opacity: 0;
  transition: opacity 0.5s ease-in-out; /* Transition en douceur pour le fade */
}

.icon-wrapper.visible {
  opacity: 1;
}
</style>