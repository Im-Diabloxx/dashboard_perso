<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box">
        <div class="about">
          <div class="status-content">
            <div class="container is-max-widescreen">
              <div>

                <h1 style="margin-top: 40px">
                  <a href="/products" class="router-link-active">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                        <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                            <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                        </g>
                    </svg>
                    Mon Profil
                  </a>
                </h1>

                <nav class="tabs" style="margin-top: 40px">
                  <ul class="">
                    <li :class="menu === 'Home' ? 'is-active' : ''">
                      <a @click="setMenu('Home')"><span>Général</span></a>
                    </li>

                    <li :class="menu === 'Docs' ? 'is-active' : ''">
                      <a @click="setMenu('Docs')"><span>Mes documents</span></a>
                    </li>
                    
                  </ul>
                </nav>
              </div>
              
              <div class="b-tabs">
                <section class="tab-content">
                  <div class="tab-item" :style="menu === 'Home' ? '' : 'display: none;'">
                    <div>
                      <div class="flex justify-content-center">
                        <div class="box-account">
                          <div class="box-container">
                            <div class="box-title">
                              Mon entreprise
                          </div>
                          
                          <div class="box-content">
                            <ul>
                              <li><span class="value pl-0">{{contact_infos.company ? contact_infos.company.toUpperCase() : ''}}</span></li>
                              <li>
                                <span>SIRET : </span>
                                <span class="value">{{contact_infos.siret ? contact_infos.siret : ''}}</span>
                              </li>
                              
                              <li>
                                <span>Nom complet : </span>
                                <span class="value">{{contact_infos.name}}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div class="box-account">
                        <div class="box-container">
                          <div class="box-title">
                            Mon contact
                          </div>
                          
                          <div class="box-content">
                            <ul>
                              <li>
                                <span>Email :</span>
                                <span class="value">{{contact_infos.email}}</span>
                              </li>
                            </ul>
                            
                            <ul>
                              <li class="form-field">
                                <form>
                                  <span>
                                    <span>
                                      <div class="field phone is-horizontal help-as-tooltip">
                                        <label class="label">Téléphone mobile :</label>
                                        <div class="control has-icons-right is-clearfix">
                                          <input type="text" autocomplete="on" class="input is-success" :v-model="contact_infos.mobile ? contact_infos.mobile : ''">
                                          <span class="icon is-right has-text-success">
                                            <svg class="svg-inline--fa fa-check fa-w-16 fa-lg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>
                                          </span>
                                        </div>
                                      </div>
                                    </span>
                                  </span>
                                </form>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex justify-content-center">
                      <div class="box-account">
                        <div class="box-container">
                          <div class="box-title">
                            Mon adresse de facturation
                          </div>
                          
                          <div class="box-content" v-if="contact_infos.street && contact_infos.zip && contact_infos.city">
                            <ul>
                              <li class="value">
                                {{contact_infos.street ? contact_infos.street : ''}}
                              </li>
                              
                              <li class="value">
                              </li>
                              
                              <li class="value">
                                {{contact_infos.zip ? contact_infos.zip : ''}} {{contact_infos.city ? contact_infos.city : ''}}
                              </li>
                            </ul>
                          </div>
                          <div class="box-content" v-else>
                            <ul>
                              <li class="value">
                                Aucune information
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div class="box-account password">
                        <div class="box-container">
                          <div class="box-title">
                            Mon Compte
                          </div>
                          <div>
                            <button type="button" class="button is-medium is-admin-primary" @click="activateChangePassModal()">
                              <span>
                                Changer de mot de passe
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex large justify-content-center">
                      <div class="box-account large" style="flex-basis: 100%;">
                        <div class="box-container">
                          <div class="box-title">
                            Informations commerciales
                          </div>
                          
                          <div class="field">
                            <label class="b-checkbox checkbox">
                              <input type="checkbox" true-value="true" value="false">
                              <span class="check"></span>
                              <span class="control-label">
                                J'accepte de recevoir des offres, publicités ou messages commerciaux et personnalisés de l'Opérateur.
                              </span>
                            </label>
                          </div>
                          
                          <div class="field">
                            <label class="b-checkbox checkbox">
                              <input type="checkbox" true-value="true" value="false">
                              <span class="check"></span>
                              <span class="control-label">
                                J'accepte de recevoir des offres, publicités ou messages commerciaux et personnalisés d'une société du groupe Unicom et/ou d'un partenaire de l'Opérateur.
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tab-item" :style="menu === 'Docs' ? '' : 'display: none;'">
                  <div class="docs">
                    <div class="columns">
                      <div class="column p-0 pr-2 pl-3">
                        <div class="mb-3 full-height">
                          <div>
                            <div class="ml-3">
                              Documents liés au compte client
                            </div>
                            <div>
                              <div class="b-table">
                                <div class="field table-mobile-sort">
                                  <div class="field has-addons">
                                    <div class="control is-expanded">
                                      <span class="select is-fullwidth">
                                        <select>
                                          <option value="[object Object]">
                                            Nom du fichier
                                          </option>
                                        </select>
                                      </span>
                                    </div>
                                    
                                    <div class="control">
                                      <button class="button is-primary">
                                        <span class="icon is-small">
                                          <svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                <div class="table-wrapper has-mobile-cards">
                                  <table class="table is-hoverable">
                                    <thead>
                                      <tr>
                                        <th class="is-sortable">
                                          <div class="th-wrap">Nom du fichier
                                            <span class="icon is-small is-invisible">
                                              <svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
                                            </span>
                                          </div>
                                        </th>
                                        
                                        <th class="">
                                          <div class="th-wrap"></div>
                                        </th>
                                      </tr>
                                    </thead>
                                    
                                    <tbody>
                                      <tr draggable="false" class="" @click="getVPN()">
                                        <td data-label="Nom du fichier" class="">
                                          Certificat VPN
                                        </td>
                                        
                                        <td class="tools">
                                          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                              <path d="m 14.392743,41.498017 a 1.8781117,1.8781117 0 0 0 -1.855917,1.907266 v 39.957234 a 1.8781117,1.8781117 0 0 0 0.0073,0.06603 c 0.03813,1.141214 0.556583,2.211443 1.401107,2.9636 0.844524,0.752154 1.936168,1.135307 3.058963,1.100344 L 16.945546,87.5 h 66.108791 l -0.0587,-0.0075 c 1.122796,0.03493 2.214437,-0.348205 3.058962,-1.100344 0.844524,-0.752157 1.362982,-1.822386 1.401107,-2.9636 a 1.8781117,1.8781117 0 0 0 0.0075,-0.06603 V 43.405283 a 1.8781117,1.8781117 0 1 0 -3.755848,0 v 39.898549 c -0.0031,0.0942 -0.04206,0.192863 -0.146703,0.286083 -0.104638,0.09322 -0.269896,0.159586 -0.447476,0.154065 a 1.8781117,1.8781117 0 0 0 -0.0587,0 H 16.945546 a 1.8781117,1.8781117 0 0 0 -0.05869,0 c -0.17758,0.0056 -0.342818,-0.06085 -0.447474,-0.154065 -0.104657,-0.09322 -0.143567,-0.191924 -0.146715,-0.286083 V 43.405283 a 1.8781117,1.8781117 0 0 0 -1.899929,-1.907266 z"></path>
                                              <path d="m 49.970599,12.50023 a 1.8781117,1.8781117 0 0 0 -1.848581,1.907267 v 49.090104 a 1.8781117,1.8781117 0 1 0 3.755848,0 V 14.407497 A 1.8781117,1.8781117 0 0 0 49.970599,12.50023 Z"></path>
                                              <path d="m 34.917865,49.882654 a 1.8781117,1.8781117 0 0 0 -1.173702,3.27903 l 7.475017,6.873498 7.511696,6.873495 a 1.8781117,1.8781117 0 0 0 2.538133,0 l 7.511696,-6.873495 7.475016,-6.873498 a 1.8793341,1.8793341 0 1 0 -2.545466,-2.765536 l -7.467684,6.873495 -6.242629,5.707131 -6.24263,-5.707131 -7.467682,-6.873495 a 1.8781117,1.8781117 0 0 0 -1.371765,-0.513494 z"></path>
                                            </g>
                                          </svg>
                                          Télécharger
                                        </td>
                                      </tr>
                                   </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!--                      
                      <div class="column p-0 pl-2 pr-3">
                        <div>
                          <div>
                            <div class="ml-3">
                              Documents liés aux offres
                            </div>
                            
                            <div>
                              <div class="b-table">
                                <div class="field table-mobile-sort">
                                  <div class="field has-addons">
                                    <div class="control is-expanded">
                                      <span class="select is-fullwidth">
                                        <select>
                                          <option value="[object Object]">
                                            Nom du fichier
                                          </option>
                                        </select>
                                      </span>
                                    </div>
                                    <div class="control">
                                      <button class="button is-primary">
                                        <span class="icon is-small">
                                          <svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                <div class="table-wrapper has-mobile-cards">
                                  <table class="table is-hoverable">
                                    <thead>
                                      <tr>
                                        <th class="is-current-sort is-sortable">
                                          <div class="th-wrap">Nom du fichier
                                            <span class="icon is-small">
                                              <svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
                                            </span>
                                          </div>
                                        </th>
                                        <th class="">
                                          <div class="th-wrap"></div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr draggable="false" class="">
                                        <td data-label="Nom du fichier" class="">
                                          Brochure Tarifaire Offre Kiplink
                                        </td>
                                        <td class="tools">
                                          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                              <path d="m 14.392743,41.498017 a 1.8781117,1.8781117 0 0 0 -1.855917,1.907266 v 39.957234 a 1.8781117,1.8781117 0 0 0 0.0073,0.06603 c 0.03813,1.141214 0.556583,2.211443 1.401107,2.9636 0.844524,0.752154 1.936168,1.135307 3.058963,1.100344 L 16.945546,87.5 h 66.108791 l -0.0587,-0.0075 c 1.122796,0.03493 2.214437,-0.348205 3.058962,-1.100344 0.844524,-0.752157 1.362982,-1.822386 1.401107,-2.9636 a 1.8781117,1.8781117 0 0 0 0.0075,-0.06603 V 43.405283 a 1.8781117,1.8781117 0 1 0 -3.755848,0 v 39.898549 c -0.0031,0.0942 -0.04206,0.192863 -0.146703,0.286083 -0.104638,0.09322 -0.269896,0.159586 -0.447476,0.154065 a 1.8781117,1.8781117 0 0 0 -0.0587,0 H 16.945546 a 1.8781117,1.8781117 0 0 0 -0.05869,0 c -0.17758,0.0056 -0.342818,-0.06085 -0.447474,-0.154065 -0.104657,-0.09322 -0.143567,-0.191924 -0.146715,-0.286083 V 43.405283 a 1.8781117,1.8781117 0 0 0 -1.899929,-1.907266 z"></path>
                                              <path d="m 49.970599,12.50023 a 1.8781117,1.8781117 0 0 0 -1.848581,1.907267 v 49.090104 a 1.8781117,1.8781117 0 1 0 3.755848,0 V 14.407497 A 1.8781117,1.8781117 0 0 0 49.970599,12.50023 Z"></path>
                                              <path d="m 34.917865,49.882654 a 1.8781117,1.8781117 0 0 0 -1.173702,3.27903 l 7.475017,6.873498 7.511696,6.873495 a 1.8781117,1.8781117 0 0 0 2.538133,0 l 7.511696,-6.873495 7.475016,-6.873498 a 1.8793341,1.8793341 0 1 0 -2.545466,-2.765536 l -7.467684,6.873495 -6.242629,5.707131 -6.24263,-5.707131 -7.467682,-6.873495 a 1.8781117,1.8781117 0 0 0 -1.371765,-0.513494 z"></path>
                                            </g>
                                          </svg>
                                          Télécharger
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      -->
                    </div>
                  </div>
                </div>
                
              </section>
              <ChangePass @activateChangePass="getActivateChangePass" :active="isChangePass ? true : false"></ChangePass>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tt></tt>
  </div>
