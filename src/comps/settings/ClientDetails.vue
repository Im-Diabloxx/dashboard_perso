<template>
    <div tabindex="-1" :class="active ? 'modal modalPassW is-active' : 'modal modalPassW'">
      <div class="modal-background"></div>
      <div class="animation-content" style="max-width: 960px;">
        <div class="modal-card">
          <div class="modal-card-head">
            <p class="modal-card-title">
              Description du client
            </p>
            <button @click="cancel()" class="delete"></button>
          </div>
          <form>
            <span>
              <section class="modal-card-body">
                <span style="pointer-events: none;">
                  <div class="field">
                    <label class="label">Nom</label>
                    <div class="control has-icons-right">
                      <input type="text" autocomplete="on" class="input" v-model="localClient.name">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>

                <span style="pointer-events: none;">
                  <div class="field">
                    <label class="label">Société</label>
                    <div class="control has-icons-right">
                      <input type="text" autocomplete="on" class="input" :v-model="localClient.company ? localClient.company : ''">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>

                <span style="pointer-events: none;">
                  <div class="field">
                    <label class="label">Rue</label>
                    <div class="control has-icons-right">
                      <input type="text" autocomplete="on" class="input" v-model="localClient.street">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>

                <span style="pointer-events: none;">
                  <div class="field">
                    <label class="label">Code Postale</label>
                    <div class="control has-icons-right">
                      <input type="text" autocomplete="on" class="input" v-model="localClient.zip">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>

                <span style="pointer-events: none;">
                  <div class="field">
                    <label class="label">Ville</label>
                    <div class="control has-icons-right">
                      <input type="text" autocomplete="on" class="input" v-model="localClient.city">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>

                <span style="pointer-events: none;">
                  <div class="field">
                    <label class="label">Siret</label>
                    <div class="control has-icons-right">
                      <input type="text" autocomplete="on" class="input" v-model="localClient.siret">
                      <span class="icon is-right has-text-primary is-clickable">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18 fa-lg"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" class=""></path></svg>
                      </span>
                    </div>
                    <p class="help"></p>
                  </div>
                </span>

              </section>
              
              <!--
              <footer class="modal-card-foot">
                <button type="button" class="button is-admin-secondary-light is-large" @click="cancel()">
                  Annuler
                </button>
                <button type="button" class="button is-admin-primary is-large" @click="c()">
                  Modifier
                </button>
              </footer>
              -->
            </span>
          </form>
        </div>
      </div>
  </div>
</template>


<script>
export default {
  name: 'CreateDetails',
  props: {
    active: Boolean,
    client: Object
  },
  data: () => {
    return {
      localClient: JSON.parse(JSON.stringify(this.client))
    }
  },
  async created () {
    // await this.getClientInfos()
  },
  watch: {
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    quitClientDetails () {
      this.$emit('showClientDetails', false)
      this.localClient = JSON.parse(JSON.stringify(this.client));
    },
    cancel () {
      this.quitClientDetails()
    }
  },
  mounted () {
    this.$loader = false
  }
}
</script>