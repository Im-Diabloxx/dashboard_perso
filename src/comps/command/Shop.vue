<template>
    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
      <div class="admin-box" v-if="user.allowed_routes.length > 0 && user.allowed_routes.includes('orders')" v-show="user.allowed_routes.length > 0 && user.allowed_routes.includes('orders')">
        
        <div class="dashboard" style="padding-bottom: 0px">
          <div class="container is-max-widescreen">
          
            <section>
              <h1 class="dashboard-zone">
                 Mes commandes
              </h1>
            </section>
          </div>
        </div>

        <div class="container is-max-widescreen">
          <div class="billinglist">

          <div data-v-65729484="" class="columns mb-0 align-items-center">
            <div data-v-65729484="" class="column">
              <div data-v-65729484="" class="field mb-0 align-items-center has-addons">
                <div class="row" style="width: 100%">
                  <div class="col-lg-4">
                    <div class="widget style1 blue-alt" @click="menu === 'Contrats' ? menu = '' : menu = 'Contrats'" :style="menu == 'Contrats' ? 'box-shadow: 0 0 0 1px rgb(0, 164, 195);' : ''">
                        <div class="row" style="margin-top: 5px;">
                            <div class="col-4">
                                <i class="material-symbols-outlined size-xxl">contract</i>
                            </div>
                            <div class="col-8 text-right">
                                <span> Contrats </span>
                                <h3 class="font-bold">
                                {{getTotalContracts}}
                                </h3>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="col-lg-4" style="">
                    <div class="widget style1 blue-alt" @click="menu === 'Devis' ? menu = '' : menu = 'Devis'" :style="menu == 'Devis' ? 'box-shadow: 0 0 0 1px rgb(0, 164, 195);' : ''">
                        <div class="row" style="margin-top: 5px;">
                            <div class="col-4">
                              <i class="material-symbols-outlined size-xxl">format_quote</i>
                            </div>
                            <div class="col-8 text-right">
                                <span> Devis </span>
                                <h3 class="font-bold">
                                {{getTotalDevis}}
                                </h3>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="widget style1 blue-alt" @click="menu === 'Commandes' ? menu = '' : menu = 'Commandes'" :style="menu == 'Commandes' ? 'box-shadow: 0 0 0 1px rgb(0, 164, 195);' : ''">
                        <div class="row" style="margin-top: 5px;">
                            <div class="col-4">
                              <i class="material-symbols-outlined size-xxl">orders</i>
                            </div>
                            <div class="col-8 text-right">
                                <span> Commandes </span>
                                <h3 class="font-bold">
                                {{getTotalCommand}}
                                </h3>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container is-max-widescreen">
            <div class="columns is-desktop mt-3" style="padding-right: 0.75rem">
              <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
                <div class="fieldset" style="height: 242px;">
                  <label>
                    Vue sur mon commerce
                  </label>
                  <div class="fieldset-content">
                    <div style="height: 200px">
                      <canvas id="chartLineNewContractByMonth"></canvas>
                    </div>
                    <div class="d-flex justify-content-between"><div>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-one-fifth-desktop" style="padding: 0.75rem; padding-right: 0rem;">
              <div class="fieldset" title="Nombre de devis en attente de passer en commande" style="height: 70px;">
                <label>
                  Devis en attentes
                </label>
                <div class="fieldset-content">
                  <div class="d-flex justify-content-between align-items-center" style="flex-flow: column;">
                    <div>
                      <span class="has-text-white">
                      <b>{{get_devis_onwait}}</b>
                      </span>
                    </div>
                    <!--
                    <div>
                      <a class="button is-admin-primary">
                        valider
                      </a>
                    </div>
                    -->
                  </div>
                </div>
              </div>

              <div class="fieldset" title="Nombre de commandes terminées" style="height: 70px; margin-top: 1rem">
                <label>
                  Commandes terminées
                </label>
                <div class="fieldset-content">
                  <div class="d-flex justify-content-between align-items-center" style="flex-flow: column;">
                    <div>
                      <span class="has-text-white">
                      <b>{{get_command_finish}}</b>
                      </span>
                    </div>
                    <!--
                    <div>
                      <a class="button is-admin-primary">
                        valider
                      </a>
                    </div>
                    -->
                  </div>
                </div>
              </div>

              <div style="width: 39.5%; position: absolute;" @click="goToCreateQuotation">
                  <a style="font-size: 18px; height: 70px; align-items: center;" class="createDevis blackblock sims hoverable">
                      <i class="fa fa-light fa-server" style="align-self: center;"></i>
                      Créer un devis
                      <span>
                          >
                      </span>
                  </a>
              </div>
            </div>


            <div class="column is-one-fifth-desktop" style="padding: 0.75rem; padding-right: 0rem;">
              <div class="fieldset" title="Nombre de contrat en cours" style="height: 70px;">
                <label>
                  Contrats en cours
                </label>
                <div class="fieldset-content">
                  <div class="d-flex justify-content-between align-items-center" style="flex-flow: column;">
                    <div>
                      <span class="has-text-white">
                      <b>{{get_contracts_inprogress}}</b>
                      </span>
                    </div>
                    <!--
                    <div>
                      <a class="button is-admin-primary">
                        valider
                      </a>
                    </div>
                    -->
                  </div>
                </div>
              </div>

              <div class="fieldset" title="Montant total facturé dans l'année" style="height: 70px; margin-top: 1rem">
                <label>
                  Rendement
                </label>
                <div class="fieldset-content">
                  <div class="d-flex justify-content-between align-items-center" style="flex-flow: column;">
                    <div>
                      <span class="has-text-white">
                      <b>{{get_gain_for_year}}</b>
                      </span>
                    </div>
                    <!--
                    <div>
                      <a class="button is-admin-primary">
                        valider
                      </a>
                    </div>
                    -->
                  </div>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>

        <div data-v-65729484="" class="container is-max-widescreen" style="padding-bottom: 1rem;">
          <div class="billinglist">

            <div style="margin-top: 20px" data-v-65729484="" class="columns mb-0 align-items-center">

              <div data-v-65729484="" class="column">
              </div>

            </div>
            
            <section>
              <div class="fieldset mb-5">
                <label v-if="menu === 'Devis'">
                  Mes devis
                </label>
                <label v-else-if="menu === 'Contrats'">
                  Mes contrats
                </label>
                <label v-else-if="menu === 'Commandes'">
                  Mes commandes
                </label>
                <label v-else>
                  Mon shop
                </label>

                <div class="fieldset-content">  
                  <div class="b-table">
                    <div class="field table-mobile-sort">
                      <div class="field has-addons">
                      <div class="control is-expanded">
                          <span class="select is-fullwidth">
                            <select>
                              <option value="[object Object]">
                                Référence
                              </option>
                              <option value="[object Object]">
                                Nom
                              </option>
                              <option value="[object Object]">
                                Partenaire
                              </option>
                              <option value="[object Object]">
                                Société
                              </option>
                              <option value="[object Object]">
                                Date de début
                              </option>
                              <option value="[object Object]">
                                Statut
                              </option>
                              <option value="[object Object]">
                                Éditer
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


                    <div class="has-mobile-cards" style="word-break: break-all;">
                      <div class="d-flex" style="float: right">
                      <div class="field mb-0" style="min-width: 300px">
                        <TagInput
                          :modelValue="search_orders">
                        </TagInput>
                      </div>
                      <!--
                      <button class="button is-admin-secondary-light">
                      Filtres 0 filtre(s) actif(s)
                      </button>
                      -->
                      </div>

                      <table class="table" style="table-layout: fixed">
                        <thead>
                          <tr>
                          
                          <th style="width: 5%" class=""><div class="th-wrap is-centered"> <!----></div></th>

                          <th style="width: 15%" class="is-sortable" @click="sortTable('number')">
                              <div class="th-wrap" style="white-space: nowrap;">Référence
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'number' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'number' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>
                              </div>
                          </th>

                          <th style="width: 20%" class="is-current-sort is-sortable" @click="sortTable('name')">
                              <div class="th-wrap" style="white-space: nowrap;">Nom
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'name' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'name' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 20%" class="is-current-sort is-sortable" @click="sortTable('partner')">
                              <div class="th-wrap" style="white-space: nowrap;">Partenaire
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'partner' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'partner' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class="is-current-sort is-sortable" @click="sortTable('company')">
                              <div class="th-wrap" style="white-space: nowrap;">Société
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'company' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'company' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>
                          <th style="width: 15%" class="is-current-sort is-sortable" @click="sortTable('total_untaxed')">
                              <div class="th-wrap" style="white-space: nowrap;">Montant Total
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'total_untaxed' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'total_untaxed' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 15%" class="is-current-sort is-sortable" @click="sortTable('start_date')">
                              <div class="th-wrap" style="white-space: nowrap;">Date de début
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'start_date' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'start_date' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th  style="width: 10%" class="is-current-sort is-sortable" @click="sortTable('state')">
                              <div class="th-wrap" style="white-space: nowrap;">Statut
                                  <div class="">
                                      <span class="icon-container icon is-small is-desc">
                                          <i :class="sortKey === 'state' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                                          <i :class="sortKey === 'state' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                                      </span>
                                  </div>                            
                              </div>
                          </th>

                          <th style="width: 10%" class=""><div class="th-wrap is-centered"> <!----></div></th>
                          
                          </tr>
                        </thead>


                        <tbody v-for="o of getAllOrders" :key="o.id">
                          <tr draggable="false" class="">

                            <!--
                            <td title="État de la facturation" class="active-cols has-text-centered"><div class="state_dot  mb-0" :class="getPaymentStatus('progress')"></div></td>
                            -->
                            <td data-label="Statut" class="">
                              <i class="material-symbols-outlined">{{getOrderType(o)}}</i>
                            </td>

                            <td data-label="N° de facture" class="">
                              {{o.number}}
                            </td>

                            <td data-label="Intitulé" class="">
                              {{o.name}}
                            </td>
                            <td data-label="Intitulé" class="">
                              {{o.partner}}
                            </td>

                            <td data-label="Société" class="">
                              {{o.company}}
                            </td>

                            <td data-label="Montant total" class="">
                              {{o.total_untaxed}}€
                            </td>

                            <td data-label="Date de début" class="">
                              {{o.start_date}}
                            </td>

                            <td data-label="Statut" class="">
                              <span class="badge" :class="getStateBadge(o.state)">{{o.state}}</span>
                            </td>

                            <td class="has-text-centered">
                              <a @click="downloadOrder(o)" title="Télécharger la facture principale PDF" target="_blank">
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

                              <a @click="EditDevis(o)">
                              <i class="fal fa-pen" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                              </a>

                              <!--
                              <a href="/account/invoice/F202309004715/primary_csv" title="Télécharger la facture principale CSV" target="_blank">
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

                              <a href="/account/invoice/F202309004715/mobile_details" title="Télécharger les détails mobile" target="_blank">
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

              <EditOrder @editOrder="getEditOrder" :active="isEditOrder ? true : false" :order="currentOrder"></EditOrder>

                     
                        

            </section>
          </div>
        </div>
      </div>
      
      
    </div>

