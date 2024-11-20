<template>
    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box" v-if="user.allowed_routes.length > 0 &&user.allowed_routes.includes('billing')" v-show="user.allowed_routes.length > 0 && user.allowed_routes.includes('billing')">
        <div class="dashboard" style="padding-bottom: 0px">
          <div class="container is-max-widescreen">
            <section>
              <h1 class="dashboard-zone">
                 Mes factures
              </h1>
            </section>
            <div class="billing-resume">
              <div class="container is-max-widescreen has-border">
                <section>
                  <div>
                    <div class="columns">
                      <div class="column">
                        Factures à valider
                          <span class="is-highlight">
                             {{bills_infos.bills_to_validate}} / {{bills_infos.bills_total}}
                          </span>
                      </div>
                      <div class="column has-border">
                          Factures impayées
                          <span class="is-highlight">
                             {{bills_infos.bills_not_received}} / {{bills_infos.bills_total}}
                          </span>
                      </div>
                      <div class="column has-border">
                          Factures à payées
                          <span class="is-highlight">
                             {{bills_infos.bills_to_pay}} / {{bills_infos.bills_total}}
                          </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div class="container is-max-widescreen">
              <div class="columns is-desktop mt-3" style="padding-right: 0rem;">

                <div class="column is-one-third-desktop">
                  <div class="fieldset">
                    <label>
                      Montant à valider
                    </label>
                    <div class="fieldset-content">
                      <div style="height: 100px">
                        <canvas id="bills_to_validate_graph"></canvas>
                      </div>
                      <div class="d-flex justify-content-between"><div>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div class="column is-one-third-desktop">
                  <div class="fieldset">
                    <label>
                      Montant non reçu
                    </label>
                    <div class="fieldset-content">
                      <div style="height: 100px">
                        <canvas id="bills_not_received_graph"></canvas>
                      </div>
                      <div class="d-flex justify-content-between"><div>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-one-third-desktop">
                  <div class="fieldset">
                    <label>
                      Montant à payer
                    </label>
                    <div class="fieldset-content">
                      <div style="height: 100px">
                        <canvas id="bills_to_pay_graph"></canvas>
                      </div>
                      <div class="d-flex justify-content-between"><div>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--
              
              <div class="column is-two-fifths-desktop">
                <div class="fieldset" title="Liste des IPBX dans les limbes en attente d'attribution à un partenaire">
                  <label>
                    Mes Brouillons à valider
                  </label>
                  <div class="fieldset-content">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <span class="has-text-white">
                        <b>{{bills_infos.bills_to_validate}} factures</b> à valider
                        </span>
                      </div>
                      <div>
                        <a class="button is-admin-primary">
                          valider
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <a style="font-size: 18px" class="blackblock sims hoverable" href="/billing/create">
                    <i class="fa fa-light fa-server" style="align-self: center;"></i>
                    Facturer
                    <span>
                      >
                    </span>
                </a>
              </div>

              -->
            </div>
          </div>
          </div>
        </div>
        <div data-v-65729484="" class="container is-max-widescreen">
          <div class="billinglist">

            <div style="margin-top: 20px" data-v-65729484="" class="columns mb-0 align-items-center">
              <div data-v-65729484="" class="column">
                Fournisseurs
                <label data-v-65729484="" class="switch pl-3 is-rounded">
                  <input type="checkbox" true-value="true" value="false" @click="billCheckbox($event)">
                  <span class="check"></span>
                  <span class="control-label"></span>
                </label>
                  Clients
              </div>
              <div data-v-65729484="" class="column" v-if="!isMobile()">
                <div data-v-65729484="" class="field mb-0 align-items-center has-addons">
                  <label data-v-65729484="" class="mr-3">
                    Grouper par :
                  </label>
                  <div class="control pills-v2" style="margin-right: 0.5rem">
                    <label class="b-radio radio button" :class="isFournisseur == true ? 'is-admin-white' : ''">
                      Fournisseur
                    <input type="radio" value="date" @click="byFournisseur()">
                    </label>
                  </div>
                  <div class="control pills-v2" style="margin-right: 0.5rem">
                    <label class="b-radio radio button" :class="isDate == true ? 'is-admin-white' : ''">
                      Date
                    <input type="radio" value="date" @click="byDate()">
                    </label>
                  </div>
                  <div class="control pills-v2" style="margin-right: 0.5rem">
                    <label class="b-radio radio button" :class="isState == true ? 'is-admin-white' : ''">
                      État
                    <input type="radio" value="state" @click="byState()">
                    </label>
                  </div>
                </div>
              </div>

              <div class="column">
                <div class="fieldset-content">
                  <div class="field mb-0">
                    <div class="control has-icons-left">
                      <input placeholder="Rechercher" v-model="search_bill" class="input">
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
            </div>
            
            <section>
              <!--
              <div class="inflowbox">
                <div class="columns">
                  <div class="column text">
                    Chaque début de mois, votre facture contient le forfait du mois à venir ainsi que les options et consommations du mois passé.
                  </div>
                  <div class="column is-narrow pl-5">
                    <a title="lien externe vers la faq" target="_blank" rel="nofollow noopener noreferrer" href="https://support-pro.free.fr/comprendre-la-composition-de-votre-facture-free-pro/" class="link">
                      En savoir plus
                    </a>
                  </div>
                </div>
              </div>
              -->
              <div class="fieldset">
                <label v-if="billcheck === false">
                  Mes factures Fournisseurs
                </label>
                <label v-else>
                  Mes factures Clients
                </label>
                <div class="fieldset-content">
                  <div class="b-table"> 
                    <div class="field table-mobile-sort">
                      <div class="field has-addons">
                        <div class="control is-expanded">
                          <span class="select is-fullwidth">
                            <select>
                              <option value="[object Object]">
                                N° de facture
                              </option>
                              <option v-if="billcheck === true" value="[object Object]">
                                Intitulé
                              </option>
                              <option value="[object Object]">
                                Fournisseur
                              </option>
                              <option value="[object Object]">
                                Date de facture
                              </option>
                              <option value="[object Object]">
                                Montant HT
                              </option>
                              <option value="[object Object]">
                                Montant TTC
                              </option>
                              <option value="[object Object]">
                                Statut
                              </option>
                              <option value="[object Object]">
                              </option>
                            </select>
                          </span>
                        </div>
                        
                        <div class="control">
                          <button class="button is-primary">
                            <span class="icon is-small is-desc">
                              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="table-wrapper has-mobile-cards" style="word-break: break-all;">
                      <table class="table">
                        <thead>
                          <tr><th class="is-sortable">
                            <div @click="orderByName()" class="th-wrap" style="white-space: nowrap;">N° de facture
                              <span class="icon is-small is-desc" v-show="arrow_name == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_name == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_name == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>

                          <th class="is-sortable">
                            <div @click="orderByIntitule()" class="th-wrap" style="white-space: nowrap;">Intitulé
                              <span class="icon is-small is-desc" v-show="arrow_intitulé == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_intitulé == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_intitulé == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>

                          <th v-if="billcheck === true" class="is-sortable">
                            <div @click="orderByFournisseur()" class="th-wrap" style="white-space: nowrap;">Client
                              <span class="icon is-small is-desc" v-show="arrow_fournisseur == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_fournisseur == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_fournisseur == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>

                          <th v-else class="is-sortable">
                            <div @click="orderByFournisseur()" class="th-wrap" style="white-space: nowrap;">Fournisseur
                              <span class="icon is-small is-desc" v-show="arrow_fournisseur == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_fournisseur == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_fournisseur == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>

                          <th class="is-sortable">
                            <div @click="orderByInvoiceDate()" class="th-wrap" style="white-space: nowrap;">Date de facture
                              <span class="icon is-small is-desc" v-show="arrow_invoice_date == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_invoice_date == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_invoice_date == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>

                          <th class="is-sortable">
                            <div @click="orderByHTMontant()" class="th-wrap" style="white-space: nowrap;">Montant HT
                              <span class="icon is-small is-desc" v-show="arrow_ht_montant == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_ht_montant == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_ht_montant == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>
                          

                          <th class="is-sortable">
                            <div @click="orderByTTCMontant()" class="th-wrap" style="white-space: nowrap;">Montant TTC
                              <span class="icon is-small is-desc" v-show="arrow_ttc_montant == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_ttc_montant == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_ttc_montant == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>


                          <th class="is-sortable">
                            <div @click="orderByStatus()" class="th-wrap" style="white-space: nowrap;">Statut
                              <span class="icon is-small is-desc" v-show="arrow_status == 'down'">
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-arrow-up fa-w-14">
                                  <path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z" class=""></path>
                                </svg>
                              </span>
                              <span class="icon is-small" v-show="arrow_status == 'up'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                              <span class="icon is-small" style="visibility: hidden" v-show="arrow_status == 'no'"><svg class="svg-inline--fa fa-arrow-up fa-w-14" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg><!-- <i class="fas fa-arrow-up"></i> Font Awesome fontawesome.com --></span>
                            </div>
                          </th>

                          <th class="">
                            <div class="th-wrap is-centered"></div>
                          </th>
                          
                          </tr>
                        </thead>

                        <template v-if="groupOrder.length > 0 && groupOrder[0]">
                          <tbody v-for="g1, index of getGroupOne" :key="index" style="display: contents;">
                            <tr draggable="false" class="" @click="updateSelectGroup(index, 0, g1)">
                              <td  data-label="" class="">
                                {{g1.name}}
                              </td>
                              <td class="">
                              </td>
                              <td class="">
                              </td>
                              <td class="">
                              </td>
                              <td class="">
                              </td>
                              <td class="">
                              </td>
                              <td class="">
                              </td>
                              <td style="text-align: center;" class="">
                                <i v-if="g1.selected === false" class="fa fa-arrow-right">
                                </i>
                                <i v-if="g1.selected === true" class="fa fa-arrow-down">
                                </i>
                              </td>
                            </tr>
                            
                            <template v-if="groupOrder[1] && g1.selected">
                              <tbody v-for="g2, index of getGroupTwo" :key="index" style="display: contents;">
                                <tr draggable="false" class="" @click="updateSelectGroup(index, 1, g2)">
                                  <td data-label="N° de facture" class="">
                                    {{g2.name}}
                                  </td>
                                  <td class="">
                                  </td>
                                  <td class="">
                                  </td>
                                  <td class="">
                                  </td>
                                  <td class="">
                                  </td>
                                  <td class="">
                                  </td>
                                  <td class="">
                                  </td>
                                  <td style="text-align: center;">
                                    <i v-if="g2.selected === false" class="fa fa-arrow-right">
                                    </i>
                                    <i v-if="g2.selected === true" class="fa fa-arrow-down">
                                    </i>
                                  </td>
                                </tr>
                                <template v-if="groupOrder[2] && g2.selected">
                                  <tbody v-for="g3, index of getGroupThree" :key="index" style="display: contents;">
                                    <tr draggable="false" class="" @click="updateSelectGroup(index, 2, g3)">
                                      <td data-label="N° de facture" class="">
                                        {{g3.name}}
                                      </td>
                                      <td style="text-align: center;" class="">
                                      </td>
                                      <td style="text-align: center;" class="">
                                      </td>
                                      <td style="text-align: center;" class="">
                                      </td>
                                      <td style="text-align: center;" class="">
                                      </td>
                                      <td style="text-align: center;" class="">
                                      </td>
                                      <td style="text-align: center;" class="">
                                      </td>
                                      <td style="text-align: center;" class="">
                                        <i v-if="g3.selected === false" class="fa fa-arrow-right">
                                        </i>
                                        <i v-if="g3.selected === true" class="fa fa-arrow-down">
                                        </i>
                                      </td>
                                    </tr>

                                    <tbody v-for="b of getAllGroupedBills" :key="b.id" style="display: contents;">
                                      <tr v-if="g3.selected" draggable="false" class="">
                                        <td data-label="N° de facture" class="">
                                          {{b.name}} 12345
                                        </td>
                                        <td v-if="billcheck === true" data-label="Intitulé" class="">
                                          {{b.invoice_origin}}
                                        </td>
                                        <td v-else data-label="Intitulé" class="">
                                          {{b.invoice_partner_display_name}}
                                        </td>
                                        <td v-if="billcheck === true" data-label="Client" class="">
                                          {{b.invoice_partner_display_name}}
                                        </td>
                                        <td v-else data-label="Fournisseur" class="">
                                          {{b.invoice_partner_display_name}}
                                        </td>
                                        <td data-label="Date de facture" class="">
                                          {{b.invoice_date}}
                                        </td>
                                        
                                        <td data-label="Montant HT" class="">
                                          {{b.untaxed_amount}} €
                                        </td>
                                        
                                        <td data-label="Montant TTC" class="">
                                          {{b.total_amount}} €
                                        </td>
                                        
                                        <td data-label="Statut" class="">
                                          <span v-if="b.state == 'posted'" class="state is-resolved">
                                            Comptabilisée
                                          </span>
                                          <span v-if="b.state == 'draft'" class="state is-resolved">
                                            Brouillon
                                          </span>
                                          <span v-if="b.state == 'cancel'" class="state is-resolved">
                                            Annulé
                                          </span>
                                        </td>
                                        
                                        <td class="has-text-centered">
                                          <a @click="downloadBill(b)" title="Télécharger la facture principale PDF" target="_blank">
                                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                              <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                                <path d="m 39.715401,10.968309 a 1.9992179,1.9992179 0 0 0 -1.967784,2.030253 v 17.249339 l -16.687115,0.140556 a 1.9992179,1.9992179 0 1 0 0.03122,3.998036 l 20.653926,-0.171791 v -21.21614 a 1.9992179,1.9992179 0 0 0 -2.030252,-2.030253 z"></path>
                                                <path d="m 39.980895,10.000035 c -1.318348,0.0042 -2.577245,0.540379 -3.498281,1.483646 a 1.9992179,1.9992179 0 0 0 -0.0078,0 L 18.366513,30.07611 a 1.9992179,1.9992179 0 0 0 -0.0078,0.0078 c -0.872293,0.910837 -1.362194,2.127847 -1.358708,3.388972 v 50.529867 c 0,3.288408 2.708656,5.997054 5.997054,5.997054 h 48.413717 a 1.9992179,1.9992179 0 1 0 0,-3.998036 H 22.997051 c -1.127689,0 -1.999018,-0.87132 -1.999018,-1.999018 V 33.46507 c -6.21e-4,-0.22471 0.08101,-0.437386 0.23426,-0.601267 l 0.0078,-0.0078 18.100483,-18.58462 c 0.171158,-0.175289 0.403421,-0.270567 0.648132,-0.273316 h 31.406448 c 1.418087,0.01239 2.525427,1.119725 2.537813,2.537816 v 6.176653 a 1.9992179,1.9992179 0 1 0 3.998036,0 v -6.19227 a 1.9992179,1.9992179 0 0 0 0,-0.02343 c -0.03104,-3.55401 -2.942794,-6.465765 -6.496808,-6.496806 a 1.9992179,1.9992179 0 0 0 -0.02359,0 h -31.4219 a 1.9992179,1.9992179 0 0 0 -0.0078,0 z"></path>
                                                <path d="m 36.182796,46.963394 v 10.957031 h 4.570313 q 2.734375,0 4.257812,-1.445312 1.542969,-1.445313 1.542969,-4.042969 0,-2.597656 -1.523437,-4.023437 -1.523438,-1.445313 -4.277344,-1.445313 z m -3.945312,-3.242187 h 8.515625 q 4.882812,0 7.402344,2.226562 2.519531,2.207031 2.519531,6.484375 0,4.316406 -2.519531,6.523438 -2.5,2.207031 -7.402344,2.207031 h -4.570313 v 11.71875 h -3.945312 z"></path>
                                                <path d="m 60.967953,69.639175 q 4.980468,0 6.953125,-2.441406 1.972656,-2.460937 1.972656,-8.867187 0,-6.464844 -1.972656,-8.90625 -1.953125,-2.460938 -6.953125,-2.460938 h -1.875 v 22.675781 z m 0.07813,-25.917968 q 6.679687,0 9.84375,3.554687 3.164062,3.554688 3.164062,11.054688 0,7.460937 -3.164062,11.015625 -3.164063,3.535156 -9.84375,3.535156 H 55.128109 V 43.721207 Z"></path>
                                                <path d="m 81.065609,43.721207 h 17.167969 v 3.320312 H 85.030453 v 8.59375 h 11.972656 v 3.320313 H 85.030453 v 13.925781 h -3.964844 z"></path>
                                              </g>
                                            </svg>
                                          </a>
                                        </td>
                                      </tr>
                                    </tbody>
 
                                  </tbody>
                                
                                </template>
                                <!--ICII 2 -->
                                <tbody v-else-if="g2.selected" v-for="b of getAllGroupedBills" :key="b.id" style="display: contents;">
                                  <tr draggable="false" class="">
                                    <td data-label="N° de facture" class="">
                                      {{b.name}}
                                    </td>
                                    <td v-if="billcheck === true" data-label="Intitulé" class="">
                                      {{b.invoice_origin}}
                                    </td>
                                    <td v-else data-label="Intitulé" class="">
                                      {{b.invoice_partner_display_name}}
                                    </td>
                                    <td v-if="billcheck === true" data-label="Client" class="">
                                      {{b.invoice_partner_display_name}}
                                    </td>
                                    <td v-else data-label="Fournisseur" class="">
                                      {{b.invoice_partner_display_name}}
                                    </td>
                                    <td data-label="Date de facture" class="">
                                      {{b.invoice_date}}
                                    </td>
                                    
                                    <td data-label="Montant HT" class="">
                                      {{b.untaxed_amount}} €
                                    </td>
                                    
                                    <td data-label="Montant TTC" class="">
                                      {{b.total_amount}} €
                                    </td>
                                    
                                    <td data-label="Statut" class="">
                                      <span v-if="b.state == 'posted'" class="state" style="background-color: #21bf26">
                                        Comptabilisée
                                      </span>
                                      <span v-if="b.state == 'draft'" class="state" style="background-color: gray">
                                        Brouillon
                                      </span>
                                      <span v-if="b.state == 'cancel'" class="state" style="background-color: #ff4d4d">
                                        Annulée
                                      </span>
                                    </td>
                                    
                                    <td class="has-text-centered">
                                      <a @click="downloadBill(b)" title="Télécharger la facture principale PDF" target="_blank">
                                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                          <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                            <path d="m 39.715401,10.968309 a 1.9992179,1.9992179 0 0 0 -1.967784,2.030253 v 17.249339 l -16.687115,0.140556 a 1.9992179,1.9992179 0 1 0 0.03122,3.998036 l 20.653926,-0.171791 v -21.21614 a 1.9992179,1.9992179 0 0 0 -2.030252,-2.030253 z"></path>
                                            <path d="m 39.980895,10.000035 c -1.318348,0.0042 -2.577245,0.540379 -3.498281,1.483646 a 1.9992179,1.9992179 0 0 0 -0.0078,0 L 18.366513,30.07611 a 1.9992179,1.9992179 0 0 0 -0.0078,0.0078 c -0.872293,0.910837 -1.362194,2.127847 -1.358708,3.388972 v 50.529867 c 0,3.288408 2.708656,5.997054 5.997054,5.997054 h 48.413717 a 1.9992179,1.9992179 0 1 0 0,-3.998036 H 22.997051 c -1.127689,0 -1.999018,-0.87132 -1.999018,-1.999018 V 33.46507 c -6.21e-4,-0.22471 0.08101,-0.437386 0.23426,-0.601267 l 0.0078,-0.0078 18.100483,-18.58462 c 0.171158,-0.175289 0.403421,-0.270567 0.648132,-0.273316 h 31.406448 c 1.418087,0.01239 2.525427,1.119725 2.537813,2.537816 v 6.176653 a 1.9992179,1.9992179 0 1 0 3.998036,0 v -6.19227 a 1.9992179,1.9992179 0 0 0 0,-0.02343 c -0.03104,-3.55401 -2.942794,-6.465765 -6.496808,-6.496806 a 1.9992179,1.9992179 0 0 0 -0.02359,0 h -31.4219 a 1.9992179,1.9992179 0 0 0 -0.0078,0 z"></path>
                                            <path d="m 36.182796,46.963394 v 10.957031 h 4.570313 q 2.734375,0 4.257812,-1.445312 1.542969,-1.445313 1.542969,-4.042969 0,-2.597656 -1.523437,-4.023437 -1.523438,-1.445313 -4.277344,-1.445313 z m -3.945312,-3.242187 h 8.515625 q 4.882812,0 7.402344,2.226562 2.519531,2.207031 2.519531,6.484375 0,4.316406 -2.519531,6.523438 -2.5,2.207031 -7.402344,2.207031 h -4.570313 v 11.71875 h -3.945312 z"></path>
                                            <path d="m 60.967953,69.639175 q 4.980468,0 6.953125,-2.441406 1.972656,-2.460937 1.972656,-8.867187 0,-6.464844 -1.972656,-8.90625 -1.953125,-2.460938 -6.953125,-2.460938 h -1.875 v 22.675781 z m 0.07813,-25.917968 q 6.679687,0 9.84375,3.554687 3.164062,3.554688 3.164062,11.054688 0,7.460937 -3.164062,11.015625 -3.164063,3.535156 -9.84375,3.535156 H 55.128109 V 43.721207 Z"></path>
                                            <path d="m 81.065609,43.721207 h 17.167969 v 3.320312 H 85.030453 v 8.59375 h 11.972656 v 3.320313 H 85.030453 v 13.925781 h -3.964844 z"></path>
                                          </g>
                                        </svg>
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </tbody>
                            </template>
                             <!--ICII 1 -->
                            <tbody v-else-if="g1.selected" v-for="b of getAllGroupedBills" :key="b.id" style="display: contents;">
                              <tr draggable="false" class="">
                                <td data-label="N° de facture" class="">
                                  {{b.name}}
                                </td>
                                <td v-if="billcheck === true" data-label="Intitulé" class="">
                                  {{b.invoice_origin}}
                                </td>
                                <td v-else data-label="Intitulé" class="">
                                  {{b.invoice_partner_display_name}}
                                </td>
                                <td v-if="billcheck === true" data-label="Client" class="">
                                  {{b.invoice_partner_display_name}}
                                </td>
                                <td v-else data-label="Fournisseur" class="">
                                  {{b.invoice_partner_display_name}}
                                </td>
                                <td data-label="Date de facture" class="">
                                  {{b.invoice_date}}
                                </td>
                                
                                <td data-label="Montant HT" class="">
                                  {{b.untaxed_amount}} €
                                </td>
                                
                                <td data-label="Montant TTC" class="">
                                  {{b.total_amount}} €
                                </td>
                                
                                <td data-label="Statut" class="">
                                  <span v-if="b.state == 'posted'" class="state" style="background-color: #21bf26">
                                    Comptabilisée
                                  </span>
                                  <span v-if="b.state == 'draft'" class="state" style="background-color: gray">
                                    Brouillon
                                  </span>
                                  <span v-if="b.state == 'cancel'" class="state" style="background-color: #ff4d4d">
                                    Annulée
                                  </span>
                                </td>
                                
                                <td class="has-text-centered">
                                  <a @click="downloadBill(b)" title="Télécharger la facture principale PDF" target="_blank">
                                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                      <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                        <path d="m 39.715401,10.968309 a 1.9992179,1.9992179 0 0 0 -1.967784,2.030253 v 17.249339 l -16.687115,0.140556 a 1.9992179,1.9992179 0 1 0 0.03122,3.998036 l 20.653926,-0.171791 v -21.21614 a 1.9992179,1.9992179 0 0 0 -2.030252,-2.030253 z"></path>
                                        <path d="m 39.980895,10.000035 c -1.318348,0.0042 -2.577245,0.540379 -3.498281,1.483646 a 1.9992179,1.9992179 0 0 0 -0.0078,0 L 18.366513,30.07611 a 1.9992179,1.9992179 0 0 0 -0.0078,0.0078 c -0.872293,0.910837 -1.362194,2.127847 -1.358708,3.388972 v 50.529867 c 0,3.288408 2.708656,5.997054 5.997054,5.997054 h 48.413717 a 1.9992179,1.9992179 0 1 0 0,-3.998036 H 22.997051 c -1.127689,0 -1.999018,-0.87132 -1.999018,-1.999018 V 33.46507 c -6.21e-4,-0.22471 0.08101,-0.437386 0.23426,-0.601267 l 0.0078,-0.0078 18.100483,-18.58462 c 0.171158,-0.175289 0.403421,-0.270567 0.648132,-0.273316 h 31.406448 c 1.418087,0.01239 2.525427,1.119725 2.537813,2.537816 v 6.176653 a 1.9992179,1.9992179 0 1 0 3.998036,0 v -6.19227 a 1.9992179,1.9992179 0 0 0 0,-0.02343 c -0.03104,-3.55401 -2.942794,-6.465765 -6.496808,-6.496806 a 1.9992179,1.9992179 0 0 0 -0.02359,0 h -31.4219 a 1.9992179,1.9992179 0 0 0 -0.0078,0 z"></path>
                                        <path d="m 36.182796,46.963394 v 10.957031 h 4.570313 q 2.734375,0 4.257812,-1.445312 1.542969,-1.445313 1.542969,-4.042969 0,-2.597656 -1.523437,-4.023437 -1.523438,-1.445313 -4.277344,-1.445313 z m -3.945312,-3.242187 h 8.515625 q 4.882812,0 7.402344,2.226562 2.519531,2.207031 2.519531,6.484375 0,4.316406 -2.519531,6.523438 -2.5,2.207031 -7.402344,2.207031 h -4.570313 v 11.71875 h -3.945312 z"></path>
                                        <path d="m 60.967953,69.639175 q 4.980468,0 6.953125,-2.441406 1.972656,-2.460937 1.972656,-8.867187 0,-6.464844 -1.972656,-8.90625 -1.953125,-2.460938 -6.953125,-2.460938 h -1.875 v 22.675781 z m 0.07813,-25.917968 q 6.679687,0 9.84375,3.554687 3.164062,3.554688 3.164062,11.054688 0,7.460937 -3.164062,11.015625 -3.164063,3.535156 -9.84375,3.535156 H 55.128109 V 43.721207 Z"></path>
                                        <path d="m 81.065609,43.721207 h 17.167969 v 3.320312 H 85.030453 v 8.59375 h 11.972656 v 3.320313 H 85.030453 v 13.925781 h -3.964844 z"></path>
                                      </g>
                                    </svg>
                                  </a>
                                </td>
                              </tr>
                            </tbody>

                          </tbody>

                        </template>


                        <tbody v-else v-for="b of getAllBills" :key="b.id">
                          <tr draggable="false" class="">
                            <td data-label="N° de facture" class="">
                              {{b.name}}
                            </td>

                            <td v-if="billcheck === true" data-label="Intitulé" class="">
                              {{b.invoice_origin}}
                            </td>
                            <td v-else data-label="Intitulé" class="">
                              {{b.invoice_partner_display_name}}
                            </td>

                            <td v-if="billcheck === true" data-label="Client" class="">
                              {{b.invoice_partner_display_name}}
                            </td>
                            <td v-else data-label="Fournisseur" class="">
                              {{b.invoice_partner_display_name}}
                            </td>

                            <td data-label="Date de facture" class="">
                              {{b.invoice_date}}
                            </td>
                            
                            <td data-label="Montant HT" class="">
                              {{b.untaxed_amount}} €
                            </td>
                            
                            <td data-label="Montant TTC" class="">
                              {{b.total_amount}} €
                            </td>
                            
                            <td data-label="Statut" class="">
                              <span v-if="b.state == 'posted'" class="state" style="background-color: #21bf26">
                                Comptabilisée
                              </span>
                              <span v-if="b.state == 'draft'" class="state" style="background-color: gray">
                                Brouillon
                              </span>
                              <span v-if="b.state == 'cancel'" class="state" style="background-color: #ff4d4d">
                                Annulée
                              </span>
                            </td>
                            
                            <td class="has-text-centered">
                              <a @click="downloadBill(b)" title="Télécharger la facture principale PDF" target="_blank">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 39.715401,10.968309 a 1.9992179,1.9992179 0 0 0 -1.967784,2.030253 v 17.249339 l -16.687115,0.140556 a 1.9992179,1.9992179 0 1 0 0.03122,3.998036 l 20.653926,-0.171791 v -21.21614 a 1.9992179,1.9992179 0 0 0 -2.030252,-2.030253 z"></path>
                                    <path d="m 39.980895,10.000035 c -1.318348,0.0042 -2.577245,0.540379 -3.498281,1.483646 a 1.9992179,1.9992179 0 0 0 -0.0078,0 L 18.366513,30.07611 a 1.9992179,1.9992179 0 0 0 -0.0078,0.0078 c -0.872293,0.910837 -1.362194,2.127847 -1.358708,3.388972 v 50.529867 c 0,3.288408 2.708656,5.997054 5.997054,5.997054 h 48.413717 a 1.9992179,1.9992179 0 1 0 0,-3.998036 H 22.997051 c -1.127689,0 -1.999018,-0.87132 -1.999018,-1.999018 V 33.46507 c -6.21e-4,-0.22471 0.08101,-0.437386 0.23426,-0.601267 l 0.0078,-0.0078 18.100483,-18.58462 c 0.171158,-0.175289 0.403421,-0.270567 0.648132,-0.273316 h 31.406448 c 1.418087,0.01239 2.525427,1.119725 2.537813,2.537816 v 6.176653 a 1.9992179,1.9992179 0 1 0 3.998036,0 v -6.19227 a 1.9992179,1.9992179 0 0 0 0,-0.02343 c -0.03104,-3.55401 -2.942794,-6.465765 -6.496808,-6.496806 a 1.9992179,1.9992179 0 0 0 -0.02359,0 h -31.4219 a 1.9992179,1.9992179 0 0 0 -0.0078,0 z"></path>
                                    <path d="m 36.182796,46.963394 v 10.957031 h 4.570313 q 2.734375,0 4.257812,-1.445312 1.542969,-1.445313 1.542969,-4.042969 0,-2.597656 -1.523437,-4.023437 -1.523438,-1.445313 -4.277344,-1.445313 z m -3.945312,-3.242187 h 8.515625 q 4.882812,0 7.402344,2.226562 2.519531,2.207031 2.519531,6.484375 0,4.316406 -2.519531,6.523438 -2.5,2.207031 -7.402344,2.207031 h -4.570313 v 11.71875 h -3.945312 z"></path>
                                    <path d="m 60.967953,69.639175 q 4.980468,0 6.953125,-2.441406 1.972656,-2.460937 1.972656,-8.867187 0,-6.464844 -1.972656,-8.90625 -1.953125,-2.460938 -6.953125,-2.460938 h -1.875 v 22.675781 z m 0.07813,-25.917968 q 6.679687,0 9.84375,3.554687 3.164062,3.554688 3.164062,11.054688 0,7.460937 -3.164062,11.015625 -3.164063,3.535156 -9.84375,3.535156 H 55.128109 V 43.721207 Z"></path>
                                    <path d="m 81.065609,43.721207 h 17.167969 v 3.320312 H 85.030453 v 8.59375 h 11.972656 v 3.320313 H 85.030453 v 13.925781 h -3.964844 z"></path>
                                  </g>
                                </svg>
                              </a>

                              <!--
                              
                              <a href="/account/invoice/F202205006503/primary_csv" title="Télécharger la facture principale CSV" target="_blank">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign" style="width: 1em;">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 39.715401,10.968309 a 1.9992179,1.9992179 0 0 0 -1.967784,2.030253 v 17.249339 l -16.687115,0.140556 a 1.9992179,1.9992179 0 1 0 0.03122,3.998036 l 20.653926,-0.171791 v -21.21614 a 1.9992179,1.9992179 0 0 0 -2.030252,-2.030253 z"></path>
                                    <path d="m 39.980895,10.000035 c -1.318348,0.0042 -2.577245,0.540379 -3.498281,1.483646 a 1.9992179,1.9992179 0 0 0 -0.0078,0 L 18.366513,30.07611 a 1.9992179,1.9992179 0 0 0 -0.0078,0.0078 c -0.872293,0.910837 -1.362194,2.127847 -1.358708,3.388972 v 50.529867 c 0,3.288408 2.708656,5.997054 5.997054,5.997054 h 48.413717 a 1.9992179,1.9992179 0 1 0 0,-3.998036 H 22.997051 c -1.127689,0 -1.999018,-0.87132 -1.999018,-1.999018 V 33.46507 c -6.21e-4,-0.22471 0.08101,-0.437386 0.23426,-0.601267 l 0.0078,-0.0078 18.100483,-18.58462 c 0.171158,-0.175289 0.403421,-0.270567 0.648132,-0.273316 h 31.406448 c 1.418087,0.01239 2.525427,1.119725 2.537813,2.537816 v 6.176653 a 1.9992179,1.9992179 0 1 0 3.998036,0 v -6.19227 a 1.9992179,1.9992179 0 0 0 0,-0.02343 c -0.03104,-3.55401 -2.942794,-6.465765 -6.496808,-6.496806 a 1.9992179,1.9992179 0 0 0 -0.02359,0 h -31.4219 a 1.9992179,1.9992179 0 0 0 -0.0078,0 z"></path>
                                    <path d="m 48.245163,72.269936 q -1.503906,0.800781 -3.085938,1.191406 -1.582031,0.410156 -3.359375,0.410156 -5.605468,0 -8.710937,-3.964844 -3.085938,-3.964843 -3.085938,-11.152343 0,-7.148438 3.105469,-11.132813 3.125,-4.003906 8.691406,-4.003906 1.777344,0 3.359375,0.410156 1.582032,0.390625 3.085938,1.191406 v 4.042969 q -1.445313,-1.191406 -3.105469,-1.816406 -1.660156,-0.625 -3.339844,-0.625 -3.847656,0 -5.761718,2.96875 -1.914063,2.96875 -1.914063,8.964844 0,5.976562 1.914063,8.945312 1.914062,2.96875 5.761718,2.96875 1.71875,0 3.359375,-0.625 1.660157,-0.625 3.085938,-1.816406 z"></path>
                                    <path d="m 71.116257,45.141029 v 4.003907 q -1.796875,-1.152344 -3.613282,-1.738282 -1.796875,-0.585937 -3.632812,-0.585937 -2.792969,0 -4.414063,1.308594 -1.621093,1.289062 -1.621093,3.496093 0,1.933594 1.054687,2.949219 1.074219,1.015625 3.984375,1.699219 l 2.070313,0.46875 q 4.101562,0.957031 5.976562,3.007812 1.875,2.050782 1.875,5.585938 0,4.160156 -2.578125,6.347656 -2.578125,2.1875 -7.5,2.1875 -2.050781,0 -4.121094,-0.449219 -2.070312,-0.429687 -4.160156,-1.308593 v -4.199219 q 2.246094,1.425781 4.238281,2.089844 2.011719,0.664062 4.042969,0.664062 2.988281,0 4.648438,-1.328125 1.660156,-1.347656 1.660156,-3.75 0,-2.1875 -1.152344,-3.339844 -1.132812,-1.152343 -3.964844,-1.777343 L 61.79985,59.984779 q -4.0625,-0.917968 -5.898437,-2.773437 -1.835938,-1.855469 -1.835938,-4.980469 0,-3.90625 2.617188,-6.25 2.636719,-2.363281 6.992187,-2.363281 1.679688,0 3.535157,0.390625 1.855468,0.371094 3.90625,1.132812 z"></path>
                                    <path d="M 87.444382,69.984779 94.29985,44.144936 h 4.082032 L 89.846725,73.305092 H 85.061569 L 76.526413,44.144936 h 4.082031 z"></path>
                                  </g>
                                </svg>
                              </a>
                              
                              <a href="/account/invoice/F202205006503/mobile_details" title="Télécharger les détails mobile" target="_blank">
                                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="M39.72,11a2,2,0,0,0-2,2h0V30.25l-16.69.14a2,2,0,0,0,0,4h.05l20.66-.18V13a2,2,0,0,0-2-2Z"></path>
                                    <path d="M40,10a4.9,4.9,0,0,0-3.5,1.48h0l-18.1,18.6h0A4.92,4.92,0,0,0,17,33.47V84a6,6,0,0,0,6,6H71.41a2,2,0,1,0,.06-4H23a2,2,0,0,1-2-2V33.47a.91.91,0,0,1,.23-.61h0l18.1-18.59A.91.91,0,0,1,40,14H71.4a2.53,2.53,0,0,1,2.53,2.54v6.17a2,2,0,1,0,4,.06V16.5a6.58,6.58,0,0,0-6.5-6.5H40Z"></path>
                                    <path d="M82.8,82H59.94a6,6,0,0,1-6-6V35.31a6,6,0,0,1,6-6H82.8a6,6,0,0,1,6,6V76A6,6,0,0,1,82.8,82ZM59.94,32a3.36,3.36,0,0,0-3.36,3.36V76a3.37,3.37,0,0,0,3.36,3.36H82.8A3.37,3.37,0,0,0,86.16,76V35.31A3.36,3.36,0,0,0,82.8,32Z"></path>
                                    <path d="M73.15,38.19H69.59a1.32,1.32,0,0,1,0-2.64h3.56a1.32,1.32,0,0,1,0,2.64Z"></path>
                                    <circle cx="71.37" cy="71.92" r="3.13"></circle>
                                  </g>
                                </svg>
                              </a>

                              -->

                            </td>
                          </tr>
                        </tbody>


                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      
    </div>

