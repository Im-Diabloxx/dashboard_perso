<template>
    <div tabindex="-1" :class="active ? 'modal modalPassW is-active' : 'modal modalPassW'">
      <div class="modal-background"></div>
      <div class="animation-content" style="max-width: 960px;">
        <div class="modal-card">
          <div class="modal-card-head">
            <p class="modal-card-title">
              Changer de mot de passe
            </p>
            <button @click="cancel()" class="delete"></button>
          </div>
          <form>
            <span>
              <section class="modal-card-body">
                <span>
                  <div class="field">
                    <label class="label">Mot de passe de passe actuel</label>
                    <div class="control has-icons-right">
                      <input type="password" autocomplete="on" class="input" v-model="old_password">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>
                <span>
                  <div class="field">
                    <label class="label">Nouveau mot de passe</label>
                    <div class="control has-icons-right">
                      <input type="password" autocomplete="on" class="input" v-model="new_password">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>
                <span>
                  <div class="field">
                    <label class="label">Nouveau mot de passe (confirmation)</label>
                    <div class="control has-icons-right">
                      <input type="password" autocomplete="on" class="input" v-model="new_password_confirmation">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>
              </section>
              
              <footer class="modal-card-foot">
                <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">
                  Annuler
                </button>
                <button type="button" class="button is-admin-primary is-large" @click="updatePass()">
                  Modifier
                </button>
              </footer>
            </span>
          </form>
        </div>
      </div>
  </div>
</template>


<script>
export default {
  name: 'ChangePass',
  props: {
    active: Boolean
  },
  data: () => {
    return {
      old_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
  },
  watch: {
    active: function (newVal, oldVal) {
      if (newVal === true) {
        this.old_password = ''
        this.new_password = ''
        this.new_password_confirmation = ''
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    quitChangePass () {
      this.$emit('activateChangePass', false)
    },
    cancel () {
      this.quitChangePass()
    },
    updatePass () {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'fields': [
          {'name': 'old_pwd', 'value': this.old_password},
          {'name': 'new_password', value: this.new_password},
          {'name': 'confirm_pwd', 'value': this.new_password_confirmation}
        ]
      }
      if (this.new_password === this.new_password_confirmation) {
        this.$axios.post(process.env.ODOO_API + 'api/change_password?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          if (response.status === 200) {
            this.$toastr.Add({
              name: 'SuccesData',
              title: 'Nickel :)',
              msg: 'Votre mot de passe a bien été changé',
              clickClose: true,
              timeout: 3000,
              progressBarValue: 0,
              position: 'toast-top-right',
              type: 'success',
              preventDuplicates: true,
              classNames: ['animated', 'slideInRight'],
              style: { 'margin-top': '20%' }
            })

            /* let newparams = {
              'login': this.user.email,
              'password': this.new_password,
              'db': 'odoo'
            }
            console.log(newparams)
            this.$axios.post(process.env.ODOO_API + 'api/login', { newparams }, { headers: header }).then(response => {
              if (response.data.result && response.data.result.uid) {
                console.log(response.data.result)
                let company = response.data.result.user_companies.current_company[1]
                let user = this.$store.getters.getUser
                user.name = response.data.result.name
                user.email = response.data.result.username
                user.id_company = response.data.result.uid
                user.company_name = company
                user.session_id = response.data.result.session.sid
                this.$store.dispatch('updateUser', user)
                this.$cookies.set('access-token', user.session_id)
                this.$axios.defaults.headers.common['Authorization'] = user.session_id
              }
            }) */
            this.quitChangePass()
            this.$globalState.loader = true
            setTimeout(() => {
              this.$cookies.remove('access-token')
              this.$router.push('login')
            }, 1000)
          } else {
            this.$toastr.Add({
              name: 'ErrorData',
              title: 'Oups :/',
              msg: 'Nous n\'avons pas pu modifié votr mot de passe',
              clickClose: true,
              timeout: 3000,
              progressBarValue: 0,
              position: 'toast-top-right',
              type: 'error',
              preventDuplicates: true,
              classNames: ['animated', 'slideInRight'],
              style: { 'margin-top': '20%' }
            })
          }
        })
      } else {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Oups :/',
          msg: 'Nous n\'avons pas pu modifié votr mot de passe, veuillez vérifier les champs saisis',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      }
    }
  },
  mounted () {
    this.$globalState.loader = false
  }
}
</script>