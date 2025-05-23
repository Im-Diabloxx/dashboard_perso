<template>
  <div>
    <div v-if="user.devMode">
        <span style="width: 400px;top: 40px;left: -150px;font-size: 30px;
          text-align: center;padding: 10px;line-height: 20px;
          color: #f0f0f0; transform: rotate(-45deg); position: fixed;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); background: #D0442C;
          opacity: 0.6; pointer-events: none; text-transform: uppercase; 
          z-index:9999">
          DEV
        </span>
    </div>
    <div v-if="$route.name === 'PagePing'" class="containerpingparent">
      <div class="containerping">
        <div class="load"></div>
        <h1 style="display: block;">Maintenance en cours</h1>
        <p>Nous nous excusons pour la gêne occasionnée. Notre site est actuellement en maintenance, mais tout rentrera bientôt à la normale. Merci de votre patience.</p>
      </div>
    </div>

    <div v-if="this.$loader" class="loader-wrapper">
      <div class="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <div :class="this.$loader ? 'blur_page' : ''">
      <header v-if="$route.name != 'Login' && $route.name !== 'PagePing' && $route.name !== 'Reset' && $route.name !== 'ResetValidation'">
        <div>
          <nav id="nav2" role="navigation" class="nav2">
            <div>
              <div class="content columns">
                <div class="logo column">
                  <a class="logo-link" href="/"><div class="logo-img"></div></a>
                </div>
                <!--
                <div @click="toggleSwitchViewMode" style="align-self: center; margin-right: 1%;">
                    <span :title="viewMode === 'single' ? 'Vue condensé' : 'Vue globale'">
                        <i :class="viewMode === 'single' ? 'fal fa-toggle-off' : 'fal fa-toggle-on'"></i>
                    </span>
                </div>
                -->
                <!--
                <div @click="toggleDarkMode" style="align-self: center; margin-right: 1%;">
                    <span :title="isDarkMode ? 'Activer le light mode' : 'Activer le dark mode'">
                        <i :class="isDarkMode ? 'fal fa-sun' : 'fal fa-moon'"></i>
                    </span>
                </div>
                <div style="align-self: center; margin-right: 1%;" v-if="!isMobile() && user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets')" v-show="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets')">
                  <button @click="CreateTicket()" data-v-65729484="" type="button" class="button is-admin-secondary-white buttonDiag" style="height: 30px !important;">
                    <span style="font-size: 12px;">
                        <svg data-v-65729484="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
                        <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                          <path d="m 50,16.229525 c 18.75,0 33.75,12.6 33.75,28.125 0,12.15 -9.225,22.5 -22.1625,26.25 -1.8,5.4 3.4125,13.125 3.4125,13.125 -5.310502,-1.798534 -9.401951,-6.086149 -10.95,-11.475 -1.344724,0.150739 -2.696854,0.225859 -4.05,0.225 -18.75,0 -33.75,-12.6 -33.75,-28.125 0,-15.525 15,-28.125 33.75,-28.125 m 0,-3.75 c -20.6625,0 -37.5,14.2875 -37.5,31.875 0,17.5875 16.8375,31.875 37.5,31.875 h 1.575 c 2.24283,5.420419 6.798341,9.549277 12.4125,11.25 0.335288,0.0546 0.677209,0.0546 1.0125,0 1.206964,-0.0056 2.337465,-0.591765 3.0375,-1.575 0.891776,-1.285481 0.891776,-2.989519 0,-4.275 -1.609031,-2.423291 -2.647571,-5.17992 -3.0375,-8.0625 13.575,-5.025 22.5,-16.5 22.5,-29.2125 0,-17.5875 -16.8375,-31.875 -37.5,-31.875 z"></path>
                          /&gt;
                          <path d="m 38.599999,44.392025 a 5.5875,5.5875 0 0 1 -5.5875,5.5875 5.5875,5.5875 0 0 1 -5.5875,-5.5875 5.5875,5.5875 0 0 1 5.5875,-5.587499 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                          /&gt;
                          <path d="M 55.5875,44.392025 A 5.5875,5.5875 0 0 1 50,49.979525 5.5875,5.5875 0 0 1 44.4125,44.392025 5.5875,5.5875 0 0 1 50,38.804526 a 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                          /&gt;
                          <path d="m 72.575,44.392025 a 5.5875,5.5875 0 0 1 -5.5875,5.5875 5.5875,5.5875 0 0 1 -5.5875,-5.5875 5.5875,5.5875 0 0 1 5.5875,-5.587499 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                          /&gt;
                        </g>
                      </svg>

                      <span data-v-65729484="">
                        Demande d'assistance
                      </span>
                    </span>
                  </button>
                </div>
                <div v-else-if="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets')" v-show="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets')" class="sub column" style="display: flex; justify-content: flex-end;">
                  <div class="account-link" style="margin-right: 1em">
                    <span data-label="Demande d'assistance" class="is-primary is-bottom is-medium b-tooltip" style="transition-delay: 0ms;">
                      <a class="help" v-on:click="CreateTicket()" style="align-self: center">
                        <svg data-v-65729484="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
                          <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                            <path d="m 50,16.229525 c 18.75,0 33.75,12.6 33.75,28.125 0,12.15 -9.225,22.5 -22.1625,26.25 -1.8,5.4 3.4125,13.125 3.4125,13.125 -5.310502,-1.798534 -9.401951,-6.086149 -10.95,-11.475 -1.344724,0.150739 -2.696854,0.225859 -4.05,0.225 -18.75,0 -33.75,-12.6 -33.75,-28.125 0,-15.525 15,-28.125 33.75,-28.125 m 0,-3.75 c -20.6625,0 -37.5,14.2875 -37.5,31.875 0,17.5875 16.8375,31.875 37.5,31.875 h 1.575 c 2.24283,5.420419 6.798341,9.549277 12.4125,11.25 0.335288,0.0546 0.677209,0.0546 1.0125,0 1.206964,-0.0056 2.337465,-0.591765 3.0375,-1.575 0.891776,-1.285481 0.891776,-2.989519 0,-4.275 -1.609031,-2.423291 -2.647571,-5.17992 -3.0375,-8.0625 13.575,-5.025 22.5,-16.5 22.5,-29.2125 0,-17.5875 -16.8375,-31.875 -37.5,-31.875 z"></path>
                            /&gt;
                            <path d="m 38.599999,44.392025 a 5.5875,5.5875 0 0 1 -5.5875,5.5875 5.5875,5.5875 0 0 1 -5.5875,-5.5875 5.5875,5.5875 0 0 1 5.5875,-5.587499 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                            /&gt;
                            <path d="M 55.5875,44.392025 A 5.5875,5.5875 0 0 1 50,49.979525 5.5875,5.5875 0 0 1 44.4125,44.392025 5.5875,5.5875 0 0 1 50,38.804526 a 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                            /&gt;
                            <path d="m 72.575,44.392025 a 5.5875,5.5875 0 0 1 -5.5875,5.5875 5.5875,5.5875 0 0 1 -5.5875,-5.5875 5.5875,5.5875 0 0 1 5.5875,-5.587499 5.5875,5.5875 0 0 1 5.5875,5.587499 z"></path>
                            /&gt;
                          </g>
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
                -->


                <div class="sub column" style="display: flex;">
                  <div class="account-link" style="margin-right: 0">
                    <span :data-label="isDarkMode ? 'Activer le mode éclairer' : 'Activer le mode sombre'" class="is-primary is-bottom is-medium b-tooltip" style="transition-delay: 0ms;">
                      <a class="help" v-on:click="toggleDarkMode()" style="align-self: center">
                        <i v-if="!isDarkMode" class="material-symbols-outlined material-symbols-outlined-filled size-xl">dark_mode</i>
                        <i v-else class="material-symbols-outlined size-xl">dark_mode</i>
                      </a>
                    </span>
                  </div>
                </div>

                <div v-if="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets')" v-show="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets')" class="sub column" style="display: flex;">
                  <div class="account-link" style="margin-right: 0">
                    <span data-label="Demande d'assistance" class="is-primary is-bottom is-medium b-tooltip" style="transition-delay: 0ms;">
                      <a class="help" v-on:click="CreateTicket()" style="align-self: center">
                        <i class="material-symbols-outlined size-xl">contact_support</i>
                      </a>
                    </span>
                  </div>
                </div>

                <div class="sub column" style="display: flex; justify-content: flex-end;">
                  <div class="account-link">
                      <span data-label="Se déconnecter" class="is-primary is-bottom is-medium b-tooltip" style="transition-delay: 0ms;">
                        <a class="help" v-on:click="logout" style="align-self: center">
                          <i class="material-symbols-outlined size-xl">logout</i>
                        </a>

                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </nav>
        </div>
      </header>

      <div v-if="$route.name != 'Login' && $route.name !== 'PagePing' && $route.name !== 'Reset' && $route.name !== 'ResetValidation'">
        <section class="is-fullheight zone-nav" style="margin-bottom: -1rem;display: block;">
          <div class="" :class="collapse_active == true ? 'active' : ''">
            <div class="account-navigation" :class="collapse_active == true ? 'active' : ''">
              <button type="button" class="button button menu-collapse" @click="toggleCollapse">
                <span>
                  <svg viewBox="0 0 100 100" version="1.1" id="svg6" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" class="svgicon">
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                      <path d="m 29.158402,13.351182 c -1.730682,1.785547 -1.68614,4.636028 0.0995,6.366631 l 30.16963,30.16965 -29.899454,30.347114 c -4.312302,4.278047 2.206107,10.695505 6.416314,6.316953 L 72.111021,49.837767 35.624476,13.351223 c -1.768958,-1.825216 -4.697144,-1.825212 -6.466114,-6e-6 z"></path>
                    </g>
                  </svg>
                </span>
              </button>
              
              <div class="nav-header" @mouseover="showEditProfile = true" @mouseleave="showEditProfile = false" style="padding: 0px 10px; height: 80px">

                <label for="imageInput" class="company-logo-tiers">
                    <div class="image-container">
                        <img :src="user.image" alt="User Image" v-show="user.image" />
                        <i class="fal fa-user" v-show="!user.image"></i>
                    </div>
                </label>
                <input type="file" id="imageInput" ref="imageInput" style="display: none" @change="handleImageUpload" />



                <div class="company-infos">
                  <h3 class="user">
                    {{user.name}}
                  </h3> <h4 class="company">
                    {{user.company_name}}
                    <span :style="showEditProfile == true ? 'visibility: visible' : 'visibility: hidden'" style="float: right; cursor: pointer;"><i class="material-symbols-outlined size-m" @click="goTo('/profile')">edit</i></span>
                  </h4>
                </div>
              </div>
              
              <aside class="menu">
                <ul class="menu-list">
                  <li :title="'Accueil'" :class="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('dashboard') ? '' : 'notyet'">
                    <a @click="goTo('/dashboard')" :class="[$route.name === 'Dashboard' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">home</i>
                        <span v-show="collapse_active" style="align-self: center">Accueil</span>
                      </div>
                    </a>
                  </li>
                  <li :title="'Mon VPN'" v-if="user.id_company && user.id_company === 1" v-show="user.id_company && user.id_company === 1">
                    <a @click="goTo('/vpn')" :class="[$route.name === 'OpenVPN' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">shield_lock</i>
                        <span v-show="collapse_active" style="align-self: center">Mon VPN Kiplink</span>
                      </div>
                    </a>
                  </li>
                  <li :title="'Mes Tickets'" :class="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('tickets') ? '' : 'notyet'">
                    <a @click="goTo('/support')" :class="[$route.name === 'Tickets' || $route.name === 'TicketMessage' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">support_agent</i>
                        <span v-show="collapse_active" style="align-self: center">Mes Tickets</span>
                      </div>
                    </a>
                  </li>
                  <li :title="'Mon Commerce'" :class="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('orders') ? '' : 'notyet'">
                    <a @click="goTo('/shop')" :class="[$route.name === 'Shop' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">shopping_cart</i>
                        <span v-show="collapse_active" style="align-self: center">Mon Commerce</span>
                      </div>
                    </a>
                  </li>
                  <li :title="'Mes Factures'" :class="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('billings') ? '' : 'notyet'">
                    <a @click="goTo('/billing')" :class="[$route.name === 'Billing' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">receipt_long</i>
                        <span v-show="collapse_active" style="align-self: center">Mes Factures</span>
                      </div>
                    </a>
                  </li>
                  <li :title="'Ma Flotte Kiplink'" :class="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('products') ? '' : 'notyet'">
                    <a @click="goTo('/products')" :class="[$route.name === 'Products' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">inventory_2</i>
                        <span v-show="collapse_active" style="align-self: center">Ma Flotte Kiplink</span>
                      </div>
                    </a>
                  </li>
                  <li :title="'Statistiques'" :class="user.allowed_routes && user.allowed_routes.length > 0 && user.allowed_routes.includes('stats') ? '' : 'notyet'">
                    <a @click="goTo('/statistics')" :class="[$route.name === 'Statistics' ? 'is-active' : '']">
                      <div class="" style="display: flex">
                        <i class="material-symbols-outlined size-xl">query_stats</i>
                        <span v-show="collapse_active" style="align-self: center">Statistiques</span>
                      </div>
                    </a>
                  </li>

                </ul>
              </aside>

              <div v-show="collapse_active" class="menu-version size-s">
                v{{ appVersionSaved }}
                <!--
                <div>
                  <strong>Copyright</strong> Kiplink © 2020-2025
                </div>
                -->
              </div>

              </div>
            </div>
            <ModalCreateTicket @createTicket="getCreateTicket" :active="isCreateTicket ? true : false"></ModalCreateTicket>
            <ChangePass @activateChangePass="getActivateChangePass" :active="isChangePass ? true : false"></ChangePass>
            <router-view :tab="collapse_active"></router-view>
          </section>
      </div>
      <div v-else>
        <router-view :tab="collapse_active"></router-view>
      </div>

    </div>

  </div>
