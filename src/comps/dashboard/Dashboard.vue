<template>
  <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
    <div
      v-show="
        user.allowed_routes.length > 0 &&
        user.allowed_routes.includes('dashboard')
      "
    >
      <div class="admin-box">
        <div class="container is-max-widescreen synthese">
          <h1><span>Tableau de Bord</span></h1>

          <div class="dashboard-page">
            <div class="sidesWrapper">
              <div class="analyticsSide">
                <div class="row">
                  <div xs="12" class="col-sm-6 col-lg-3">
                    <div class="pb-xlg h-100">
                      <section class="h-100 mb-0 widget" @click="goTo('/products')">
                        <h5 class="title">Mon parc</h5>
                        <div id="donut-chart" class="donut-chart"></div>
                      </section>
                    </div>
                  </div>

                  <div xs="12" class="col-sm-6 col-lg-3">
                    <div class="pb-xlg h-100">
                      <section class="h-100 mb-0 widget" @click="goTo('/shop')">
                        <h5 class="title">Mon commerce</h5>
                        <div class="widgetControls widget-controls">
                          <a href="#" id="closeId-86"
                            ><i class="la la-remove"></i
                          ></a>
                        </div>
                        <div class="widgetBody widget-body mt-lg">
                          <div class="d-flex align-items-center mb h3" :title="'Mes documents administratifs'">
                            <p class="fw-normal" :data-value="sale_doc_total">{{ sale_doc_total }}</p>
                            <p class="fw-normal"><i class="material-symbols-outlined size-xl">shopping_cart</i></p>
                            <i
                              class="la la-arrow-right text-success rotate-315"
                            ></i>
                          </div>
                          <div class="d-flex flex-wrap justify-content-between">
                            <div class="mt-3" :title="'Mes commandes effectuées'">
                              <h6 class="">Commandes</h6>
                              <div class="d-flex align-items-center mb h6">
                                <p class="value5" :data-value="getStatisticValue(statistics.sale_order_count)">{{ getStatisticValue(statistics.sale_order_count) }}</p>
                                <p class="value5"><i class="material-symbols-outlined size-m">orders</i></p>
                              </div>
                            </div>
                            <div class="mt-3" :title="'Mes contrats en cours'">
                              <h6 class="">Contrats</h6>
                              <div class="d-flex align-items-center mb h6">
                                <p class="value5" :data-value="getStatisticValue(statistics.contract_count)">{{ getStatisticValue(statistics.contract_count) }}</p>
                                <p class="value5"><i class="material-symbols-outlined size-m">contract</i></p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </section>
                    </div>
                  </div>

                  <div xs="12" class="col-sm-6 col-lg-3">
                    <div class="pb-xlg h-100">
                      <section class="h-100 mb-0 widget" @click="goTo('/support')">
                        <h5 class="title">Assistance</h5>
                        <div class="widgetControls widget-controls">
                        </div>
                        
                        <div class="widgetBody widget-body">
                          <p class="text-muted d-flex flex-wrap">
                            <small class="me-lg-1 d-flex align-items-center"
                              ><span
                                class="circle bg-secondary text-secondary me-sm-1"
                                style="font-size: 4px; margin-right: 0.25rem;"
                              >
                                .
                              </span>
                              En cours </small
                            ><small class="me-lg-1 d-flex align-items-center"
                              ><span
                                class="circle bg-primary text-primary me-sm-1"
                                style="font-size: 4px; margin-right: 0.25rem;"
                              >
                                .
                              </span>
                              À cloturer
                            </small>
                          </p>
                          <h6>IPBX</h6>
                          <div class="progress mb-xs" style="height: 5px" :title="'Tickets IPBX en cours: ' + ipbxNotDoneNotAwaitingPercentage + '%'">
                            <div
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              :aria-valuenow="ipbxNotDoneNotAwaitingPercentage"
                              class="progress-bar bg-secondary"
                              :style="{ width: ipbxNotDoneNotAwaitingPercentage + '%' }"
                            ></div>
                          </div>
                          <div class="progress mb" style="height: 5px" :title="'Tickets IPBX à cloturer: ' + ipbxAwaitingPercentage + '%'">
                            <div
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              :aria-valuenow="ipbxAwaitingPercentage"
                              class="progress-bar bg-primary"
                              :style="{ width: ipbxAwaitingPercentage + '%' }"
                            ></div>
                          </div>
                          <h6>Opérateurs</h6>
                          <div class="progress mb-xs" style="height: 5px" :title="'Tickets Opérateurs en cours: ' + operateursNotDoneNotAwaitingPercentage + '%'">
                            <div
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              :aria-valuenow="operateursNotDoneNotAwaitingPercentage"
                              class="progress-bar bg-secondary"
                              :style="{ width: operateursNotDoneNotAwaitingPercentage + '%' }"
                            ></div>
                          </div>
                          <div class="progress" style="height: 5px" :title="'Tickets Opérateurs à cloturer: ' + operateursAwaitingPercentage + '%'">
                            <div
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              :aria-valuenow="operateursAwaitingPercentage"
                              class="progress-bar bg-primary"
                              :style="{ width: operateursAwaitingPercentage + '%' }"
                            ></div>
                          </div>

                        </div>
                      </section>
                    </div>
                  </div>

                  <div xs="12" class="col-md-6 col-lg-3">
                    <div class="pb-xlg h-100">
                      <section class="h-100 mb-0 widget" @click="goTo('/billing')">
                        <h5 class="title">Mes factures</h5>

                        <div class="widgetBody widget-body">

                          <div class="d-flex align-items-center mb h3" :title="'Bénéfices de ce mois'">
                            <p class="fw-normal" :data-value="getStatisticValue(statistics.current_month_sale_revenue - statistics.current_month_purchase_revenue)">{{ getStatisticValue(statistics.current_month_purchase_revenue - statistics.current_month_sale_revenue) }}</p>
                            <p class="fw-normal"><i class="material-symbols-outlined size-xl">euro</i></p>
                          </div>
                          <div class="d-flex flex-wrap justify-content-between">
                            <div class="mt-3" :title="'Achats effectuées durant le mois'">
                              <h6 class="">Achats</h6>
                              <div class="d-flex align-items-center mb h6">
                                <p class="value5" :data-value="getStatisticValue(statistics.current_month_purchase_revenue)">{{ getStatisticValue(statistics.current_month_purchase_revenue) }}</p>
                                <p class="value5"><i class="material-symbols-outlined size-m">euro</i></p>
                              </div>
                            </div>
                            <div class="mt-3" :title="'Ventes effectuées durant le mois'">
                              <h6 class="">Ventes</h6>
                              <div class="d-flex align-items-center mb h6">
                                <p class="value5" :data-value="getStatisticValue(statistics.current_month_sale_revenue)">{{ getStatisticValue(statistics.current_month_sale_revenue) }}</p>
                                <p class="value5"><i class="material-symbols-outlined size-m">euro</i></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="pb-xlg h-100">
                    <section class="h-100 mb-0 widget">
                      <div xs="12" class="col">
                        <vc-calendar
                          class="custom-calendar"
                          :attributes="activityData"
                        ></vc-calendar>
                      </div>
                    </section>
                  </div>
                </div>

                <div class="row">
                  <div xs="12" class="col-lg-6 col-xl-4">
                    <div data-v-2a1bc641="" class="pb-xlg h-100">
                      <section data-v-2a1bc641="" class="h-100 mb-0 widget">
                        <div
                          style="
                            text-align: center;
                            margin-top: 15%;
                            opacity: 0.4;
                          "
                        >
                          <span><i class="fa fa-frown fa-3x"></i></span><br />
                          Oups! Pas de données disponibles
                        </div>
                      </section>
                    </div>
                  </div>
                  <div xs="12" class="col-lg-6 col-xl-4">
                    <div data-v-2a1bc641="" class="pb-xlg h-100">
                      <section data-v-2a1bc641="" class="h-100 mb-0 widget">
                        <div
                          style="
                            text-align: center;
                            margin-top: 15%;
                            opacity: 0.4;
                          "
                        >
                          <span><i class="fa fa-frown fa-3x"></i></span><br />
                          Oups! Pas de données disponibles
                        </div>
                      </section>
                    </div>
                  </div>
                  <div xs="12" class="col-lg-6 col-xl-4">
                    <div data-v-2a1bc641="" class="pb-xlg h-100">
                      <section data-v-2a1bc641="" class="h-100 mb-0 widget">
                        <div
                          style="
                            text-align: center;
                            margin-top: 15%;
                            opacity: 0.4;
                          "
                        >
                          <span><i class="fa fa-frown fa-3x"></i></span><br />
                          Oups! Pas de données disponibles
                        </div>
                      </section>
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
</template>

