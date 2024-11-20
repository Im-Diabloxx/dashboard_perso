<template>
<div>

  <header>
    <div>
      <nav id="nav2" role="navigation">
          <div class="content columns">
            <div class="logo column">
              <a title="lien vers la page d'accueil" href="/">
                <div class="logo-img"/>
              </a>
            </div>


            <!--
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
            -->

            <!--
            <div @click="toggleDarkMode" style="align-self: center; margin-right: 1%;">
                <span>
                    <i :class="isDarkMode ? 'fal fa-sun' : 'fal fa-moon'"></i>
                </span>
            </div>

            <div>
            </div>
            <div>
            </div>
            -->

          </div>
      </nav>
      <div id="slideout-overlay" class="slideout-overlay"></div></div>
  </header>


  <div style="padding-top: 0px">
    <div class="container-fluid login_page account">
      <div class="columns">
        <div class="column is-three-fifths login_media">
          <h1>Enfin un espace client pensé</h1>
          <h2>Pour les Pros</h2>
        </div>
        <div class="column is-two-fifths login_form login-border">
          <div class="freeprologo">
            <img src="/static/img/logo-blue.png" style="transform: scale(0.5);"></div>
          <div>

            <form @keyup.enter="login()">
              <div>
                <span>
                  <span class="field-container">
                    <div class="field">
                      <label class="label login-border">E-mail</label>
                      <div class="control has-icons-right">
                        <input v-on:change="onEmailChange()" v-model="email" type="text" autocomplete="on" placeholder="Votre e-mail ou votre identifiant" required="required" class="input is-success">
                      </div>
                      
                      <p v-if="!email || email.length <= 0" class="help is-success" style="color: white">Veuillez saisir votre nom d'utilisateur</p>
                      <p v-else-if="email && email.length > 0 && isLogin == false" class="help is-success" style="color: red">Votre nom d'utilisateur semble incorrect</p>
                      <p v-else class="help is-success" style="color: white; visibility: hidden">rien à afficher</p>
                    </div>
                  </span>
                  
                  <span class="field-container">
                    <div class="field">
                      <label class="label login-border">Mot de passe</label>
                      <div class="control has-icons-right">
                        <input v-on:change="onPassChange()" v-model="password" type="password" autocomplete="on" placeholder="Votre mot de passe" required="required" class="input is-success">
                      </div>
                      <p v-if="!password || password.length <= 0" class="help is-success" style="color: white">Veuillez saisir votre mot de passe</p>
                      <p v-else-if="password && password.length > 0 && isLogin == false" class="help is-success" style="color: red">Votre nom d'utilisateur semble incorrect</p>
                      <p v-else class="help is-success" style="color: white; visibility: hidden">rien à afficher</p>
                    </div>
                  </span>
                  
                  <div class="btn_container">
                    <div>
                      <a @click="goToReset">
                        <span>Mot de passe oublié ?</span>
                      </a>
                    </div>
                    
                    <button type="button" name="sign_in" class="button is-admin-primary" v-on:click="login()">
                      <span>
                        Se connecter
                      </span>
                    </button>
                  </div>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>

export default {
  name: 'Login',
  props: {
    msg: String
  },
  components: {
  },
  data () {
    return {
      isLogin: null,
      email: '',
      password: '',
      db: '',
      isReset: false,
      addPassword: false,
      devMode: false,
      secretKeysPressed: { k: false, p: false, x: false },
      isDarkMode: localStorage.getItem('darkMode') === 'true' ? true : window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  },
  methods: {
    toggleDarkMode () {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', this.isDarkMode.toString())
      this.updateStylesForMode()
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
    handleKeyDown(event) {
      const key = event.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(this.secretKeysPressed, key)) {
        this.secretKeysPressed[key] = true;
        this.checkSecretKeys();
      }
    },

    handleKeyUp(event) {
      const key = event.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(this.secretKeysPressed, key)) {
        this.secretKeysPressed[key] = false;
      }
    },

    checkSecretKeys() {
      const { k, p, x } = this.secretKeysPressed;
      if (k && p && x) {
        this.devMode = !this.devMode;
        const user = this.$store.getters.getUser;
        user.devMode = this.devMode;
        this.$store.dispatch('updateUser', user);
        console.log('Secret keys pressed. devMode set to true.');
      }
    },
    onEmailChange () {
      if (this.email.length === 0) {
        this.isLogin = null
      }
    },
    onPassChange () {
      if (this.password.length === 0) {
        this.isLogin = null
      }
    },
    login: function () {
      if (this.devMode) {
        this.db = 'odoo_test'
      } else {
        this.db = 'odoo'
      }
      this.$globalState.loader = true;

      const params = {
        'login': this.email,
        'password': this.password,
        'db': this.db
      };

      const header = {
        'Content-Type': 'application/json'
      };

      this.$axios.post(process.env.ODOO_API + 'api/login', { params }, { headers: header })
        .then(response => {
          if (response.data.result && response.data.result.uid) {
            this.handleLoginSuccess(response.data.result);
          } else {
            this.handleLoginFailure();
          }
        })
        .catch(error => {
          console.error('An error occurred during login:', error);
          this.handleLoginFailure();
        });
    },
    handleLoginSuccess(result) {
      this.isLogin = true;

      const user = this.$store.getters.getUser;
      user.name = result.name;
      user.email = result.username;
      user.id_company = result.user_companies.current_company[0];
      user.company_name = result.user_companies.current_company[1];
      user.session_id = result.session.sid;
      user.allowed_routes = result.routes_allowed;
      user.id_vpn = result.id_vpn;
      user.id_server_vpn = result.id_server_vpn;
      user.image = 'data:image/png;base64,' + result.image;
      user.csrf_token = result.session.csrf_token;
      user.devMode = this.devMode;
      user.default_route = result.default_route;
      let df_route = 'products'
      if (!df_route || df_route.length <= 1) {
        df_route = 'products'
      }

      this.$store.dispatch('updateUser', user);
      // const expirationDate = new Date();
      // expirationDate.setDate(expirationDate.getDate() + 7); // Add 7 days
      // this.$cookies.set('access-token', user.session_id, {
      //  expires: expirationDate
      // });
      // this.$cookies.set('access-token', user.session_id);
      this.$axios.defaults.headers.common['Authorization'] = user.session_id;
      // this.$store.dispatch('initializeMqtt');

      this.$router.push('/' + df_route);
      this.$globalState.loader = false;
    },
    handleLoginFailure() {
      this.isLogin = false;
      this.$globalState.loader = false;

      this.$toastr.Add({
        name: 'ErrorCredentials',
        title: 'Erreur',
        msg: 'Vos crédentials ne sont pas bons, veuillez réessayer !',
        clickClose: true,
        timeout: 3000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'error',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '20%' }
      });
    },
    goToReset () {
      this.$globalState.loader = true;
      this.$router.push('/reset-password');
      this.$globalState.loader = false;
    },
  },
  mounted() {
    setTimeout(() => { this.$globalState.loader = false }, 1000)
    console.log(this.$globalState.loader, 'ICI')
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  },
}
</script>


<style scoped>

.ribbon {
  position: fixed;
  width: 100%;
  top: 10%;
  right: 3%;
  background-color: #ff0000; /* Adjust the background color */
  color: #ffffff; /* Adjust the text color */
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  z-index: 1000;
  transform: rotate(-45deg);
  transform-origin: 0 0;
  white-space: nowrap;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Optional: Add shadow for better visibility */
}
</style>