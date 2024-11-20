<script setup lang="ts">
import type { SiteStats } from './types'

defineProps<{
  stats: SiteStats
}>()
</script>

<template>
  <div class="grid grid-cols-5 gap-4 mb-6">
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
      <h3 class="text-stats-gray text-sm mb-2">Appels reçus</h3>
      <p class="text-3xl font-bold text-stats-blue">{{ stats.totalCalls }}</p>
    </div>
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
      <h3 class="text-stats-gray text-sm mb-2">Appels décrochés</h3>
      <p class="text-3xl font-bold text-stats-green">{{ stats.answeredCalls }}</p>
      <p class="text-sm text-stats-green">{{ stats.answerRate }}</p>
    </div>
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
      <h3 class="text-stats-gray text-sm mb-2">Appels manqués</h3>
      <p class="text-3xl font-bold text-stats-yellow">{{ stats.missedCalls }}</p>
      <p class="text-sm text-stats-yellow">{{ stats.missRate }}</p>
    </div>
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
      <h3 class="text-stats-gray text-sm mb-2">Durée moyenne attente</h3>
      <p class="text-3xl font-bold text-stats-gray">{{ stats.averageWaitTime }}</p>
    </div>
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200">
      <h3 class="text-stats-gray text-sm mb-2">Durée moyenne appel</h3>
      <p class="text-3xl font-bold text-stats-gray">{{ stats.averageCallDuration }}</p>
    </div>
  </div>
</template>