<script>
import { CountUp } from 'countup.js';

export default {
  /* eslint-disable */

  name: "Dashboard",
  props: {
    msg: String,
    tab: Boolean,
  },
  components: {},
  data() {
    return {
      activities: [],
      statistics: {},
      attributes: this.getActivateIPBX,
    };
  },
  async created() {
    if (
      this.user.allowed_routes.length <= 0 ||
      !this.user.allowed_routes.includes("dashboard")
    ) {
      this.$router.push("/products");
    }
    await this.getActivity();
    await this.getStatistics();
    this.$globalState.loader = false;
  },
  mounted() {},
  methods: {
    goTo (route) {
      this.$globalState.loader = true
      const currentRoute = this.$route.fullPath
      setTimeout(() => {
        if (route === currentRoute) {
          location.reload()
        } else {
          this.$router.push(route)
        }
      }, 1000)
    },
    async getActivity() {
      this.activities = await this.$axios.get(`${process.env.ODOO_API}api/activity?session_id=${this.user.session_id}`).then((response) => response.data.result);
    },
    async getStatistics() {
      this.statistics = await this.$axios.get(`${process.env.ODOO_API}api/statistics?session_id=${this.user.session_id}`).then(response => response.data.result);
      this.$nextTick(() => {
        this.initDonutChart();
      });
    },
    initDonutChart() {
      const vpnClientsCount = this.statistics.vpn_clients_count || 0;
      const sdaCount = this.statistics.sda_count || 0;
      const trunkCount = this.statistics.trunk_count || 0;

      new Morris.Donut({
        element: "donut-chart",
        data: [
          { label: "IPBX", value: vpnClientsCount, labelColor: "red" },
          { label: "Trunk", value: trunkCount, labelColor: "yellow" },
          { label: "SDA", value: sdaCount, labelColor: "blue" },
        ],
        colors: [
          "rgb(255, 209, 77)",
          "rgb(77, 255, 166)",
          "rgb(111, 176, 249)",
        ],
        labelColor: "#9CC4E4",
        resize: true,
      });

      this.animateChartValues();
      // this.animateDonutChartValues();
    },
    animateChartValues() {
      const elements = document.querySelectorAll('p');
      elements.forEach(el => {
        const value = el.getAttribute('data-value');
        const suffix = el.getAttribute('data-suffix') || '';
        const floatValue = parseFloat(value);
        if (!isNaN(floatValue)) {
          const countUp = new CountUp(el, floatValue, {
            duration: 3,
            useEasing: true,
            useGrouping: true,
            separator: ' ',
            decimal: '.',
            decimals: 2
          });
          countUp.start(() => {
            el.textContent += suffix;
          });
        }
      });
    },
    animateDonutChartValues() {
      const elements = document.querySelectorAll('#donut-chart text');
      elements.forEach((el, index) => {
        const value = el.textContent.match(/\d+/);
        if (value) {
          const countUp = new CountUp(el, Number(value[0]), {
            duration: 3,
            useEasing: true,
            useGrouping: true,
            separator: ' ',
            decimal: '.',
          });
          countUp.start();
        }
      });
    },
    getStatisticValue(value) {
      return isNaN(value) ? 0 : value;
    }
  },
  computed: {
    totalIpbxTickets() {
      let count = 0;
      if (this.statistics.helpdesk_tickets_grouped) {
        this.statistics.helpdesk_tickets_grouped.forEach(ticket => {
          if (ticket.team_name === "IPBX" && ticket.stage_name !== 'Done' && ticket.stage_name !== 'Cancelled') {
            count += ticket.count;
          }
        });
      }
      return count;
    },
    totalOperateursTickets() {
      let count = 0;
      if (this.statistics.helpdesk_tickets_grouped) {
        this.statistics.helpdesk_tickets_grouped.forEach(ticket => {
          if (ticket.team_name === "Opérateurs" && ticket.stage_name !== 'Done' && ticket.stage_name !== 'Cancelled') {
            count += ticket.count;
          }
        });
      }
      return count;
    },
    ipbxAwaitingCount() {
      let count = 0;
      if (this.statistics.helpdesk_tickets_grouped) {
        this.statistics.helpdesk_tickets_grouped.forEach(ticket => {
          if (ticket.team_name === "IPBX" && ticket.stage_name === "Awaiting") {
            count += ticket.count;
          }
        });
      }
      return count;
    },
    ipbxNotDoneNotAwaitingCount() {
      let count = 0;
      if (this.statistics.helpdesk_tickets_grouped) {
        this.statistics.helpdesk_tickets_grouped.forEach(ticket => {
          if (ticket.team_name === "IPBX" && ticket.stage_name !== "Done" && ticket.stage_name !== "Awaiting" && ticket.stage_name !== 'Cancelled') {
            count += ticket.count;
          }
        });
      }
      return count;
    },
    operateursAwaitingCount() {
      let count = 0;
      if (this.statistics.helpdesk_tickets_grouped) {
        this.statistics.helpdesk_tickets_grouped.forEach(ticket => {
          if (ticket.team_name === "Opérateurs" && ticket.stage_name === "Awaiting") {
            count += ticket.count;
          }
        });
      }
      return count;
    },
    operateursNotDoneNotAwaitingCount() {
      let count = 0;
      if (this.statistics.helpdesk_tickets_grouped) {
        this.statistics.helpdesk_tickets_grouped.forEach(ticket => {
          if (ticket.team_name === "Opérateurs" && ticket.stage_name !== "Done" && ticket.stage_name !== "Awaiting" && ticket.stage_name !== 'Cancelled') {
            count += ticket.count;
          }
        });
      }
      return count;
    },
    ipbxAwaitingPercentage() {
      const total = this.totalIpbxTickets;
      const res = total === 0 ? 0 : (this.ipbxAwaitingCount / total) * 100;
      return res.toFixed(2)
    },
    ipbxNotDoneNotAwaitingPercentage() {
      const total = this.totalIpbxTickets;
      const res = total === 0 ? 0 : (this.ipbxNotDoneNotAwaitingCount / total) * 100;
      return res.toFixed(2)
    },
    operateursAwaitingPercentage() {
      const total = this.totalOperateursTickets;
      const res = total === 0 ? 0 : (this.operateursAwaitingCount / total) * 100;
      return res.toFixed(2)
    },
    operateursNotDoneNotAwaitingPercentage() {
      const total = this.totalOperateursTickets;
      const res = total === 0 ? 0 : (this.operateursNotDoneNotAwaitingCount / total) * 100;
      return res.toFixed(2)
    },
    sale_doc_total() {
      if (this.statistics) {
        const saleOrderCount = isNaN(this.statistics.sale_order_count) ? 0 : this.statistics.sale_order_count;
        const contractCount = isNaN(this.statistics.contract_count) ? 0 : this.statistics.contract_count;
        return saleOrderCount + contractCount;
      } else {
        return 0;
      }
    },
    user() {
      return this.$store.getters.getUser;
    },
    activityData() {
      let activities = [];
      for (let val of this.activities) {
        activities.push({
          key: val.res_id.toString(),
          highlight: {
            color: "red",
            fillMode: "solid",
            contentClass: "italic",
          },
          popover: {
            label: val.res_name,
            visibility: "hover",
          },
          dates: this.$moment(val.date_deadline, "D-M-YYYY").toDate(),
        });
      }
      return activities;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.donut-chart {
  font-family: "Roboto", sans-serif;
  height: 75%;
  width: 100%;
  margin: auto;
}

.donut-chart svg text {
  fill: white !important;
  font-weight: bold;
}

.vc-container {
  background-color: #2f3b52 !important;
  color: white !important;
  width: 100%;
  border: 1px solid transparent;
}

.vc-container .vc-weekday {
  color: white !important;
}

.vc-container .vc-title {
  color: white !important;
}

.text-right {
  text-align: right !important;
}
.text-center {
  text-align: center !important;
}

.content h2 {
  margin-bottom: 0;
}

h2:after {
  background: transparent;
  margin: 0;
}
.font-bold {
  color: white;
}
.admin-box .columns.content {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.title {
  margin-top: 0;
  color: white;
}

.title:after {
  display: block;
  clear: both;
  content: "";
}

.h-100 {
  height: 100%;
}

.widget {
  background-color: #2f3b52;
  display: block;
  position: relative;
  margin-bottom: 40px;
  padding: 15px;
  border-radius: 0.45rem;
  -webkit-box-shadow: var(--widget-shadow);
  box-shadow: var(--widget-shadow);
}


@media (prefers-reduced-motion: no-preference) {
  :root {
    scroll-behavior: smooth;
  }
}

body {
  margin: 0;
  font-family: var(--bs-body-font-family);
  font-size: var(--bs-body-font-size);
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
  color: var(--bs-body-color);
  text-align: var(--bs-body-text-align);
  background-color: var(--bs-body-bg);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

hr {
  margin: 1rem 0;
  color: inherit;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  opacity: 0.25;
}

.h2,
.h3,
.h4,
.h5,
.h6,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}

@media (min-width: 1200px) {
  .h2,
  h2 {
    font-size: 2rem;
  }
}

.h3,
h3 {
  font-size: calc(1.3rem + 0.6vw);
}

@media (min-width: 1200px) {
  .h3,
  h3 {
    font-size: 1.75rem;
  }
}

.h4,
h4 {
  font-size: calc(1.275rem + 0.3vw);
}

@media (min-width: 1200px) {
  .h4,
  h4 {
    font-size: 1.5rem;
  }
}

.h5,
h5 {
  font-size: 1.25rem;
}

.h6,
h6 {
  font-size: 1rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
  place-content: space-evenly;
}

.container,
.container-fluid,
.container-lg,
.container-md,
.container-sm,
.container-xl,
.container-xxl {
  --bs-gutter-x: 40px;
  --bs-gutter-y: 0;
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container,
  .container-sm {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container,
  .container-md,
  .container-sm {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl {
    max-width: 1140px;
  }
}

@media (min-width: 1400px) {
  .container,
  .container-lg,
  .container-md,
  .container-sm,
  .container-xl,
  .container-xxl {
    max-width: 1320px;
  }
}

.row {
  --bs-gutter-x: 40px;
  --bs-gutter-y: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-top: calc(var(--bs-gutter-y) * -1);
  margin-right: calc(var(--bs-gutter-x) * -0.5);
  margin-left: calc(var(--bs-gutter-x) * -0.5);
}

.row > * {
  -ms-flex-negative: 0;
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-top: var(--bs-gutter-y);
}

.col {
  -webkit-box-flex: 1;
  -ms-flex: 1 0 0%;
  flex: 1 0 0%;
}

.row-cols-auto > * {
  width: auto;
}

.row-cols-1 > *,
.row-cols-auto > * {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.row-cols-1 > * {
  width: 100%;
}

.row-cols-2 > * {
  width: 50%;
}

.row-cols-2 > *,
.row-cols-3 > * {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.row-cols-3 > * {
  width: 33.33333%;
}

.row-cols-4 > * {
  width: 25%;
}

.row-cols-4 > *,
.row-cols-5 > * {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.row-cols-5 > * {
  width: 20%;
}

.row-cols-6 > * {
  width: 16.66667%;
}

.col-auto,
.row-cols-6 > * {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-auto {
  width: auto;
}

.col-1 {
  width: 8.33333%;
}

.col-1,
.col-2 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-2 {
  width: 16.66667%;
}

.col-3 {
  width: 25%;
}

.col-3,
.col-4 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-4 {
  width: 33.33333%;
}

.col-5 {
  width: 41.66667%;
}

.col-5,
.col-6 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-6 {
  width: 50%;
}

.col-7 {
  width: 58.33333%;
}

.col-7,
.col-8 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-8 {
  width: 66.66667%;
}

.col-9 {
  width: 75%;
}

.col-9,
.col-10 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-10 {
  width: 83.33333%;
}

.col-11 {
  width: 91.66667%;
}

.col-11,
.col-12 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}

.col-12 {
  width: 100%;
}

@media (min-width: 576px) {
  .col-sm {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0%;
    flex: 1 0 0%;
  }

  .row-cols-sm-auto > * {
    width: auto;
  }

  .row-cols-sm-1 > *,
  .row-cols-sm-auto > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-sm-1 > * {
    width: 100%;
  }

  .row-cols-sm-2 > * {
    width: 50%;
  }

  .row-cols-sm-2 > *,
  .row-cols-sm-3 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-sm-3 > * {
    width: 33.33333%;
  }

  .row-cols-sm-4 > * {
    width: 25%;
  }

  .row-cols-sm-4 > *,
  .row-cols-sm-5 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-sm-5 > * {
    width: 20%;
  }

  .row-cols-sm-6 > * {
    width: 16.66667%;
  }

  .col-sm-auto,
  .row-cols-sm-6 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-auto {
    width: auto;
  }

  .col-sm-1 {
    width: 8.33333%;
  }

  .col-sm-1,
  .col-sm-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-2 {
    width: 16.66667%;
  }

  .col-sm-3 {
    width: 25%;
  }

  .col-sm-3,
  .col-sm-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-4 {
    width: 33.33333%;
  }

  .col-sm-5 {
    width: 41.66667%;
  }

  .col-sm-5,
  .col-sm-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-6 {
    width: 50%;
  }

  .col-sm-7 {
    width: 58.33333%;
  }

  .col-sm-7,
  .col-sm-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-8 {
    width: 66.66667%;
  }

  .col-sm-9 {
    width: 75%;
  }

  .col-sm-9,
  .col-sm-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-10 {
    width: 83.33333%;
  }

  .col-sm-11 {
    width: 91.66667%;
  }

  .col-sm-11,
  .col-sm-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-sm-12 {
    width: 100%;
  }

  .offset-sm-0 {
    margin-left: 0;
  }

  .offset-sm-1 {
    margin-left: 8.33333%;
  }

  .offset-sm-2 {
    margin-left: 16.66667%;
  }

  .offset-sm-3 {
    margin-left: 25%;
  }

  .offset-sm-4 {
    margin-left: 33.33333%;
  }

  .offset-sm-5 {
    margin-left: 41.66667%;
  }

  .offset-sm-6 {
    margin-left: 50%;
  }

  .offset-sm-7 {
    margin-left: 58.33333%;
  }

  .offset-sm-8 {
    margin-left: 66.66667%;
  }

  .offset-sm-9 {
    margin-left: 75%;
  }

  .offset-sm-10 {
    margin-left: 83.33333%;
  }

  .offset-sm-11 {
    margin-left: 91.66667%;
  }

  .g-sm-0,
  .gx-sm-0 {
    --bs-gutter-x: 0;
  }

  .g-sm-0,
  .gy-sm-0 {
    --bs-gutter-y: 0;
  }

  .g-sm-1,
  .gx-sm-1 {
    --bs-gutter-x: 0.25rem;
  }

  .g-sm-1,
  .gy-sm-1 {
    --bs-gutter-y: 0.25rem;
  }

  .g-sm-2,
  .gx-sm-2 {
    --bs-gutter-x: 0.5rem;
  }

  .g-sm-2,
  .gy-sm-2 {
    --bs-gutter-y: 0.5rem;
  }

  .g-sm-3,
  .gx-sm-3 {
    --bs-gutter-x: 1rem;
  }

  .g-sm-3,
  .gy-sm-3 {
    --bs-gutter-y: 1rem;
  }

  .g-sm-4,
  .gx-sm-4 {
    --bs-gutter-x: 1.5rem;
  }

  .g-sm-4,
  .gy-sm-4 {
    --bs-gutter-y: 1.5rem;
  }

  .g-sm-5,
  .gx-sm-5 {
    --bs-gutter-x: 3rem;
  }

  .g-sm-5,
  .gy-sm-5 {
    --bs-gutter-y: 3rem;
  }
}

@media (min-width: 768px) {
  .col-md {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0%;
    flex: 1 0 0%;
  }

  .row-cols-md-auto > * {
    width: auto;
  }

  .row-cols-md-1 > *,
  .row-cols-md-auto > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-md-1 > * {
    width: 100%;
  }

  .row-cols-md-2 > * {
    width: 50%;
  }

  .row-cols-md-2 > *,
  .row-cols-md-3 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-md-3 > * {
    width: 33.33333%;
  }

  .row-cols-md-4 > * {
    width: 25%;
  }

  .row-cols-md-4 > *,
  .row-cols-md-5 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-md-5 > * {
    width: 20%;
  }

  .row-cols-md-6 > * {
    width: 16.66667%;
  }

  .col-md-auto,
  .row-cols-md-6 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-auto {
    width: auto;
  }

  .col-md-1 {
    width: 8.33333%;
  }

  .col-md-1,
  .col-md-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-2 {
    width: 16.66667%;
  }

  .col-md-3 {
    width: 25%;
  }

  .col-md-3,
  .col-md-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-4 {
    width: 33.33333%;
  }

  .col-md-5 {
    width: 41.66667%;
  }

  .col-md-5,
  .col-md-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-6 {
    width: 50%;
  }

  .col-md-7 {
    width: 58.33333%;
  }

  .col-md-7,
  .col-md-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-8 {
    width: 66.66667%;
  }

  .col-md-9 {
    width: 75%;
  }

  .col-md-9,
  .col-md-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-10 {
    width: 83.33333%;
  }

  .col-md-11 {
    width: 91.66667%;
  }

  .col-md-11,
  .col-md-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-md-12 {
    width: 100%;
  }

  .offset-md-0 {
    margin-left: 0;
  }

  .offset-md-1 {
    margin-left: 8.33333%;
  }

  .offset-md-2 {
    margin-left: 16.66667%;
  }

  .offset-md-3 {
    margin-left: 25%;
  }

  .offset-md-4 {
    margin-left: 33.33333%;
  }

  .offset-md-5 {
    margin-left: 41.66667%;
  }

  .offset-md-6 {
    margin-left: 50%;
  }

  .offset-md-7 {
    margin-left: 58.33333%;
  }

  .offset-md-8 {
    margin-left: 66.66667%;
  }

  .offset-md-9 {
    margin-left: 75%;
  }

  .offset-md-10 {
    margin-left: 83.33333%;
  }

  .offset-md-11 {
    margin-left: 91.66667%;
  }

  .g-md-0,
  .gx-md-0 {
    --bs-gutter-x: 0;
  }

  .g-md-0,
  .gy-md-0 {
    --bs-gutter-y: 0;
  }

  .g-md-1,
  .gx-md-1 {
    --bs-gutter-x: 0.25rem;
  }

  .g-md-1,
  .gy-md-1 {
    --bs-gutter-y: 0.25rem;
  }

  .g-md-2,
  .gx-md-2 {
    --bs-gutter-x: 0.5rem;
  }

  .g-md-2,
  .gy-md-2 {
    --bs-gutter-y: 0.5rem;
  }

  .g-md-3,
  .gx-md-3 {
    --bs-gutter-x: 1rem;
  }

  .g-md-3,
  .gy-md-3 {
    --bs-gutter-y: 1rem;
  }

  .g-md-4,
  .gx-md-4 {
    --bs-gutter-x: 1.5rem;
  }

  .g-md-4,
  .gy-md-4 {
    --bs-gutter-y: 1.5rem;
  }

  .g-md-5,
  .gx-md-5 {
    --bs-gutter-x: 3rem;
  }

  .g-md-5,
  .gy-md-5 {
    --bs-gutter-y: 3rem;
  }
}

@media (min-width: 992px) {
  .col-lg {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0%;
    flex: 1 0 0%;
  }

  .row-cols-lg-auto > * {
    width: auto;
  }

  .row-cols-lg-1 > *,
  .row-cols-lg-auto > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-lg-1 > * {
    width: 100%;
  }

  .row-cols-lg-2 > * {
    width: 50%;
  }

  .row-cols-lg-2 > *,
  .row-cols-lg-3 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-lg-3 > * {
    width: 33.33333%;
  }

  .row-cols-lg-4 > * {
    width: 25%;
  }

  .row-cols-lg-4 > *,
  .row-cols-lg-5 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-lg-5 > * {
    width: 20%;
  }

  .row-cols-lg-6 > * {
    width: 16.66667%;
  }

  .col-lg-auto,
  .row-cols-lg-6 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-auto {
    width: auto;
  }

  .col-lg-1 {
    width: 8.33333%;
  }

  .col-lg-1,
  .col-lg-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-2 {
    width: 16.66667%;
  }

  .col-lg-3 {
    width: 25%;
  }

  .col-lg-3,
  .col-lg-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-4 {
    width: 33.33333%;
  }

  .col-lg-5 {
    width: 41.66667%;
  }

  .col-lg-5,
  .col-lg-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-6 {
    width: 50%;
  }

  .col-lg-7 {
    width: 58.33333%;
  }

  .col-lg-7,
  .col-lg-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-8 {
    width: 66.66667%;
  }

  .col-lg-9 {
    width: 75%;
  }

  .col-lg-9,
  .col-lg-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-10 {
    width: 83.33333%;
  }

  .col-lg-11 {
    width: 91.66667%;
  }

  .col-lg-11,
  .col-lg-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-lg-12 {
    width: 100%;
  }

  .offset-lg-0 {
    margin-left: 0;
  }

  .offset-lg-1 {
    margin-left: 8.33333%;
  }

  .offset-lg-2 {
    margin-left: 16.66667%;
  }

  .offset-lg-3 {
    margin-left: 25%;
  }

  .offset-lg-4 {
    margin-left: 33.33333%;
  }

  .offset-lg-5 {
    margin-left: 41.66667%;
  }

  .offset-lg-6 {
    margin-left: 50%;
  }

  .offset-lg-7 {
    margin-left: 58.33333%;
  }

  .offset-lg-8 {
    margin-left: 66.66667%;
  }

  .offset-lg-9 {
    margin-left: 75%;
  }

  .offset-lg-10 {
    margin-left: 83.33333%;
  }

  .offset-lg-11 {
    margin-left: 91.66667%;
  }

  .g-lg-0,
  .gx-lg-0 {
    --bs-gutter-x: 0;
  }

  .g-lg-0,
  .gy-lg-0 {
    --bs-gutter-y: 0;
  }

  .g-lg-1,
  .gx-lg-1 {
    --bs-gutter-x: 0.25rem;
  }

  .g-lg-1,
  .gy-lg-1 {
    --bs-gutter-y: 0.25rem;
  }

  .g-lg-2,
  .gx-lg-2 {
    --bs-gutter-x: 0.5rem;
  }

  .g-lg-2,
  .gy-lg-2 {
    --bs-gutter-y: 0.5rem;
  }

  .g-lg-3,
  .gx-lg-3 {
    --bs-gutter-x: 1rem;
  }

  .g-lg-3,
  .gy-lg-3 {
    --bs-gutter-y: 1rem;
  }

  .g-lg-4,
  .gx-lg-4 {
    --bs-gutter-x: 1.5rem;
  }

  .g-lg-4,
  .gy-lg-4 {
    --bs-gutter-y: 1.5rem;
  }

  .g-lg-5,
  .gx-lg-5 {
    --bs-gutter-x: 3rem;
  }

  .g-lg-5,
  .gy-lg-5 {
    --bs-gutter-y: 3rem;
  }
}

@media (min-width: 1200px) {
  .col-xl {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0%;
    flex: 1 0 0%;
  }

  .row-cols-xl-auto > * {
    width: auto;
  }

  .row-cols-xl-1 > *,
  .row-cols-xl-auto > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-xl-1 > * {
    width: 100%;
  }

  .row-cols-xl-2 > * {
    width: 50%;
  }

  .row-cols-xl-2 > *,
  .row-cols-xl-3 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-xl-3 > * {
    width: 33.33333%;
  }

  .row-cols-xl-4 > * {
    width: 25%;
  }

  .row-cols-xl-4 > *,
  .row-cols-xl-5 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-xl-5 > * {
    width: 20%;
  }

  .row-cols-xl-6 > * {
    width: 16.66667%;
  }

  .col-xl-auto,
  .row-cols-xl-6 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-auto {
    width: auto;
  }

  .col-xl-1 {
    width: 8.33333%;
  }

  .col-xl-1,
  .col-xl-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-2 {
    width: 16.66667%;
  }

  .col-xl-3 {
    width: 25%;
  }

  .col-xl-3,
  .col-xl-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-4 {
    width: 33.33333%;
  }

  .col-xl-5 {
    width: 41.66667%;
  }

  .col-xl-5,
  .col-xl-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-6 {
    width: 50%;
  }

  .col-xl-7 {
    width: 58.33333%;
  }

  .col-xl-7,
  .col-xl-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-8 {
    width: 66.66667%;
  }

  .col-xl-9 {
    width: 75%;
  }

  .col-xl-9,
  .col-xl-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-10 {
    width: 83.33333%;
  }

  .col-xl-11 {
    width: 91.66667%;
  }

  .col-xl-11,
  .col-xl-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xl-12 {
    width: 100%;
  }
}

@media (min-width: 1400px) {
  .col-xxl {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0%;
    flex: 1 0 0%;
  }

  .row-cols-xxl-auto > * {
    width: auto;
  }

  .row-cols-xxl-1 > *,
  .row-cols-xxl-auto > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-xxl-1 > * {
    width: 100%;
  }

  .row-cols-xxl-2 > * {
    width: 50%;
  }

  .row-cols-xxl-2 > *,
  .row-cols-xxl-3 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-xxl-3 > * {
    width: 33.33333%;
  }

  .row-cols-xxl-4 > * {
    width: 25%;
  }

  .row-cols-xxl-4 > *,
  .row-cols-xxl-5 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .row-cols-xxl-5 > * {
    width: 20%;
  }

  .row-cols-xxl-6 > * {
    width: 16.66667%;
  }

  .col-xxl-auto,
  .row-cols-xxl-6 > * {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-auto {
    width: auto;
  }

  .col-xxl-1 {
    width: 8.33333%;
  }

  .col-xxl-1,
  .col-xxl-2 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-2 {
    width: 16.66667%;
  }

  .col-xxl-3 {
    width: 25%;
  }

  .col-xxl-3,
  .col-xxl-4 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-4 {
    width: 33.33333%;
  }

  .col-xxl-5 {
    width: 41.66667%;
  }

  .col-xxl-5,
  .col-xxl-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-6 {
    width: 50%;
  }

  .col-xxl-7 {
    width: 58.33333%;
  }

  .col-xxl-7,
  .col-xxl-8 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-8 {
    width: 66.66667%;
  }

  .col-xxl-9 {
    width: 75%;
  }

  .col-xxl-9,
  .col-xxl-10 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-10 {
    width: 83.33333%;
  }

  .col-xxl-11 {
    width: 91.66667%;
  }

  .col-xxl-11,
  .col-xxl-12 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  .col-xxl-12 {
    width: 100%;
  }
}

@-webkit-keyframes progress-bar-stripes {
  0% {
    background-position-x: 0.65rem;
  }
}

@keyframes progress-bar-stripes {
  0% {
    background-position-x: 0.65rem;
  }
}

.progress {
  --bs-progress-height: 0.65rem;
  --bs-progress-font-size: 0.75rem;
  --bs-progress-bg: #eaf0f6;
  --bs-progress-border-radius: 0.5rem;
  --bs-progress-box-shadow: none;
  --bs-progress-bar-color: #fff;
  --bs-progress-bar-bg: #6fb0f9;
  --bs-progress-bar-transition: width 0.6s ease;
  height: var(--bs-progress-height);
  font-size: var(--bs-progress-font-size);
  background-color: var(--bs-progress-bg);
  border-radius: var(--bs-progress-border-radius);
  -webkit-box-shadow: var(--bs-progress-box-shadow);
  box-shadow: var(--bs-progress-box-shadow);
}

.progress,
.progress-bar {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  overflow: hidden;
}

.progress-bar {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: var(--bs-progress-bar-color);
  text-align: center;
  white-space: nowrap;
  background-color: var(--bs-progress-bar-bg);
  -webkit-transition: var(--bs-progress-bar-transition);
  transition: var(--bs-progress-bar-transition);
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar {
    -webkit-transition: none;
    transition: none;
  }
}

.progress-bar-striped {
  background-image: linear-gradient(
    45deg,
    hsla(0, 0%, 100%, 0.15) 25%,
    transparent 0,
    transparent 50%,
    hsla(0, 0%, 100%, 0.15) 0,
    hsla(0, 0%, 100%, 0.15) 75%,
    transparent 0,
    transparent
  );
  background-size: var(--bs-progress-height) var(--bs-progress-height);
}

.progress-bar-animated {
  -webkit-animation: progress-bar-stripes 3s linear infinite;
  animation: progress-bar-stripes 3s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .progress-bar-animated {
    -webkit-animation: none;
    animation: none;
  }
}

.h2,
.h3,
.h4,
.h5,
.h6,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 400;
}

.h2 .small,
.h2 small,
.h3 .small,
.h3 small,
.h4 .small,
.h4 small,
.h5 .small,
.h5 small,
.h6 .small,
.h6 small,
h2 .small,
h2 small,
h3 .small,
h3 small,
h4 .small,
h4 small,
h5 .small,
h5 small,
h6 .small,
h6 small {
  font-weight: 300;
  font-size: 75%;
  color: #798892;
}

.circle,
.circle-o,
.rounded {
  width: 1.5em;
  height: 1.5em;
}

.bg-primary {
  background-color: #6fb0f9 !important;
}

a.bg-primary :focus,
a.bg-primary :hover,
button.bg-primary :focus,
button.bg-primary :hover {
  background-color: #649ee0 !important;
}

.bg-secondary {
  background-color: rgb(77, 255, 166) !important;
}

a.bg-secondary :focus,
a.bg-secondary :hover,
button.bg-secondary :focus,
button.bg-secondary :hover {
  background-color: rgb(77, 255, 166) !important;
}


.mb-xlg {
  margin-bottom: 40px;
}

.mb-xs {
  margin-bottom: 0.25rem;
}

.pt-xlg {
  padding-top: 20px;
}

.pb-xlg {
  padding-bottom: 20px;
}
</style>
