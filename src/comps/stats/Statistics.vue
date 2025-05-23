<template>
  <div class="account-content statistics" :style="tab ? 'padding-left: 250px;' : ''">
    <div
      class="admin-box"
      v-if="user && user.allowed_routes && user.allowed_routes.includes('stats')"
      v-show="user && user.allowed_routes && user.allowed_routes.includes('stats')"
    >
      <div class="container is-max-widescreen synthese">
        <div class="top-row">
          <h1 class="page-title">
            <span class="material-symbols-outlined">query_stats</span>
            Statistiques
            <button 
              class="beta-icon"
              @click="showBetaMessage"
              title="Version Beta">
              🚀
              <span class="beta-tag">BETA</span>
            </button>
          </h1>
          <div class="view-switch" v-if="selectedSites.length > 1">
            <span :title="'Mode condensé'"
              class="mode-icon material-symbols-outlined"
              :class="{ active: !separateView }"
            >
              view_agenda
            </span>
            <label class="switch-label">
              <input type="checkbox" v-model="separateView" @change="handleViewChange" />
              <span class="switch-slider"></span>
            </label>
            <span :title="'Mode par site'"
              class="mode-icon material-symbols-outlined"
              :class="{ active: separateView }"
            >
              view_week
            </span>
          </div>
        </div>

        <div class="filters-bar">
          <div class="filters-row">
            <div class="filter-block">
              <label class="filter-label">Période :</label>
              <div class="date-selection">
                <v-date-picker
                  v-model="startDate"
                  :max-date="endDate"
                  mode="dateTime"
                  :popover="{ visibility: 'click', placement: 'bottom-start' }"
                  :modelConfig="{ timezone: 'UTC' }"
                  is24hr
                  :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                  @input="markNeedsUpdate"
                >
                  <template v-slot="{ inputEvents }">
                    <input
                      :value="formatDateToFrench(startDate)"
                      v-on="inputEvents"
                      class="date-input"
                      readonly
                      title="Date de début"
                    />
                  </template>
                </v-date-picker>
                <span class="date-separator">au</span>
                <v-date-picker
                  v-model="endDate"
                  :min-date="startDate"
                  mode="dateTime"
                  :popover="{ visibility: 'click', placement: 'bottom-start' }"
                  :modelConfig="{ timezone: 'UTC' }"
                  is24hr
                  :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                  @input="markNeedsUpdate"
                >
                  <template v-slot="{ inputEvents }">
                    <input
                      :value="formatDateToFrench(endDate)"
                      v-on="inputEvents"
                      class="date-input"
                      readonly
                      title="Date de fin"
                    />
                  </template>
                </v-date-picker>
              </div>
            </div>
            <div class="filter-block" style="width: 45%;">
              <label class="filter-label">Sites :</label>
              <div class="multiselect-wrapper">
                <multiselect
                  v-model="selectedSites"
                  :options="connectedSites"
                  :multiple="true"
                  :searchable="true"
                  :close-on-select="false"
                  track-by="client_id"
                  label="client_label"
                  class="site-multiselect"
                  selectLabel="Appuyer sur Entrée pour sélectionner"
                  selectedLabel="Sélectionné"
                  deselectLabel="Appuyer sur Entrée pour retirer"
                  placeholder="Sélectionner des sites"
                  :preserve-search="true"
                  :internal-search="true"
                  :clear-on-select="true"
                  :hide-selected="false"
                  @select="onSelect"
                  @remove="onRemove"
                >
                  <template v-slot:option="{ option }">
                    <div class="multiselect-option">
                      <input
                        type="checkbox"
                        :id="option.client_id"
                        :value="option"
                        v-model="selectedSites"
                      />
                      <label :for="option.id">{{ option.client_label }}</label>
                    </div>
                  </template>
                  <template v-slot:noResult>
                    <div class="multiselect-no-result">
                      <span class="material-symbols-outlined">search_off</span>
                      <span>Aucun résultat trouvé</span>
                    </div>
                  </template>
                </multiselect>
              </div>
            </div>
            <div class="filter-block">
              <button
                class="submit-btn"
                @click="handleSubmit"
                :disabled="isLoading || !selectedSites.length"
                :title="!selectedSites.length ? 'Veuillez sélectionner au moins un site' : ''"
              >
                <span class="material-symbols-outlined" :class="{ rotating: isLoading }">
                  {{ isLoading ? 'sync' : 'search' }}
                </span>
                {{ isLoading ? 'Chargement...' : 'Valider' }}
              </button>
            </div>
          </div>
        </div>

        <div class="floating-site-title" v-if="separateView" :style="{ opacity: siteTitleOpacity }">
          <transition name="site-title-fade" mode="out-in">
            <div v-if="currentSiteLabel" :key="currentSiteLabel" class="floating-site-label">
              {{ currentSiteLabel }}
            </div>
          </transition>
        </div>

        <TransitionGroup name="fade-scale" tag="div" class="stats-container" v-if="!separateView">
          <div v-if="displayedStats.length === 0" key="empty" class="no-stats">
            <span class="material-symbols-outlined">equalizer</span>
            <p>Aucune statistique n'est affichée. Sélectionnez au moins un site, etc.</p>
            <button class="add-stats-btn" @click="handleAdd">
              <span class="material-symbols-outlined">add</span>
              Gérer les statistiques
            </button>
          </div>
          <div v-else key="content">
            <div class="stats-grid">
              <TransitionGroup name="fade-scale" tag="div" class="stats-grid-inner">
                <div
                  v-for="(stat, index) in statsData"
                  :key="stat.id"
                  :class="['stat-card', getStatCardClass(stat)]"
                  draggable="true"
                  @dragstart="handleDragStart($event, stat, index)"
                  @dragend="handleDragEnd"
                  @dragenter="handleDragEnter($event, index)"
                  @dragleave="handleDragLeave($event)"
                  @drop="handleDrop($event, index)"
                  @dragover.prevent
                >
                  <div class="stat-header">
                    <div :title="stat.description" class="stat-icon-wrapper">
                      <span class="material-symbols-outlined">{{ getIconForStatType(stat.type) }}</span>
                    </div>
                    <div class="stat-title">{{ stat.title }}</div>
                    <div class="stat-view-toggle" v-if="statSupportsViewToggle(stat)">
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: showControlsPanel[stat.id] }"
                        @click.stop="toggleControlsPanel(stat.id)" 
                        title="Options"
                      >
                        <span class="material-symbols-outlined">more_vert</span>
                      </button>
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: chartViewTypes[stat.id] === 'timeseries' && statViewModes[stat.id] === 'chart' }"
                        @click="toggleChartType(stat.id, 'timeseries')" 
                        :disabled="!hasDay(stat.data)"
                        title="Vue ligne temporelle"
                      >
                        <span class="material-symbols-outlined">show_chart</span>
                      </button>
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: chartViewTypes[stat.id] === 'bar' && statViewModes[stat.id] == 'chart' }"
                        @click="toggleChartType(stat.id, 'bar')" 
                        title="Vue en barres"
                      >
                        <span class="material-symbols-outlined">bar_chart</span>
                      </button>
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: statViewModes[stat.id] === 'table' }"
                        @click="toggleStatView(stat.id, 'table')" 
                        title="Vue tableau"
                      >
                        <span class="material-symbols-outlined">table_chart</span>
                      </button>
                    </div>
                    <button
                      class="stat-close"
                      @click.stop="removeStat(stat.id)"
                      title="Retirer cette statistique"
                    >
                      <span class="material-symbols-outlined">close</span>
                    </button>
                    
                    <transition name="slide-left">
                      <div class="stat-controls" v-if="showControlsPanel[stat.id]">
                        <div class="controls-header">
                          <h3>Options d'affichage</h3>
                        </div>
                        <div class="controls-content">
                          <div class="control-group" v-if="hasDay(stat.data) && (stat.type.toLowerCase() === 'table' || stat.type.toLowerCase().includes('bar') || stat.type.toLowerCase().includes('timeseries'))">
                            <label class="control-label">Échantillonage :</label>
                            <select v-model="timeGrouping[stat.id]" @change="updateChart(stat.id)" class="control-select">
                              <option value="day">Jour</option>
                              <option value="month">Mois</option>
                              <option value="year">Année</option>
                            </select>
                          </div>
                          <div class="control-group" v-if="hasDay(stat.data) && (stat.type.toLowerCase() === 'table' || stat.type.toLowerCase().includes('bar') || stat.type.toLowerCase().includes('timeseries'))">
                            <label class="control-label" title="Fonction mathématique appliquée lors du groupement des éléments en fonction du temps.">Fonction :</label>
                            <select v-model="fusionMethod[stat.id]" @change="updateChart(stat.id)" class="control-select">
                              <option value="sum">Somme</option>
                              <option value="avg">Moyenne</option>
                              <option value="max">Max value</option>
                              <option value="min">Min value</option>
                            </select>
                          </div>
                          <div class="control-group" v-if="needsMetricSelector(stat.type)">
                            <label v-show="getTableMetrics(stat.data).length > 0" class="control-label">Ordonnée :</label>
                            <div class="multiselect-container">
                              <multiselect v-show="getTableMetrics(stat.data).length > 0"
                                v-model="selectedTableMetrics[stat.id]"
                                :options="getTableMetrics(stat.data)"
                                :multiple="true"
                                :searchable="false"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                :max-height="160"
                                selectLabel=""
                                selectedLabel=""
                                deselectLabel=""
                                placeholder="Métriques Axe Y"
                                label="text"
                                track-by="value"
                                @input="updateChart(stat.id)"
                                class="metrics-multiselect"
                              >
                              </multiselect>
                            </div>
                          </div>
                          <div class="control-group" v-if="stat.type.toLowerCase() === 'table' && !hasDay(stat.data)">
                            <label v-show="getAxisMetricsOptions(stat.data).length > 0" class="control-label">Abcisse :</label>
                            <div class="multiselect-container">
                              <multiselect v-show="getAxisMetricsOptions(stat.data).length > 0"
                                v-model="selectedAxisMetric[stat.id]"
                                :options="getAxisMetricsOptions(stat.data)"
                                :multiple="false"
                                :searchable="false"
                                :close-on-select="true"
                                :clear-on-select="false"
                                :preserve-search="true"
                                :max-height="160"
                                placeholder="Métriques Axe X"
                                selectLabel=""
                                selectedLabel=""
                                deselectLabel=""
                                label="text"
                                track-by="value"
                                @input="updateChart(stat.id)"
                                class="metrics-multiselect"
                              >
                              </multiselect>
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                  <div class="stat-content" :class="getStatLayout(stat.data)">
                    <div v-if="isLoading" class="no-data-block">
                      <span class="material-symbols-outlined no-data-icon">sync</span>
                      <p class="no-data-text">Chargement des données...</p>
                    </div>
                    <div v-else-if="error" class="no-data-block">
                      <span class="material-symbols-outlined no-data-icon">error</span>
                      <p class="no-data-text">Erreur lors du chargement des données</p>
                    </div>
                    <div v-else-if="!stat.data || !stat.data.length || !selectedSites.length" class="no-data-block">
                      <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                      <p class="no-data-text">Aucune donnée disponible</p>
                    </div>
                    <div v-else>
                      <div v-if="stat.type.toLowerCase().includes('pie')" class="piechart-container">
                        <div v-if="hasPieData(stat.data)" class="piechart-container">
                          <canvas :ref="'piechart-'+stat.id" class="piechart-canvas"></canvas>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else-if="(stat.type.toLowerCase().includes('timeseries') || 
                                   ((stat.type.toLowerCase().includes('bar') || stat.type.toLowerCase() === 'table') && 
                                   chartViewTypes[stat.id] === 'timeseries'))" 
                           class="timeseries-container">
                        <div v-show="(!statViewModes[stat.id] || statViewModes[stat.id] === 'chart') && hasDay(stat.data)" style="width:100%; height:100%">
                          <canvas :ref="'timeseries-'+stat.id" class="timeseries-canvas"></canvas>
                        </div>
                        <div v-show="statViewModes[stat.id] === 'table'" class="data-table-container">
                          <div class="data-table-wrapper">
                            <table class="data-table">
                              <thead>
                                <tr>
                                  <th>{{ getTableDateHeader(stat.id) }}</th>
                                  <th v-for="(series, sIdx) in getCachedTimeseriesData(stat.id)" :key="sIdx">
                                    {{ series.label }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(row, dIdx) in getCachedTimeseriesTableData(stat.id)" :key="dIdx">
                                  <td>{{ formatTableDate(row.date, timeGrouping[stat.id] || 'day') }}</td>
                                  <td v-for="(value, sIdx) in row.values" :key="sIdx">
                                    {{ formatTableValue(value) }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div v-show="(!statViewModes[stat.id] || statViewModes[stat.id] === 'chart') && !hasDay(stat.data)" class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else-if="(stat.type.toLowerCase().includes('bar') || 
                                   ((stat.type.toLowerCase().includes('timeseries') || stat.type.toLowerCase() === 'table') && 
                                   chartViewTypes[stat.id] === 'bar'))" 
                           class="timeseries-container">
                        <div v-show="!statViewModes[stat.id] || statViewModes[stat.id] === 'chart'" style="width:100%; height:100%">
                          <canvas :ref="'barchart-'+stat.id" class="timeseries-canvas"></canvas>
                        </div>
                        <div v-show="statViewModes[stat.id] === 'table'" class="data-table-container">
                          <div class="data-table-wrapper">
                            <table class="data-table">
                              <thead>
                                <tr>
                                  <th>{{ hasDay(stat.data) ? getTableDateHeader(stat.id) : getSelectedAxisMetricLabel(stat.id) }}</th>
                                  <th v-for="(series, sIdx) in getCachedBarData(stat.id)" :key="sIdx">
                                    {{ series.label }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(row, rIdx) in getCachedBarTableData(stat.id)" :key="rIdx">
                                  <td>{{ hasDay(stat.data) ? formatTableDate(row.date, timeGrouping[stat.id] || 'day') : row.axis }}</td>
                                  <td v-for="(value, vIdx) in row.values" :key="vIdx">
                                    {{ formatTableValue(value) }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="stat.type.toLowerCase() === 'stat'">
                        <div v-if="hasNumericData(stat.data)" class="stat-value-container" style="display:flex;align-items:center;justify-content:center;text-align:center;height:100%;padding:20px;">
                          <div class="stat-value" style="font-size:50px;font-weight:bold;color:#29C66F;" v-countup.once="getStatValue(stat.data)"></div>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else-if="stat.type.toLowerCase().includes('gauge')">
                        <div v-if="hasNumericData(stat.data)" class="gauge-wrapper">
                          <div
                            v-for="(item, idx) in getCachedGaugeData(stat.id)"
                            :key="idx"
                            class="gauge-container"
                          >
                            <svg class="gauge" viewBox="0 0 200 100">
                              <path d="M20,90 A80,80 0 1,1 180,90" class="gauge-background" />
                              <path
                                :d="getArcPathValid(item.value)"
                                class="gauge-value"
                                transform="rotate(-90 100 90)"
                              />
                            </svg>
                            <div class="gauge-percentage">
                              <span v-countup.once="limitGaugeValue(item.value)"></span>%
                            </div>
                            <div class="gauge-labels">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else>
                        <div v-if="hasNumericData(stat.data)" class="fallback-value-container" style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;text-align:center;">
                          <div class="fallback-value" style="font-size:48px;color:#29C66F;" v-countup.once="getStatValue(stat.data)"></div>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">equalizer</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </TransitionGroup>

        <div v-else class="separate-sites-view">
          <div
            v-for="site in selectedSites"
            :key="site.client_id"
            class="site-section"
            :id="'site-' + site.client_id"
          >
            <h2 class="parsite-title">{{ site.client_label }}</h2>
            <div class="stats-grid">
              <TransitionGroup name="fade-scale" tag="div" class="stats-grid-inner">
                <div
                  v-for="stat in filterStatsBySite(statsData, site.client_id)"
                  :key="`${site.client_id}-${stat.id}`"
                  :class="['stat-card', getStatCardClass(stat)]"
                >
                  <div class="stat-header">
                    <div class="stat-icon-wrapper">
                      <span class="material-symbols-outlined">{{ getIconForStatType(stat.type) }}</span>
                    </div>
                    <div class="stat-title">{{ stat.title }}</div>
                    <div class="stat-view-toggle" v-if="statSupportsViewToggle(stat)">
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: showControlsPanel[`${site.client_id}-${stat.id}`] }"
                        @click.stop="toggleControlsPanel(`${site.client_id}-${stat.id}`)" 
                        title="Options"
                      >
                        <span class="material-symbols-outlined">more_vert</span>
                      </button>
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: chartViewTypes[`${site.client_id}-${stat.id}`] === 'timeseries' && statViewModes[`${site.client_id}-${stat.id}`] === 'chart' }"
                        @click="toggleChartType(`${site.client_id}-${stat.id}`, 'timeseries')" 
                        :disabled="!hasDay(stat.data)"
                        title="Vue ligne temporelle"
                      >
                        <span class="material-symbols-outlined">show_chart</span>
                      </button>
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: chartViewTypes[`${site.client_id}-${stat.id}`] === 'bar' && statViewModes[`${site.client_id}-${stat.id}`] === 'chart' }"
                        @click="toggleChartType(`${site.client_id}-${stat.id}`, 'bar')"
                        title="Vue en barres"
                      >
                        <span class="material-symbols-outlined">bar_chart</span>
                      </button>
                      <button 
                        class="view-toggle-btn" 
                        :class="{ active: statViewModes[`${site.client_id}-${stat.id}`] === 'table' }"
                        @click="toggleStatView(`${site.client_id}-${stat.id}`, 'table')" 
                        title="Vue tableau"
                      >
                        <span class="material-symbols-outlined">table_chart</span>
                      </button>
                    </div>
                    
                    <transition name="slide-left">
                      <div class="stat-controls" v-if="showControlsPanel[`${site.client_id}-${stat.id}`]">
                        <div class="controls-header">
                          <h3>Options d'affichage</h3>
                        </div>
                        <div class="controls-content">
                          <div class="control-group" v-if="hasDay(stat.data) && (stat.type.toLowerCase() === 'table' || stat.type.toLowerCase().includes('bar') || stat.type.toLowerCase().includes('timeseries'))">
                            <label class="control-label">Échantillonage :</label>
                            <select v-model="timeGrouping[`${site.client_id}-${stat.id}`]" @change="updateChart(`${site.client_id}-${stat.id}`)" class="control-select">
                              <option value="day">Jour</option>
                              <option value="month">Mois</option>
                              <option value="year">Année</option>
                            </select>
                          </div>
                          <div class="control-group" v-if="hasDay(stat.data) && (stat.type.toLowerCase() === 'table' || stat.type.toLowerCase().includes('bar') || stat.type.toLowerCase().includes('timeseries'))">
                            <label class="control-label" title="Fonction mathématique appliquée lors du groupement des éléments en fonction du temps.">Fonction :</label>
                            <select v-model="fusionMethod[`${site.client_id}-${stat.id}`]" @change="updateChart(`${site.client_id}-${stat.id}`)" class="control-select">
                              <option value="sum">Somme</option>
                              <option value="avg">Moyenne</option>
                              <option value="max">Max value</option>
                              <option value="min">Min value</option>
                            </select>
                          </div>
                          <div class="control-group" v-if="needsMetricSelector(stat.type)">
                            <label v-show="getTableMetrics(stat.data).length > 0" class="control-label">Ordonnée :</label>
                            <div class="multiselect-container">
                              <multiselect v-show="getTableMetrics(stat.data).length > 0"
                                v-model="selectedTableMetrics[`${site.client_id}-${stat.id}`]"
                                :options="getTableMetrics(stat.data)"
                                :multiple="true"
                                :searchable="false"
                                :close-on-select="false"
                                :clear-on-select="false"
                                :preserve-search="true"
                                :max-height="160"
                                placeholder="Métriques Axe Y"
                                selectLabel=""
                                selectedLabel=""
                                deselectLabel=""
                                label="text"
                                track-by="value"
                                @input="updateChart(`${site.client_id}-${stat.id}`)"
                                class="metrics-multiselect"
                              >
                              </multiselect>
                            </div>
                          </div>
                          <div class="control-group" v-if="stat.type.toLowerCase() === 'table' && !hasDay(stat.data)">
                            <label v-show="getAxisMetricsOptions(stat.data).length > 0" class="control-label">Abcisse :</label>
                            <div class="multiselect-container">
                              <multiselect v-show="getAxisMetricsOptions(stat.data).length > 0"
                                v-model="selectedAxisMetric[`${site.client_id}-${stat.id}`]"
                                :options="getAxisMetricsOptions(stat.data)"
                                :multiple="false"
                                :searchable="false"
                                :close-on-select="true"
                                :clear-on-select="false"
                                :preserve-search="true"
                                :max-height="160"
                                placeholder="Métriques Axe X"
                                selectLabel=""
                                selectedLabel=""
                                deselectLabel=""
                                label="text"
                                track-by="value"
                                @input="updateChart(`${site.client_id}-${stat.id}`)"
                                class="metrics-multiselect"
                              >
                              </multiselect>
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                  <div class="stat-content" :class="getStatLayout(stat.data)">
                    <div v-if="isLoading" class="no-data-block">
                      <span class="material-symbols-outlined no-data-icon">sync</span>
                      <p class="no-data-text">Chargement des données...</p>
                    </div>
                    <div v-else-if="error" class="no-data-block">
                      <span class="material-symbols-outlined no-data-icon">error</span>
                      <p class="no-data-text">Erreur lors du chargement des données</p>
                    </div>
                    <div v-else-if="!stat.data || !stat.data.length || !selectedSites.length" class="no-data-block">
                      <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                      <p class="no-data-text">Aucune donnée disponible</p>
                    </div>
                    <div v-else>
                      <div v-if="stat.type.toLowerCase().includes('pie')" class="piechart-container">
                        <div v-if="hasPieData(stat.data)" class="piechart-container">
                          <canvas :ref="'piechart-'+site.client_id+'-'+stat.id" class="piechart-canvas"></canvas>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else-if="(stat.type.toLowerCase().includes('timeseries') || 
                                   ((stat.type.toLowerCase().includes('bar') || stat.type.toLowerCase() === 'table') && 
                                   chartViewTypes[`${site.client_id}-${stat.id}`] === 'timeseries'))" 
                           class="timeseries-container">
                        <div v-show="(!statViewModes[`${site.client_id}-${stat.id}`] || statViewModes[`${site.client_id}-${stat.id}`] === 'chart') && hasDay(stat.data)" style="width:100%; height:100%">
                          <canvas :ref="'timeseries-'+site.client_id+'-'+stat.id" class="timeseries-canvas"></canvas>
                        </div>
                        <div v-show="statViewModes[`${site.client_id}-${stat.id}`] === 'table'" class="data-table-container">
                          <div class="data-table-wrapper">
                            <table class="data-table">
                              <thead>
                                <tr>
                                  <th>{{ getTableDateHeader(`${site.client_id}-${stat.id}`) }}</th>
                                  <th v-for="(series, sIdx) in getCachedTimeseriesData(`${site.client_id}-${stat.id}`)" :key="sIdx">
                                    {{ series.label }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(row, dIdx) in getCachedTimeseriesTableData(`${site.client_id}-${stat.id}`)" :key="dIdx">
                                  <td>{{ formatTableDate(row.date, timeGrouping[`${site.client_id}-${stat.id}`] || 'day') }}</td>
                                  <td v-for="(value, sIdx) in row.values" :key="sIdx">
                                    {{ formatTableValue(value) }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div v-show="(!statViewModes[`${site.client_id}-${stat.id}`] || statViewModes[`${site.client_id}-${stat.id}`] === 'chart') && !hasDay(stat.data)" class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else-if="(stat.type.toLowerCase().includes('bar') || 
                                   ((stat.type.toLowerCase().includes('timeseries') || stat.type.toLowerCase() === 'table') && 
                                   chartViewTypes[`${site.client_id}-${stat.id}`] === 'bar'))" 
                           class="timeseries-container">
                        <div v-show="!statViewModes[`${site.client_id}-${stat.id}`] || statViewModes[`${site.client_id}-${stat.id}`] === 'chart'" style="width:100%; height:100%">
                          <canvas :ref="'barchart-'+site.client_id+'-'+stat.id" class="timeseries-canvas"></canvas>
                        </div>
                        <div v-show="statViewModes[`${site.client_id}-${stat.id}`] === 'table'" class="data-table-container">
                          <div class="data-table-wrapper">
                            <table class="data-table">
                              <thead>
                                <tr>
                                  <th>{{ hasDay(stat.data) ? getTableDateHeader(`${site.client_id}-${stat.id}`) : getSelectedAxisMetricLabel(`${site.client_id}-${stat.id}`) }}</th>
                                  <th v-for="(series, sIdx) in getCachedBarData(`${site.client_id}-${stat.id}`)" :key="sIdx">
                                    {{ series.label }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(row, rIdx) in getCachedBarTableData(`${site.client_id}-${stat.id}`)" :key="rIdx">
                                  <td>{{ hasDay(stat.data) ? formatTableDate(row.date, timeGrouping[`${site.client_id}-${stat.id}`] || 'day') : row.axis }}</td>
                                  <td v-for="(value, vIdx) in row.values" :key="vIdx">
                                    {{ formatTableValue(value) }}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="stat.type.toLowerCase() === 'stat'">
                        <div v-if="hasNumericData(stat.data)" class="stat-value-container" style="display:flex;align-items:center;justify-content:center;text-align:center;height:100%;padding:20px;">
                          <div class="stat-value" style="font-size:50px;font-weight:bold;color:#29C66F;" v-countup.once="getStatValue(stat.data)"></div>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else-if="stat.type.toLowerCase().includes('gauge')">
                        <div v-if="hasNumericData(stat.data)" class="gauge-wrapper">
                          <div
                            v-for="(item, idx) in getCachedGaugeData(`${site.client_id}-${stat.id}`)"
                            :key="idx"
                            class="gauge-container"
                          >
                            <svg class="gauge" viewBox="0 0 200 100">
                              <path d="M20,90 A80,80 0 1,1 180,90" class="gauge-background" />
                              <path
                                :d="getArcPathValid(item.value)"
                                class="gauge-value"
                                transform="rotate(-90 100 90)"
                              />
                            </svg>
                            <div class="gauge-percentage">
                              <span v-countup.once="limitGaugeValue(item.value)"></span>%
                            </div>
                            <div class="gauge-labels">
                              <span>0%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">{{ getIconForStatType(stat.type) }}</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                      <div v-else>
                        <div v-if="hasNumericData(stat.data)" class="fallback-value-container" style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;text-align:center;">
                          <div class="fallback-value" style="font-size:48px;color:#29C66F;" v-countup.once="getStatValue(stat.data)"></div>
                        </div>
                        <div v-else class="no-data-block">
                          <span class="material-symbols-outlined no-data-icon">equalizer</span>
                          <p class="no-data-text">Aucune donnée disponible</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-buttons">
      <button
        class="floating-btn print-btn"
        @click="printPage"
        :disabled="isLoading"
        title="Imprimer la page"
      >
        <span class="material-symbols-outlined">print</span>
      </button>
      <button
        class="floating-btn add-btn"
        @click="handleAdd"
        :disabled="isLoading"
        title="Gérer les statistiques"
      >
        <span class="material-symbols-outlined">add</span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <span>Chargement...</span>
        </div>
      </div>
    </transition>

    <transition name="fade-scale">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>
              <span class="material-symbols-outlined">tune</span>
              Gérer les statistiques
            </h2>
          </div>
          <div class="modal-body">
            <transition-group name="fade-slide" tag="div" class="stat-items-list">
              <div
                v-for="stat in statsWithStatus"
                :key="stat.id"
                class="stat-item-modal"
                :class="{ disabled: statIsDisplayed(stat.id) }"
                @click="!statIsDisplayed(stat.id) && toggleStat(stat.id)"
              >
                <div class="stat-item-content">
                  <div class="stat-icon-wrapper">
                    <span
                      class="material-symbols-outlined"
                      :style="{ color: statIsDisplayed(stat.id) ? '#9CC4E4' : '#29C66F' }"
                    >
                      {{ getIconForStatType(stat.type) }}
                    </span>
                  </div>
                  <div class="stat-item-text">
                    <h3>{{ stat.title }}</h3>
                    <p>{{ stat.description || 'Aucune description disponible' }}</p>
                  </div>
                </div>
                <div class="stat-item-action">
                  <span
                    v-if="statIsDisplayed(stat.id)"
                    class="material-symbols-outlined remove-stat"
                    @click.stop="toggleStat(stat.id)"
                    title="Retirer cette statistique"
                  >
                    close
                  </span>
                  <span
                    v-else
                    class="material-symbols-outlined add-stat"
                    title="Ajouter cette statistique"
                  >
                    add
                  </span>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import { DatePicker } from 'v-calendar'
import Multiselect from 'vue-multiselect'
import { Chart } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import * as XLSX from 'xlsx'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'chart.js'

function animateValue(el, start, end, duration) {
  let startTime
  const decimals = Number.isInteger(end) ? 0 : 2
  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const progress = timestamp - startTime
    const rate = Math.min(progress / duration, 1)
    const value = start + (end - start) * rate
    el.innerText = parseFloat(value).toFixed(decimals)
    if (rate < 1) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

export default {
  name: 'Statistics',
  props: {
    tab: { type: Boolean, default: false }
  },
  components: {
    'v-date-picker': DatePicker,
    Multiselect
  },
  directives: {
    countup: {
      bind(el, binding) {
        el.__previous = undefined
      },
      inserted(el, binding) {
        if (binding.modifiers && binding.modifiers.once) {
          if (typeof binding.value === 'number' && el.__previous === undefined) {
            el.__previous = binding.value
            animateValue(el, 0, binding.value, 1000)
          } else {
            el.innerText = binding.value
          }
        } else {
          if (typeof binding.value === 'number') {
            el.__previous = binding.value
            animateValue(el, 0, binding.value, 1000)
          } else {
            el.innerText = binding.value
          }
        }
      },
      update(el, binding) {
        if (binding.modifiers && binding.modifiers.once) {
          if (el.__previous === undefined && typeof binding.value === 'number') {
            el.__previous = binding.value
            animateValue(el, 0, binding.value, 1000)
          } else {
            el.innerText = binding.value
          }
        } else {
          if (typeof binding.value === 'number' && binding.value !== el.__previous) {
            el.__previous = binding.value
            animateValue(el, 0, binding.value, 1000)
          } else {
            el.innerText = binding.value
          }
        }
      }
    }
  },
  data() {
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    return {
      startDate,
      endDate,
      selectedSites: [],
      isLoading: false,
      error: null,
      statsData: [],
      originalStatsData: [],
      availableStats: [],
      colors: ['#4B7BFF', '#2F855A', '#ED8936', '#E53E3E', '#5D46A5', '#D53F8C'],
      isModalOpen: false,
      displayedStats: [],
      isDragging: null,
      dragCounter: 0,
      pieChartInstances: new Map(),
      timeseriesChartInstances: new Map(),
      barChartInstances: new Map(),
      tableChartInstances: new Map(),
      separateView: false,
      needsUpdate: false,
      currentSiteId: null,
      siteTitleOpacity: 1,
      statViewModes: {},
      selectedTableMetrics: {},
      selectedAxisMetric: {},
      timeGrouping: {},
      chartViewTypes: {},
      fusionMethod: {},
      showControlsPanel: {},
      pendingRefresh: false,
      
      metricOptionsCache: {},
      tableMetricsCache: {},
      timeseriesDataCache: {},
      barDataCache: {},
      timeseriesTableDataCache: {},
      barTableDataCache: {},
      gaugeDataCache: {},
      pieDataCache: {},
      dataLastUpdated: {}
    }
  },
  watch: {
    separateView(newVal, oldVal) {
      if(newVal !== oldVal) {
        this.handleViewChange();
      }
    }
  },
  computed: {
    connectedSites() {
      const all = this.$store.getters.ipbxWithoutGuests || []
      return all.filter(s => s.status === 'connected')
    },
    statsWithStatus() {
      return this.availableStats.map(stat => ({
        ...stat,
        isDisplayed: this.displayedStats.includes(stat.id)
      }))
    },
    user() {
      return this.$store.getters.getUser
    },
    sessionParams() {
      const u = this.$store.getters.getUser
      return { session_id: u?.session_id }
    },
    currentSiteLabel() {
      if (!this.currentSiteId) return ''
      const s = this.selectedSites.find(x => x.client_id === this.currentSiteId)
      return s ? s.client_label : ''
    }
  },
  methods: {
    getCacheKey(statId, type) {
      const id = String(statId);
      const statData = this.getStatDataById(id);
      const timeGroup = this.timeGrouping[id] || 'day';
      const fusionType = this.fusionMethod[id] || 'sum';
      
      const metrics = this.selectedTableMetrics[id] 
        ? JSON.stringify(this.selectedTableMetrics[id].map(m => m.value)) 
        : '';
        
      const axisMetric = this.selectedAxisMetric[id] 
        ? this.selectedAxisMetric[id].value 
        : '';
      
      return `${id}-${type}-${timeGroup}-${fusionType}-${metrics}-${axisMetric}-${this.dataLastUpdated[id] || 0}`;
    },
    
    clearCachedData(statId) {
      this.dataLastUpdated[statId] = Date.now();
      
      delete this.timeseriesDataCache[statId];
      delete this.barDataCache[statId];
      delete this.timeseriesTableDataCache[statId];
      delete this.barTableDataCache[statId];
      delete this.gaugeDataCache[statId];
      delete this.pieDataCache[statId];
      
      const keys = Object.keys(this.timeseriesDataCache).filter(k => k.includes(statId));
      keys.forEach(k => delete this.timeseriesDataCache[k]);
      
      const barKeys = Object.keys(this.barDataCache).filter(k => k.includes(statId));
      barKeys.forEach(k => delete this.barDataCache[k]);
      
      const timeseriesTableKeys = Object.keys(this.timeseriesTableDataCache).filter(k => k.includes(statId));
      timeseriesTableKeys.forEach(k => delete this.timeseriesTableDataCache[k]);
      
      const barTableKeys = Object.keys(this.barTableDataCache).filter(k => k.includes(statId));
      barTableKeys.forEach(k => delete this.barTableDataCache[k]);
      
      const gaugeKeys = Object.keys(this.gaugeDataCache).filter(k => k.includes(statId));
      gaugeKeys.forEach(k => delete this.gaugeDataCache[k]);
      
      const pieKeys = Object.keys(this.pieDataCache).filter(k => k.includes(statId));
      pieKeys.forEach(k => delete this.pieDataCache[k]);
    },
    
    getCachedTimeseriesData(statId) {
      const cacheKey = this.getCacheKey(statId, 'timeseries');
      if (!this.timeseriesDataCache[cacheKey]) {
        this.timeseriesDataCache[cacheKey] = this.extractTimeseriesData(this.getStatDataById(statId), statId);
      }
      return this.timeseriesDataCache[cacheKey];
    },
    
    getCachedBarData(statId) {
      const cacheKey = this.getCacheKey(statId, 'bar');
      if (!this.barDataCache[cacheKey]) {
        this.barDataCache[cacheKey] = this.extractBarData(this.getStatDataById(statId), statId);
      }
      return this.barDataCache[cacheKey];
    },
    
    getCachedTimeseriesTableData(statId) {
      const cacheKey = this.getCacheKey(statId, 'timeseriesTable');
      if (!this.timeseriesTableDataCache[cacheKey]) {
        this.timeseriesTableDataCache[cacheKey] = this.getTimeseriesTableData(this.getStatDataById(statId), statId);
      }
      return this.timeseriesTableDataCache[cacheKey];
    },
    
    getCachedBarTableData(statId) {
      const cacheKey = this.getCacheKey(statId, 'barTable');
      if (!this.barTableDataCache[cacheKey]) {
        this.barTableDataCache[cacheKey] = this.getBarTableData(this.getStatDataById(statId), statId);
      }
      return this.barTableDataCache[cacheKey];
    },
    
    getCachedGaugeData(statId) {
      const cacheKey = this.getCacheKey(statId, 'gauge');
      if (!this.gaugeDataCache[cacheKey]) {
        this.gaugeDataCache[cacheKey] = this.extractGaugeData(this.getStatDataById(statId));
      }
      return this.gaugeDataCache[cacheKey];
    },
    
    handleViewChange() {
      this.cleanupAllCharts();
      
      setTimeout(() => {
        this.createAllCharts();
        
        if (this.separateView) {
          this.initIntersectionObserver();
        } else if (this.observer) {
          this.observer.disconnect();
        }
      }, 200);
    },
    
    formatTableDate(date, groupBy) {
      if (!date) return ''
      const dateObj = new Date(date)
      if (isNaN(dateObj)) return date
      if (groupBy === 'day') {
        return dateObj.toLocaleDateString('fr-FR')
      } else if (groupBy === 'month') {
        return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(dateObj)
      } else if (groupBy === 'year') {
        return dateObj.getFullYear().toString()
      }
      return dateObj.toLocaleDateString('fr-FR')
    },
    
    formatTableValue(value) {
      if (value === undefined || value === null) return '-'
      if (typeof value === 'number') {
        return Math.round(value).toString()
      }
      return value
    },
    
    getTableDateHeader(statId) {
      const groupBy = this.timeGrouping[statId] || 'day'
      if (groupBy === 'day') {
        return 'Date'
      } else if (groupBy === 'month') {
        return 'Mois'
      } else if (groupBy === 'year') {
        return 'Année'
      }
      return 'Date'
    },
    
    getTimeseriesTableData(data, statId) {
      if (!data || !data.length) return []
      
      const selectedMetrics = this.getSelectedTableMetrics(statId)
      if (selectedMetrics.length === 0) return []
      
      const groupBy = this.timeGrouping[statId] || 'day'
      const fusionMethod = this.fusionMethod[statId] || 'sum'
      const dateMap = {}
      
      data.forEach(d => {
        if (!d?.Day?.value) return
        
        const dateObj = new Date(d.Day.value)
        if (isNaN(dateObj)) return
        
        let dateKey
        let formattedDate
        
        if (groupBy === 'day') {
          dateKey = dateObj.toISOString().split('T')[0]
          formattedDate = dateObj
        } else if (groupBy === 'month') {
          dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
          formattedDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1)
        } else if (groupBy === 'year') {
          dateKey = `${dateObj.getFullYear()}`
          formattedDate = new Date(dateObj.getFullYear(), 0, 1)
        }
        
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = {
            date: formattedDate,
            values: Array(selectedMetrics.length).fill(0),
            _count: Array(selectedMetrics.length).fill(0),
            _min: Array(selectedMetrics.length).fill(Infinity),
            _max: Array(selectedMetrics.length).fill(-Infinity)
          }
        }
        
        selectedMetrics.forEach((metric, idx) => {
          if (d[metric.value]?.type === 'number') {
            const val = parseFloat(d[metric.value]?.value || 0)
            if (!isNaN(val)) {
              dateMap[dateKey].values[idx] += val
              dateMap[dateKey]._count[idx] += 1
              
              if (val < dateMap[dateKey]._min[idx]) {
                dateMap[dateKey]._min[idx] = val
              }
              
              if (val > dateMap[dateKey]._max[idx]) {
                dateMap[dateKey]._max[idx] = val
              }
            }
          }
        })
      })
      
      Object.keys(dateMap).forEach(key => {
        const item = dateMap[key]
        
        for (let i = 0; i < item.values.length; i++) {
          if (fusionMethod === 'avg' && item._count[i] > 0) {
            item.values[i] = item.values[i] / item._count[i]
          } else if (fusionMethod === 'max' && item._max[i] !== -Infinity) {
            item.values[i] = item._max[i]
          } else if (fusionMethod === 'min' && item._min[i] !== Infinity) {
            item.values[i] = item._min[i]
          }
        }
      })
      
      return Object.values(dateMap).sort((a, b) => a.date - b.date)
    },
    
    toggleControlsPanel(statId) {
      this.$set(this.showControlsPanel, statId, !this.showControlsPanel[statId])
    },
    
    closeControlPanels() {
      Object.keys(this.showControlsPanel).forEach(key => {
        if (this.showControlsPanel[key]) {
          this.$set(this.showControlsPanel, key, false)
        }
      })
    },
    
    getFusionMethod(instanceKey) {
      return this.fusionMethod[instanceKey] || 'sum'
    },
    
    hasDay(data) {
      if (!data || !data.length) return false
      return data.some(item => item.Day && item.Day.value)
    },

    getAxisMetricsOptions(data) {
      const cacheKey = JSON.stringify(data || []).slice(0, 100);
      if (this.metricOptionsCache[cacheKey]) {
        return this.metricOptionsCache[cacheKey];
      }
      
      if (!data || !data.length) return [];
      
      const metrics = new Set();
      data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== 'site' && typeof item[key]?.value === 'string') {
            metrics.add(key);
          }
        });
      });
      
      const result = Array.from(metrics).map(m => ({ value: m, text: m }));
      this.metricOptionsCache[cacheKey] = result;
      return result;
    },
    
    getSelectedAxisMetricLabel(statId) {
      if (!this.selectedAxisMetric[statId]) {
        const options = this.getAxisMetricsOptions(this.getStatDataById(statId))
        if (options.length > 0) {
          this.$set(this.selectedAxisMetric, statId, options[0])
          return options[0].text
        }
        return 'Axe X'
      }
      return this.selectedAxisMetric[statId].text
    },
    
    needsMetricSelector(type) {
      const lowerType = type.toLowerCase()
      return lowerType === 'table' || lowerType.includes('timeseries') || lowerType.includes('bar')
    },
    
    statSupportsViewToggle(stat) {
      const lowerType = stat.type.toLowerCase()
      return lowerType === 'table' || lowerType.includes('timeseries') || lowerType.includes('bar')
    },
    
    getDefaultChartType(statType, data) {
      const lowerType = statType.toLowerCase()
      const hasTemporalData = this.hasDay(data)
      
      if (lowerType.includes('timeseries')) {
        return hasTemporalData ? 'timeseries' : 'bar'
      }
      
      if (lowerType.includes('bar')) {
        return 'bar'
      }
      
      if (lowerType === 'table') {
        return hasTemporalData ? 'timeseries' : 'bar'
      }
      
      return 'bar'
    },
    
    getStatById(statId) {
      const parts = String(statId).split('-')
      const actualStatId = parts.length > 1 ? parts[parts.length - 1] : statId
      return this.statsData.find(s => s.id === Number(actualStatId))
    },
    
    getStatDataById(statId) {
      const parts = String(statId).split('-')
      
      if (parts.length > 1) {
        const siteId = parts.slice(0, -1).join('-')
        const actualStatId = parts[parts.length - 1]
        const stat = this.statsData.find(s => s.id === Number(actualStatId))
        return stat ? stat.data.filter(x => x.site === siteId) : []
      } else {
        const stat = this.statsData.find(s => s.id === Number(statId))
        return stat ? stat.data : []
      }
    },
    
    toggleChartType(statId, chartType) {
      const statData = this.getStatDataById(statId)
      
      if (chartType === 'timeseries' && !this.hasDay(statData)) {
        return
      }
      
      this.clearCachedData(statId);
      
      const currentTimeGrouping = this.timeGrouping[statId] || 'day'
      const currentFusionMethod = this.fusionMethod[statId] || 'sum'
      const selectedTableMetrics = [...(this.getSelectedTableMetrics(statId) || [])]
      
      let selectedAxisMetric = null
      if (this.selectedAxisMetric[statId]) {
        selectedAxisMetric = { ...this.selectedAxisMetric[statId] }
      }
      
      if (this.timeseriesChartInstances.has(statId)) {
        this.timeseriesChartInstances.get(statId).destroy()
        this.timeseriesChartInstances.delete(statId)
      }
      
      if (this.barChartInstances.has(statId)) {
        this.barChartInstances.get(statId).destroy()
        this.barChartInstances.delete(statId)
      }
      
      this.$set(this.statViewModes, statId, 'chart')
      this.$set(this.chartViewTypes, statId, chartType)
      
      setTimeout(() => {
        const stat = this.getStatById(statId)
        if (!stat) return
        
        if (chartType === 'timeseries') {
          const canvas = this.getChartCanvas('timeseries', statId)
          if (canvas) this.createTimeseriesChart(stat, canvas, statId)
        } else if (chartType === 'bar') {
          const canvas = this.getChartCanvas('barchart', statId)
          if (canvas) this.createBarChart(stat, canvas, statId)
        }
        
        this.$set(this.timeGrouping, statId, currentTimeGrouping)
        this.$set(this.fusionMethod, statId, currentFusionMethod)
        
        if (selectedTableMetrics.length > 0) {
          this.$set(this.selectedTableMetrics, statId, selectedTableMetrics)
        }
        
        if (selectedAxisMetric) {
          this.$set(this.selectedAxisMetric, statId, selectedAxisMetric)
        }
      }, 50);
    },
    
    toggleStatView(statId, mode) {
      const stringId = String(statId)
      this.$set(this.statViewModes, stringId, mode)
      
      if (mode === 'chart') {
        const chartType = this.chartViewTypes[stringId] || this.getDefaultChartType(this.getStatTypeById(stringId), this.getStatDataById(stringId))
        this.$set(this.chartViewTypes, stringId, chartType)
        
        setTimeout(() => {
          this.recreateChart(stringId)
        }, 50);
      }
    },
    
    recreateChart(statId) {
      const chartType = this.chartViewTypes[statId] || this.getDefaultChartType(this.getStatTypeById(statId), this.getStatDataById(statId))
      
      if (chartType === 'timeseries') {
        if (this.barChartInstances.has(statId)) {
          this.barChartInstances.get(statId).destroy()
          this.barChartInstances.delete(statId)
        }
        this.updateTimeseriesChart(statId)
      } else if (chartType === 'bar') {
        if (this.timeseriesChartInstances.has(statId)) {
          this.timeseriesChartInstances.get(statId).destroy()
          this.timeseriesChartInstances.delete(statId)
        }
        this.updateBarChart(statId)
      }
    },
    
    getStatTypeById(statId) {
      const parts = String(statId).split('-')
      const actualStatId = parts.length > 1 ? parts[parts.length - 1] : statId
      const stat = this.statsData.find(s => s.id === Number(actualStatId))
      return stat ? stat.type : ''
    },
    
    getSelectedTableMetrics(statId) {
      if (!this.selectedTableMetrics[statId] || this.selectedTableMetrics[statId].length === 0) {
        const availableMetrics = this.getTableMetrics(this.getStatDataById(statId))
        if (availableMetrics.length > 0) {
          this.$set(this.selectedTableMetrics, statId, availableMetrics)
          return availableMetrics
        } else {
          return []
        }
      }
      return this.selectedTableMetrics[statId]
    },
    
    updateChart(statId) {
      this.clearCachedData(statId);
      const chartType = this.chartViewTypes[statId] || 'bar';
      this.$set(this.statViewModes, statId, 'chart');
      
      if (chartType === 'timeseries') {
        if (this.timeseriesChartInstances.has(statId)) {
          this.timeseriesChartInstances.get(statId).destroy();
          this.timeseriesChartInstances.delete(statId);
        }
        
        this.$nextTick(() => {
          const canvas = this.getChartCanvas('timeseries', statId);
          if (!canvas) return;
          
          const stat = this.getStatById(statId);
          if (stat) {
            this.createTimeseriesChart(stat, canvas, statId);
          }
        });
      } else {
        if (this.barChartInstances.has(statId)) {
          this.barChartInstances.get(statId).destroy();
          this.barChartInstances.delete(statId);
        }
        
        this.$nextTick(() => {
          const canvas = this.getChartCanvas('barchart', statId);
          if (!canvas) return;
          
          const stat = this.getStatById(statId);
          if (stat) {
            this.createBarChart(stat, canvas, statId);
          }
        });
      }
    },
    
    updateTimeseriesChart(statId) {
      const canvas = this.getChartCanvas('timeseries', statId);
      if (!canvas) return;
      
      if (this.timeseriesChartInstances.has(statId)) {
        this.timeseriesChartInstances.get(statId).destroy();
        this.timeseriesChartInstances.delete(statId);
      }
      
      const stat = this.getStatById(statId);
      if (stat) {
        this.createTimeseriesChart(stat, canvas, statId);
      }
    },
    
    updateBarChart(statId) {
      const canvas = this.getChartCanvas('barchart', statId);
      if (!canvas) return;
      
      if (this.barChartInstances.has(statId)) {
        this.barChartInstances.get(statId).destroy();
        this.barChartInstances.delete(statId);
      }
      
      const stat = this.getStatById(statId);
      if (stat) {
        this.createBarChart(stat, canvas, statId);
      }
    },
    
    getChartCanvas(type, statId) {
      const parts = String(statId).split('-');
      let refName;
      
      if (parts.length > 1) {
        const siteId = parts.slice(0, -1).join('-');
        const actualStatId = parts[parts.length - 1];
        refName = `${type}-${siteId}-${actualStatId}`;
      } else {
        refName = `${type}-${statId}`;
      }
      
      return this.getCanvasRef(refName);
    },
    
    getCanvasRef(refName) {
      const possibleRef = this.$refs[refName];
      return Array.isArray(possibleRef) ? possibleRef[0] : possibleRef;
    },
    
    getTableMetrics(data) {
      const cacheKey = JSON.stringify(data || []).slice(0, 100);
      if (this.tableMetricsCache[cacheKey]) {
        return this.tableMetricsCache[cacheKey];
      }
      
      if (!data || !data.length) return [];
      
      const metrics = new Set();
      data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== 'Day' && key !== 'site' && 
              item[key]?.type === 'number' && 
              item[key]?.value !== undefined && 
              !isNaN(parseFloat(item[key].value))) {
            metrics.add(key);
          }
        });
      });
      
      const result = Array.from(metrics).map(m => ({ value: m, text: m }));
      this.tableMetricsCache[cacheKey] = result;
      return result;
    },
    
    hasNumericData(dataArray) {
      if (!Array.isArray(dataArray)) return false;
      return dataArray.some(d => d.type === 'number' && !isNaN(parseFloat(d.value)));
    },
    
    getStatValue(data) {
      const numeric = data.filter(d => d.type === 'number' && !isNaN(parseFloat(d.value)));
      if (!numeric.length) return 0;
      
      let sum = 0;
      numeric.forEach(d => {
        sum += parseFloat(d.value);
      });
      
      return sum;
    },
    
    extractPieData(data) {
      const numeric = data.filter(d => d.type === 'number' && !isNaN(parseFloat(d.value)));
      const agg = {};
      
      numeric.forEach(d => {
        if (!agg[d.name]) agg[d.name] = 0;
        agg[d.name] += parseFloat(d.value);
      });
      
      const labels = Object.keys(agg);
      const values = Object.values(agg);
      
      return { labels, values };
    },
    
    hasPieData(data) {
      const { values } = this.extractPieData(data);
      return values.some(value => value > 0);
    },
    
    createPieChart(stat, canvas, instanceKey) {
      if (!canvas?.getContext) return;
      
      if (this.pieChartInstances.has(instanceKey)) {
        this.pieChartInstances.get(instanceKey).destroy();
        this.pieChartInstances.delete(instanceKey);
      }
      
      let dataToUse = stat.data;
      const statIdStr = String(instanceKey);
      
      if (typeof statIdStr === 'string' && statIdStr.includes('-')) {
        const parts = statIdStr.split('-');
        const siteId = parts.slice(0, -1).join('-');
        dataToUse = stat.data.filter(x => x.site === siteId);
      }
      
      const { labels, values } = this.extractPieData(dataToUse);
      const total = values.reduce((a, b) => a + b, 0);
      
      if (total === 0) return;
      
      try {
        const ctx = canvas.getContext('2d');
        const backgroundColors = labels.map((_, i) => this.colors[i % this.colors.length]);
        
        const chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              data: values,
              backgroundColor: backgroundColors,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            layout: { padding: 0 },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (context) => {
                    const value = context.parsed;
                    const label = context.label;
                    const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${value} (${pct}%)`;
                  }
                }
              },
              datalabels: {
                display: true,
                color: '#FFFFFF',
                font: { size: 12 },
                formatter: value => {
                  if (!total) return '0%';
                  return ((value / total) * 100).toFixed(1) + '%';
                }
              }
            }
          }
        });
        
        this.pieChartInstances.set(instanceKey, chart);
      } catch (error) {
        console.error("Error creating pie chart:", error);
      }
    },
    
    getBarTableData(data, statId) {
      if (!data || !data.length) return [];
      
      const hasDay = this.hasDay(data);
      
      if (hasDay) {
        const groupBy = this.timeGrouping[statId] || 'day';
        const fusionMethod = this.getFusionMethod(statId);
        const dateMap = {};
        const selectedMetrics = this.getSelectedTableMetrics(statId);
        const metricNames = selectedMetrics.map(m => m.value);
        
        data.forEach(d => {
          if (!d?.Day?.value) return;
          
          const dateObj = new Date(d.Day.value);
          if (isNaN(dateObj)) return;
          
          let dateKey;
          if (groupBy === 'day') {
            dateKey = dateObj.toISOString().split('T')[0];
          } else if (groupBy === 'month') {
            dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
          } else if (groupBy === 'year') {
            dateKey = `${dateObj.getFullYear()}`;
          }
          
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = {
              date: dateObj,
              values: Array(metricNames.length).fill(0),
              _count: Array(metricNames.length).fill(0),
              _min: Array(metricNames.length).fill(Infinity),
              _max: Array(metricNames.length).fill(-Infinity)
            };
          }
          
          metricNames.forEach((m, idx) => {
            const val = parseFloat(d[m]?.value || 0);
            if (!isNaN(val)) {
              dateMap[dateKey].values[idx] += val;
              dateMap[dateKey]._count[idx] += 1;
              
              if (val < dateMap[dateKey]._min[idx]) {
                dateMap[dateKey]._min[idx] = val;
              }
              
              if (val > dateMap[dateKey]._max[idx]) {
                dateMap[dateKey]._max[idx] = val;
              }
            }
          });
        });
        
        Object.keys(dateMap).forEach(key => {
          const item = dateMap[key];
          
          for (let i = 0; i < item.values.length; i++) {
            if (fusionMethod === 'avg' && item._count[i] > 0) {
              item.values[i] = item.values[i] / item._count[i];
            } else if (fusionMethod === 'max' && item._max[i] !== -Infinity) {
              item.values[i] = item._max[i];
            } else if (fusionMethod === 'min' && item._min[i] !== Infinity) {
              item.values[i] = item._min[i];
            }
          }
        });
        
        return Object.values(dateMap).sort((a, b) => a.date - b.date);
      } else {
        const selectedMetrics = this.getSelectedTableMetrics(statId);
        const tableData = this.getTableData(data, statId);
        
        if (!tableData.length) return [];
        
        return tableData.map(row => ({
          axis: row.axis,
          values: selectedMetrics.map(metric => row.values[metric.value] || 0)
        }));
      }
    },
    
    cleanupAllCharts() {
      this.pieChartInstances.forEach(chart => {
        try {
          chart.destroy();
        } catch (e) {
          console.error("Error destroying chart:", e);
        }
      });
      
      this.timeseriesChartInstances.forEach(chart => {
        try {
          chart.destroy();
        } catch (e) {
          console.error("Error destroying chart:", e);
        }
      });
      
      this.barChartInstances.forEach(chart => {
        try {
          chart.destroy();
        } catch (e) {
          console.error("Error destroying chart:", e);
        }
      });
      
      this.tableChartInstances.forEach(chart => {
        try {
          chart.destroy();
        } catch (e) {
          console.error("Error destroying chart:", e);
        }
      });
      
      this.pieChartInstances.clear();
      this.timeseriesChartInstances.clear();
      this.barChartInstances.clear();
      this.tableChartInstances.clear();
    },
    
    createAllCharts() {
      this.cleanupAllCharts();
      
      if (this.pendingRefresh) return;
      
      setTimeout(() => {
        if (this.separateView) {
          this.selectedSites.forEach(site => {
            const siteStats = this.filterStatsBySite(this.statsData, site.client_id);
            
            siteStats.forEach(stat => {
              const type = stat.type.toLowerCase();
              const chartKey = `${site.client_id}-${stat.id}`;
              
              if (!this.chartViewTypes[chartKey]) {
                this.$set(this.chartViewTypes, chartKey, this.getDefaultChartType(stat.type, stat.data));
              }
              
              if (!this.statViewModes[chartKey]) {
                this.$set(this.statViewModes, chartKey, 'chart');
              }
              
              if (!this.timeGrouping[chartKey]) {
                this.$set(this.timeGrouping, chartKey, 'day');
              }
              
              if (!this.fusionMethod[chartKey]) {
                this.$set(this.fusionMethod, chartKey, 'sum');
              }
              
              if (!this.selectedTableMetrics[chartKey] || this.selectedTableMetrics[chartKey].length === 0) {
                const metrics = this.getTableMetrics(stat.data);
                if (metrics.length > 0) {
                  this.$set(this.selectedTableMetrics, chartKey, metrics);
                }
              }
              
              const filteredData = stat.data.filter(x => x.site === site.client_id);
              const hasTemporalData = this.hasDay(filteredData);
              const chartType = this.chartViewTypes[chartKey] || this.getDefaultChartType(stat.type, filteredData);
              
              if (type.includes('pie')) {
                const canvas = this.getCanvasRef(`piechart-${site.client_id}-${stat.id}`);
                if (canvas) {
                  this.createPieChart(stat, canvas, chartKey);
                }
              } else if ((type.includes('timeseries') || chartType === 'timeseries') && 
                        hasTemporalData && 
                        (!this.statViewModes[chartKey] || this.statViewModes[chartKey] === 'chart')) {
                const canvas = this.getCanvasRef(`timeseries-${site.client_id}-${stat.id}`);
                if (canvas) {
                  this.createTimeseriesChart(stat, canvas, chartKey);
                }
              } else if ((type.includes('bar') || type === 'table' || chartType === 'bar') && 
                        (!this.statViewModes[chartKey] || this.statViewModes[chartKey] === 'chart')) {
                const canvas = this.getCanvasRef(`barchart-${site.client_id}-${stat.id}`);
                if (canvas) {
                  this.createBarChart(stat, canvas, chartKey);
                }
              }
            });
          });
        } else {
          this.statsData.forEach(stat => {
            const type = stat.type.toLowerCase();
            const chartId = String(stat.id);
            
            if (!this.chartViewTypes[chartId]) {
              this.$set(this.chartViewTypes, chartId, this.getDefaultChartType(stat.type, stat.data));
            }
            
            if (!this.statViewModes[chartId]) {
              this.$set(this.statViewModes, chartId, 'chart');
            }
            
            if (!this.timeGrouping[chartId]) {
              this.$set(this.timeGrouping, chartId, 'day');
            }
            
            if (!this.fusionMethod[chartId]) {
              this.$set(this.fusionMethod, chartId, 'sum');
            }
            
            if (!this.selectedTableMetrics[chartId] || this.selectedTableMetrics[chartId].length === 0) {
              const metrics = this.getTableMetrics(stat.data);
              if (metrics.length > 0) {
                this.$set(this.selectedTableMetrics, chartId, metrics);
              }
            }
            
            const hasTemporalData = this.hasDay(stat.data);
            const chartType = this.chartViewTypes[chartId] || this.getDefaultChartType(stat.type, stat.data);
            
            if (type.includes('pie')) {
              const canvas = this.getCanvasRef(`piechart-${stat.id}`);
              if (canvas) {
                this.createPieChart(stat, canvas, chartId);
              }
            } else if ((type.includes('timeseries') || chartType === 'timeseries') && 
                      hasTemporalData && 
                      (!this.statViewModes[chartId] || this.statViewModes[chartId] === 'chart')) {
              const canvas = this.getCanvasRef(`timeseries-${stat.id}`);
              if (canvas) {
                this.createTimeseriesChart(stat, canvas, chartId);
              }
            } else if ((type.includes('bar') || type === 'table' || chartType === 'bar') && 
                      (!this.statViewModes[chartId] || this.statViewModes[chartId] === 'chart')) {
              const canvas = this.getCanvasRef(`barchart-${stat.id}`);
              if (canvas) {
                this.createBarChart(stat, canvas, chartId);
              }
            }
          });
        }
      }, 100);
    },

    getTableData(data, statId) {
      if (!data || !data.length) return [];
      
      const statIdStr = String(statId);
      const fusionMethod = this.getFusionMethod(statId);
      const stat = this.statsData.find(s => {
        if (typeof statIdStr === 'string' && statIdStr.includes('-')) {
          const parts = statIdStr.split('-');
          const actualStatId = parts[parts.length - 1];
          return s.id === Number(actualStatId);
        }
        return s.id === Number(statId);
      });
      
      if (this.hasDay(data)) {
        const groupBy = this.timeGrouping[statId] || 'day';
        const dateMap = {};
        const metrics = new Set();
        
        data.forEach(d => {
          Object.keys(d).forEach(key => {
            if (key !== 'Day' && key !== 'site' && d[key]?.value !== undefined) {
              metrics.add(key);
            }
          });
        });
        
        const metricNames = Array.from(metrics);
        
        data.forEach(d => {
          if (!d?.Day?.value) return;
          
          const dt = new Date(d.Day.value);
          if (isNaN(dt)) return;
          
          let dateKey;
          let dateObj;
          
          if (groupBy === 'day') {
            dateKey = dt.toISOString().split('T')[0];
            dateObj = dt;
          } else if (groupBy === 'month') {
            dateKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
            dateObj = new Date(dt.getFullYear(), dt.getMonth(), 1);
          } else if (groupBy === 'year') {
            dateKey = `${dt.getFullYear()}`;
            dateObj = new Date(dt.getFullYear(), 0, 1);
          }
          
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = {
              date: dateObj,
              _count: {},
              _min: {},
              _max: {}
            };
            
            metricNames.forEach(m => {
              dateMap[dateKey][m] = 0;
              dateMap[dateKey]._count[m] = 0;
              dateMap[dateKey]._min[m] = Infinity;
              dateMap[dateKey]._max[m] = -Infinity;
            });
          }
          
          metricNames.forEach(m => {
            const val = d[m]?.value;
            if (val !== undefined && !isNaN(parseFloat(val))) {
              const numVal = parseFloat(val);
              dateMap[dateKey][m] += numVal;
              dateMap[dateKey]._count[m] += 1;
              
              if (numVal < dateMap[dateKey]._min[m]) {
                dateMap[dateKey]._min[m] = numVal;
              }
              
              if (numVal > dateMap[dateKey]._max[m]) {
                dateMap[dateKey]._max[m] = numVal;
              }
            }
          });
        });
        
        return Object.values(dateMap)
          .sort((a, b) => a.date - b.date)
          .map(row => {
            const processedRow = { date: row.date };
            
            Object.keys(row)
              .filter(key => key !== 'date' && key !== '_count' && key !== '_min' && key !== '_max')
              .forEach(key => {
                if (fusionMethod === 'avg' && row._count[key] > 0) {
                  processedRow[key] = row[key] / row._count[key];
                } else if (fusionMethod === 'max' && row._max[key] !== -Infinity) {
                  processedRow[key] = row._max[key];
                } else if (fusionMethod === 'min' && row._min[key] !== Infinity) {
                  processedRow[key] = row._min[key];
                } else {
                  processedRow[key] = row[key];
                }
              });
              
            return processedRow;
          });
      } else {
        const axisMetric = this.selectedAxisMetric[statId];
        if (!axisMetric) {
          const options = this.getAxisMetricsOptions(data);
          if (options.length > 0) {
            this.$set(this.selectedAxisMetric, statId, options[0]);
          } else {
            return [];
          }
        }
        
        const axisKey = this.selectedAxisMetric[statId].value;
        const valueMetrics = this.getSelectedTableMetrics(statId);
        const axisValues = new Map();
        
        data.forEach(d => {
          const axisValue = d[axisKey]?.value;
          if (!axisValue) return;
          
          if (!axisValues.has(axisValue)) {
            const values = {};
            valueMetrics.forEach(metric => {
              values[metric.value] = 0;
            });
            axisValues.set(axisValue, values);
          }
          
          const values = axisValues.get(axisValue);
          valueMetrics.forEach(metric => {
            const val = parseFloat(d[metric.value]?.value);
            if (!isNaN(val)) {
              values[metric.value] += val;
            }
          });
        });
        
        return Array.from(axisValues.entries()).map(([axis, values]) => ({
          axis,
          values
        }));
      }
    },
    
    extractTimeseriesData(data, instanceKey) {
      if (!data?.length) return [];
      
      let dataToUse = data;
      const statIdStr = String(instanceKey);
      
      if (typeof statIdStr === 'string' && statIdStr.includes('-')) {
        const parts = statIdStr.split('-');
        const siteId = parts.slice(0, -1).join('-');
        const actualStatId = parts[parts.length - 1];
        
        const stat = this.statsData.find(s => s.id === Number(actualStatId));
        if (stat) {
          dataToUse = stat.data.filter(x => x.site === siteId);
        }
      }

      const selectedMetrics = this.getSelectedTableMetrics(instanceKey);
      const metricNames = selectedMetrics.map(m => m.value);
      const groupBy = this.timeGrouping[instanceKey] || 'day';
      const fusionMethod = this.getFusionMethod(instanceKey);
      
      if (metricNames.length === 0) return [];
      
      const dateMap = {};
      dataToUse.forEach(d => {
        if (!d?.Day?.value) return;
        
        const dt = new Date(d.Day.value);
        if (isNaN(dt)) return;
        
        let dateKey;
        if (groupBy === 'day') {
          dateKey = dt.toISOString().split('T')[0];
        } else if (groupBy === 'month') {
          dateKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        } else if (groupBy === 'year') {
          dateKey = `${dt.getFullYear()}`;
        }
        
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = {
            date: groupBy === 'day' ? dt : 
                 groupBy === 'month' ? new Date(dt.getFullYear(), dt.getMonth(), 1) : 
                 new Date(dt.getFullYear(), 0, 1),
            _count: {},
            _min: {},
            _max: {}
          };
          
          metricNames.forEach(m => {
            dateMap[dateKey][m] = 0;
            dateMap[dateKey]._count[m] = 0;
            dateMap[dateKey]._min[m] = Infinity;
            dateMap[dateKey]._max[m] = -Infinity;
          });
        }
        
        metricNames.forEach(m => {
          if (d[m]?.type === 'number') {
            const val = parseFloat(d[m]?.value || 0);
            if (!isNaN(val)) {
              dateMap[dateKey][m] += val;
              dateMap[dateKey]._count[m] += 1;
              
              if (val < dateMap[dateKey]._min[m]) {
                dateMap[dateKey]._min[m] = val;
              }
              
              if (val > dateMap[dateKey]._max[m]) {
                dateMap[dateKey]._max[m] = val;
              }
            }
          }
        });
      });
      
      const sortedKeys = Object.keys(dateMap).sort((a, b) => a.localeCompare(b));
      const results = [];
      
      metricNames.forEach((metric, index) => {
        const points = [];
        
        sortedKeys.forEach(k => {
          let value = 0;
          
          if (dateMap[k]._count[metric] > 0) {
            if (fusionMethod === 'avg' && dateMap[k]._count[metric] > 0) {
              value = dateMap[k][metric] / dateMap[k]._count[metric];
            } else if (fusionMethod === 'max' && dateMap[k]._max[metric] !== -Infinity) {
              value = dateMap[k]._max[metric];
            } else if (fusionMethod === 'min' && dateMap[k]._min[metric] !== Infinity) {
              value = dateMap[k]._min[metric];
            } else {
              value = dateMap[k][metric];
            }
          }
          
          points.push({ x: dateMap[k].date, y: value });
        });
        
        if (points.length > 0) {
          results.push({
            label: metric,
            data: points,
            borderColor: this.colors[index % this.colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: this.colors[index % this.colors.length],
            pointBorderColor: '#FFF',
            pointHoverRadius: 6,
            fill: false,
            tension: 0.1
          });
        }
      });
      
      return results;
    },
    
    extractBarData(data, instanceKey) {
      if (!data || !data.length) return [];
      
      const statIdStr = String(instanceKey);
      const groupBy = this.timeGrouping[instanceKey] || 'day';
      const hasDay = this.hasDay(data);
      
      if (hasDay) {
        const selectedMetrics = this.getSelectedTableMetrics(instanceKey);
        const metricNames = selectedMetrics.map(m => m.value);
        const fusionMethod = this.getFusionMethod(instanceKey);
        
        if (metricNames.length === 0) return [];
        
        const stat = this.statsData.find(s => {
          if (typeof statIdStr === 'string' && statIdStr.includes('-')) {
            const parts = statIdStr.split('-');
            const actualStatId = parts[parts.length - 1];
            return s.id === Number(actualStatId);
          }
          return s.id === Number(instanceKey);
        });
        
        if (!stat) return [];
        
        let dataToUse = data;
        if (typeof statIdStr === 'string' && statIdStr.includes('-')) {
          const parts = statIdStr.split('-');
          const siteId = parts.slice(0, -1).join('-');
          dataToUse = stat.data.filter(x => x.site === siteId);
        }
        
        const dateMap = {};
        dataToUse.forEach(d => {
          if (!d?.Day?.value) return;
          
          const dateObj = new Date(d.Day.value);
          if (isNaN(dateObj)) return;
          
          let dateKey;
          if (groupBy === 'day') {
            dateKey = dateObj.toISOString().split('T')[0];
          } else if (groupBy === 'month') {
            dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
          } else if (groupBy === 'year') {
            dateKey = `${dateObj.getFullYear()}`;
          }
          
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = {
              date: groupBy === 'day' ? dateObj :
                    groupBy === 'month' ? new Date(dateObj.getFullYear(), dateObj.getMonth(), 1) :
                    new Date(dateObj.getFullYear(), 0, 1),
              _count: {},
              _min: {},
              _max: {}
            };
            
            metricNames.forEach(m => {
              dateMap[dateKey][m] = 0;
              dateMap[dateKey]._count[m] = 0;
              dateMap[dateKey]._min[m] = Infinity;
              dateMap[dateKey]._max[m] = -Infinity;
            });
          }
          
          metricNames.forEach(m => {
            if (d[m]?.type === 'number') {
              const val = parseFloat(d[m]?.value || 0);
              if (!isNaN(val)) {
                dateMap[dateKey][m] += val;
                dateMap[dateKey]._count[m] += 1;
                
                if (val < dateMap[dateKey]._min[m]) {
                  dateMap[dateKey]._min[m] = val;
                }
                
                if (val > dateMap[dateKey]._max[m]) {
                  dateMap[dateKey]._max[m] = val;
                }
              }
            }
          });
        });
        
        const sortedKeys = Object.keys(dateMap).sort((a, b) => a.localeCompare(b));
        const results = [];
        
        metricNames.forEach((metric, index) => {
          const points = [];
          
          sortedKeys.forEach(k => {
            let yVal = 0;
            
            if (dateMap[k]._count[metric] > 0) {
              if (fusionMethod === 'avg' && dateMap[k]._count[metric] > 0) {
                yVal = dateMap[k][metric] / dateMap[k]._count[metric];
              } else if (fusionMethod === 'max' && dateMap[k]._max[metric] !== -Infinity) {
                yVal = dateMap[k]._max[metric];
              } else if (fusionMethod === 'min' && dateMap[k]._min[metric] !== Infinity) {
                yVal = dateMap[k]._min[metric];
              } else {
                yVal = dateMap[k][metric];
              }
            }
            
            points.push({ x: dateMap[k].date, y: yVal });
          });
          
          if (points.length > 0) {
            results.push({
              label: metric,
              data: points
            });
          }
        });
        
        return results;
      } else {
        const selectedMetrics = this.getSelectedTableMetrics(instanceKey);
        const metricNames = selectedMetrics.map(m => m.value);
        
        if (metricNames.length === 0) return [];
        
        const axisOptions = this.getAxisMetricsOptions(data);
        if (axisOptions.length === 0) return [];
        
        let axisKey = null;
        if (this.selectedAxisMetric[instanceKey]) {
          axisKey = this.selectedAxisMetric[instanceKey].value;
        } else {
          axisKey = axisOptions[0].value;
          this.$set(this.selectedAxisMetric, instanceKey, axisOptions[0]);
        }
        
        const axisValues = new Map();
        data.forEach(d => {
          const axisValue = d[axisKey]?.value;
          if (!axisValue) return;
          
          if (!axisValues.has(axisValue)) {
            axisValues.set(axisValue, { _count: {} });
            metricNames.forEach(m => {
              axisValues.get(axisValue)[m] = 0;
              axisValues.get(axisValue)._count[m] = 0;
            });
          }
          
          const values = axisValues.get(axisValue);
          metricNames.forEach(m => {
            if (d[m]?.type === 'number') {
              const val = parseFloat(d[m]?.value || 0);
              if (!isNaN(val)) {
                values[m] += val;
                values._count[m] += 1;
              }
            }
          });
        });
        
        const results = [];
        metricNames.forEach((metric, index) => {
          const points = [];
          
          axisValues.forEach((values, axisValue) => {
            if (values._count[metric] > 0) {
              points.push({
                x: axisValue,
                y: values[metric] || 0
              });
            }
          });
          
          if (points.length > 0) {
            results.push({
              label: metric,
              data: points
            });
          }
        });
        
        return results;
      }
    },
    
    extractGaugeData(data) {
      const numeric = data.filter(d => d.type === 'number' && !isNaN(parseFloat(d.value)));
      const sumMap = {};
      const countMap = {};
      
      numeric.forEach(d => {
        if (!sumMap[d.name]) {
          sumMap[d.name] = 0;
          countMap[d.name] = 0;
        }
        sumMap[d.name] += parseFloat(d.value);
        countMap[d.name] += 1;
      });
      
      return Object.keys(sumMap).map(n => ({
        name: n,
        value: sumMap[n] / countMap[n]
      }));
    },
    
    limitGaugeValue(val) {
      let v = !val || isNaN(val) ? 0 : val;
      if (v < 0) v = 0;
      if (v > 100) v = 100;
      return Number.isInteger(v) ? v : Number(v.toFixed(2));
    },
    
    getArcPathValid(value) {
      let v = !value || isNaN(value) ? 0 : value;
      if (v < 0) v = 0;
      if (v > 100) v = 100;
      
      const centerX = 100;
      const centerY = 90;
      const radius = 80;
      
      const polarToCartesian = angle => {
        const angleInRadians = (angle - 90) * Math.PI / 180;
        return {
          x: centerX + radius * Math.cos(angleInRadians),
          y: centerY + radius * Math.sin(angleInRadians)
        };
      };
      
      const startAngle = 0;
      const endAngle = v * 1.8;
      const start = polarToCartesian(startAngle);
      const end = polarToCartesian(endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
      const sweepFlag = 1;
      
      return `
        M ${start.x},${start.y}
        A ${radius},${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}
      `;
    },

    createTimeseriesChart(stat, canvas, instanceKey) {
      if (!canvas?.getContext) return;
      
      if (this.timeseriesChartInstances.has(instanceKey)) {
        this.timeseriesChartInstances.get(instanceKey).destroy();
        this.timeseriesChartInstances.delete(instanceKey);
      }
      
      const datasets = this.getCachedTimeseriesData(instanceKey);
      if (!datasets || datasets.length === 0) return;
      
      const ctx = canvas.getContext('2d');
      const currentGroupBy = this.timeGrouping[instanceKey] || 'day';
      const currentFusionMethod = this.fusionMethod[instanceKey] || 'sum';
      
      let maxValue = 0;
      datasets.forEach(dataset => {
        dataset.data.forEach(point => {
          if (point.y > maxValue) maxValue = point.y;
        });
      });
      
      const chartConfig = {
        type: 'line',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onHover: null,
          hover: {
            mode: 'nearest',
            intersect: true,
            animationDuration: 0
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              fontColor: '#9CC4E4',
              boxWidth: 12,
              padding: 15
            }
          },
          tooltips: {
            enabled: true,
            mode: 'nearest',
            intersect: true,
            backgroundColor: 'rgba(43,54,72,0.95)',
            titleFontColor: '#FFFFFF',
            bodyFontColor: '#9CC4E4',
            displayColors: true,
            callbacks: {
              title: function (tooltipItems) {
                if (!tooltipItems || !tooltipItems.length) return '';
                const item = tooltipItems[0];
                if (!item || !item.xLabel) return '';
                
                try {
                  const groupBy = currentGroupBy;
                  let date;
                  
                  if (typeof item.xLabel === 'string') {
                    date = new Date(item.xLabel);
                  } else if (item.xLabel instanceof Date) {
                    date = item.xLabel;
                  } else if (typeof item.xLabel === 'number') {
                    date = new Date(item.xLabel);
                  } else {
                    return String(item.xLabel || '');
                  }
                  
                  if (isNaN(date.getTime())) {
                    return String(item.xLabel);
                  }
                  
                  if (groupBy === 'day') {
                    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  } else if (groupBy === 'month') {
                    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
                  } else if (groupBy === 'year') {
                    return date.getFullYear().toString();
                  }
                  
                  return date.toLocaleDateString('fr-FR');
                } catch (e) {
                  return String(item.xLabel || '');
                }
              },
              label: function (tooltipItem, data) {
                if (!tooltipItem || !data.datasets) return '';
                const dataset = data.datasets[tooltipItem.datasetIndex];
                if (!dataset) return '';
                
                const value = tooltipItem.yLabel;
                const label = dataset.label || '';
                return `${label}: ${Math.round(value)}`;
              }
            }
          },
          animation: { duration: 0 },
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'series',
              offset: false,
              time: {
                unit: currentGroupBy,
                minUnit: currentGroupBy,
                displayFormats: {
                  day: 'DD/MM',
                  month: 'MMM YYYY',
                  year: 'YYYY'
                },
                tooltipFormat: 'DD/MM/YYYY'
              },
              ticks: {
                source: 'data',
                fontColor: '#9CC4E4',
                maxRotation: 45,
                minRotation: 0
              },
              gridLines: { display: false },
              bounds: 'data'
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: '#9CC4E4',
                precision: 0,
                callback: function (value) {
                  return Math.round(value);
                },
                stepSize: Math.max(1, Math.ceil(maxValue / 5))
              },
              gridLines: { color: 'rgba(156,196,228,0.1)' }
            }]
          },
          plugins: { datalabels: { display: false } }
        }
      };
      
      try {
        const chart = new Chart(ctx, chartConfig);
        chart._currentConfig = {
          timeGrouping: currentGroupBy,
          fusionMethod: currentFusionMethod
        };
        this.timeseriesChartInstances.set(instanceKey, chart);
      } catch (error) {
        console.error("Error creating timeseries chart:", error);
      }
    },
    
    createBarChart(stat, canvas, instanceKey) {
      if (!canvas?.getContext) return;
      
      if (this.barChartInstances.has(instanceKey)) {
        this.barChartInstances.get(instanceKey).destroy();
        this.barChartInstances.delete(instanceKey);
      }
      
      const datasets = this.getCachedBarData(instanceKey);
      if (!datasets || datasets.length === 0) return;
      
      const ctx = canvas.getContext('2d');
      const currentGroupBy = this.timeGrouping[instanceKey] || 'day';
      const currentFusionMethod = this.fusionMethod[instanceKey] || 'sum';
      const hasDay = this.hasDay(this.getStatDataById(instanceKey));
      
      const labels = new Set();
      const dataByLabel = {};
      
      datasets.forEach(dataset => {
        dataset.data.forEach(point => {
          let label;
          
          if (hasDay) {
            const dateObj = new Date(point.x);
            
            if (currentGroupBy === 'day') {
              label = dateObj.toLocaleDateString('fr-FR');
            } else if (currentGroupBy === 'month') {
              label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(dateObj);
            } else if (currentGroupBy === 'year') {
              label = dateObj.getFullYear().toString();
            }
          } else {
            label = point.x.toString();
          }
          
          labels.add(label);
          
          if (!dataByLabel[label]) {
            dataByLabel[label] = {};
          }
        });
      });
      
      datasets.forEach(dataset => {
        const metricName = dataset.label;
        
        dataset.data.forEach(point => {
          let label;
          
          if (hasDay) {
            const dateObj = new Date(point.x);
            
            if (currentGroupBy === 'day') {
              label = dateObj.toLocaleDateString('fr-FR');
            } else if (currentGroupBy === 'month') {
              label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(dateObj);
            } else if (currentGroupBy === 'year') {
              label = dateObj.getFullYear().toString();
            }
          } else {
            label = point.x.toString();
          }
          
          dataByLabel[label][metricName] = point.y;
        });
      });
      
      const sortedLabels = Array.from(labels);
      if (hasDay) {
        sortedLabels.sort((a, b) => {
          if (currentGroupBy === 'day') {
            const partsA = a.split('/').reverse().map(num => parseInt(num));
            const partsB = b.split('/').reverse().map(num => parseInt(num));
            if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
            if (partsA[1] !== partsB[1]) return partsA[1] - partsB[1];
            return partsA[2] - partsB[2];
          } else if (currentGroupBy === 'month') {
            const monthNamesMap = {
              'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
              'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
            };
            const monthA = a.split(' ')[0].toLowerCase();
            const yearA = parseInt(a.split(' ')[1]);
            const monthB = b.split(' ')[0].toLowerCase();
            const yearB = parseInt(b.split(' ')[1]);
            if (yearA !== yearB) return yearA - yearB;
            return monthNamesMap[monthA] - monthNamesMap[monthB];
          } else if (currentGroupBy === 'year') {
            return parseInt(a) - parseInt(b);
          }
          return 0;
        });
      }
      
      const chartDatasets = [];
      const metricNames = datasets.map(d => d.label);
      
      metricNames.forEach((metric, index) => {
        const data = sortedLabels.map(label => dataByLabel[label][metric] || 0);
        
        chartDatasets.push({
          label: metric,
          data,
          backgroundColor: this.colors[index % this.colors.length],
          borderColor: this.colors[index % this.colors.length],
          borderWidth: 1
        });
      });
      
      let stackedMax = 0;
      sortedLabels.forEach(label => {
        let sum = 0;
        metricNames.forEach(metric => {
          sum += dataByLabel[label][metric] || 0;
        });
        if (sum > stackedMax) stackedMax = sum;
      });
      
      try {
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: sortedLabels,
            datasets: chartDatasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 20 },
            hover: {
              mode: 'index',
              intersect: false,
              animationDuration: 0
            },
            legend: {
              position: 'bottom',
              labels: { fontColor: '#9CC4E4' }
            },
            tooltips: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(43,54,72,0.95)',
              titleFontColor: '#FFFFFF',
              bodyFontColor: '#9CC4E4',
              callbacks: {
                title: function (tooltipItems) {
                  if (!tooltipItems || !tooltipItems.length) return '';
                  return tooltipItems[0].xLabel || '';
                },
                label: function (tooltipItem, data) {
                  return `${data.datasets[tooltipItem.datasetIndex].label}: ${Math.round(tooltipItem.yLabel)}`;
                }
              }
            },
            scales: {
              xAxes: [{
                stacked: true,
                gridLines: { display: false },
                ticks: {
                  fontColor: '#9CC4E4',
                  maxRotation: 0,
                  minRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 10,
                  padding: 8
                }
              }],
              yAxes: [{
                stacked: true,
                beginAtZero: true,
                gridLines: { color: 'rgba(156,196,228,0.1)' },
                ticks: {
                  fontColor: '#9CC4E4',
                  precision: 0,
                  callback: function (value) {
                    return Math.round(value);
                  },
                  stepSize: Math.max(1, Math.ceil(stackedMax / 5))
                }
              }]
            },
            animation: { duration: 0 },
            plugins: { datalabels: { display: false } }
          }
        });
        
        chart._currentConfig = {
          timeGrouping: currentGroupBy,
          fusionMethod: currentFusionMethod
        };
        
        this.barChartInstances.set(instanceKey, chart);
      } catch (error) {
        console.error("Error creating bar chart:", error);
      }
    },
    
    filterStatsBySite(stats, siteId) {
      return stats.map(stat => ({
        ...stat,
        data: stat.data.filter(x => x.site === siteId)
      }));
    },
    
    formatDateToFrench(date) {
      if (!date || isNaN(new Date(date))) return '';
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    statIsDisplayed(statId) {
      return this.displayedStats.includes(statId);
    },
    
    toggleStat(statId) {
      const i = this.displayedStats.indexOf(statId);
      if (i > -1) {
        this.displayedStats.splice(i, 1);
        this.statsData = this.statsData.filter(s => s.id !== statId);
      } else {
        this.displayedStats.push(statId);
        const found = this.availableStats.find(s => s.id === statId);
        if (found) {
          this.statsData.push({ ...found, data: [] });
        }
      }
      this.markNeedsUpdate();
    },
    
    removeStat(statId) {
      this.toggleStat(statId);
    },
    
    closeModal() {
      this.isModalOpen = false;
    },
    
    getStatCardClass(stat) {
      const t = stat.type.toLowerCase();
      if (t.includes('timeseries')) return 'stat-card--timeseries';
      if (t.includes('bar')) return 'stat-card--bar';
      if (t.includes('pie')) return 'stat-card--pie';
      if (t.includes('gauge')) return 'stat-card--gauge';
      if (t === 'stat') return 'stat-card--normal';
      if (t === 'table') return 'stat-card--timeseries';
      return 'stat-card--normal';
    },
    
    getIconForStatType(type) {
      const t = type.toLowerCase();
      if (t.includes('gauge')) return 'speed';
      if (t.includes('bar')) return 'bar_chart';
      if (t.includes('pie')) return 'pie_chart';
      if (t.includes('timeseries')) return 'show_chart';
      if (t === 'stat') return 'pin';
      if (t === 'table') return 'table_chart';
      return 'equalizer';
    },
    
    getStatLayout() {
      return 'stat-layout-1';
    },
    
    initIntersectionObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }
      
      const options = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-50px 0px'
      };
      
      this.observer = new IntersectionObserver(entries => {
        let maxVisibility = 0;
        let mostVisibleSection = null;
        
        entries.forEach(entry => {
          const visibleRatio = entry.intersectionRatio;
          if (visibleRatio > maxVisibility) {
            maxVisibility = visibleRatio;
            mostVisibleSection = entry.target;
          }
        });
        
        if (mostVisibleSection && maxVisibility > 0.25) {
          this.currentSiteId = mostVisibleSection.id.replace('site-', '');
          this.showFloatingSiteTitle = true;
          this.siteTitleOpacity = Math.min(1, maxVisibility * 1.5);
        } else {
          this.showFloatingSiteTitle = false;
        }
      }, options);
      
      this.$nextTick(() => {
        const sections = document.querySelectorAll('.site-section');
        sections.forEach(section => this.observer.observe(section));
      });
    },
    
    handleScroll() {
      const s = window.scrollY || document.documentElement.scrollTop;
      const o = Math.max(0.3, 1 - s / 800);
      this.siteTitleOpacity = o;
    },
    
    handleDocumentClick(event) {
      const isControlPanel = event.target.closest('.stat-controls');
      const isControlToggle = event.target.closest('.stat-controls-toggle');
      
      if (!isControlPanel && !isControlToggle) {
        this.closeControlPanels();
      }
    },
    
    onSelect(selectedOption) {
      if (!this.selectedSites.some(site => site.client_id === selectedOption.client_id)) {
        this.selectedSites = [...this.selectedSites, selectedOption];
      }
      this.markNeedsUpdate();
    },
    
    onRemove(removedOption) {
      this.selectedSites = this.selectedSites.filter(site => site.client_id !== removedOption.client_id);
      this.markNeedsUpdate();
    },
    
    showBetaMessage() {
      this.$toastr.Add({
        name: 'BetaInfo',
        title: '🚀 Nouvelle Fonctionnalité en Beta !',
        msg: `
          <p style="margin-bottom: 10px;">
            Actuellement en phase de test, nous sommes ravis de vous offrir en primauté un accès libre et gratuit aux fonctionnalités de statistiques, afin que vous puissiez l'explorer et nous aider à l'améliorer.
          </p>
          <p style="margin-bottom: 10px; font-weight: bold;">
            Vos retours sont précieux !
          </p>
          <p style="margin-bottom: 10px;">
            Si vous rencontrez des problèmes ou avez des suggestions, n'hésitez pas à nous les transmettre :
          </p>
          <p style="margin-bottom: 10px; font-size: 16px;">
            📩 <a href="mailto:contact@kiplink.fr" style="color: #29C66F; text-decoration: underline; font-weight: bold;">
              contact@kiplink.fr
            </a>
          </p>
          <p style="margin-top: 15px;">
            Merci de votre participation et de votre confiance ! 🙏
          </p>
        `,
        clickClose: true,
        timeout: 10000,
        progressBarValue: 0,
        position: 'toast-top-right',
        type: 'info',
        preventDuplicates: true,
        classNames: ['animated', 'slideInRight'],
        style: { 'margin-top': '6%', 'width': '800px' }
      });
    },
    
    handleDragStart(e, stat, i) {
      this.isDragging = stat.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', i.toString());
      
      requestAnimationFrame(() => {
        e.target.classList.add('dragging');
      });
    },
    
    handleDragEnd(e) {
      this.isDragging = null;
      e.target.classList.remove('dragging');
      document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('drag-over'));
    },
    
    handleDragEnter(e, i) {
      if (!this.isDragging) return;
      const c = e.target.closest('.stat-card');
      if (c) c.classList.add('drag-over');
    },
    
    handleDragLeave(e) {
      const c = e.target.closest('.stat-card');
      if (c) c.classList.remove('drag-over');
    },
    
    handleDrop(e, dropI) {
      e.preventDefault();
      const dragI = parseInt(e.dataTransfer.getData('text/plain'));
      if (dragI === dropI) return;
      
      const arr = [...this.statsData];
      const [dragged] = arr.splice(dragI, 1);
      arr.splice(dropI, 0, dragged);
      
      this.statsData = arr;
      this.displayedStats = arr.map(s => s.id);
      
      document.querySelectorAll('.stat-card').forEach(c => c.classList.remove('drag-over'));
    },
    
    markNeedsUpdate() {
      this.needsUpdate = true;
    },
    
    handleAdd() {
      this.isModalOpen = true;
    },
    
    async handleSubmit() {
      if (!this.selectedSites.length) {
        this.$emit('error', { title: 'Attention', message: 'Veuillez sélectionner au moins un site' });
        return;
      }
      
      this.isLoading = true;
      await this.updateGrafanaDataSources();
      this.isLoading = false;
      this.needsUpdate = false;
    },
    
    async updateGrafanaDataSources() {
      if (!this.selectedSites.length) return;
      
      try {
        const promises = this.selectedSites.map(site => {
          if (!site || !site.virtual_ip) {
            return Promise.resolve();
          }
          
          return this.$axios.post(
            `${process.env.ODOO_API}api/v2/grafana/datasource/update`,
            { datasource_name: site.client_id, new_ip: site.virtual_ip },
            {
              params: this.sessionParams,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
        
        await Promise.allSettled(promises);
        await this.fetchPanelsData();
      } catch (err) {
        this.handleError('Erreur lors de la mise à jour des datasources', err);
      }
    },
    
    async fetchPanelsData() {
      if (!this.selectedSites.length || !this.displayedStats.length) return;
      
      this.isLoading = true;
      this.error = null;
      
      try {
        const stPromises = this.displayedStats.map(sid => this.fetchPanelData(sid));
        const res = await Promise.allSettled(stPromises);
        const success = res.filter(r => r.status === 'fulfilled').map(r => r.value);
        
        this.updateStatsData(success);
      } catch (err) {
        this.handleError('Erreur lors de la récupération des données des panels', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchPanelData(panelId) {
      const requests = this.selectedSites.map(site =>
        this.$axios
          .get(`${process.env.ODOO_API}api/v2/grafana/panel/data`, {
            params: {
              panel_id: panelId,
              datasource_name: site.client_id,
              date_start: this.startDate.toISOString(),
              date_end: this.endDate.toISOString(),
              ...this.sessionParams
            }
          })
          .then(r => ({ site: site.client_id, data: r.data }))
          .catch(err => {
            return { site: site.client_id, data: [] };
          })
      );
      
      const all = await Promise.all(requests);
      let combined = [];
      
      all.forEach(({ site, data }) => {
        if (!Array.isArray(data) || !data.length) return;
        const siteData = data.map(d => ({ ...d, site }));
        combined = combined.concat(siteData);
      });
      
      return { panelId, data: combined };
    },
    
    handleError(title, err) {
      this.error = true;
      this.$emit('error', {
        title,
        message: err.response?.data?.error || err.message || 'Une erreur est survenue'
      });
    },
    
    async fetchStatistics() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const resp = await this.$axios.get(
          `${process.env.ODOO_API}api/v2/grafana/dashboard/panels`,
          { params: { dashboard_uid: 'ce50jhmr8qku8b', ...this.sessionParams } }
        );
        
        this.processStatisticsResponse(resp.data);
      } catch (err) {
        this.handleError('Erreur lors de la récupération des statistiques', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    processStatisticsResponse(data) {
      this.availableStats = data.map(panel => ({
        id: panel.id,
        title: panel.title,
        type: panel.type,
        description: panel.description || 'Aucune description disponible'
      }));
      
      this.displayedStats = this.availableStats.map(p => p.id);
      this.statsData = this.availableStats.map((p, i) => ({ ...p, data: [], position: i }));
    },
    
    updateStatsData(res) {
      this.metricOptionsCache = {};
      this.tableMetricsCache = {};
      this.timeseriesDataCache = {};
      this.barDataCache = {};
      this.timeseriesTableDataCache = {};
      this.barTableDataCache = {};
      this.gaugeDataCache = {};
      this.pieDataCache = {};
      
      const updatedData = this.statsData.map(st => {
        const found = res.find(x => x.panelId === st.id);
        return { ...st, data: found?.data || [] };
      });
      
      this.originalStatsData = JSON.parse(JSON.stringify(updatedData));
      this.statsData = updatedData;
      
      this.statsData.forEach(stat => {
        this.dataLastUpdated[stat.id] = Date.now();
      });
      
      this.statsData.forEach(stat => {
        const statId = stat.id;
        const type = stat.type.toLowerCase();
        const metrics = this.getTableMetrics(stat.data);
        
        if (!this.fusionMethod[statId]) {
          this.$set(this.fusionMethod, statId, 'sum');
        }
        
        if ((type === 'table' || type.includes('bar') || type.includes('timeseries')) && this.hasDay(stat.data)) {
          if (!this.timeGrouping[statId]) {
            this.$set(this.timeGrouping, statId, 'day');
          }
        }
        
        if ((type.includes('bar') || type.includes('timeseries') || type === 'table') && metrics.length > 0) {
          if (!this.selectedTableMetrics[statId] || this.selectedTableMetrics[statId].length === 0) {
            this.$set(this.selectedTableMetrics, statId, metrics);
          }
        }
        
        if (!this.hasDay(stat.data) && type === 'table') {
          const axisOptions = this.getAxisMetricsOptions(stat.data);
          if (axisOptions.length > 0 && !this.selectedAxisMetric[statId]) {
            this.$set(this.selectedAxisMetric, statId, axisOptions[0]);
          }
        }
        
        if (!this.chartViewTypes[statId]) {
          this.$set(this.chartViewTypes, statId, this.getDefaultChartType(type, stat.data));
        }
        
        if (!this.statViewModes[statId]) {
          this.$set(this.statViewModes, statId, 'chart');
        }
        
        if (this.separateView) {
          this.selectedSites.forEach(site => {
            const siteStatId = `${site.client_id}-${statId}`;
            const siteData = stat.data.filter(x => x.site === site.client_id);
            
            if (!this.fusionMethod[siteStatId]) {
              this.$set(this.fusionMethod, siteStatId, 'sum');
            }
            
            if ((type === 'table' || type.includes('bar') || type.includes('timeseries')) && this.hasDay(siteData)) {
              if (!this.timeGrouping[siteStatId]) {
                this.$set(this.timeGrouping, siteStatId, 'day');
              }
            }
            
            const siteMetrics = this.getTableMetrics(siteData);
            if ((type.includes('bar') || type.includes('timeseries') || type === 'table') && siteMetrics.length > 0) {
              if (!this.selectedTableMetrics[siteStatId] || this.selectedTableMetrics[siteStatId].length === 0) {
                this.$set(this.selectedTableMetrics, siteStatId, siteMetrics);
              }
            }
            
            if (!this.hasDay(siteData) && type === 'table') {
              const axisOptions = this.getAxisMetricsOptions(siteData);
              if (axisOptions.length > 0 && !this.selectedAxisMetric[siteStatId]) {
                this.$set(this.selectedAxisMetric, siteStatId, axisOptions[0]);
              }
            }
            
            if (!this.chartViewTypes[siteStatId]) {
              this.$set(this.chartViewTypes, siteStatId, this.getDefaultChartType(type, siteData));
            }
            
            if (!this.statViewModes[siteStatId]) {
              this.$set(this.statViewModes, siteStatId, 'chart');
            }
            
            this.dataLastUpdated[siteStatId] = Date.now();
          });
        }
      });
      
      this.pendingRefresh = true;
      
      setTimeout(() => {
        this.pendingRefresh = false;
        this.createAllCharts();
      }, 200);
    },
    
    printPage() {
      const originalView = this.separateView;
      
      const cleanupCharts = () => {
        this.cleanupAllCharts();
        this.pieChartInstances = new Map();
        this.timeseriesChartInstances = new Map();
        this.barChartInstances = new Map();
        this.tableChartInstances = new Map();
      };
      
      const handlePrint = async () => {
        try {
          cleanupCharts();
          this.separateView = true;
          
          await this.$nextTick();
          
          const coverPage = document.createElement('div');
          coverPage.className = 'print-cover-page print-only';
          coverPage.innerHTML = `
            <img src="/static/img/logo-blue.png" alt="Logo" class="print-logo">
            <h1 class="print-main-title">Statistiques</h1>
            <h2 class="print-date-range">Du ${this.formatDateToFrench(this.startDate)} au ${this.formatDateToFrench(this.endDate)}</h2>
            <div class="print-sites-list">
              Sites : ${this.selectedSites.map(site => site.client_label).join(', ')}
            </div>
          `;
          
          const statsContainer = document.querySelector('.separate-sites-view');
          if (!statsContainer) throw new Error('Stats container not found');
          
          statsContainer.parentNode.insertBefore(coverPage, statsContainer);
          
          await this.$nextTick();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          window.print();
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
          coverPage.remove();
          cleanupCharts();
          this.separateView = originalView;
          
          await this.$nextTick();
          
          this.pendingRefresh = true;
          setTimeout(() => {
            this.pendingRefresh = false;
            this.createAllCharts();
          }, 200);
        } catch (error) {
          console.error("Print error:", error);
          cleanupCharts();
          this.separateView = originalView;
          
          this.pendingRefresh = true;
          setTimeout(() => {
            this.pendingRefresh = false;
            this.createAllCharts();
          }, 200);
        }
      };
      
      handlePrint();
    }
  },
  
  async created() {
    if (!this.user || !this.user.allowed_routes || !this.user.allowed_routes.includes('stats')) {
      this.$router.push('/products');
    }
  },
  
  async mounted() {
    this.showBetaMessage();
    await this.$store.dispatch('initializeMqtt');
    
    this.$root.$on('error', ({ title, message }) => {
      console.error(`${title}: ${message}`);
    });
    
    await this.fetchStatistics();
    
    this.$loader = false;
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('click', this.handleDocumentClick);
  },
  
  beforeDestroy() {
    this.cleanupAllCharts();
    this.$root.$off('error');
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleDocumentClick);
  }
}
</script>

<style>
.print-only {
  display: none !important;
}

@media print {
  .print-only {
    display: block !important;
  }

  @page {
    size: landscape;
    margin: 2cm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color: black !important;
    background: white !important;
  }

  header, 
  footer,
  nav,
  .account-navigation,
  .floating-buttons,
  .filters-bar,
  .beta-icon,
  .loading-overlay,
  .modal-overlay,
  .view-switch,
  .stat-close,
  .floating-site-title,
  .top-row,
  .stat-view-toggle,
  .time-grouping,
  .axis-selector,
  .metric-selector,
  .stat-controls-toggle {
    display: none !important;
  }

  .stat-card--bar {
    page-break-before: auto !important;
    page-break-after: auto !important;
    page-break-inside: avoid !important;
  }

  .stat-card--timeseries {
    page-break-before: auto !important;
    page-break-after: auto !important;
    page-break-inside: avoid !important;
  }

  .statistics {
    padding: 0 !important;
    margin: 0 !important;
  }

  .print-cover-page {
    display: flex !important;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    visibility: visible !important;
  }

  .print-main-title {
    font-size: 36pt !important;
    margin-bottom: 2cm !important;
  }

  .print-date-range {
    font-size: 18pt !important;
    margin-bottom: 1cm !important;
  }

  .print-sites-list {
    font-size: 14pt !important;
    margin-top: 2cm !important;
  }

  .site-section {
    page-break-after: always !important;
    padding: 0.5cm 0 !important;
    margin-bottom: 1cm !important;
  }
  .site-section:last-child {
    page-break-after: avoid !important;
  }

  .parsite-title {
    font-size: 20pt !important;
    text-align: center !important;
    margin-bottom: 0.8cm !important;
    padding-bottom: 0.3cm !important;
    border-bottom: 1px solid black !important;
  }
  .stat-card {
    break-inside: avoid !important;
    border: 1px solid black !important;
    padding: 0.5cm !important;
    height: 12cm !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }

  .stat-card--normal {
    height: 8cm !important;
  }

  .stat-card--pie {
    height: 10cm !important;
  }

  .stat-card--gauge {
    height: 8cm !important;
  }

  .stat-card--timeseries,
  .stat-card--bar {
    height: 12cm !important;
  }

  .stats-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.5cm !important;
    margin-bottom: 1cm !important;
  }

  .piechart-container,
  .timeseries-container {
    height: calc(100% - 1cm) !important;
  }

  canvas {
    width: 100% !important;
    height: auto !important;
    max-height: 100% !important;
  }

  .chart-js-render-monitor {
    font-size: 12pt !important;
  }

  .stat-header {
    border-bottom: 1px solid black !important;
    margin-bottom: 0.5cm !important;
  }

  .stat-title {
    font-size: 12pt !important;
    font-weight: bold !important;
  }

  .stat-value {
    font-size: 24pt !important;
  }
  
  .gauge-percentage {
    font-size: 20pt !important;
  }

  .stat-card--normal,
  .stat-card--pie,
  .stat-card--gauge {
    height: auto !important;
  }

  .stat-content {
    overflow-x: hidden !important;
  }
  
  .data-table-container {
    height: 100% !important;
    overflow: visible !important;
  }
  
  .data-table {
    font-size: 10pt !important;
    width: 100% !important;
    border-collapse: collapse !important;
  }
  
  .data-table th,
  .data-table td {
    border: 1px solid black !important;
    padding: 4px !important;
    text-align: center !important;
  }
}
.floating-btn.print-btn {
  background-color: #FF9800;
}

.floating-btn.print-btn .material-symbols-outlined {
  color: white;
  font-size: 24px;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.view-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  margin-right: 0;
}
.mode-icon {
  font-size: 24px;
  color: #9CC4E4;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.mode-icon.active {
  opacity: 1;
}
.switch-label {
  position: relative;
  width: 50px;
  height: 24px;
  display: inline-block;
}
.switch-label input {
  display: none;
}
.switch-slider {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(41,198,111,0.4);
  border-radius: 34px;
  cursor: pointer;
  transition: .4s;
}
.switch-label input:checked + .switch-slider {
  background-color: #29C66F;
}
.switch-slider:before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: #FFF;
  border-radius: 50%;
  transition: .4s;
}
.switch-label input:checked + .switch-slider:before {
  transform: translateX(26px);
}
.floating-site-title {
 position: fixed;
 top: 0;
 left: 50%;
 transform: translateX(-50%);
 z-index: 999;
 width: auto;
 min-width: 300px;
 max-width: 80%;
 backdrop-filter: blur(8px);
 margin: 12px auto;
 border-radius: 8px;
 text-align: center;
}

.floating-site-label {
 font-size: 18px;
 font-weight: 500;
 color: #fff;
 transition: 0.3s ease;
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
}
.site-title-fade-enter-active,
.site-title-fade-leave-active {
  transition: opacity 0.3s;
}
.site-title-fade-enter-from,
.site-title-fade-leave-to {
  opacity: 0;
}
.parsite-title {
  font-size: 18px;
  color: #9CC4E4;
  font-weight: 600;
  margin-bottom: 20px;
  margin-right: 60px;
  text-align: center;
}
.multiselect-wrapper {
  position: relative !important;
  background: rgba(30,39,54,0.5) !important;
  border-radius: 8px !important;
  padding: 4px !important;
  width: 100% !important;
}
.multiselect__tags {
  background: rgba(30,39,54,0.5) !important;
  display: flex !important;
  align-items: center !important;
  overflow-x: auto !important;
  white-space: nowrap !important;
  border: 1px solid #3D495E !important;
  min-height: 40px !important;
  padding: 5px 40px 0 8px !important;
  border-radius: 4px !important;
}
.multiselect__tag {
  background: #29C66F !important;
  color: #FFF !important;
  padding: 5px 26px 5px 10px !important;
  border-radius: 4px !important;
  margin-right: 5px !important;
  margin-bottom: 3px !important;
}
.multiselect__input,
.multiselect__single {
  background: #1E2736 !important;
  color: #9CC4E4 !important;
  padding: 0 8px !important;
  margin-bottom: 3px !important;
  min-height: 28px !important;
  position: relative !important;
  z-index: 1 !important;
}
.multiselect__content-wrapper {
  background: #2B3648 !important;
  border: 1px solid #3D495E !important;
  border-top: none !important;
}
.multiselect__option {
  padding: 10px !important;
  min-height: 40px !important;
  color: #9CC4E4 !important;
  white-space: normal !important;
}
.multiselect__option--highlight {
  background: #29C66F !important;
  color: #FFF !important;
}
.multiselect__option--selected {
  background: rgba(41,198,111,0.1) !important;
  color: #29C66F !important;
  font-weight: bold !important;
}

.multiselect-wrapper {
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 20px);
}

.multiselect__tags {
  padding: 4px 30px 0 8px !important;
}

.multiselect__tags::-webkit-scrollbar {
  height: 4px;
}

.multiselect__tags::-webkit-scrollbar-track {
  background: rgba(156,196,228,0.1);
}

.multiselect__tags::-webkit-scrollbar-thumb {
  background: rgba(41,198,111,0.4);
  border-radius: 2px;
}

.vdp-datepicker__calendar,
.vdp-datepicker__calendar *,
.vdp-datepicker__calendar:before,
.vdp-datepicker__calendar:after {
  background-color: #2B3648 !important;
  color: #9CC4E4 !important;
  border-color: #3D495E !important;
}
.vdp-datepicker__calendar .vdp-datepicker__calendar__content {
  background-color: #2B3648 !important;
  color: #9CC4E4 !important;
}
.statistics {
  min-height: 100vh;
  position: relative;
}
.page-title {
  margin-bottom: 20px;
  color: #FFFFFF;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.page-title .material-symbols-outlined {
  font-size: 28px;
  color: #29C66F;
}
.filters-bar {
  background-color: rgba(43,54,72,0.8);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid rgba(156,196,228,0.1);
  position: relative;
  z-index: 20;
}
.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}
.filter-block {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.filter-label {
  align-content: center;
  flex: none;
  font-size: 14px;
  font-weight: 500;
  color: #9CC4E4;
}
.date-selection {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
.date-separator {
  color: #9CC4E4;
  font-weight: 500;
  font-size: 14px;
}
.date-input {
  background-color: #1E2736 !important;
  border: 1px solid #3D495E;
  color: #9CC4E4;
  padding: 8px 12px;
  border-radius: 4px;
  width: 160px;
  font-size: 14px;
  transition: all 0.2s ease;
}
.date-input:hover,
.date-input:focus {
  border-color: #29C66F;
  outline: none;
  box-shadow: 0 0 0 2px rgba(41,198,111,0.1);
}
.submit-btn {
  background: #29C66F;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
  transition: background 0.3s ease;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit-btn:hover:not(:disabled),
.submit-btn:focus {
  background: #24b05e;
  outline: 2px solid #29C66F;
}
.stats-container {
  overflow: visible;
}
.stats-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
  grid-template-columns: repeat(4, 1fr);
}
.stats-grid-inner {
  display: contents;
}
.stat-card {
  background: linear-gradient(135deg, rgba(43,54,72,0.9), rgba(30,39,54,0.9));
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(156,196,228,0.1);
  transition: all 0.3s ease;
  overflow: auto;
  min-width: 200px;
  min-height: 280px;
  overflow: hidden !important;
}
.stat-card--normal {
  grid-column: span 1;
}
.stat-card--bar {
  grid-column: span 4;
}
.stat-card--pie {
  grid-column: span 1;
}
.stat-card--gauge {
  grid-column: span 1;
}
.stat-card--timeseries {
  grid-column: span 4;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}
.stat-card.dragging {
  opacity: 0.5;
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.stat-card.drag-over {
  border: 2px dashed #29C66F;
  box-shadow: 0 0 0 4px rgba(41,198,111,0.1);
}
.stat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-right: 30px;
  position: relative;
}
.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(41,198,111,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon-wrapper .material-symbols-outlined {
  font-size: 24px;
  color: #29C66F;
}
.stat-title {
  color: #9CC4E4;
  font-size: 16px;
  font-weight: 500;
  flex: 1;
}
.stat-close {
  position: absolute;
  right: 0;
  background: none;
  border: none;
  color: #9CC4E4;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s ease;
}
.stat-card:hover .stat-close {
  opacity: 1;
}
.stat-close:hover {
  background-color: rgba(255,75,85,0.1);
  color: #FF4B55;
}
.stat-content {
  display: grid;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(30,39,54,0.5);
  flex: 1;
}
.stat-layout-1 {
  grid-template-columns: 1fr;
}
.no-data-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.no-data-icon {
  font-size: 60px;
  margin-bottom: 10px;
  color: #9CC4E4;
  opacity: 0.3;
}
.no-data-text {
  font-size: 14px;
  color: #9CC4E4;
  opacity: 0.7;
}
.piechart-container {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.piechart-canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 300px;
  max-height: 300px;
}
.timeseries-container {
  height: 250px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.piechart-canvas,
.timeseries-canvas {
  width: 100% !important;
  height: 100% !important;
}
.stat-card--gauge .stat-content {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.stat-card--normal .stat-content {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.gauge-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  padding: 20px;
}
.gauge-container {
  position: relative;
  width: 220px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gauge {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.gauge-background {
  fill: none;
  stroke: rgba(156,196,228,0.1);
  stroke-width: 10;
  stroke-linecap: round;
}
.gauge-value {
  fill: none;
  stroke: #2F855A;
  stroke-width: 10;
  stroke-linecap: round;
  transition: all 0.3s ease-out;
}
.gauge-percentage {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: bold;
  color: #9CC4E4;
}
.gauge-labels {
  position: absolute;
  bottom: 0px;
  width: 90%;
  display: flex;
  justify-content: space-between;
  color: #9CC4E4;
  opacity: 0.7;
  font-size: 14px;
}
.no-stats {
  text-align: center;
  margin: 50px 0;
  color: #9CC4E4;
}
.no-stats .material-symbols-outlined {
  font-size: 60px;
  color: #29C66F;
  margin-bottom: 20px;
}
.no-stats p {
  margin-bottom: 20px;
  font-size: 16px;
}
.add-stats-btn {
  background: #29C66F;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
}
.add-stats-btn:hover {
  background: #24b05e;
}
.add-stats-btn:focus {
  outline: 2px solid #29C66F;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(30, 39, 54, 0.7);
  backdrop-filter: blur(4px);
}
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9CC4E4;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #3D495E;
  border-top: 4px solid #29C66F;
  border-radius: 50%;
  animation: spinner 1s linear infinite;
}
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
.rotating {
  animation: rotate 1s linear infinite;
}
.modal-overlay {
  position: fixed; 
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex; 
  justify-content: center; 
  align-items: center;
  z-index: 10000; 
  backdrop-filter: blur(6px);
}
.modal-content {
  background: linear-gradient(135deg, #2B3648 0%, #1E2736 100%);
  border-radius: 8px;
  width: 90%; 
  max-width: 700px; 
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border: 1px solid rgba(156,196,228,0.1);
}
.modal-header {
  padding: 20px; 
  background: rgba(30,39,54,0.9);
  border-bottom: 1px solid rgba(156,196,228,0.1);
  display: flex; 
  align-items: center; 
  gap: 8px;
}
.modal-header h2 {
  color: white; 
  margin: 0; 
  font-size: 20px;
  display: flex; 
  align-items: center;
}
.modal-body {
  padding: 20px;
}
.stat-items-list {
  display: flex; 
  flex-direction: column; 
  gap: 8px;
}
.stat-item-modal {
  margin: 4px 0;
  padding: 10px;
  background: rgba(30,39,54,0.5);
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr auto; 
  gap: 10px;
  align-items: center; 
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}
.stat-item-modal:hover:not(.disabled) {
  border-color: #29C66F;
  transform: translateX(4px);
  background: rgba(41,198,111,0.05);
}
.stat-item-modal.disabled {
  opacity: 0.7; 
  cursor: not-allowed;
}
.stat-item-content {
  display: flex; 
  align-items: center; 
  gap: 12px;
}
.stat-icon-wrapper {
  width: 40px; 
  height: 40px; 
  border-radius: 8px; 
  background: rgba(41,198,111,0.1);
  display: flex; 
  justify-content: center; 
  align-items: center;
}
.stat-icon-wrapper .material-symbols-outlined {
  font-size: 24px;
}
.stat-item-text h3 {
  color: #9CC4E4; 
  font-size: 16px; 
  margin: 0;
}
.stat-item-text p {
  color: #9CC4E4; 
  font-size: 14px; 
  margin: 0;
}
.stat-item-action {
  display: flex; 
  align-items: center;
}
.remove-stat,
.add-stat {
  font-size: 24px; 
  color: #9CC4E4; 
  cursor: pointer;
}
.remove-stat:hover {
  color: #FF4B55;
}
.add-stat:hover {
  color: #29C66F;
}
.floating-buttons {
  position: fixed; 
  bottom: 30px; 
  right: 30px;
  display: flex; 
  flex-direction: column; 
  gap: 16px;
  z-index: 1000;
}
.floating-btn {
  width: 56px; 
  height: 56px;
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  border: none; 
  cursor: pointer; 
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.floating-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}
.floating-btn:disabled {
  opacity: 0.6; 
  cursor: not-allowed;
}
.floating-btn.export-btn {
  background-color: #FFB800;
}
.floating-btn.add-btn {
  background-color: #29C66F;
}
.floating-btn .material-symbols-outlined {
  color: white; 
  font-size: 24px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.stat-controls {
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 12;
  background: rgba(43,54,72,0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: 320px;
  border: 1px solid rgba(156,196,228,0.1);
  overflow: visible !important;
}

.controls-header {
  padding: 12px 15px;
  background: rgba(30,39,54,0.8);
  border-bottom: 1px solid rgba(156,196,228,0.1);
}

.controls-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #9CC4E4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.controls-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 13px;
  font-weight: 500;
  color: #9CC4E4;
  margin-bottom: 4px;
}

.control-select {
  background-color: #1E2736;
  border: 1px solid #3D495E;
  color: #9CC4E4;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 13px;
  height: 34px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.control-select:hover,
.control-select:focus {
  border-color: #29C66F;
  outline: none;
}

.multiselect-container {
  width: 100%;
  position: relative;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.stat-view-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  margin-right: 8px;
}

.view-toggle-btn {
  border: none;
  background: none;
  color: #9CC4E4;
  opacity: 0.5;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle-btn:hover {
  background: rgba(156,196,228,0.1);
}

.view-toggle-btn.active {
  opacity: 1;
  color: #29C66F;
  background: rgba(41,198,111,0.1);
}

.view-toggle-btn:disabled .material-symbols-outlined {
  cursor: not-allowed;
  opacity: 0.3;
}

.data-table-container {
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 0;
}

.data-table-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #9CC4E4;
}

.data-table th,
.data-table td {
  border: 1px solid rgba(156,196,228,0.2);
  padding: 8px 12px;
  text-align: center;
}

.data-table th {
  background: rgba(43,54,72,0.8);
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 10;
  color: #FFFFFF;
}

.data-table tr:nth-child(odd) {
  background: rgba(30,39,54,0.3);
}

.data-table tr:nth-child(even) {
  background: rgba(30,39,54,0.5);
}

.data-table tr:hover {
  background: rgba(41,198,111,0.1);
}

.metrics-multiselect .multiselect__content-wrapper {
  position: absolute !important;
  top: 100% !important;
  border-radius: 0 0 4px 4px !important;
  background-color: #2B3648 !important;
  border: 1px solid #3D495E !important;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
  z-index: 1000 !important;
  max-width: 100% !important;
  width: 100% !important;
  max-height: 240px !important;
  overflow-y: auto !important;
}

.metrics-multiselect .multiselect__option {
  padding: 10px 12px !important;
  min-height: 36px !important;
  font-size: 13px !important;
  transition: background 0.2s ease !important;
}

.metrics-multiselect .multiselect__option--highlight {
  background-color: #29C66F !important;
  color: white !important;
  font-weight: 500 !important;
}

.metrics-multiselect .multiselect__option--selected {
  background-color: rgba(41,198,111,0.1) !important;
  color: #29C66F !important;
  font-weight: 500 !important;
}

.metrics-multiselect {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  min-height: 34px !important;
  font-size: 12px !important;
  position: relative !important;
}

.metrics-multiselect .multiselect__select {
  height: 32px !important;
  width: 32px !important;
}

.metrics-multiselect .multiselect__tags {
  min-height: 34px !important;
  padding: 3px 30px 0 8px !important;
  border-radius: 4px !important;
  background-color: #1E2736 !important;
  border: 1px solid #3D495E !important;
}

.metrics-multiselect .multiselect__single {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  min-height: auto !important;
  font-size: 12px !important;
}

.metrics-multiselect .multiselect__input {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  min-height: auto !important;
  font-size: 12px !important;
}

.metrics-multiselect .multiselect__tag {
  background: #29C66F !important;
  font-size: 12px !important;
  padding: 3px 18px 3px 6px !important;
  margin: 1px 3px 1px 0 !important;
  height: 20px !important;
  line-height: 14px !important;
}

.metrics-multiselect .multiselect__tag-icon {
  line-height: 20px !important;
  width: 16px !important;
  height: 20px !important;
}

.metrics-multiselect .multiselect__tag-icon:after {
  color: white !important;
  font-size: 12px !important;
}

.metrics-multiselect .multiselect__tag-icon:hover {
  background-color: rgba(255,255,255,0.2) !important;
}

.multiselect-selected-text {
  font-size: 12px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  color: #9CC4E4 !important;
}

@media (max-width: 992px) {
  .filters-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-block {
    width: 100%;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-controls {
    width: 280px;
    right: 10px;
  }
}

@media (max-width: 768px) {
  .control-group {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .stat-header {
    flex-wrap: wrap;
  }
  
  .stat-view-toggle {
    margin-left: auto;
  }
  
  .modal-content {
    width: calc(100% - 32px);
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
  
  .floating-buttons {
    bottom: 16px;
    right: 16px;
  }
  
  .stat-card {
    min-height: auto;
  }
}

@media (max-width: 576px) {
  .stat-card {
    min-height: auto;
  }
  .date-selection {
    flex-direction: column;
    align-items: stretch;
  }
  .date-input {
    width: 100%;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.vc-container {
 background: #1E2736 !important;
 border-color: #3D495E !important;
}

.vc-pane-container {
 background: #1E2736 !important;
}

.vc-header {
 background: #1E2736 !important;
}

.vc-title {
 color: white !important;
}

.vc-arrow {
 color: white !important;
}

.vc-weeks {
 background: #1E2736 !important;
}

.vc-day {
 color: white !important;
}

.vc-day-content {
 color: white !important;
}

.vc-highlight {
 background: #29C66F !important;
}

.vc-select {
 background: #1E2736 !important;
 color: white !important;
}

.vc-popover-content {
 background: #1E2736 !important;
 border-color: #3D495E !important;
}

.vc-popover-caret {
 background: #1E2736 !important;
 border-color: #3D495E !important;
}

.vc-time-select {
 background: #1E2736 !important;
 color: white !important;
}

.vc-time-content {
 background: #1E2736 !important;
}

.vc-time-header {
 color: white !important;
}

.vc-time-weekday {
 color: white !important;
}

.vc-time-month {
 color: white !important;
}

.vc-time-year {
 color: white !important;
}

.vc-nav-title {
 color: white !important;
}

.vc-nav-item {
 color: white !important;
}

.vc-nav-item:hover {
 background: rgba(41,198,111,0.1) !important;
}

.vc-nav-item.is-active {
 background: #29C66F !important;
 color: white !important;
}

.vc-nav-arrow {
 color: white !important;
}

.beta-icon {
 display: inline-flex;
 align-items: center;
 gap: 4px;
 background: none;
 border: none;
 cursor: pointer;
 padding: 4px 8px;
 margin-left: 8px;
 font-size: 16px;
 border-radius: 4px;
 transition: all 0.2s ease;
}

.beta-tag {
 font-size: 12px;
 font-weight: 600;
 color: #FFB800;
 background: rgba(255,184,0,0.1);
 padding: 2px 6px;
 border-radius: 4px;
}

.beta-icon:hover {
 background: rgba(255,184,0,0.1);
}
</style>