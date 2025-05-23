<template>
  <div class="modal" :class="{'is-active': active}">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card" style="width: 500px; max-width: 90vw;">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <i class="material-symbols-outlined mr-2">settings_phone</i>
          Actions SIP - {{ client.client_label }}
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      
      <section class="modal-card-body">
        <div class="sip-actions-container">
          <!-- Informations de connexion -->
          <div class="connection-info mb-4">
            <div class="field is-grouped">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">IP</span>
                  <span class="tag is-info">{{ connection.virtual_ip }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions disponibles -->
          <div class="actions-list">
            <div class="action-item" :class="{'is-loading': loadingActions.includes('reboot')}">
              <div class="action-content">
                <div class="action-info">
                  <i class="material-symbols-outlined action-icon reboot-icon">restart_alt</i>
                  <div class="action-text">
                    <h4 class="action-title">Redémarrage</h4>
                    <p class="action-description">Redémarre le téléphone (1-2 min d'indisponibilité)</p>
                  </div>
                </div>
                <button 
                  class="button is-danger is-small" 
                  @click="executeAction('reboot')"
                  :disabled="loadingActions.length > 0">
                  <i class="material-symbols-outlined">restart_alt</i>
                </button>
              </div>
            </div>

            <div class="action-item" :class="{'is-loading': loadingActions.includes('resync')}">
              <div class="action-content">
                <div class="action-info">
                  <i class="material-symbols-outlined action-icon resync-icon">sync</i>
                  <div class="action-text">
                    <h4 class="action-title">Resynchronisation</h4>
                    <p class="action-description">Resync configuration sans redémarrage</p>
                  </div>
                </div>
                <button 
                  class="button is-warning is-small" 
                  @click="executeAction('resync')"
                  :disabled="loadingActions.length > 0">
                  <i class="material-symbols-outlined">sync</i>
                </button>
              </div>
            </div>

            <div class="action-item" :class="{'is-loading': loadingActions.includes('resync_reboot')}">
              <div class="action-content">
                <div class="action-info">
                  <i class="material-symbols-outlined action-icon resync-reboot-icon">sync_alt</i>
                  <div class="action-text">
                    <h4 class="action-title">Resync + Redémarrage</h4>
                    <p class="action-description">Resync puis redémarrage complet</p>
                  </div>
                </div>
                <button 
                  class="button is-primary is-small" 
                  @click="executeAction('resync_reboot')"
                  :disabled="loadingActions.length > 0">
                  <i class="material-symbols-outlined">sync_alt</i>
                </button>
              </div>
            </div>
          </div>

          <!-- Messages de statut -->
          <div v-if="statusMessage" class="notification mt-3" :class="statusMessageType">
            {{ statusMessage }}
          </div>

          <!-- Confirmation pour les actions critiques -->
          <div v-if="pendingAction" class="confirmation-box">
            <div class="notification is-warning">
              <h4 class="title is-6">Confirmation requise</h4>
              <p>Confirmer l'action <strong>{{ getActionDisplayName(pendingAction) }}</strong> ?</p>
              <div class="buttons mt-2">
                <button class="button is-danger is-small" @click="confirmAction()">
                  Confirmer
                </button>
                <button class="button is-light is-small" @click="cancelAction()">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer class="modal-card-foot">
        <button class="button" @click="closeModal">Fermer</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalSipActions',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    client: {
      type: Object,
      required: true
    },
    connection: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loadingActions: [],
      statusMessage: '',
      statusMessageType: '',
      pendingAction: null
    }
  },

  computed: {
    user() {
      return this.$store.getters.user || {};
    }
  },

  methods: {
    closeModal() {
      this.resetState();
      this.$emit('close');
    },

    resetState() {
      this.loadingActions = [];
      this.statusMessage = '';
      this.statusMessageType = '';
      this.pendingAction = null;
    },

    executeAction(actionType) {
      const criticalActions = ['reboot', 'resync_reboot'];
      
      if (criticalActions.includes(actionType)) {
        this.pendingAction = actionType;
        return;
      }

      this.performAction(actionType);
    },

    confirmAction() {
      if (this.pendingAction) {
        this.performAction(this.pendingAction);
        this.pendingAction = null;
      }
    },

    cancelAction() {
      this.pendingAction = null;
    },

    async performAction(actionType) {
      this.loadingActions.push(actionType);
      this.statusMessage = '';
      
      try {
        let response;
        const baseUrl = process.env.ODOO_API;
        const sessionId = this.user.session_id;

        switch (actionType) {
          case 'reboot':
            /*
            response = await this.$axios.post(
              `${baseUrl}api/sip/action/reboot?session_id=${sessionId}`,
              {
                params: {
                  ip_virtual: this.connection.virtual_ip,
                  ip_real: this.connection.real_ip
                }
              }
            );
            */
            break;

          case 'resync':
            /*
            response = await this.$axios.post(
              `${baseUrl}api/sip/action/resync?session_id=${sessionId}`,
              {
                params: {
                  ip_virtual: this.connection.virtual_ip,
                  ip_real: this.connection.real_ip
                }
              }
            );
            */
            break;

          case 'resync_reboot':
            /*
            response = await this.$axios.post(
              `${baseUrl}api/sip/action/resync-reboot?session_id=${sessionId}`,
              {
                params: {
                  ip_virtual: this.connection.virtual_ip,
                  ip_real: this.connection.real_ip
                }
              }
            );
            */
            break;

          default:
            throw new Error('Action non reconnue');
        }

        if (response.data.result && response.data.result.success) {
          this.statusMessage = response.data.result.message || 'Action exécutée avec succès';
          this.statusMessageType = 'is-success';
          this.$emit('actionExecuted', actionType, true, this.statusMessage);
          
          setTimeout(() => {
            if (this.active) {
              this.closeModal();
            }
          }, 2000);
        } else {
          throw new Error(response.data.result?.message || 'Erreur inconnue');
        }

      } catch (error) {
        console.error(`Erreur lors de l'action ${actionType}:`, error);
        
        let errorMessage = 'Une erreur est survenue';
        if (error.response?.data?.result?.message) {
          errorMessage = error.response.data.result.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.statusMessage = errorMessage;
        this.statusMessageType = 'is-danger';
        this.$emit('actionExecuted', actionType, false, errorMessage);
      } finally {
        this.loadingActions = this.loadingActions.filter(action => action !== actionType);
      }
    },

    getActionDisplayName(actionType) {
      const actionNames = {
        'reboot': 'Redémarrage',
        'resync': 'Resynchronisation',
        'resync_reboot': 'Resync + Redémarrage'
      };
      return actionNames[actionType] || actionType;
    }
  }
};
</script>

<style scoped>
.sip-actions-container {
  max-height: 60vh;
  overflow-y: auto;
}

.connection-info {
  background-color: var(--bulma-scheme-main-bis, #f8f9fa);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--bulma-border, #e9ecef);
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  border: 1px solid var(--bulma-border, #e9ecef);
  border-radius: 6px;
  padding: 1rem;
  background: var(--bulma-scheme-main, white);
  transition: all 0.2s ease;
  position: relative;
}

.action-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-item.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.action-item.is-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid var(--bulma-border, #dbdbdb);
  border-radius: 50%;
  border-top-color: var(--bulma-primary, #3273dc);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.action-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.action-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.action-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.reboot-icon {
  color: #f14668;
}

.resync-icon {
  color: #ffdd57;
}

.resync-reboot-icon {
  color: #3273dc;
}

.action-text {
  flex: 1;
}

.action-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--bulma-text-strong, #363636);
}

.action-description {
  color: var(--bulma-text, #757575);
  font-size: 0.875rem;
  line-height: 1.3;
  margin: 0;
}

.confirmation-box {
  margin-top: 1rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.buttons {
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>