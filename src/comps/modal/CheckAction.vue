<template>
  <div tabindex="-1" :class="active ? 'modal modalCheckAction is-active' : 'modal modalCheckAction'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Action importante !</p>
          <button @click="cancel()" class="delete"></button>
        </div>
        <form>
          <section class="modal-card-body">
            <div class="field" style="text-align: center;">
              <label class="label">Cette action est sans equivoque et vous ne pourrez pas revenir en arriêre.</label>
              <label class="label">Êtes-vous sûr de vouloir faire cela?</label>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">Annuler</button>
            <button type="button" class="button is-admin-primary is-large" @click="isOk()">Oui</button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckAction',
  props: {
    active: Boolean,
    title: String,
    emitter: String,
    emitterStatus: String
  },
  data: () => {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    cancel () {
      this.$emit(this.emitterStatus, false)
      this.$emit(this.emitter, false)
    },
    isOk () {
      this.$emit(this.emitterStatus, true)
      this.$emit(this.emitter, false)
    }
  }
}
</script>

<style scoped>
/* Ajoutez vos styles de modal ici */
</style>
