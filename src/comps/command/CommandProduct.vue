<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
        <div class="admin-box" v-if="user.allowed_routes.length > 0 && user.allowed_routes.includes('orders')" v-show="user.allowed_routes.length > 0 && user.allowed_routes.includes('orders')">
            <div class="dashboard">
                <div class="container is-max-widescreen">
                    <section>
                    <a data-v-38fdae67="" @click="goToCommand()">
                      <svg data-v-38fdae67="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                          <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                              <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                          </g>
                      </svg>
                      <h1 class="dashboard-zone" v-if="commandType === 'contract' && stateType === 'on_finish'">
                          Contrat n°{{number}} (en cours de résiliation)
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'contract' && stateType === 'finish'">
                          Contrat n°{{number}} (résilié)
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'contract' && stateType === 'quotation'">
                          Contrat n°{{number}} (brouillon)
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'contract' && stateType === 'order'">
                          Contrat n°{{number}} (commande)
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'contract' && stateType === 'production'">
                          Contrat n°{{number}} (en cours de production)
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'contract' && stateType === 'terminated'">
                          Contrat n°{{number}} (produit)
                      </h1>

                      <h1 class="dashboard-zone" v-if="commandType === 'quotation' && stateType === 'brouillon'">
                          Devis n°/
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'quotation' && stateType === 'devis'">
                          Devis n°{{number}}
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'quotation' && stateType === 'command'">
                          Commande n°{{number}}
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'quotation' && stateType === 'cancel'">
                          Devis n°{{number}} (annulé)
                      </h1>
                      <h1 class="dashboard-zone" v-if="commandType === 'quotation' && stateType === 'sent'">
                          Devis n°{{number}} (envoyé)
                      </h1>
                    </a>
                    </section>
                </div>
                



                <div class="container is-max-widescreen">
                  <div class="columns mt-3" :style="isMobile() ? 'padding-right: 0' : ''">
                      <div class="column" style="">
                          <div class="fieldset" style="height: 230px">
                            <label>
                              <a v-if="client && client.id && canEdit" data-v-38fdae67="" @click="returnToClientSelect()">
                                <svg data-v-38fdae67="" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                        <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                                    </g>
                                </svg>
                              </a>
                              Informations client
                            </label>
                            <div class="fieldset-content" v-if="commandType === 'quotation' && (stateType == 'command' || stateType == 'cancel' || stateType == 'sent')">
                                <div class="d-flex justify-content-between">
                                  <div style="width: 100%">
                                      <div class="d-flex justify-content-between" style="">
                                          <span :title="'Nom du client'" style="font-size: 20px">{{client.name}}</span>
                                          <span :title="'Lise de prix'">{{searchPriceList}}</span>
                                      </div>
                                      <div class="d-flex justify-content-between" style="margin-top: 15px">
                                          <span :title="'Adresse du client'">{{client.address}}</span>
                                          <span :title="'Mode de paiement'">{{searchPaymentMode}}</span>
                                      </div>
                                      <div v-if="client.tel" class="d-flex justify-content-between" style="margin-top: 15px">
                                          <span :title="'Numéro de téléphone'">Tel : {{client.tel}}</span>
                                          <span :title="'Date de livraison'">{{date_livraison}}</span>
                                      </div>
                                      <div v-if="client.siret" class="d-flex justify-content-between" style="margin-top: 15px">
                                          <span :title="'Numéro de SIRET'">SIRET : {{client.siret}}</span>
                                      </div>
                                  </div>
                                </div>
                            </div>
                            <div class="fieldset-content" v-if="commandType === 'contract' && (stateType === 'on_finish' || stateType === 'finish' || stateType === 'terminated' || stateType === 'order')">
                                <div class="d-flex justify-content-between">
                                  <div style="width: 100%">
                                      <div class="d-flex justify-content-between" style="">
                                          <span :title="'Nom du client'" style="font-size: 20px">{{contract_name}} ({{client.name}})</span>
                                          <span :title="'Lise de prix'">{{searchPriceList}}</span>
                                      </div>
                                      <div class="d-flex justify-content-between" style="margin-top: 15px">
                                          <span :title="'Adresse du client'">{{client.address}}</span>
                                          <span :title="'Mode de paiement'">{{searchPaymentMode}}</span>
                                      </div>
                                      <div class="d-flex justify-content-between" style="margin-top: 15px">
                                          <span :title="'Numéro de téléphone'">Tel : {{client.tel}}</span>
                                          <span :title="'Date de début'">{{date_start}}</span>
                                      </div>
                                      <div v-if="client.siret" class="d-flex justify-content-between" style="margin-top: 15px">
                                          <span :title="'Numéro de SIRET'">SIRET : {{client.siret}}</span>
                                          <span :title="'Prochaine facturation'">{{date_invoice}}</span>
                                      </div>
                                  </div>
                                </div>
                            </div>
                            <div class="fieldset-content" v-if="canEdit">
                              <div v-if="client && client.id" class="d-flex justify-content-between">
                                <div style="width: 100%" v-if="commandType === 'quotation'">
                                  <div class="d-flex justify-content-between" style="">
                                      <input :title="'Nom du client'" v-model="client.name" type="text" class="form-control" style="font-size:20px; pointer: cursor; background-color: transparent; height:100%; flex-basis: 50%;" placeholder="Nom du Client">
                                      <div class="" style="flex-basis: 50%;">
                                        <div data-v-65e9c1a5="" class="autocomplete control">
                                          <div class="control has-icons-right is-clearfix" style="display: flex;">
                                            <input :title="'Liste de prix'" @blur="hideMenuPriceList" @focus="showMenuPriceList = true" v-model="searchPriceList" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Liste de prix">
                                            <a class="input-group-append">
                                              <span class="input-group-text">
                                                <i class="material-symbols-outlined" @click="updatePriceByPriceList()">sync</i>
                                              </span>
                                            </a>
                                            <div class="dropdown-menu" :style="showMenuPriceList == true ? '' : 'display: none'">
                                              <div class="dropdown-content" :style="showMenuPriceList == true ? '' : 'display: none'">
                                                <a class="dropdown-item" v-for="p in get_price_lists" :key="p.id" @click="selectPriceList(p)">
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
                                  <div class="d-flex justify-content-between" style="margin-top: 15px">
                                      <input :title="'Adresse du client'" v-model="client.address" type="text" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="Adresse">
                                      <div class="" style="flex-basis: 50%;">
                                        <div data-v-65e9c1a5="" class="autocomplete control">
                                          <div class="control has-icons-right is-clearfix">
                                            <input :title="'Mode de paiement'" @blur="hideMenuPayment" @focus="showMenuPaymentMode = true" v-model="searchPaymentMode" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Mode de paiement">
                                            <div class="dropdown-menu" :style="showMenuPaymentMode == true ? '' : 'display: none'">
                                              <div class="dropdown-content" :style="showMenuPaymentMode == true ? '' : 'display: none'">
                                                <a class="dropdown-item" v-for="p in get_payment_modes" :key="p.id" @click="selectPaymentMode(p)">
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
                                  <div class="d-flex justify-content-between" style="margin-top: 15px">
                                      <input :title="'Numéro de téléphone'" v-model="client.tel" type="tel" pattern="^\+[1-9]{1}[0-9]{3,14}$" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="Téléphone">
                                      <input :title="'Date de livraison'" v-model="date_livraison" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Date de livraison">
                                  </div>
                                  <div class="d-flex justify-content-between" style="margin-top: 15px">
                                      <input :title="'Numéro de SIRET'" v-model="client.siret" type="text" pattern="^\d{14}$" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="SIRET">
                                      <!--<span style="text-align-last: right; width: 100%; padding: 6px 12px;"><i @click="returnToClientSelect" class="fa fa-undo-alt"></i></span>-->
                                  </div>
                                  <!--
                                  <div class="d-flex justify-content-between">
                                      <span>Liste de prix</span>
                                      <span>{{client.pricelist}}</span>
                                      <input v-model="client.name" type="text" class="form-control" style="background-color: transparent;" placeholder="1">
                                      <input v-model="payment_mode" type="text" class="form-control" style="background-color: transparent;" placeholder="1">
                                  </div>
                                  -->
                                </div>

                                <div style="width: 100%" v-if="commandType === 'contract'">
                                  <div class="d-flex justify-content-between" style="">
                                      <input :title="'Nom du client'" v-model="client.name" type="text" class="form-control" style="font-size:20px; pointer: cursor; background-color: transparent; height:100%; flex-basis: 50%;" placeholder="Nom du Client">
                                      <div class="" style="flex-basis: 50%;">
                                        <div data-v-65e9c1a5="" class="autocomplete control">
                                          <div class="control has-icons-right is-clearfix">
                                            <input :title="'Liste de prix'" @blur="hideMenuPriceList" @focus="showMenuPriceList = true" v-model="searchPriceList" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Liste de prix">
                                            <div class="dropdown-menu" :style="showMenuPriceList == true ? '' : 'display: none'">
                                              <div class="dropdown-content" :style="showMenuPriceList == true ? '' : 'display: none'">
                                                <a class="dropdown-item" v-for="p in get_price_lists" :key="p.id" @click="selectPriceList(p)">
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
                                  <div class="d-flex justify-content-between" style="margin-top: 15px">
                                      <input :title="'Adresse du client'" v-model="client.address" type="text" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="Adresse">
                                      <div class="" style="flex-basis: 50%;">
                                        <div data-v-65e9c1a5="" class="autocomplete control">
                                          <div class="control has-icons-right is-clearfix">
                                            <input :title="'Mode de paiement'" @blur="hideMenuPayment" @focus="showMenuPaymentMode = true" v-model="searchPaymentMode" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Mode de paiement">
                                            <div class="dropdown-menu" :style="showMenuPaymentMode == true ? '' : 'display: none'">
                                              <div class="dropdown-content" :style="showMenuPaymentMode == true ? '' : 'display: none'">
                                                <a class="dropdown-item" v-for="p in get_payment_modes" :key="p.id" @click="selectPaymentMode(p)">
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
                                  <div class="d-flex justify-content-between" style="margin-top: 15px">
                                      <input :title="'Numéro de téléphone'" v-model="client.tel" type="tel" pattern="^\+[1-9]{1}[0-9]{3,14}$" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="Téléphone">
                                      <input :title="'Date de début'" v-model="date_start" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Date de début">
                                  </div>
                                  <div class="d-flex justify-content-between" style="margin-top: 15px">
                                      <input :title="'Numéro de SIRET'" v-model="client.siret" type="text" pattern="^\d{14}$" class="form-control" style="pointer: cursor; background-color: transparent;" placeholder="SIRET">
                                      <input :title="'Prochaine facturation'" v-model="date_invoice" type="text" class="form-control" style="pointer: cursor;text-align-last: end; background-color: transparent;" placeholder="Prochaine facturation">
                                  </div>
                                  <!--
                                  <div class="d-flex justify-content-between">
                                      <span>Liste de prix</span>
                                      <span>{{client.pricelist}}</span>
                                      <input v-model="client.name" type="text" class="form-control" style="background-color: transparent;" placeholder="1">
                                      <input v-model="payment_mode" type="text" class="form-control" style="background-color: transparent;" placeholder="1">
                                  </div>
                                  -->
                                </div>
                              </div>
                              <div v-else style="margin-top: 5%;">
                                  <div style="width: 100%">
                                    <div class="field" style="">
                                      <div data-v-65e9c1a5="" class="autocomplete control">
                                        <div class="control has-icons-right is-clearfix">
                                          <input @keypress.enter="getSiretData(searchclient)" v-model="searchclient" type="text" @blur="hideMenuClient" @focus="showMenuClient = true" class="input" style="background-color: transparent;" placeholder="Recherche du client">
                                          <div class="dropdown-menu" :style="showMenuClient ? '' : 'display: none'">
                                            <div class="dropdown-content" :style="showMenuClient == true ? '' : 'display: none'">
                                              <a class="dropdown-item" v-for="c in get_clients" :key="c.id" @click="selectClient(c)">
                                                <span v-if="c.name">
                                                  {{c.name}}
                                                </span>
                                                <span v-else>
                                                  {{i.common_name}}
                                                </span>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="" style="text-align-last: center; margin-top: 20px;">
                                    <a @click="getSiretData(searchclient)" class="button is-admin-white">Nouveau client ?</a>
                                    <a @click="meClient()" class="button is-admin-white">Je suis le client</a>
                                    </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="column is-two-fifths-desktop" style="">
                      <div class="fieldset" style="height: 230px; display: flex; flex-direction: column;">
                          <label>
                              Montant
                          </label>
                          <div class="fieldset-content">
                            <div class="ribbon ribbon-top-right o_widget">
                                <span :class="getStateClass()">
                                    {{getState}}
                                </span>
                            </div>
                            <div class="d-flex flex-column" style="height: 150px;">
                              <div class="box-content">
                                <div class="d-flex justify-content-between" style="">
                                  <span v-show="commandType === 'quotation'">
                                    Total non réccurrent HT
                                  </span>
                                  <span>
                                    Total réccurent HT
                                  </span>
                                </div>
                                <div class="d-flex justify-content-between" style="margin-top: 10px">
                                  <p class="font-bold" style="margin:0;" v-show="commandType === 'quotation'">
                                    <span :title="'Prix total non réccurent'" class="price">{{get_total_non_recurring}}€</span> / <span :title="'Prix total d\'achat non réccurent'" class="gain_price">{{get_total_non_recurring_purchase}}€</span>
                                  </p>
                                  <p class="font-bold" style="margin:0;">
                                    <span :title="'Prix total réccurent'" class="price">{{get_total_recurring}}€</span>/ <span :title="'Prix total d\'achat réccurent'" class="gain_price">{{get_total_recurring_purchase}}€</span>
                                  </p>
                                </div>
                              </div>
                                <!--
                                <span class="text-muted small" style="margin-top: 20px">
                                    *Le total réccurent donne lieu à un contrat qui sera facturer à chaque fin de mois.
                                </span>
                                -->
                              
                              <div class="m-t-sm d-flex justify-content-end" style="margin-top: 70px">
                                <div class="btn-group" v-if="commandType === 'quotation'">
                                  <a :title="'Uploader mes documents'" v-if="stateType == 'devis'" @click="uploadDocs()" class="button is-admin-white"><i style="font-size: 20px" class="fa fa-upload"></i></a>
                                  <a :title="'Télécharger la facture'" v-if="stateType == 'command'" @click="printInvoice(number)" class="button is-admin-white"><i style="font-size: 20px" class="fa fa-file-invoice"></i></a>
                                  <!--
                                  <a :title="'Voir un aperçu'" v-if="stateType == 'devis' || stateType == 'command' || stateType == 'cancel' || stateType == 'sent'" @click="printAll(number)" class="button is-admin-white"><i style="font-size: 20px" class="fa fa-print"></i></a>
                                  -->
                                  <div class="dropdown is-right" :class="{ 'is-active': dropdownIsActive }" @click.stop>
                                    <div class="dropdown-trigger">
                                      <a :title="'Voir un aperçu'" v-if="stateType == 'devis' || stateType == 'command' || stateType == 'cancel' || stateType == 'sent'" class="button is-admin-white" @click="toggleDropdown" v-click-outside="hideDropdown">
                                        <i style="font-size: 20px" class="fa fa-print"></i>
                                      </a>
                                    </div>
                                  <div class="dropdown-menu" id="dropdown-menu4" role="menu" :style="dropdownIsActive == true ? '' : 'display: none'">
                                    <div class="dropdown-content" :style="dropdownIsActive == true ? '' : 'display: none'">
                                      <a v-if="stateType == 'command'" @click="printInvoice(number)" class="dropdown-item">
                                        Télécharger la facture
                                      </a>
                                      <a v-if="stateType == 'devis' || stateType == 'command' || stateType == 'cancel' || stateType == 'sent'" @click="printAll(number)" class="dropdown-item">
                                        Voir un aperçu
                                      </a>
                                      <a v-if="stateType == 'devis' || stateType == 'command' || stateType == 'cancel' || stateType == 'sent'" @click="printPackage(number)" class="dropdown-item">
                                        Exemplaire mandat de portabilité
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                  <a :title="'Annuler la commande'" v-if="stateType == 'command'" @click="cancelCommand()" class="button is-admin-primary">Annuler</a>
                                  <a :title="'Enregistrer mon devis'" v-if="stateType == 'devis'" @click="saveDevis()" class="button is-admin-white">Enregistrer</a>
                                  <!--
                                  <a :title="'Mettre à jour la liste des prix'" v-if="stateType == 'brouillon' || stateType == 'devis'" @click="updatePriceByPriceList()" class="button is-admin-secondary">Mettre à jour ma liste de prix</a>
                                  -->
                                  <a :title="'Créer mon devis'" v-if="stateType == 'brouillon'" @click="createDevis()" :disabled="!items || items.length <= 0" class="button is-admin-secondary">Créer le devis</a>
                                  <a :title="'Valider mon devis pour passer commande'" v-if="stateType == 'devis'" @click="askToCommand()" class="button is-admin-secondary">Passer en commande</a>
                                  <!--
                                  <a v-if="stateType == 'cancel'" @click="cancelToDevis()" class="button is-admin-secondary">Remettre en devis</a>
                                  <a v-if="stateType == 'command'" @click="cancelCommand()" class="button is-admin-primary">Annuler</a>
                                  -->
                                </div>
                                <div class="btn-group" v-if="commandType === 'contract'">
                                  <!--
                                  <a :title="'Télécharger la dernière facture'" v-if="stateType == 'command'" @click="printInvoiceContract(number)" class="button is-admin-white"><i style="font-size: 20px" class="fa fa-file-invoice"></i></a>
                                  -->
                                  <a :title="'Voir un aperçu'" v-if="stateType != 'quotation'" @click="printAllContract(number)" class="button is-admin-white"><i style="font-size: 20px" class="fa fa-print"></i></a>
                                  <a :title="'Retour à mon shop'" @click="goToCommand()" class="button is-admin-primary">Annuler</a>
                                  <a :title="'Enregistrer mes modifications'" v-if="stateType == 'order'" @click="saveContract()" class="button is-admin-white">Enregistrer</a>
                                  <!--
                                  <a :title="'Créer mon contrat'" v-if="stateType == 'brouillon'" @click="createDevis()" :disabled="!items || items.length <= 0" class="button is-admin-secondary">Créer le devis</a>
                                  <a :title="'Valider mon contrat pour passer commande'" v-if="stateType == 'devis'" @click="askToCommand()" class="button is-admin-secondary">Passer en commande</a>
                                  <a v-if="stateType == 'cancel'" @click="cancelToDevis()" class="button is-admin-secondary">Remettre en devis</a>
                                  <a v-if="stateType == 'command'" @click="cancelCommand()" class="button is-admin-primary">Annuler</a>
                                  -->
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>

                    

                <div class="container is-max-widescreen">
                    <div class="columns mt-3">
                      <div class="column">
                      <div class="fieldset" style="padding: 20px 20px">
                      <label>
                      Articles dans votre panier
                      </label>
                      <section>
                        <div class="fieldset-content">
                          <div class="columns mb-0 align-items-center" style="margin: 0">
                            <div class="column" style="padding: 0rem; margin-left: 1%">
                              <div data-v-65729484="" class="column">
                                <span :class="{ 'green-text': !ordersCheck }" class="bold-text">Prix d'achat affiché</span>
                                <label data-v-65729484="" class="switch pl-3 is-rounded">
                                  <input type="checkbox" true-value="true" v-model="ordersCheck" value="false" @click="ordersCheckbox($event)">
                                    <span class="check"></span>
                                    <span class="control-label"></span>
                                </label>
                                  <span :class="{ 'green-text': ordersCheck }" class="bold-text">Prix de vente uniquement</span>
                              </div>
                            </div>
                            <div :style="isArticle ? 'opacity:0.4; pointer-events: none;' : ''" class="control pills-v2" style="margin-right: 0.5rem">
                              <label class="b-radio radio button" >
                                Opérateur
                              <input type="radio" value="date" @click="toggleCategory('Opérateur')">
                              </label>
                            </div>
                            <div :style="isArticle ? 'opacity:0.4; pointer-events: none;' : ''" class="control pills-v2" style="margin-right: 0.5rem">
                              <label class="b-radio radio button" >
                                IPBX
                              <input type="radio" value="state" @click="toggleCategory('IPBX')">
                              </label>
                            </div>
                            <div :style="isArticle ? 'opacity:0.4; pointer-events: none;' : ''" class="control pills-v2" style="margin-right: 0.5rem">
                              <label class="b-radio radio button" >
                              Support
                              <input type="radio" value="state" @click="toggleCategory('Support')">
                              </label>
                            </div>

                            <div class="fieldset-content" :style="client && client.id ? '' : 'pointer-events: none; cursor: pointer; opacity: 0.4;'">
                              <div class="field mb-0" style="min-width: 300px">
                                <TagInput
                                  :modelValue="search_badges">
                                </TagInput>
                              </div>
                            </div>

                          </div>
                          <div class="columns" style="margin: 0; margin-top: 20px">
                            <div class="column services-card" style="padding-top: inherit;">
                              <div class="fieldset-content active" style="overflow-y: auto; height: 650px; overflow-x: hidden">
                                <div class="collapse-trigger">
                                  <div v-if="get_items.length > 0">
                                    <table class="table shoping-cart-table" style="height: 650px; background-color: transparent; width:98%; margin-left: 0.25rem;">
                                      <tbody>
                                        <transition-group name="item-fade" appear tag="tbody" @after-leave="removeItemAfterAnimation">
                                        <tr v-for="(item, index) of get_items" :key="item.id" class="centered-row article-card" style="margin-bottom: 10px" v-if="!item.toBeRemoved">
                                          <td class="centered-row" width="150" style="width: 10%;">
                                            <img v-if="item.image" :src="'data:image/png;base64,' + item.image" alt="Product Image" style="width: 100%; max-width: 75px; max-height: 75px;">
                                            <a v-else><i class="material-symbols-outlined size-xl">no_photography</i></a>
                                          </td>
                                          <td>
                                              <a :title="item.description" class="btn btn-xs btn-outline">
                                                <i style="font-size: 16px;color:#1ab394" class="fa fa-info-circle"></i>
                                              </a>
                                          </td>
                                          <td class="desc" style="width: 40%;">
                                            <h4 style="margin: 0">
                                              {{ item.name }}
                                              <p style="display: flex;">
                                              <span style="font-size: 12px">({{item.reference}})</span>
                                              </p>
                                            </h4>
                                            <div style="margin-top: 5px;" v-if="item.type === 'did'">
                                              <a href="#" class="" style="font-size: 10px;" :style="getInfoStyle(item)" @click="CreateItem(item)">
                                                Informations complémentaires... <i :class="arrowIcon(item)"></i>
                                              </a>
                                            </div>
                                            <div style="margin-top: 5px;" v-else>
                                              <a href="#" class="" style="font-size: 10px; color: rgb(26, 179, 148);" @click="CreateItem(item)">
                                                Informations complémentaires... <i class="fa fa-exclamation-circle"></i>
                                              </a>
                                            </div>
                                            <div v-if="parseFloat(item.quantity) > 0" class="characteristics-inputs" v-show="showCharacteristics[item.id] && item.infos">
                                              <div v-for="(i, index) in item.infos" :key="index" class="mt-2">
                                                <input type="text" v-model="i.sda_number" class="form-control" style="background-color: transparent; width: 70%" :placeholder="'Numéro SDA'" :disabled="!canEdit">
                                              </div>
                                            </div>
                                          </td>
                                          <td :title="'Prix d\'achat'" class="centered-row" style="width: 10%;" :style="ordersCheck ? 'visibility: hidden' : ''">
                                            {{ (item.purchase_price + '€') }}
                                          </td>
                                          <td :title="'Quantité'" class="centered-row" style="width: auto">
                                              <input @input="updateInfos(item)" v-model="item.quantity" type="text" class="form-control" style="background-color: transparent;" placeholder="Qté" :disabled="!canEdit">
                                          </td>
                                          <td class="centered-row" style="">
                                              <span>x</span>
                                          </td>
                                          <td :title="'Prix de vente'" class="centered-row" style="width: auto;">
                                              <input @input="updateInfos(item)" v-model="item.price" class="form-control" style="background-color: transparent;" placeholder="Prix" :disabled="!canEdit">€
                                          </td>
                                          <td class="centered-row" style="width: 5%;" :style="!canEdit ? 'opacity: 0.4;' : ''">
                                              <a @click="canEdit ? deleteItem(item) : null" @mouseover="hoveredIndex = index" @mouseout="hoveredIndex = null">
                                                  <i :class="hoveredIndex === index ? 'fa fa-trash' : 'fa fa-trash'" style="color: #ff4d4d"></i>
                                              </a>
                                          </td>
                                        </tr>
                                        </transition-group>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div v-else style="height: 650px; overflow: hidden; shoping-cart-table">
                                    <div class="has-text-centered" style="opacity: 0.4; padding: 30px; margin-top: 25%">
                                        <i class="material-symbols-outlined size-giga">add_shopping_cart</i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="fieldset" style="flex-basis: 33%">
                                <label>
                                Mon catalogue
                                </label>
                                <div class="fieldset-content services-card" style="height: 650px; flex-basis: 33%; padding: 0.25rem;" :style="isArticle ? 'opacity:0.4; pointer-events: none;' : ''">
                                  <div class="box-content" style="height: 640px; overflow-y: auto; padding: 0.5em; margin-top: 10px">
                                    <div style="width: 100%;">
                                      <table class="table shoping-cart-table" style="background-color: transparent; width: -webkit-fill-available; width: 100%;">
                                        <tbody>
                                          <div v-for="(group, category, index) in articles_group" :key="index">
                                            <tr v-if="group.articles.length > 0" class="category-row article-card-sell" @click="toggleCategory(category)" style="display: flex; margin-bottom: 10px">
                                              <td style="flex-basis: 100%">
                                                <span style="font-weight: bold;">
                                                <i :class="['fa', group.expanded ? 'fa-chevron-down' : 'fa-chevron-right']"></i>
                                                {{ category }}                                                        
                                                </span>
                                              </td>
                                            </tr>
                                            <!--
                                            <tr @click="addArticle(artcl, index)" class="article-card-sell" :class="{ 'article-card-sell-enter': slicedIndex === index, 'article-card-sell-leave-to': slicedIndex !== -1 && slicedIndex !== index }" style="display: flex; margin-bottom: 10px" v-for="(artcl, index) in group.articles" :key="category + index.toString()" v-if="group.expanded">
                                            -->
                                            <tr @click="addArticle(artcl, index)" class="article-card-sell" style="display: flex; margin-bottom: 10px" v-for="(artcl, index) in group.articles" :key="category + index.toString()" v-if="group.expanded">
                                              <td style="flex-basis: 5%; margin-left: 0.5rem;">
                                                <img v-if="artcl.image" :src="'data:image/png;base64,' + artcl.image" alt="Product Image" style="max-width: 25px; max-height: 25px;">
                                                <a v-else><i class="material-symbols-outlined size-l">no_photography</i></a>
                                              </td>
                                              <td style="flex-basis: 60%; text-align: left; overflow-wrap: anywhere;">
                                                {{ artcl.name }}
                                                <p style="display: flex;">
                                                <span style="font-size: 12px;">({{ artcl.reference }})</span>
                                                </p>
                                              </td>
                                              <td style="flex-basis: 20%">
                                                {{ artcl.price }}€
                                              </td>
                                              <td class="text-right" style="flex-basis: 15%">
                                                <div class="btn-group" style="">
                                                  <a :title="artcl.description" class="btn btn-xs btn-outline">
                                                    <i class="material-symbols-outlined size-l" style="color:#1ab394;">info</i>
                                                  </a>
                                                </div>
                                              </td>
                                            </tr>
                                          </div>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                            </div>
                      </div>
                    </div>

                    <ModalCreateItem v-if="isCreateItem" :commandType="commandType" :stateType="stateType" :canEdit="canEdit" :item="itemselected" :client="client" :documentType="commandType" :documentId="number" :contractId="contract_id" :orderId="order_id" :allitems="items" @saveItemInfo="saveInfo" @createItem="getCreateItem" :active="isCreateItem ? true : false"></ModalCreateItem>
                    <CheckAction :emitter="'askToCommand'" :emitterStatus="'isOkToCommandStatus'" @isOkToCommandStatus="devisToCommand" @askToCommand="getOkToCommand" :active="isOkToCommand ? true : false"></CheckAction>
                    <!--SumUp :emitter="'sumUp'" :emitterStatus="'isOkToSumUp'" @isOkToSumUp="devisToCommand" @askToSumUp="getOkToSumUp" :active="isOkToSumUp ? true : false"></SumUp>-->
                    <UploadDocs v-if="number" @uploadDocs="getUploadDocs" :id="order_id" :quotation="number" :active="isUploadDocs ? true : false"></UploadDocs>
                  </section>
                </div>
              </div>
                </div>
              </div>
            </div>
        </div>
    </div>  
