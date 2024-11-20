<template>
  <div
    tabindex="-1"
    :class="active ? 'modal modalItemInfo is-active' : 'modal modalItemInfo'"
  >
    <div class="modal-background"></div>
    <div class="animation-content" style="min-width: 70%">
      <div class="modal-card" style="width: 100%">
        <div class="modal-card-head" style="padding-bottom: 0">
          <p class="modal-card-title">
            Ma ligne KIPLINK : {{ getPhoneNumberE164(tmpItem.name) }}
            <a style="align-self: center; margin-left: 1rem" :title="getState(tmpItem.status)">
              <span class="fa fa-circle" :style="tmpItem.status == 'free' ? 'color: gray' : 'color: #21bf26'"></span>
            </a>
          </p>
          <button @click="cancel()" class="delete"></button>
        </div>

        <div class="">
          <div class="admin-box" style="padding-top: 2rem">

            <div class="container is-max-widescreen mobile">

              <div class="columns">
                <div class="column">
                  <nav class="tabs">
                    <ul>
                        <li :class="menu === 'phone' ? 'is-active' : ''">
                            <a @click="setMenu('phone')"><span>Téléphonie</span></a>
                        </li>
                        <li :class="menu === 'admin' ? 'is-active' : ''">
                            <a @click="setMenu('admin')"><span>Administration</span></a>
                        </li>
                        <li :class="menu === 'contract' ? 'is-active' : ''">
                            <a @click="setMenu('contract')"><span>Contrats</span></a>
                        </li>
                    </ul>
                    <!---->
                  </nav>
                </div>
                <div class="column has-text-right">
                  <div>
                    <div class="is-active">
                      <!--
                      <a style="align-self: center; margin-right: 20px" :title="'Détacher du contrat ou supprimer du stock'">
                        <span class="fa fa-trash" ></span>
                      </a>
                      -->
                      <span :title="'Détacher la SDA'" class="material-symbols-outlined">
                        link_off
                      </span>
                    </div>
                  </div>
                  <!---->
                </div>
              </div>
                  
              <div class="wrapper_line_infos" v-if="menu === 'phone'">

                <div class="box-account line_infos">
                  <div class="box-container">
                    <div class="box-title">Informations de ma ligne</div>
                    <div class="box-content">
                      <div>
                        <ul class="definitions two-columns-ul">
                          <li class="two-columns-pads">
                            <span> Numéro de ligne : </span>
                            <strong> {{getPhoneNumberE164(tmpItem.name)}} </strong>
                          </li>
                          <li class="two-columns-pads">
                            <span> Code RIO : </span>
                            <strong> {{tmpItem.rio ? tmpItem.rio : ""}} </strong>
                          </li>

                          <!--
                          <li class="two-columns-pads">
                            <span> Fournisseur : </span>
                            <strong> {{tmpItem.unicom_origin_supplier_provider}} </strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Fournisseur d'origine : </span>
                            <strong> {{tmpItem.unicom_supplier_provider}} </strong>
                          </li>
                          -->

                          <li class="two-columns-pads">
                            <span> Statut :</span>
                            <span class="badge badge-gray" v-if="tmpItem.project_state"> [{{tmpItem.project_type}}] {{tmpItem.project_state}} </span>
                            <span class="badge badge-gray" v-else> Aucune information </span>
                          </li>

                          <li class="two-columns-pads" style="visibility: hidden;">
                            <span>EMPTY</span>
                            <strong>EMPTY</strong>
                          </li>


                          <li class="two-columns-pads" style="visibility: hidden;">
                            <span>EMPTY</span>
                            <strong>EMPTY</strong>
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div>
                </div>


                <div class="box-account line_cost">
                  <div class="box-container">
                    <div class="box-title">Spécifictés de la ligne</div>
                    <div class="box-content">
                      <div>
                        <ul class="definitions two-columns-ul">
                          <li class="two-columns-pads">
                            <div data-v-65729484="" class="" style="display: flex;">
                                <span> Renvoi inconditionnel : </span>
                                <label data-v-65729484="" class="switch pl-3 is-rounded">
                                    <input type="checkbox" v-model="tmpItem.is_unconditional_forwarding_active" @click="tmpItem.is_unconditional_forwarding_active = !tmpItem.is_unconditional_forwarding_active">
                                    <span class="check"></span>
                                    <span class="control-label"></span>
                                </label>
                            </div>

                            <input placeholder="" v-model="tmpItem.unconditional_forward" class="input" style="width: 50%; color: white;">
                          </li>

                          <li class="two-columns-pads">
                            <div data-v-65729484="" class="" style="display: flex;">
                                <span> Renvoi injoignable : </span>
                                <label data-v-65729484="" class="switch pl-3 is-rounded">
                                    <input type="checkbox" v-model="tmpItem.is_unreachable_forwarding_active" @click="tmpItem.is_unreachable_forwarding_active = !tmpItem.is_unreachable_forwarding_active">
                                    <span class="check"></span>
                                    <span class="control-label"></span>
                                </label>
                            </div>

                            <input placeholder="" v-model="tmpItem.unreachable_forward" class="input" style="width: 50%; color: white;">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div class="wrapper_line_infos" v-if="menu === 'admin'">

                <div class="box-account line_infos">
                  <div class="box-container">
                    <div class="box-title">Informations administratives</div>
                    <div class="box-content">
                      <div>
                        <ul class="definitions two-columns-ul">
                          <li class="two-columns-pads">
                            <span> Prix d'achat : </span>
                            <strong> {{tmpItem.purchase_price}}€ </strong>
                          </li>
                          <li class="two-columns-pads">
                            <span> Prix de vente : </span>
                            <strong> {{tmpItem.sale_price}}€ </strong>
                          </li>

                          <li class="two-columns-pads" style="visibility: hidden;">
                            <span>EMPTY</span>
                            <strong>EMPTY</strong>
                          </li>

                          <li class="two-columns-pads" style="visibility: hidden;">
                            <span>EMPTY</span>
                            <strong>EMPTY</strong>
                          </li>

                          <li class="two-columns-pads" style="visibility: hidden;">
                            <span>EMPTY</span>
                            <strong>EMPTY</strong>
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="box-account line_cost">
                  <div class="box-container">
                    <div class="box-title">Frise chronologique</div>
                    <div class="box-content">
                      <div>
                        <ul class="definitions two-columns-ul">
                          <li class="two-columns-pads">
                            <span> Date de création : </span>
                            <strong> {{tmpItem.create_date}} </strong>
                          </li>
                          <li class="two-columns-pads">
                            <span> Date de portabilité : </span>
                            <strong> {{tmpItem.project_date}} </strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Dernière facture : </span>
                            <strong> {{tmpItem.last_invoice}} </strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Prochaine facture : </span>
                            <strong> {{tmpItem.next_invoice}} </strong>
                          </li>

                          <li class="two-columns-pads" style="visibility: hidden;">
                            <span>EMPTY</span>
                            <strong>EMPTY</strong>
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>




              <div class="wrapper_line_infos" v-if="menu === 'contract'">
                <div class="box-account line_infos">
                  <div class="box-container">
                    <div class="box-title">Informations contractuelles</div>
                    <div class="box-content">
                      <div>
                        <ul class="definitions two-columns-ul">
                          <li class="two-columns-pads">
                            <span> Client rattaché : </span>
                            <strong> {{tmpItem.final_client}} </strong>
                          </li>
                          <li class="two-columns-pads">
                            <span> Trunk : </span>
                            <strong> {{allitems.username}} </strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Statut du trunk : </span>
                            <span class="badge" :class="getStateBadge(allitems.state)"> {{getState(allitems.state)}} </span>
                          </li>

                        </ul>
                      </div>
                    </div>
                  </div>
                </div>


                <div class="box-account line_cost">
                  <div class="box-container">
                    <div class="box-title">Mon contrat</div>
                    <div class="box-content">
                      <div>
                        <ul class="definitions two-columns-ul">
                          <li class="two-columns-pads">
                            <span> Numéro de contrat : </span>
                            <strong>{{tmpItem.contract_number}}</strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Nom du contrat : </span>
                            <strong>{{tmpItem.contract_name}}</strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Statut du contrat : </span>
                            <span class="badge" :class="getStateBadge(tmpItem.contract_state)"> {{getState(tmpItem.contract_state)}} </span>
                          </li>

                          <li class="two-columns-pads">
                            <span> Serveur rattaché au contrat : </span>
                            <strong> {{allitems.server_name}}  </strong>
                          </li>

                          <li class="two-columns-pads">
                            <span> Date de création du contrat : </span>
                            <strong>{{tmpItem.contract_creation_date}}</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>

        <footer class="modal-card-foot" style="z-index: 1">
          <button
            type="button"
            class="button is-admin-primary is-large"
            @click="cancel()"
          >
            Annuler
          </button>
          <button
            type="button"
            class="button is-admin-secondary-light is-large"
            @click="save()"
          >
            Enregistrer
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import parsePhoneNumber from "libphonenumber-js";
import { debounce } from "lodash";