</template>

<script>

import ChangePass from './comps/profile/ChangePass.vue'
import ModalCreateTicket from './comps/tickets/CreateTicket.vue'
import { EventBus } from './EventBus';
import { version } from '@/../package.json';

export default {
  name: 'App',
  components: {
    ChangePass,
    ModalCreateTicket
    /*
    Dashboard,
    Products
    */
  },
  data () {
    return {
      collapse_active: localStorage.getItem('menuCollapse') === 'true' ? true : false,
      isChangePass: false,
      showEditProfile: false,
      isCreateTicket: false,
      isDarkMode: localStorage.getItem('darkMode') === 'true' ? true : window.matchMedia('(prefers-color-scheme: dark)').matches,
      //viewMode: localStorage.getItem('viewMode') === 'single' ? 'single' : 'global'
      appVersionSaved: localStorage.getItem('appVersion'),
      appVersion: version,
    }
  },
  methods: {
    handleImageUpload (event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageBase64 = e.target.result
          let user = this.$store.getters.getUser
          user.image = imageBase64
          this.$store.dispatch('updateUser', user)
          const header = {
            'Content-Type': 'application/json'
          }
          let params = {
            'image_base64': imageBase64.split(',')[1]
          }
          this.$axios.post(process.env.ODOO_API + 'api/user/image?session_id=' + this.user.session_id, { params }, { headers: header })
            .then(response => {
              console.log('Image updated successfully', response)
            })
            .catch(error => {
              console.error('Error updating image', error)
            })
        }
        reader.readAsDataURL(file)
      }
    },
    toggleCollapse() {
      this.collapse_active = !this.collapse_active;
      localStorage.setItem('menuCollapse', this.collapse_active.toString());
    },
    toggleDarkMode () {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', this.isDarkMode.toString())
      this.updateStylesForMode()
    },
    toggleSwitchViewMode () {
      this.viewMode = this.viewMode === 'single' ? this.viewMode = 'global' : this.viewMode = 'single'
      localStorage.setItem('viewMode', this.viewMode);
    },
    updateStylesForMode () {
      if (this.isDarkMode) {
        document.body.classList.add('dark-mode')
        document.body.classList.remove('light-mode')
      } else {
        document.body.classList.add('light-mode')
        document.body.classList.remove('dark-mode')
      }
    },
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    getActivateChangePass (value) {
      this.isChangePass = value
    },
    activateChangePassModal () {
      this.isChangePass = true
    },
    logout () {
      this.$toastr.Add({
        name: 'Logout',
        title: 'À bientôt',
        msg: 'Au plaisir de vous revoir très vite ' + this.user.name.split(' ')[0],
        clickClose: true,
        timeout: 3000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'success',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '20%' }
      })
      this.$loader = true
      setTimeout(() => {
        this.$cookies.remove('access-token')
        this.$store.dispatch('disconnectMqtt');
        this.$store.dispatch('removeUser');
        this.$store.dispatch('resetClientsAndServers');
        this.$store.dispatch('resetSDAs');
        this.$store.dispatch('resetTrunk');
        this.$router.push('login')
      }, 1000)
    },
    goTo (route) {
      this.$loader = true
      const currentRoute = this.$route.fullPath
      setTimeout(() => {
        if (route === currentRoute) {
          location.reload()
        } else {
          this.$router.push(route)
        }
      }, 1000)
    },
    getCreateTicket (value) {
      this.isCreateTicket = value
    },
    CreateTicket () {
      this.isCreateTicket = true
    }
  },
  created () {
    /*
    if (localStorage.getItem('darkMode') === null) {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      localStorage.setItem('darkMode', this.isDarkMode.toString())
    }
    */
    if (this.isMobile) {
      localStorage.setItem('menuCollapse', 'false');
    } else {
      localStorage.setItem('menuCollapse', 'true');
    }
  },
  mounted () {
    //Check si on démarre avec les bons fichiers en cache dans le cas de mise à jour de version:

    if (this.appVersionSaved && this.appVersionSaved !== this.appVersion) {
      alert(`Nouvelle version disponible (v${this.appVersion}). Veuillez recharger la page.`);
      window.location.reload(true);  // Force le rechargement de la page avec le cache vidé
    }

    // Stocke la nouvelle version dans localStorage
    localStorage.setItem('appVersion', this.appVersion);


    this.$store.dispatch('setMenu', 'IPBX');
    EventBus.$on('showToastrAfterRedirect', () => {
      const currentRoute = this.$route.fullPath
      if ('/login' !== currentRoute) {
        this.$toastr.Add({
          name: 'ErrorSession',
          title: 'Session expirée',
          msg: 'Veuillez vous reconnecter !',
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
      setTimeout(() => {
        if ('/login' !== currentRoute) {
          this.$router.push('/login')
        }
      }, 1000)
    });
    this.updateStylesForMode()
    this.$loader = true
    setTimeout(() => {
      this.$loader = false
    }, 1000)
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  }
}
</script>

<style scoped>
.icon-container {
  display: flex;
  align-items: center;
  margin-right: 8px; /* Adjust the margin as needed */
}

.company-logo-tiers {
  content: "";
  display: block;
  flex: 0 1 50px;
  background-position: center center;
}

.loader-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.loader {
  display: inline-block;
  position: absolute;
  width: 80px;
  height: 80px;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto;
  top: 50%;
}
.loader div:nth-child(1) {
  animation-delay: -0.45s;
}
.loader div:nth-child(2) {
  animation-delay: -0.3s;
}
.loader div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.blur_page {
  opacity: 0.5;
}

.notyet {
  opacity: 0.25;
  pointer-events: none;
}

.containerpingparent {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.containerping {
  text-align: center;
}
.load {
  border: 2px solid #f3f3f3; 
  border-top: 2px solid red;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
