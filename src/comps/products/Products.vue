<template>
  <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
    <div class="admin-box" v-if="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('products')" v-show="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('products')">
      <div class="dashboard">
        <div class="container is-max-widescreen">
          <section>
            <h1 class="dashboard-zone">
              {{ user.name }}, bienvenue sur votre Flotte KIPLINK
            </h1>
          </section>
        </div>
        <div class="container is-max-widescreen">
          <div class="billinglist">
            <div data-v-65729484="" class="columns mb-0 align-items-center">
              <div data-v-65729484="" class="column">
                <div data-v-65729484="" class="field mb-0 align-items-center has-addons">
                  <div class="row" style="width: 100%">
                    <div class="col-lg-4">
                      <div class="widget style1 blue-alt" @click="setMenu('IPBX')" :style="menu === 'IPBX' ? 'border: 1px solid #00a4c3;' : ''">
                        <div class="row">
                          <div class="col-4">
                            <i class="material-symbols-outlined size-xxl">dns</i>
                          </div>
                          <div class="col-8 text-right">
                            <span>IPBX connectés</span>
                            <h3 class="font-bold">{{ connectedServers ? connectedServers : '?' }} / {{ totalServers ? totalServers : '?' }}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="widget style1 blue-alt" @click="setMenu('TRUNK')" :style="menu === 'TRUNK' ? 'border: 1px solid #00a4c3;' : ''">
                        <div class="row">
                          <div class="col-4">
                            <i class="material-symbols-outlined size-xxl">power</i>
                          </div>
                          <div class="col-8 text-right">
                            <span>Trunks actifs</span>
                            <h3 class="font-bold">{{ products_infos ? products_infos.activ_trunks : '?' }} / {{ products_infos ? products_infos.total_trunks : '?' }}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="widget style1 blue-alt" @click="setMenu('SDA')" :style="menu === 'SDA' ? 'border: 1px solid #00a4c3;' : ''">
                        <div class="row">
                          <div class="col-4">
                            <i class="material-symbols-outlined size-xxl">phone_enabled</i>
                          </div>
                          <div class="col-8 text-right">
                            <span>SDA actifs</span>
                            <h3 class="font-bold">{{ occupiedSdas ? occupiedSdas : '?' }} / {{ totalSdas ? totalSdas : '?' }}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductIPBX :products_infos="products_infos" v-if="menu === 'IPBX'" />
          <ProductTrunk :products_infos="products_infos" v-if="menu === 'TRUNK'" />
          <ProductSDA :products_infos="products_infos" v-if="menu === 'SDA'" />
          <ProductAll :products_infos="products_infos" v-if="menu === 'ALL'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductIPBX from './ipbx/ProductIPBX.vue';
import ProductTrunk from './trunk/ProductTrunk.vue';
import ProductSDA from './sda/ProductSDA.vue';
import ProductAll from './ProductAll.vue';

export default {
  name: 'Products',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    ProductIPBX,
    ProductTrunk,
    ProductSDA,
    ProductAll
  },
  data() {
    return {
      timer: '',
      products_infos: null
    };
  },
  computed: {
    menu() {
      return this.$store.getters.currentMenu;
    },
    connectedServers() {
      return this.$store.getters.totalConnectedClients;
    },
    totalServers() {
      return this.$store.getters.totalClients;
    },
    freeSdas() {
      return this.$store.getters.totalFreeSdas;
    },
    occupiedSdas() {
      return this.$store.getters.totalOccuppiedSdas;
    },
    totalSdas() {
      return this.$store.getters.totalSdas;
    },
    user () {
      return this.$store.getters.getUser;
    }
  },
  async mounted() {
    await this.$store.dispatch('initializeMqtt');
    await this.getProductsInfos();
    await this.$store.dispatch('fetchTrunks')
    await this.$store.dispatch('fetchSDAs')
    this.timer = setInterval(this.getProductsInfos, 60000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    async getProductsInfos() {
      const header = {
        'Content-Type': 'application/json'
      };
      this.products_infos = await this.$axios.get(`${process.env.ODOO_API}api/products/infos?session_id=${this.user.session_id}`, { headers: header }).then(response => {
        return response.data;
      });
    },
    setMenu(menu) {
      this.$store.dispatch('setMenu', menu);
      /*
      if (menu !== this.$store.getters.currentMenu) {
        this.$store.dispatch('setMenu', menu);
      } else {
        this.$store.dispatch('setMenu', 'ALL');
      }
      */
    }
  }
};
</script>

<style scoped>
/* Your CSS styles */
</style>
