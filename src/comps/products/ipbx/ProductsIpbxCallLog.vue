<template>
    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box" v-if="user.id_company && user.id_company === 1" v-show="user.id_company && user.id_company === 1">
        
        <div class="dashboard" style="padding-bottom: 0px">
          <div class="container is-max-widescreen">
          
            <section class="section-title">
              <h1 class="dashboard-zone">
                <a @click="goToProducts()" class="router-link-active">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                        <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                            <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                        </g>
                    </svg>
                </a>

                 IPBX {{ipbxName}} - Journal d'appel
              </h1>

              <div>
                {{ dateStart }} - {{ dateEnd }}
              </div>
              
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
                  Analyse des appels
                </label>

                <div class="fieldset-content h-100 mb-0">
                  <div class="stats-section">
                    <div class="stats-content">
                      <canvas id="doughnut-chart-type" class="doughnut-chart"></canvas>
                      <div class="stats-title" title="Nombre d'appels par sens">Type</div>
                    </div>
                    <div class="stats-content">
                      <canvas id="doughnut-chart-answer" class="doughnut-chart"></canvas>
                      <div class="stats-title" title="Nombre d'appels abouti et échoué">Répondu</div>
                    </div>
                    <div class="stats-content">
                      <canvas id="bar-chart-hour" class="bar-chart"></canvas>
                      <div class="stats-title" title="Nombre d'appels par heure de la journée">Fréquence</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            
            <section>
              <div class="fieldset mb-5">
                <label>
                  Liste des appels
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
                                :modelValue="searchInput"
                                @update:modelValue="searchInputChange">
                                </TagInput>
                            </div>
                        </div>
                        
                        <div class="d-flex" style="float: right; margin-right: 2em;">
                          <div class="field">
                            <div class="form-group">
                              <div 
                                class="input-label-container focused"
                              >
                                <div class="input-label">
                                  <label  class="switch is-rounded">
                                    <div :class="{'selected': !periodDate}">Récent</div>
                                    <input type="checkbox" true-value="true" value="false" @click="periodCheckbox($event)">
                                    <span class="check ml-1"></span>
                                    <span class="control-label"></span>
                                    <div :class="{'selected': periodDate}">Date</div>
                                  </label>
                                </div>
               
                                <div class="period-select-border" :class="periodSelectIsFocused ? 'focused' : ''">
                                  <div v-if="!periodDate" style="margin-top: 4px;">
                                    <select id="period-select" v-model="selectedPeriod" @change="handlePeriodChange" class="period-select"
                                    @focus="handleOpen" @blur="handleClose">
                                      <option value=1 title="Affiche jour par jour">Jour</option>
                                      <option value=7 title="Affiche par période de 7 jours">Semaine</option>
                                      <option value=30 title="Affiche par période de 30 jours">Mois</option>
                                    </select>
                                  </div>
                                  <div v-else style="margin-top: 8px;">
                                    <div class="input-date-container"
                                      @click="toggleCalendar"
                                 
                                      title="Sélection manuelle de la période (début et fin)">
                                      <span class="input-date">
                                        {{ formatDate(selectedDateRange.start) }} - {{ formatDate(selectedDateRange.end) }}
                                      </span>
                                    </div>
                                    <div v-if="showCalendar" class="calendar-dropdown" v-click-outside="hideCalendar">
                                      <v-date-picker
                                        is-range
                                        :min-date="minDate"
                                        :max-date="maxDate"
                                        v-model="selectedDateRange"
                                        is-inline
                                      />
                                      <div class="button-container-right">
                                        <button type="button" class="button is-admin-primary is-large" @click="applyDates">Appliquer</button>
                                      </div>
                                    </div>
                                    
                                  </div>
                                  
                                </div>
                              </div>
                            </div>


                            
                          </div>
                        </div>

                      <table class="table table-clickable ipbx-call-log-table">
                        <thead>
                          <tr>
                            <th style="width: 16%" class="is-sortable">
                                <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('unix_time')">Date
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc">
                                            <i :class="sortKey === 'ca' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortKey === 'ca' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>
                                </div>
                            </th>

                            <th style="width: 18%" class="is-current-sort is-sortable">
                                <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('type')"
                                  title="Indique les évements importants de l'appel">
                                  Statut
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc">
                                            <i :class="sortKey === 'port' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortKey === 'port' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>
                                </div>
                            </th>

                            <th style="width: 26%" class="is-sortable">
                                <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('caller')"
                                  title="Affiche le nome et le numéro de la personne ayant appelé">
                                  Appelant
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc">
                                            <i :class="sortKey === 'ca_label' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortKey === 'ca_label' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>
                                </div>
                            </th>

                            <th style="width: 26%" class="is-current-sort is-sortable">
                                <div class="th-wrap" style="white-space: nowrap;" @click="sortTable('callee')">Appelé
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc">
                                            <i :class="sortKey === 'organisation' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortKey === 'organisation' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </th>

                            <th style="width: 14%" class="is-current-sort is-sortable">
                                <div class="th-wrap has-text-centered pl-4" style="white-space: nowrap;" @click="sortTable('last_call_duration')"
                                    title="Affiche la durée du dernier appel.">Durée
                                    <div class="">
                                        <span class="icon-container icon is-small is-desc">
                                            <i :class="sortKey === 'ip_address' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                            <i :class="sortKey === 'ip_address' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                        </span>
                                    </div>                            
                                </div>
                            </th>
                          </tr>
                        </thead>

                        <tbody v-for="call of callLogs" :key="call.unique_id">
                          <tr draggable="false" class="" @click="openCallFlow(call.unique_id)">

                            <td data-label="Date" class="">
                              {{call.date}} - {{call.time}}
                            </td>

                            <td data-label="Statut" class="ipbx-call-log-statut-container">
                              <div class="ipbx-call-log-statut-elt">
                                <span class="material-symbols-outlined p-0 wght-l"
                                  :class="call.type !== 'internal' ? 'fa-rotate-90':''"
                                  :style="colorStatus(call)"
                                  :title="titleStatus(call)">
                                  {{ iconStatus(call) }}
                                </span>
                              </div>
                              <!--<div v-if="call.status.fail" class="fa fa-times" style="font-size: 1rem !important;"></div>-->
                              <div class="ipbx-call-log-statut-elt">
                                <span class="material-symbols-outlined p-0 wght-l"
                                  :class="{'disabled': !call.status.queue}"
                                  :title="call.status.queue ? 'Appel reçu par une file d\'attente' : 'Appel ne passant par une file d\'attente'"
                                  >group
                                </span>
                              </div>
                              <div class="ipbx-call-log-statut-elt">
                                <span class="material-symbols-outlined p-0 wght-l"
                                  :class="{'disabled': !call.status.svi}"
                                  :title="call.status.svi ? 'Appel reçu par un SVI' : 'Appel ne passant par un SVI'"
                                  >storage
                                </span>
                              </div>
                              <div class="ipbx-call-log-statut-elt">
                                <span class="material-symbols-outlined p-0 wght-l"
                                  :class="{'disabled': !call.status.transfer}"
                                  :title="call.status.svi ? 'Appel transféré' : 'Appel sans tranfert'"
                                  >sync_alt
                                </span>
                              </div>
                              <div class="ipbx-call-log-statut-elt">
                                <span class="material-symbols-outlined p-0 wght-l"  
                                  :class="{'disabled': !call.status.voice_mail}"
                                  :title="call.status.voice_mail ? 'Appel redirigé vers la messagerie vocale' : 'Appel sans message vocal'"
                                  >voicemail
                                </span>
                              </div>         
                            </td>

                            <td data-label="Appelant" class="">
                              {{ call.caller.identity }}
                            </td>

                            <td data-label="Dernier appelé" class="">
                              {{ call.callee.identity }}
                            </td>

                            <td data-label="Durée" class="has-text-centered">
                              {{formatDuration(call.last_call_duration)}}
                            </td>

                          </tr>
                        </tbody>

                      </table>
                      <div class="box-content has-text-centered" v-if="!callLogsInitialized || callLogLoading">
                        <div class="loading-inline" :style="!callLogsInitialized ?'height: 120px; margin-top: 10%;' :'' ">
                          <div class="loading-icon loading-bg"></div>
                          <br>
                        </div>
                      </div>
                      <div class="box-content has-text-centered" v-else-if="callLogsInitialized && (callLogs.length === 0)">
                        <div style="height: 120px; margin-top: 10%">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                      <div class="box-content button-bg" v-else-if="!periodDate" @click="getMoreHistory">
                        Plus d'historique
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
              <CallFlow v-if="showCallFlow" :unique_id="selectedCallFlow" :active="showCallFlow ? true : false" @CallFlow="closeCallFlow"></CallFlow>
            </section>
          </div>
        </div>
      </div>
      
      <tt></tt>
    </div>

