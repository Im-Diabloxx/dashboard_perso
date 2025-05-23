<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">

      <section class="container is-max-widescreen">
        <h1>
            <a @click="goToProducts()" class="router-link-active">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                        <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                    </g>
                </svg>
            </a>
            Mon IPBX
            <span>/ Maquette</span>
        </h1>
        <nav class="tabs mb-0 is-hidden-mobile">
            <ul class="justify-content-center">
                <li class="router-link-exact-active" :class="page === 'system' ? 'is-active' : ''"><a @click="page = 'system'"><span aria-current="page">Système</span></a></li>
                <li class="router-link-exact-active" :class="page === 'users' ? 'is-active' : ''"><a @click="page = 'users'"><span aria-current="page">Utilisateurs</span></a></li>
                <li class="router-link-exact-active" :class="page === 'phones' ? 'is-active' : ''"><a @click="page = 'phones'"><span aria-current="page">Téléphones</span></a></li>
            </ul>
        </nav>

        <section>
          <div class="fieldset" v-if="page === 'phones'">
              <label>Mes Téléphones</label>
              <div class="fieldset-content">
                  <div class="b-table">
                      <!-- ... Autres éléments de l'interface ... -->
                      <div class="table-wrapper has-mobile-cards">
                          <table class="table">
                              <thead>
                                  <tr>
                                      <th>Marque</th>
                                      <th>Modèle</th>
                                      <th>Statut</th>
                                      <th>Addresse IP</th>
                                      <th>Actions</th>
                                  </tr>
                              </thead>
                              <tbody v-for="phone in phones" :key="phone.id">
                                  <tr draggable="false">
                                      <td data-label="Marque">{{ phone.manufacturer }}</td>
                                      <td data-label="Modèle">{{ phone.model }}</td>
                                      <td data-label="Status">{{ phone.status }}</td>
                                      <td data-label="Addresse IP">{{ phone.ip }}</td>
                                      <td class="has-text-centered">
                                          <a @click="performAction(phone.id)">
                                              <i class="fa fa-undo"></i>
                                          </a>
                                          <a @click="performAction(phone.id)">
                                              <i class="fa fa-power-off"></i>
                                          </a>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
          <div class="fieldset" v-if="page === 'users'">
              <label>Mes Utilisateurs</label>
              <div class="fieldset-content">
                  <div class="b-table">
                      <!-- ... Autres éléments de l'interface ... -->
                      <div class="table-wrapper has-mobile-cards">
                          <table class="table">
                              <thead>
                                  <tr>
                                      <th>Numéro Exten</th>
                                      <th>Nom</th>
                                      <th>Groupe</th>
                                      <th>Actions</th>
                                  </tr>
                              </thead>
                              <tbody v-for="user in users" :key="user.id">
                                  <tr draggable="false">
                                      <td data-label="Numéro Externe">{{ user.iduser }}</td>
                                      <td data-label="Nom">{{ user.name }}</td>
                                      <td data-label="Groupe">{{ user.idgroup }}</td>
                                      <td class="has-text-centered">
                                          <a @click="performAction(user.id)">
                                              <i class="fa fa-undo"></i>
                                          </a>
                                          <a @click="performAction(user.id)">
                                              <i class="fa fa-power-off"></i>
                                          </a>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
        </section>

      </section>
  </div>

</template>

<script>
export default {
  name: 'IPBXManagement',
  props: {
    msg: String,
    tab: Boolean
  },
  data () {
    return {
      // mqttClient: null,
      users: [],
      phones: [],
      page: 'phones'
    }
  },
  mounted () {
    this.$loader = false
    // this.setupMqttConnection()
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    goToProducts () {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products')
      }, 1000)
    },
    setupMqttConnection () {
      /*
      const ip = this.$route.query.ip
      const ipbx_name = 'MAQUETTE'
      const options = {
        client_id: `mqtt_iprateur_${ipbx_name}`,
        username: 'IPRATEUR',
        password: 'K04$J94DlyRoSiW9+RL!vGfI6P%aBr:q',
        rejectUnauthorized: false
      };

      this.mqttClient = mqtt.connect(`wss://${ip}:9001/`, options);

      this.mqttClient.on('connect', () => {
        console.log('MQTT Connected')
        this.mqttClient.subscribe('kiplink/subsidiary/+/group/+/user/+/status')
        this.mqttClient.subscribe('kiplink/subsidiary/+/cpe/+/+/status')
      })

      this.mqttClient.on('message', (topic, message) => {
        if (topic.startsWith('kiplink/subsidiary/')) {
          const topicParts = topic.split('/')
          if (topicParts[3] === 'group') {
            this.handleUserMessage(topic, message)
          } else if (topicParts[3] === 'cpe') {
            this.handlePhoneMessage(topic, message)
          }
        }
      })
      */
    },
    handleUserMessage (topic, message) {
      /*
      const parsedMessage = JSON.parse(message.toString())
      const iduser = parsedMessage.Exten
      const idgroup = parsedMessage.Group
      const name = parsedMessage.Name

      const existingUserIndex = this.users.findIndex(u => u.iduser === iduser)
      if (existingUserIndex !== -1) {
        this.$set(this.users, existingUserIndex, { iduser, idgroup, name })
      } else {
        this.users.push({ iduser, idgroup, name })
      }
      */
    },
    handlePhoneMessage (topic, message) {
      /*
      const parsedMessage = JSON.parse(message.toString())
      const id = parsedMessage.Id
      const model = parsedMessage.Model
      const manufacturer = parsedMessage.Manufacturer
      const status = parsedMessage.SIPstatus
      const ip = parsedMessage.IP

      const existingPhoneIndex = this.phones.findIndex(p => p.id === id)
      if (existingPhoneIndex !== -1) {
        this.$set(this.phones, existingPhoneIndex, { id, model, manufacturer, status, ip })
      } else {
        this.phones.push({ id, model, manufacturer, status, ip })
      }
      console.log(this.phones)
      */
    }
  },
  beforeDestroy () {
    /*
    if (this.mqttClient) {
      this.mqttClient.end()
      console.log('MQTT Disconnected')
    }
    */
  }
}
</script>

<style scoped>

</style>
