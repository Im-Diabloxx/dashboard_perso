<template>
  <div>
    <div class="container is-max-widescreen">
      <div class="columns is-desktop mt-1" style="padding-right: 0.75rem">
        <div class="column is-three-fifths-desktop" style="padding: 0.75rem; padding-right: 1rem;">
          <div
            :style="totalClientWithNoConnectedPhones === 0 ? 'pointer-events: none; opacity: 0.5;' : ''"
            class="fieldset" 
            title="Liste des téléphones dans les limbes">
            <label>
              Mes certificats téléphones
            </label>
            <div class="fieldset-content">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="has-text-white">
                    <b>{{ totalClientWithNoConnectedPhones }} certificat</b> à uploader
                  </span>
                </div>
                <div>
                  <a @click="activatePhone()" class="button is-admin-primary">
                    Activer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-two-fifths-desktop" style="padding: 0.75rem; padding-left: 0rem; padding-right: 1rem;">
          <a style="font-size: 18px" class="commandProduct blackblock sims hoverable" @click="goToCommand()">
            <i class="material-symbols-outlined size-l">deskphone</i>
            Commander un Téléphone
            <span>></span>
          </a>
        </div>
      </div>
    </div>

    <div class="park-resume">
      <div class="container is-max-widescreen informations">
        <section>
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
                    {{ filteredClients.length }} <span v-if="filteredClients.length > 1">résultats</span><span
                      v-else>résultat</span>
                  </label>
                  <label class="ml-3" v-if="isSearchError == true">
                    0 <span>résultat</span>
                  </label>
                </div>
              </div>

              <div class="collapse active" 
                   v-show="isSearchError == false" 
                   style="overflow-y: auto; overflow-x: hidden; height: 650px">
                <div class="collapse-trigger" 
                     v-for="client of filteredClients" 
                     :key="client.client_id">
                  <div role="button" 
                       @click="setcurrentPhone(client)" 
                       class="card-header card-ipbx"
                       :class="{'card-active': currentPhone && client.client_id === currentPhone.client_id}" 
                       @mouseover="hoveredClient = client.client_id" 
                       @mouseleave="hoveredClient = null">
                    <div class="card-header-title" v-on:click="editCommonName(client)">
                      <a style="align-self: center; margin-right: 20px">
                        <i class="material-symbols-outlined material-symbols-outlined-filled"
                           :style="Object.keys(client.connections).length > 0 ? 'color: #21bf26' : 'color: #ff4d4d'">deskphone</i>
                      </a>
                      <span style="margin-right: auto;">
                        <span v-if="isEditing != client.client_label">
                          {{client.client_label}}
                        </span>
                        <input v-if="isEditing == client.client_label" 
                               v-model="editedCommonName"
                               v-on:keyup.enter="saveCommonName(client)" 
                               v-on:blur="saveCommonName(client)"
                               style="background-color: transparent; border: none; font-size: .88rem;">
                        <br>
                        <small v-if="client.connections && Object.keys(client.connections).length > 1">
                          {{Object.keys(client.connections).length}} téléphones connectés
                        </small>
                        <small v-else-if="client.connections && Object.keys(client.connections).length == 1">
                          {{Object.keys(client.connections).length}} téléphone connecté
                        </small>
                        <small v-else>
                          Aucun téléphone connecté
                        </small>
                      </span>

                      <div class="icon-wrapper" 
                           :class="{ 'visible': hoveredClient === client.client_id }" 
                           style="padding-right: 1em; text-align: right; display: flex; gap: 0.5rem;">
                        
                        <!-- Bouton Download VPN -->
                        <a v-if="currentPhone" 
                           @click.stop="downloadClientVPN" 
                           title="Télécharger le certificat VPN" 
                           class="is-admin-secondary-light is-medium">
                          <i class="material-symbols-outlined size-l">download</i>
                        </a>

                        <!-- Bouton Révoquer -->
                        <a v-if="currentPhone" 
                           title="Révoquer" 
                           @click.stop="revokeClient()" 
                           class="is-admin-secondary-light is-medium">
                          <i class="material-symbols-outlined size-l" style="color: #ed5565">delete</i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="collapse active" 
                   v-show="isSearchError == true" 
                   style="overflow-y: auto; height: 650px">
                <div class="collapse-trigger">
                  <div>
                    <p style="text-align-last: center; padding: 20px; color: #ff4d4d; font-size: 15px;">
                      Aucun résultat n'a été trouvé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="datas" style="margin-right: 0px;">
              <div class="fieldset-content wrapper">
                <div class="field mb-0"></div>
                <div class="field mb-0" style="min-width: 300px; justify-self: right;">
                  <TagInput
                  :modelValue="search_badges">
                  </TagInput>
                </div>
              </div>

              <div class="wrapper">
                <div class="box-account options-bloc" 
                     style="height: 370px; grid-row: 2" 
                     :style="currentPhone && currentPhone.connections && Object.keys(currentPhone.connections).length > 0 ? '' : 'opacity: 0.4'">
                  <div class="box-container">
                    <div class="box-title">
                      Mes Téléphones
                      <i class="material-symbols-outlined size-l">devices</i>
                    </div>
                    <div class="box-content" v-if="currentPhone && currentPhone.connections && Object.keys(currentPhone.connections).length > 0">
                      <div class="table-container" style="overflow: auto; height: 250px;">
                        <table class="table is-fullwidth" style="background-color: transparent;">
                          <thead>
                            <tr>
                              <th>Statut</th>
                              <th>IP Virtuelle</th>
                              <th>IP Publique</th>
                              <th>Port</th>
                              <th>Connexion depuis</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(connection, index) in currentPhoneConnections" :key="index">
                              <td>
                                <i class="material-symbols-outlined material-symbols-outlined-filled" style="color: #21bf26">deskphone</i>
                              </td>
                              <td>
                                <a :href="'http://' + connection.virtual_ip" target="_blank">
                                  {{ connection.virtual_ip }}
                                </a>
                              </td>
                              <td>{{ connection.real_ip }}</td>
                              <td>{{ connection.real_port }}</td>
                              <td>{{ connection.connected_since }}</td>
                              <td>
                                <div style="display: flex; gap: 0.3rem;">
                                  <a @click="openScreencapture(currentPhone, connection)" 
                                     title="Screencapture" 
                                     class="is-admin-secondary-light is-small">
                                    <i class="material-symbols-outlined" style="font-size: 16px; color: #3498db">monitor</i>
                                  </a>
                                  <a @click="openSipActions(currentPhone, connection)" 
                                     title="Actions SIP" 
                                     class="is-admin-secondary-light is-small">
                                    <i class="material-symbols-outlined" style="font-size: 16px; color: #f39c12">settings_phone</i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div v-else class="box-content" style="position: relative; top: 25%">
                      <div class="container has-text-centered">
                        <span><i class="fa fa-frown fa-3x"></i></span><br>
                        Oups! Pas de données disponibles
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sections désactivées -->
                <div class="box-account storage-bloc" style="opacity: 0.4">
                  <div class="box-container">
                    <div class="box-title">
                      Données
                      <i class="material-symbols-outlined size-l">settings</i>
                    </div>
                    <div class="box-content">
                      <div class="container has-text-centered">
                        <span><i class="fa fa-frown fa-3x"></i></span><br>
                        Oups! Pas de données disponibles
                      </div>
                    </div>
                  </div>
                </div>

                <div class="box-account options-bloc" style="opacity: 0.4">
                  <div class="box-container">
                    <div class="box-title">
                      Mes options
                      <i class="material-symbols-outlined size-l">settings</i>
                    </div>
                    <div class="box-content">
                      <div class="container has-text-centered">
                        <span><i class="fa fa-frown fa-3x"></i></span><br>
                        Oups! Pas de données disponibles
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

    <!-- Modales existantes -->
    <ModalActivatePhone 
      @activateValPhone="getActivatePhone" 
      :active="isActivatePhone">
    </ModalActivatePhone>

    <CheckAction 
      :emitter="'rebootClient'" 
      :emitterStatus="'rebootStatus'"
      @rebootStatus="getRebootStatus" 
      @rebootClient="getRebootClient" 
      :active="isRebootClient">
    </CheckAction>
    
    <CheckAction 
      :emitter="'revokeClient'" 
      :emitterStatus="'revokeStatus'"
      @revokeStatus="getRevokeStatus" 
      @revokeClient="getRevokeClient" 
      :active="isRevokeClient">
    </CheckAction>

    <DownloadRevokeClientVPN 
      v-if="currentPhone" 
      @downloadRevokeClient="getDownloadRevokeClient" 
      :client="currentPhone"
      :active="isDownloadRevokeClient">
    </DownloadRevokeClientVPN>

    <DownloadConfigVPN 
      v-if="currentPhone" 
      @downloadClient="getDownloadClient" 
      :client="currentPhone" 
      :active="isDownloadClient">
    </DownloadConfigVPN>
    
    <ModalCommandSpec 
      @activateValComSpec="getActivateValComSpec" 
      :active="isActivateValComSpec">
    </ModalCommandSpec>

    <!-- Nouvelles modales -->
    <ModalScreencapture 
      v-if="selectedPhoneForScreencapture"
      :client="selectedPhoneForScreencapture"
      :connection="selectedConnectionForScreencapture"
      :active="isScreencaptureModal"
      @close="closeScreencapture">
    </ModalScreencapture>

    <ModalSipActions 
      v-if="selectedPhoneForSip"
      :client="selectedPhoneForSip"
      :connection="selectedConnectionForSip"
      :active="isSipActionsModal"
      @close="closeSipActions"
      @actionExecuted="handleSipActionExecuted">
    </ModalSipActions>
  </div>