</template>

<script>
import TagInput from '@/comps/modal/TagInput.vue'
import CallFlow from '@/comps/products/ipbx/CallFlow.vue'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { DatePicker } from 'v-calendar';

export default {
  name: 'ProductsIpbxCallLog',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    TagInput,
    CallFlow,
    'v-date-picker': DatePicker
  },
  data () {
    return {
      id_server: null,
      searchInput: [],
      sortKey: 'unix_time',
      sortOrder: 'asc',
      showCallFlow: false,
      selectedCallFlow: "",
      selectedPeriod: 1,
      period_options: [{name: "Jour", value: 1}, {name: "Semaine", value: 7}, {name: "Mois", value: 30}],
      periodSelectIsFocused: false,
      periodDate: false,
      dateStart: "",
      dateEnd: "",
      charts: {},
      selectedDateRange: {
        start: null,
        end: null
      },
      attributes: [
        {
          key: 'today',
          highlight: true,
          dates: new Date()
        }
      ],
      minDate: null,
      maxDate: new Date(),
      showCalendar: false
    }
  },
  computed: {
    ipbxName() {
      return this.$route.query.name
    },
    callLogsInitialized () {
      return this.$store.getters.getCallLogsInitialized
    },
    callLogLoading () {
      return this.$store.getters.getCallLogsLoading
    },
    user () {
      return this.$store.getters.getUser
    },
    cn () {
      return this.$store.getters.getCn
    },
    callLogs () {
      return this.$store.getters.getCallLogs
    },
  },
  watch: {
    callLogs: {
      handler() {
        this.generateStatistics();
      },
      deep: true
    },
    '$store.getters.getCallLogsDaysLoaded': function () {
      if (!this.periodDate) {
        this.dateStart = this.getDateToDMY(this.$store.getters.getCallLogsDaysLoaded);
        this.dateEnd = this.getDateToDMY();
      }
    },
  },
  methods: {
    goToProducts () {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products')
      }, 1000)
    },
    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
    },
    hideCalendar() {
      this.showCalendar = false;
    },
    formatDate(date) {
      if (!date) return 'jj/mm/aaaa';
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    applyDates() {
      if (this.selectedDateRange.start && this.selectedDateRange.end) {
        const today = new Date();
        const start = new Date(this.selectedDateRange.start);
        const end = new Date(this.selectedDateRange.end);

        const startDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        const endDays = Math.floor((today - end) / (1000 * 60 * 60 * 24));

        this.$store.dispatch('SET_CALL_LOGS_DATES', {
          start: startDays,
          end: endDays
        });

        this.dateStart = this.formatDate(this.selectedDateRange.start);
        this.dateEnd = this.formatDate(this.selectedDateRange.end);

        // Fermer le calendrier après avoir appliqué les dates
        this.showCalendar = false;
      } else {
        alert('Veuillez sélectionner une période.');
      }
    },

    getDateToDMY(offset = 0) {
      let date = new Date();
      if (offset !== 0 )
        date.setDate(date.getDate() - offset);

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${day}/${month}/${year}`;
    },
    formatDateToYMD(date) {
      if (date) {
        const [day, month, year] = date.split('/');
        const dateObj = new Date(year, month - 1, day);
        const formattedYear = dateObj.getFullYear();
        const formattedMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const formattedDay = dateObj.getDate().toString().padStart(2, '0');
        return `${formattedYear}-${formattedMonth}-${formattedDay}`;
      }
      return '';
    },
    formatDateToDMY(date) {
      if (date) {
        const [year, month, day] = date.split('-');
        const dateObj = new Date(year, month - 1, day);
        const formattedDay = dateObj.getDate().toString().padStart(2, '0');
        const formattedMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const formattedYear = dateObj.getFullYear();
        return `${formattedDay}/${formattedMonth}/${formattedYear}`;
      }
      return '';
    },
    periodCheckbox (e) {
      this.periodDate = e.target.checked
      if (!this.periodDate) {
        this.selectedDateRange.start = null;
        this.selectedDateRange.end = null;
        this.selectedPeriod = 1
        this.handlePeriodChange();
      }
    },
    handleOpen() {
      this.periodSelectIsFocused = true;
    },
    handleClose() {
      this.periodSelectIsFocused = false;
    },
    handlePeriodChange() {
      this.$store.dispatch('SET_CALL_LOGS_PERIOD', this.selectedPeriod)
    },
    searchInputChange(value) {
      if (!this.callLogsInitialized)
        return;
      this.setSearch(value);
    },   
    colorStatus(call) {
      let style = call.status.answered? `color: green;`:`color: red;`;
      style += call.type === "internal" ? `margin-left: -5%; font-size: 28px;`:``;
      return style;
    },
    iconStatus(call) {
      switch(call.type) {
        case 'incoming':
          return 'input_circle';
        case 'outgoing':
          return 'output_circle';
        case 'internal':
          return 'arrow_circle_right';
        default:
          return '';
      }
    },
    titleStatus (call) {
      let title = "Appel"
      switch (call.type) {
        case 'incoming':
          title += ' reçu';
          break;
        case 'outgoing':
          title += ' émis';
          break;
        case 'internal':
          title += ' interne';
          break;
        default:
          title += ' inconu';
          break;
      }
      if (call.status.answered)
      title += ' répondu'
        else
        title += ' non répondu'

      return title;
    },
    formatDuration(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      const hoursStr = hours > 0 ? `${hours}h ` : '';
      const minutesStr = minutes > 0 ? `${minutes}min ` : '';
      const secondsStr = `${secs}sec`;

      return `${hoursStr}${minutesStr}${secondsStr}`;
    },
    async getCallFlow (value) {
      this.showCallFlow = value
      this.$loader = true
      this.$loader = false
      this.id_server = null
    },
    getMoreHistory() {
      this.$store.dispatch("GET_CALL_LOGS");
    },
    sortTable (key) {
      if (this.sortKey !== key) {
        this.sortOrder = 'asc'
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      this.sortKey = key;
      this.$store.dispatch('SET_CALL_LOGS_SORT', {key: this.sortKey, order: this.sortOrder})
    },
    openCallFlow (unique_id) {
      this.showCallFlow = true;
      this.selectedCallFlow = unique_id;
    },
    closeCallFlow () {
      this.showCallFlow = false;
      this.selectedCallFlow = "";
    },
    setSearch (key) {
      this.$store.dispatch('SET_CALL_LOGS_SEARCH', key)
    },
    generateStatistics () {
      let incomingCount = 0;
      let outgoingCount = 0;
      let internalCount = 0;
      let answeredCount = 0;
      let unansweredCount = 0;
      const hoursRange = {};
      for (let hour = 8; hour <= 20; hour++) {
        hoursRange[hour] = 0;
      }

      for (const call of this.callLogs) {
        //type
        switch (call.type) {
          case 'incoming':
            incomingCount++;
            break;
          case 'outgoing':
            outgoingCount++;
            break;
          case 'internal':
            internalCount++;
            break;
        }

        //answer
        if (call.status.answered)
          answeredCount++;
        else
          unansweredCount++;

        //Appel par heure
        const hour = parseInt(call.time.split(':')[0]);
        if (hoursRange[hour] !== undefined) {
          hoursRange[hour]++;
        }
      }

      const chartType = {
        element: "doughnut-chart-type",
        values: [incomingCount, outgoingCount, internalCount],
        labels: ['Entrant', 'Sortant', 'Interne'],
        backgroundColor: ['rgba(71, 183,132,.5)', 'rgba(41, 134, 204, 0.5)','rgba(144, 113, 225, 0.5)'],
        hoverBackgroundColor: ['rgba(71, 183,132,.8)', 'rgba(41, 134, 204, 0.8)','rgba(144, 113, 225, 0.8)'],
        borderColor: ['rgba(71,183,132,1)', 'rgba(41, 134, 204, 1)','rgba(144, 113, 225, 1)'],
      }
      this.initDoughnutChart(chartType);

      const chartAnswer = {
        element: "doughnut-chart-answer",
        values: [answeredCount, unansweredCount],
        labels: ['Répondu', "Manqué"],
        backgroundColor: ['rgba(71, 183,132,.5)', 'rgba(255, 99, 132, 0.2)'],
        hoverBackgroundColor: ['rgba(71, 183,132,.8)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(71,183,132,1)','rgba(255, 99, 132, 1)'],
      }
      this.initDoughnutChart(chartAnswer);

      const chartHour = {
        element: "bar-chart-hour",
        values: Object.values(hoursRange),
        labels: Object.keys(hoursRange).map(hour => `${hour}h`),
      }
      this.initBarChart(chartHour);
    },
    initDoughnutChart(chart) {
      const ctx = document.getElementById(chart.element).getContext('2d');
      //Clean
      if (this.charts[chart.element]) {
        this.charts[chart.element].destroy();
      }
      //Set
      this.charts[chart.element] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chart.labels,
          datasets: [{
            data: chart.values,
            backgroundColor: chart.backgroundColor,
            hoverBackgroundColor: chart.hoverBackgroundColor,
            borderColor: chart.borderColor,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          legend: {
            display: false // Masquer la légende
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                let dataset = data.datasets[tooltipItem.datasetIndex];
                let currentValue = dataset.data[tooltipItem.index];
                let label = data.labels[tooltipItem.index];
                return `${label}: ${currentValue}`;
              }
            }
          },
          plugins: {
            datalabels: {
              display: true,
              formatter: (value, context) => {
                if (value <= 0 )
                  return '';
                let label = context.chart.data.labels[context.dataIndex];
                return `${label}: ${value}`;
              },
              color: '#fff',
              anchor: 'start',
              align: 'end'
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    },
    initBarChart(chart) {
      // Reinitialise le graph
      const donutChartElement = document.getElementById(chart.element);
      donutChartElement.innerHTML = "";

      const ctx = document.getElementById(chart.element).getContext('2d');
      const callsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chart.labels,
          datasets: [{
            label: 'Nombre d\'appels par heure',
            data: chart.values,
            backgroundColor: 'rgba(71, 183,132,.5)',
            hoverBackgroundColor: 'rgba(71, 183,132,.8)',
            borderColor: 'rgba(71, 183,132,1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          legend: {
              display: false
          },
          scales: {
            xAxes: [{
              ticks: {
                callback: function(value, index, values) {
                  return index % 2 === 0 ? value : '';
                },
                minRotation: 0,
                maxRotation: 0
              },
              gridLines: {
                drawBorder: true,
                drawOnChartArea: false
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
                display: false,
              }
            }],
            
          },
          plugins: {
            title: {
              display: false,
              text: 'Chart.js Bar Chart'
            },
            datalabels: {
              display: true,
              formatter: (value, context) => {
                const VAL = `${value}`;
                return VAL === '0' ?'':VAL ;
              },
              color: '#fff',
              anchor: 'center',
              align: 'center'
            }
            
          },
        },
        plugins: [ChartDataLabels]
      });
    }
  },
  async created () {
    this.$store.dispatch('SET_CN', this.$route.query.id)

    this.$store.dispatch('GET_CALL_LOGS')
    if (!this.user.id_company || this.user.id_company !== 1) {
      this.$router.push('/products')
    }
    this.$loader = false
  },
  mounted () {
  },
  beforeDestroy() {
    this.$store.commit('RESET_ALL')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no-background {
    background: transparent !important;
  }
</style>
