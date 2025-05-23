<template>
    <div tabindex="-1" :class="active ? 'modal modalPassW is-active' : 'modal modalPassW'">
      <div class="modal-background"></div>
      <div class="animation-content" style="max-width: 960px;">
        <div class="modal-card" :style="isMobile() ? 'overflow: auto;' : 'width: 700px; overflow: auto;'">
          <div class="modal-card-head">
            <p class="modal-card-title">
              Éditer ma commande
            </p>
            <button @click="cancel()" class="delete"></button>
          </div>
          <form>
            <span>
              <section class="modal-card-body pb-0 pt-0">
                <p class="modal-body-title mb-2">
                  Informations relatives au contrat
                </p>
                
                <div class="is-flex-centered" style="align-items: normal; pointer-events: none;">
                  <div class="field mb-4  is-ip help-as-tooltip d-block">
                    <label class="label">Numéro de contract</label>
                    <div class="control is-clearfix">
                      <input type="text" autocomplete="on" class="input" v-model="localOrder.number">
                    </div>
                  </div>

                  <div class="field mb-4  is-ip help-as-tooltip d-block" style="pointer-events: none;">
                    <label class="label">Nom de contract</label>
                    <div class="control is-clearfix">
                      <input type="text" autocomplete="on" class="input" v-model="localOrder.name">
                    </div>
                  </div>

                  <div class="field mb-4  is-ip help-as-tooltip d-block">
                    <label class="label">Client</label>
                    <div class="control is-clearfix">
                      <input type="text" autocomplete="on" class="input" v-model="localOrder.partner">
                    </div>
                  </div>

                  <div class="field mb-4  is-ip help-as-tooltip d-block">
                    <label class="label">Liste de Prix</label>
                    <!---
                    <div class="control is-clearfix">
                      <span class="select">
                        <select>
                          <option value="24">
                            255.255.255.0/24
                          </option><option value="23">
                            255.255.254.0/23
                          </option><option value="22">
                            255.255.252.0/22
                          </option><option value="21">
                            255.255.248.0/21
                          </option><option value="20">
                            255.255.240.0/20
                          </option><option value="19">
                            255.255.224.0/19
                          </option><option value="18">
                            255.255.192.0/18
                          </option><option value="17">
                            255.255.128.0/17
                          </option>
                        </select>
                      </span>
                    </div>
                    -->
                    <div class="control is-clearfix">
                      <input type="text" autocomplete="on" class="input" v-model="localOrder.pricelist">
                    </div>
                  </div>

                  <div class="field mb-4 help-as-tooltip d-block">
                    <label class="label">Mode de paiement</label>
                    <div class="control is-clearfix">
                      <input type="text" autocomplete="on" class="input" v-model="localOrder.payment_mode">
                    </div>
                  </div>

                  <div class="field mb-4 help-as-tooltip d-block" v-if="localOrder.type === 'contract'">
                    <label class="label">Date de la prochaine facture</label>
                    <div class="control is-clearfix">
                      <input type="text" autocomplete="on" class="input" v-model="localOrder.recurring_next_date">
                    </div>
                  </div>

                </div>
                  
                <p class="modal-body-title mb-2" v-if="localOrder.type === 'contract'">
                  Lignes de contrat
                </p>
                <p class="modal-body-title mb-2" v-else>
                  Lignes de ventes
                </p>

                <div class="is-flex-centered table-wrapper has-mobile-cards" style="align-items: normal">
                  
                  <table class="table" v-if="localOrder.type === 'contract'">
                    <thead>
                        <tr>
                            <th class="is-sortable">
                                <div class="th-wrap">Statut
                                </div>
                            </th>
                            <th class="is-current-sort is-sortable">
                                <div class="th-wrap">Article
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Quantité
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Valeur
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Prix Unitaire
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Prix Total
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody style="background-color: #242e42" v-for="cl of localOrder.contract_lines" :key="cl.id">
                      <tr>
                        <td>
                          <span>
                          {{getState(cl.state)}}
                          </span>
                        </td>
                        <td>
                          <span>
                          {{cl.name}}
                          </span>
                        </td>
                        <td>
                          <span>
                          {{cl.quantity}}
                          </span>
                        </td>
                        <td v-if="cl.type === 'trunk'">
                          <span>
                          Username: {{cl.username}}
                          </span>
                          <br>
                          <span>
                          Secret: {{cl.secret}}
                          </span>
                          <br>
                          <span>
                          Max calls: {{cl.max_calls}}
                          </span>
                          <span>
                          <br>
                          Max incoming calls: {{cl.max_incoming_calls}}
                          </span>
                          <br>
                          <span>
                          Max outgoing calls: {{cl.max_outgoing_calls}}
                          </span>
                        </td>

                        <td v-else-if="cl.type === 'did'">
                          <span>
                          {{cl.sda_number}}
                          </span>
                        </td>

                        <td v-else>
                          <span>
                          </span>
                        </td>

                        <td>
                          <span>
                          {{cl.price_unit.toFixed(2)}}
                          </span>
                        </td>

                        <td>
                          <span>
                          {{cl.price_subtotal.toFixed(2)}}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>


                  <table class="table" v-else>
                    <thead>
                        <tr>
                            <th class="is-sortable">
                                <div class="th-wrap">Statut
                                </div>
                            </th>
                            <th class="is-current-sort is-sortable">
                                <div class="th-wrap">Article
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Quantité
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Prix Unitaire
                                </div>
                            </th>
                            <th class="is-sortable">
                                <div class="th-wrap">Prix Total
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody style="background-color: #242e42" v-for="sl of localOrder.sales_lines" :key="sl.id">
                      <tr>
                        <td>
                          <span>
                          {{getState(sl.state)}}
                          </span>
                        </td>
                        <td>
                          <span>
                          {{sl.name}}
                          </span>
                        </td>
                        <td>
                          <span>
                          {{sl.quantity}}
                          </span>
                        </td>

                        <td>
                          <span>
                          {{sl.price_unit.toFixed(2)}}
                          </span>
                        </td>

                        <td>
                          <span>
                          {{sl.price_subtotal.toFixed(2)}}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
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
    active: Boolean,
    order: Array
  },
  data: () => {
    return {
      localOrder: [],
      contract_details: []
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
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    quitChangePass () {
      this.$emit('editOrder', false)
    },
    cancel () {
      this.quitChangePass()
    },
    updateOrder () {
    },
    getState (s) {
      if (s === 'terminated') {
        return 'Terminé'
      } else if (s === 'order') {
        return 'Commande'
      } else if (s === 'quotation') {
        return 'Devis'
      } else if (s === 'cancel') {
        return 'Annulé'
      } else if (s === 'done') {
        return 'Fait'
      } else if (s === 'sent') {
        return 'Envoyé'
      } else if (s === 'draft') {
        return 'Brouillon'
      }
    }
  },
  created () {
    this.localOrder = JSON.parse(JSON.stringify(this.order))
  },
  mounted () {
    this.$loader = false
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

.is-admin-success {
  background-color:#21bf26;
  color:#fff;
}


/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: black;
}
</style>