</template>

<script>
import EditOrder from './EditOrder.vue'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import TagInput from '../modal/TagInput.vue'

export default {
  name: 'Orders',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    EditOrder,
    TagInput
  },
  data () {
    return {
      orders: [],
      ordersCheck: false,
      search_orders: [],
      orders_infos: [],
      monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      isEditOrder: false,
      currentOrder: [],
      menu: '',
      sortKey: 'start_date',
      sortOrder: 'asc',
      filters: {
        devisOnWait: false,
        commandFinish: false,
        contractsInProgress: false,
        gainForYear: false
      }
    }
  },
  async created () {
    if (this.user.allowed_routes.length <= 0 || !this.user.allowed_routes.includes('orders')) {
      this.$router.push('/products')
    }
    await this.getOrders()
    await this.getOrderInfos()
    await this.addGraph()
  },
  methods: {
    get_total (value) {
      if (value.number.startsWith('00') || value.number.startsWith('99')) {
        return value.total_recurring_untaxed + value.total_non_recurring_untaxed
      } else if (value.number.startsWith('S')) {
        return value.total_untaxed
      }
    },
    toggleFilter (filterType) {
      this.filters[filterType] = !this.filters[filterType]
    },
    sortTable (key) {
      if (this.sortKey !== key) {
        this.sortOrder = 'asc'
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      }
      this.sortKey = key
    },
    goToCreateQuotation () {
      this.$globalState.loader = true
      setTimeout(() => {
        this.$router.push('/products/command?type=new')
        this.$globalState.loader = false
      }, 1000)
    },
    getState (value) {
      switch (value) {
        case 'order':
          return 'Commande'
        case 'production':
          return 'En cours de production'
        case 'terminated':
          return 'Produit'
        case 'draft':
          return 'Brouillon'
        case 'sale':
          return 'Bon de commande'
        case 'sent':
          return 'Envoyé'
        case 'done':
          return 'Terminé'
        case 'finish':
          return 'Résilié'
        case 'on_finish':
          return 'En cours de résiliation'
        case 'cancel':
          return 'Annulé'
      }
    },
    getPaymentStatus (value) {
      switch (value) {
        case 'paid':
          return 'status-active'
        case 'unpaid':
          return 'status-danger'
        case 'unknown':
          return 'status-inactive'
        case 'progress':
          return 'status-warning'
      }
    },
    getOrderType (value) {
      if (value.number.startsWith('S') && value.state !== 'Brouillon' && value.state !== 'Annulé') {
        return 'orders'
      } else if (value.number.startsWith('S') && (value.state === 'Brouillon' || value.state === 'Annulé')) {
        return 'format_quote'
      } else if (value.number.startsWith('00') || value.number.startsWith('99')) {
        return 'contract'
      }
    },
    getStateBadge (value) {
      switch (value) {
        case 'En cours de production':
          return 'badge-info'
        case 'Produit':
          return 'badge-primary'
        case 'Commande':
          return 'badge-success'
        case 'Brouillon':
          return ''
        case 'Bon de commande':
          return 'badge-primary'
        case 'Envoyé':
          return 'badge-info'
        case 'Terminé':
          return 'badge-primary'
        case 'Résilié':
          return ''
        case 'Annulé':
          return 'badge-danger'
      }
    },
    getEditOrder (value) {
      this.isEditOrder = value
    },
    EditDevis (order) {
      if (order.type === 'sale') {
        this.$globalState.loader = true
        setTimeout(() => {
          this.$router.push('/products/command?type=devis&number=' + order.name)
        }, 1000)
      } else if (order.type === 'contract') {
        // this.EditOrder(order)
        this.$globalState.loader = true
        setTimeout(() => {
          this.$router.push('/products/command?type=contract&number=' + order.number)
        }, 1000)
      }
    },
    EditOrder (order) {
      this.isEditOrder = true
      this.currentOrder = order
    },
    async addGraph () {
      let newcontractgraph = this.orders_infos.orders_graph_contract_per_month
      let labs = []
      let valsContracts = []
      let valsAmount = []
      for (let b of newcontractgraph) {
        let d = new Date(b[0])
        let check = this.$moment(b[0], 'YYYY-MM-DD')
        let year = check.format('YYYY')
        labs.push(this.monthNames[d.getMonth()] + ' ' + year)
        valsContracts.push(b[1])
        valsAmount.push(parseFloat(b[2]).toFixed(2))
      }
      let ctx = document.getElementById('chartLineNewContractByMonth')
      let val = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labs,
          datasets: [
            {
              label: 'Nouveau contrat créé par mois',
              data: valsContracts,
              yAxisID: 'y1',
              backgroundColor: 'rgba(71, 183,132,.5)',
              borderColor: '#47b784',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              tension: 0.2
            },
            {
              label: 'Montant total vendu par mois',
              data: valsAmount,
              yAxisID: 'y2',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
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
            intersect: false,
            callbacks: {
              label: function (tooltipItem, data) {
                let label = data.datasets[tooltipItem.datasetIndex].label || ''
                let yLabel = tooltipItem.yLabel
                if (tooltipItem.datasetIndex === 1) {
                  yLabel = parseFloat(yLabel).toFixed(2)
                  return label + ': ' + yLabel + '€'
                } else {
                  return label + ': ' + yLabel
                }
              }
            }
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
                id: 'y1',
                type: 'linear',
                position: 'left',
                display: false,
                ticks: {
                  beginAtZero: true
                }
              },
              {
                id: 'y2',
                type: 'linear',
                position: 'right',
                display: false,
                ticks: {
                  beginAtZero: true,
                  callback: function (value, index, values) {
                    return value.toFixed(2) + '€'
                  }
                },
                gridLines: {
                  drawOnChartArea: false
                }
              }
            ],
            xAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: true,
                  display: false
                }
              }
            ]
          }
        }
      })
      return val
    },
    ordersCheckbox (e) {
      this.ordersCheck = e.target.checked
    },
    async getOrderInfos () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.orders_infos = await this.$axios.get(process.env.ODOO_API + 'api/orders/infos?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data
      })
    },
    async getOrders () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.orders = await this.$axios.get(process.env.ODOO_API + 'api/orders?session_id=' + this.user.session_id, { headers: header }).then(response => {
        for (let order of response.data.all_orders) {
          order.state = this.getState(order.state)
        }
        return response.data.all_orders
      })
    },
    async downloadOrder (c) {
      const params = new FormData()
      if (c.type === 'contract') {
        params.append('data', JSON.stringify(['/report/pdf/contract.report_contract_document/' + c.id.toString(), 'qweb-pdf']))
        params.append('token', 'dummy-because-api-expects-one')
        params.append('csrf_token', this.user.csrf_token)
      } else {
        params.append('data', JSON.stringify(['/report/pdf/sale.report_saleorder/' + c.id.toString(), 'qweb-pdf']))
        params.append('token', 'dummy-because-api-expects-one')
        params.append('csrf_token', this.user.csrf_token)
      }
      let xhr = new XMLHttpRequest()
      xhr.open('POST', process.env.ODOO_API + 'report/download?session_id=' + this.user.session_id, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          let blob = new Blob([xhr.response], { type: 'application/pdf' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = c.name + '.pdf'
          link.click()
        }
      }
      xhr.send(params)
    }
  },
  computed: {
    get_contracts_inprogress () {
      let order = this.orders
      order = order.filter(s => (s.number.startsWith('00') || s.number.startsWith('99')) && s.state === 'Produit')
      return order.length
    },
    get_gain_for_year () {
      return 0
    },
    get_command_finish () {
      let order = this.orders
      order = order.filter(s => s.number.startsWith('S') && s.state === 'Terminé')
      return order.length
    },
    get_devis_onwait () {
      let order = this.orders
      order = order.filter(s => s.number.startsWith('S') && s.state === 'Brouillon')
      return order.length
    },
    getTotalContracts () {
      let order = this.orders
      order = order.filter(s => s.number.startsWith('00') || s.number.startsWith('99'))
      return order.length
    },
    getTotalCommand () {
      let order = this.orders
      order = order.filter(s => s.number.startsWith('S') && s.state !== 'Brouillon' && s.state !== 'Annulé')
      return order.length
    },
    getTotalDevis () {
      let order = this.orders
      order = order.filter(s => s.number.startsWith('S') && (s.state === 'Brouillon' || s.state === 'Annulé'))
      return order.length
    },
    user () {
      return this.$store.getters.getUser
    },
    getAllOrders () {
      let order = this.orders

      if (this.menu === 'Commandes') {
        order = order.filter(s => s.number.startsWith('S') && s.state !== 'Brouillon' && s.state !== 'Annulé')
      } else if (this.menu === 'Devis') {
        order = order.filter(s => s.number.startsWith('S') && (s.state === 'Brouillon' || s.state === 'Annulé'))
      } else if (this.menu === 'Contrats') {
        order = order.filter(s => s.number.startsWith('00') || s.number.startsWith('99'))
      }

      if (this.filters.devisOnWait) {
        order = order.filter(s => s.number.startsWith('S') && s.state === 'Brouillon')
      }
      if (this.filters.commandFinish) {
        order = order.filter(s => s.number.startsWith('S') && (s.state === 'Terminé'))
      }
      if (this.filters.contractsInProgress) {
        order = order.filter(s => (s.number.startsWith('00') || s.number.startsWith('99')) && s.state === 'Produit')
      }

      if (this.search_orders.length > 0) {
        let text = this.search_orders.join(' ')
        order = order.filter(s => {
          return text.toLowerCase().split(' ').every(v =>
            (s.name && s.name.toLowerCase().includes(v)) ||
            (s.number && s.number.toLowerCase().includes(v)) ||
            (s.partner && s.partner.toLowerCase().includes(v)) ||
            (s.company && s.company.toLowerCase().includes(v)) ||
            (s.start_date && s.start_date.toLowerCase().includes(v)) ||
            (this.getState(s.state) && (this.getState(s.state).toLowerCase()).includes(v))
          )
        })
      }

      if (this.sortKey && this.sortOrder) {
        if (this.sortKey === 'start_date') {
          const parseDate = (dateString) => {
            const [day, month, year] = dateString.split('/')
            return new Date(year, month - 1, day)
          }
          order.sort((a, b) => {
            const dateA = parseDate(a.start_date)
            const dateB = parseDate(b.start_date)
            return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA
          })
        } else if (this.sortKey === 'state') {
          const stateOrder = ['Brouillon', 'Envoyé', 'Bon de commande', 'Produit', 'Résilié', 'Terminé', 'Annulé']
          order.sort((a, b) => {
            const indexA = stateOrder.indexOf(a.state)
            const indexB = stateOrder.indexOf(b.state)
            return this.sortOrder === 'asc' ? indexA - indexB : indexB - indexA
          })
        } else {
          order.sort((a, b) => {
            const valueA = a[this.sortKey]
            const valueB = b[this.sortKey]
            if (this.sortOrder === 'asc') {
              return valueA.localeCompare(valueB)
            } else {
              return valueB.localeCompare(valueA)
            }
          })
        }
      }

      return order
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
