<template>
  <div tabindex="-1" :class="active ? 'modal modalItemInfo is-active' : 'modal modalItemInfo'">
    <div class="modal-background"></div>
    <div class="animation-content" style="min-width: 70%;">
      <div class="modal-card" style="width: 100%;">
        <div class="modal-card-head" style="padding-bottom: 0;">
          <p class="modal-card-title">
            Informations à compléter pour l'article {{ item.name }}
          </p>
          <button @click="cancel()" class="delete"></button>
        </div>


        <section class="modal-card-body" style="overflow: visible; z-index: 2; padding-bottom: 0;">
          <div data-v-65e9c1a5="" class="autocomplete control">
            <div class="control has-icons-right is-clearfix" style="display: flex; align-items: center;">
              <label class="label">Date de livraison souhaitée : </label>
              <input :title="'Date souhaitée'" v-model="formattedDate" type="date" class="form-control" style="pointer: cursor;text-align-last: end; background-color: #242e42; width: auto" placeholder="Date souhaitée">
            </div>
          </div>
        </section>

        <section class="modal-card-body" style="overflow: visible; z-index: 5; padding-bottom: 0;" v-if="item.type === 'trunk' || item.type === 'kipcloud0' || item.type === 'kipcloud1'">
          <div class="d-flex justify-content-between" style="">
            <div class="" style="flex-basis: 50%;">
              <div data-v-65e9c1a5="" class="autocomplete control">
                <div class="control has-icons-right is-clearfix">
                  <input :title="'IPBX rattaché'" @blur="hideMenuIPBX" @focus="showMenuIPBX = true" v-model="searchIPBX" type="text" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="IPBX">
                  <div class="dropdown-menu" :style="showMenuIPBX == true ? '' : 'display: none'">
                    <div class="dropdown-content" :style="showMenuIPBX == true ? '' : 'display: none'">
                      <a class="dropdown-item" v-for="p in get_ipbx" :key="p.id" @click="selectIPBX(p)">
                        <span>
                          {{p.name}}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section class="modal-card-body" style="overflow: visible; z-index: 2; padding-bottom: 0;" v-if="item.type === 'did' || item.type === 'kipcloud1'">
          <!-- Top Part -->
          <div class="top-part">
            <div class="field is-horizontal">
              <div class="field-body">
                <div class="field" :style="item.reference === 'SDA GEO' ? 'width: 60%' : 'width: 100%'" style="margin-right: 0rem; margin-bottom: 0;" @keyup.enter="addItem()">
                  <!--
                  <VuePhoneNumberInput default-country-code="FR" :preferred-countries="prefered_countries" v-model="number" :translations="pnumberText" @update="onUpdate"/>
                  -->
                  <vue-tel-input v-model="number" v-bind="vueTel.props" @input="checkForMultipleEntries" @update="onUpdate"></vue-tel-input>
                </div>
                <div v-if="item.reference === 'SDA GEO'" class="field" style="margin-right: 0rem; width: 30%; margin-bottom: 0; height: 100%;" @keyup.enter="addItem()">
                  <div data-v-65e9c1a5="" class="autocomplete control">
                    <div class="control has-icons-right is-clearfix">
                      <input :title="'Code Postale'" @blur="hidePostalCode" @focus="showPostalCode = true" @input="debouncedFetchDataByPostalCode" v-model="tmpNewItem.postal_code" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: #242e42; font-size: .88rem;" placeholder="Code Postale">
                      <div class="dropdown-menu" :style="showPostalCode == true ? '' : 'display: none'">
                        <div class="dropdown-content" :style="showPostalCode == true ? 'background-color: #2f3b52' : 'display: none'">
                          <a class="dropdown-item" v-for="(p, index) of postalCodesAndCities" :key="index" @click="selectPostalCode(p)">
                            <span :title="p.postal_code + ' : ' + p.city">
                              {{p.postal_code}} : {{p.city}}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="item.reference === 'SDA GEO'" class="field" style="margin-right: 0rem; width: 30%; margin-bottom: 0; height: 100%;" @keyup.enter="addItem()">
                  <div data-v-65e9c1a5="" class="autocomplete control">
                    <div class="control has-icons-right is-clearfix">
                      <input :title="'Code Postale'" @blur="hideCity" @focus="showCity = true" @input="debouncedFetchDataByCity" v-model="tmpNewItem.city" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: #242e42; font-size: .88rem;" placeholder="Commune">
                      <div class="dropdown-menu" :style="showCity == true ? '' : 'display: none'">
                        <div class="dropdown-content" :style="showCity == true ? 'background-color: #2f3b52' : 'display: none'">
                          <a class="dropdown-item" v-for="(p, index) of postalCodesAndCities" :key="index" @click="selectCity(p)">
                            <span :title="p.city + ' : ' + p.postal_code">
                              {{p.postal_code}} : {{p.city}}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field" style="margin-right: 0rem; width: 30%; margin-bottom: 0; height: 100%;" @keyup.enter="addItem()">
                  <div data-v-65e9c1a5="" class="autocomplete control">
                    <div class="control has-icons-right is-clearfix">
                      <input :title="'Code RIO'" v-model="tmpNewItem.rio" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: #242e42; font-size: .88rem;" placeholder="Code RIO">
                    </div>
                  </div>
                </div>
                <div class="field" style="margin-top: 10px; margin-bottom: 0; text-align-last: right;">
                  <div class="control">
                    <span v-show="canEdit" @click="addItem">
                      <i class="material-symbols-outlined">check_circle_outline</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="showInfoIcon" style="">
              <span class="material-symbols-outlined" style="color: yellow; cursor: pointer;" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                warning
              </span>
              Pour une saisie multiple, séparez les numéros avec des tirets. Exemple : +33123456789-793
            </div>

          </div>
          <!--
          <hr class="separator">
          -->
        </section>
        <section class="modal-card-body" style="padding-bottom: 0; padding-top: 0; max-height: 300px; min-height: 100px;" v-if="item.type === 'did' || item.type === 'kipcloud1'">
          <!-- Bottom Part - Table List -->
          <div class="bottom-part b-table">
            <table class="table" style="width: 100%; background-color: transparent">
              <thead>
                <tr>
                  <th class="is-sortable">
                    <div class="th-wrap" style="white-space: nowrap;">Statut
                      <div class="">
                        <span class="icon-container icon is-small is-desc" @click="sortTable('creation')">
                          <i :class="sortKey === 'creation' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                          <i :class="sortKey === 'creation' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                        </span>
                      </div>
                    </div>
                  </th>
                  <th class="is-sortable" v-if="stateType !== 'devis' && stateType !== 'quotation' && stateType !== 'brouillon'">
                    <div class="th-wrap" style="white-space: nowrap;">Suivi
                      <div class="">
                        <span class="icon-container icon is-small is-desc" @click="sortTable('project_state')">
                          <i :class="sortKey === 'project_state' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                          <i :class="sortKey === 'project_state' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                        </span>
                      </div>
                    </div>
                  </th>
                  <th class="is-sortable">
                    <div class="th-wrap" style="white-space: nowrap;">Numéro
                      <div class="">
                        <span class="icon-container icon is-small is-desc" @click="sortTable('value')">
                          <i :class="sortKey === 'value' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                          <i :class="sortKey === 'value' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                        </span>
                      </div>
                    </div>
                  </th>
                  <th v-if="item.reference === 'SDA GEO'" class="is-sortable">
                    <div class="th-wrap" style="white-space: nowrap;">Commune
                      <div class="">
                        <span class="icon-container icon is-small is-desc" @click="sortTable('city')">
                          <i :class="sortKey === 'city' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                          <i :class="sortKey === 'city' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                        </span>
                      </div>
                    </div>
                  </th>
                  <th v-if="item.reference === 'SDA GEO'" class="is-sortable">
                    <div class="th-wrap" style="white-space: nowrap;">Code Postale
                      <div class="">
                        <span class="icon-container icon is-small is-desc" @click="sortTable('postal_code')">
                          <i :class="sortKey === 'postal_code' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                          <i :class="sortKey === 'postal_code' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                        </span>
                      </div>
                    </div>
                  </th>
                  <th class="is-sortable">
                    <div class="th-wrap" style="white-space: nowrap;">RIO
                      <div class="">
                        <span class="icon-container icon is-small is-desc" @click="sortTable('rio')">
                          <i :class="sortKey === 'rio' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                          <i :class="sortKey === 'rio' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                        </span>
                      </div>
                    </div>
                  </th>
                  <th class="is-sortable">
                    <div class="th-wrap" style="white-space: nowrap;">
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody v-for="(i, index) in get_items" :key="index">
                <tr class="item-table">
                  <td>
                    <span class="badge" :class="getStateBadge(i)">{{i.value === 'XXXXXXXXXX' ? 'Création' : 'Portabilité'}}</span>
                  </td>
                  <td v-if="stateType !== 'devis' && stateType !== 'quotation' && stateType !== 'brouillon'">
                    <span class="badge">{{i.project_state ? i.project_state : 'Aucun information'}}</span>
                  </td>
                  <td>{{ i.value === 'XXXXXXXXXX' ? i.value : getPhoneNumberE164(i.value) }}</td>
                  <td v-if="item.reference === 'SDA GEO'">{{ i.city }}</td>
                  <td v-if="item.reference === 'SDA GEO'">{{ i.postal_code }}</td>
                  <td>{{ i.rio }}</td>
                  <td v-show="canEdit" @click="removeItem(index)">
                    <span class="material-symbols-outlined">
                      delete_outline
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="commandType === 'quotation'" class="modal-card-body" style="overflow: visible; z-index: 2; padding-bottom: 0;">
          <div class="messages_block" style="background-color: transparent !important">
            <div data-v-0ab49782="" data-v-38fdae67="" class="answer" style="padding: 0 !important; margin: 0 !important">
              <form data-v-0ab49782="" class="mb-0">
                <textarea data-v-0ab49782="" v-model="tmpNewItem.more_details" rows="1" placeholder="Vous pouvez apporter des précisions" class="textareaEmbeded"></textarea>
                <div data-v-0ab49782="" class="has-text-right" v-if="item.line_id">
                  <div data-v-0ab49782="" class="has-text-left is-size-7">
                    <span data-v-0ab49782="">Le message doit contenir au moins 50 caractères</span>
                    <span data-v-0ab49782="">3 fichiers max</span>
                    <br data-v-0ab49782="">
                    <span data-v-0ab49782="">Taille maximum : 2 Mo par fichier</span></div>
                    <div data-v-0ab49782="" class="field file help-as-tooltip is-left ml-0 mt-2 mb-3 has-addons" style="background-color: transparent;">
                      <label data-v-0ab49782="" class="upload control">
                        <a data-v-0ab49782="" class="button is-admin-secondary-light is-large"><svg data-v-0ab49782="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x"><g data-v-0ab49782="" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square"><path data-v-0ab49782="" d="m 43.327181,17.615033 c 5.084789,-0.03091 9.777023,2.729263 12.220313,7.188678 l 1.509568,2.767542 2.947252,-1.114205 c 1.144878,-0.446347 2.36555,-0.666068 3.594209,-0.646958 4.971296,-0.01222 9.154054,3.72129 9.704367,8.662045 l 0.287536,2.623774 2.587831,0.503189 c 5.134412,0.857481 8.714744,5.56269 8.172281,10.739869 -0.54246,5.177178 -5.020342,9.038053 -10.22098,8.812632 H 27.404832 C 21.016854,57.019044 15.830377,51.947356 15.554902,45.563946 15.279442,39.180532 20.009702,33.680895 26.362511,32.99851 l 2.91131,-0.251595 0.323479,-2.839426 c 0.8013,-6.9842 6.699919,-12.265161 13.729881,-12.292456 m 0,-3.593951 c -8.876544,0 -16.335773,6.669693 -17.324091,15.491044 -7.998119,1.133434 -13.832298,8.148749 -13.488666,16.219468 0.343642,8.070722 6.753006,14.564737 14.818524,15.014214 h 46.724726 c 6.920183,0 12.70933,-5.25458 13.378586,-12.142325 C 88.105513,41.715733 83.436167,35.445329 76.645505,34.112715 75.894254,27.356431 70.18079,22.24683 63.382871,22.251823 c -1.61968,0.0083 -3.225383,0.300332 -4.744357,0.86261 -3.065311,-5.594866 -8.931798,-9.078952 -15.311333,-9.093351 z"></path> <path data-v-0ab49782="" d="m 49.590091,41.455013 a 1.7972846,1.7972846 0 0 0 -1.769027,1.825183 v 38.99577 a 1.7972846,1.7972846 0 1 0 3.59421,0 v -38.99577 a 1.7972846,1.7972846 0 0 0 -1.825183,-1.825183 z"></path> <path data-v-0ab49782="" d="m 36.118828,69.429477 a 1.7972846,1.7972846 0 0 0 -1.193393,3.102812 l 6.725104,6.472385 6.718082,6.472385 a 1.7972846,1.7972846 0 0 0 2.4991,-0.0072 l 6.682984,-6.465365 6.718081,-6.472384 a 1.7972846,1.7972846 0 1 0 -2.492078,-2.583339 l -6.718084,6.465365 a 1.7972846,1.7972846 0 0 0 -0.0072,0.0072 l -5.440285,5.257937 -5.468533,-5.264957 -6.725101,-6.465365 a 1.7972846,1.7972846 0 0 0 -1.298688,-0.519474 z"></path></g></svg>
                          ATTACHER PIÈCE JOINTE
                        </a>
                        <input type="file" multiple="multiple" accept="image/*, application/pdf" @change="uploadFile" ref="file">
                      </label>
                    <div data-v-0ab49782=""></div>
                  </div>
                  <div data-v-0ab49782="" class="has-text-left is-size-7" style="" v-if="uploadedFiles.length > 0">
                    <span data-v-0ab49782="">Liste des pièces jointes attachées à l'article:</span>
                    <div>
                      <ul>
                        <li v-for="file in uploadedFiles" :key="file.id" @click="downloadAttachement(file)">
                          <a>
                            <span>
                            {{ file.name }}
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot" style="z-index: 1">
          <button type="button" class="button is-admin-primary is-large" @click="cancel()">
            Annuler
          </button>
          <button :disabled="!canEdit" type="button" class="button is-admin-secondary-light is-large" @click="saveItemInfo()">
            Enregistrer
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
// import VuePhoneNumberInput from 'vue-phone-number-input'
// import { VueTelInput } from 'vue-tel-input';
import parsePhoneNumber from 'libphonenumber-js'
import { debounce } from 'lodash';

