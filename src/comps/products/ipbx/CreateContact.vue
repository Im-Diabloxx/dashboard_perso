<template>
  <div :class="active ? 'modal modalCreateContact is-active' : 'modal modalCreateContact'" tabindex="-1">
    <div class="modal-background" @click="cancel"></div>
    <div class="animation-content">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">{{ modalTitle }}</p>
          <button @click="cancel" class="delete"></button>
        </div>

        <div class="modal-card-body">
          <div class="container is-fluid supportDiag" style="height:100%">

            <div v-if="!isManualEntry" class="import-wizard">
              <div class="wizard-progress">
                <div class="wizard-step" :class="{ active: importStep === 1 }" @click="goToStep(1)">
                  <div class="step-number">1</div>
                  <div class="step-name">Sélection du fichier</div>
                </div>
                <div class="wizard-line"></div>
                <div class="wizard-step" :class="{ active: importStep === 2, disabled: !uploadedFileName }" @click="uploadedFileName && goToStep(2)">
                  <div class="step-number">2</div>
                  <div class="step-name">Configuration</div>
                </div>
                <div class="wizard-line"></div>
                <div class="wizard-step" :class="{ active: importStep === 3, disabled: !canGoToStep3 }" @click="canGoToStep3 && goToStep(3)">
                  <div class="step-number">3</div>
                  <div class="step-name">Prévisualisation</div>
                </div>
              </div>

              <div v-if="importStep === 1" class="wizard-content">
                <div class="import-content">
                  <div class="phonebook-selector">
                    <label class="selector-label">Annuaire</label>
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="selectedPhonebookId" class="dropdown-select" style="height: 2.8em !important;">
                          <option v-if="!phonebooks || phonebooks.length === 0" value="">Indéfini</option>
                          <option v-for="pb in phonebooks" :key="pb.id" :value="pb.id">{{ pb.name }}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!--
                  <div class="template-download">
                    <button @click="downloadTemplate" class="button is-info">
                      <i class="material-symbols-outlined">download</i>
                      Télécharger un fichier modèle
                    </button>
                  </div>
                  -->
                  <div
                    class="file-dropzone"
                    :class="{ 'is-dragover': isDragOver }"
                    @dragover.prevent="isDragOver = true"
                    @dragleave.prevent="isDragOver = false"
                    @drop.prevent="handleFileDrop"
                    @click="triggerFileInput"
                  >
                    <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                      class="hidden-input"
                      accept=".csv,.xlsx,.xls"
                    />
                    <div v-if="!uploadedFileName" class="dropzone-content">
                      <i class="material-symbols-outlined dropzone-icon">cloud_upload</i>
                      <p>Glissez-déposez un fichier ici ou cliquez pour en sélectionner un</p>
                      <p class="file-formats">Formats acceptés: .xlsx, .xls, .csv</p>
                    </div>
                    <div v-else class="file-selected">
                      <i class="material-symbols-outlined file-icon">description</i>
                      <p class="file-name">{{ uploadedFileName }}</p>
                      <button
                        class="button is-small is-primary"
                        @click.stop="removeFile"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div class="switch-to-manual">
                    <p>Ou bien vous pouvez</p>
                    <button class="button is-light" @click="switchToManual">
                      Saisir
                    </button>
                  </div>
                </div>

                <div class="wizard-navigation">
                  <button class="button is-light" @click="cancel">Annuler</button>
                  <button
                    class="button is-info"
                    :disabled="!uploadedFileName || !selectedPhonebookId"
                    @click="goToStep(2)"
                  >
                    Continuer
                  </button>
                </div>
              </div>

              <div v-if="importStep === 2" class="wizard-content">
                <div class="wizard-help-text">
                  <i class="material-symbols-outlined info-icon">info</i>
                  <span>Cliquez sur les en-têtes de colonnes pour les configurer. Vous devez définir au moins un prénom ou un nom. Pour passer à l'étape suivante il faut impérativement définir un type de donnée pour chaque colonne utilisée.</span>
                </div>
                
                <div class="excel-configuration">
                  <div class="excel-options">
                    <div class="option-group">
                      <label class="checkbox">
                        <input type="checkbox" v-model="hasHeaderRow" @change="updatePreviewData">
                        Première ligne contient les titres de colonnes
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="excel-container">
                  <div class="excel-header">
                    <div class="file-info">
                      <span class="file-name">{{ uploadedFileName }}</span>
                      <span class="row-count">{{ contactsToUpload.length }} lignes</span>
                    </div>
                    <div class="sheet-tabs">
                      <button class="sheet-tab active">Feuille 1</button>
                    </div>
                  </div>

                  <div class="excel-table-wrapper">
                    <table class="excel-table">
                      <thead>
                        <tr>
                          <th class="row-header" style="border-top: 0">#</th>
                          <th
                            v-for="(column, index) in displayedColumns"
                            :key="index"
                            style="border-top: 0"
                            class="column-header clickable-column"
                            :class="{
                              mapped: columnMapping[index] !== '',
                              unmapped: !filledColumnsStatus[index] && columnsWithData[index],
                              ignored: ignoredColumns[index]
                            }"
                            @click="selectColumn(index)"
                          >
                            <div>{{ column }}</div>
                            <div v-if="columnMapping[index]" class="mapping-indicator">
                              {{ getMappingName(columnMapping[index]) }}
                            </div>
                            <div v-if="ignoredColumns[index]" class="ignored-indicator">
                              Ignorée
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="(row, rowIndex) in displayedPreviewData" :key="rowIndex">
                          <td class="row-index" @click="selectRow(rowIndex)">{{ rowIndex + 1 }}</td>
                          <td
                            v-for="(cell, cellIndex) in row"
                            :key="cellIndex"
                            :class="{
                              mapped: isColumnMapped(cellIndex),
                              unmapped: !filledColumnsStatus[cellIndex] && columnsWithData[cellIndex],
                              'selected-cell': isSelectedCell(rowIndex, cellIndex),
                              'selected-row-cell': isSelectedRow(rowIndex),
                              ignored: ignoredColumns[cellIndex],
                              'validation-error': hasValidationError(rowIndex, cellIndex)
                            }"
                            @click="selectCell(rowIndex, cellIndex)"
                            @dblclick="startEditingCell(rowIndex, cellIndex)"
                            @contextmenu.prevent
                          >
                            <div
                              v-if="
                                editingCell.row === rowIndex &&
                                editingCell.col === cellIndex
                              "
                              class="cell-editor"
                            >
                              <input
                                style="all: unset; font: inherit; width: 100%;"
                                type="text"
                                v-model="editingCell.value"
                                class="input cell-input"
                                @blur="finishEditing"
                                @keyup.enter="finishEditing"
                                @keyup.esc="cancelEditing"
                                v-focus
                              />
                            </div>
                            <div v-else>
                              {{ cell }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="selectedColumnIndex !== null" class="column-config-panel">
                  <div class="panel-header">
                    <h3>Configuration de la colonne "{{ displayedColumns[selectedColumnIndex] }}"</h3>
                    <button @click="selectedColumnIndex = null" class="delete"></button>
                  </div>

                  <div class="panel-body">
                    <div class="panel-row">
                      <div class="panel-col">
                        <div class="panel-section">
                          <label class="panel-label">Type de données</label>
                          <div class="control">
                            <div class="select is-fullwidth">
                              <select
                                v-model="columnMapping[selectedColumnIndex]"
                                class="dropdown-select"
                                @change="updateDataPreview"
                              >
                                <option value="">Non défini</option>
                                <option
                                  v-for="option in mappingOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.name }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="panel-col">
                        <div class="panel-section">
                          <label class="panel-label">Format d'affichage</label>
                          <div class="control">
                            <div class="select is-fullwidth">
                              <select
                                v-model="columnFormat[selectedColumnIndex]"
                                class="dropdown-select"
                                @change="updateDataPreview"
                                :disabled="ignoredColumns[selectedColumnIndex]"
                              >
                                <option value="asIs">Tel quel</option>
                                <option value="upperCase">MAJUSCULES</option>
                                <option value="lowerCase">minuscules</option>
                                <option value="titleCase">Première Lettre En Majuscule</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        class="panel-col"
                        v-if="isPhoneColumn(columnMapping[selectedColumnIndex])"
                      >
                        <div class="panel-section">
                          <label class="panel-label">Format du numéro</label>
                          <div class="control">
                            <div class="select is-fullwidth">
                              <select
                                v-model="phoneFormat[selectedColumnIndex]"
                                class="dropdown-select"
                                @change="updateDataPreview"
                                :disabled="ignoredColumns[selectedColumnIndex]"
                              >
                                <option value="asIs">Tel quel</option>
                                <option value="international">Format international (+33...)</option>
                                <option value="national">Format national (0...)</option>
                                <option value="dotted">Format ponctué (01.23.45.67.89)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="panel-row action-row">
                      <div class="panel-section checkbox-section">
                        <label class="radio">
                          <input
                            type="radio"
                            v-model="columnAction[selectedColumnIndex]"
                            value="none"
                            :disabled="ignoredColumns[selectedColumnIndex]"
                          />
                          Aucune action
                        </label>
                      </div>
                      <div class="panel-section checkbox-section">
                        <label class="radio">
                          <input
                            type="radio"
                            v-model="columnAction[selectedColumnIndex]"
                            value="split"
                            :disabled="ignoredColumns[selectedColumnIndex]"
                          />
                          Diviser cette colonne
                        </label>
                      </div>
                      <div class="panel-section checkbox-section">
                        <label class="radio">
                          <input
                            type="radio"
                            v-model="columnAction[selectedColumnIndex]"
                            value="clean"
                            :disabled="ignoredColumns[selectedColumnIndex]"
                          />
                          Éliminer les séparateurs
                        </label>
                      </div>
                      <div class="panel-section checkbox-section">
                        <label class="checkbox">
                          <input
                            type="checkbox"
                            :checked="ignoredColumns[selectedColumnIndex]"
                            @change="toggleIgnoreColumn"
                          />
                          Ignorer cette colonne
                        </label>
                      </div>
                    </div>
                    <div v-if="columnAction[selectedColumnIndex] === 'split' && !ignoredColumns[selectedColumnIndex]" class="split-options">
                      <div class="panel-section">
                        <label class="panel-label">Séparateur</label>
                        <div class="control has-button">
                          <input
                            type="text"
                            v-model="splitSeparator[selectedColumnIndex]"
                            class="input"
                            placeholder="Espace, virgule, etc."
                          />
                          <button
                            class="button is-info"
                            @click="analyzeSeparators"
                            :disabled="!splitSeparator[selectedColumnIndex]"
                          >
                            Analyser
                          </button>
                        </div>
                      </div>

                      <div v-if="splitFields.length > 0" class="split-fields">
                        <h4 class="split-fields-title">{{ splitFields.length }} champs détectés</h4>
                        <div
                          v-for="(field, idx) in splitFields"
                          :key="idx"
                          class="split-field-item"
                        >
                          <label class="panel-label">Champ {{ idx + 1 }}</label>
                          <div class="control">
                            <div class="select is-fullwidth">
                              <select v-model="field.mapping" class="dropdown-select">
                                <option value="">Non défini</option>
                                <option
                                  v-for="option in mappingOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.name }}
                                </option>
                              </select>
                            </div>
                          </div>
                          <div class="split-field-example">
                            <span class="example-label">Exemple:</span>
                            <span class="example-value">{{ field.example }}</span>
                          </div>
                        </div>
                      </div>

                      <div class="button-section">
                        <button
                          class="button is-primary"
                          @click="applySplit"
                          :disabled="!isSplitReady"
                        >
                          Appliquer la division
                        </button>
                        <button class="button is-light" @click="resetColumnAction">
                          Annuler
                        </button>
                      </div>
                    </div>

                    <div v-if="columnAction[selectedColumnIndex] === 'clean' && !ignoredColumns[selectedColumnIndex]" class="clean-options">
                      <div class="panel-section">
                        <label class="panel-label">Caractères ou texte à éliminer</label>
                        <div class="control">
                          <input
                            type="text"
                            v-model="cleanCharacters[selectedColumnIndex]"
                            class="input"
                            placeholder="Exemple: ,.-/"
                          />
                        </div>
                      </div>

                      <div class="preview-clean">
                        <h4 class="preview-title">Aperçu du résultat</h4>
                        <div
                          v-for="(row, index) in previewCleanRows"
                          :key="index"
                          class="preview-row"
                        >
                          <div class="preview-original">{{ row.original }}</div>
                          <i class="material-symbols-outlined">arrow_forward</i>
                          <div class="preview-transformed">{{ row.transformed }}</div>
                        </div>
                      </div>

                      <div class="button-section">
                        <button
                          class="button is-primary"
                          @click="applyClean"
                          :disabled="!cleanCharacters[selectedColumnIndex]"
                        >
                          Appliquer le nettoyage
                        </button>
                        <button class="button is-light" @click="resetColumnAction">
                          Annuler
                        </button>
                      </div>
                    </div>
                    <div v-if="columnAction[selectedColumnIndex] === 'none' && !ignoredColumns[selectedColumnIndex]" class="preview-box">
                      <label class="panel-label">Aperçu</label>
                      <div
                        v-for="(row, index) in previewRows"
                        :key="index"
                        class="preview-row"
                      >
                        <div class="preview-original">{{ row.original }}</div>
                        <i class="material-symbols-outlined">arrow_forward</i>
                        <div class="preview-transformed">{{ row.transformed }}</div>
                      </div>
                    </div>
                    
                    <div v-if="validationErrors.length > 0 && !ignoredColumns[selectedColumnIndex]" class="validation-errors">
                      <h4 class="validation-errors-title">Erreurs de validation</h4>
                      <ul class="validation-errors-list">
                        <li v-for="(error, index) in validationErrors" :key="index" class="validation-error-item">
                          <i class="material-symbols-outlined error-icon">error</i>
                          <span>{{ error }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="wizard-navigation">
                  <button class="button is-light" @click="goToStep(1)">Retour</button>
                  <button
                    class="button is-info"
                    :disabled="!atLeastOneColumnMapped"
                    @click="preparePreview"
                  >
                    Continuer
                  </button>
                </div>
              </div>

              <div v-if="importStep === 3" class="wizard-content">
                <div class="preview-summary">
                  <div class="summary-header">
                    <h3>Résumé de l'importation</h3>
                    <div class="summary-stats">
                      <div class="stat-item">
                        <span class="stat-label">Contacts à importer :</span>
                        <span class="stat-value">{{ processedContacts.length }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Phonebook :</span>
                        <span class="stat-value">{{ phonebookName }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="preview-container">
                  <div class="contacts-list">
                    <div class="list-header">
                      <h4>Aperçu des contacts</h4>
                      <div class="search-box">
                        <input
                          type="text"
                          v-model="previewSearch"
                          placeholder="Rechercher..."
                          class="input"
                        />
                      </div>
                    </div>

                    <div class="contacts-grid">
                      <div
                        v-for="(contact, index) in filteredPreviewContacts"
                        :key="index"
                        class="contact-card"
                        @click="selectedContactIndex = index"
                        :class="{ selected: selectedContactIndex === index }"
                      >
                        <div class="contact-avatar">
                          <span>{{ getInitials(contact) }}</span>
                        </div>
                        <div class="contact-info">
                          <div class="contact-name">
                            {{ contact.name.GIVEN_NAME }} {{ contact.name.FAMILY_NAME }}
                          </div>
                          <div class="contact-details">
                            <div v-if="contact.phones.length" class="contact-phone">
                              <i class="material-symbols-outlined">phone</i>
                              <span>{{ contact.phones[0].NUMBER }}</span>
                            </div>
                            <div v-if="contact.emails.length" class="contact-email">
                              <i class="material-symbols-outlined">email</i>
                              <span>{{ contact.emails[0].MAIL }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="
                      selectedContactIndex !== null &&
                      filteredPreviewContacts.length > 0
                    "
                    class="contact-details"
                  >
                    <div class="details-header">
                      <h4>Détails du contact</h4>
                      <button @click="selectedContactIndex = null" class="delete"></button>
                    </div>

                    <div class="details-body">
                      <div class="details-section">
                        <h5>Informations personnelles</h5>
                        <div class="details-row">
                          <span class="details-label">Prénom:</span>
                          <span class="details-value">
                            {{ filteredPreviewContacts[selectedContactIndex].name.GIVEN_NAME }}
                          </span>
                        </div>
                        <div class="details-row">
                          <span class="details-label">Nom:</span>
                          <span class="details-value">
                            {{ filteredPreviewContacts[selectedContactIndex].name.FAMILY_NAME }}
                          </span>
                        </div>
                        <div
                          v-if="filteredPreviewContacts[selectedContactIndex].organization.COMPANY"
                          class="details-row"
                        >
                          <span class="details-label">Organisation:</span>
                          <span class="details-value">
                            {{ filteredPreviewContacts[selectedContactIndex].organization.COMPANY }}
                          </span>
                        </div>
                      </div>

                      <div
                        v-if="filteredPreviewContacts[selectedContactIndex].phones.length"
                        class="details-section"
                      >
                        <h5>Téléphones</h5>
                        <div
                          v-for="(phone, idx) in filteredPreviewContacts[selectedContactIndex].phones"
                          :key="idx"
                          class="details-row"
                        >
                          <span class="details-label">{{ getPhoneTypeLabel(phone.TYPE) }}:</span>
                          <span class="details-value">{{ phone.NUMBER }}</span>
                        </div>
                      </div>

                      <div
                        v-if="filteredPreviewContacts[selectedContactIndex].emails.length"
                        class="details-section"
                      >
                        <h5>Emails</h5>
                        <div
                          v-for="(email, idx) in filteredPreviewContacts[selectedContactIndex].emails"
                          :key="idx"
                          class="details-row"
                        >
                          <span class="details-label">Email:</span>
                          <span class="details-value">{{ email.MAIL }}</span>
                        </div>
                      </div>

                      <div
                        v-if="filteredPreviewContacts[selectedContactIndex].postal_address.STREET"
                        class="details-section"
                      >
                        <h5>Adresse</h5>
                        <div class="details-row">
                          <span class="details-value">
                            {{ filteredPreviewContacts[selectedContactIndex].postal_address.STREET }}
                          </span>
                        </div>
                      </div>

                      <div
                        v-if="filteredPreviewContacts[selectedContactIndex].note.NOTE"
                        class="details-section"
                      >
                        <h5>Note</h5>
                        <div class="details-row">
                          <span class="details-value">
                            {{ filteredPreviewContacts[selectedContactIndex].note.NOTE }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="wizard-navigation">
                  <button class="button is-light" @click="goToStep(2)">Retour</button>
                  <button class="button is-info" @click="validateContact">
                    Importer les contacts
                  </button>
                </div>
              </div>
            </div>

            <div v-if="isManualEntry">
              <div class="level" style="overflow-y: auto">
                <component
                  :is="'EditContact'"
                  :contact="newContactData"
                  :active="true"
                  @createContact="saveChanges"
                  @closeModal="isManualEntry = false"
                  :isCreate="true"
                  :phonebooks="phonebooks"
                />
              </div>
              <div class="wizard-navigation" style="margin-top: 1rem;">
                <button class="button is-light" @click="backToImport">
                  Retour
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>  
    </div>
  </div>
</template>
<script>
import * as XLSX from "xlsx"
import EditContact from './EditContact.vue'

export default {
  name: 'CreateContact',
  props: {
    active: Boolean,
    defaultPhonebookId: Number,
    phonebooks: Array
  },
  components: {
    EditContact
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  },
  data() {
    return {
      isManualEntry: false,
      isImport: false,
      importStep: 1,
      newContactData: null,
      columnsDetected: [],
      displayedColumns: [],
      columnMapping: [],
      columnFormat: [],
      phoneFormat: [],
      columnAction: [],
      splitSeparator:[],
      splitFields: [],
      cleanCharacters: [],
      contactsToUpload: [],
      previewData: [],
      displayedPreviewData: [],
      originalData: [],
      uploadedFileName: "",
      isDragOver: false,
      selectedColumnIndex: null,
      processedContacts: [],
      selectedContactIndex: null,
      previewSearch: "",
      filledColumnsStatus: [],
      columnsWithData: [],
      editingCell: { row: null, col: null, value: "" },
      showContextMenu: false,
      contextMenuStyle: { top: '0px', left: '0px' },
      contextMenuCell: { row: null, col: null },
      selectedCell: { row: null, col: null },
      selectedRow: null,
      hasHeaderRow: true,
      ignoredColumns: [],
      cellValidationErrors: {},
      selectedPhonebookId: "",
      mappingOptions: [
        { value: 'firstname', name: 'Prénom' },
        { value: 'lastname', name: 'Nom' },
        { value: 'email', name: 'Email' },
        { value: 'phone_mobile', name: 'Téléphone Mobile' },
        { value: 'phone_home', name: 'Téléphone Domicile' },
        { value: 'phone_work', name: 'Téléphone Bureau' },
        { value: 'phone_abbreviated', name: 'Numéro abrégé' },
        { value: 'organization', name: 'Organisation' },
        { value: 'address', name: 'Adresse' },
        { value: 'note', name: 'Note' }
      ]
    }
  },
  watch: {
    phonebooks: {
      deep: true,
      handler() {
        this.$forceUpdate();
      }
    },
    defaultPhonebookId: {
      immediate: true,
      handler(val) {
        if (val && !this.selectedPhonebookId) {
          this.selectedPhonebookId = val.toString();
        }
      }
    }
  },
  computed: {
    modalTitle() {
      return `Ajout de contact dans "${this.phonebookName}"`
    },
    phonebookName() {
      if (!this.phonebooks || !this.phonebooks.length) return "Indéfini";
      const p = this.phonebooks.find(x => x.id === this.selectedPhonebookId);
      return p ? p.name : "Indéfini";
    },
    hasMinimumMapping() {
      const nonIgnoredColumnMapping = this.columnMapping.filter((mapping, index) => !this.ignoredColumns[index])
      return nonIgnoredColumnMapping.some(m => m === 'firstname' || m === 'lastname')
    },
    allColumnsFilled() {
      return !this.columnsWithData.some((hasData, i) => 
        hasData && !this.columnMapping[i] && !this.ignoredColumns[i]
      )
    },
    canGoToStep3() {
      return this.uploadedFileName && 
             this.hasMinimumMapping && 
             this.allColumnsFilled && 
             !this.hasValidationErrors
    },
    atLeastOneColumnMapped() {
      return this.columnMapping.some((mapping, i) => !!mapping && !this.ignoredColumns[i]);
    },
    filteredPreviewContacts() {
      const s = this.previewSearch.trim().toLowerCase()
      if (!s) return this.processedContacts
      return this.processedContacts.filter(contact => {
        let combined = ''
        combined += (contact.name.GIVEN_NAME || '') + ' '
        combined += (contact.name.FAMILY_NAME || '') + ' '
        for (const p of contact.phones) {
          combined += (p.NUMBER || '') + ' '
        }
        for (const e of contact.emails) {
          combined += (e.MAIL || '') + ' '
        }
        combined += (contact.organization.COMPANY || '') + ' '
        combined += (contact.postal_address.STREET || '') + ' '
        combined += (contact.note.NOTE || '') + ' '
        return combined.toLowerCase().includes(s)
      })
    },
    isSplitReady() {
      if (this.selectedColumnIndex === null || !this.splitFields.length) return false
      return this.splitFields.some(field => field.mapping !== "")
    },
    previewRows() {
      if (this.selectedColumnIndex === null || !this.displayedPreviewData.length) return []
      const i = this.selectedColumnIndex
      return this.displayedPreviewData.slice(0, 3).map(row => {
        const original = row[i] || ''
        const transformed = this.formatPreviewValue(original, i)
        return { original, transformed }
      })
    },
    previewCleanRows() {
      if (
        this.selectedColumnIndex === null ||
        !this.displayedPreviewData.length ||
        !this.cleanCharacters[this.selectedColumnIndex]
      ) return []
      const i = this.selectedColumnIndex
      const separator = this.cleanCharacters[i]
      return this.displayedPreviewData.slice(0, 3).map(row => {
        const original = row[i] || ''
        const transformed = this.cleanValue(original, separator)
        return { original, transformed }
      })
    },
    validationErrors() {
      if (this.selectedColumnIndex === null) return []
      
      const errors = []
      const columnType = this.columnMapping[this.selectedColumnIndex]
      const columnIndex = this.selectedColumnIndex
      
      if (!columnType || this.ignoredColumns[columnIndex]) return []
      
      const validationErrorsForColumn = Object.entries(this.cellValidationErrors)
        .filter(([key, _]) => key.endsWith(`_${columnIndex}`))
        .map(([_, error]) => error)
      
      return [...new Set(validationErrorsForColumn)]
    },
    hasValidationErrors() {
      return Object.keys(this.cellValidationErrors).length > 0
    }
  },
  mounted() {
    this.activateImport()
    document.addEventListener('click', this.hideContextMenu)
    document.addEventListener('keydown', this.handleKeyDown)
    this.initializeResponsiveModal()
    window.addEventListener('resize', this.adjustModalSize)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideContextMenu)
    document.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('resize', this.adjustModalSize)
  },
  methods: {
    initializeResponsiveModal() {
      this.adjustModalSize()
    },
    adjustModalSize() {
      const modalCard = document.querySelector('.modalCreateContact .modal-card')
      const modalContent = document.querySelector('.modalCreateContact .animation-content')
      
      if (modalCard && modalContent) {
        const maxWidth = Math.min(window.innerWidth * 0.95, 1200)
        const maxHeight = window.innerHeight * 0.85
        
        modalCard.style.width = `${maxWidth}px`
        modalCard.style.height = `${maxHeight}px`
        modalContent.style.width = `${maxWidth}px`
        modalContent.style.height = `${maxHeight}px`
      }
    },
    backToImport() {
      this.isManualEntry = false
      this.isImport = true
    },
    switchToManual() {
      this.isManualEntry = true
      this.isImport = false
      this.newContactData = {
        id_contact: '',
        phonebook: this.selectedPhonebookId,
        name: {
          GIVEN_NAME: '',
          FAMILY_NAME: '',
          PREFIX: '',
          MIDDLE_NAME: '',
          SUFFIX: '',
          PHONETIC_GIVEN_NAME: '',
          PHONETIC_FAMILY_NAME: ''
        },
        nickname: { NAME: '' },
        organization: {
          COMPANY: '',
          TITLE: '',
          DEPARTMENT: '',
          JOB_DESCRIPTION: '',
          SYMBOL: '',
          PHONETIC_NAME: '',
          OFFICE_LOCATION: ''
        },
        postal_address: {
          STREET: '',
          POBOX: '',
          NEIGHBORHOOD: '',
          CITY: '',
          REGION: '',
          POSTCODE: '',
          COUNTRY: ''
        },
        phones: [],
        emails: [],
        websites: [],
        ims: [],
        note: { NOTE: '' },
        photo: { PHOTO: null, PHOTO_FILE_ID: null },
        additionalData: null,
        color: null,
        phone_book_name: this.phonebookName
      }
    },
    handleKeyDown(e) {
      if (this.editingCell.row !== null) return

      if (this.selectedCell.row !== null && this.selectedCell.col !== null) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          this.deleteSelectedCell()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (this.selectedCell.row > 0) {
            this.selectCell(this.selectedCell.row - 1, this.selectedCell.col)
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (this.selectedCell.row < this.displayedPreviewData.length - 1) {
            this.selectCell(this.selectedCell.row + 1, this.selectedCell.col)
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          if (this.selectedCell.col > 0) {
            this.selectCell(this.selectedCell.row, this.selectedCell.col - 1)
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          if (this.selectedCell.col < this.displayedColumns.length - 1) {
            this.selectCell(this.selectedCell.row, this.selectedCell.col + 1)
          }
        } else if (e.key === 'Enter') {
          e.preventDefault()
          this.startEditingCell(this.selectedCell.row, this.selectedCell.col)
        }
      }
      
      if (this.selectedRow !== null) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          this.deleteSelectedRow()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (this.selectedRow > 0) {
            this.selectRow(this.selectedRow - 1)
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (this.selectedRow < this.displayedPreviewData.length - 1) {
            this.selectRow(this.selectedRow + 1)
          }
        }
      }
    },
    deleteSelectedCell() {
      if (this.selectedCell.row === null || this.selectedCell.col === null) return
      
      const row = this.selectedCell.row
      const col = this.selectedCell.col
      
      if (this.ignoredColumns[col]) return
      
      this.displayedPreviewData[row][col] = ''
      this.originalData[row][col] = ''
      
      this.shiftCellsUp(row, col)
      this.validateAllCells()
    },
    deleteSelectedRow() {
      if (this.selectedRow === null) return
      
      this.displayedPreviewData.splice(this.selectedRow, 1)
      this.originalData.splice(this.selectedRow, 1)
      this.contactsToUpload.splice(this.selectedRow, 1)
      
      if (this.selectedRow >= this.displayedPreviewData.length) {
        this.selectedRow = this.displayedPreviewData.length > 0 ? this.displayedPreviewData.length - 1 : null
      }
      
      this.validateAllCells()
      this.$forceUpdate()
    },
    shiftCellsUp(startRow, col) {
      for (let i = startRow; i < this.displayedPreviewData.length - 1; i++) {
        this.displayedPreviewData[i][col] = this.displayedPreviewData[i + 1][col]
        this.originalData[i][col] = this.originalData[i + 1][col]
      }
      
      if (this.displayedPreviewData.length > 0) {
        const lastRow = this.displayedPreviewData.length - 1
        this.displayedPreviewData[lastRow][col] = ''
        this.originalData[lastRow][col] = ''
      }
      
      for (let i = 0; i < this.displayedPreviewData.length; i++) {
        this.validateCellData(i, col)
      }
    },
    selectRow(rowIndex) {
      this.selectedCell = { row: null, col: null }
      this.selectedRow = this.selectedRow === rowIndex ? null : rowIndex
      this.cancelEditing()
    },
    isSelectedRow(rowIndex) {
      return this.selectedRow === rowIndex
    },
    updateAllFilledStatus() {
      this.filledColumnsStatus = this.columnMapping.map((mapping, index) => {
        return !!mapping || !this.columnsWithData[index] || this.ignoredColumns[index]
      })
    },
    updateDataPreview() {
      this.updateFilledStatus()
      this.reapplyFormats()
      this.validateAllCells()
    },
    validateAllCells() {
      this.cellValidationErrors = {}
      
      for (let r = 0; r < this.displayedPreviewData.length; r++) {
        for (let c = 0; c < this.displayedPreviewData[r].length; c++) {
          if (!this.ignoredColumns[c]) {
            this.validateCellData(r, c)
          }
        }
      }
    },
    validateCellData(row, col) {
      const value = this.displayedPreviewData[row][col]
      const columnType = this.columnMapping[col]
      const errorKey = `${row}_${col}`
      
      if (this.ignoredColumns[col] || !columnType || (!value && value !== 0)) {
        delete this.cellValidationErrors[errorKey]
        return true
      }
      
      if (columnType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.toString())) {
          this.cellValidationErrors[errorKey] = `Format d'email invalide (exemple: nom@domaine.com)`
          return false
        }
      } else if (this.isPhoneColumn(columnType)) {
        const phoneFormat = this.phoneFormat[col]
        const phoneVal = value.toString()
        
        if (phoneFormat === 'international' || phoneFormat === 'asIs') {
          const intlRegex = /^\+[0-9]{10,15}$/
          if (!intlRegex.test(phoneVal) && !phoneVal.startsWith('+')) {
            this.cellValidationErrors[errorKey] = `Le numéro doit être au format international (+33...)`
            return false
          }
        } else if (!phoneVal.match(/^[0-9+().]{8,}$/)) {
          this.cellValidationErrors[errorKey] = `Format de numéro invalide`
          return false
        }
      }
      
      delete this.cellValidationErrors[errorKey]
      return true
    },
    hasValidationError(row, col) {
      const errorKey = `${row}_${col}`
      return this.cellValidationErrors[errorKey] !== undefined
    },
    reapplyFormats() {
      const newData = JSON.parse(JSON.stringify(this.originalData))
      for (let r = 0; r < newData.length; r++) {
        for (let c = 0; c < newData[r].length; c++) {
          if (!this.ignoredColumns[c]) {
            const val = newData[r][c]
            newData[r][c] = this.formatPreviewValue(val, c)
          } else {
            newData[r][c] = ''
          }
        }
      }
      this.displayedPreviewData = newData
    },
    activateImport() {
      this.isManualEntry = false
      this.isImport = true
      this.importStep = 1
      
      if (this.defaultPhonebookId && !this.selectedPhonebookId) {
        this.selectedPhonebookId = this.defaultPhonebookId.toString()
      }
    },
    triggerFileInput() {
      if (!this.uploadedFileName) this.$refs.fileInput.click()
    },
    handleFileDrop(e) {
      this.isDragOver = false
      const file = e.dataTransfer.files[0]
      if (file) {
        this.$refs.fileInput.files = e.dataTransfer.files
        this.handleFileUpload({ target: this.$refs.fileInput })
      }
    },
    handleFileUpload(e) {
      const file = e.target.files[0]
      this.uploadedFileName = file ? file.name : ""
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => {
        try {
          const data = new Uint8Array(ev.target.result)
          const workbook = XLSX.read(data, { type: 'array', raw: true })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          let sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })
          
          if (sheetData.length < 1) {
            this.$toastr.Add({
              name: 'ErrorData',
              title: 'Le fichier semble vide.',
              clickClose: true,
              timeout: 3000,
              progressBarValue: 0,
              position: 'toast-top-right',
              type: 'error',
              preventDuplicates: true,
              classNames: ['animated', 'slideInRight'],
              style: { 'margin-top': '20%' }
            });
            this.removeFile()
            return
          }
          
          this.originalSheetData = JSON.parse(JSON.stringify(sheetData))
          this.updatePreviewData()
        } catch (error) {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Erreur de lecture du fichier.',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'error',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          });
          this.removeFile()
        }
      }
      reader.readAsArrayBuffer(file)
    },
    updatePreviewData() {
      if (!this.originalSheetData || !this.originalSheetData.length) return
      
      let sheetData = JSON.parse(JSON.stringify(this.originalSheetData))
      
      let headerRow
      let dataRows
      
      if (this.hasHeaderRow) {
        headerRow = sheetData[0]
        dataRows = sheetData.slice(1)
      } else {
        headerRow = Array(sheetData[0].length).fill('').map((_, i) => `Colonne ${i+1}`)
        dataRows = sheetData
      }
      
      const validIndices = []
      const validNames = []
      
      headerRow.forEach((h, i) => {
        const trimmed = String(h || '').trim()
        validIndices.push(i)
        validNames.push(trimmed !== '' ? trimmed : `Colonne ${i+1}`)
      })
      
      this.columnsDetected = validNames
      
      const filteredData = dataRows.map(r => {
        return validIndices.map(i => r[i] !== undefined ? r[i] : '')
      })
      
      this.contactsToUpload = filteredData.filter(r => r.some(cell => cell !== ''))
      this.previewData = [...this.contactsToUpload]
      this.displayedColumns = [...this.columnsDetected]
      this.originalData = JSON.parse(JSON.stringify(this.contactsToUpload))
      this.displayedPreviewData = JSON.parse(JSON.stringify(this.contactsToUpload))
      this.selectedColumnIndex = null
      this.processedContacts = []
      this.selectedContactIndex = null
      this.previewSearch = ""
      this.splitFields = []
      this.cellValidationErrors = {}
      this.selectedCell = { row: null, col: null }
      this.selectedRow = null
      
      this.initializeMappingArrays()
      this.detectColumnsWithData()
    },
    removeFile() {
      this.uploadedFileName = ""
      this.columnsDetected = []
      this.displayedColumns = []
      this.contactsToUpload = []
      this.previewData = []
      this.displayedPreviewData = []
      this.originalData = []
      this.columnsWithData = []
      this.filledColumnsStatus = []
      this.ignoredColumns = []
      this.cellValidationErrors = {}
      this.originalSheetData = null
      this.selectedCell = { row: null, col: null }
      this.selectedRow = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ""
    },
    goToStep(step) {
      if (step === 2 && this.importStep === 1) {
        if (!this.uploadedFileName || !this.selectedPhonebookId) return
        
        if (!this.displayedColumns.length) {
          this.initializeMappingArrays()
          this.detectColumnsWithData()
        }
      } else if (step === 3) {
        if (!this.canGoToStep3) return
        this.preparePreview()
      }
      
      this.importStep = step
    },
    initializeMappingArrays() {
      const c = this.displayedColumns.length
      this.columnMapping = Array(c).fill("")
      this.columnFormat = Array(c).fill("asIs")
      this.phoneFormat = Array(c).fill("asIs")
      this.columnAction = Array(c).fill("none")
      this.splitSeparator = Array(c).fill("")
      this.cleanCharacters = Array(c).fill("")
      this.filledColumnsStatus = Array(c).fill(false)
      this.ignoredColumns = Array(c).fill(false)
      this.autoMapColumns()
    },
    detectColumnsWithData() {
      this.columnsWithData = this.displayedColumns.map((_, i) => {
        return this.displayedPreviewData.some(
          row => row[i] !== undefined && row[i] !== null && row[i] !== ''
        )
      })
      this.filledColumnsStatus = this.columnMapping.map((m, i) => {
        return !!m || !this.columnsWithData[i] || this.ignoredColumns[i]
      })
    },
    autoMapColumns() {
      const rules = {
        firstname: ["prénom", "prenom", "firstname", "given name", "givenname", "first"],
        lastname: ["nom", "lastname", "surname", "family name", "familyname", "last"],
        email: ["email", "courriel", "mail", "e-mail"],
        phone_mobile: ["mobile", "portable", "cellulaire", "cell", "gsm"],
        phone_home: ["domicile", "home", "maison", "personnel"],
        phone_work: ["bureau", "work", "office", "professionnel", "travail"],
        phone_abbreviated: ["abrégé", "abrege", "abbreviated", "short", "court"],
        organization: ["organisation", "company", "entreprise", "société", "societe", "compagnie"],
        address: ["adresse", "address", "street", "rue"],
        note: ["note", "commentaire", "comment", "remarks", "remarque"]
      }
      this.columnMapping = this.displayedColumns.map((col, i) => {
        if (!col) return ""
        const c = col.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        for (const [mapKey, vals] of Object.entries(rules)) {
          if (vals.some(v => c.includes(v))) {
            this.filledColumnsStatus[i] = true
            return mapKey
          }
        }
        return ""
      })
    },
    toggleIgnoreColumn() {
      if (this.selectedColumnIndex === null) return
      
      const index = this.selectedColumnIndex
      this.ignoredColumns[index] = !this.ignoredColumns[index]
      
      if (this.ignoredColumns[index]) {
        Object.keys(this.cellValidationErrors).forEach(key => {
          if (key.endsWith(`_${index}`)) {
            delete this.cellValidationErrors[key]
          }
        })
      } else {
        for (let i = 0; i < this.displayedPreviewData.length; i++) {
          this.validateCellData(i, index)
        }
      }
      
      this.updateFilledStatus()
      this.reapplyFormats()
    },
    selectCell(row, col) {
      this.selectedRow = null
      if (this.selectedCell.row === row && this.selectedCell.col === col) {
        this.startEditingCell(row, col)
        return
      }
      this.selectedCell = { row, col }
      this.cancelEditing()
    },
    isSelectedCell(row, col) {
      return this.selectedCell.row === row && this.selectedCell.col === col
    },
    startEditingCell(row, col) {
      if (this.ignoredColumns[col]) return
      
      if (this.editingCell.row === row && this.editingCell.col === col) return
      this.finishEditing()
      this.editingCell = { row, col, value: this.displayedPreviewData[row][col] || "" }
    },
    finishEditing() {
      if (this.editingCell.row !== null && this.editingCell.col !== null) {
        this.displayedPreviewData[this.editingCell.row][this.editingCell.col] = this.editingCell.value
        this.originalData[this.editingCell.row][this.editingCell.col] = this.editingCell.value
        this.validateCellData(this.editingCell.row, this.editingCell.col)
      }
      this.editingCell = { row: null, col: null, value: "" }
    },
    cancelEditing() {
      this.editingCell = { row: null, col: null, value: "" }
    },
    hideContextMenu() {
      this.showContextMenu = false
    },
    selectColumn(index) {
      this.selectedColumnIndex = index
      this.hideContextMenu()
    },
    updateFilledStatus() {
      if (this.selectedColumnIndex !== null) {
        this.filledColumnsStatus[this.selectedColumnIndex] =
          !!this.columnMapping[this.selectedColumnIndex] || this.ignoredColumns[this.selectedColumnIndex]
      }
    },
    getMappingName(value) {
      const opt = this.mappingOptions.find(o => o.value === value)
      return opt ? opt.name : "Non défini"
    },
    isColumnMapped(i) {
      return this.columnMapping[i] !== '' && !this.ignoredColumns[i]
    },
    isPhoneColumn(m) {
      return ['phone_mobile', 'phone_home', 'phone_work', 'phone_abbreviated'].includes(m)
    },
    analyzeSeparators() {
      if (this.selectedColumnIndex === null) return
      const i = this.selectedColumnIndex
      const sep = this.splitSeparator[i]
      if (!sep) {
        this.splitFields = []
        return
      }
      let samples = this.displayedPreviewData
        .slice(0, 10)
        .filter(r => r[i] && String(r[i]).includes(sep))
      if (samples.length === 0) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Aucune donnée avec ce séparateur dans les premières lignes.',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
        this.splitFields = []
        return
      }
      if (sep === " ") {
        this.handleSpaceSeparator(i, samples)
        return
      }
      let maxParts = 0
      let best = 0
      samples.forEach((row, idx) => {
        const parts = String(row[i]).split(sep).length
        if (parts > maxParts) {
          maxParts = parts
          best = idx
        }
      })
      const row = samples[best]
      const parts = String(row[i]).split(sep)
      this.splitFields = parts.map((p, idx) => ({
        index: idx,
        example: p.trim(),
        mapping: ""
      }))
    },
    handleSpaceSeparator(i, samples) {
      let guessName = false
      const clower = this.displayedColumns[i].toLowerCase()
      if (clower.includes('nom') || clower.includes('name')) guessName = true
      if (guessName) {
        const row = samples[0]
        const val = String(row[i])
        const sp = val.indexOf(' ')
        if (sp > 0) {
          const firstName = val.substring(0, sp)
          const lastName = val.substring(sp + 1)
          this.splitFields = [
            { index: 0, example: firstName, mapping: "firstname" },
            { index: 1, example: lastName, mapping: "lastname" }
          ]
          return
        }
      }
      const row = samples[0]
      const parts = String(row[i]).split(" ")
      const limit = parts.length > 2 ? [parts[0], parts.slice(1).join(' ')] : parts
      this.splitFields = limit.map((p, idx) => ({
        index: idx,
        example: p.trim(),
        mapping: ""
      }))
    },
    applySplit() {
      if (this.selectedColumnIndex === null || !this.splitFields.length) return
      const i = this.selectedColumnIndex
      const sep = this.splitSeparator[i]
      const colName = this.displayedColumns[i]
      const newCols = this.splitFields.map((_, idx) => colName + '_' + (idx + 1))
      const newMaps = this.splitFields.map(field => field.mapping)
      
      const newOriginalData = this.originalData.map(row => {
        let parts
        if (sep === " " && this.splitFields.length === 2) {
          const v = String(row[i] || '')
          const sp = v.indexOf(' ')
          if (sp > 0) {
            parts = [v.substring(0, sp), v.substring(sp + 1)]
          } else {
            parts = [v, '']
          }
        } else {
          parts = String(row[i] || '').split(sep)
        }
        const newRow = row.slice(0, i)
        for (let j = 0; j < this.splitFields.length; j++) {
          newRow.push(j < parts.length ? parts[j].trim() : '')
        }
        newRow.push(...row.slice(i + 1))
        return newRow
      })
      
      const newDisplayedData = newOriginalData.map(row => row.slice())

      this.displayedColumns.splice(i, 1)
      this.columnMapping.splice(i, 1)
      this.columnFormat.splice(i, 1)
      this.phoneFormat.splice(i, 1)
      this.columnAction.splice(i, 1)
      this.splitSeparator.splice(i, 1)
      this.cleanCharacters.splice(i, 1)
      this.filledColumnsStatus.splice(i, 1)
      this.columnsWithData.splice(i, 1)
      this.ignoredColumns.splice(i, 1)

      this.displayedColumns.splice(i, 0, ...newCols)
      this.columnMapping.splice(i, 0, ...newMaps)

      const fm = Array(newCols.length).fill("asIs")
      const pf = Array(newCols.length).fill("asIs")
      const act = Array(newCols.length).fill("none")
      const sp = Array(newCols.length).fill("")
      const cl = Array(newCols.length).fill("")
      const fill = newMaps.map(m => !!m)
      const cdata = Array(newCols.length).fill(true)
      const ignored = Array(newCols.length).fill(false)

      this.columnFormat.splice(i, 0, ...fm)
      this.phoneFormat.splice(i, 0, ...pf)
      this.columnAction.splice(i, 0, ...act)
      this.splitSeparator.splice(i, 0, ...sp)
      this.cleanCharacters.splice(i, 0, ...cl)
      this.filledColumnsStatus.splice(i, 0, ...fill)
      this.columnsWithData.splice(i, 0, ...cdata)
      this.ignoredColumns.splice(i, 0, ...ignored)
      
      this.originalData = newOriginalData
      this.displayedPreviewData = newDisplayedData

      this.selectedColumnIndex = null
      this.splitFields = []
      
      this.cellValidationErrors = {}
      this.validateAllCells()
      this.reapplyFormats()
    },
    cleanValue(value, separator) {
      if (!value) return value
      let result = String(value)
      if (separator) {
        result = result.split(separator).join('')
      }
      return result
    },
    applyClean() {
      if (this.selectedColumnIndex === null) return
      const i = this.selectedColumnIndex
      const separator = this.cleanCharacters[i]
      if (!separator) return

      this.originalData = this.originalData.map(row => {
        const newRow = [...row]
        if (newRow[i]) newRow[i] = this.cleanValue(newRow[i], separator)
        return newRow
      })
      
      this.reapplyFormats()
      this.columnAction[i] = "none"
      this.selectedColumnIndex = null
      
      for (let r = 0; r < this.displayedPreviewData.length; r++) {
        this.validateCellData(r, i)
      }
    },
    resetColumnAction() {
      if (this.selectedColumnIndex === null) return
      this.columnAction[this.selectedColumnIndex] = "none"
      this.splitFields = []
    },
    formatPreviewValue(value, i) {
      if (value === undefined || value === null) return ''
      if (value === 0) return '0'
      if (!value && value !== 0) return ''
      if (this.ignoredColumns[i]) return ''
      
      let v = String(value)
      const f = this.columnFormat[i]
      if (f === 'upperCase') {
        v = v.toUpperCase()
      } else if (f === 'lowerCase') {
        v = v.toLowerCase()
      } else if (f === 'titleCase') {
        v = v.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
      }
      
      const columnType = this.columnMapping[i]
      
      if (this.isPhoneColumn(columnType)) {
        const phf = this.phoneFormat[i]
        if (phf === 'international') {
          if (v.startsWith('0')) v = '+33' + v.substring(1)
        } else if (phf === 'national') {
          if (v.startsWith('+33')) v = '0' + v.substring(3)
        } else if (phf === 'dotted') {
          v = v.replace(/(\d{2})(?=\d)/g, '$1.')
        }
      }
      
      return v
    },
    downloadTemplate() {
      const headers = [
        [
          "Prénom",
          "Nom",
          "Email",
          "Téléphone Mobile",
          "Téléphone Domicile",
          "Téléphone Bureau",
          "Numéro abrégé",
          "Organisation",
          "Adresse",
          "Note"
        ]
      ]
      const csv = headers.map(r => r.join(",")).join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "template_contacts.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    preparePreview() {
      try {
        const result = this.contactsToUpload
          .map((orig, index) => {
            const contact = {
              id_contact: '',
              phonebook: parseInt(this.selectedPhonebookId),
              name: { GIVEN_NAME: '', FAMILY_NAME: '' },
              phones: [],
              emails: [],
              organization: { COMPANY: '' },
              postal_address: { STREET: '' },
              note: { NOTE: '' },
              photo: { PHOTO: null }
            }
            const row = index < this.displayedPreviewData.length
              ? this.displayedPreviewData[index]
              : orig

            this.columnMapping.forEach((m, c) => {
              if (!m || c >= row.length || this.ignoredColumns[c]) return
              const rawValue = row[c]
              if (!rawValue && rawValue !== 0) return
              const value = this.formatPreviewValue(rawValue, c)

              if (m === 'firstname') contact.name.GIVEN_NAME = value
              else if (m === 'lastname') contact.name.FAMILY_NAME = value
              else if (m === 'email') contact.emails.push({ MAIL: value })
              else if (m === 'phone_mobile') {
                let phoneValue = value
                if (!phoneValue.startsWith('+') && phoneValue.startsWith('0')) {
                  phoneValue = '+33' + phoneValue.substring(1)
                }
                contact.phones.push({ NUMBER: String(phoneValue), TYPE: 'TYPE_MOBILE' })
              }
              else if (m === 'phone_home') {
                let phoneValue = value
                if (!phoneValue.startsWith('+') && phoneValue.startsWith('0')) {
                  phoneValue = '+33' + phoneValue.substring(1)
                }
                contact.phones.push({ NUMBER: String(phoneValue), TYPE: 'TYPE_HOME' })
              }else if (m === 'phone_work') {
                let phoneValue = value
                if (!phoneValue.startsWith('+') && phoneValue.startsWith('0')) {
                  phoneValue = '+33' + phoneValue.substring(1)
                }
                contact.phones.push({ NUMBER: String(phoneValue), TYPE: 'TYPE_WORK' })
              }
              else if (m === 'phone_abbreviated') {
                let phoneValue = value
                if (!phoneValue.startsWith('+') && phoneValue.startsWith('0')) {
                  phoneValue = '+33' + phoneValue.substring(1)
                }
                contact.phones.push({ NUMBER: String(phoneValue), TYPE: 'TYPE_ABBREVIATED' })
              }
              else if (m === 'organization') contact.organization.COMPANY = value
              else if (m === 'address') contact.postal_address.STREET = value
              else if (m === 'note') contact.note.NOTE = value
            })
            return contact
          })
          .filter(c => {
            return (
              c.name.GIVEN_NAME ||
              c.name.FAMILY_NAME ||
              c.emails.length > 0 ||
              c.phones.length > 0
            )
          })
        this.processedContacts = result
        this.importStep = 3
        this.selectedContactIndex = result.length > 0 ? 0 : null
      } catch (error) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur lors de la préparation des contacts.',
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
    },
    getInitials(contact) {
      const f = contact.name.GIVEN_NAME || ''
      const l = contact.name.FAMILY_NAME || ''
      if (!f && !l) return '?'
      return (f.charAt(0) || '').toUpperCase() + (l.charAt(0) || '').toUpperCase()
    },
    getPhoneTypeLabel(t) {
      const map = {
        TYPE_MOBILE: 'Mobile',
        TYPE_HOME: 'Domicile',
        TYPE_WORK: 'Bureau',
        TYPE_ABBREVIATED: 'Abrégé'
      }
      return map[t] || 'Téléphone'
    },
    validateContact() {
      if (this.processedContacts.length === 0) {
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Aucun contact valide à importer.',
          clickClose: true,
          timeout: 3000,
          progressBarValue: 0,
          position: 'toast-top-right',
          type: 'error',
          preventDuplicates: true,
          classNames: ['animated', 'slideInRight'],
          style: { 'margin-top': '20%' }
        });
        return
      }
      this.$emit('createMultipleContact', this.processedContacts)
      this.cancel()
    },
    cancel() {
      this.$emit('closeModal', false)
      this.resetFields()
    },
    saveChanges(val) {
      this.isManualEntry = false
      this.$emit('createContact', val)
      this.newContactData = null
    },
    resetFields() {
      this.isManualEntry = false
      this.isImport = false
      this.importStep = 1
      this.newContactData = null
      this.columnsDetected = []
      this.displayedColumns = []
      this.columnMapping = []
      this.contactsToUpload = []
      this.uploadedFileName = ''
      this.isDragOver = false
      this.selectedColumnIndex = null
      this.previewData = []
      this.displayedPreviewData = []
      this.originalData = []
      this.processedContacts = []
      this.selectedContactIndex = null
      this.previewSearch = ""
      this.columnFormat = []
      this.phoneFormat = []
      this.columnAction = []
      this.splitSeparator = []
      this.cleanCharacters = []
      this.splitFields = []
      this.filledColumnsStatus = []
      this.columnsWithData = []
      this.editingCell = { row: null, col: null, value: "" }
      this.showContextMenu = false
      this.contextMenuCell = { row: null, col: null }
      this.selectedCell = { row: null, col: null }
      this.selectedRow = null
      this.hasHeaderRow = true
      this.originalSheetData = null
      this.ignoredColumns = []
      this.cellValidationErrors = {}
      this.selectedPhonebookId = null
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    }
  }
}
</script>