</template>

<script>
import TagInput from '../modal/TagInput.vue'
import ModalCreateItem from '../command/CreateItem.vue'
import CheckAction from '../modal/CheckAction.vue'
import UploadDocs from './UploadDocs.vue'
//import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  components: {
    TagInput: TagInput,
    ModalCreateItem,
    CheckAction,
    UploadDocs,
    //vSelect
  },
  name: 'CommandProduct',
  props: {
    tab: Boolean
  },
  data: () => {
    return {
      dropdownIsActive: false,
      isUploadDocs: false,
      ordersCheck: true,
      showMenu: false,
      showCharacteristics: {},
      items: [],
      articles: [],
      grouped_articles: {},
      price_lists: [],
      price_list: null,
      price_list_items: [],
      payment_modes: [],
      payment_mode: null,
      date_livraison: '',
      date_start: '',
      date_invoice: '',
      contract_name: '',
      client: [],
      search_badges: [],
      searchclient: '',
      searchPriceList: '',
      searchPaymentMode: '',
      clients: [],
      number: '',
      order_id: null,
      contract_id: null,
      siretData: null,
      showMenuPriceList: false,
      showMenuPaymentMode: false,
      showMenuClient: false,
      slicedIndex: -1,
      invoices: [],
      isCreateItem: false,
      itemselected: {},
      hoveredIndex: null,
      stateType: '',
      commandType: '',
      isOkToCommand: false,
      isOkToSumUp: false,
      uploadedFiles: null,
    }
  },
  async created () {
    if (this.user.allowed_routes.length <= 0 || !this.user.allowed_routes.includes('orders')) {
      this.$router.push('/products')
    }
    const type = this.$route.query.type
    const spec = this.$route.query.spec
    const header = {
      'Content-Type': 'application/json'
    }
    this.clients = await this.$axios.get(process.env.ODOO_API + 'api/partners?session_id=' + this.user.session_id, { headers: header }).then(response => {
      return response.data.partners
    })
    this.articles = await this.$axios.get(process.env.ODOO_API + 'api/get_product_list?session_id=' + this.user.session_id, { headers: header }).then(response => {
      return response.data.products
    })
    this.regroupArticles(this.$route.query.type)
    this.payment_modes = await this.$axios.get(process.env.ODOO_API + 'api/get_payment_modes?session_id=' + this.user.session_id, { headers: header }).then(response => {
      return response.data.payment_modes
    })
    this.price_lists = await this.$axios.get(process.env.ODOO_API + 'api/get_pricelists?session_id=' + this.user.session_id, { headers: header }).then(response => {
      return response.data.pricelists
    })
    if (type === 'new') {
      this.commandType = 'quotation'
      this.stateType = 'brouillon'
      if (spec === 'trunk') {
        let indx = 0
        for (let prd of this.articles_group['Opérateur']['articles']) {
          if (prd.type === 'trunk') {
            this.addArticle(prd, indx)
          }
          indx += 1
        }
      }
    } else if (type === 'devis') {
      this.number = this.$route.query.number
      this.commandType = 'quotation'
      let params = {
        'order_number': this.number
      }
      let formulaInfo = await this.$axios.get(process.env.ODOO_API + 'api/get_order_info?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data.order
      })
      if (formulaInfo) {
        if (formulaInfo.state === 'draft') {
          this.stateType = 'devis'
        } else if (formulaInfo.state === 'done') {
          this.stateType = 'command'
        } else if (formulaInfo.state === 'sale') {
          this.stateType = 'command'
        } else if (formulaInfo.state === 'sent') {
          this.stateType = 'sent'
        } else if (formulaInfo.state === 'cancel') {
          this.stateType = 'cancel'
        }
        for (let val of formulaInfo.articles) {
          this.items.push({
            line_id: val.line_id,
            id: val.id,
            name: val.name,
            description: val.description,
            more_details: val.more_details,
            oldprice: val.oldprice,
            type: val.type,
            purchase_price: parseFloat(val.purchase_price).toFixed(2),
            price: parseFloat(val.price).toFixed(2),
            quantity: (parseFloat(val.quantity).toFixed(2)).toString(),
            infos: val.infos,
            image: val.image,
            reference: val.reference,
            postal_code: val.postal_code,
            city: val.city,
            insee_code: val.insee_code,
            product_type: val.product_type,
            country: val.country,
            commitment_date: val.commitment_date,
            ipbx_id: val.ipbx_id
          })
        }
        this.client = formulaInfo.client_info
        this.date_livraison = formulaInfo.delivery_date
        if (formulaInfo.payment_mode) {
          for (let pm of this.payment_modes) {
            if (pm.id === formulaInfo.payment_mode) {
              this.selectPaymentMode(pm)
              break
            }
          }
        }
        if (formulaInfo.pricelist) {
          for (let pl of this.price_lists) {
            if (pl.id === formulaInfo.pricelist) {
              this.selectPriceList(pl)
              break
            }
          }
        }
        this.order_id = formulaInfo.id
        this.invoices = formulaInfo.invoices
        this.$forceUpdate()
      }
    } else if (type === 'contract') {
      this.commandType = 'contract'
      this.number = this.$route.query.number
      let params = {
        'number': this.number
      }
      let formulaInfo = await this.$axios.get(process.env.ODOO_API + 'api/get_contract_info?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data.contract
      })
      if (formulaInfo) {
        this.stateType = formulaInfo.state
        for (let val of formulaInfo.lines) {
          this.items.push({
            line_id: val.line_id,
            id: val.id,
            name: val.name,
            description: val.description,
            more_details: val.more_details,
            oldprice: val.oldprice,
            type: val.type,
            purchase_price: val.purchase_price,
            price: val.price,
            quantity: (val.quantity).toString(),
            infos: val.infos,
            image: val.image,
            reference: val.reference,
            postal_code: val.postal_code,
            city: val.city,
            insee_code: val.insee_code,
            product_type: val.product_type,
            country: val.country,
            commitment_date: val.commitment_date,
            ipbx_id: val.ipbx_id
          })
        }
        this.client = formulaInfo.client_info
        this.date_start = formulaInfo.date_start
        this.date_invoice = formulaInfo.recurring_next_date
        this.contract_name = formulaInfo.contract_name
        if (formulaInfo.payment_mode) {
          for (let pm of this.payment_modes) {
            if (pm.id === formulaInfo.payment_mode) {
              this.selectPaymentMode(pm)
              break
            }
          }
        }
        if (formulaInfo.pricelist) {
          for (let pl of this.price_lists) {
            if (pl.id === formulaInfo.pricelist) {
              this.selectPriceList(pl)
              break
            }
          }
        }
        this.contract_id = formulaInfo.id
        this.invoices = formulaInfo.invoices
        this.$forceUpdate()
      }
    }
  },
  mounted () {
    this.$globalState.loader = false
  },
  computed: {
    date_livraison_format: {
      get () {
        const parts = this.date_livraison.split('/')
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      },
      set (value) {
        const parts = value.split('-')
        this.date_livraison = `${parts[2]}/${parts[1]}/${parts[0]}`
      }
    },
    articles_group () {
      let groups = JSON.parse(JSON.stringify(this.grouped_articles))
      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ')
        for (let val in groups) {
          groups[val].articles = groups[val].articles.filter(a => {
            return s.toLowerCase().split(' ').every(v => a.name.toLowerCase().includes(v))
          })
        }
        return groups
      }
      return this.grouped_articles
    },
    /*
    showMenuClient () {
      if (!this.client.id) {
        return true
      } else {
        return false
      }
    },
    showMenuPaymentMode () {
      if (this.searchPaymentMode.length === 0) {
        return true
      } else {
        return false
      }
    },
    */
    isArticle () {
      if (!this.client.id || (this.commandType === 'quotation' && (this.stateType === 'command' || this.stateType === 'cancel' || this.stateType == 'sent')) || (this.commandType === 'contract' && (this.stateType === 'on_finish' || this.stateType === 'finish'))) {
        return true
      } else {
        return false
      }
    },
    user () {
      return this.$store.getters.getUser
    },
    get_payment_modes () {
      let pm = this.payment_modes
      if (this.searchPaymentMode) {
        let text = this.searchPaymentMode
        pm = pm.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return pm
      }
      return pm
    },
    get_price_lists () {
      let pl = this.price_lists
      if (this.searchPriceList) {
        let text = this.searchPriceList
        pl = pl.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v))
        })
        return pl
      }
      return pl
    },
    get_clients () {
      let client = this.clients
      if (this.searchclient) {
        let text = this.searchclient
        client = client.filter(s => {
          return text.toLowerCase().split(' ').every(v => s.name.toLowerCase().includes(v) || (s.siret && s.siret.toLowerCase().includes(v)))
        })
        return client
      }
      return client
    },
    get_total () {
      let price = 0.00
      for (let val of this.get_items) {
        if (parseFloat(val.quantity) > 0) {
          price += parseFloat(val.price) * parseFloat(val.quantity)
        }
      }
      return (price.toFixed(2)).toString()
    },
    get_total_purchase () {
      let price = 0.00
      for (let val of this.get_items) {
        if (parseFloat(val.quantity) > 0) {
          price += parseFloat(val.purchase_price) * parseFloat(val.quantity)
        }
      }
      return (price.toFixed(2)).toString()
    },
    get_total_recurring () {
      let price = 0.00
      for (let val of this.get_items) {
        if (val.type === 'did' || val.type === 'trunk' || val.type === 'kipcloud0' || val.type === 'kipcloud1') {
          if (parseFloat(val.quantity) > 0) {
            price += parseFloat(val.price) * parseFloat(val.quantity)
          }
        }
      }
      return (price.toFixed(2)).toString()
    },
    get_total_recurring_purchase () {
      let price = 0.00
      for (let val of this.get_items) {
        if (val.type === 'did' || val.type === 'trunk' || val.type === 'kipcloud0' || val.type === 'kipcloud1') {
          if (parseFloat(val.quantity) > 0) {
            price += parseFloat(val.purchase_price) * parseFloat(val.quantity)
          }
        }
      }
      return (price.toFixed(2)).toString()
    },
    get_total_non_recurring () {
      let price = 0.00
      for (let val of this.get_items) {
        if (val.type !== 'did' && val.type !== 'trunk' && val.type !== 'kipcloud0' && val.type !== 'kipcloud1') {
          if (parseFloat(val.quantity) > 0) {
            price += parseFloat(val.price) * parseFloat(val.quantity)
          }
        }
      }
      return (price.toFixed(2)).toString()
    },
    get_total_non_recurring_purchase () {
      let price = 0.00
      for (let val of this.get_items) {
        if (val.type !== 'did' && val.type !== 'trunk' && val.type !== 'kipcloud0' && val.type !== 'kipcloud1') {
          if (parseFloat(val.quantity) > 0) {
            price += parseFloat(val.purchase_price) * parseFloat(val.quantity)
          }
        }
      }
      return (price.toFixed(2)).toString()
    },
    get_articles () {
      let articles = this.articles
      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ')
        articles = articles.filter(a => {
          return s.toLowerCase().split(' ').every(v => a.name.toLowerCase().includes(v))
        })
      }
      return articles
    },
    get_items () {
      let items = this.items
      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ')
        items = items.filter(a => {
          return s.toLowerCase().split(' ').every(v => a.name.toLowerCase().includes(v))
        })
      }
      return items
    },
    canEdit () {
      return (this.commandType === 'quotation' && (this.stateType === 'devis' || this.stateType === 'brouillon')) 
        || (this.commandType === 'contract' && (this.stateType === 'quotation'))
    },
    getState () {
      if (this.commandType === 'quotation') {
        if (this.stateType === 'brouillon') {
          return 'Brouillon'
        } else if (this.stateType === 'devis') {
          return 'Devis'
        } else if (this.stateType === 'command') {
          return 'Commande'
        } else if (this.stateType === 'cancel') {
          return 'Annulé'
        } else if (this.stateType === 'sent') {
          return 'Envoyé'
        }
      } else if (this.commandType === 'contract') {
        if (this.stateType === 'order') {
          return 'Commande'
        } else if (this.stateType === 'quotation') {
          return 'Devis'
        } else if (this.stateType === 'production') {
          return 'En cours de production'
        } else if (this.stateType === 'terminated') {
          return 'Produit'
        } else if (this.stateType === 'on_finish') {
          return 'En cours de résiliation'
        } else if (this.stateType === 'finish') {
          return 'Résilié'
        }
      }
      return ''
    }
  },
  methods: {
    getStateClass () {
      if (this.commandType === 'quotation') {
        if (this.stateType === 'brouillon') {
          return 'badge-gray'
        } else if (this.stateType === 'devis') {
          return 'badge-info'
        } else if (this.stateType === 'command') {
          return 'badge-success'
        } else if (this.stateType === 'cancel') {
          return 'badge-danger'
        } else if (this.stateType === 'sent') {
          return 'badge-info'
        }
      } else if (this.commandType === 'contract') {
        if (this.stateType === 'order') {
          return 'badge-success'
        } else if (this.stateType === 'quotation') {
          return 'badge-info'
        } else if (this.stateType === 'production') {
          return 'badge-warning ribbon-small'
        } else if (this.stateType === 'terminated') {
          return 'badge-primary'
        } else if (this.stateType === 'on_finish') {
          return 'badge-gray ribbon-small'
        } else if (this.stateType === 'finish') {
          return 'badge-gray'
        }
      }
    },
    hideDropdown() {
      this.dropdownIsActive = false;
    },
    toggleDropdown() {
      this.dropdownIsActive = !this.dropdownIsActive;
    },
    ordersCheckbox (e) {
      this.ordersCheck = e.target.checked
    },
    regroupArticles (type) {
      let grouped = {}
      for (let artcl of this.articles) {
        if (!grouped[artcl.category]) {
          grouped[artcl.category] = { expanded: false, articles: [] }
        }
        if (type === 'contract' && artcl.category !== 'Support' && artcl.recurring_invoice) {
          grouped[artcl.category].articles.push(artcl)
        } else if (type !== 'contract' && artcl.category !== 'Support') {
          grouped[artcl.category].articles.push(artcl)
        }
      }
      this.grouped_articles = grouped
    },
    async fetchAndUpdatePrices (pricelistId) {
      try {
        const header = {
          'Content-Type': 'application/json'
        }
        const response = await this.$axios.get(process.env.ODOO_API + 'api/get_product_list', {
          params: { pricelist_id: pricelistId, session_id: this.user.session_id },
          headers: header
        })

        if (response.data && response.data.products) {
          for (const updatedProduct of response.data.products) {
            const articleIndex = this.articles.findIndex(a => a.id === updatedProduct.id)
            if (articleIndex !== -1) {
              //this.$set(this.articles, articleIndex, { ...this.articles[articleIndex], price: updatedProduct.price })
              this.articles[articleIndex] = { ...this.articles[articleIndex], price: updatedProduct.price }
            }
          }
          this.regroupArticles(this.$route.query.type)
        }
      } catch (error) {
        console.error('Error fetching updated prices:', error)
      }
    },
    updatePriceByPriceList () {
      if (this.price_list) {
        this.items.forEach(item => {
          const matchingArticle = this.articles.find(article => article.id === item.id)
          if (matchingArticle) {
            item.price = matchingArticle.price
          }
        })
        this.$toastr.Add({
          name: 'SuccesData',
          title: 'Mise à jour des prix des articles',
          msg: 'Votre liste de prix a été appliquée',
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
    hideMenuClient () {
      setTimeout(() => {
        this.showMenuClient = false
      }, 250)
    },
    hideMenuPayment () {
      setTimeout(() => {
        this.showMenuPaymentMode = false
      }, 250)
    },
    hideMenuPriceList () {
      setTimeout(() => {
        this.showMenuPriceList = false
      }, 250)
    },
    getInfoStyle (item) {
      const sdaCount = item.infos.reduce((count, info) => {
        if (info.name === 'SDA' && info.value.length === 10 && (/^\d+$/.test(info.value) || info.value === 'XXXXXXXXXX')) {
          return count + 1
        }
        return count
      }, 0)
      if (sdaCount.toString() == parseInt(item.quantity)) {
        return 'color: rgb(26, 179, 148);'
      } else {
        return 'color: #ff4d4d;'
      }
    },
    arrowIcon (item) {
      const sdaCount = item.infos.reduce((count, info) => {
        if (info.name === 'SDA' && info.value.length === 10 && /^\d+$/.test(info.value)) {
          return count + 1
        }
        return count
      }, 0)
      if (sdaCount.toString() === item.quantity) {
        return 'fa fa-exclamation-circle'
      } else {
        return 'fa fa-check-circle'
      }
    },
    getCreateItem (value) {
      this.isCreateItem = value
    },
    saveInfo (item) {
      this.items = item
    },
    CreateItem (item) {
      this.isCreateItem = true
      this.itemselected = item
      console.log(this.itemselected)
    },
    updateInfos (item) {
      for (let i of this.items) {
        if (i.id === item.id) {
          if (item.quantity.length < 0 || parseFloat(item.quantity) <= 0) {
            i.quantity = '1.00'
          }
          if (['did', 'kipcloud1'].includes(i.type)) {
            const quantity = parseFloat(i.quantity)
            if (quantity > i.infos.length) {
              const additionalInfosCount = quantity - i.infos.length
              const sdaNumber = {
                name: 'SDA',
                value: ''
              }
              for (let j = 0; j < additionalInfosCount; j++) {
                i.infos.push({ ...sdaNumber })
              }
            } else if (quantity < i.infos.length) {
              i.infos.splice(quantity)
            }
          }
          this.$forceUpdate()
          break
        }
      }
    },
    checkQuantity (item) {
      for (let i of this.items) {
        if (i.id === item.id) {
          if (item.quantity.length <= 0 || parseFloat(item.quantity) <= 0) {
            i.quantity = '1.00'
          }
          this.$forceUpdate()
          break
        }
      }
    },
    checkPrice (item) {
      for (let i of this.items) {
        if (i.id === item.id) {
          if (item.price.length <= 0 || parseFloat(item.price) <= 0) {
            const article = this.articles.find(article => article.id === item.id)
            item.price = article.price
          }
          this.$forceUpdate()
          break
        }
      }
    },
    getType (value) {
      if (value === 'ipbx_hw') {
        return 'IPBX'
      } else if (value === 'kipcloud0') {
        return 'Opérateur'
      } else if (value === 'kipcloud1') {
        return 'Opérateur'
      } else if (value === 'did') {
        return 'Opérateur'
      } else if (value === 'trunk') {
        return 'Opérateur'
      } else if (value === 'support') {
        return 'Service'
      }
    },
    toggleCategory (category) {
      this.articles_group[category].expanded = !this.articles_group[category].expanded
      for (let ac in this.articles_group) {
        if (ac !== category) {
          this.articles_group[ac].expanded = false
        }
      }
      this.$forceUpdate()
    },
    async getSiretData (name) {
      const cleanedSiret = name.replace(/\D/g, '')
      this.searchclient = cleanedSiret
      if (name.length === 14 && /^\d+$/.test(name)) {
        await this.$axios.get('https://data.opendatasoft.com/api//records/1.0/search/', {
          params: {
            dataset: 'economicref-france-sirene-v3@public',
            q: `siret:${name}`,
            rows: 1
          }
        }).then(response => {
          const resJson = response.data
          if (resJson.records && resJson.records.length > 0) {
            const rawRecord = resJson.records[0].fields

            this.siretData = {
              name: rawRecord.denominationunitelegale || rawRecord.l1_adressage_unitelegale,
              siren: rawRecord.siren,
              nic: rawRecord.siret,
              siret: rawRecord.siret,
              tel: '',
              street: rawRecord.adresseetablissement,
              departement: rawRecord.departementetablissement,
              zip: rawRecord.codepostaletablissement,
              region: rawRecord.regionetablissement,
              commune: rawRecord.libellecommuneetablissement
              // Add other fields you want to extract from the response
            }
          } else {
            this.siretData = null
          }
        }).catch(error => {
          console.log(error)
          this.siretData = null
        })
      }
      if (this.siretData) {
        this.$toastr.Add({
          name: 'SuccesData',
          title: 'Client trouvé',
          msg: 'Le client ' + this.siretData.name + ' a été rattaché au devis',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'success',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          'siret_data': [this.siretData]
        }
        let newclient = await this.$axios.post(process.env.ODOO_API + 'api/create_client?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result
        })
        this.selectClient(newclient)
      } else {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Client introuvable',
          msg: 'Veuillez vérifier le siret du client',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
        this.siretData = null
      }
    },
    uploadDocs() {
      this.isUploadDocs = true
    },
    getUploadDocs (value) {
      this.isUploadDocs = value
    },
    async printInvoice (name) {
      this.$globalState.loader = true
      if (this.invoices.length > 0) {
        for (let val of this.invoices) {
          const params = new FormData()
          params.append('data', JSON.stringify(['/report/pdf/account.report_invoice_with_payments/' + val.toString(), 'qweb-pdf']))
          params.append('token', 'dummy-because-api-expects-one')
          params.append('csrf_token', this.user.csrf_token)
          let xhr = new XMLHttpRequest()
          xhr.open('POST', process.env.ODOO_API + 'report/download?session_id=' + this.user.session_id, true)
          xhr.responseType = 'arraybuffer'
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                this.downloadStatus = 200
                let blob = new Blob([xhr.response], { type: 'application/pdf' })
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.setAttribute('download', 'Facture.pdf')
                link.target = '_blank'
                link.click()
              }
              this.$globalState.loader = false
              this.dropdownIsActive = false
            }
          }
          xhr.send(params)
        }
      } else {
        this.$globalState.loader = false
      }
    },
    async printAllContract (name) {
      this.$globalState.loader = true
      const params = new FormData()
      params.append('data', JSON.stringify(['/report/pdf/contract.report_contract_document/' + this.contract_id.toString(), 'qweb-pdf']))
      params.append('token', 'dummy-because-api-expects-one')
      params.append('csrf_token', this.user.csrf_token)
      let xhr = new XMLHttpRequest()
      xhr.open('POST', process.env.ODOO_API + 'report/download?session_id=' + this.user.session_id, true)
      xhr.responseType = 'arraybuffer'
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            this.downloadStatus = 200
            let blob = new Blob([xhr.response], { type: 'application/pdf' })
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.setAttribute('download', name + '.pdf')
            link.target = '_blank'
            link.click()
          }
          this.$globalState.loader = false
          this.dropdownIsActive = false
        }
      }
      xhr.send(params)
    },
    async printAll(name) {
      this.$globalState.loader = true;

      const params = new FormData();
      params.append('data', JSON.stringify(['/report/pdf/sale.report_saleorder/' + this.order_id.toString(), 'qweb-pdf']));
      params.append('token', 'dummy-because-api-expects-one');
      params.append('csrf_token', this.user.csrf_token);

      let xhr = new XMLHttpRequest();
      xhr.open('POST', process.env.ODOO_API + 'report/download?session_id=' + this.user.session_id, true);
      xhr.responseType = 'arraybuffer';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            this.downloadStatus = 200;
            let blob = new Blob([xhr.response], { type: 'application/pdf' });
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', name + '.pdf');
            link.target = '_blank';
            link.click();
          }

          // Set loader to false after the request completes
          this.$globalState.loader = false;
          this.dropdownIsActive = false;
        }
      };

      xhr.send(params);
    },
    async createDevis () {
      if (!this.items || this.items.length <= 0) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Impossible de créer votre devis',
          msg: 'Veuillez ajouter des articles dans votre panier',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        })
      } else if (!this.date_livraison || !this.price_list || !this.payment_mode) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Informations manquantes',
          msg: 'Veuillez remplir la date de livraison, la liste de prix et le mode de paiement',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
      } else {
        /*
        for (const item of this.items) {
          if (item.infos && item.infos.length > 0) {
            for (const info of item.infos) {
              if (info.name === 'SDA' && (!info.value || (info.value).length < 10)) {
                this.$toastr.Add({
                  name: 'ErrorData',
                  title: 'Informations manquantes',
                  msg: 'Veuillez vérifier les informations complémentaires',
                  clickClose: true,
                  timeout: 3000,
                  progressBarValue: 0,
                  position: 'toast-top-right',
                  type: 'error',
                  preventDuplicates: true,
                  classNames: ['animated', 'slideInRight'],
                  style: { 'margin-top': '20%' }
                })
                return
              }
            }
          }
        }
        */
        this.$globalState.loader = true
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          'articles': this.items,
          'client_id': this.client.id,
          'delivery_date': this.date_livraison,
          'other_params': {
            'payment_mode': this.payment_mode,
            'pricelist_id': this.price_list
          }
        }
        let createdevis = await this.$axios.post(process.env.ODOO_API + 'api/create_quotation?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data
        })
        this.$router.push('/products/command?type=devis&number=' + createdevis.result.number)
        .then(() => {
          window.location.reload()
          this.$globalState.loader = false
        })
        .catch(error => {
          console.error("Error navigating to the new route:", error);
          this.$globalState.loader = false;
        });
      }
    },
    async saveDevis () {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'quotation_name': this.number,
        'articles': this.items,
        'delivery_date': this.date_livraison,
        'other_params': {
          'payment_mode': this.payment_mode,
          'pricelist_id': this.price_list
        }
      }
      let savedevis = await this.$axios.post(process.env.ODOO_API + 'api/update_quotation?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data
      })
      this.$globalState.loader = true
      setTimeout(() => {
        this.$router.push('/products/command?type=devis&number=' + savedevis.result.number)
        this.$nextTick(() => {
          window.location.reload()
          this.$globalState.loader = false
        })
      }, 1000)
    },
    async saveContract () {
      for (const item of this.items) {
        if (item.infos && item.infos.length > 0) {
          for (const info of item.infos) {
            if (info.name === 'SDA' && (!info.value || (info.value).length < 10)) {
              this.$toastr.Add({
                name: 'ErrorData',
                title: 'Informations manquantes',
                msg: 'Veuillez vérifier les informations complémentaires',
                clickClose: true,
                timeout: 3000,
                progressBarValue: 0,
                position: 'toast-top-right',
                type: 'error',
                preventDuplicates: true,
                classNames: ['animated', 'slideInRight'],
                style: { 'margin-top': '20%' }
              })
              return
            }
          }
        }
      }
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'contract_number': this.number,
        'contract_lines': this.items,
        'other_params': {
          'payment_mode': this.payment_mode,
          'pricelist_id': this.price_list
        }
      }
      await this.$axios.post(process.env.ODOO_API + 'api/update_contract?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data
      })
    },
    getOkToCommand (value) {
      this.isOkToCommand = value
    },
    askToCommand () {
      this.isOkToCommand = true
    },
    getOkToSumUp (value) {
      this.isOkToSumUp = value
    },
    askToSumUp () {
      this.isOkToSumUp = true
    },
    async devisToCommand (value) {
      this.$globalState.loader = true
      if (value) {
        for (const item of this.items) {
          if (item.infos && item.infos.length > 0) {
            for (const info of item.infos) {
              if (info.name === 'SDA' && (!info.value || (info.value).length < 10)) {
                this.$toastr.Add({
                  name: 'ErrorData',
                  title: 'Informations manquantes',
                  msg: 'Veuillez vérifier les informations complémentaires',
                  clickClose: true,
                  timeout: 3000,
                  progressBarValue: 0,
                  position: 'toast-top-right',
                  type: 'error',
                  preventDuplicates: true,
                  classNames: ['animated', 'slideInRight'],
                  style: { 'margin-top': '20%' }
                })
                this.$globalState.loader = false
                return
              }
              if (info.name === 'SDA' && info.value !== 'XXXXXXXXXX') {
                const hasMandatFile = await this.checkMandatFile();
                if (!hasMandatFile) {
                  this.$toastr.Add({
                    name: 'ErrorMandatFile',
                    title: 'Mandat de portabilité manquant',
                    msg: 'Veuillez télécharger le mandat de portabilité.',
                    clickClose: true,
                    timeout: 3000,
                    progressBarValue: 0,
                    position: 'toast-top-right',
                    type: 'error',
                    preventDuplicates: true,
                    classNames: ['animated', 'slideInRight'],
                    style: { 'margin-top': '20%' }
                  })
                  this.$globalState.loader = false;
                  return;
                }
              }
            }
          }
        }
        const header = {
          'Content-Type': 'application/json'
        }
        let params = {
          'quotation_name': this.number,
          'articles': this.items,
          'delivery_date': this.date_livraison,
          'other_params': {
            'payment_mode': this.payment_mode,
            'pricelist_id': this.price_list
          }
        }
        await this.$axios.post(process.env.ODOO_API + 'api/update_quotation?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data
        })
        params = {
          'order_number': this.number,
          'status': 'command'
        }
        await this.$axios.post(process.env.ODOO_API + 'api/change_quotation_status?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data
        })
        setTimeout(() => {
          this.$router.push('/products/command?type=devis&number=' + this.number)
          this.$nextTick(() => {
            window.location.reload()
            this.$globalState.loader = false
          })
        }, 1000)
      }
      this.isOkToCommand = false
      this.$globalState.loader = false
    },
    async checkMandatFile() {
      await this.fetchUploadedFiles();
      const mandatFileName = 'mandat';
      const lowerCaseMandatFileName = mandatFileName.toLowerCase();
      const hasMandatFile = this.uploadedFiles.some(file => (file.name.toLowerCase()).includes(lowerCaseMandatFileName));
      return hasMandatFile;
    },
    async fetchUploadedFiles () {
      this.uploadedFiles = await this.$axios.post(process.env.ODOO_API + 'api/quotation/attachements?session_id=' + this.user.session_id + '&name=' + this.number).then(response => {
        return response.data.list
      })
    },
    async cancelCommand () {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'order_number': this.number,
        'status': 'cancel'
      }
      await this.$axios.post(process.env.ODOO_API + 'api/change_quotation_status?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data
      })
      setTimeout(() => {
        this.$router.push('/products/command?type=devis&number=' + this.number)
        this.$nextTick(() => {
          window.location.reload()
          this.$globalState.loader = false
        })
      }, 1000)
    },
    async cancelToDevis () {
      const header = {
        'Content-Type': 'application/json'
      }
      let params = {
        'order_number': this.number,
        'status': 'devis'
      }
      await this.$axios.post(process.env.ODOO_API + 'api/change_quotation_status?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data
      })
      setTimeout(() => {
        this.$router.push('/products/command?type=devis&number=' + this.number)
        this.$nextTick(() => {
          window.location.reload()
          this.$globalState.loader = false
        })
      }, 1000)
    },
    returnToClientSelect () {
      this.client = {}
    },
    async meClient () {
      const header = {
        'Content-Type': 'application/json'
      }
      let meclient = await this.$axios.post(process.env.ODOO_API + 'api/my_client?session_id=' + this.user.session_id, { headers: header }).then(response => {
        return response.data.result
      })
      this.selectClient(meclient)
    },
    selectClient (c) {
      this.client = {
        id: c.id,
        name: c.name,
        siret: c.siret,
        tel: c.tel,
        address: `${c.street} ${c.zip} ${c.city}`,
        zip: c.zip,
        city: c.city
      }
      const currentDate = new Date()
      const lastDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      const day = lastDateOfMonth.getDate()
      const month = String(lastDateOfMonth.getMonth() + 1).padStart(2, '0')
      const year = lastDateOfMonth.getFullYear()
      this.date_livraison = `${day}/${month}/${year}`
      if (!this.payment_mode && this.payment_modes.length > 0) {
        const virementClientMode = this.payment_modes.find(pm => pm.name === 'Virement client');
        if (virementClientMode) {
          this.selectPaymentMode(virementClientMode);
        } else {
          this.selectPaymentMode(this.payment_modes[0]);
        }
      }
      if (!this.price_list && this.price_lists.length > 0) {
        this.selectPriceList(this.price_lists[0]);
      }
    },
    selectPaymentMode (p) {
      this.searchPaymentMode = p.name
      this.payment_mode = p.id
      this.showMenuPaymentMode = false
    },
    selectPriceList (p) {
      this.searchPriceList = p.name
      this.price_list = p.id
      this.price_list_items = p.items
      this.showMenuPriceList = false
      this.fetchAndUpdatePrices()
    },
    goToCommand () {
      this.$globalState.loader = true
      setTimeout(() => {
        if (window.history.length > 1) {
          console.log('IM HERE')
          this.$router.go(-1)
        } else {
          this.$router.push('/shop')
        }
        this.$globalState.loader = false
      }, 1000)
    },
    toggleCharacteristics (item) {
      this.showCharacteristics[item.id] = !this.showCharacteristics[item.id];
      //this.$set(this.showCharacteristics, item.id, !this.showCharacteristics[item.id])
    },
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    addArticle (article, index) {
      let isAdded = false
      for (let i of this.items) {
        if (i.id === article.id) {
          i.quantity = (parseFloat(i.quantity) + 1).toFixed(2).toString()
          isAdded = true
          break
        }
      }
      if (!isAdded) {
        let newItem = {
          line_id: article.line_id,
          id: article.id,
          name: article.name,
          description: article.description,
          more_details: '',
          oldprice: article.oldprice,
          type: article.type,
          purchase_price: article.purchase_price,
          price: article.price,
          quantity: '1.00',
          image: article.image,
          reference: article.reference,
          postal_code: article.postal_code,
          city: article.city,
          insee_code: article.insee_code,
          product_type: article.product_type,
          country: article.country,
          commitment_date: '',
          ipbx_id: ''
        }
        if (article.type === 'did' || article.type === 'kipcloud1') {
          newItem.infos = [{
            name: 'SDA',
            value: ''
          }]
        } else {
          newItem.infos = []
        }
        this.items.push(newItem)
      }
      this.animateSlice(index)
    },
    deleteItem (itemToDelete) {
      //this.$set(itemToDelete, 'toBeRemoved', true)
      this.itemToDelte['toBeRemoved'] = true;
    },
    removeItemAfterAnimation (el, done) {
      this.items = this.items.filter(item => !item.toBeRemoved)
    },
    animateSlice (index) {
      if (this.slicedIndex === index) {
        this.slicedIndex = -1
      } else {
        this.slicedIndex = index
      }
    }
  }
}
</script>

<style scoped>

</style>