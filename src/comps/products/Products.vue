<template>
  <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
    <div class="admin-box" v-if="user.allowed_routes.includes('products')" v-show="user.allowed_routes.includes('products')">
      <div class="dashboard">
        <div class="container is-max-widescreen">
          <section>
            <h1 class="dashboard-zone">{{ user.name }}, bienvenue sur votre Flotte KIPLINK</h1>
          </section>
        </div>
        <div class="container is-max-widescreen">
          <div class="billinglist">
            <div class="columns mb-0 align-items-center">
              <div class="column" style="padding-top: 0.5rem; padding-right: 0 !important; padding-left: 0 !important;">
                <div class="field mb-0 align-items-center has-addons">
                  <div class="row" style="width: 100%">
                    
                    <div class="col-lg">
                      <div class="widget style1 blue-alt" 
                          @click="setMenu('IPBX')" 
                          :style="menu === 'IPBX' ? 'border: 1px solid #00a4c3;' : ''"
                          @mouseover="showText = 'IPBX'" 
                          @mouseleave="showText = ''">

                        <div class="row align-items-center">
                          <div class="col-lg-3 d-flex flex-column align-items-center justify-content-center text-center">
                            <i class="material-symbols-outlined size-xl">dns</i>
                            <span class="menu-text" :style="showText === 'IPBX' ? '' : 'visibility: hidden;'">IPBX</span>
                          </div>

                          <div class="col-lg-9 text-right">
                            <div class="d-flex justify-content-end align-items-center text-inline">
                              <span v-show="showText === 'IPBX'" class="menu-text mr-1 text-menu-color">Connectés : </span>
                              <span ref="ipbxCounter" class="font-bold text-xl ml-2 text-menu-color" :title="'Serveurs connectés'">{{ connectedServers }}</span>
                            </div>
                            <small class="d-flex justify-content-end align-items-center text-inline" :title="'Nombre total de serveurs'">
                              <span v-show="showText === 'IPBX'" class="menu-text mr-1">Total : </span>{{ totalServers }}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg">
                      <div class="widget style1 blue-alt" 
                          @click="setMenu('PHONE')" 
                          :style="menu === 'PHONE' ? 'border: 1px solid #00a4c3;' : ''"
                          @mouseover="showText = 'PHONE'" 
                          @mouseleave="showText = ''">
                          
                        <div class="row align-items-center">
                          <div class="col-lg-3 d-flex flex-column align-items-center justify-content-center text-center">
                            <i class="material-symbols-outlined size-xl">deskphone</i>
                            <span class="menu-text" :style="showText === 'PHONE' ? '' : 'visibility: hidden;'">TÉLÉPHONE</span>
                          </div>
                          <div class="col-lg-9 text-right">
                            <div class="d-flex justify-content-end align-items-center text-inline">
                              <span v-show="showText === 'PHONE'" class="menu-text mr-1 text-menu-color" :title="'Téléphones connectés'">Connectés : </span>
                              <span ref="phoneCounter" class="font-bold text-xl ml-2 text-menu-color">{{ connectedPhones }}</span>
                            </div>
                            <small class="d-flex justify-content-end align-items-center text-inline" :title="'Nombre total de certificats non utilisés'">
                              <span v-show="showText === 'PHONE'" class="menu-text mr-1">Inattribué : </span>{{ totalPhonesClientNotActivated }}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg">
                      <div class="widget style1 blue-alt" 
                          @click="setMenu('TRUNK')" 
                          :style="menu === 'TRUNK' ? 'border: 1px solid #00a4c3;' : ''"
                          @mouseover="showText = 'TRUNK'" 
                          @mouseleave="showText = ''">
                          
                        <div class="row align-items-center">
                          <div class="col-lg-3 d-flex flex-column align-items-center justify-content-center text-center">
                            <i class="material-symbols-outlined size-xl">hub</i>
                            <span class="menu-text" :style="showText === 'TRUNK' ? '' : 'visibility: hidden;'">TRUNK</span>
                          </div>
                          <div class="col-lg-9 text-right">
                            <div class="d-flex justify-content-end align-items-center text-inline">
                              <span v-show="showText === 'TRUNK'" class="menu-text mr-1 text-menu-color" :title="'Trunks actifs'">Actifs : </span>
                              <span ref="trunkCounter" class="font-bold text-xl ml-2 text-menu-color">{{ connectedTrunks }}</span>
                            </div>
                            <small class="d-flex justify-content-end align-items-center text-inline" :title="'Nombre total de trunks'">
                              <span v-show="showText === 'TRUNK'" class="menu-text mr-1">Total : </span>{{ totalTrunks }}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg">
                      <div class="widget style1 blue-alt" 
                          @click="setMenu('SDA')" 
                          :style="menu === 'SDA' ? 'border: 1px solid #00a4c3;' : ''"
                          @mouseover="showText = 'SDA'" 
                          @mouseleave="showText = ''">
                          
                        <div class="row align-items-center">
                          <div class="col-lg-3 d-flex flex-column align-items-center justify-content-center text-center">
                            <i class="material-symbols-outlined size-xl">tag</i>
                            <span class="menu-text" :style="showText === 'SDA' ? '' : 'visibility: hidden;'">SDA</span>
                          </div>
                          <div class="col-lg-9 text-right">
                            <div class="d-flex justify-content-end align-items-center text-inline">
                              <span v-show="showText === 'SDA'" class="menu-text mr-1 text-menu-color" :title="'Sda actifs'">Actifs : </span>
                              <span ref="sdaCounter" class="font-bold text-xl ml-2 text-menu-color">{{ occupiedSdas }}</span>
                            </div>
                            <small class="d-flex justify-content-end align-items-center text-inline" :title="'Nombre total de sdas'">
                              <span v-show="showText === 'SDA'" class="menu-text mr-1">Total : </span>{{ totalSdas }}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-lg" 
                      v-if="user && user.allowed_routes && user.allowed_routes.includes('sim')"
                      v-show="user && user.allowed_routes && user.allowed_routes.includes('sim')">
                      
                      <div class="widget style1 blue-alt" 
                          @click="setMenu('SIM')" 
                          :style="menu === 'SIM' ? 'border: 1px solid #00a4c3;' : ''"
                          @mouseover="showText = 'SIM'" 
                          @mouseleave="showText = ''">
                          
                        <div class="row align-items-center">
                          <div class="col-lg-3 d-flex flex-column align-items-center justify-content-center text-center">
                            <i class="material-symbols-outlined size-xl">sim_card</i>
                            <span class="menu-text" :style="showText === 'SIM' ? '' : 'visibility: hidden;'">SIM</span>
                          </div>
                          <div class="col-lg-9 text-right">
                            <div class="d-flex justify-content-end align-items-center text-inline">
                              <span v-show="showText === 'SIM'" class="menu-text mr-1 text-menu-color" :title="'Sim actives'">Actives : </span>
                              <span ref="simCounter" class="font-bold text-xl ml-2 text-menu-color">{{ occupiedSims }}</span>
                            </div>
                            <small class="d-flex justify-content-end align-items-center text-inline" :title="'Nombre total de sim'">
                              <span v-show="showText === 'SIM'" class="menu-text mr-1">Total : </span>
                              <span>{{ totalSIM }}</span>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <transition name="fade" mode="out-in">
            <component :is="currentComponent" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CountUp } from 'countup.js';
