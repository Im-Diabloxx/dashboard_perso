<template>
  <div tabindex="-1" :class="active ? 'modal modalCreateVPN is-active' : 'modal modalCreateVPN'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Créer un serveur VPN</p>
          <button @click="cancel()" class="delete"></button>
        </div>
        <form>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Port</label>
              <div class="control">
                <input type="text" class="input" v-model="port">
              </div>
            </div>
            <div class="field">
              <label class="label">IP</label>
              <div class="control">
                <input type="text" class="input" v-model="ip">
              </div>
            </div>
            <div class="field">
              <label class="label">Mask</label>
              <div class="control">
                <input type="text" class="input" v-model="mask">
              </div>
            </div>
            <div class="field">
              <label class="label">CA</label>
              <div class="control">
                <input type="text" class="input" v-model="ca">
              </div>
            </div>
            <div class="field">
              <label class="label">Pays</label>
              <div class="control">
                <input type="text" class="input" v-model="country">
              </div>
            </div>
            <div class="field">
              <label class="label">État</label>
              <div class="control">
                <input type="text" class="input" v-model="state">
              </div>
            </div>
            <div class="field">
              <label class="label">Ville</label>
              <div class="control">
                <input type="text" class="input" v-model="city">
              </div>
            </div>
            <div class="field">
              <label class="label">Organisation</label>
              <div class="control">
                <input type="text" class="input" v-model="organisation">
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input type="text" class="input" v-model="email">
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">Annuler</button>
            <button type="button" class="button is-admin-primary is-large" @click="createVPNServer()">Créer</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateVPNServer',
  props: {
    active: Boolean
  },
  data: () => {
    return {
      port: '',
      ip: '',
      mask: '',
      ca: '',
      country: '',
      state: '',
      city: '',
      organisation: '',
      email: ''
    }
  },
  methods: {
    cancel () {
      this.$emit('createServer', false)
    },
    createVPNServer () {
      const vpnServerData = {
        port: this.port,
        ip: this.ip,
        mask: this.mask,
        ca: this.ca,
        country: this.country,
        state: this.state,
        city: this.city,
        organisation: this.organisation,
        email: this.email
      }
      console.log(vpnServerData)

      // Make an API request to create the VPN server
      // Example Axios code:
      // axios.post('YOUR_API_URL', vpnServerData)
      //   .then(response => {
      //     // Handle success
      //   })
      //   .catch(error => {
      //     // Handle error
      //   })

      this.cancel()
    }
  }
}
</script>

<style scoped>
/* Add your modal styles here */
</style>
