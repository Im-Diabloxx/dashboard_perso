<template>
  <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
    <div class="admin-box" v-if="user && user.allowed_routes && user.allowed_routes.includes('sim')">
      <div class="container is-max-widescreen">

        <h1 style="margin-top: 40px; margin-left: 0px;">
            <a @click="goToProducts()" class="router-link-active">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                    <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                        <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                    </g>
                </svg>
            </a>
                Mes consommations 
            <span>
                : SIM n°{{$route.query.name}}
            </span>
        </h1>

        <!-- Cartes de résumé -->
        <div style="margin-top: 20px" class="summary-cards" v-if="summaryData">
          <div class="summary-card">
            <div class="card-icon consumption-icon">
              <i class="material-symbols-outlined">data_usage</i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ formatData(summaryData.totalConsumed) }}</div>
              <div class="card-label">Consommation totale</div>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon included-icon">
              <i class="material-symbols-outlined">check_circle</i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ formatData(summaryData.totalIncluded) }}</div>
              <div class="card-label">Volume inclus</div>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon overage-icon">
              <i class="material-symbols-outlined">warning</i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ formatData(summaryData.totalOverage) }}</div>
              <div class="card-label">Hors forfait</div>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="card-icon cost-icon">
              <i class="material-symbols-outlined">euro</i>
            </div>
            <div class="card-content">
              <div class="card-value">{{ summaryData.totalCost }}€</div>
              <div class="card-label">Coût hors forfait</div>
            </div>
          </div>
        </div>

        <!-- Contrôles du graphique -->
        <div class="chart-controls">
          <div class="controls-section">
            <h3>Période d'analyse</h3>
            <div class="time-controls">
              <div class="preset-buttons">
                <button 
                  v-for="preset in timePresets" 
                  :key="preset.key"
                  class="button" 
                  :class="{'is-primary': selectedPreset === preset.key}"
                  @click="selectTimePreset(preset.key)">
                  {{ preset.label }}
                </button>
              </div>
              
              <div class="custom-range" v-if="selectedPreset === 'custom'">
                <div class="field is-grouped">
                  <div class="control">
                    <label class="label is-small">Du</label>
                    <input class="input is-small" type="date" v-model="customStartDate">
                  </div>
                  <div class="control">
                    <label class="label is-small">Au</label>
                    <input class="input is-small" type="date" v-model="customEndDate">
                  </div>
                  <div class="control">
                    <button class="button is-primary is-small" @click="applyCustomRange">
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="controls-section">
            <h3>Type de données</h3>
            <div class="data-type-controls">
              <label v-for="dataType in dataTypes" :key="dataType.key" class="checkbox-card">
                <input type="checkbox" v-model="selectedDataTypes" :value="dataType.key">
                <span class="checkmark" :style="`--color: ${dataType.color}`"></span>
                <span class="checkbox-label">{{ dataType.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Graphique principal -->
        <div class="chart-container">
          <div class="chart-header">
            <h3>Évolution de la consommation</h3>
            <div class="chart-legend">
              <div v-for="dataType in activeDataTypes" :key="dataType.key" class="legend-item">
                <span class="legend-color" :style="`background-color: ${dataType.color}`"></span>
                <span class="legend-label">{{ dataType.label }}</span>
              </div>
            </div>
          </div>
          
          <div class="chart-wrapper" v-if="chartData.length > 0">
            <canvas ref="consumptionChart" class="consumption-chart"></canvas>
          </div>
          
          <div v-else class="no-data-message">
            <i class="material-symbols-outlined">info</i>
            <p>Aucune donnée disponible pour la période sélectionnée</p>
          </div>
        </div>

        <!-- Tableau détaillé (optionnel) -->
        <div class="detailed-table" v-if="showDetailedTable">
          <div class="table-header">
            <h3>Détail des consommations</h3>
            <button class="button is-small is-light" @click="showDetailedTable = false">
              <i class="material-symbols-outlined">close</i>
            </button>
          </div>
          
          <div class="table-container">
            <div class="field table-mobile-sort">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <span class="select is-fullwidth">
                    <select v-model="sortField">
                      <option value="consommation_date">Date</option>
                      <option value="consommation_type">Type</option>
                      <option value="consommation_volume">Volume inclus</option>
                      <option value="consommation_volume_max">Seuil</option>
                      <option value="consommation_volume_out">Hors forfait</option>
                      <option value="consommation_volume_out_price">Coût (HT)</option>
                    </select>
                  </span>
                </div>
                <div class="control">
                  <button class="button is-primary" @click="toggleSortDirection">
                    <span class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                      <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <table class="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th @click="setSortField('consommation_date')" class="is-sortable">
                    <div class="th-wrap">
                      Date
                      <span v-if="sortField === 'consommation_date'" class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                        <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                      </span>
                    </div>
                  </th>
                  <th @click="setSortField('consommation_type')" class="is-sortable">
                    <div class="th-wrap">
                      Type
                      <span v-if="sortField === 'consommation_type'" class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                        <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                      </span>
                    </div>
                  </th>
                  <th @click="setSortField('consommation_volume')" class="is-sortable">
                    <div class="th-wrap">
                      Volume inclus
                      <span v-if="sortField === 'consommation_volume'" class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                        <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                      </span>
                    </div>
                  </th>
                  <th @click="setSortField('consommation_volume_max')" class="is-sortable">
                    <div class="th-wrap">
                      Seuil
                      <span v-if="sortField === 'consommation_volume_max'" class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                        <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                      </span>
                    </div>
                  </th>
                  <th @click="setSortField('consommation_volume_out')" class="is-sortable">
                    <div class="th-wrap">
                      Hors forfait
                      <span v-if="sortField === 'consommation_volume_out'" class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                        <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                      </span>
                    </div>
                  </th>
                  <th @click="setSortField('consommation_volume_out_price')" class="is-sortable">
                    <div class="th-wrap">
                      Coût (HT)
                      <span v-if="sortField === 'consommation_volume_out_price'" class="icon is-small" :class="{'is-desc': sortDirection === 'desc'}">
                        <i class="material-symbols-outlined">{{ sortDirection === 'desc' ? 'arrow_downward' : 'arrow_upward' }}</i>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in sortedData" :key="index">
                  <td data-label="Date">{{ formatDate(item.consommation_date) }}</td>
                  <td data-label="Type">
                    <span class="tag" :style="getTypeColor(item.consommation_type)">
                      {{ item.consommation_type }}
                    </span>
                  </td>
                  <td data-label="Volume inclus">{{ formatData(item.consommation_volume) }}</td>
                  <td data-label="Seuil">{{ formatData(item.consommation_volume_max) }}</td>
                  <td data-label="Hors forfait">{{ formatData(item.consommation_volume_out) }}</td>
                  <td data-label="Coût (HT)" class="has-text-weight-bold">{{ item.consommation_volume_out_price }}€</td>
                </tr>
                <tr v-if="sortedData.length === 0">
                  <td colspan="6" class="has-text-centered">Aucune donnée disponible</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bouton pour afficher le tableau détaillé -->
        <div class="table-toggle" v-if="!showDetailedTable && filteredData.length > 0">
          <button class="button is-outlined" @click="showDetailedTable = true">
            <i class="material-symbols-outlined mr-2">table_view</i>
            Voir le détail des consommations
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConsommationSim',
  props: {
    msg: String,
    tab: Boolean
  },
  
  data() {
    return {
      infos: [],
      resource: '',
      chartInstance: null,
      selectedPreset: '30d',
      customStartDate: '',
      customEndDate: '',
      selectedDataTypes: ['volume', 'overage'],
      showDetailedTable: false,
      sortField: 'consommation_date',
      sortDirection: 'desc',
      
      timePresets: [
        { key: '7d', label: '7 jours', days: 7 },
        { key: '30d', label: '30 jours', days: 30 },
        { key: '90d', label: '3 mois', days: 90 },
        { key: '180d', label: '6 mois', days: 180 },
        { key: '365d', label: '1 an', days: 365 },
        { key: 'custom', label: 'Personnalisé', days: null }
      ],
      
      dataTypes: [
        { key: 'volume', label: 'Volume inclus', color: '#3273dc' },
        { key: 'overage', label: 'Hors forfait', color: '#ff3860' },
        { key: 'threshold', label: 'Seuil', color: '#ffdd57' },
        { key: 'cost', label: 'Coût', color: '#48c774' }
      ]
    }
  },

  computed: {
    user() {
      return this.$store.getters.getUser
    },

    activeDataTypes() {
      return this.dataTypes.filter(type => this.selectedDataTypes.includes(type.key))
    },

    filteredData() {
      if (!this.infos || !Array.isArray(this.infos)) return []
      
      let filtered = [...this.infos]
      const now = new Date()
      let startDate = new Date()

      if (this.selectedPreset === 'custom') {
        if (this.customStartDate && this.customEndDate) {
          startDate = new Date(this.customStartDate)
          const endDate = new Date(this.customEndDate)
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.consommation_date)
            return itemDate >= startDate && itemDate <= endDate
          })
        }
      } else {
        const preset = this.timePresets.find(p => p.key === this.selectedPreset)
        if (preset && preset.days) {
          startDate.setDate(now.getDate() - preset.days)
          filtered = filtered.filter(item => {
            const itemDate = new Date(item.consommation_date)
            return itemDate >= startDate
          })
        }
      }

      return filtered
    },

    sortedData() {
      const data = [...this.filteredData]
      
      return data.sort((a, b) => {
        let valueA, valueB
        
        // Gérer les différents types de valeurs
        if (this.sortField === 'consommation_date') {
          valueA = new Date(a[this.sortField])
          valueB = new Date(b[this.sortField])
        } else if (['consommation_volume', 'consommation_volume_max', 'consommation_volume_out', 'consommation_volume_out_price'].includes(this.sortField)) {
          valueA = parseFloat(a[this.sortField]) || 0
          valueB = parseFloat(b[this.sortField]) || 0
        } else {
          valueA = a[this.sortField]
          valueB = b[this.sortField]
        }
        
        // Appliquer le tri en fonction de la direction
        if (this.sortDirection === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
    },

    chartData() {
      return this.filteredData.map(item => ({
        date: item.consommation_date,
        volume: parseFloat(item.consommation_volume) || 0,
        overage: parseFloat(item.consommation_volume_out) || 0,
        threshold: parseFloat(item.consommation_volume_max) || 0,
        cost: parseFloat(item.consommation_volume_out_price) || 0,
        type: item.consommation_type
      }))
    },

    summaryData() {
      if (!this.filteredData.length) return null
      
      return {
        totalConsumed: this.filteredData.reduce((sum, item) => sum + (parseFloat(item.consommation_volume) || 0), 0),
        totalIncluded: this.filteredData.reduce((sum, item) => {
          // Ne prendre que la valeur max pour éviter la duplication
          return Math.max(sum, parseFloat(item.consommation_volume_max) || 0)
        }, 0),
        totalOverage: this.filteredData.reduce((sum, item) => sum + (parseFloat(item.consommation_volume_out) || 0), 0),
        totalCost: this.filteredData.reduce((sum, item) => sum + (parseFloat(item.consommation_volume_out_price) || 0), 0).toFixed(2)
      }
    }
  },

  watch: {
    chartData: {
      handler() {
        this.$nextTick(() => {
          this.updateChart()
        })
      },
      deep: true
    },
    selectedDataTypes() {
      this.$nextTick(() => {
        this.updateChart()
      })
    }
  },

  async mounted() {
    this.$loader = false
    this.resource = this.$route.query.name
    
    // Attendre que les CDN se chargent
    await this.waitForDependencies()
    
    await this.getInfos()
    
    // Attendre que le DOM soit mis à jour
    this.$nextTick(() => {
      this.initChart()
    })
  },

  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  },

  methods: {
    async waitForDependencies() {
      // Attendre que Chart.js soit chargé
      let attempts = 0
      const maxAttempts = 50
      const intervalTime = 100
      
      return new Promise(resolve => {
        const checkDependency = () => {
          if (typeof Chart !== 'undefined') {
            console.log('Chart.js est déjà chargé')
            resolve()
            return
          }
          
          attempts++
          if (attempts >= maxAttempts) {
            console.warn('Chart.js n\'a pas pu être chargé automatiquement, tentative de chargement manuel')
            this.loadChartJS().then(resolve)
            return
          }
          
          setTimeout(checkDependency, intervalTime)
        }
        
        checkDependency()
      })
    },

    async loadChartJS() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
        script.onload = () => {
          console.log('Chart.js chargé dynamiquement')
          resolve()
        }
        script.onerror = (error) => {
          console.error('Erreur lors du chargement de Chart.js', error)
          reject(error)
        }
        document.head.appendChild(script)
      })
    },

    async getInfos() {
      try {
        const response = await this.$axios.get(
          `${process.env.ODOO_API}api/v2/sim/balances/details?resource=${this.resource}`,
          { params: { session_id: this.user.session_id } }
        )
        
        if (response.data && response.data.response === false) {
          this.infos = []
        } else {
          this.infos = response.data.data || []
        }
        
        console.log("Données reçues:", this.infos)
        
        // Créer des données de test si aucune donnée n'est disponible
        if (this.infos.length === 0) {
          this.createTestData()
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos de consommations:', error)
        this.$toastr.Add({
          name: 'ErrorData',
          title: 'Erreur',
          msg: 'Impossible de récupérer les informations de consommation',
          timeout: 3000,
          type: 'error'
        })
        
        // Créer des données de test en cas d'erreur
        this.createTestData()
      }
      this.$loader = false
    },
    
    // Créer des données de test si aucune donnée n'est disponible
    createTestData() {
      console.log("Création de données de test pour visualisation")
      const now = new Date()
      const testData = []
      
      // Générer des données pour les 30 derniers jours
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Consommation progressive
        const volume = Math.round(50 + (i * 25))
        const max = 800
        const out = Math.max(0, volume - max)
        const price = out * 0.05
        
        testData.push({
          consommation_date: dateStr,
          consommation_type: i % 10 === 0 ? 'DEMANDÉ' : (i % 5 === 0 ? 'ÉCHEC' : 'RÉUSSI'),
          consommation_volume: volume.toString(),
          consommation_volume_max: max.toString(),
          consommation_volume_out: out.toString(),
          consommation_volume_out_price: price.toFixed(2)
        })
      }
      
      this.infos = testData
    },

    goToProducts() {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products')
      }, 1000)
    },

    selectTimePreset(presetKey) {
      this.selectedPreset = presetKey
      if (presetKey !== 'custom') {
        this.customStartDate = ''
        this.customEndDate = ''
      }
    },

    applyCustomRange() {
      if (this.customStartDate && this.customEndDate) {
        if (new Date(this.customStartDate) > new Date(this.customEndDate)) {
          this.$toastr.Add({
            name: 'ErrorData',
            title: 'Erreur',
            msg: 'La date de début doit être antérieure à la date de fin',
            timeout: 3000,
            type: 'error'
          })
          return
        }
        // Les données seront automatiquement filtrées via le computed filteredData
      }
    },
    
    setSortField(field) {
      if (this.sortField === field) {
        this.toggleSortDirection()
      } else {
        this.sortField = field
        this.sortDirection = 'desc'
      }
    },
    
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
    },

    initChart() {
      if (!this.$refs.consumptionChart) {
        console.warn('Canvas non trouvé dans le DOM')
        return
      }
      
      // Vérifier que Chart.js est disponible
      if (typeof Chart === 'undefined') {
        console.error('Chart.js n\'est pas chargé')
        return
      }
      
      const ctx = this.$refs.consumptionChart.getContext('2d')
      
      if (this.chartInstance) {
        this.chartInstance.destroy()
      }
      
      // Configuration des options du graphique
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#28303f',
            titleColor: '#cfd7db',
            bodyColor: '#cfd7db',
            borderColor: '#475061',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ''
                const value = context.parsed.y
                if (label.includes('Coût')) {
                  return `${label}: ${value}€`
                }
                return `${label}: ${this.formatData(value)}`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: '#2f3b52',
              lineWidth: 0.5
            },
            ticks: {
              maxTicksLimit: 10,
              color: '#cfd7db',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#2f3b52',
              lineWidth: 0.5
            },
            ticks: {
              color: '#cfd7db',
              font: {
                size: 11
              },
              callback: (value) => {
                return this.formatData(value)
              }
            }
          },
          y1: {
            position: 'right',
            beginAtZero: true,
            display: this.selectedDataTypes.includes('cost'),
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#cfd7db',
              font: {
                size: 11
              },
              callback: (value) => `${value}€`
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6,
            borderWidth: 2,
            backgroundColor: '#28303f'
          },
          line: {
            tension: 0.3,
            borderWidth: 2
          }
        }
      }
      
      // Création du graphique
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: chartOptions
      })
      
      // Charger les données initiales
      this.updateChart()
    },

    updateChart() {
      if (!this.chartInstance || !this.chartData.length) {
        console.log('Pas de données à afficher ou chart non initialisé')
        return
      }

      console.log('Mise à jour du graphique avec les données:', this.chartData)

      // Trier les données par date pour le graphique
      const sortedChartData = [...this.chartData].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )

      const labels = sortedChartData.map(item => this.formatDate(item.date))
      const datasets = []

      // Configuration des axes Y
      if (this.selectedDataTypes.includes('cost')) {
        this.chartInstance.options.scales.y1.display = true
      } else {
        this.chartInstance.options.scales.y1.display = false
      }

      this.activeDataTypes.forEach(dataType => {
        let data = []
        let yAxisID = 'y'
        
        switch (dataType.key) {
          case 'volume':
            data = sortedChartData.map(item => item.volume)
            break
          case 'overage':
            data = sortedChartData.map(item => item.overage)
            break
          case 'threshold':
            data = sortedChartData.map(item => item.threshold)
            break
          case 'cost':
            data = sortedChartData.map(item => item.cost)
            yAxisID = 'y1'
            break
        }

        console.log(`Données ${dataType.label}:`, data)

        datasets.push({
          label: dataType.label,
          data: data,
          borderColor: dataType.color,
          backgroundColor: dataType.color + '20',
          fill: false,
          yAxisID: yAxisID,
          pointBackgroundColor: dataType.color,
          pointBorderColor: '#28303f',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2
        })
      })

      this.chartInstance.data.labels = labels
      this.chartInstance.data.datasets = datasets
      this.chartInstance.update()
    },

    formatData(value) {
      if (value === 0 || !value) return '0 Mo'
      if (value < 1024) return `${Math.round(value)} Mo`
      return `${(value / 1024).toFixed(2)} Go`
    },

    formatDate(dateString) {
      return this.$moment(dateString).format('DD/MM/YY')
    },

    getTypeColor(type) {
      const colors = {
        'DEMANDÉ': { backgroundColor: '#ffb347', color: '#28303f' },
        'ÉCHEC': { backgroundColor: '#ff6b6b', color: '#fff' },
        'RÉUSSI': { backgroundColor: '#51cf66', color: '#28303f' },
        'SERVEUR INACCESSIBLE': { backgroundColor: '#ffa726', color: '#28303f' },
        'EN COURS': { backgroundColor: '#74b9ff', color: '#28303f' }
      }
      return colors[type] || { backgroundColor: '#475061', color: '#cfd7db' }
    }
  }
}
</script>