</template>

<script>
import DownloadConfigVPN from '../../vpn/DownloadConfigVPN.vue'
import ModalActivatePhone from './ActivatePhone.vue'
import ModalCommandSpec from '../../command/CommandSpecificProduct.vue'
import CheckAction from '../../modal/CheckAction.vue'
import DownloadRevokeClientVPN from '../../vpn/DownloadRevokeClientVPN.vue'
import TagInput from '../../modal/TagInput.vue'
import ModalScreencapture from './ModalScreencapture.vue'
import ModalSipActions from './ModalSipActions.vue'

export default {
  name: 'ProductPhone',
  components: {
    ModalActivatePhone,
    ModalCommandSpec,
    CheckAction,
    DownloadRevokeClientVPN,
    DownloadConfigVPN,
    TagInput,
    ModalScreencapture,
    ModalSipActions,
  },

  data() {
    return {
      hoveredClient: null,
      search_badges: [],
      isSearchError: false,
      isActif: false,
      isInactif: false,
      isActivatePhone: false,
      isActivateValComSpec: false,
      currentPhone: null,
      isEditing: null,
      editedCommonName: '',
      isRebootClient: false,
      isRevokeClient: false,
      isDownloadClient: false,
      isDownloadRevokeClient: false,
      rebootingConnection: null,
      isScreencaptureModal: false,
      selectedPhoneForScreencapture: null,
      selectedConnectionForScreencapture: null,
      isSipActionsModal: false,
      selectedPhoneForSip: null,
      selectedConnectionForSip: null,
    }
  },

  watch: {
    filteredClients: {
      handler(newList) {
        if (newList.length > 0 && (!this.currentPhone || !newList.some(item => item.client_id === this.currentPhone.client_id))) {
          this.setcurrentPhone(this.sortedClients(newList)[0]);
        }
      },
      immediate: true,
      deep: true
    }
  },

  computed: {
    clients() {
      return this.$store.getters.phonesOnly;
    },

    filteredClients() {
      let filtered = this.clients;

      if (this.search_badges.length > 0) {
        let s = this.search_badges.join(' ').toLowerCase()
        filtered = filtered.filter(client => {
          return s.toLowerCase().split(' ').every(v =>
            (client.client_label && client.client_label.toLowerCase().includes(v)) ||
            Object.values(client.connections || {}).some(conn => 
              conn.real_ip.toLowerCase().includes(v) ||
              conn.virtual_ip.toLowerCase().includes(v)
            )
          )
        })
      }

      if (this.isActif) {
        filtered = filtered.filter(client => this.hasActiveConnections(client.client_id));
      }

      if (this.isInactif) {
        filtered = filtered.filter(client => !this.hasActiveConnections(client.client_id));
      }

      this.isSearchError = filtered.length === 0;

      return this.sortedClients(filtered);
    },

    currentPhoneConnections() {
      if (!this.currentPhone) return [];
      return Object.entries(this.currentPhone.connections || {}).map(([key, value]) => ({
        key,
        ...value
      }));
    },

    totalClientWithNoConnectedPhones() {
      return this.$store.getters.totalClientWithNoConnectedPhones;
    },

    connectedPhones() {
      return this.$store.getters.totalConnectedPhones;
    },

    totalPhones() {
      return this.$store.getters.totalPhones;
    }
  },

  methods: {
    setcurrentPhone(client) {
      this.currentPhone = client;
    },

    hasActiveConnections(clientId) {
      const client = this.clients.find(c => c.client_id === clientId);
      return client && Object.keys(client.connections || {}).length > 0;
    },

    getActiveConnectionCount(clientId) {
      const client = this.clients.find(c => c.client_id === clientId);
      return client ? Object.keys(client.connections || {}).length : 0;
    },

    getTotalConnections(clientId) {
      const client = this.clients.find(c => c.client_id === clientId);
      return client ? 1 : 0;
    },

    updateIsActif() {
      this.isActif = !this.isActif;
      if (this.isActif && this.isInactif) {
        this.isInactif = false;
      }
    },

    updateIsInActif() {
      this.isInactif = !this.isInactif;
      if (this.isInactif && this.isActif) {
        this.isActif = false;
      }
    },

    async editCommonName(client) {
      this.isEditing = client.client_label;
      this.editedCommonName = client.client_label;
    },

    async saveCommonName(client) {
      if (!this.editedCommonName || this.editedCommonName === client.client_label) {
        this.isEditing = null;
        return;
      }

      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/vpn/client/update/cn?session_id=${this.user.session_id}`,
          {
            params: {
              'cn': client.client_label,
              'new_cn': this.editedCommonName
            }
          }
        );

        if (response.data.result.status === 200) {
          client.client_label = this.editedCommonName;
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Mise à jour effectuée',
            msg: response.data.result.message,
            timeout: 3000,
            type: 'success'
          });
        } else {
          throw new Error(response.data.result.message);
        }
      } catch (error) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur',
          msg: error.message,
          timeout: 3000,
          type: 'error'
        });
      } finally {
        this.isEditing = null;
      }
    },

    rebootClient(connection) {
      this.rebootingConnection = connection;
      this.isRebootClient = true;
    },

    async getRebootStatus(value) {
      if (!value || !this.rebootingConnection) {
        this.isRebootClient = false;
        return;
      }

      this.$loader = true;
      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/ipbx/reboot?session_id=${this.user.session_id}`,
          {
            params: {
              'ip_virtual': this.rebootingConnection.virtual_ip
            }
          }
        );

        if (response.data.result.success) {
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'État Phone',
            msg: 'Le téléphone a été redémarré correctement',
            timeout: 3000,
            type: 'success'
          });
        } else {
          throw new Error('Échec du redémarrage');
        }
      } catch (error) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur',
          msg: 'Une erreur est survenue lors du redémarrage du téléphone',
          timeout: 3000,
          type: 'error'
        });
      } finally {
        this.isRebootClient = false;
        this.rebootingConnection = null;
        this.$loader = false;
      }
    },

    async revokeClient() {
      if (!this.currentPhone) return;
      this.isRevokeClient = true;
    },

    async getRevokeStatus(value) {
      if (!value) {
        this.isRevokeClient = false;
        return;
      }

      this.$loader = true;
      try {
        const response = await this.$axios.post(
          `${process.env.ODOO_API}api/vpn/client/revoke?session_id=${this.user.session_id}`,
          {
            params: {
              id_client: this.currentPhone.id.toString()
            }
          }
        );

        if (response.data.result.success) {
          this.$store.dispatch('revokeClient', this.currentPhone.id);
          this.$toastr.Add({
            name: 'SuccessData',
            title: 'Succès',
            msg: 'Votre client VPN a été révoqué',
            timeout: 3000,
            type: 'success'
          });
          if (this.currentPhone.id === this.currentPhone?.id) {
            this.currentPhone = this.filteredClients[0] || null;
          }
        } else {
          throw new Error('Échec de la révocation');
        }
      } catch (error) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur',
          msg: 'Une erreur est survenue lors de la révocation du client',
          timeout: 3000,
          type: 'error'
        });
      } finally {
        this.isRevokeClient = false;
        this.$loader = false;
      }
    },

    downloadClientVPN() {
      this.isDownloadClient = true;
    },

    getDownloadClient(value) {
      this.isDownloadClient = value;
    },

    getDownloadRevokeClient(value) {
      this.isDownloadRevokeClient = value;
    },

    getRebootClient(value) {
      this.isRebootClient = value;
    },

    getRevokeClient(value) {
      this.isRevokeClient = value;
    },

    activatePhone() {
      this.isActivatePhone = true;
    },

    getActivatePhone(value) {
      this.isActivatePhone = value;
    },

    getActivateValComSpec(value) {
      this.isActivateValComSpec = value;
    },

    goToCommand() {
      this.$loader = true;
      setTimeout(() => {
        this.$router.push('/products/command?type=new');
      }, 1000);
    },

    sortedClients(clients) {
      return [...clients].sort((a, b) => 
        a.client_label.toLowerCase().localeCompare(b.client_label.toLowerCase())
      );
    },

    openScreencapture(client, connection = null) {
      this.selectedPhoneForScreencapture = client;
      this.selectedConnectionForScreencapture = connection || this.getFirstActiveConnection(client);
      this.isScreencaptureModal = true;
    },

    closeScreencapture() {
      this.isScreencaptureModal = false;
      this.selectedPhoneForScreencapture = null;
      this.selectedConnectionForScreencapture = null;
    },

    openSipActions(client, connection = null) {
      this.selectedPhoneForSip = client;
      this.selectedConnectionForSip = connection || this.getFirstActiveConnection(client);
      this.isSipActionsModal = true;
    },

    closeSipActions() {
      this.isSipActionsModal = false;
      this.selectedPhoneForSip = null;
      this.selectedConnectionForSip = null;
    },

    getFirstActiveConnection(client) {
      if (client.connections && Object.keys(client.connections).length > 0) {
        const firstKey = Object.keys(client.connections)[0];
        return {
          key: firstKey,
          ...client.connections[firstKey]
        };
      }
      return null;
    },

    handleSipActionExecuted(actionType, success, message) {
      if (success) {
        this.$toastr.Add({
          name: 'SuccessData',
          title: 'Action SIP',
          msg: message || `Action ${actionType} exécutée avec succès`,
          timeout: 3000,
          type: 'success'
        });
      } else {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur Action SIP',
          msg: message || `Erreur lors de l'exécution de l'action ${actionType}`,
          timeout: 3000,
          type: 'error'
        });
      }
    }
  },
};
</script>

<style scoped>
@keyframes heartbeat {
  0% {
    color: white;
  }
  50% {
    color: #00a4c3;
  }
  100% {
    color: black;
  }
}

.heartbeat {
  animation: heartbeat 3s infinite;
}

.yellow-icon {
  color: yellow;
}

.icon-wrapper {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.icon-wrapper.visible {
  opacity: 1;
}

/* Styles pour améliorer l'affichage des boutons d'action */
.is-admin-secondary-light.is-small {
  padding: 0.2rem 0.3rem;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.is-admin-secondary-light.is-small:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>