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
            <form>
              <div>
                <span>
                  <span class="field-container">
                    <div class="field">
                      <label class="label login-border">E-mail</label>
                      <div class="control has-icons-right">
                        <input v-model="email" type="text" autocomplete="on" placeholder="Votre e-mail ou votre identifiant" required="required" class="input is-success">
                      </div>
                      
                      <p class="help is-success"></p>
                    </div>
                  </span>
                  
                  <div class="btn_container">
                    <div>
                      <a @click="goToLogin()">
                        <span>Se connecter</span>
                      </a>
                    </div>
                    <button type="button" name="reset" class="button is-admin-primary" @click="reset()">
                      <span>
                        Confirmer
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
  name: 'Reset',
  data() {
    return {
      email: '',
      db: 'odoo'
    };
  },
  methods: {
    goToLogin () {
      this.$globalState.loader = true;
      this.$router.push('/login');
      this.$globalState.loader = false;
    },
    reset: function () {
      this.$globalState.loader = true
      const formData = new FormData()
      formData.append('login', this.email)
      formData.append('redirect', '')
      formData.append('token', '')
      console.log(formData)
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      this.$axios.post(process.env.ODOO_API + 'api/reset_password?db=' + this.db, formData, { headers }).then(response => {
        console.log(response)
        this.$toastr.Add({
          name: 'SuccesSent',
          title: 'Réinitialisation de mot de passe',
          msg: 'Un email a été envoyé avec les informations pour réinitialiser votre mot de passe.',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'success',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      })
      this.$globalState.loader = false
      this.goToLogin()
    }
  },
};
</script>

<style scoped>
.button.is-admin-primary.is-medium{background-color:#ff4d4d}.login_page .columns{height:100vh;margin-top:0;margin-bottom:0}.login_page button{line-height:1}.login_page form a{text-decoration:underline}.login_page form a:hover{text-decoration:none}.login_page .b-tooltip.is-dashed{border:none;font-size:.8rem;cursor:pointer}.login_page .b-tooltip.is-dashed span{border:1px dashed;height:18px;width:18px;font-size:.75rem;padding-left:6px;border-radius:50px;font-style:italic;position:absolute;top:-15px}.login_page .b-tooltip:not([data-label=""]):hover:before,.login_page .b-tooltip:not([data-label=""]):hover:after{width:351px;white-space:initial;font-size:.85rem;border:none;background:rgba(0,0,0,.8)}.login_page .login_media{position:relative;display:flex;flex-direction:column;justify-content:center;padding-left:7rem;background-image:url("/static/img/people.jpg");background-size:cover}.login_page .login_media::before{content:" ";background:rgba(36,46,66,.8);position:absolute;top:0;left:0;right:0;z-index:0;bottom:0}.login_page .login_media h1{font-weight:300;margin:0;font-size:2.5rem;z-index:1}.login_page .login_media h2{text-transform:uppercase;margin:0;font-size:3.5rem;font-weight:500;z-index:1}.login_page .login_media h2:after{position:absolute}.login_page .login_form{display:flex;flex-direction:column;justify-content:center;padding:0 7rem}.login_page .login_form .freeprologo{margin-bottom:3rem;text-align:center}.login_page .login_form .freeprologo img{width:200px}.login_page .login_form .field{margin-bottom:3rem}.login_page .login_form .btn_container{display:flex;justify-content:space-between;align-items:center}.login_page .login_form input{height:2.8rem}.login_page .login_form input[type=password]+span.icon.is-right.has-text-primary.is-clickable,.login_page .login_form .field input[type=text]+span.icon.is-right.has-text-primary.is-clickable{height:2.8rem !important}.login_page .login_form .mandatory .control-label{font-weight:light;font-size:.75rem}@media(max-width: 1300px){.login_page .login_media{padding:3rem}.login_page .login_form{padding:0 3rem}}@media(max-width: 1000px){.login_page .login_form .btn_container{text-align:center;flex-direction:column-reverse}.login_page .b-tooltip.is-dashed span{padding-left:0}}@media(max-width: 768px){.login_page .b-tooltip{display:none}.login_page .columns{height:auto;margin:0;padding:0}.login_page .btn_container div{position:relative}.login_page .login_media{padding-top:calc( 59px + 1rem );padding-bottom:1rem;justify-content:initial;text-align:center;background-image:none}.login_page .login_media::before{content:none}.login_page .login_media h1{font-size:1.25rem}.login_page .login_media h2{font-size:1.7rem}.login_page .login_media h2:after{position:initial}.login_page .login_form{margin-bottom:3rem}.login_page .login_form .freeprologo{margin-bottom:1rem}.login_page .login_form .field{margin-bottom:2rem}}

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