<style scoped>
/* Cartes de résumé */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: #2f3b52;
  border: none;
  border-radius: 6px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
  color: #cfd7db;
}

.summary-card:hover {
  background: #384762;
  transform: translateY(-2px);
}

.card-icon {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
}

.consumption-icon { 
  background: linear-gradient(135deg, #00a4c3 0%, #0090a9 100%); 
}

.included-icon { 
  background: linear-gradient(135deg, #21bf26 0%, #1ea822 100%); 
}

.overage-icon { 
  background: linear-gradient(135deg, #ff4d4d 0%, #ff3333 100%); 
}

.cost-icon { 
  background: linear-gradient(135deg, #3f58a1 0%, #364c8c 100%); 
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #cfd7db;
  margin-bottom: 0.25rem;
}

.card-label {
  font-size: 0.875rem;
  color: #cfd7db;
  opacity: 0.8;
}

/* Contrôles du graphique */
.chart-controls {
  background: #2f3b52;
  border: none;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
}

.controls-section {
  margin-bottom: 1.25rem;
}

.controls-section:last-child {
  margin-bottom: 0;
}

.controls-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #cfd7db;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.preset-buttons .button {
  background-color: #28303f;
  color: #cfd7db;
  border: none;
  border-radius: 5px;
  font-size: 0.875rem;
  height: auto;
  padding: 0.35rem 0.85rem;
}

.preset-buttons .button.is-primary {
  background-color: #00a4c3;
  color: white;
}

.preset-buttons .button:hover:not(.is-primary) {
  background-color: #384762;
}

.custom-range {
  background: #28303f;
  border-radius: 5px;
  padding: 1rem;
}

.custom-range .label {
  color: #cfd7db;
}

.custom-range .input {
  background-color: #28303f;
  color: #cfd7db;
  border-color: #475061;
  font-size: 0.875rem;
  border-radius: 5px;
}

.custom-range .input:focus {
  border-color: #00a4c3;
}

.custom-range .button.is-primary {
  background-color: #00a4c3;
  color: white;
  border: none;
}

.custom-range .button.is-primary:hover {
  background-color: #0090a9;
}

.data-type-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #28303f;
  color: #cfd7db;
  font-size: 0.875rem;
}

.checkbox-card:hover {
  background-color: #384762;
}

.checkbox-card input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color);
  border-radius: 3px;
  position: relative;
}

