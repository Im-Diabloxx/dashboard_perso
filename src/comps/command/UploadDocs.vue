<template>
  <div tabindex="-1" :class="active ? 'modal modalCreateVPNClient is-active' : 'modal modalCreateVPNClient'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Documents administratifs</p>
          <button @click="cancel()" class="delete"></button>
        </div>
        <form>
          <section class="modal-card-body">
            <div>
                <div class="container is-fluid supportDiag">
                    <div>
                        <div class="container is-fluid supportDiag">
                            <div>
                                <div class="level">
                                    <div class="level_title">
                                        Veuillez sélectionner le document que vous voulez rattacher à ce devis?
                                    </div>
                                    <button type="button" class="button diagBtn is-rounded has-icon" @click="triggerFileInput('mandat_portabilite.pdf')">
                                      <span style="font-size: 16px;">Mandat de portabilité</span>
                                    </button>
                                    <button type="button" class="button diagBtn is-rounded has-icon" @click="triggerFileInput('divers.pdf')">
                                      <span style="font-size: 16px;">Autres</span>
                                    </button>
                                </div>

                                <input ref="fileInput" type="file" style="display: none;" @change="onFileSelected">

                                <!-- Display list of uploaded files -->
                                <div v-if="uploadedFiles.length > 0">
                                  <h3>Liste des fichiers:</h3>
                                  <ul>
                                    <li v-for="file in uploadedFiles" :key="file.id" @click="downloadAttachement(file)">
                                      <a>
                                        <span>
                                        {{ file.name }}
                                        </span>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadDocs',
  props: {
    active: Boolean,
    id: Number,
    quotation: String
  },
  data: () => {
    return {
      cnLabel: '',
      email: '',
      documentName: '',
      uploadedFiles: []  // Store the list of uploaded files
    }
  },
  mounted() {
    this.fetchUploadedFiles();
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    triggerFileInput(documentName) {
      this.documentName = documentName;
      this.$refs.fileInput.click();
    },

    async onFileSelected () {
      let fileInput = this.$refs.fileInput.files[0]

      console.log(this.id)

      const formData = new FormData()
      formData.append('ufile', fileInput, this.documentName)
      formData.append('id', this.id.toString())
      formData.append('model', 'sale.order')
      const headers = { 'Content-Type': 'multipart/form-data' }
      await this.$axios.post(process.env.ODOO_API + 'api/tickets/messages/send/file?session_id=' + this.user.session_id, formData, { headers }).then(response => {
        this.fetchUploadedFiles()
      }).catch(error => {
        // Gérer l'erreur
        console.log(error);
      });
    },

    async fetchUploadedFiles () {
      this.uploadedFiles = await this.$axios.post(process.env.ODOO_API + 'api/quotation/attachements?session_id=' + this.user.session_id + '&name=' + this.quotation).then(response => {
        return response.data.list
      })
    },
    async downloadAttachement (file) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', process.env.ODOO_API + 'api/content/ir.attachment/' + (file.id).toString() + '/datas?download=true&session_id=' + this.user.session_id, true)
      xhr.responseType = 'arraybuffer'
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          this.downloadStatus = 200
          let blob = new Blob([xhr.response])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.name
          link.click()
        }
      }
      xhr.send()
    },

    cancel() {
      this.$emit('uploadDocs', false);
    }
  }
}
</script>

<style scoped>
/* Ajoutez vos styles de modal ici */
</style>
