<template>
  <div>
    <div class="container is-max-widescreen">

      <div class="columns is-desktop mt-3" style="padding-right: 0.75rem" v-if="currentProduct.type === 'vpn_client'">
        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
          <div class="fieldset">
            <label>
              Où est mon IPBX
            </label>
            <div class="fieldset-content">

              <div class="has-text-centered" style="height: 100px; opacity: 0.4">
                <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                Oups! Pas de données disponibles
              </div>

            </div>
          </div>
        </div>
        <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
          <div
            :style="!guests_ipbx || guests_ipbx === 0 ? 'pointer-events: none; opacity: 0.5;' : ''"
            class="fieldset" title="Liste des IPBX dans les limbes en attente d'attribution à un partenaire">
            <label>
              Mes IPBX à réclamer
            </label>
            <div class="fieldset-content">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="has-text-white">
                    <b>{{guests_ipbx ? guests_ipbx : '?'}} IPBX</b> à réclamer
                  </span>
                </div>
                <div>
                  <a @click="activateIPBX()" class="button is-admin-primary">
                    Activer
                  </a>
                </div>
              </div>
            </div>
          </div>

          <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" href="/products/command?type=new">
            <i class="material-symbols-outlined size-l">dns</i>
            Commander un IPBX
            <span>
              >
            </span>
          </a>
        </div>
      </div>


      <div class="columns is-desktop mt-3" style="padding-right: 0.75rem" v-if="currentProduct.type === 'sda'">
        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
            <div class="fieldset">
              <label>
                Nombre de minutes consommées
              </label>
              <div class="fieldset-content">
                <div v-show="totalcallvals > 0 && showLoading != true" style="height: 100px">
                  <canvas id="chartLineMinutesUsedSDA"></canvas>
                </div>
                <div v-show="totalcallvals <= 0 && showLoading != true" class="has-text-centered" style="height: 100px; opacity: 0.4">
                  <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                  Oups! Pas de données disponibles
                </div>
                <div v-show="showLoading != false" class="loading-inline has-text-centered" style="height: 100px; opacity: 0.4; padding: 30px;">
                    <div class="loading-icon"></div>
                </div>
                <div class="d-flex justify-content-between"><div>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
          <div class="fieldset" title="Liste des IPBX dans les limbes en attente d'attribution à un partenaire">
            <label>
              Mes SDA à dispatcher
            </label>
            <div class="fieldset-content">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="has-text-white">
                  <b>{{products_infos ? (products_infos.total_sdas - products_infos.activ_sdas) : '?'}} SDA</b> à attribuer
                  </span>
                </div>
                <div>
                  <a @click="activateSDA()" class="button is-admin-primary">
                    Attribuer
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" href="/products/command?type=new">
              <i class="material-symbols-outlined size-l">phone_enabled</i>
              Commander un SDA
              <span>
                >
              </span>
          </a>
        </div>
      </div>


      <div class="columns is-desktop mt-3" style="padding-right: 0.75rem" v-if="currentProduct.type === 'trunk'">
        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 0rem;">
            <div class="fieldset">
              <label>
                Nombre de minutes consommées
              </label>
              <div class="fieldset-content">
                <div v-show="totalcallvals > 0 && showLoading != true" style="height: 100px">
                  <canvas id="chartLineMinutesUsedTRUNK"></canvas>
                </div>
                <div v-show="totalcallvals <= 0 && showLoading != true" class="has-text-centered" style="height: 100px; opacity: 0.4">
                  <span><i style="margin-top: 2%;" class="fa fa-frown fa-3x"></i></span><br>
                  Oups! Pas de données disponibles
                </div>
                <div v-show="showLoading != false" class="loading-inline has-text-centered" style="height: 100px; opacity: 0.4; padding: 30px;">
                    <div class="loading-icon"></div>
                </div>
                <div class="d-flex justify-content-between"><div>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
          <div class="fieldset" title="Liste des IPBX dans les limbes en attente d'attribution à un partenaire">
            <label>
              Mes Trunks commandé
            </label>
            <div class="fieldset-content">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="has-text-white">
                  <b>{{products_infos.total_trunks - products_infos.activ_trunks}} TRUNKS</b> en production
                  </span>
                </div>
                <div>
                  <a @click="activateTRUNK()" class="button is-admin-primary">
                    Produire
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" href="/products/command?type=new">
              <i class="material-symbols-outlined size-l">power</i>
              Commander un TRUNK
              <span>
                >
              </span>
          </a>
        </div>
      </div>


    </div>

    <div class="park-resume">
      <div class="container is-max-widescreen informations">
        <section>
          <div>
            <div class="columns">
              <div class="column services-card" style="padding-top: 0">
                <div class="column services-card" style="padding-top: 0; padding-bottom: 0.75em;">
                  <div class="field mb-0 align-items-center has-addons">
                    <label class="mr-3">
                      Filtrer par:
                    </label>
                    <div class="control pills-v2" style="margin-right: 0.5rem">
                      <label class="b-radio radio button" :class="isActif == true ? 'is-admin-white' : ''">
                        Actif
                        <input type="radio" value="date" @click="updateIsActif()">
                      </label>
                    </div>
                    <div class="control pills-v2">
                      <label class="b-radio radio button" :class="isInactif == true ? 'is-admin-white' : ''">
                        Inactif
                        <input type="radio" value="state" @click="updateIsInActif()">
                      </label>
                    </div>
                    <label class="ml-3" v-if="isSearchError == false">
                      {{ filteredProducts.length }} <span v-if="filteredProducts.length > 1">résultats</span><span
                        v-else>résultat</span>
                    </label>
                    <label class="ml-3" v-if="isSearchError == true">
                      0 <span>résultat</span>
                    </label>
                  </div>
                </div>

                <div class="collapse active" v-show="isSearchError == false" style="overflow-y: auto; overflow-x: hidden; height: 680px">
                  <div class="collapse-trigger" v-for="(s, index) of filteredProducts" :key="index">

                    <div role="button" @click="setCurrentProduct(s)" class="card-header card-ipbx" v-if="s.type === 'vpn_client'"
                      :class="s.client_id == currentIPBX.client_id ? 'card-active' : ''">
                      <div class="card-header-title" v-on:click="editCommonName(s)">
                        <a style="align-self: center; margin-right: 20px">
                          <i v-if="s.server_id == 2" class="material-icons"
                            :style="s.status === 'connected' ? 'color: #21bf26' : 'color: #ff4d4d'">person</i>
                          <i v-else class="material-icons"
                            :style="s.status === 'connected' ? 'color: #21bf26' : 'color: #ff4d4d'">dns</i>
                        </a>
                        <span style="margin-right: auto;">
                          <span v-if="isEditing != s.client_label">
                            {{s.client_label}}
                          </span>
                          <input v-if="isEditing == s.client_label" v-model="editedCommonName"
                            v-on:keyup.enter="saveCommonName(s)" v-on:blur="saveCommonName(s)"
                            style="background-color: transparent; border: none; font-size: .88rem;">
                          <br>
                          <small v-show="s.status === 'connected'" title="Copié dans le Presse-papier"
                            @click="copyTEXT(s.virtual_ip)">
                            {{s.real_ip}} - {{s.virtual_ip}}
                          </small>
                          <small v-show="s.status === 'disconnected'" title="Copié dans le Presse-papier"
                            @click="copyTEXT(s.virtual_ip)">
                            Déconnecté depuis le {{s.disconnected_since}}
                          </small>
                        </span>

                        <div class="align-center" style="padding-right: 1em; text-align: right;">
                          <a v-if="currentIPBX" title="Redirection vers mon IPBX" target="_blank" :href="'http://' + currentIPBX.virtual_ip" class="is-admin-secondary-light is-medium">
                            <i class="material-symbols-outlined size-l">start</i>
                          </a>
                        </div>
                      </div>
                    </div>


                    <div role="button" @click="setCurrentProduct(s)" class="card-header card-ipbx" :class="s.id == currentSDA.id ? 'card-active' : ''" v-if="s.type === 'sda'">
                      <div class="card-header-title">
                        <a style="align-self: center; margin-right: 20px">
                          <i class="material-icons" :style="s.status == 'free' ? 'color: gray' : 'color: #21bf26'">phone_enabled</i>
                        </a>
                        <span style="margin-right: auto;">
                          <span @click="copyTEXT(s.name)">
                            {{s.name}}
                          </span>
                          <br>
                          <small v-if="s.final_client.length > 0">
                            {{s.final_client}}
                          </small>
                          <small v-else>
                            Non attribué
                          </small>
                        </span>
                        <!--
                        <span style="margin-left: auto;">
                        </span>
                        -->
                        <div class="align-center" style="padding-right: 1em; text-align: right;">
                          <a v-if="currentSDA" title="Informations supplémentaires sur la SDA" class="is-admin-secondary-light is-medium" @click="editSDA(s)">
                            <i class="material-symbols-outlined size-l">settings</i>
                          </a>
                        </div>
                      </div>
                    </div>


                    <div role="button" @click="setCurrentProduct(s)" class="card-header card-ipbx" :class="s.id == currentTrunk.id ? 'card-active' : ''" v-if="s.type === 'trunk'">
                      <div class="card-header-title">
                        <a style="align-self: center; margin-right: 20px">
                          <i class="material-icons" :style="s.state == 'terminated' ? 'color: #21bf26' : 'color: #ff4d4d'">power</i>
                        </a>
                        <span style="margin-right: auto;">
                            <span>
                              {{s.client}}
                            </span>
                            <br>
                            <span @click="copyTEXT(s.username)">
                            {{s.username}}
                            </span>
                            <br>                          
                        </span>
                        <div class="align-center" style="padding-right: 1em; text-align: right;">
                          <a v-if="s.server_name" title="Redirection vers mon IPBX" @click="goToIPBXOfTrunk(s)" class="is-admin-secondary-light is-medium">
                            <i class="material-symbols-outlined size-l">dns</i>
                          </a>
                        </div>
                        <div class="align-center" style="padding-right: 1em; text-align: right;">
                          <a v-if="s.username" title="Afficher mes SDA" @click="goToSDAOfTrunk(s)" class="is-admin-secondary-light is-medium">
                            <i class="material-symbols-outlined size-l">phone_enabled</i>
                          </a>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>

                <div class="collapse active" v-show="isSearchError == true" style="overflow-y: auto; height: 680px">
                  <div class="collapse-trigger">
                    <div>
                      <p style="text-align-last: center; padding: 20px; color: #ff4d4d; font-size: 15px;">Aucun résultat
                        n'a été trouvé</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="datas" style="margin-right: 0;">
                <div class="fieldset-content wrapper">
                  <div class="field mb-0"></div>
                  <div class="field mb-0" style="min-width: 300px; justify-self: right;">
                    <div class="control has-icons-left">
                      <input placeholder="Rechercher" v-model="search_text" class="input">
                      <span class="icon is-small is-left">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                          <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none"
                            stroke-linecap="square">
                            <path
                              d="m 62.452297,13.136071 c -13.307093,0 -24.134766,10.826819 -24.134766,24.132812 0,6.102557 2.281546,11.679292 6.03125,15.933594 L 14.001125,83.589195 a 1.90019,1.90019 0 1 0 2.6875,2.685547 L 47.073391,55.850914 c 4.179184,3.464607 9.539208,5.550781 15.378906,5.550781 13.307092,0 24.134765,-10.82682 24.134765,-24.132812 0,-13.305993 -10.827673,-24.132812 -24.134765,-24.132812 z m 0,3.798827 c 11.253641,1e-6 20.335937,9.081886 20.335937,20.333985 0,11.252099 -9.082296,20.333984 -20.335937,20.333984 -11.253641,0 -20.335938,-9.081885 -20.335938,-20.333984 0,-11.252099 9.082297,-20.333985 20.335938,-20.333985 z">
                            </path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="wrapper">
                  <div :style="!zabbix_datas['mac'] ? 'opacity: 0.4' : ''"
                    class="box-account net-status-bloc is-hoverable" style="height: 370px">
                    <div class="box-container">
                      <div class="box-title">
                        Mon IPBX Kiplink
                        <i class="material-symbols-outlined size-l">info</i>
                        <!-- <i class="fa fa-tachometer-alt-slow"></i> -->
                      </div>
                      <div class="box-content" v-show="zabbix_datas['mac'] && showLoading != true">
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Uptime
                            </div>
                            <div :title="zabbix_datas['uptime']" class="label">
                              {{zabbix_datas['uptime'] ? zabbix_datas['uptime'].split(',')[0] : zabbix_datas['uptime']}}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Nom de l'hôte
                            </div>
                            <div :title="zabbix_datas['hostname']" class="label">
                              {{zabbix_datas['hostnamewrap']}}
                            </div>
                          </div>
                        </div>
                        <div v-if="user.id_company && user.id_company === 1">
                          <div class="signal-list">
                            <div class="label">
                              Partenaire
                            </div>
                            <div v-if="currentIPBX" :title="currentIPBX.partner_name" class="label">
                              {{currentIPBX.partner_name}}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              MAC
                            </div>
                            <div class="label">
                              {{zabbix_datas['mac']}}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Version IPBX
                            </div>
                            <div v-if="zabbix_datas['version_ipbx']" class="label"
                            :title="zabbix_datas['version_db'] ? zabbix_datas['version_db'] : zabbix_datas['version_ipbx']">
                              {{zabbix_datas['version_ipbx']}}
                            </div>
                            <div v-else class="label">
                              N/A
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Service WWW
                            </div>
                            <div v-if="zabbix_datas['www']" class="label"
                              :style="zabbix_datas['www'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                              :title="zabbix_datas['www'] == 1 ? 'Service WWW Actif' : 'Service WWW Inactif'">
                              <span><i class="fa fa-circle"></i></span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Service MYSQL
                            </div>
                            <div class="label">
                              <span v-if="zabbix_datas['mysql']"
                                :style="zabbix_datas['mysql'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                                :title="zabbix_datas['mysql'] == 1 ? 'Service MySQL Actif depuis: ' + zabbix_datas['mysql_uptime']: 'Service MySQL Inactif'"><i
                                  class="fa fa-circle"></i></span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Service Asterisk
                            </div>
                            <div class="label">
                              <span v-if="zabbix_datas['asterisk']"
                                :style="zabbix_datas['asterisk'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                                :title="zabbix_datas['asterisk'] == 1 ? 'Service Asterisk Actif': 'Service Asterisk Inactif'"><i
                                  class="fa fa-circle"></i></span>
                              <span style="margin-left: 10px" v-if="zabbix_datas['sip']"
                                :style="zabbix_datas['sip'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                                :title="zabbix_datas['sip'] == 1 ? 'Service SIP Actif' : 'Service SIP Inactif'"><i
                                  class="fa fa-circle"></i></span>
                              <span style="margin-left: 10px" v-if="zabbix_datas['iax2']"
                                :style="zabbix_datas['iax2'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                                :title="zabbix_datas['iax2'] == 1 ? 'Service IAX2 Actif' : 'Service IAX2 Inactif'"><i
                                  class="fa fa-circle"></i></span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Service NTP
                            </div>
                            <div v-if="zabbix_datas['ntp'] == 0 || zabbix_datas['ntp'] == 1" class="label"
                              :style="zabbix_datas['ntp'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                              :title="zabbix_datas['ntp'] == 1 ? 'Service NTP Actif': 'Service NTP Inactif'">
                              <span><i class="fa fa-circle"></i></span>
                            </div>
                            <div v-else class="label">
                              N/A
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Service SMTP
                            </div>
                            <div v-if="zabbix_datas['smtp'] == 0 || zabbix_datas['smtp'] == 1" class="label"
                              :style="zabbix_datas['smtp'] == 1 ? 'color: rgb(33, 191, 38)' : 'color: rgb(255, 77, 77)'"
                              :title="zabbix_datas['smtp'] == 1 ? 'Service SMTP Actif': 'Service SMTP Inactif'">
                              <span><i class="fa fa-circle"></i></span>
                            </div>
                            <div v-else class="label">
                              N/A
                            </div>
                          </div>
                        </div>

                        <div>
                          <div class="signal-list">
                            <div class="label">
                              Servicce HTTPS
                            </div>
                            <div class="label">
                              <span v-if="letsencrypt_certs && letsencrypt_certs.status == 'ok'"
                                style="color: rgb(33, 191, 38)"
                                title="Service Letsencrypt Actif (Les certificats sont générés et appliqués)"><i
                                  class="fa fa-circle"></i></span>
                              <span v-if="letsencrypt_certs && letsencrypt_certs.status == 'not_ok'" style="color: gray"
                                title="Service Letsencrypt Inactif (Pas d'informations)"><i
                                  class="fa fa-circle"></i></span>
                              <span v-if="letsencrypt_certs && letsencrypt_certs.status == 'error'"
                                style="color: rgb(255, 77, 77)"
                                title="Service Letsencrypt Inactif (Probleme de génération ou de push)"><i
                                  class="fa fa-circle"></i></span>
                            </div>
                          </div>
                        </div>
                        <!--
                        <div style="margin-top: 5%">
                          <div style="text-align: right !important;">
                            <a title="Configurer mon IPBX" @click="goToIPBX(s)"
                              class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">settings</i>
                            </a>
                            <a title="Redémarrer mon IPBX" @click="rebootClient(s)"
                              class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">restart_alt</i>
                            </a>
                            <a v-if="currentIPBX" title="Redirection vers mon IPBX" target="_blank"
                              :href="'http://' + currentIPBX.virtual_ip" class="is-admin-secondary-light is-medium">
                              <i class="material-symbols-outlined size-l">start</i>
                            </a>
                          </div>
                        </div>
                        -->
                      </div>
                      <div class="box-content has-text-centered" v-show="!zabbix_datas['mac'] && showLoading != true">
                        <div style="height: 120px; margin-top: 35%">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading != false">
                        <div class="loading-inline" style="height: 120px; margin-top: 35%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :style="cpuramvals <= 0 ? 'opacity: 0.4' : ''" class="box-account phone-status-bloc is-hoverable"
                    style="height: 49%">
                    <div class="box-container">
                      <div class="box-title">
                        Utilisation CPU / RAM
                        <i class="material-symbols-outlined size-l">show_chart</i>
                      </div>
                      <div class="box-content" v-show="showLoading != true">
                        <div v-show="cpuramvals > 0" class="has-text-centered" style="height: 100px;">
                          <canvas id="chartLineCpuRam"></canvas>
                        </div>
                        <div v-show="cpuramvals <= 0" class="has-text-centered" style="height: 120px; margin-top: 10%">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading != false">
                        <div class="loading-inline" style="height: 120px; margin-top: 10%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :style="othervals <= 0 ? 'opacity: 0.4' : ''" class="box-account phone-status-bloc is-hoverable"
                    style="height: 49%; align-self: flex-end">
                    <div class="box-container">
                      <div class="box-title">
                        Autres
                        <i class="material-symbols-outlined size-l">show_chart</i>
                      </div>
                      <div class="box-content" v-show="showLoading != true">
                        <div v-show="othervals > 0" class="has-text-centered" style="height: 100px;">
                          <canvas id="chartLineOtherGraph"></canvas>
                        </div>
                        <div v-show="othervals <= 0" class="has-text-centered" style="height: 120px; margin-top: 10%">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading != false">
                        <div class="loading-inline" style="height: 120px; margin-top: 10%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="box-account storage-bloc is-hoverable" style="height: 150px"
                    :style="(!zabbix_datas['/_used'] || zabbix_datas['/_used'] === '0') && (!zabbix_datas['/_total'] || zabbix_datas['/_total'] === '0') ? 'opacity: 0.4' : ''">
                    <div class="box-container">
                      <div class="box-title">
                        Mon stockage
                        <i class="material-symbols-outlined size-l">bar_chart</i>
                      </div>
                      <div class="box-content has-text-centered" v-show="showLoading != false">
                        <div class="loading-inline" style="margin-top: 5%">
                          <div class="loading-icon"></div>
                          <br>
                        </div>
                      </div>
                      <div class="box-content" v-show="showLoading != true">
                        <div class="container"
                          v-if="zabbix_datas['/_used'] && zabbix_datas['/_total'] && getPercentageUsedMemory() !== 0">
                          <div class="storage">
                            Espace utilisé sur le disque local
                          </div>
                          <div class="progress-wrapper status-success mb-2">
                            <progress max="100" class="progress is-small is-darkgrey" style="margin-top: 5px;"
                              :value="getPercentageUsedMemory()"></progress>
                            <!--
                        <p style="padding: 5px; text-align-last: center;">
                          <span title="/var/spool/voicemail">
                            <i class="fa fa-circle" style="color: #007f5f; font-size: xx-small"></i>
                            MeVo
                          </span>
                          <span title="/var/spool/monitor" style="margin-left: 5px">
                            <i class="fa fa-circle" style="color: #2b9348; font-size: xx-small"></i>
                            Enregistrements
                          </span>
                          <span title="/var/lib/asterisk/moh/" style="margin-left: 5px">
                            <i class="fa fa-circle" style="color: #55a630; font-size: xx-small"></i>
                            Musiques
                          </span>
                          <span title="/var/lib/asterisk/sounds/" style="margin-left: 5px">
                            <i class="fa fa-circle" style="color: #80b918; font-size: xx-small"></i>
                            Fichiers Sons
                          </span>
                          <span title="/var/lib/kiplink/backupd/" style="margin-left: 5px">
                            <i class="fa fa-circle" style="color: #aacc00; font-size: xx-small"></i>
                            Sauvegardes
                          </span>
                          <span title="/var/lib/mysql/" style="margin-left: 5px">
                            <i class="fa fa-circle" style="color: #bfd200; font-size: xx-small"></i>
                            BDD
                          </span>
                          <span title="/var/lib/opkg/" style="margin-left: 5px">
                            <i class="fa fa-circle" style="color: #d4d700; font-size: xx-small"></i>
                            Mise à jour
                          </span>
                        </p>
                        -->
                          </div>
                          <span v-if="zabbix_datas['/_used']" class="status-success">
                            {{allFormatBytes(zabbix_datas['/_used'])}}
                          </span>
                          <span v-else class="status-success">
                            N/A
                          </span>
                          /
                          <span v-if="zabbix_datas['/_total']">
                            {{allFormatBytes(zabbix_datas['/_total'])}}
                          </span>
                          <span v-else>
                            N/A
                          </span>
                        </div>
                        <div v-else class="container has-text-centered">
                          <span><i class="fa fa-frown fa-3x"></i></span><br>
                          Oups! Pas de données disponibles
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="box-account options-bloc is-hoverable"
                    :style="currentIPBX && currentIPBX.server_id <= 2 ? 'opacity: 0.4' : ''">
                    <div class="box-container">
                      <div class="box-title">
                        Mes options
                        <!--
                    <button class="button is-admin-primary">
                      Gérer mes options
                    </button>
                    -->
                      </div>
                      <div class="box-content">
                        <div class="box-options">
                          <div class="list-options">
                            <div @click="goToLicence()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">security</i>
                              </span>
                              <span style="margin-top: 10px">
                                Licences
                              </span>
                            </div>

                            <div @click="goToBackups()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">cloud</i>
                              </span>
                              <span style="margin-top: 10px">
                                Sauvegardes
                              </span>
                            </div>

                            <div @click="goToLetsencrypt()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">approval</i>
                              </span>
                              <span style="margin-top: 10px">
                                Certificats
                              </span>
                            </div>

                            <!--
                            <div @click="goToVPN()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">shield_lock</i>
                              </span>
                              <span style="margin-top: 10px">
                                VPN
                              </span>
                            </div>
                            -->

                            <div @click="goToTickets()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl">support_agent</i>
                              </span>
                              <div style="margin-top: 10px;">
                                <span>
                                  Mes tickets
                                </span>
                                <span class="ticket-number">({{ticket_numbers}})</span>
                              </div>
                            </div>


                            <div @click="goToVPN()" class="option active" style="cursor: pointer">
                              <span>
                                <i class="icon-hover material-symbols-outlined size-xxl" style="color: #ed5565">delete</i>
                              </span>
                              <span style="margin-top: 10px">
                                Révoquer l'IPBX
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>






            <!--
            <div class="fieldset-content" v-if="this.viewMode === 'global'">
            -->
            <!--
            <div class="fieldset-content">
              <div class="b-table">
                <div class="field table-mobile-sort">
                  <div class="field has-addons">
                  <div class="control is-expanded">
                      <span class="select is-fullwidth">
                        <select>
                          <option value="[object Object]">
                            Statut
                          </option>
                          <option value="[object Object]">
                            Nom
                          </option>
                          <option value="[object Object]">
                            IP
                          </option>
                          <option value="[object Object]">
                            MAC
                          </option>
                          <option value="[object Object]">
                            Version
                          </option>
                          <option value="[object Object]">
                            Services
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
                <div class="has-mobile-cards" style="word-break: break-all;">
                  <table class="table">
                    <thead>
                      <tr>
                      
                      <th style="width: 10%" class="">
                        <div class="th-wrap is-centered"></div>
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
                        <div class="th-wrap" style="white-space: nowrap;">IP
                          <div class="">
                            <span class="icon-container icon is-small is-desc">
                              <i :class="sortKey === 'partner' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                              <i
                                :class="sortKey === 'partner' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                            </span>
                          </div>
                        </div>
                      </th>
                      <th style="width: 10%" class="is-current-sort is-sortable" @click="sortTable('company')">
                        <div class="th-wrap" style="white-space: nowrap;">MAC
                          <div class="">
                            <span class="icon-container icon is-small is-desc">
                              <i :class="sortKey === 'company' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                              <i
                                :class="sortKey === 'company' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                            </span>
                          </div>
                        </div>
                      </th>
                      <th style="width: 10%" class="is-current-sort is-sortable" @click="sortTable('total_untaxed')">
                        <div class="th-wrap" style="white-space: nowrap;">Version
                          <div class="">
                            <span class="icon-container icon is-small is-desc">
                              <i
                                :class="sortKey === 'total_untaxed' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                              <i
                                :class="sortKey === 'total_untaxed' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                            </span>
                          </div>
                        </div>
                      </th>
                      <th style="width: 20%" class="is-current-sort is-sortable" @click="sortTable('start_date')">
                        <div class="th-wrap" style="white-space: nowrap;">Services
                          <div class="">
                            <span class="icon-container icon is-small is-desc">
                              <i :class="sortKey === 'start_date' && sortOrder === 'asc' ? 'fa fa-sort-up' : 'fal fa-sort-up'"></i>
                              <i
                                :class="sortKey === 'start_date' && sortOrder === 'desc' ? 'fa fa-sort-down' : 'fal fa-sort-down'"></i>
                            </span>
                          </div>
                        </div>
                      </th>
                      <th style="width: 10%" class="">
                        <div class="th-wrap is-centered"></div>
                      </th>
                      </tr>
                      </thead>
                      <tbody v-for="(s, index) of filteredProducts" :key="index">
                        <tr draggable="false" class="" v-if="s.type === 'vpn_client'">
                          <td data-label="Statut" class="">
                            <i v-if="s.server_id == 2" class="material-icons"
                              :style="s.status === 'connected' ? 'color: #21bf26' : 'color: #ff4d4d'">person</i>
                            <i v-else class="material-icons"
                              :style="s.status === 'connected' ? 'color: #21bf26' : 'color: #ff4d4d'">dns</i>
                          </td>
                          <td data-label="Nom" class="">
                            {{s.client_label}}
                          </td>
                          <td data-label="IP" class="">
                            {{s.real_ip}} - {{s.virtual_ip}}
                          </td>
                          <td data-label="MAC" class="">
                            {{}}
                          </td>
                          <td data-label="Version" class="">
                            {{}}
                          </td>
                          <td data-label="Services" class="">
                            {{s.services}}
                          </td>
                          <td class="has-text-centered">
                            <a @click="downloadOrder(o)" title="Télécharger la facture principale PDF" target="_blank">
                              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-2x valign">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                  <path
                                    d="m 39.715401,10.968309 a 1.9992179,1.9992179 0 0 0 -1.967784,2.030253 v 17.249339 l -16.687115,0.140556 a 1.9992179,1.9992179 0 1 0 0.03122,3.998036 l 20.653926,-0.171791 v -21.21614 a 1.9992179,1.9992179 0 0 0 -2.030252,-2.030253 z">
                                  </path>
                                  <path
                                    d="m 39.980895,10.000035 c -1.318348,0.0042 -2.577245,0.540379 -3.498281,1.483646 a 1.9992179,1.9992179 0 0 0 -0.0078,0 L 18.366513,30.07611 a 1.9992179,1.9992179 0 0 0 -0.0078,0.0078 c -0.872293,0.910837 -1.362194,2.127847 -1.358708,3.388972 v 50.529867 c 0,3.288408 2.708656,5.997054 5.997054,5.997054 h 48.413717 a 1.9992179,1.9992179 0 1 0 0,-3.998036 H 22.997051 c -1.127689,0 -1.999018,-0.87132 -1.999018,-1.999018 V 33.46507 c -6.21e-4,-0.22471 0.08101,-0.437386 0.23426,-0.601267 l 0.0078,-0.0078 18.100483,-18.58462 c 0.171158,-0.175289 0.403421,-0.270567 0.648132,-0.273316 h 31.406448 c 1.418087,0.01239 2.525427,1.119725 2.537813,2.537816 v 6.176653 a 1.9992179,1.9992179 0 1 0 3.998036,0 v -6.19227 a 1.9992179,1.9992179 0 0 0 0,-0.02343 c -0.03104,-3.55401 -2.942794,-6.465765 -6.496808,-6.496806 a 1.9992179,1.9992179 0 0 0 -0.02359,0 h -31.4219 a 1.9992179,1.9992179 0 0 0 -0.0078,0 z">
                                  </path>
                                  <path
                                    d="m 36.182796,46.963394 v 10.957031 h 4.570313 q 2.734375,0 4.257812,-1.445312 1.542969,-1.445313 1.542969,-4.042969 0,-2.597656 -1.523437,-4.023437 -1.523438,-1.445313 -4.277344,-1.445313 z m -3.945312,-3.242187 h 8.515625 q 4.882812,0 7.402344,2.226562 2.519531,2.207031 2.519531,6.484375 0,4.316406 -2.519531,6.523438 -2.5,2.207031 -7.402344,2.207031 h -4.570313 v 11.71875 h -3.945312 z">
                                  </path>
                                  <path
                                    d="m 60.967953,69.639175 q 4.980468,0 6.953125,-2.441406 1.972656,-2.460937 1.972656,-8.867187 0,-6.464844 -1.972656,-8.90625 -1.953125,-2.460938 -6.953125,-2.460938 h -1.875 v 22.675781 z m 0.07813,-25.917968 q 6.679687,0 9.84375,3.554687 3.164062,3.554688 3.164062,11.054688 0,7.460937 -3.164062,11.015625 -3.164063,3.535156 -9.84375,3.535156 H 55.128109 V 43.721207 Z">
                                  </path>
                                  <path
                                    d="m 81.065609,43.721207 h 17.167969 v 3.320312 H 85.030453 v 8.59375 h 11.972656 v 3.320313 H 85.030453 v 13.925781 h -3.964844 z">
                                  </path>
                                </g>
                              </svg>
                            </a>
                            <a @click="EditDevis(o)">
                              <i class="fal fa-pen" style="font-size: large; vertical-align: text-top; margin-left: 0.1em;"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
            -->
          </div>
        </section>
      </div>
    </div>


    <ModalActivateIPBX @activateValIPBX="getActivateIPBX" :active="isActivateIPBX ? true : false"></ModalActivateIPBX>

    <CheckAction :emitter="'rebootClient'" :emitterStatus="'rebootStatus'" @rebootStatus="getRebootStatus" @rebootClient="getRebootClient" :active="isRebootClient ? true : false"></CheckAction>
    
    <CheckAction :emitter="'revokeClient'" :emitterStatus="'revokeStatus'" @revokeStatus="getRevokeStatus" @revokeClient="getRevokeClient" :active="isRevokeClient ? true : false"></CheckAction>

    <DownloadRevokeClientVPN v-if="currentIPBX" @downloadClient="getDownloadClient" :client="currentIPBX"
      :active="isDownloadClient ? true : false"></DownloadRevokeClientVPN>

    <ModalCommandSpec @activateValComSpec="getActivateValComSpec" :active="isActivateValComSpec ? true : false"></ModalCommandSpec>
  </div>

