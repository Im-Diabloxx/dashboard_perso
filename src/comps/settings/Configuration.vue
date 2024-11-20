<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box" v-if="user.allowed_routes.length > 0 && user.allowed_routes.includes('dashboard')" v-show="user.allowed_routes.length > 0 && user.allowed_routes.includes('dashboard')">
        <div class="about">
          <div class="status-content">
            <div class="container is-max-widescreen">
              <div>
                <h1><span>Mon Compte</span></h1>
                <nav class="tabs">
                  <ul class="">
                    <li :class="menu === 'Home' ? 'is-active' : ''">
                      <a @click="setMenu('Home')"><span>Général</span></a>
                    </li>
                    
                    <li :class="menu === 'Bank' ? 'is-active' : ''">
                      <a @click="setMenu('Bank')"><span>Informations bancaires</span></a>
                    </li>
                    
                    <li :class="menu === 'Docs' ? 'is-active' : ''">
                      <a @click="setMenu('Docs')"><span>Mes documents</span></a>
                    </li>
                    
                    <li :class="menu === 'Clients' ? 'is-active' : ''">
                      <a @click="setMenu('Clients')"><span>Mes Clients</span></a>
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
                
                <div class="tab-item" :style="menu === 'Bank' ? '' : 'display: none;'">
                  <div class="flex large justify-content-center">
                    <div class="box-account">
                      <div class="box-container">
                        <div class="box-title">
                          Compte bancaire
                        </div>
                        
                        <div class="box-content">
                          <ul>
                            <li>
                              <span>
                                Établissement bancaire :
                              </span>
                              <span class="value"></span>
                            </li>
                            <li>
                              <span>
                                IBAN :
                              </span>
                              <span class="value">FR0511449000010113965001F37</span>
                            </li>
                          </ul>
                          <div class="has-text-right">
                            <button class="button is-admin-primary is-medium">
                              Modifier
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="box-account">
                      <div class="box-container">
                        <div class="box-title">
                          Mandat SEPA
                        </div>
                        <div class="box-content">
                          <ul>
                            <li>
                              <span>
                                RUM :
                              </span>
                              <span class="value">JNRUMUNICOM000000000020210920175025</span>
                            </li>
                            
                            <li>
                              <a title="Télécharger le mandat signé" target="_blank">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 14.392743,41.498017 a 1.8781117,1.8781117 0 0 0 -1.855917,1.907266 v 39.957234 a 1.8781117,1.8781117 0 0 0 0.0073,0.06603 c 0.03813,1.141214 0.556583,2.211443 1.401107,2.9636 0.844524,0.752154 1.936168,1.135307 3.058963,1.100344 L 16.945546,87.5 h 66.108791 l -0.0587,-0.0075 c 1.122796,0.03493 2.214437,-0.348205 3.058962,-1.100344 0.844524,-0.752157 1.362982,-1.822386 1.401107,-2.9636 a 1.8781117,1.8781117 0 0 0 0.0075,-0.06603 V 43.405283 a 1.8781117,1.8781117 0 1 0 -3.755848,0 v 39.898549 c -0.0031,0.0942 -0.04206,0.192863 -0.146703,0.286083 -0.104638,0.09322 -0.269896,0.159586 -0.447476,0.154065 a 1.8781117,1.8781117 0 0 0 -0.0587,0 H 16.945546 a 1.8781117,1.8781117 0 0 0 -0.05869,0 c -0.17758,0.0056 -0.342818,-0.06085 -0.447474,-0.154065 -0.104657,-0.09322 -0.143567,-0.191924 -0.146715,-0.286083 V 43.405283 a 1.8781117,1.8781117 0 0 0 -1.899929,-1.907266 z"></path>
                                    <path d="m 49.970599,12.50023 a 1.8781117,1.8781117 0 0 0 -1.848581,1.907267 v 49.090104 a 1.8781117,1.8781117 0 1 0 3.755848,0 V 14.407497 A 1.8781117,1.8781117 0 0 0 49.970599,12.50023 Z"></path>
                                    <path d="m 34.917865,49.882654 a 1.8781117,1.8781117 0 0 0 -1.173702,3.27903 l 7.475017,6.873498 7.511696,6.873495 a 1.8781117,1.8781117 0 0 0 2.538133,0 l 7.511696,-6.873495 7.475016,-6.873498 a 1.8793341,1.8793341 0 1 0 -2.545466,-2.765536 l -7.467684,6.873495 -6.242629,5.707131 -6.24263,-5.707131 -7.467682,-6.873495 a 1.8781117,1.8781117 0 0 0 -1.371765,-0.513494 z"></path>
                                  </g>
                                </svg>
                                Télécharger le mandat signé
                              </a>
                            </li>
                          </ul>
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
                
                <div class="tab-item" :style="menu === 'Clients' ? '' : 'display: none;'">
                  <div>
                    <div class="fieldset">
                      <label>
                        Mes Clients
                      </label>
                      <div class="fieldset-content">
                        <div class="columns my-2">
                          <div class="column mb-0 is-half">
                            <div>
                              <div class="field mb-0">
                                <div class="control has-icons-left">
                                  <input placeholder="Rechercher un client" class="input" v-model="search_client">
                                  <span class="icon is-small is-left">
                                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                                      <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                        <path d="m 62.452297,13.136071 c -13.307093,0 -24.134766,10.826819 -24.134766,24.132812 0,6.102557 2.281546,11.679292 6.03125,15.933594 L 14.001125,83.589195 a 1.90019,1.90019 0 1 0 2.6875,2.685547 L 47.073391,55.850914 c 4.179184,3.464607 9.539208,5.550781 15.378906,5.550781 13.307092,0 24.134765,-10.82682 24.134765,-24.132812 0,-13.305993 -10.827673,-24.132812 -24.134765,-24.132812 z m 0,3.798827 c 11.253641,1e-6 20.335937,9.081886 20.335937,20.333985 0,11.252099 -9.082296,20.333984 -20.335937,20.333984 -11.253641,0 -20.335938,-9.081885 -20.335938,-20.333984 0,-11.252099 9.082297,-20.333985 20.335938,-20.333985 z"></path>
                                      </g>
                                    </svg>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div class="column has-text-right mb-0">
                            <button class="button is-admin-primary">
                              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x mr-3">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                  <g fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 50.685685,11.371716 c 21.487057,0 38.905756,17.418702 38.905756,38.905754 0,21.487057 -17.418699,38.905757 -38.905756,38.905757 -21.487053,0 -38.905755,-17.4187 -38.905755,-38.905757 0,-21.487052 17.418702,-38.905754 38.905755,-38.905754 m 0,-4.3228621 c -23.874504,0 -43.2286175,19.3541121 -43.2286175,43.2286161 0,23.874504 19.3541135,43.228618 43.2286175,43.228618 23.874504,0 43.228617,-19.354114 43.228617,-43.228618 0,-11.464941 -4.554428,-22.460309 -12.661368,-30.567243 C 73.145994,11.603287 62.150628,7.0488539 50.685685,7.0488539 Z"></path>
                                    <path d="M 75.957179,46.568993 H 53.437882 V 24.049696 c 0,-1.897709 -1.526418,-3.437882 -3.437882,-3.437882 -1.89771,0 -3.437882,1.540173 -3.437882,3.437882 V 46.568993 H 24.04282 c -1.897708,0 -3.437882,1.540172 -3.437882,3.437882 0,1.897714 1.540174,3.437882 3.437882,3.437882 h 22.519298 v 22.505547 c 0,1.897708 1.540172,3.437882 3.437882,3.437882 1.911464,0 3.437882,-1.540174 3.437882,-3.437882 V 53.444757 h 22.519297 c 1.897709,0 3.437883,-1.540168 3.437883,-3.437882 0,-1.89771 -1.540174,-3.437882 -3.437883,-3.437882"></path>
                                  </g>
                                </g>
                              </svg>
                                Ajouter un client
                            </button>
                          </div>
                        </div>
                        
                        <div class="organisations-grid">
                          <div class="box-account" v-for="p of getClient" :key="p.id" @click="showClientDetailsModal(p)">
                            <div class="box-container has-text-centered">
                              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-3x orga">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                  <g fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 50,12.5 c -0.341145,-0.0072 -0.678781,0.07995 -0.974609,0.25 l -30.804688,17.757812 -0.08008,0.04492 c -0.0074,0.0048 -0.01415,0.0088 -0.02148,0.01367 -0.03735,0.02071 -0.07353,0.0432 -0.109375,0.06641 -0.0098,0.0073 -0.01963,0.01403 -0.0293,0.02148 -0.02488,0.0189 -0.05031,0.03847 -0.07422,0.05859 -0.02489,0.01891 -0.04836,0.03846 -0.07227,0.05859 -0.02251,0.02141 -0.045,0.0439 -0.06641,0.06641 -0.03285,0.03057 -0.06513,0.06285 -0.0957,0.0957 -0.02024,0.02631 -0.03978,0.05273 -0.05859,0.08008 -0.0099,0.0096 -0.01966,0.01945 -0.0293,0.0293 -0.02035,0.02873 -0.03989,0.05806 -0.05859,0.08789 -0.06937,0.103685 -0.128335,0.214701 -0.175782,0.330079 -0.02488,0.05742 -0.04543,0.116161 -0.06445,0.175781 -0.03652,0.119271 -0.06206,0.241091 -0.07422,0.365234 -0.0052,0.05841 -0.0081,0.117139 -0.0078,0.175781 -8.05e-4,0.03171 -8.05e-4,0.06399 0,0.0957 v 35.546874 c -7.38e-4,0.670289 0.357031,1.289825 0.9375,1.625 l 30.847656,17.802735 c 0.272152,0.156452 0.58069,0.243134 0.894531,0.25 0.0074,4.3e-5 0.01411,4.3e-5 0.02148,0 0.06097,0.003 0.122625,0.003 0.183594,0 0.31135,-0.0081 0.614778,-0.09472 0.884765,-0.25 L 81.857422,69.445312 c 0.580468,-0.335177 0.938239,-0.954712 0.9375,-1.625 V 32.273438 c 0.0048,-0.09521 0.002,-0.190324 -0.0078,-0.285157 -0.0067,-0.06145 -0.01654,-0.123107 -0.0293,-0.183593 -0.0065,-0.03191 -0.01328,-0.06418 -0.02148,-0.0957 -0.0067,-0.02946 -0.01536,-0.05879 -0.02344,-0.08789 -0.009,-0.02952 -0.01884,-0.05885 -0.0293,-0.08789 -0.0115,-0.02959 -0.02217,-0.05892 -0.03516,-0.08789 -0.0115,-0.0296 -0.02412,-0.05891 -0.03711,-0.08789 -0.04265,-0.08409 -0.09168,-0.165465 -0.146484,-0.242188 -0.0165,-0.0248 -0.03312,-0.04828 -0.05078,-0.07227 -0.05776,-0.07547 -0.122886,-0.14704 -0.191406,-0.212891 -0.06636,-0.06369 -0.13596,-0.122512 -0.210937,-0.175781 -0.04953,-0.03666 -0.101396,-0.06995 -0.154297,-0.101563 L 50.892578,12.75 C 50.620426,12.593547 50.313842,12.506867 50,12.5 Z m -0.03711,4.041016 c 9.066895,5.213655 18.135612,10.424138 27.203125,15.636718 L 50.050781,47.84375 c -0.0094,0.0033 -0.01881,0.0056 -0.0293,0 C 40.95704,42.625108 31.897335,37.398273 22.833984,32.177734 Z M 20.951172,35.427734 C 29.984656,40.64936 39.020326,45.870263 48.052734,51.09375 V 82.373047 L 20.951172,66.736328 Z m 58.095703,0 V 66.736328 L 51.910156,82.380859 V 51.09375 C 60.953784,45.868563 70.000819,40.648716 79.046875,35.427734 Z"></path>
                                  </g>
                                </g>
                              </svg>
                              
                              <div class="text-break">
                                {{p.name}}
                              </div>
                              <a class="edit-orga">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 63.023095,25.478455 -1.767578,-2.230469 -38.582031,38.585938 -5.599609,22.328125 23.49414,-4.306641 37.042654,-37.049815 0.643308,-3.964072 z m 0,3.072266 10.884766,10.886718 -35.773437,35.78125 -14.320313,2.625 3.373047,-13.451171 z"></path>
                                    <path d="m 70.13195,19.656709 c -3.263466,1e-6 -6.52658,1.239076 -9.001953,3.714844 l -1.767578,1.767578 18.003906,18.00586 1.767579,-1.767578 c 4.950735,-4.951547 4.950749,-13.054321 0,-18.00586 -2.475369,-2.475771 -5.738488,-3.714844 -9.001954,-3.714844 z m 0,4.96875 c 1.973204,0 3.946724,0.76093 5.466797,2.28125 2.411443,2.411827 2.828116,5.930585 1.414063,8.814454 L 66.784294,25.490694 c 1.065733,-0.522803 2.19055,-0.865234 3.347656,-0.865235 z"></path>
                                  </g>
                                </svg>
                              </a>
                              <a class="delete-orga">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="M 43.777344 12.5 C 39.668001 12.65919 36.385592 16.078983 36.388672 20.191406 L 36.388672 24.277344 L 21.388672 24.277344 A 1.8751785 1.8751785 0 1 0 21.388672 28.027344 L 25.550781 28.027344 L 25.550781 76.25 C 25.550781 82.463173 30.587608 87.5 36.800781 87.5 L 63.050781 87.5 C 69.263954 87.5 74.300781 82.463173 74.300781 76.25 L 74.300781 28.027344 L 78.611328 28.027344 A 1.8751785 1.8751785 0 1 0 78.611328 24.277344 L 63.839844 24.277344 L 63.839844 20.191406 C 63.839844 15.967945 60.371896 12.5 56.148438 12.5 L 43.851562 12.5 A 1.8751785 1.8751785 0 0 0 43.777344 12.5 z M 43.923828 16.25 L 56.148438 16.25 C 58.345256 16.25 60.089844 17.994587 60.089844 20.191406 L 60.089844 24.197266 L 40.138672 24.197266 L 40.138672 20.191406 A 1.8751785 1.8751785 0 0 0 40.138672 20.183594 C 40.137072 18.047434 41.789278 16.332689 43.923828 16.25 z M 29.300781 28.212891 L 70.550781 28.212891 L 70.550781 76.25 C 70.550781 80.392114 67.192899 83.75 63.050781 83.75 L 36.800781 83.75 C 32.658666 83.75 29.300781 80.392114 29.300781 76.25 L 29.300781 28.212891 z "></path>
                                    <path d="m 38.907523,40.639872 a 1.8751785,1.8751785 0 0 0 -1.845695,1.896964 v 26.249876 a 1.8751785,1.8751785 0 1 0 3.749982,0 V 42.536836 a 1.8751785,1.8751785 0 0 0 -1.904287,-1.896964 z"></path>
                                    <path d="m 49.974364,36.699461 a 1.8751785,1.8751785 0 0 0 -1.845694,1.904288 v 32.695158 a 1.8751785,1.8751785 0 1 0 3.749982,0 V 38.603749 a 1.8751785,1.8751785 0 0 0 -1.904288,-1.904288 z"></path>
                                    <path d="m 61.033883,40.639872 a 1.8751785,1.8751785 0 0 0 -1.845696,1.896964 v 26.249876 a 1.8751785,1.8751785 0 1 0 3.749982,0 V 42.536836 a 1.8751785,1.8751785 0 0 0 -1.904286,-1.896964 z"></path>
                                  </g>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <ChangePass @activateChangePass="getActivateChangePass" :active="isChangePass ? true : false"></ChangePass>
              <ClientDetails @showClientDetails="getClientDetails" :client="currentClient" :active="isClientDetails ? true : false"></ClientDetails>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>

