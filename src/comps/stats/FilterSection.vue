<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  startDate: string
  endDate: string
  selectedSites: string[]
}>()

const emit = defineEmits<{
  'update-dates': [start: string, end: string]
  'update-sites': [sites: string[]]
}>()

const searchTerm = ref('')
const showDropdown = ref(false)

const allSites = [
  'VOLVO AIX',
  'VOLVO AVIGNON',
  'VOLVO MARSEILLE',
  'VOLVO NICE',
  'VOLVO TOULON'
]

const filteredSites = computed(() => {
  return allSites
    .filter(site => !props.selectedSites.includes(site))
    .filter(site => 
      site.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
})

const addSite = (site: string) => {
  emit('update-sites', [...props.selectedSites, site])
  searchTerm.value = ''
  showDropdown.value = false
}

const removeSite = (site: string) => {
  const newSites = props.selectedSites.filter(s => s !== site)
  emit('update-sites', newSites)
}
</script>

<template>
  <div class="flex gap-4 mb-6">
    <!-- Date Range Section -->
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200 flex items-center gap-4">
      <span class="text-stats-gray">Afficher les données du :</span>
      <input
        type="date"
        :value="startDate"
        @input="e => emit('update-dates', (e.target as HTMLInputElement).value, endDate)"
        class="border border-gray-300 rounded px-2 py-1 text-stats-gray"
      >
      <span class="text-stats-gray">au</span>
      <input
        type="date"
        :value="endDate"
        @input="e => emit('update-dates', startDate, (e.target as HTMLInputElement).value)"
        class="border border-gray-300 rounded px-2 py-1 text-stats-gray"
      >
    </div>

    <!-- Sites Section -->
    <div class="bg-white p-4 rounded shadow-sm border border-gray-200 flex-1">
      <div class="flex items-center gap-2">
        <span class="text-stats-gray whitespace-nowrap">Site(s) à analyser :</span>
        <div class="relative flex-1">
          <input
            type="text"
            v-model="searchTerm"
            @focus="showDropdown = true"
            placeholder="Rechercher un site..."
            class="border border-gray-300 rounded px-2 py-1 text-stats-gray w-64"
          >
          <!-- Dropdown -->
          <div
            v-if="showDropdown && filteredSites.length > 0"
            class="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded shadow-lg"
          >
            <div
              v-for="site in filteredSites"
              :key="site"
              @click="addSite(site)"
              class="p-2 hover:bg-gray-50 cursor-pointer text-stats-gray"
            >
              {{ site }}
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Sites Tags -->
      <div class="flex flex-wrap gap-2 mt-2">
        <div
          v-for="site in selectedSites"
          :key="site"
          class="bg-stats-green text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
        >
          {{ site }}
          <button
            @click="removeSite(site)"
            class="hover:text-gray-200 focus:outline-none"
          >×</button>
        </div>
      </div>
    </div>
  </div>
</template>