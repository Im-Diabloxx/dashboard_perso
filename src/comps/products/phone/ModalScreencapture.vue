<template>
  <div class="modal" :class="{'is-active': active}">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card" style="width: 90vw; max-width: 1200px;">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <i class="material-symbols-outlined mr-2">monitor</i>
          Screencapture - {{ client.client_label }}
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      
      <section class="modal-card-body">
        <div class="screencapture-container">
          <!-- Informations de connexion -->
          <div class="connection-info mb-4">
            <div class="field is-grouped">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">IP</span>
                  <span class="tag is-info">{{ connection.virtual_ip }}</span>
                </div>
              </div>
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-dark">Port</span>
                  <span class="tag is-info">{{ connection.real_port }}</span>
                </div>
              </div>
              <div class="control">
                <button 
                  class="button is-primary" 
                  @click="refreshScreencapture"
                  :class="{'is-loading': isRefreshing}">
                  <i class="material-symbols-outlined mr-1">refresh</i>
                  Actualiser
                </button>
              </div>
            </div>
          </div>

          <!-- Zone d'affichage de l'image -->
          <div class="screencapture-display">
            <div v-if="isLoading && !screencaptureUrl" class="has-text-centered py-6">
              <div class="loader-container">
                <progress class="progress is-primary" max="100">Chargement...</progress>
                <p class="mt-2">Chargement de la capture d'écran...</p>
              </div>
            </div>

            <div v-else-if="error" class="notification is-danger">
              <button class="delete" @click="error = null"></button>
              <strong>Erreur de connexion</strong><br>
              {{ error }}
              <br><br>
              <button class="button is-danger is-outlined" @click="refreshScreencapture">
                <i class="material-symbols-outlined mr-1">refresh</i>
                Réessayer
              </button>
            </div>

            <div v-else-if="screencaptureUrl" class="screencapture-image-container">
              <img 
                :src="screencaptureUrl" 
                alt="Capture d'écran du téléphone"
                class="screencapture-image"
                @load="onImageLoad"
                @error="onImageError"
                :style="imageStyle">
              
              <!-- Contrôles de zoom -->
              <div class="zoom-controls">
                <div class="field has-addons">
                  <div class="control">
                    <button class="button is-small" @click="zoomOut" :disabled="zoomLevel <= 0.5">
                      <i class="material-symbols-outlined">zoom_out</i>
                    </button>
                  </div>
                  <div class="control">
                    <button class="button is-small is-static">
                      {{ Math.round(zoomLevel * 100) }}%
                    </button>
                  </div>
                  <div class="control">
                    <button class="button is-small" @click="zoomIn" :disabled="zoomLevel >= 3">
                      <i class="material-symbols-outlined">zoom_in</i>
                    </button>
                  </div>
                  <div class="control">
                    <button class="button is-small" @click="resetZoom">
                      <i class="material-symbols-outlined">fit_screen</i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Options d'actualisation automatique -->
          <div class="auto-refresh-options mt-4">
            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="autoRefresh" @change="toggleAutoRefresh">
                  Actualisation automatique
                </label>
              </div>
            </div>
            <div class="field" v-if="autoRefresh">
              <label class="label is-small">Intervalle (secondes)</label>
              <div class="control">
                <div class="select is-small">
                  <select v-model="refreshInterval" @change="updateAutoRefresh">
                    <option value="5">5 secondes</option>
                    <option value="10">10 secondes</option>
                    <option value="15">15 secondes</option>
                    <option value="30">30 secondes</option>
                    <option value="60">60 secondes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer class="modal-card-foot">
        <button class="button" @click="closeModal">Fermer</button>
        <button class="button is-primary" @click="refreshScreencapture" :class="{'is-loading': isRefreshing}">
          <i class="material-symbols-outlined mr-1">refresh</i>
          Actualiser maintenant
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalScreencapture',
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
      screencaptureUrl: null,
      isLoading: false,
      isRefreshing: false,
      error: null,
      zoomLevel: 1,
      autoRefresh: false,
      refreshInterval: 10,
      autoRefreshTimer: null,
      imageTimestamp: Date.now()
    }
  },

  computed: {
    imageStyle() {
      return {
        transform: `scale(${this.zoomLevel})`,
        transformOrigin: 'top left',
        transition: 'transform 0.2s ease'
      }
    },

    screencaptureBaseUrl() {
      return `https://${this.connection.virtual_ip}/screencapture`;
    }
  },

  watch: {
    active(newVal) {
      if (newVal) {
        this.loadScreencapture();
      } else {
        this.cleanup();
      }
    }
  },

  methods: {
    closeModal() {
      this.cleanup();
      this.$emit('close');
    },

    cleanup() {
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = null;
      }
      this.autoRefresh = false;
      this.error = null;
    },

    async loadScreencapture() {
      this.isLoading = true;
      this.error = null;
      
      try {
        this.imageTimestamp = Date.now();
        this.screencaptureUrl = `${this.screencaptureBaseUrl}?t=${this.imageTimestamp}`;
      } catch (error) {
        this.error = 'Impossible de charger la capture d\'écran';
        console.error('Erreur lors du chargement de la screencapture:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async refreshScreencapture() {
      if (this.isRefreshing) return;
      
      this.isRefreshing = true;
      this.error = null;
      
      try {
        this.imageTimestamp = Date.now();
        this.screencaptureUrl = `${this.screencaptureBaseUrl}?t=${this.imageTimestamp}`;
      } catch (error) {
        this.error = 'Erreur lors de l\'actualisation';
        console.error('Erreur lors de l\'actualisation:', error);
      } finally {
        this.isRefreshing = false;
      }
    },

    onImageLoad() {
      this.isLoading = false;
      this.isRefreshing = false;
      this.error = null;
    },

    onImageError() {
      this.isLoading = false;
      this.isRefreshing = false;
      this.error = 'Impossible de charger l\'image. Vérifiez que le téléphone est accessible et que les identifiants sont corrects (admin:0000).';
    },

    zoomIn() {
      if (this.zoomLevel < 3) {
        this.zoomLevel = Math.round((this.zoomLevel + 0.25) * 100) / 100;
      }
    },

    zoomOut() {
      if (this.zoomLevel > 0.5) {
        this.zoomLevel = Math.round((this.zoomLevel - 0.25) * 100) / 100;
      }
    },

    resetZoom() {
      this.zoomLevel = 1;
    },

    toggleAutoRefresh() {
      if (this.autoRefresh) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    },

    updateAutoRefresh() {
      if (this.autoRefresh) {
        this.stopAutoRefresh();
        this.startAutoRefresh();
      }
    },

    startAutoRefresh() {
      this.stopAutoRefresh();
      this.autoRefreshTimer = setInterval(() => {
        this.refreshScreencapture();
      }, this.refreshInterval * 1000);
    },

    stopAutoRefresh() {
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = null;
      }
    }
  },

  beforeUnmount() {
    this.cleanup();
  }
};
</script>

<style scoped>
.screencapture-container {
  max-height: 70vh;
  overflow: auto;
}

.connection-info {
  background-color: var(--bulma-scheme-main-bis, #f8f9fa);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--bulma-border, #e9ecef);
}

.screencapture-display {
  position: relative;
  min-height: 400px;
  background-color: var(--bulma-scheme-main-bis, #f8f9fa);
  border: 2px dashed var(--bulma-border, #dee2e6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screencapture-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: var(--bulma-scheme-main, white);
  border-radius: 6px;
}

.screencapture-image {
  max-width: none;
  height: auto;
  display: block;
  cursor: grab;
}

.screencapture-image:active {
  cursor: grabbing;
}

.zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--bulma-scheme-main, rgba(255, 255, 255, 0.9));
  border-radius: 6px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--bulma-border, #e9ecef);
}

.loader-container {
  max-width: 300px;
}

.auto-refresh-options {
  background-color: var(--bulma-scheme-main-bis, #f8f9fa);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--bulma-border, #e9ecef);
}

.auto-refresh-options .field {
  margin-bottom: 0.5rem;
}

.auto-refresh-options .field:last-child {
  margin-bottom: 0;
}
</style>