import ProductIPBX from './ipbx/ProductIPBX.vue';
import ProductPhone from './phone/ProductPhone.vue';
import ProductTrunk from './trunk/ProductTrunk.vue';
import ProductSDA from './sda/ProductSDA.vue';
import ProductSIM from './sim/ProductSIM.vue';
import ProductAll from './ProductAll.vue';

export default {
  name: 'Products',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    ProductIPBX,
    ProductPhone,
    ProductTrunk,
    ProductSDA,
    ProductSIM,
    ProductAll
  },
  data() {
    return {
      counters: {},
      titles: {
        IPBX: 'PBX',
        PHONE: 'Téléphones',
        TRUNK: 'Trunks',
        SDA: 'SDA',
        SIM: 'Cartes SIM'
      },
      showText: ''
    };
  },
  watch: {
    connectedServers(newVal) {
      this.updateCounter('ipbx', newVal);
    },
    connectedPhones(newVal) {
      this.updateCounter('phone', newVal);
    },
    connectedTrunks(newVal) {
      this.updateCounter('trunk', newVal);
    },
    occupiedSdas(newVal) {
      this.updateCounter('sda', newVal);
    },
    occupiedSims(newVal) {
      this.updateCounter('sim', newVal);
    }
  },
  computed: {
    currentComponent() {
      switch (this.menu) {
        case "IPBX":
          return "ProductIPBX";
        case "PHONE":
          return "ProductPhone";
        case "TRUNK":
          return "ProductTrunk";
        case "SDA":
          return "ProductSDA";
        case "SIM":
          return "ProductSIM";
        case "ALL":
          return "ProductAll";
        default:
          return null;
      }
    },
    menu() {
      return this.$store.getters.currentMenu;
    },
    lastChangePhone() {
      console.log(this.$store.getters.lastChangePhone)
      return this.$store.getters.lastChangePhone;
    },
    lastChangeIpbx() {
      console.log(this.$store.getters.lastChangeIpbx)
      return this.$store.getters.lastChangeIpbx;
    },
    connectedServers() {
      return this.$store.getters.totalConnectedClients || 0;
    },
    connectedPhones() {
      return this.$store.getters.totalConnectedPhones || 0;
    },
    totalServers() {
      return this.$store.getters.totalClients;
    },
    totalPhones() {
      return this.$store.getters.totalPhones;
    },
    totalPhonesClientNotActivated () {
      return this.$store.getters.totalPhonesClientNotActivated;
    },
    freeSdas() {
      return this.$store.getters.totalFreeSdas;
    },
    connectedTrunks() {
      return this.$store.getters.totalConnectedTrunks || 0;
    },
    totalTrunks() {
      return this.$store.getters.totalTrunks;
    },
    occupiedSdas() {
      return this.$store.getters.totalOccuppiedSdas || 0;
    },
    totalSdas() {
      return this.$store.getters.totalSdas;
    },
    occupiedSims() {
      return this.$store.getters.totalOccuppiedSims || 0;
    },
    totalSIM() {
      return this.$store.getters.totalSims || 0;
    },
    user () {
      return this.$store.getters.getUser;
    },
    isIpbxConnected() {
      return this.connectedServers > 0;
    },
    isPhoneConnected() {
      return this.connectedPhones > 0;
    }
  },
  async mounted() {
    this.$loader = true;
    await this.$store.dispatch('fetchClientNotes');
    this.$loader = false;
    this.$nextTick(() => {
      this.$store.dispatch('initializeMqtt');
      this.$store.dispatch('fetchTrunks');
      this.$store.dispatch('fetchSDAs');
      this.$store.dispatch('fetchSIMs');
    });
    this.initCounters();
  },
  methods: {
    initCounters() {
      const options = {
        duration: 2,
        useGrouping: true,
      };
      const initialValues = {
        ipbx: this.connectedServers,
        phone: this.connectedPhones,
        trunk: this.connectedTrunks,
        sda: this.occupiedSdas,
        sim: this.occupiedSims
      };

      Object.entries(initialValues).forEach(([type, value]) => {
        const element = this.$refs[`${type}Counter`];
        if (element) {
          this.counters[type] = new CountUp(element, value, options);
          this.counters[type].start();
        }
      });
    },
    updateCounter(type, value) {
      if (this.counters[type]) {
        this.counters[type].update(value);
      }
    },
    setMenu(menu) {
      this.$store.dispatch('setMenu', menu);
    }
  }
};
</script>

<style scoped>
.widget:hover {
  //transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.text-menu-color {
  color: rgb(33, 191, 38) !important;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.size-xxl {
  font-size: 2.5rem;
}

.text-xl {
  font-size: 1.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.d-flex {
  display: flex;
}

.justify-content-end {
  justify-content: flex-end;
}

.align-items-center {
  align-items: center;
}

.d-block {
  display: block;
}

.text-muted {
  color: #6c757d;
}

.status-icon {
  font-size: 1.5rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: absolute;
  width: 100%;
}

.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.text-inline {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
}

.menu-text {
  font-size: 12px;
  //font-weight: bold;
  display: block;
  text-align: center;
}
</style>