export default {
  name: "CreateItem",
  props: {
    active: Boolean,
    item: Object,
    allitems: Object,
  },
  components: {},
  data() {
    return {
      vueTel: {
        props: {
          preferredCountries: ["FR", "BE", "DE"],
          placeholder: "Entrer un numéro de téléphone",
          mode: "international",
          inputOptions: {
            showDialCode: false,
          },
          disabledFormatting: false,
          wrapperClasses: "country-phone-input",
        },
      },
      menu: 'phone',
      renvoi_inconditionnel: '',
      renvoi_injoignable : '',
      isRenvoiInconditionnel: false,
      isRenvoiInjoignable: false,
      tmpItem: []
    };
  },
  mounted() {
    this.tmpItem = this.item
    console.log(this.tmpItem)
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    getStateBadge (value) {
      switch (value) {
        case 'quotation':
          return 'badge-info'
        case 'terminated':
          return 'badge-primary'
        case 'order':
          return 'badge-success'
        case 'on_finish':
          return ''
        case 'finish':
          return ''
        case 'occupied':
          return 'badge-primary'
        case 'free':
          return ''
        default:
          return 'badge-gray';
      }
    },
    getState (value) {
      switch (value) {
        case 'terminated':
          return 'Produit'
        case 'finish':
          return 'Résilié'
        case 'on_finish':
          return 'En cours de résiliation'
        case 'order':
          return 'Commande'
        case 'quotation':
          return 'Devis'
        case 'free':
          return 'SDA inactive'
        case 'occupied':
          return 'SDA active'
        default:
          return 'Aucune information';
      }
    },
    cancel () {
      this.$emit('editSDA', false)
    },
    async save() {
      try {
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          'sda_id': this.tmpItem.id,
          'unconditional_forwarding': this.tmpItem.unconditional_forward,
          'unreachable_forwarding': this.tmpItem.unreachable_forward,
          'is_unconditional_forwarding_active': this.tmpItem.is_unconditional_forwarding_active,
          'is_unreachable_forwarding_active': this.tmpItem.is_unreachable_forwarding_active,
        }
        const response = await this.$axios.post(process.env.ODOO_API + 'api/products/sdas/update_forward?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data
        })

        console.log(response.resul)

        if (response.result) {
          this.$toastr.Add({
            name: 'SuccesData',
            title: 'Mise à jour réussie',
            msg: 'La SDA a été mise à jour',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
          this.cancel()
        } else {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Erreur de mise à jour',
            msg: 'Veuillez réessayer en vérifiant les valeurs saisies',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
        }
      } catch (error) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur de mise à jour',
          msg: 'Veuillez réessayer en vérifiant les valeurs saisies',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'success',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      }
    },
    setMenu (m) {
      this.menu = m
    },
    getPhoneNumberE164 (sda) {
      if (sda) {
        return parsePhoneNumber(parsePhoneNumber(sda, 'FR').number).formatInternational()
      } else {
        return ''
      }
    },
  },
};
</script>

<style>
.ul.definitions span {
  margin-right: 0
}

.two-columns-ul {
  padding-right: 2rem; padding-left: 2rem;
}

.two-columns-pads {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