<style scoped>
.modalCreateContact .modal-card {
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  height: auto;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.modal-card-head {
  color: #fff;
  border-bottom: 1px solid #394760;
}
.modal-card-body {
  background-color: var(--inner-section);
  color: #fff;
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
}
.animation-content {
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  height: auto;
  animation: modalFadeIn 0.3s ease-out;
}
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.level_title {
  font-weight: bold;
  font-size: 1.3em;
  margin-bottom: 1.5em;
  text-align: center;
  color: #fff;
}
.import-wizard {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.wizard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.wizard-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(30, 42, 56, 0.6);
  border-radius: 8px;
}
.wizard-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}
.wizard-step.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.wizard-step .step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #394760;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.wizard-step.active .step-number {
  background-color: #1c84c6;
  color: white;
}
.wizard-line {
  flex-grow: 1;
  height: 2px;
  background-color: #394760;
  margin: 0 10px;
  position: relative;
  top: -18px;
}
.wizard-step .step-name {
  font-size: 0.9em;
  text-align: center;
  color: #fff;
}
.wizard-step.active .step-name {
  color: #1c84c6;
  font-weight: bold;
}
.wizard-help-text {
  display: flex;
  align-items: center;
  background-color: rgba(28, 132, 198, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #1c84c6;
}
.info-icon {
  color: #1c84c6;
  margin-right: 0.75rem;
  font-size: 24px;
}
.import-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  flex: 1;
}
.phonebook-selector {
  width: 100%;
  max-width: 600px;
  margin-bottom: 1.5rem;
  text-align: left;
}
.selector-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #c8d1e0;
}
.template-download {
  margin-bottom: 1.5rem;
}
.file-dropzone {
  width: 100%;
  max-width: 600px;
  height: 200px;
  border: 2px dashed #394760;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  position: relative;
  background-color: #1e2a38;
}
.file-dropzone:hover,
.file-dropzone.is-dragover {
  border-color: #1c84c6;
  background-color: rgba(231, 76, 60, 0.1);
}
.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
}
.dropzone-icon {
  font-size: 48px;
  margin-bottom: 1rem;
  color: #7a8599;
}
.file-formats {
  font-size: 0.8em;
  color: #7a8599;
  margin-top: 0.5rem;
}
.hidden-input {
  display: none;
}
.file-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
.file-icon {
  font-size: 36px;
  margin-bottom: 1rem;
  color: #1c84c6;
}
.file-name {
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fff;
}
.switch-to-manual {
  text-align: center;
}
.switch-to-manual p {
  margin-bottom: 0.5rem;
}
.excel-configuration {
  margin-bottom: 1rem;
  background-color: #1e2a38;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #394760;
}
.excel-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.option-group {
  margin-right: 2rem;
}
.checkbox {
  color: #fff;
  display: flex;
  align-items: center;
}
.checkbox input {
  margin-right: 0.5rem;
}
.excel-container {
  background-color: #1e2a38;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid #394760;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  max-height: 300px;
}
.excel-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #394760;
  border-bottom: 1px solid #4a5d7c;
  z-index: 20;
}
.file-info {
  display: flex;
  align-items: center;
}
.file-name {
  font-weight: bold;
  margin-right: 1rem;
}
.row-count {
  color: #c8d1e0;
  font-size: 0.9em;
}
.sheet-tabs {
  display: flex;
}
.sheet-tab {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-bottom: none;
  cursor: pointer;
  background-color: transparent;
  color: #fff;
}
.sheet-tab.active {
  background-color: #4a5d7c;
  border-color: #5a6d8c;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
}
.excel-table-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
}
.excel-table {
  width: 100%;
  border-collapse: collapse;
}
.excel-table th,
.excel-table td {
  padding: 8px;
  border: 1px solid #394760;
  text-align: left;
  color: #fff;
  vertical-align: middle;
}
.excel-table th {
  background-color: #394760;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
}
.excel-table thead {
  position: sticky;
  top: 0;
  z-index: 20;
}
.excel-table thead::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-bottom: 2px solid #4a5d7c;
}
.row-header,
.row-index {
  font-weight: bold;
  background-color: #394760;
  text-align: center;
  width: 40px;
  position: sticky;
  left: 0;
  z-index: 11;
}
.row-header {
  z-index: 22;
}
.row-index {
  cursor: pointer;
}
.row-index:hover {
  background-color: #4a5d7c;
}
.column-header {
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: sticky;
  top: 0;
  background-color: #394760;
  z-index: 21;
}
.clickable-column {
  position: relative;
}
.clickable-column::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}
.clickable-column:hover::before {
  opacity: 1;
}
.column-header:hover {
  background-color: #4a5d7c;
}
.column-header.mapped {
  background-color: rgb(0, 200, 81);
  color: white;
}
.column-header.unmapped {
  background-color: rgb(231, 76, 60);
  color: white;
}
.column-header.ignored {
  background-color: rgb(128, 128, 128);
  color: white;
}
.mapping-indicator {
  font-size: 0.8em;
  color: white;
}
.ignored-indicator {
  font-size: 0.8em;
  color: #7a8599;
  font-style: italic;
}
.excel-table td.mapped {
  background-color: rgba(0, 200, 81, 0.1);
}
.excel-table td.unmapped {
  background-color: rgba(231, 76, 60, 0.1);
}
.excel-table td.ignored {
  background-color: rgba(128, 128, 128, 0.1);
  color: #7a8599;
  font-style: italic;
}
.excel-table td.validation-error {
  background-color: rgba(231, 76, 60, 0.3);
}
.selected-cell {
  outline: 2px solid #1c84c6;
  background-color: rgba(28, 132, 198, 0.15) !important;
}
.selected-row-cell {
  background-color: rgba(28, 132, 198, 0.15) !important;
  outline: 1px solid #1c84c6;
}
.cell-editor {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.cell-input {
  width: 100%;
  box-sizing: border-box;
}
.wizard-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #394760;
}
.input,
.select,
.select select {
  background-color: rgba(30, 42, 56, 0.8);
  color: #fff;
  border-color: #394760;
}
.dropdown-select {
  background-color: #394760 !important;
  color: #fff !important;
}
.dropdown-select option {
  background-color: #394760 !important;
  color: #fff !important;
}
.input:focus,
.select select:focus {
  border-color: #1c84c6;
  box-shadow: 0 0 0 0.125em rgba(231, 76, 60, 0.25);
}
.select:after {
  border-color: #7a8599;
}
.button.is-primary {
  background-color: #1c84c6;
}
.button.is-primary:hover {
  background-color: #C0392B;
}
.button.is-info {
  background-color: #3498db;
}
.button.is-info:hover {
  background-color: #2980b9;
}
.button.is-light {
  background-color: #394760;
  color: #fff;
}
.button.is-light:hover {
  background-color: #4a5d7c;
}
.button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.unfilled-warning {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #1c84c6;
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.warning-icon {
  color: #1c84c6;
  font-size: 24px;
  margin-right: 0.75rem;
}
.validation-errors {
  margin-top: 1rem;
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 0.75rem;
}
.validation-errors-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #e74c3c;
}
.validation-errors-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.validation-error-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}
.validation-error-item:last-child {
  margin-bottom: 0;
}
.error-icon {
  color: #e74c3c;
  margin-right: 0.5rem;
  font-size: 18px;
}
.preview-summary {
  margin-bottom: 1.5rem;
  background-color: #1e2a38;
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #394760;
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-header h3 {
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
}
.summary-stats {
  display: flex;
  gap: 2rem;
}
.stat-item {
  display: flex;
  align-items: center;
}
.stat-label {
  color: #c8d1e0;
  margin-right: 0.5rem;
}
.stat-value {
  background-color: #1c84c6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-weight: bold;
}
.preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
  height: 400px;
}
@media (max-width: 768px) {
  .preview-container {
    grid-template-columns: 1fr;
    height: auto;
  }
}
.contacts-list {
  background-color: #1e2a38;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #394760;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #394760;
  border-bottom: 1px solid #4a5d7c;
}
.list-header h4 {
  margin: 0;
  font-weight: bold;
  color: #fff;
}
.search-box {
  width: 250px;
}
@media (max-width: 576px) {
  .search-box {
    width: 150px;
  }
}
.contacts-grid {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.75rem;
}
.contact-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 0.5rem;
}
.contact-card:hover {
  background-color: rgba(57, 71, 96, 0.5);
}
.contact-card.selected {
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 3px solid #1c84c6;
}
.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1c84c6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 1rem;
}
.contact-info {
  flex-grow: 1;
}
.contact-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #fff;
}
.contact-details {
  font-size: 0.9em;
  color: #7a8599;
}
.contact-phone,
.contact-email {
  display: flex;
  align-items: center;
}
.contact-phone i,
.contact-email i {
  font-size: 16px;
  margin-right: 0.5rem;
}
.contact-details {
  background-color: #1e2a38;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #394760;
  height: 100%;
  display: flex;
  flex-direction: column;
}
@media (max-width: 768px) {
  .contact-details {
    height: 300px;
  }
}
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #394760;
  border-bottom: 1px solid #4a5d7c;
}
.details-header h4 {
  margin: 0;
  font-weight: bold;
  color: #fff;
}
.details-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}
.details-section {
  margin-bottom: 1.5rem;
}
.details-section h5 {
  font-weight: bold;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #394760;
  color: #c8d1e0;
}
.details-row {
  margin-bottom: 0.5rem;
  display: flex;
}
.details-label {
  font-weight: bold;
  width: 120px;
  flex-shrink: 0;
  color: #7a8599;
}
.details-value {
  flex-grow: 1;
  color: #fff;
}
.column-config-panel {
  background-color: #1e2a38;
  border: 1px solid #394760;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #394760;
  border-radius: 8px 8px 0 0;
}
.panel-header h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
  color: #fff;
}
.panel-body {
  padding: 1.5rem;
}
.panel-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
@media (max-width: 992px) {
  .panel-row {
    flex-direction: column;
  }
}
.panel-col {
  flex: 1;
  min-width: 0;
  width: 33.33%;
}
@media (max-width: 992px) {
  .panel-col {
    width: 100%;
  }
}
.action-row {
  margin-top: 1rem;
  border-top: 1px solid #394760;
  padding-top: 1rem;
}
.panel-section {
  margin-bottom: 1.2rem;
}
.panel-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #c8d1e0;
}
.checkbox-section,
.radio {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.checkbox-section input,
.radio input {
  margin-right: 0.5rem;
}
.control.has-button {
  display: flex;
  gap: 0.5rem;
}
.split-options,
.clean-options {
  background-color: rgba(57, 71, 96, 0.3);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #394760;
}
.split-fields {
  margin: 1.5rem 0;
}
.split-fields-title {
  font-weight: bold;
  color: #c8d1e0;
  margin-bottom: 1rem;
}
.split-field-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #394760;
}
.split-field-item:last-child {
  border-bottom: none;
}
.split-field-example {
  margin-top: 0.5rem;
  font-size: 0.9em;
}
.example-label {
  color: #7a8599;
  margin-right: 0.5rem;
}
.example-value {
  color: #1c84c6;
  font-weight: bold;
}
.button-section {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
@media (max-width: 576px) {
  .button-section {
    flex-direction: column;
  }
}
.preview-box,
.preview-clean {
  background-color: rgba(57, 71, 96, 0.3);
  border-radius: 4px;
  padding: 0.5rem;
  border: 1px solid #394760;
  margin-top: 1rem;
}
.preview-title {
  font-weight: bold;
  color: #c8d1e0;
  margin-bottom: 0.5rem;
}
.preview-row {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #394760;
}
.preview-row:last-child {
  border-bottom: none;
}
.preview-original {
  color: #7a8599;
  margin-right: 1rem;
}
.preview-transformed {
  font-weight: bold;
  margin-left: 1rem;
  flex-grow: 1;
  color: #1c84c6;
}
.unfilled-warning {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #1c84c6;
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.warning-icon {
  color: #1c84c6;
  font-size: 24px;
  margin-right: 0.75rem;
}
</style>