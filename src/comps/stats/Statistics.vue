<script setup lang="ts">
import { ref, watch } from 'vue'
import StatsCards from './StatsCard.vue'
import ChartSection from './ChartSection.vue'
import FilterSection from './FilterSection.vue'
import type { ChartType, SiteStats } from './types'

const startDate = ref('2024-01-01')
const endDate = ref('2024-06-30')
const selectedSites = ref(['VOLVO AIX', 'VOLVO AVIGNON'])
const selectedChartType = ref<ChartType>('transfers')

const stats = ref<SiteStats>({
  totalCalls: 23244,
  answeredCalls: 6859,
  missedCalls: 598,
  averageWaitTime: '00:01',
  averageCallDuration: '02:02',
  answerRate: '29.51%',
  missRate: '2.67%'
})

watch([startDate, endDate, selectedSites, selectedChartType], () => {
  fetchData()
}, { deep: true })

const updateDateRange = (start: string, end: string) => {
  startDate.value = start
  endDate.value = end
}

const updateSites = (sites: string[]) => {
  selectedSites.value = sites
}

const updateChartType = (type: ChartType) => {
  selectedChartType.value = type
}

const fetchData = () => {
  console.log('Fetching data with:', {
    startDate: startDate.value,
    endDate: endDate.value,
    sites: selectedSites.value,
    chartType: selectedChartType.value
  })
}
</script>

<template>
  <div class="p-4 max-w-7xl mx-auto">
    <FilterSection
      :start-date="startDate"
      :end-date="endDate"
      :selected-sites="selectedSites"
      @update-dates="updateDateRange"
      @update-sites="updateSites"
    />

    <StatsCards :stats="stats" />

    <ChartSection
      :selected-type="selectedChartType"
      :selected-sites="selectedSites"
      :start-date="startDate"
      :end-date="endDate"
      @update-type="updateChartType"
    />
  </div>
</template>