</template>

<script>

import ChangePass from './ChangePass.vue'

export default {
  /* eslint-disable */

  name: 'Profile',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    ChangePass
  },
  data () {
    return {
      menu: 'Home',
      partners: [],
      contact_infos: [],
      search_client: '',
      isChangePass: false,
      isClientDetails: false,
      currentClient: []
    }
  },
  async created () {
    await this.getContactInfos()
  },
  mounted() {
  },
  methods: {
    async getContactInfos () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.contact_infos = await this.$axios.get(process.env.ODOO_API + 'api/contact/infos?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.contact_infos[0]
      })
    },
    setMenu (m) {
      this.menu = m
    },
    getActivateChangePass (value) {
      this.isChangePass = value
    },
    activateChangePassModal () {
      this.isChangePass = true
    },
    async getVPN () {
      this.$loader = true;
      let params = `?id=${this.user.id_vpn}&version=2`;
      
      try {
        let response = await this.$axios.get(
          `${process.env.ODOO_API}api/v2/vpn/download/certificate${params}`, 
          { responseType: 'blob' }
        );
        let contentDisposition = response.headers['content-disposition'];
        console.log(contentDisposition)
        let fileName = 'unknown';
        if (contentDisposition) {
          let match = contentDisposition.match(/filename\s*=\s*"?([^";]+)"?/);
          if (match) {
            fileName = match[1].trim();
          }
        }

        let fileURL = window.URL.createObjectURL(new Blob([response.data]));
        let element = document.createElement('a');
        element.href = fileURL;
        element.setAttribute('download', fileName);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } catch (error) {
        console.error('Erreur lors du téléchargement du fichier:', error);
      }

      this.$loader = false;
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
