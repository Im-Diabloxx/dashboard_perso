<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import type { ChartType } from './types'
import { format, eachDayOfInterval, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{
  selectedType: ChartType
  selectedSites: string[]
  startDate: string
  endDate: string
}>()

const emit = defineEmits<{
  'update-type': [type: ChartType]
}>()

const chartTypes = [
  { id: 'transfers' as const, label: 'Transfo. Reçus / Perdus' },
  { id: 'calls' as const, label: 'Nbr. Appels Reçus' },
  { id: 'peaks' as const, label: 'Analyse des pics d\'appels' }
]

const dateLabels = computed(() => {
  const start = parseISO(props.startDate)
  const end = parseISO(props.endDate)
  return eachDayOfInterval({ start, end })
    .filter((_, index) => index % 5 === 0)
    .map(date => format(date, 'dd MMM', { locale: fr }))
})

const generateData = (site: string, type: ChartType) => {
  const baseData = Array.from({ length: dateLabels.value.length }, () => 
    Math.floor(Math.random() * 50) + 10
  )
  
  switch (type) {
    case 'transfers':
      return baseData.map(v => v * 1.2)
    case 'calls':
      return baseData.map(v => v * 1.5)
    case 'peaks':
      return baseData.map(v => v * 0.8)
    default:
      return baseData
  }
}

const chartData = computed(() => ({
  labels: dateLabels.value,
  datasets: props.selectedSites.map((site, index) => ({
    label: site,
    borderColor: index === 0 ? '#0046AD' : '#666666',
    data: generateData(site, props.selectedType),
    tension: 0.1,
    fill: false
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Nombre d\'appels',
        color: '#666666'
      },
      ticks: {
        color: '#666666'
      }
    },
    x: {
      ticks: {
        color: '#666666'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#666666'
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6">
      <div class="flex gap-6">
        <label
          v-for="type in chartTypes"
          :key="type.id"
          class="flex items-center gap-2 text-stats-gray cursor-pointer"
        >
          <input
            type="radio"
            name="chartType"
            :checked="selectedType === type.id"
            @change="emit('update-type', type.id)"
            class="text-stats-green focus:ring-stats-green"
          >
          <span>{{ type.label }}</span>
        </label>
      </div>
    </div>

    <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
      <div class="h-[400px]">
        <Line
          v-if="props.selectedSites.length > 0"
          :data="chartData"
          :options="chartOptions"
        />
        <div
          v-else
          class="h-full flex items-center justify-center text-stats-gray"
        >
          Sélectionnez au moins un site pour afficher le graphique
        </div>
      </div>
    </div>
  </div>
</template>