<template>

  <div data-v-65729484="" tabindex="-1" :class="active ? 'modal modalSupportDiag is-active' : 'modal modalSupportDiag'">

    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div data-v-65729484="" class="modal-card">
        <div data-v-65729484="" class="modal-card-head">
          <p data-v-65729484="" class="modal-card-title">
            Êtes vous sûr de vouloir cloturer le ticket?
          </p>
          <button @click="quitModal()" type="button" class="delete"></button>
        </div>
        
        <section data-v-65729484="" class="modal-card-body">
          <div data-v-65729484="">
            <div data-v-65729484="" class="container is-fluid supportDiag">
              <div data-v-42540544="" data-v-65729484=""><div data-v-42540544="" class="container is-fluid supportDiag">

                <!--
                <div class="container" v-show="showLoading != false">
                  <div class="loading-inline">
                    <div class="loading-icon"></div>
                    <br>
                  </div>
                </div>
                -->

                <div v-show="isValidate == false" data-v-42540544="">
                  
                  <div class="level">
                    <div class="level_title">
                      <p class="mb-2 answer_title">
                        Voulez vous passez ce ticket à l'état: Cloturer?
                      </p>
                      <button type="button" class="button is-admin-primary is-small" @click="closeTicket()">
                        <span>
                          Oui
                        </span>
                      </button>
                      <button type="button" class="button is-admin-primary is-small" @click="quitModal()">
                        <span>
                          Non
                        </span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  </div>

</template>

<script>
export default {
  name: 'CloseTicketStatus',
  props: {
    active: Boolean,
    number: String
  },
  data: () => {
    return {
      isOk: false,
      isNotOk: false,
      isValidate: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  watch: {
    active: function (newVal, oldVal) {
      if (newVal === true) {
        this.isValidate = false
        this.isNotOk = false
        this.isOk = false
      }
    }
  },
  methods: {
    quitModal () {
      this.$emit('closeTicketStatus', false)
    },
    async closeTicket () {
      await this.$axios.post(process.env.ODOO_API + 'api/tickets/close?session_id=' + this.user.session_id + '&number=' + this.number).then(response => {
        return response.data.list[0]
      })
      this.quitModal()
    }
  },
  async created () {
  },
  mounted () {
    this.$globalState.loader = false
  }
}
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: black;
}

.autocomplete .dropdown-item, .autocomplete .dropdown .dropdown-menu .has-link a, .dropdown .dropdown-menu .has-link .autocomplete a {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

</style>