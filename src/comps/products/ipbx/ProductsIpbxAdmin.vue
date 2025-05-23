<template>
  <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">
    <div class="admin-box" v-if="user.id_company && user.id_company === 1">
      <div class="dashboard" style="padding-bottom: 0px">
        <div class="container is-max-widescreen">
          <section class="section-title">
            <h1 class="dashboard-zone">
              <a @click="goToProducts()" class="router-link-active">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                      <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                          <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                      </g>
                  </svg>
              </a>
              IPBX {{ipbxName}} - Administration
            </h1>
          </section>

          <nav class="tabs" style="margin-top: 40px">
            <ul class="">

              <li :class="menu === 'Server' ? 'is-active' : ''">
                <a @click="setMenu('Server')"><span>Serveur</span></a>
              </li>

              <li :class="menu === 'Subsidiary' ? 'is-active' : ''">
                <a @click="setMenu('Subsidiary')"><span>Filiale</span></a>
              </li>

              <li :class="menu === 'Group' ? 'is-active' : ''">
                <a @click="setMenu('Group')"><span>Groupe</span></a>
              </li>

              <li :class="menu === 'User' ? 'is-active' : ''">
                <a @click="setMenu('User')"><span>Utilisateur</span></a>
              </li>

              <li :class="menu === 'Phone' ? 'is-active' : ''">
                <a @click="setMenu('Phone')"><span>Téléphone</span></a>
              </li>

              <li :class="menu === 'Material' ? 'is-active' : ''">
                <a @click="setMenu('Material')"><span>Materiel</span></a>
              </li>

              <li :class="menu === 'Sda' ? 'is-active' : ''">
                <a @click="setMenu('Sda')"><span>SDA</span></a>
              </li>

              <li :class="menu === 'Queue' ? 'is-active' : ''">
                <a @click="setMenu('Queue')"><span>File d'attente</span></a>
              </li>

              <li :class="menu === 'Phonebook' ? 'is-active' : ''">
                <a @click="setMenu('Phonebook')"><span>Annuaire</span></a>
              </li>

            </ul>
            </nav>

        </div>
      </div>

      <div class="container is-max-widescreen" style="padding-bottom: 1rem;">
        <div class="billinglist">
          <div style="margin-top: 20px" data-v-65729484="" class="columns mb-0 align-items-center">
            <div data-v-65729484="" class="column"></div>
          </div>

          <!--
          <section>
            <div class="fieldset mb-5">
              <label>
                Hierarchie
              </label>
              <div class="fieldset-content h-100 mb-0">
                <div class="stats-section">
                  <div class="stats-content">
                    <canvas id="doughnut-chart-entities" class="doughnut-chart"></canvas>
                    <div class="stats-title" title="Nombre d'entités par type">Type d'entités</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          -->

        <section v-if="menu === 'Server'">
            <div class="fieldset mb-5">
              <label>
                Liste des serveurs
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Nom du serveur</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="s in servers" :key="s.id">
                        <td>{{ s.name }}</td>
                        <td>{{ s.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>


          <section v-if="menu === 'Subsidiary'">
            <div class="fieldset mb-5">
              <label>
                Liste des filiales
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Serveur</th>
                        <th>Préfixe</th>
                        <th>Standard</th>
                        <th>Caller ID Pattern</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="subsidiary in subsidiaries" :key="subsidiary.id">
                        <td>{{ subsidiary.name }}</td>
                        <td>{{ subsidiary.server_name }}</td>
                        <td>{{ subsidiary.prefix }}</td>
                        <td>{{ subsidiary.standard }}</td>
                        <td>{{ subsidiary.callerid_name_pattern }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section v-if="menu === 'Group'">
            <div class="fieldset mb-5">
              <label>
                Liste des groupes
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Filiale</th>
                        <th>Description</th>
                        <th>Niveau de vue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="group in groups" :key="group.id">
                        <td>{{ group.name }}</td>
                        <td>{{ group.subsidiary_name }}</td>
                        <td>{{ group.description }}</td>
                        <td>{{ getViewLevel(group.id_view) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section v-if="menu === 'User'">
            <div class="fieldset mb-5">
              <label>
                Liste des utilisateurs
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Identifiant</th>
                        <th>Mot de passe</th>
                        <th>Numéro interne</th>
                        <th>Groupe</th>
                        <th>Filiale</th>
                        <th>Niveau de vue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="u in users" :key="u.id_user">
                        <td>{{ getUsername(u) }}</td>
                        <td>{{ u.login }}</td>
                        <td><span @click="copyToClipboard(u.pass)" style="cursor: pointer;">••••••••</span></td>
                        <td>{{ u.number }}</td>
                        <td>{{ u.user_group_name }}</td>
                        <td>{{ u.subsidiary_name }}</td>
                        <td>{{ getViewLevel(u.id_view) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>


          <section v-if="menu === 'Phone'">
            <div class="fieldset mb-5">
              <label>
                Liste des téléphones
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Fabricant</th>
                        <th>Modèle</th>
                        <th>Utilisateur</th>
                        <th>Adresse MAC</th>
                        <th>Numéro</th>
                        <th>Adresse IP</th>
                        <th>Filiale</th>
                        <th>CallerID</th>
                        <th>Musique d'attente</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="phone in phones" :key="phone.id_phone">
                        <td>{{ phone.phone_manufacturer_name }}</td>
                        <td>{{ phone.phone_model_name }}</td>
                        <td>{{ getUsername(phone) }}</td>
                        <td>{{ phone.mac }}</td>
                        <td>{{ phone.number }}</td>
                        <td>{{ phone.ip_address }}</td>
                        <td>{{ phone.subsidiary_name }}</td>
                        <td>{{ phone.callerid }}</td>
                        <td>{{ phone.default_music_class_name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>


          <section v-if="menu === 'Material'">
            <div class="fieldset mb-5">
              <label>
                Liste des matériels
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Modèle</th>
                        <th>Fabricant</th>
                        <th>Filiale</th>
                        <th>Activé</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="m in materials" :key="m.id_material">
                        <td>{{ m.name }}</td>
                        <td>{{ m.description }}</td>
                        <td>{{ m.model_name }}</td>
                        <td>{{ m.manufacturer_name }}</td>
                        <td>{{ m.subsidiary_name }}</td>
                        <td>{{ m.activated ? 'Oui' : 'Non' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section v-if="menu === 'Sda'">
            <div class="fieldset mb-5">
              <label>
                Liste des SDA
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Numéro SDA</th>
                        <th>Description</th>
                        <th>Filiale</th>
                        <th>Matériel</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="s in sdas" :key="s.id_sda_number">
                        <td>{{ s.number }}</td>
                        <td>{{ s.description }}</td>
                        <td>{{ s.subsidiary_name }}</td>
                        <td>{{ s.material_name }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>


          <section v-if="menu === 'Queue'">
            <div class="fieldset mb-5">
              <label>
                Liste des files d'attente
              </label>
              <div class="fieldset-content">

                <div class="d-flex" style="float: right">
                  <div class="field mb-0" style="min-width: 300px">
                    <TagInput
                      :modelValue="search_badges">
                    </TagInput>
                  </div>
                </div>

                <div class="b-table">
                  <table class="table table-clickable ipbx-entity-table">
                    <thead>
                      <tr>
                        <th>Filiale</th>
                        <th>Numéro</th>
                        <th>Nom</th>
                        <th>Classe musicale</th>
                        <th>Stratégie</th>
                        <th>Délai d'attente maximum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="q in queues" :key="q.id_queue">
                        <td>{{ q.subsidiary_name }}</td>
                        <td>{{ q.number }}</td>
                        <td>{{ q.name }}</td>
                        <td>{{ q.music_class_name }}</td>
                        <td>{{ q.strategy }}</td>
                        <td>{{ q.timeout_value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section v-if="menu === 'Phonebook'">
            <ProductsIpbxPhonebook :tab="tab" :msg="msg"/>
          </section>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TagInput from '@/comps/modal/TagInput.vue';
import ProductsIpbxPhonebook from './ProductsIpbxPhonebook.vue';

export default {
  name: 'ProductsIpbxAdmin',
  props: {
    msg: String,
    tab: Boolean
  },
  components: {
    TagInput,
    ProductsIpbxPhonebook
  },
  data () {
    return {
      menu: '',
      search_badges: []
    }
  },
  watch: {
    /*
    menu(newMenu) {
      if (newMenu === 'User') {
        this.$store.dispatch('fetchUsers');
      } else if (newMenu === 'Queue') {
        this.$store.dispatch('fetchQueues');
      } else if (newMenu === 'Subsidiary') {
        this.$store.dispatch('fetchSubsidiaries');
      } else if (newMenu === 'Server') {
        this.$store.dispatch('fetchServers');
      } else if (newMenu === 'Group') {
        this.$store.dispatch('fetchGroups');
      } else if (newMenu === 'Phone') {
        this.$store.dispatch('fetchPhones');
      } else if (newMenu === 'Material') {
        this.$store.dispatch('fetchMaterials');
      } else if (newMenu === 'Sda') {
        this.$store.dispatch('fetchSdas');
      }
    }
    */
  },
  computed: {
    ipbxName() {
      return this.$route.query.name
    },
    user() {
      return this.$store.getters.getUser
    },
    servers() {
      let servers = this.$store.getters.getServers;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        servers = servers.filter(server => {
          return searchString.split(' ').every(v =>
            (server?.name || '').toLowerCase().includes(v) ||
            (server?.description || '').toLowerCase().includes(v)
          );
        });
      }

      return servers;
    },
    subsidiaries() {
      let subsidiaries = this.$store.getters.getSubsidiaries;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        subsidiaries = subsidiaries.filter(subsidiary => {
          return searchString.split(' ').every(v =>
            (subsidiary?.name || '').toLowerCase().includes(v) ||
            (subsidiary?.server_name || '').toLowerCase().includes(v) ||
            (subsidiary?.prefix || '').toLowerCase().includes(v) ||
            (subsidiary?.standard || '').toLowerCase().includes(v) ||
            (subsidiary?.callerid_name_pattern || '').toLowerCase().includes(v)
          );
        });
      }

      return subsidiaries;
    },
    groups() {
      let cgroups = this.$store.getters.getGroups;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();

        cgroups = cgroups.filter(group => {
          return searchString.split(' ').every(v =>
            (group?.name || '').toLowerCase().includes(v) ||
            (group?.subsidiary_name || '').toLowerCase().includes(v) ||
            (group?.description || '').toLowerCase().includes(v) ||
            (this.getViewLevel(group?.id_view) || '').toLowerCase().includes(v)
          );
        });
      }

      return cgroups;
    },
    users() {
      let users = this.$store.getters.getUsers;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        users = users.filter(user => {
          return searchString.split(' ').every(v =>
            (this.getUsername(user) || '').toLowerCase().includes(v) ||
            (user?.login || '').toLowerCase().includes(v) ||
            (user?.number || '').toLowerCase().includes(v) ||
            (user?.user_group_name || '').toLowerCase().includes(v) ||
            (user?.subsidiary_name || '').toLowerCase().includes(v) ||
            (this.getViewLevel(user?.id_view) || '').toLowerCase().includes(v)
          );
        });
      }

      return users;
    },
    phones() {
      let phones = this.$store.getters.getPhones;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        phones = phones.filter(phone => {
          return searchString.split(' ').every(v =>
            (phone?.phone_manufacturer_name || '').toLowerCase().includes(v) ||
            (phone?.phone_model_name || '').toLowerCase().includes(v) ||
            (this.getUsername(phone) || '').toLowerCase().includes(v) ||
            (phone?.mac || '').toLowerCase().includes(v) ||
            (phone?.number || '').toLowerCase().includes(v) ||
            (phone?.ip_address || '').toLowerCase().includes(v) ||
            (phone?.subsidiary_name || '').toLowerCase().includes(v) ||
            (phone?.callerid || '').toLowerCase().includes(v) ||
            (phone?.default_music_class_name || '').toLowerCase().includes(v)
          );
        });
      }

      return phones;
    },
    materials() {
      let materials = this.$store.getters.getMaterials;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        materials = materials.filter(material => {
          return searchString.split(' ').every(v =>
            (material?.name || '').toLowerCase().includes(v) ||
            (material?.description || '').toLowerCase().includes(v) ||
            (material?.model_name || '').toLowerCase().includes(v) ||
            (material?.manufacturer_name || '').toLowerCase().includes(v) ||
            (material?.subsidiary_name || '').toLowerCase().includes(v) ||
            ((material?.activated ? 'oui' : 'non') || '').toLowerCase().includes(v)
          );
        });
      }

      return materials;
    },
    sdas() {
      let sdas = this.$store.getters.getSdas;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        sdas = sdas.filter(sda => {
          return searchString.split(' ').every(v =>
            (sda?.number || '').toLowerCase().includes(v) ||
            (sda?.description || '').toLowerCase().includes(v) ||
            (sda?.subsidiary_name || '').toLowerCase().includes(v) ||
            (sda?.material_name || '').toLowerCase().includes(v)
          );
        });
      }

      return sdas;
    },
    queues() {
      let queues = this.$store.getters.getQueues;

      if (this.search_badges.length > 0) {
        let searchString = this.search_badges.join(' ').toLowerCase();
        queues = queues.filter(queue => {
          return searchString.split(' ').every(v =>
            (queue?.subsidiary_name || '').toLowerCase().includes(v) ||
            (queue?.number || '').toLowerCase().includes(v) ||
            (queue?.name || '').toLowerCase().includes(v) ||
            (queue?.music_class_name || '').toLowerCase().includes(v) ||
            (queue?.strategy || '').toLowerCase().includes(v) ||
            (queue?.timeout_value?.toString() || '').toLowerCase().includes(v)
          );
        });
      }

      return queues;
    }
  },
  methods: {
    goToProducts () {
      this.$loader = true
      setTimeout(() => {
        this.$router.push('/products')
      }, 1000)
    },
    getUsername(val) {
      const lastname = val.lastname && val.lastname !== 'NULL' ? val.lastname.toUpperCase() : '';
      const firstname = val.firstname && val.firstname !== 'NULL' ? val.firstname.charAt(0).toUpperCase() + val.firstname.slice(1).toLowerCase() : '';
      const number = val.number && val.number !== 'NULL' ? val.number : '';
      if (!lastname && !firstname && !number) {
        return 'Non défini';
      }
      return `${lastname}, ${firstname} (${number})`;
    },
    getViewLevel(id) {
      switch (id) {
        case 0:
          return 'Vue non défini';
        case 1:
          return 'Vue Utilisateur';
        case 2:
          return 'Vue Groupe';
        case 3:
          return 'Vue Filiale';
        case 4:
          return 'Vue Globale';
      }
    },
    setMenu (m) {
      this.menu = m
    },
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Mot de passe copié dans le presse-papiers');
      });
    },
    async fetchEntities() {
      try {
        await this.$store.dispatch('fetchAllEntities');
        //this.generateStatistics();
      } catch (error) {
        console.error('Erreur lors de la récupération des entités:', error);
      }
    },
    generateStatistics() {
      const subsidiariesCount = this.subsidiaries.length;
      const groupsCount = this.groups.length;
      const usersCount = this.users.length;

      const chartEntities = {
        element: "doughnut-chart-entities",
        values: [subsidiariesCount, groupsCount, usersCount],
        labels: ['Filiales', 'Groupes', 'Utilisateurs'],
        backgroundColor: ['rgba(71, 183,132,.5)', 'rgba(41, 134, 204, 0.5)', 'rgba(144, 113, 225, 0.5)'],
        hoverBackgroundColor: ['rgba(71, 183,132,.8)', 'rgba(41, 134, 204, 0.8)', 'rgba(144, 113, 225, 0.8)'],
        borderColor: ['rgba(71,183,132,1)', 'rgba(41, 134, 204, 1)', 'rgba(144, 113, 225, 1)'],
      }
      this.initDoughnutChart(chartEntities);
    },
    initDoughnutChart(chart) {
      const ctx = document.getElementById(chart.element).getContext('2d');
      if (this.charts[chart.element]) {
        this.charts[chart.element].destroy();
      }
      this.charts[chart.element] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chart.labels,
          datasets: [{
            data: chart.values,
            backgroundColor: chart.backgroundColor,
            hoverBackgroundColor: chart.hoverBackgroundColor,
            borderColor: chart.borderColor,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                let dataset = data.datasets[tooltipItem.datasetIndex];
                let currentValue = dataset.data[tooltipItem.index];
                let label = data.labels[tooltipItem.index];
                return `${label}: ${currentValue}`;
              }
            }
          },
          plugins: {
            datalabels: {
              display: true,
              formatter: (value, context) => {
                if (value <= 0)
                  return '';
                let label = context.chart.data.labels[context.dataIndex];
                return `${label}: ${value}`;
              },
              color: '#fff',
              anchor: 'start',
              align: 'end'
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    }
  },
  async created() {
    this.menu = 'Phonebook'
    this.$loader = false
    this.$store.dispatch('SET_CN', this.$route.query.id)
    await this.fetchEntities();
    if (!this.user.id_company || this.user.id_company !== 1) {
      this.$router.push('/products')
    }
  },
  beforeDestroy() {
    this.$store.commit('RESET_ALL')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no-background {
    background: transparent !important;
  }
</style>