import ChangePass from '../profile/ChangePass.vue'
import ClientDetails from '../settings/ClientDetails.vue'

export default {
  /* eslint-disable */

  name: 'Configuration',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    ChangePass,
    ClientDetails
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
    if (this.user.allowed_routes.length <= 0 || !this.user.allowed_routes.includes('dashboard')) {
      this.$router.push('/products')
    }
    await this.getContactInfos()
    await this.getPartners()
  },
  mounted() {
  },
  methods: {
    async getPartners () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.partners = await this.$axios.get(process.env.ODOO_API + 'api/partners?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.partners
      })
    },
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
    getClientDetails (value) {
      this.isClientDetails = value
    },
    showClientDetailsModal (c) {
      this.currentClient = c
      this.isClientDetails = true
    },
    async getVPN () {
      // let vpn = this.$axios.get('http://192.168.102.40:5000/download/client?id_client=' + this.user.id_vpn + '&version=2')
      this.$globalState.loader = true
      let vpn = await this.$axios.get(process.env.ODOO_API + 'api/vpn/download/certificate?id=' + this.user.id_vpn, {responseType: 'blob'})
      .then(response => {
        console.log(response.data)
        //let zipBytes = new Uint8Array(response.data) // convert to Uint8Array
        //console.log(zipBytes)
        let FILE = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' })) // specify content type
        let element = document.createElement('a')
        element.href = FILE
        element.setAttribute('download', 'certificate.zip')
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
      .catch(error => {
        console.log(error)
      })
      this.$globalState.loader = false
      return vpn
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    getClient () {
      let client = this.partners
      if (this.search_client) {
        console.log(this.partners)
        let text = this.search_client
        client = client.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return client
      }
      return client
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
