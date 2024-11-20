import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import 'es6-promise/auto';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import store from './store';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import vClickOutside from 'v-click-outside';
import VueTelInput from 'vue-tel-input';
import VCalendar from 'v-calendar';

import EventBus from './EventBus';
import dayjs from 'dayjs';
import moment from 'moment';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import "leaflet/dist/leaflet.css";


const globalState = reactive({
  loader: false,
});

const app = createApp(App);

// Register plugins
app.use(VueSweetalert2);
app.use(VueTelInput);
app.use(vClickOutside);
app.use(VCalendar, {
  componentPrefix: 'vc',
});

app.use(PrimeVue);
app.use(ToastService);

// Set up global properties
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$globalState = globalState;

app.component('vue-phone-number-input', VuePhoneNumberInput);

// Axios interceptors for handling requests and responses
axios.interceptors.request.use(config => {
  const token = store.getters.getUser.session_id;
  const protocol = 'https';
  const uri = 'iprateur.kiplink.fr';
  config.baseURL = `${protocol}://${uri}`;

  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      if (error.response.status === 503 || error.response.status === 502) {
        window.location.href = '/ping';
      } else {
        await handleSessionExpiry();
      }
    } else {
      await handleSessionExpiry();
    }
    return Promise.reject(error);
  }
);

async function handleSessionExpiry() {
  await store.dispatch('updateUser', null);
  await store.dispatch('disconnectMqtt');
  await store.dispatch('removeUser');
  await store.dispatch('resetClientsAndServers');
  await store.dispatch('resetSDAs');
  await store.dispatch('resetTrunk');
  EventBus.emit('showToastrAfterRedirect');
}

// Router guards
router.beforeEach(async (to, from, next) => {
  const user = store.getters.getUser;
  const accessToken = user ? user.session_id : null;
  const lastUpdateString = user ? user.last_update : null;

  if ((to.name === 'Login' || to.name === 'Reset' || to.name === 'ResetValidation') && accessToken) {
    const now = new Date();
    user.last_update = now.toISOString();
    await store.dispatch('updateUser', user);
    next({ name: 'Products' });
  } else if (accessToken) {
    await validateSession(next, user, lastUpdateString);
  } else if (to.name !== 'Login' && to.name !== 'Reset' && to.name !== 'ResetValidation') {
    next({ name: 'Login' });
  } else {
    next();
  }
});

async function validateSession(next, user, lastUpdateString) {
  const now = new Date();
  const lastUpdate = lastUpdateString ? new Date(lastUpdateString) : null;
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (lastUpdate && lastUpdate < sevenDaysAgo) {
    await handleSessionExpiry();
    showSessionExpiredToast();
    next({ name: 'Login' });
  } else {
    user.last_update = now.toISOString();
    await store.dispatch('updateUser', user);
    next();
  }
}

function showSessionExpiredToast() {
  app.config.globalProperties.$toastr.Add({
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
    style: { 'margin-top': '20%' },
  });
}

// Initialize application
async function initializeApp() {
  await store.dispatch('loadFromDb');
  app.use(router);
  app.use(store);
  app.mount('#app');
}

initializeApp();

export { globalState };