export default {
  name: 'CreateItem',
  props: {
    active: Boolean,
    item: Object,
    allitems: Array,
    canEdit: Boolean,
    client: Object,
    commandType: String,
    stateType: String,
    documentType: String,
    documentId: String,
    contractId: Number,
    orderId: Number
  },
  components: {
    // VuePhoneNumberInput,
    // VueTelInput
  },
  data () {
    return {
      postalCodesAndCities: [],
      showPostalCode: false,
      showCity: false,
      vueTel: {
        props: {
          preferredCountries: ["FR", "BE", 'DE'],
          placeholder: "Entrer un numéro de téléphone",
          mode: "international",
          inputOptions: {
            showDialCode: false
          },
          disabledFormatting: false,
          wrapperClasses: "country-phone-input"
        }
      },
      tmpAllItems: [],
      tmpNewItem: {},
      newItem: {},
      number: null,
      pnumberText: {
        countrySelectorLabel: 'Code pays',
        countrySelectorError: 'Choisir un pays',
        phoneNumberLabel: 'Numéro de téléphone',
        example: 'Exemple :'
      },
      prefered_countries: ['FR', 'BE', 'DE'],
      sortKey: 'number',
      sortOrder: 'asc',
      searchPostalCodeDebounced: null,
      searchCityDebounced: null,
      uploadedFiles: [],
      documentName: '',
      file: null,
      ipbx_lists: [],
      ipbx: null,
      searchIPBX: '',
      showMenuIPBX: false,
      showInfoIcon: false,
      showTooltip: false,
    }
  },
  mounted () {
    this.fetchUploadedFiles()
    this.fetchIPBX()
    this.tmpAllItems = JSON.parse(JSON.stringify(this.allitems))
    this.tmpNewItem = JSON.parse(JSON.stringify(this.item))
    this.tmpNewItem.postal_code = this.client.zip ? this.client.zip : ''
    this.tmpNewItem.city = this.client.city ? this.client.city : ''
    this.tmpNewItem.product_type = this.tmpNewItem.reference
  },
  watch: {
    // Watch for changes to item.commitment_date and update it accordingly
    /*formattedDate: function(newDate) {
      if (newDate) {
        this.tmpNewItem.commitment_date = newDate;
      }
    }*/
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    get_ipbx () {
      let pl = this.ipbx_lists
      if (this.searchIPBX) {
        let text = this.searchIPBX
        pl = pl.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return pl
      }
      return pl
    },
    formattedDate: {
      get: function() {
        // Assuming tmpNewItem.commitment_date is a string in format 'DD/MM/YYYY'
        if (this.tmpNewItem.commitment_date) {
          // Split the date into day, month, and year
          const parts = this.tmpNewItem.commitment_date.split('/');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);

          // Create a new Date object using the parsed components
          const dateObj = new Date(year, month - 1, day);

          // Format the date to 'YYYY-MM-DD'
          const formattedYear = dateObj.getFullYear();
          const formattedMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const formattedDay = dateObj.getDate().toString().padStart(2, '0');

          return `${formattedYear}-${formattedMonth}-${formattedDay}`;
        } else {
          return ''; // Return empty string if commitment_date is not defined
        }
      },
      set: function(newDate) {
        // Parse the input date string in 'YYYY-MM-DD' format
        const parts = newDate.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        // Create a new Date object using the parsed components
        const dateObj = new Date(year, month - 1, day);

        // Format the date to 'DD/MM/YYYY'
        const formattedDay = dateObj.getDate().toString().padStart(2, '0');
        const formattedMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const formattedYear = dateObj.getFullYear();

        // Update tmpNewItem.commitment_date with the formatted date
        this.tmpNewItem.commitment_date = `${formattedDay}/${formattedMonth}/${formattedYear}`;
      }
    },
    get_items () {
      const sdas = []
      if (this.tmpNewItem && this.tmpNewItem.infos && this.tmpNewItem.infos.length > 0) {
        for (const s of this.tmpNewItem.infos) {
          if (s.name === 'SDA' && s.value.length > 1) {
            sdas.push(s)
          }
        }
      }
      if (this.sortKey && this.sortOrder) {
        sdas.sort((a, b) => {
          const valueA = a[this.sortKey]
          const valueB = b[this.sortKey]
          if (valueA && valueB) {
            if (this.sortOrder === 'asc') {
              return valueA.localeCompare(valueB)
            } else {
              return valueB.localeCompare(valueA)
            }
          }
        })
      }
      return sdas
    }
  },
  methods: {
    checkForMultipleEntries() {
      this.showInfoIcon = this.number.includes('-');
    },
    getPhoneNumberE164 (sda) {
      return parsePhoneNumber(parsePhoneNumber(sda, 'FR').number).formatInternational()
    },
    hideMenuIPBX () {
      setTimeout(() => {
        this.showMenuIPBX = false
      }, 250)
    },
    selectIPBX (p) {
      this.searchIPBX = p.name
      this.ipbx = p.id
      this.showMenuIPBX = false
    },
    async uploadFile () {
      this.file = this.$refs.file.files[0]
      const formData = new FormData()
      formData.append('ufile', this.file)
      formData.append('id', this.orderId)
      formData.append('sub_id', this.item.line_id)
      formData.append('model', 'sale.order')
      const headers = { 'Content-Type': 'multipart/form-data' }
      await this.$axios.post(process.env.ODOO_API + 'api/attachments/send/file?session_id=' + this.user.session_id, formData, { headers }).then(response => {
        this.fetchUploadedFiles()
      }).catch(error => {
        // Gérer l'erreur
        console.log(error);
      });
    },

    async downloadAttachement (file) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', process.env.ODOO_API + 'api/content/ir.attachment/' + (file.id).toString() + '/datas?download=true&session_id=' + this.user.session_id, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          this.downloadStatus = 200
          let blob = new Blob([xhr.response])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.name
          link.click()
        }
      }
      xhr.send()
    },
    async fetchIPBX () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.ipbx_lists = await this.$axios.get(process.env.ODOO_API + 'api/products/ipbx/list?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.ipbx
      })
      if (this.tmpNewItem.ipbx_id) {
        for (let pl of this.ipbx_lists) {
          if (pl.id === this.tmpNewItem.ipbx_id) {
            this.selectIPBX(pl)
            break
          }
        }
      }

    },
    async fetchUploadedFiles () {
      this.uploadedFiles = await this.$axios.post(process.env.ODOO_API + 'api/quotation/attachements?session_id=' + this.user.session_id + '&name=' + this.documentId)
      .then(response => {
        return response.data.list.filter(item => item.sub_id === this.item.line_id);
      });
    },
    getStateBadge (value) {
      if (value.value === 'XXXXXXXXXX') {
        return 'badge-primary'
      } else {
        return 'badge-success'
      }
    },
    hidePostalCode () {
      setTimeout(() => {
        this.showPostalCode = false
      }, 250)
    },
    hideCity () {
      setTimeout(() => {
        this.showCity = false
      }, 250)
    },
    selectPostalCode (pcode) {
      this.tmpNewItem.postal_code = pcode.postal_code
      this.tmpNewItem.city = pcode.city
    },
    selectCity (pcode) {
      this.tmpNewItem.postal_code = pcode.postal_code
      this.tmpNewItem.city = pcode.city
    },
    debouncedFetchDataByPostalCode: debounce(async function (userInput) {
      await this.fetchDataByPostalCode(userInput);
    }, 500),

    async fetchDataByPostalCode(userInput) {
      try {
        if (this.tmpNewItem.postal_code.length > 0) {
          const jsonData = require('../utils/gouv_postal_code_and_cities.json');

          const filteredData = jsonData.filter(item =>
            item.Code_postal.toString().includes(this.tmpNewItem.postal_code)
          );

          // Extract postal_code and city from each object in the filtered data
          const postalCodesAndCities = filteredData.map(item => ({
            postal_code: item.Code_postal,
            city: item.Nom_commune,
          }));

          // Mettez à jour la propriété de données
          this.postalCodesAndCities = postalCodesAndCities;
        } else {
          this.postalCodesAndCities = []
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données depuis le fichier JSON:', error);
        // Gérez l'erreur de manière appropriée (par exemple, affichez un message d'erreur)
        this.postalCodesAndCities = []; // Réinitialisez la propriété de données en cas d'erreur
      }
    },

    debouncedFetchDataByCity: debounce(async function (userInput) {
      await this.fetchDataByCity(userInput);
    }, 500),

    async fetchDataByCity(userInput) {
      try {
        if (this.tmpNewItem.city.length > 0) {
          const jsonData = require('../utils/gouv_postal_code_and_cities.json');

          // Filter the JSON data for matching cities
          const filteredData = jsonData.filter(item =>
            item.Nom_commune.toLowerCase().includes(this.tmpNewItem.city.toLowerCase())
          );

          // Extract postal_code and city from each object in the filtered data
          const postalCodesAndCities = filteredData.map(item => ({
            postal_code: item.Code_postal,
            city: item.Nom_commune,
          }));

          // Mettez à jour la propriété de données
          this.postalCodesAndCities = postalCodesAndCities;
        } else {
          this.postalCodesAndCities = []
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données depuis le fichier JSON:', error);
        // Gérez l'erreur de manière appropriée (par exemple, affichez un message d'erreur)
        this.postalCodesAndCities = []; // Réinitialisez la propriété de données en cas d'erreur
      }
    },
    sortTable (key) {
      if (this.sortKey !== key) {
        this.sortOrder = 'asc'
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      this.sortKey = key
    },
    onUpdate (payload) {
    },
    cancel () {
      this.tmpAllItems = JSON.parse(JSON.stringify(this.allitems))
      this.tmpNewItem = JSON.parse(JSON.stringify(this.item))
      this.$emit('createItem', false)
    },
    saveItemInfo () {
      for (let i of this.tmpAllItems) {
        if (i.id === this.tmpNewItem.id) {
          i.commitment_date = this.tmpNewItem.commitment_date
          i.more_details = this.tmpNewItem.more_details
          i.ipbx_id = this.ipbx
        }
      }
      this.$emit('saveItemInfo', this.tmpAllItems)
      this.cancel()
      /*
      if (this.item.infos) {
        this.$emit('saveItemInfo', this.tmpAllItems)
        this.cancel()
      } else {
        console.log('Please fill in all required fields.')
      }
      */
    },
    addItem() {
      if (!this.canEdit) {
        this.$toastr.Add({
          name: 'ErrorCantEdit',
          title: 'Action non permise',
          msg: 'Vous ne pouvez pas modifier ces données, veuillez contacter le support pour plus d\'informations',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
        return;
      }
      if (this.tmpNewItem.product_type === 'SDA GEO' && ((!this.tmpNewItem.postal_code || this.tmpNewItem.postal_code.length < 1) || (!this.tmpNewItem.city || this.tmpNewItem.city.length < 1))) {
        this.$toastr.Add({
          name: 'ErrorInvalidInformation',
          title: 'Informations manquantes',
          msg: 'Veuillez complétez toutes les informations svp',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
        return;
      }

      if (this.number && this.number.length < 8) {
        this.$toastr.Add({
          name: 'ErrorInvalidNumber',
          title: 'Numéro incorrect',
          msg: 'Le numéro saisi ne semble pas correct, vérifiez le format de celui-ci !',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
        return;
      }

      // Extract numbers and ranges from the string using regular expression
      if (this.number) {
        const numbersAndRanges = this.number ? this.extractNumbersAndRanges(this.number) : [];

        // Iterate through each extracted number or range
        for (const item of numbersAndRanges) {
            if (!parsePhoneNumber(item)) {
              this.$toastr.Add({
                name: 'ErrorInvalidNumber',
                title: 'Numéro incorrect',
                msg: 'Le numéro saisi ne semble pas correct, vérifiez le format de celui-ci !',
                clickClose: true,
                timeout: 3000,
                progressBarValue: 0,
                position: 'toast-top-right',
                type: 'error',
                preventDuplicates: true,
                classNames: ['animated', 'slideInRight'],
                style: { 'margin-top': '20%' }
              });
              continue;
            }
            const val = {
              'name': 'SDA',
              'value': parsePhoneNumber(item).formatNational().toString().replace(/\s/g, ''),
              'formatted_number': item.toString(), // Adjust as needed
              'country_code': '', // Adjust as needed
              'call_code': '', // Adjust as needed
              'postal_code': this.tmpNewItem.postal_code,
              'rio': this.tmpNewItem.rio,
              'country': this.tmpNewItem.country,
              'city': this.tmpNewItem.city,
              'insee_code': this.tmpNewItem.insee_code,
              'type': this.tmpNewItem.product_type,
              'creation': false,
              'portability': true,
            };

            // Check if the item already exists
            const itemExists = this.tmpNewItem.infos.some(info => info.name === val.name && info.value === val.value && info.value !== 'XXXXXXXXXX');

            if (!itemExists) {
              this.tmpNewItem.infos.push(val);

              for (let i of this.tmpAllItems) {
                if (i.id === this.tmpNewItem.id) {
                  i.infos = i.infos.filter(info => !(info.name === 'SDA' && info.value.length <= 1));
                  i.infos.push(val);
                  i.quantity = (i.infos.length).toString();
                }
              }
            } else {
              this.$toastr.Add({
                name: 'ErrorDupplicateNumber',
                title: 'Numéro déjà présent',
                msg: 'Le numéro saisi est déjà présent dans la liste !',
                clickClose: true,
                timeout: 3000,
                progressBarValue: 0,
                position: 'toast-top-right',
                type: 'warning',
                preventDuplicates: true,
                classNames: ['animated', 'slideInRight'],
                style: { 'margin-top': '20%' }
              });
            }
          }
        } else {
            const val = {
              'name': 'SDA',
              'value': 'XXXXXXXXXX',
              'formatted_number': ''.toString(), // Adjust as needed
              'country_code': '', // Adjust as needed
              'call_code': '', // Adjust as needed
              'postal_code': this.tmpNewItem.postal_code,
              'rio': this.tmpNewItem.rio,
              'country': this.tmpNewItem.country,
              'city': this.tmpNewItem.city,
              'insee_code': this.tmpNewItem.insee_code,
              'type': this.tmpNewItem.product_type,
              'creation': true,
              'portability': false,
            };

            // Check if the item already exists
            const itemExists = this.tmpNewItem.infos.some(info => info.name === val.name && info.value === val.value && info.value !== 'XXXXXXXXXX');

            if (!itemExists) {
              this.tmpNewItem.infos.push(val);

              for (let i of this.tmpAllItems) {
                if (i.id === this.tmpNewItem.id) {
                  i.infos = i.infos.filter(info => !(info.name === 'SDA' && info.value.length <= 1));
                  i.infos.push(val);
                  i.quantity = (i.infos.length).toString();
                }
              }
            } else {
              this.$toastr.Add({
                name: 'ErrorDupplicateNumber',
                title: 'Numéro déjà présent',
                msg: 'Le numéro saisi est déjà présent dans la liste !',
                clickClose: true,
                timeout: 3000,
                progressBarValue: 0,
                position: 'toast-top-right',
                type: 'warning',
                preventDuplicates: true,
                classNames: ['animated', 'slideInRight'],
                style: { 'margin-top': '20%' }
              });
            }
        }
        // Clear the input after processing
        this.number = null;
        this.newItem.number = null;
    },

    // Helper function to extract numbers and ranges from the string
    extractNumbersAndRanges(inputString) {
      const parts = inputString.split('-');

      if (parts.length < 2) {
        return parts
      }
      if (parts.length > 2) {
        return [];
      }

      const leftSide = parts[0].match(/\+?\d+/);
      const rightSide = parts[1].match(/\d+/);

      if (!leftSide || !rightSide) {
        // Invalid number formats on either side, return an empty array or handle accordingly
        return [];
      }

      let leftNumberText = leftSide['input'];
      leftNumberText = parsePhoneNumber(leftNumberText)
      let countrycode = leftNumberText.countryCallingCode
      let callcode = '+' + countrycode
      const leftNumber = leftNumberText.formatNational().replace(/\s/g, '')
      const rightNumber = rightSide['input'];
      const padding = leftNumber.length - rightNumber.length;

      const start = parseInt(leftNumber, 10); // Specify base 10
      const end = parseInt(leftNumber.substring(0, padding) + rightNumber);

      if (isNaN(start) || isNaN(end)) {
        // Invalid range, return an empty array or handle accordingly
        return [];
      }
      let r = Array.from({ length: Math.abs(end - start) + 1 }, (_, i) => (start > end) ? callcode + (start - i).toString() : callcode + (start + i).toString());
      if (start > end) {
        r.reverse()
      }
      return r
    },

    removeItem (index) {
      if (!this.canEdit) {
        this.$toastr.Add({
          name: 'ErrorCantEdit',
          title: 'Action non permise',
          msg: 'Vous ne pouvez pas modifier ces données, veuillez contacter le support pour plus d\'informations',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
        return;
      }
      this.tmpNewItem.infos.splice(index, 1)
      const itemToRemove = this.tmpAllItems.find(item => (item.name === this.tmpNewItem.name))
      if (itemToRemove) {
        itemToRemove.infos.splice(index, 1)
        itemToRemove.quantity = (itemToRemove.infos.length).toString()
        if (itemToRemove.quantity === '0') {
          itemToRemove.quantity = '1'
        }
        this.$toastr.Add({
          name: 'WarningRemove',
          title: 'Suppresion d\'article',
          msg: 'Vous venez de supprimer un article, pour revenir en arrière, vous pouvez appuyer sur la touche [Annuler]',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'warning',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      }
    },
    resetForm () {
      this.items = []
    }
  }
}
</script>

<style>
</style>
