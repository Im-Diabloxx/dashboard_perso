<template>
  <div tabindex="-1" :class="active ? 'modal modalCheckResiliation is-active' : 'modal modalCheckResiliation'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Confirmer la résiliation</p>
          <button @click="cancel()" class="delete"></button>
        </div>
        <form>
          <section class="modal-card-body">
            <div class="field" style="text-align: center;">
              <label class="label">Vous êtes sur le point de résilier les numéros suivants :</label>
              <ul class="number-list" style="margin-top: 15px; text-align: left;">
                <li v-for="(number, index) in numbersToResiliate" :key="index" class="number-item">
                  {{ number }}
                </li>
              </ul>
              <p class="warning-text" style="margin-top: 20px;">
                Cette action est irréversible. Êtes-vous sûr de vouloir procéder ?
              </p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">Annuler</button>
            <button type="button" class="button is-admin-primary is-large" @click="confirmResiliation()">Oui, résilier</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckResiliation',
  props: {
    active: Boolean,
    numbersToResiliate: Array, // Liste des numéros à résilier
  },
  methods: {
    cancel() {
      this.$emit('close', false) // Emet un événement pour fermer la modal sans action
    },
    confirmResiliation() {
      this.$emit('confirm', true) // Emet un événement pour confirmer la résiliation
      this.$emit('close', false) // Ferme la modal après confirmation
    }
  }
}
</script>

<style scoped>
.number-list {
  list-style-type: disc;
  margin-left: 20px;
}
.warning-text {
  color: #ff4d4d;
  font-weight: bold;
}
</style>