.checkbox-card input[type="checkbox"]:checked + .checkmark {
  background-color: var(--color);
}

.checkbox-card input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 10px;
  top: -3px;
  left: 1px;
}

.checkbox-label {
  font-size: 0.875rem;
  font-weight: normal;
}

/* Graphique principal */
.chart-container {
  background: #2f3b52;
  border: none;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #cfd7db;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

.legend-label {
  font-size: 0.875rem;
  color: #cfd7db;
}

.chart-wrapper {
  position: relative;
  height: 350px;
  margin-top: 0.5rem;
}

.consumption-chart {
  width: 100% !important;
  height: 100% !important;
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #cfd7db;
  opacity: 0.7;
}

.no-data-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Tableau détaillé */
.detailed-table {
  background: #2f3b52;
  border: none;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.25);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #28303f;
  background: #28303f;
}

.table-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #cfd7db;
}

.table-header .button {
  background: transparent;
  border: none;
  color: #cfd7db;
}

.table-header .button:hover {
  background: #384762;
}

.table-container {
  overflow-x: auto;
}

/* Styles pour le tri et la recherche mobile */
.table-mobile-sort {
  padding: 1rem;
  background: #28303f;
  border-bottom: 1px solid #384762;
}

.table-mobile-sort .select select {
  background-color: #28303f;
  color: #cfd7db;
  border-color: #475061;
}

.table-mobile-sort .button {
  background-color: #00a4c3;
  border: none;
}

.table-mobile-sort .icon {
  color: #cfd7db;
}

.table {
  width: 100%;
  background-color: transparent;
  color: #cfd7db;
  border-collapse: separate;
  border-spacing: 0;
}

.table th {
  background-color: #28303f;
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-align: left;
  color: #cfd7db;
  border-bottom: 1px solid #384762;
  cursor: pointer;
}

.table th.is-sortable:hover {
  background-color: #384762;
}

.table th.is-sortable .th-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table th.is-sortable .icon {
  margin-left: 0.5rem;
}

.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #384762;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background-color: #384762;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.table-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.table-toggle .button {
  background: #2f3b52;
  color: #cfd7db;
  border: 1px solid #475061;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-toggle .button:hover {
  background: #384762;
  border-color: #00a4c3;
}

.table-toggle .material-symbols-outlined {
  font-size: 1.25rem;
}

/* Responsive design */
@media screen and (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .preset-buttons {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .custom-range .field.is-grouped {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-wrapper {
    height: 250px;
  }
  
  .data-type-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .table td::before {
    color: #cfd7db;
    opacity: 0.7;
  }
}
</style>