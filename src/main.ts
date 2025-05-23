import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "es6-promise/auto";

import VueSweetalert2 from "vue-sweetalert2";
import VueMoment from "vue-moment";
import "sweetalert2/dist/sweetalert2.min.css";
import "../static/js/jquery-3.1.1.min";
import store from "./store";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import vClickOutside from "v-click-outside";
import VueTelInput from "vue-tel-input";
import VCalendar from 'v-calendar';

import { EventBus } from './EventBus';

import dayjs from 'dayjs';

Vue.component("vue-phone-number-input", VuePhoneNumberInput);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

dayjs.locale('fr');
Vue.prototype.$dayjs = dayjs;

Vue.use(VueTelInput);
Vue.use(VueSweetalert2);
Vue.use(vClickOutside);
Vue.use(VCalendar, {
  componentPrefix: 'vc',
});

const moment = require("moment");
require("moment/locale/fr");
Vue.use(VueMoment, {
  moment
});

let globalData = new Vue({
  data: { $loader: false }
});

Vue.mixin({
  computed: {
    $loader: {
      get: function () { return globalData.$data.$loader; },
      set: function (state) { globalData.$data.$loader = state; }
    }
  }
});

Vue.prototype.$axios.interceptors.request.use(function (config) {
  const token = store.getters.getUser.session_id;
  let protocol = "https";
  let uri = "iprateur.kiplink.fr";
  config.baseURL = `${protocol}://${uri}`;

  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

Vue.prototype.$axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.log(error);
    if (error.response) {
      if (error.response.status === 503 || error.response.status === 502) {
        window.location.href = "/ping";
      } else {
        await store.dispatch("updateUser", null);
        await store.dispatch('disconnectMqtt');
        await store.dispatch('removeUser');
        await store.dispatch('resetClientsAndServers');
        await store.dispatch('resetSDAs');
        await store.dispatch('resetTrunk');
        EventBus.$emit('showToastrAfterRedirect');
      }
    } else {
      console.error('Axios error:', error);
      await store.dispatch("updateUser", null);
      await store.dispatch('disconnectMqtt');
      await store.dispatch('removeUser');
      await store.dispatch('resetClientsAndServers');
      await store.dispatch('resetSDAs');
      await store.dispatch('resetTrunk');
      EventBus.$emit('showToastrAfterRedirect');
      /*const user = store.getters.getUser;
      const lastUpdateString = user ? user.last_update : null;
      const now = new Date();
      const lastUpdate = lastUpdateString ? new Date(lastUpdateString) : null;

      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (lastUpdate && lastUpdate < sevenDaysAgo) {
        await store.dispatch("updateUser", null);
        EventBus.$emit('showToastrAfterRedirect');
      }*/
    }
    return Promise.reject(error);
  }
);

router.beforeEach(async function (to, from, next) {
  const user = store.getters.getUser;
  const accessToken = user ? user.session_id : null;
  const lastUpdateString = user ? user.last_update : null;

  if ((to.name === "Login" || to.name === "Reset" || to.name === "ResetValidation") && accessToken) {
    const now = new Date();
    user.last_update = now.toISOString();
    await store.dispatch("updateUser", user);
    next({ name: "Products" });
  } else if (accessToken) {
    const now = new Date();
    const lastUpdate = lastUpdateString ? new Date(lastUpdateString) : null;

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (lastUpdate && lastUpdate < sevenDaysAgo) {
      await store.dispatch("updateUser", null);
      Vue.prototype.$toastr.Add({
        name: 'ErrorSession',
        title: 'Session expirée',
        msg: 'Veuillez vous connecter !',
        clickClose: true,
        timeout: 3000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'error',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '20%' }
      });
      next({ name: "Login" });
    } else {
      user.last_update = now.toISOString();
      await store.dispatch("updateUser", user);
      next();
    }
  } else if (to.name !== "Login" && to.name !== "Reset" && to.name !== "ResetValidation") {
    next({ name: "Login" });
  } else {
    next();
  }
});

async function initializeApp() {
  await store.dispatch('loadFromDb');

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}

initializeApp();