</template>

<script>
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
const _ = require('underscore')
export default {
  name: 'Billing',
  props: {
    msg: String,
    tab: Boolean
  },
  data () {
    return {
      groupeOne: [],
      groupeTwo: [],
      groupeThird: [],
      selectedGroupeOne: false,
      selectedGroupeTwo: false,
      selectedGroupeThree: false,
      groupOrder: [],
      downloadStatus: 0,
      isFournisseur: false,
      isDate: false,
      isMontantHT: false,
      isMontantTTC: false,
      isState: false,
      search_bill: '',
      billcheck: false,
      bills: [],
      bills_infos: [],
      bills_client: [],
      bills_fournisseur: [],
      bills_client_groupped: [],
      bills_fournisseur_groupped: [],
      arrow_name: 'no',
      arrow_intitulé: 'no',
      arrow_fournisseur: 'no',
      arrow_invoice_date: 'no',
      arrow_ht_montant: 'no',
      arrow_ttc_montant: 'no',
      arrow_status: 'no',
      monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    }
  },
  async created () {
    if (this.user.allowed_routes.length <= 0 || !this.user.allowed_routes.includes('billing')) {
      this.$router.push('/products')
    }
    await this.getBills()
    await this.getInfos()
    await this.addGraph()
    if (!this.isMobile()) {
      this.byFournisseur()
      this.byDate()
    }
    this.$globalState.loader = false
  },
  methods: {
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    billCheckbox (e) {
      this.billcheck = e.target.checked
    },
    async downloadBill (b) {
      const params = new FormData()
      params.append('data', JSON.stringify(['/report/pdf/account.report_invoice_with_payments/' + b.id.toString(), 'qweb-pdf']))
      params.append('token', 'dummy-because-api-expects-one')
      params.append('csrf_token', this.user.csrf_token)
      let xhr = new XMLHttpRequest()
      xhr.open('POST', process.env.ODOO_API + 'report/download?session_id=' + this.user.session_id, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          this.downloadStatus = 200
          let blob = new Blob([xhr.response], { type: 'application/pdf' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.setAttribute('download', b.name + '.pdf')
          link.target = '_blank'
          link.click()
        }
      }
      xhr.send(params)
    },
    async getBills () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.bills_client = await this.$axios.get(process.env.ODOO_API + 'api/billing/out?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.list
      })
      this.bills_fournisseur = await this.$axios.get(process.env.ODOO_API + 'api/billing/in?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.list
      })
    },
    async getInfos () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.bills_infos = await this.$axios.get(process.env.ODOO_API + 'api/billing/infos?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data
      })
    },
    orderByName () {
      this.arrow_intitulé = 'no'
      this.arrow_fournisseur = 'no'
      this.arrow_invoice_date = 'no'
      this.arrow_ht_montant = 'no'
      this.arrow_ttc_montant = 'no'
      this.arrow_status = 'no'
      if (this.arrow_name === 'no') {
        this.arrow_name = 'down'
      } else if (this.arrow_name === 'down') {
        this.arrow_name = 'up'
      } else if (this.arrow_name === 'up') {
        this.arrow_name = 'no'
      }
    },
    orderByIntitule () {
      this.arrow_name = 'no'
      this.arrow_fournisseur = 'no'
      this.arrow_invoice_date = 'no'
      this.arrow_ht_montant = 'no'
      this.arrow_ttc_montant = 'no'
      this.arrow_status = 'no'
      if (this.arrow_intitulé === 'no') {
        this.arrow_intitulé = 'down'
      } else if (this.arrow_intitulé === 'down') {
        this.arrow_intitulé = 'up'
      } else if (this.arrow_intitulé === 'up') {
        this.arrow_intitulé = 'no'
      }
    },
    orderByFournisseur () {
      this.arrow_intitulé = 'no'
      this.arrow_name = 'no'
      this.arrow_invoice_date = 'no'
      this.arrow_ht_montant = 'no'
      this.arrow_ttc_montant = 'no'
      this.arrow_status = 'no'
      if (this.arrow_fournisseur === 'no') {
        this.arrow_fournisseur = 'down'
      } else if (this.arrow_fournisseur === 'down') {
        this.arrow_fournisseur = 'up'
      } else if (this.arrow_fournisseur === 'up') {
        this.arrow_fournisseur = 'no'
      }
    },
    orderByInvoiceDate () {
      this.arrow_intitulé = 'no'
      this.arrow_fournisseur = 'no'
      this.arrow_name = 'no'
      this.arrow_ht_montant = 'no'
      this.arrow_ttc_montant = 'no'
      this.arrow_status = 'no'
      if (this.arrow_invoice_date === 'no') {
        this.arrow_invoice_date = 'down'
      } else if (this.arrow_invoice_date === 'down') {
        this.arrow_invoice_date = 'up'
      } else if (this.arrow_invoice_date === 'up') {
        this.arrow_invoice_date = 'no'
      }
    },
    orderByHTMontant () {
      this.arrow_intitulé = 'no'
      this.arrow_fournisseur = 'no'
      this.arrow_invoice_date = 'no'
      this.arrow_name = 'no'
      this.arrow_ttc_montant = 'no'
      this.arrow_status = 'no'
      if (this.arrow_ht_montant === 'no') {
        this.arrow_ht_montant = 'down'
      } else if (this.arrow_ht_montant === 'down') {
        this.arrow_ht_montant = 'up'
      } else if (this.arrow_ht_montant === 'up') {
        this.arrow_ht_montant = 'no'
      }
    },
    orderByTTCMontant () {
      this.arrow_intitulé = 'no'
      this.arrow_fournisseur = 'no'
      this.arrow_invoice_date = 'no'
      this.arrow_ht_montant = 'no'
      this.arrow_name = 'no'
      this.arrow_status = 'no'
      if (this.arrow_ttc_montant === 'no') {
        this.arrow_ttc_montant = 'down'
      } else if (this.arrow_ttc_montant === 'down') {
        this.arrow_ttc_montant = 'up'
      } else if (this.arrow_ttc_montant === 'up') {
        this.arrow_ttc_montant = 'no'
      }
    },
    orderByStatus () {
      this.arrow_intitulé = 'no'
      this.arrow_fournisseur = 'no'
      this.arrow_invoice_date = 'no'
      this.arrow_ht_montant = 'no'
      this.arrow_ttc_montant = 'no'
      this.arrow_name = 'no'
      if (this.arrow_status === 'no') {
        this.arrow_status = 'down'
      } else if (this.arrow_status === 'down') {
        this.arrow_status = 'up'
      } else if (this.arrow_status === 'up') {
        this.arrow_status = 'no'
      }
    },
    updateSelectGroup (i, group, vals) {
      if (group === 0) {
        let selected = this.groupeOne[i].selected
        this.groupeOne.forEach((v) => { v.selected = false })
        this.groupeTwo.forEach((v) => { v.selected = false })
        this.groupeThird.forEach((v) => { v.selected = false })
        selected === true ? this.groupeOne[i].selected = false : this.groupeOne[i].selected = true
        this.groupOrder[0].value = vals.name
      } else if (group === 1) {
        let selected = this.groupeTwo[i].selected
        this.groupeTwo.forEach((v) => { v.selected = false })
        this.groupeThird.forEach((v) => { v.selected = false })
        selected === true ? this.groupeTwo[i].selected = false : this.groupeTwo[i].selected = true
        this.groupOrder[1].value = vals.name
      } else if (group === 2) {
        let selected = this.groupeThree[i].selected
        this.groupeThird.forEach((v) => { v.selected = false })
        selected === true ? this.groupeThree[i].selected = false : this.groupeThree[i].selected = true
        this.groupOrder[2].value = vals.name
      }
    },
    byFournisseur () {
      if (this.isFournisseur === false) {
        this.isFournisseur = true
        this.groupOrder.push({'name': 'Fournisseur', 'value': ''})
        let orderIndex = this.groupOrder.map(x => x.name).indexOf('Fournisseur')
        let array = (this.billcheck === false) ? (this.bills.map(x => x.invoice_partner_display_name).filter((v, i, s) => s.indexOf(v) === i)) : (this.bills.map(x => x.invoice_origin).filter((v, i, s) => s.indexOf(v) === i))
        let data = []
        for (let i of array) {
          if (i && i !== 'false') {
            data.push({'name': i, 'selected': false})
          }
        }
        if (orderIndex === 0) {
          this.groupeOne = data
        } else if (orderIndex === 1) {
          this.groupeTwo = data
        } else if (orderIndex === 2) {
          this.groupeThree = data
        }
      } else {
        this.isFournisseur = false
        let orderIndex = this.groupOrder.map(x => x.name).indexOf('Fournisseur')
        this.groupOrder.splice(orderIndex, 1)
        if (orderIndex === 0) {
          this.groupeOne = this.groupeTwo
          this.groupeTwo = this.groupeThree
        } else if (orderIndex === 1) {
          this.groupeTwo = this.groupeThree
        } else if (orderIndex === 2) {
          this.groupeThree = []
        }
      }
    },
    byDate () {
      if (this.isDate === false) {
        this.isDate = true
        this.groupOrder.push({'name': 'Date', 'value': ''})
        let orderIndex = this.groupOrder.map(x => x.name).indexOf('Date')
        let array = this.bills.map(x => x.invoice_date).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        if (orderIndex === 0) {
          this.groupeOne = data
        } else if (orderIndex === 1) {
          this.groupeTwo = data
        } else if (orderIndex === 2) {
          this.groupeThree = data
        }
      } else {
        this.isDate = false
        let orderIndex = this.groupOrder.map(x => x.name).indexOf('Date')
        this.groupOrder.splice(orderIndex, 1)
        if (orderIndex === 0) {
          this.groupeOne = this.groupeTwo
          this.groupeTwo = this.groupeThree
        } else if (orderIndex === 1) {
          this.groupeTwo = this.groupeThree
        } else if (orderIndex === 2) {
          this.groupeThree = []
        }
      }
    },
    byState () {
      if (this.isState === false) {
        this.isState = true
        this.groupOrder.push({'name': 'State', 'value': ''})
        let orderIndex = this.groupOrder.map(x => x.name).indexOf('State')
        let array = this.bills.map(x => x.state).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        if (orderIndex === 0) {
          this.groupeOne = data
        } else if (orderIndex === 1) {
          this.groupeTwo = data
        } else if (orderIndex === 2) {
          this.groupeThree = data
        }
      } else {
        this.isState = false
        let orderIndex = this.groupOrder.map(x => x.name).indexOf('State')
        this.groupOrder.splice(orderIndex, 1)
        if (orderIndex === 0) {
          this.groupeOne = this.groupeTwo
          this.groupeTwo = this.groupeThree
        } else if (orderIndex === 1) {
          this.groupeTwo = this.groupeThree
        } else if (orderIndex === 2) {
          this.groupeThree = []
        }
      }
    },
    async addGraph () {
      const header = {
        'Content-Type': 'application/json'
      }
      let billsgraph = await this.$axios.get(process.env.ODOO_API + 'api/billing/graphs?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data
      })
      let billstovalidategraph = billsgraph.bills_to_validate_graph
      let billsnotreceivedgraph = billsgraph.bills_not_received_graph
      let billstopaygraph = billsgraph.bills_to_pay_graph

      let labs = []
      let vals = []
      for (let b of billstovalidategraph) {
        let d = new Date(b[0])
        let check = this.$moment(b[0], 'YYYY-MM-DD')
        let year = check.format('YYYY')
        labs.push(this.monthNames[d.getMonth()] + ' ' + year)
        vals.push(b[1])
      }
      let ctx = document.getElementById('bills_to_validate_graph')
      let val = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labs,
          datasets: [
            {
              label: 'Montant à valider',
              data: vals,
              backgroundColor: 'rgba(71, 183,132,.5)',
              borderColor: '#47b784',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          stacked: false,
          plugins: {
            title: {
              display: false,
              text: 'Chart.js Line Chart - Multi Axis'
            },
            datalabels: {
              display: false,
            },
          },
          scales: {
            tooltips: {
              mode: 'index'
            },
            yAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })

      labs = []
      vals = []
      for (let b of billsnotreceivedgraph) {
        let d = new Date(b[0])
        let check = this.$moment(b[0], 'YYYY-MM-DD')
        let year = check.format('YYYY')
        labs.push(this.monthNames[d.getMonth()] + ' ' + year)
        vals.push(b[1])
      }
      ctx = document.getElementById('bills_not_received_graph')
      val = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labs,
          datasets: [
            {
              label: 'Montant non reçu',
              data: vals,
              backgroundColor: 'rgba(71, 183,132,.5)',
              borderColor: '#47b784',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          stacked: false,
          plugins: {
            title: {
              display: false,
              text: 'Chart.js Line Chart - Multi Axis'
            },
            datalabels: {
              display: false,
            },
          },
          scales: {
            tooltips: {
              mode: 'index'
            },
            yAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })

      labs = []
      vals = []
      for (let b of billstopaygraph) {
        let d = new Date(b[0])
        let check = this.$moment(b[0], 'YYYY-MM-DD')
        let year = check.format('YYYY')
        labs.push(this.monthNames[d.getMonth()] + ' ' + year)
        vals.push(b[1])
      }
      ctx = document.getElementById('bills_to_pay_graph')
      val = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labs,
          datasets: [
            {
              label: 'Montant à payer',
              data: vals,
              backgroundColor: 'rgba(71, 183,132,.5)',
              borderColor: '#47b784',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          stacked: false,
          plugins: {
            title: {
              display: false,
              text: 'Chart.js Line Chart - Multi Axis'
            },
            datalabels: {
              display: false,
            },
          },
          scales: {
            tooltips: {
              mode: 'index'
            },
            yAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })

      return val
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    getGroupOne () {
      if (this.billcheck === false) {
        this.bills = this.bills_fournisseur
      } else {
        this.bills = this.bills_client
      }
      if (this.groupOrder[0].name === 'Fournisseur') {
        let array = (this.billcheck === false) ? (this.bills.map(x => x.invoice_partner_display_name).filter((v, i, s) => s.indexOf(v) === i)) : (this.bills.map(x => x.invoice_origin).filter((v, i, s) => s.indexOf(v) === i))
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeOne = data
      } else if (this.groupOrder[0].name === 'State') {
        let array = this.bills.map(x => x.state).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeOne = data
      } else if (this.groupOrder[0].name === 'Date') {
        let array = this.bills.map(x => x.invoice_date).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeOne = data
      }
      if (this.arrow_name === 'down') {
        this.groupeOne = this.groupeOne.sort((a, b) => a.name - b.name)
      } else if (this.arrow_name === 'up') {
        this.groupeOne = this.groupeOne.sort((a, b) => a.name - b.name)
        this.groupeOne = this.groupeOne.reverse()
      }
      if (this.search_bill) {
        let text = this.search_bill
        this.groupeOne = this.groupeOne.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return this.groupeOne
      }
      return this.groupeOne
    },
    getGroupTwo () {
      if (this.billcheck === false) {
        this.bills = this.bills_fournisseur
      } else {
        this.bills = this.bills_client
      }
      if (this.groupOrder[1].name === 'Fournisseur') {
        let array = (this.billcheck === false) ? (this.bills.map(x => x.invoice_partner_display_name).filter((v, i, s) => s.indexOf(v) === i)) : (this.bills.map(x => x.invoice_origin).filter((v, i, s) => s.indexOf(v) === i))
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeTwo = data
      } else if (this.groupOrder[1].name === 'State') {
        let array = this.bills.map(x => x.state).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeTwo = data
      } else if (this.groupOrder[1].name === 'Date') {
        let array = this.bills.map(x => x.invoice_date).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeTwo = data
      }
      if (this.groupOrder[0].name === 'Fournisseur' && this.billcheck === true) {
        this.groupeTwo = this.bills.filter(v => v.invoice_origin === this.groupOrder[0].value)
      } else if (this.groupOrder[0].name === 'Fournisseur' && this.billcheck === false) {
        this.groupeTwo = this.bills.filter(v => v.invoice_partner_display_name === this.groupOrder[0].value)
      } else if (this.groupOrder[0].name === 'Date') {
        this.groupeTwo = this.bills.filter(v => v.invoice_date === this.groupOrder[0].value)
      } else if (this.groupOrder[0].name === 'State') {
        this.groupeTwo = this.bills.filter(v => v.state === this.groupOrder[0].value)
      }
      if (this.groupOrder[1].name === 'Fournisseur') {
        let data = []
        for (let g of this.groupeTwo) {
          if (this.billcheck === true) {
            data.push({'name': g.invoice_origin, 'selected': false})
          } else {
            data.push({'name': g.invoice_partner_display_name, 'selected': false})
          }
        }
        this.groupeTwo = data
      } else if (this.groupOrder[1].name === 'Date') {
        let data = []
        for (let g of this.groupeTwo) {
          data.push({'name': g.invoice_date, 'selected': false})
        }
        this.groupeTwo = data
      } else if (this.groupOrder[1].name === 'State') {
        let data = []
        for (let g of this.groupeTwo) {
          data.push({'name': g.state, 'selected': false})
        }
        this.groupeTwo = data
      }
      if (this.arrow_name === 'down') {
        this.groupeTwo = this.groupeTwo.sort((a, b) => a.name - b.name)
      } else if (this.arrow_name === 'up') {
        this.groupeTwo = this.groupeTwo.sort((a, b) => a.name - b.name)
        this.groupeTwo = this.groupeTwo.reverse()
      }

      if (this.search_bill) {
        let text = this.search_bill
        this.groupeTwo = this.groupeTwo.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return this.groupeTwo
      }
      return this.groupeTwo
    },
    getGroupThree () {
      if (this.billcheck === false) {
        this.bills = this.bills_fournisseur
      } else {
        this.bills = this.bills_client
      }
      if (this.groupOrder[2].name === 'Fournisseur') {
        let array = (this.billcheck === false) ? (this.bills.map(x => x.invoice_partner_display_name).filter((v, i, s) => s.indexOf(v) === i)) : (this.bills.map(x => x.invoice_origin).filter((v, i, s) => s.indexOf(v) === i))
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeThree = data
      } else if (this.groupOrder[2].name === 'State') {
        let array = this.bills.map(x => x.state).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeThree = data
      } else if (this.groupOrder[2].name === 'Date') {
        let array = this.bills.map(x => x.invoice_date).filter((v, i, s) => s.indexOf(v) === i)
        let data = []
        for (let i of array) {
          data.push({'name': i, 'selected': false})
        }
        this.groupeThree = data
      }
      if (this.groupOrder[0].name === 'Fournisseur' && this.billcheck === true) {
        this.groupeThree = this.bills.filter(v => v.invoice_origin === this.groupOrder[0].value)
      } else if (this.groupOrder[0].name === 'Fournisseur' && this.billcheck === false) {
        this.groupeThree = this.bills.filter(v => v.invoice_partner_display_name === this.groupOrder[0].value)
      } else if (this.groupOrder[0].name === 'Date') {
        this.groupeThree = this.bills.filter(v => v.invoice_date === this.groupOrder[0].value)
      } else if (this.groupOrder[0].name === 'State') {
        this.groupeThree = this.bills.filter(v => v.state === this.groupOrder[0].value)
      }
      if (this.groupOrder[1].name === 'Fournisseur' && this.billcheck === true) {
        this.groupeThree = this.groupeThree.filter(v => v.invoice_origin === this.groupOrder[1].value)
      } else if (this.groupOrder[1].name === 'Fournisseur' && this.billcheck === false) {
        this.groupeThree = this.bills.filter(v => v.invoice_partner_display_name === this.groupOrder[1].value)
      } else if (this.groupOrder[1].name === 'Date') {
        this.groupeThree = this.groupeThree.filter(v => v.invoice_date === this.groupOrder[1].value)
      } else if (this.groupOrder[1].name === 'State') {
        this.groupeThree = this.groupeThree.filter(v => v.state === this.groupOrder[1].value)
      }
      if (this.groupOrder[2].name === 'Fournisseur') {
        let data = []
        for (let g of this.groupeThree) {
          if (this.billcheck === true) {
            data.push({'name': g.invoice_origin, 'selected': false})
          } else {
            data.push({'name': g.invoice_partner_display_name, 'selected': false})
          }
        }
        this.groupeThree = data
      } else if (this.groupOrder[2].name === 'Date') {
        let data = []
        for (let g of this.groupeThree) {
          data.push({'name': g.invoice_date, 'selected': false})
        }
        this.groupeThree = data
      } else if (this.groupOrder[2].name === 'State') {
        let data = []
        for (let g of this.groupeThree) {
          data.push({'name': g.state, 'selected': false})
        }
        this.groupeThree = data
      }

      if (this.search_bill) {
        let text = this.search_bill
        this.groupeThree = this.groupeThree.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return this.groupeThree
      }
      return this.groupeThree
    },
    getAllGroupedBills () {
      if (this.billcheck === false) {
        this.bills = this.bills_fournisseur
      } else {
        this.bills = this.bills_client
      }
      let bill = this.bills
      for (let g of this.groupOrder) {
        if (g.name === 'Fournisseur') {
          bill = (this.billcheck === false) ? (bill.map(x => x).filter((v) => v.invoice_partner_display_name === g.value)) : (bill.map(x => x).filter((v) => v.invoice_origin === g.value))
        } else if (g.name === 'Date') {
          bill = bill.map(x => x).filter((v) => v.invoice_date === g.value)
        } else if (g.name === 'State') {
          bill = bill.map(x => x).filter((v) => v.state === g.value)
        }
      }
      if (this.arrow_name === 'down') {
        bill = bill.sort((a, b) => a.name - b.name)
      } else if (this.arrow_name === 'up') {
        bill = bill.sort((a, b) => a.name - b.name)
        bill = bill.reverse()
      }
      if (this.arrow_invoice_date === 'down') {
        bill = bill.sort((a, b) => a.invoice_date - b.invoice_date)
      } else if (this.arrow_invoice_date === 'up') {
        bill = bill.sort((a, b) => a.invoice_date - b.invoice_date)
        bill = bill.reverse()
      }
      if (this.billcheck === true) {
        if (this.arrow_intitulé === 'down') {
          bill = bill.sort((a, b) => a.invoice_origin - b.invoice_origin)
        } else if (this.arrow_intitulé === 'up') {
          bill = bill.sort((a, b) => a.invoice_origin - b.invoice_origin)
          bill = bill.reverse()
        }
      } else {
        if (this.arrow_intitulé === 'down') {
          bill = bill.sort((a, b) => a.invoice_partner_display_name - b.invoice_partner_display_name)
        } else if (this.arrow_intitulé === 'up') {
          bill = bill.sort((a, b) => a.invoice_partner_display_name - b.invoice_partner_display_name)
          bill = bill.reverse()
        }
      }
      if (this.arrow_ht_montant === 'down') {
        bill = bill.sort((a, b) => a.untaxed_amount - b.untaxed_amount)
      } else if (this.arrow_ht_montant === 'up') {
        bill = bill.sort((a, b) => a.untaxed_amount - b.untaxed_amount)
        bill = bill.reverse()
      }
      if (this.arrow_ttc_montant === 'down') {
        bill = bill.sort((a, b) => a.total_amount - b.total_amount)
      } else if (this.arrow_ttc_montant === 'up') {
        bill = bill.sort((a, b) => a.total_amount - b.total_amount)
        bill = bill.reverse()
      }
      if (this.arrow_status === 'down') {
        bill = bill.sort((a, b) => a.state - b.state)
      } else if (this.arrow_status === 'up') {
        bill = bill.sort((a, b) => a.state - b.state)
        bill = bill.reverse()
      }
      if (this.search_bill) {
        let text = this.search_bill
        bill = bill.filter(s => {
          if (this.billcheck === true) {
            return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v) || s.invoice_origin.toLowerCase().includes(v) || s.invoice_partner_display_name.toLowerCase().includes(v) || s.invoice_date.toLowerCase().includes(v) || (s.untaxed_amount).toString().includes(v) || (s.total_amount).toString().includes(v))
          } else {
            return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v) || s.invoice_partner_display_name.toLowerCase().includes(v) || s.invoice_date.toLowerCase().includes(v) || (s.untaxed_amount).toString().includes(v) || (s.total_amount).toString().includes(v))
          }
        })
        return bill
      }
      return bill
    },
    groupByFournisseur () {
      if (this.billcheck === true) {
        return _.groupBy(this.bills, 'invoice_origin')
      } else {
        return _.groupBy(this.bills, 'invoice_partner_display_name')
      }
    },
    groupByDate () {
      return _.groupBy(this.bills, 'invoice_date')
    },
    groupByState () {
      return _.groupBy(this.bills, 'state')
    },
    getAllBills () {
      if (this.billcheck === false) {
        this.bills = this.bills_fournisseur
      } else {
        this.bills = this.bills_client
      }
      let bill = this.bills
      if (this.arrow_name === 'down') {
        bill = bill.sort((a, b) => a.name - b.name)
      } else if (this.arrow_name === 'up') {
        bill = bill.sort((a, b) => a.name - b.name)
        bill = bill.reverse()
      }
      if (this.arrow_invoice_date === 'down') {
        bill = bill.sort((a, b) => a.invoice_date - b.invoice_date)
      } else if (this.arrow_invoice_date === 'up') {
        bill = bill.sort((a, b) => a.invoice_date - b.invoice_date)
        bill = bill.reverse()
      }
      if (this.billcheck === true) {
        if (this.arrow_intitulé === 'down') {
          bill = bill.sort((a, b) => a.invoice_origin - b.invoice_origin)
        } else if (this.arrow_intitulé === 'up') {
          bill = bill.sort((a, b) => a.invoice_origin - b.invoice_origin)
          bill = bill.reverse()
        }
      } else {
        if (this.arrow_intitulé === 'down') {
          bill = bill.sort((a, b) => a.invoice_partner_display_name - b.invoice_partner_display_name)
        } else if (this.arrow_intitulé === 'up') {
          bill = bill.sort((a, b) => a.invoice_partner_display_name - b.invoice_partner_display_name)
          bill = bill.reverse()
        }
      }
      if (this.arrow_ht_montant === 'down') {
        bill = bill.sort((a, b) => a.untaxed_amount - b.untaxed_amount)
      } else if (this.arrow_ht_montant === 'up') {
        bill = bill.sort((a, b) => a.untaxed_amount - b.untaxed_amount)
        bill = bill.reverse()
      }
      if (this.arrow_ttc_montant === 'down') {
        bill = bill.sort((a, b) => a.total_amount - b.total_amount)
      } else if (this.arrow_ttc_montant === 'up') {
        bill = bill.sort((a, b) => a.total_amount - b.total_amount)
        bill = bill.reverse()
      }
      if (this.arrow_status === 'down') {
        bill = bill.sort((a, b) => a.state - b.state)
      } else if (this.arrow_status === 'up') {
        bill = bill.sort((a, b) => a.state - b.state)
        bill = bill.reverse()
      }
      if (this.search_bill) {
        let text = this.search_bill
        bill = bill.filter(s => {
          if (this.billcheck === true) {
            return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v) || s.invoice_origin.toLowerCase().includes(v) || s.invoice_partner_display_name.toLowerCase().includes(v) || s.invoice_date.toLowerCase().includes(v) || (s.untaxed_amount).toString().includes(v) || (s.total_amount).toString().includes(v))
          } else {
            return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v) || s.invoice_partner_display_name.toLowerCase().includes(v) || s.invoice_date.toLowerCase().includes(v) || (s.untaxed_amount).toString().includes(v) || (s.total_amount).toString().includes(v))
          }
        })
        return bill
      }
      return bill
    }
  },
  mounted () {
    // data: ["/report/py3o/account.report_invoice_with_payments/5720","qweb-py3o"]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