</template>


<script>
import Chart from 'chart.js';
import ModalActivateIPBX from './ipbx/ActivateIPBX.vue';
import ModalCommandSpec from '../command/CommandSpecificProduct.vue';
import CheckAction from '../modal/CheckAction.vue';
import DownloadRevokeClientVPN from '../vpn/DownloadRevokeClientVPN.vue';

export default {
  name: 'ProductAll',
  props: {
    msg: String,
    tab: Boolean,
    products_infos: Object
  },
  components: {
    ModalActivateIPBX,
    ModalCommandSpec,
    CheckAction,
    DownloadRevokeClientVPN
  },
  data() {
    return {
      zoom: 13,
      center: [46.603354, 1.888334], // Centered on France
      urldark: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,

      mqttClient: null,
      servers: [],
      search_text: null,
      isSearchError: false,
      isActif: false,
      isInactif: false,
      isActivateIPBX: false,
      isActivateValComSpec: false,
      nbPerPage: 6,
      nbOfPage: 1,
      currentPage: 1,
      currentIPBX: null,
      currentSDA: [],
      currentTrunk: [],
      currentProduct: [],
      nbOfRows: 50,
      backups: [],
      backupServer: '',
      gettingBackup: false,
      backupError: false,
      currentServerId: null,
      backupErrorMsg: null,
      zabbix_datas: [],
      graphcpuram: null,
      graphcpu: null,
      graphram: null,
      graphtotalcall: null,
      cpuramvals: 0,
      cpuvals: 0,
      ramvals: 0,
      othervals: 0,
      totalcallvals: 0,
      showLoading: true,
      timer: '',
      second_timer: '',
      trunks: [],
      sdas: [],
      isTrunkReady: false,
      isTrunkNotReady: false,
      isSDAActif: false,
      isSDAInactif: false,
      trunk_vals: [],
      sda_vals: [],
      letsencrypt_certs: [],
      isEditing: null,
      editedCommonName: '',
      datas_infos: [],
      isRebootClient: false,
      isRevokeClient: false,
      sortKey: 'sda',
      sortOrder: 'asc',
      ticket_numbers: 0,
      isDownloadClient: false
    };
  },
  async mounted() {
    this.$loader = true;
    this.showLoading = true;
    this.$on('activateIPBX', val => { this.activateIPBX = val });
    setTimeout(() => {
      this.showLoading = false;
      this.$loader = false;
    }, 1000);
  },
  computed: {
    filteredProducts() {
      let filtered = [
        ...this.$store.getters.clients.map(client => ({ ...client, type: 'vpn_client' })),
        ...this.$store.getters.sdas.map(sda => ({ ...sda, type: 'sda' })),
        ...this.$store.getters.trunks.map(trunk => ({ ...trunk, type: 'trunk' }))
      ]

      if (this.search_text) {
        let text = this.search_text.toLowerCase();
        filtered = filtered.filter(product => {
          if (product.type === 'vpn') {
            return text.split(' ').every(v => 
              product.client_label?.toLowerCase().includes(v) ||
              product.real_ip?.toLowerCase().includes(v) ||
              product.virtual_ip?.toLowerCase().includes(v)
            );
          } else if (product.type === 'sda') {
            return text.split(' ').every(v => 
              product.name?.toLowerCase().includes(v) ||
              product.final_client?.toLowerCase().includes(v) ||
              product.contract_number?.toLowerCase().includes(v) ||
              product.city?.toLowerCase().includes(v) ||
              product.call_code?.toLowerCase().includes(v) ||
              product.country_code?.toLowerCase().includes(v)
            );
          } else if (product.type === 'trunk') {
            return text.split(' ').every(v => 
              product.client?.toLowerCase().includes(v) ||
              product.username?.toLowerCase().includes(v) ||
              product.secret?.toLowerCase().includes(v) ||
              product.contract_number?.toLowerCase().includes(v) ||
              product.server_name?.toLowerCase().includes(v) ||
              product.server_cn?.toLowerCase().includes(v)
            );
          }
          return false;
        });
      }

      filtered = filtered.filter(product => {
        if (this.isActif) {
          if (product.type === 'vpn_client' && product.status !== 'connected') return false;
          if (product.type === 'trunk' && (product.state === 'quotation' || product.state === 'order')) return false;
          if (product.type === 'sda' && product.status === 'free') return false;
        }

        if (this.isInactif) {
          if (product.type === 'vpn_client' && product.status !== 'disconnected') return false;
          if (product.type === 'trunk' && (product.state === 'terminated' || product.state === 'on_finish')) return false;
          if (product.type === 'sda' && product.status === 'occupied') return false;
        }

        return true;
      });

      this.isSearchError = filtered.length === 0;

      if (!this.currentIPBX && filtered.length) {
        this.setCurrentIPBX(filtered[0]);
      }

      return this.sortedProducts(filtered);
    },
    user() {
      return this.$store.getters.getUser;
    },
    guests_ipbx() {
      return this.$store.getters.totalClientsGuest;
    },
    viewMode() {
      return localStorage.getItem('viewMode');
    },
    get_data_from_zabbix() {
      return this.zabbix_datas;
    },
  },
  methods: {
    getStateBadge(value) {
      switch (value) {
        case 'En cours de production':
          return 'badge-info';
        case 'Produit':
          return 'badge-primary';
        case 'Commande':
          return 'badge-success';
        case 'Brouillon':
          return '';
        case 'Bon de commande':
          return 'badge-primary';
        case 'Envoyé':
          return 'badge-info';
        case 'Terminé':
          return 'badge-primary';
        case 'Résilié':
          return '';
        case 'Annulé':
          return 'badge-danger';
      }
    },
    latLng(lat, lng) {
      return [parseFloat(lat), parseFloat(lng)];
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    getDownloadClient(value) {
      this.isDownloadClient = value;
    },
    goToVPN(c) {
      this.isDownloadClient = true;
    },
    async copyTEXT(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        this.$toastr.Add({
          name: 'SuccesData',
          title: 'Copie effectué :)',
          msg: '',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'success',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
      } catch (e) {
        console.log(e);
      }
    },
    rebootClient(c) {
      this.currentIPBX = c;
      this.isRebootClient = true;
    },
    revokeClient(c) {
      this.currentIPBX = c;
      this.isRevokeClient = true;
    },
    goToIPBX(c) {
      this.currentIPBX = c;
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/ipbx?ip=' + c.virtual_ip);
      }, 1000);
    },
    async getRebootStatus(value) {
      this.$loader = true;
      if (value) {
        const header = {
          'Content-Type': 'application/json'
        };
        let params = {
          'ip_virtual': this.currentIPBX.virtual_ip.toString()
        };
        let action = await this.$axios.post(process.env.ODOO_API + 'api/ipbx/reboot?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result;
        });
        if (action.success) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'État IPBX',
            msg: 'Votre IPBX a été redémarrer correctement',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
        } else {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Une erreur est survenue lors du redémarrage de votre IPBX',
            msg: 'Veuillez réessayer ultérieurement',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
        }
      }
      this.isRebootClient = false;
      this.$loader = false;
    },
    getRebootClient(value) {
      this.isRebootClient = value;
    },
    async getRevokeStatus(value) {
      this.$loader = true;
      if (value) {
        const header = {
          'Content-Type': 'application/json'
        };
        let params = {
          id_client: this.currentIPBX.id.toString()
        };
        let action = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/revoke?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result;
        });
        if (action.success) {
          this.$store.dispatch('revokeClient', this.currentIPBX.id);
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Votre client VPN a été révoqué',
            msg: '',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
        } else {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Une erreur est survenue lors de la révoquation du client',
            msg: 'Veuillez réessayer ultérieurement',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
        }
      }
      this.isRevokeClient = false;
      this.$loader = false;
    },
    getRevokeClient(value) {
      this.isRevokeClient = value;
    },
    editCommonName(s) {
      this.isEditing = s.client_label;
      this.editedCommonName = s.client_label;
    },
    async saveCommonName(s) {
      this.isEditing = null;
      if (this.editedCommonName.length > 0 && this.editedCommonName !== s.client_label) {
        const header = {
          'Content-Type': 'application/json'
        };
        let params = {
          'cn': s.client_label,
          'new_cn': this.editedCommonName
        };
        let updatename = await this.$axios.post(process.env.ODOO_API + 'api/vpn/client/update/cn?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result;
        });
        if (updatename.status === 200) {
          s.client_label = this.editedCommonName;
          this.$toastr.Add({
            name: 'SuccesData',
            title: 'Mis à jour effectué :)',
            msg: updatename.message,
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
        } else {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Erreur',
            msg: updatename.message,
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
        }
        // window.location.reload()
      }
    },
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    },
    goToContract(contract) {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/command?type=contract&number=' + contract);
      }, 1000);
    },
    goToTickets() {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/support?search=' + this.currentIPBX.client_label);
      }, 1000);
    },
    goToLetsencrypt() {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/letsencrypt?id=' + this.currentIPBX.client_id);
      }, 1000);
    },
    goToBackups() {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/servers?id=' + this.currentIPBX.client_id + '&name=' + this.currentIPBX.client_label);
      }, 1000);
    },
    goToLicence() {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/licence?ip=' + this.currentIPBX.virtual_ip + '&name=' + this.currentIPBX.client_label);
      }, 1000);
    },
    getPercentageUsedMemory() {
      if (!this.zabbix_datas['/_used'] || !this.zabbix_datas['/_total'] || parseInt(this.zabbix_datas['/_total']) === 0) {
        return 0;
      } else {
        return ((parseInt(this.zabbix_datas['/_used']) / parseInt(this.zabbix_datas['/_total'])) * 100);
      }
    },
    getStorageFromZabbix() {
      let colors = ['#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f'];
      let max = (parseInt(this.zabbix_datas['/_used']) / parseInt(this.zabbix_datas['/_total'])) * 100;
      let percentage = [max.toFixed(0), 15, 20, 30, 60, 70, 95];
      let style = 'background-image: linear-gradient(to right';
      let i = 0;
      while (i < percentage.length) {
        style += ', ';
        style += colors[i] + ' ';
        if (i >= 1 && i < percentage.length - 1) {
          style += percentage[i - 1].toString() + '%';
          style += ' ';
          style += percentage[i].toString() + '%';
        } else {
          style += percentage[i].toString() + '%';
        }
        i++;
      }
      if (percentage.length === 1) {
        style += ', white ';
        style += percentage[0].toString();
        style += '%';
      }
      style += ')';
      return style;
    },
    getDateFromTimestamp(sec) {
      let today = new Date();
      today = this.$moment(today).subtract(sec, 'seconds').format('DD-MM-YYYY HH:mm:ss');
      return today;
    },
    getMinutesFromTimestamp(sec) {
      let seconds = parseInt(sec, 10);
      let days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      let hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      let mnts = Math.floor(seconds / 60);
      seconds -= mnts * 60;
      if (hrs > 0) {
        return hrs + ' H';
      } else {
        return mnts + ' min';
      }
    },
    async getMonitorFromZabbix() {
      this.letsencrypt_certs = await this.$axios.get(`${process.env.ODOO_API}api/certificates/letsencrypt?cn=${this.currentIPBX.client_id}&session_id=${this.user.session_id}`).then(response => response.data);

      const header = { 'Content-Type': 'application/json' };
      const params = { 'host': this.currentIPBX.client_id };

      let zabbixdatas = await this.$axios.post(`${process.env.ODOO_API}api/get_zabbix_host`, { params }, { headers: header }).then(response => response.data.result.result);

      let cpuLoadId = 0, ramLoadId = 0, totalMemory = 0;
      this.zabbix_datas = {};

      for (let z of zabbixdatas) {
        for (let data of z.items) {
          switch (data.key_) {
            case 'system.cpu.util[,idle]':
              cpuLoadId = data.itemid;
              break;
            case 'vm.memory.size[available]':
              ramLoadId = data.itemid;
              break;
            case 'vm.memory.size[total]':
              totalMemory = data.lastvalue;
              break;
            case 'system.uptime':
              this.zabbix_datas['uptime'] = this.getDateFromTimestamp(data.lastvalue);
              break;
            case 'system.hostname':
              this.zabbix_datas['hostname'] = data.lastvalue;
              this.zabbix_datas['hostnamewrap'] = data.lastvalue.length > 20 ? data.lastvalue.slice(0, 19) + '...' : data.lastvalue;
              break;
            case 'kiplink.variable[ServerVar_Kiplink_Version]':
              this.zabbix_datas['version_ipbx'] = data.lastvalue;
              break;
            case 'kiplink.variable[DB_VERSION]':
              this.zabbix_datas['version_db'] = data.lastvalue;
              break;
            case 'net.tcp.service[http]':
              this.zabbix_datas['www'] = data.lastvalue;
              break;
            case 'mysql.ping':
              this.zabbix_datas['mysql'] = data.lastvalue;
              break;
            case 'mysql.status[Uptime]':
              this.zabbix_datas['mysql_uptime'] = this.getDateFromTimestamp(data.lastvalue);
              break;
            case 'net.tcp.service[tcp,,5038]':
              this.zabbix_datas['asterisk'] = data.lastvalue;
              break;
            case 'net.udp.listen[5060]':
              this.zabbix_datas['sip'] = data.lastvalue;
              break;
            case 'net.udp.listen[4569]':
              this.zabbix_datas['iax2'] = data.lastvalue;
              break;
            case 'net.udp.listen[123]':
              this.zabbix_datas['ntp'] = data.lastvalue;
              break;
            case 'net.tcp.service[smtp]':
              this.zabbix_datas['smtp'] = data.lastvalue;
              break;
            case 'system.hw.macaddr[eth0,short]':
              this.zabbix_datas['mac'] = data.lastvalue.toUpperCase();
              break;
            case 'vfs.fs.size[/var,total]':
              this.zabbix_datas['/_total'] = data.lastvalue;
              break;
            case 'vfs.fs.size[/var,used]':
              this.zabbix_datas['/_used'] = data.lastvalue;
              break;
            case 'total_call':
              this.zabbix_datas['totalcall'] = data.itemid;
              break;
            case 'kiplink.variable[kiplink.cache.geoip.longitude]':
              this.zabbix_datas['gps_longitude'] = data.lastvalue;
              break;
            case 'kiplink.variable[kiplink.cache.geoip.latitude]':
              this.zabbix_datas['gps_latitude'] = data.lastvalue;
              break;
          }
        }
      }

      const fetchGraphData = async (itemid, type) => {
        return await this.$axios.post(`${process.env.ODOO_API}api/get_zabbix_graph_by_item`, { params: { itemid, type } }, { headers: header }).then(response => response.data.result.result);
      };

      const processGraphData = (zabbixData, transformFunc) => {
        return zabbixData.map(z => ({
          time: this.getDateFromTimestamp(Math.round(+new Date() / 1000) - parseInt(z.clock)),
          value: transformFunc(z.value)
        })).reverse();
      };

      let cpuData = await fetchGraphData(cpuLoadId, 0);
      let ramData = await fetchGraphData(ramLoadId, 3);

      let cpuValues = processGraphData(cpuData, value => (100 - parseInt(value)).toFixed(2));
      let ramValues = processGraphData(ramData, value => ((parseInt(value) / totalMemory) * 100).toFixed(2));
      this.cpuvals = cpuValues.length;
      this.ramvals = ramValues.length;
      this.cpuramvals = this.cpuvals + this.ramvals;

      let ctx = document.getElementById('chartLineCpuRam');
      if (this.graphcpuram) this.graphcpuram.destroy();

      this.graphcpuram = new Chart(ctx, {
        type: 'line',
        data: {
          labels: cpuValues.map(d => d.time),
          datasets: [
            {
              label: 'CPU %',
              data: cpuValues.map(d => d.value),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              fill: true,
              tension: 0.2
            },
            {
              label: 'RAM %',
              data: ramValues.map(d => d.value),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              pointRadius: 1,
              pointHoverRadius: 1,
              fill: true,
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
          scales: {
            yAxes: [{
              display: false,
              ticks: {
                beginAtZero: true,
                max: 100
              }
            }],
            xAxes: [{
              display: false,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    },
    getActivateIPBX(value) {
      this.isActivateIPBX = value;
    },
    activateIPBX() {
      this.isActivateIPBX = true;
    },
    getActivateValComSpec(value) {
      this.isActivateValComSpec = value;
    },
    activateCommandSpec() {
      this.isActivateValComSpec = true;
    },
    async addGraph() {
    },
    getCompareDate(connect, disconnect) {
      if (disconnect) {
        return disconnect <= connect;
      } else {
        return true;
      }
    },
    updateIsActif() {
      this.isActif = !this.isActif;
      if (this.isInactif) {
        this.isInactif = false;
      }
    },
    updateIsInActif() {
      this.isInactif = !this.isInactif;
      if (this.isActif) {
        this.isActif = false;
      }
    },
    setCurrentProduct(value) {
      this.showLoading = true;
      setTimeout(async () => {
        if (value.type === 'vpn_client') {
          await this.setCurrentIPBX(value);
        } else if (value.type === 'trunk') {
          this.setCurrentTrunk(value);
        } else if (value.type === 'sda') {
          this.setCurrentSDA(value);
        }
        this.currentProduct = value;
        this.showLoading = false;
      }, 500);
    },
    setCurrentTrunk (value) {
      this.showLoading = true
      setTimeout(() => {
        this.currentTrunk = value
        this.showLoading = false
      }, 500)
    },
    setCurrentSDA (value) {
      this.showLoading = true
      setTimeout(() => {
        this.currentSDA = value
        this.showLoading = false
      }, 500)
    },
    async setCurrentIPBX(value) {
      this.currentIPBX = value;
      this.showLoading = true;
      setTimeout(() => {
        const header = {
          'Content-Type': 'application/json'
        };
        let params = {
          'cn': this.currentIPBX.client_label
        };
        this.datas_infos = this.$axios.post(process.env.ODOO_API + 'api/tickets/cn?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
          return response.data.result;
        });
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 3000);
        });

        const monitorData = this.getMonitorFromZabbix();

        Promise.race([monitorData, timeout]).then(() => {
          this.showLoading = false;
        });
      }, 500);
      let params = {
        state: '',
        search_query: [this.currentIPBX.client_label]
      };
      const response = await this.$axios.post(process.env.ODOO_API + 'api/tickets/test?session_id=' + this.user.session_id, { params });
      const tickets = response.data.result;
      this.ticket_numbers = tickets.length;
    },
    async updateZabbixDatas() {
      const header = {
        'Content-Type': 'application/json'
      };
      let params = {
        'host': ''
      };
      let zabbixdatas = await this.$axios.post(process.env.ODOO_API + 'api/get_zabbix_all_host', { params }, { headers: header })
        .then((response) => response.data)
        .catch((error) => {
          console.error('Error fetching Zabbix data:', error);
          return [];
        });
    },
    readableSize(val) {
      return this.formatBytes(val);
    },
    formatBytes(a, b) {
      if (a === 0) return '0'; // '0 Bytes'
      let c = 1024, d = b || 4;
      let f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d));
    },
    allFormatBytes(a, b) {
      if (a === 0) return '0'; // '0 Bytes'
      let c = 1024, d = b || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], f = Math.floor(Math.log(a) / Math.log(c));
      return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
    },
    parseJwt(token) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
    goToServer(event) {
      let addr = '';
      for (let i = 0; i < this.servers.length; i++) {
        if (this.servers[i].id_vpn_client === event.id) {
          addr = this.servers[i].virtual_ip;
          break;
        }
      }
      if (!addr || addr === '') return;
      window.open('http://' + addr, '_blank');
    },
    sortedProducts(products) {
      return products.sort((a, b) => {
        let aValue, bValue;

        if (a.type === 'vpn_client') {
          aValue = a.client_label ? a.client_label.toLowerCase() : '';
        } else if (a.type === 'sda') {
          aValue = a.name ? a.name.toLowerCase() : '';
        } else if (a.type === 'trunk') {
          aValue = a.client ? a.client.toLowerCase() : '';
        }

        if (b.type === 'vpn_client') {
          bValue = b.client_label ? b.client_label.toLowerCase() : '';
        } else if (b.type === 'sda') {
          bValue = b.name ? b.name.toLowerCase() : '';
        } else if (b.type === 'trunk') {
          bValue = b.client ? b.client.toLowerCase() : '';
        }

        return aValue.localeCompare(bValue);
      });
    },
  }
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@keyframes heartbeat {
    0% {
      color: white; /* Couleur initiale */
    }
    50% {
      color: #00a4c3; /* Couleur de surbrillance */
    }
    100% {
      color: black; /* Couleur initiale */
    }
  }

  .heartbeat {
    animation: heartbeat 3s infinite; /* Animation avec une durée de 1 seconde, en boucle */
  }

</style>
