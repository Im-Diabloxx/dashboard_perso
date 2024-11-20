<template>
  <div class="columns content">
    <div class="service-menu-backdrop active"></div>

    <!-- Colonne -->
    <div class="column">
      <div class="stickyBlock">
        <div class="columns bloc-service">

          <!-- Infrastructure -->
          <div class="column services-card service pt-0">
            <div class="card click-card">
              <div class="card-header">
                <div class="columns name-box">
                  <div class="column name">
                    <span class="material-symbols-outlined">dns</span>
                    <span>Infrastructure</span>
                  </div>
                </div>
              </div>

              <div class="card-content" :class="globalStateClass" :title="detailedStatus">
                <div class="card-status">
                    <span class="material-symbols-outlined">online_prediction</span>
                    <div class="label">État global</div>
                    <span class="badge" :class="getStateBadge(globalStateText)">{{globalStateText}}</span>
                </div>
              </div>

              <div class="card-content storage">
                <div class="group state_line status-success">
                    <div class="label">Stockage local</div>
                    <div class="state_dot"></div>
                </div>
                <div>Espace consommé en local</div>
                <div class="progress-wrapper status-success mb-2">
                    <progress max="100" class="progress is-small is-darkgrey" value="0">0</progress>
                </div>
                <span class="status-success">610 Mo</span>/<span>928 Go</span>
              </div>

            </div>
          </div>

          <!-- ToIP -->
          <div class="column services-card service pt-0">
            <div class="card click-card">
              <div class="card-header">
                <div class="columns name-box">
                  <div class="column name">
                    <span class="material-symbols-outlined">lan</span>
                    <span>ToIP</span>
                  </div>
                </div>
              </div>

              <div class="card-content">
                <div class="sda-status">
                  <span class="material-symbols-outlined">dialpad</span>
                  <div class="label">Numéros SDA</div>
                  <div class="status">12</div>
                </div>
              </div>

              <div class="card-content">
                <div class="queue-status">
                  <span class="material-symbols-outlined">queue</span>
                  <div class="label">Files d'attente</div>
                  <div class="status">7 / 10</div>
                </div>
              </div>

              <div class="card-content">
                <div class="icon-group">
                  <div class="icon-item">
                    <span class="material-symbols-outlined">settings_input_antenna</span>
                    <div class="label">Trunk IAX</div>
                    <div class="status">2 / 3</div>
                  </div>
                  <div class="icon-item">
                    <span class="material-symbols-outlined">call_split</span>
                    <div class="label">Trunk SIP</div>
                    <div class="status">5 / 7</div>
                  </div>
                  <div class="icon-item">
                    <span class="material-symbols-outlined">device_hub</span>
                    <div class="label">Autres Trunks</div>
                    <div class="status">1 / 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mon parc -->
          <div class="column services-card service pt-0">
            <div class="card click-card">
              <div class="card-header">
                <div class="columns name-box">
                  <div class="column name">
                    <span class="material-symbols-outlined">inventory_2</span>
                    <span>Mon parc</span>
                  </div>
                </div>
              </div>

              <div class="card-content">
                <Toast />
                <Tree 
                  v-model:selectionKeys="selectedKey" 
                  :value="nodes" 
                  selectionMode="single" 
                  :expandedKeys="expandedKeys"
                  :metaKeySelection="false"
                  @nodeSelect="onNodeSelect" 
                  @nodeUnselect="onNodeUnselect" 
                  @nodeExpand="onNodeExpand" 
                  @nodeCollapse="onNodeCollapse" 
                  class="w-full md:w-[30rem]"
                />
              </div>

              <div class="card-content">
                <div class="icon-group">
                  <div class="icon-item">
                    <span class="material-symbols-outlined">phone</span>
                    <div class="label">Téléphones fixes</div>
                    <div class="status">5 / 10</div>
                  </div>
                  <div class="icon-item">
                    <span class="material-symbols-outlined">smartphone</span>
                    <div class="label">Mobiles</div>
                    <div class="status">3 / 8</div>
                  </div>
                  <div class="icon-item">
                    <span class="material-symbols-outlined">computer</span>
                    <div class="label">Téléphones Web</div>
                    <div class="status">2 / 5</div>
                  </div>
                  <div class="icon-item">
                    <span class="material-symbols-outlined">router</span>
                    <div class="label">Bases DECT</div>
                    <div class="status">4 / 6</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="column services-card service pt-0">
            <div class="card click-card">
              <div class="card-header">
                <div class="columns name-box">
                  <div class="column name">
                    <span class="material-symbols-outlined">workspace_premium</span>
                    <span>Services additionnels</span>
                  </div>
                </div>
              </div>

              <div class="card-content directory">
                <div class="icon-group">
                  <div class="icon-item">
                    <span class="material-symbols-outlined">folder</span>
                    <div class="label">Nombre d'annuaires</div>
                    <div class="status">5</div>
                  </div>
                  <div class="icon-item">
                    <span class="material-symbols-outlined">person</span>
                    <div class="label">Contacts total</div>
                    <div class="status">200</div>
                  </div>
                </div>
                <div class="button-group" style="text-align-last: center;">
                  <button class="button is-admin-primary">Gérer</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Tree from 'primevue/tree';

export default {
  name: 'AdminIPBX',
  props: {
    msg: String,
    tab: Boolean,
  },
  components: {
    Toast,
    Tree
  },
  data() {
    return {
      nodes: [
        {
          key: "server1",
          label: "Serveur IPBX",
          icon: "pi pi-fw pi-server",
          children: [
            {
              key: "branch1",
              label: "Filiale 1",
              icon: "pi pi-fw pi-sitemap",
              children: [
                { key: "user1", label: "Utilisateur 1", icon: "pi pi-fw pi-user" },
                { key: "user2", label: "Utilisateur 2", icon: "pi pi-fw pi-user" },
              ],
            },
            {
              key: "branch2",
              label: "Filiale 2",
              icon: "pi pi-fw pi-sitemap",
              children: [
                { key: "user3", label: "Utilisateur 3", icon: "pi pi-fw pi-user" },
                { key: "user4", label: "Utilisateur 4", icon: "pi pi-fw pi-user" },
              ],
            },
          ],
        },
      ],
      selectedKey: null,
      expandedKeys: {
        server1: true,
        branch1: true,
        branch2: true,
      },
      processes: [
        { name: "Serveur IPBX", status: "success" },
        { name: "LAN", status: "success" },
        { name: "DNS", status: "warning" },
        { name: "SMTP", status: "error" },
        { name: "SNMP", status: "success" },
        { name: "SYSLOG", status: "success" },
        { name: "VPN", status: "maintenance" },
        { name: "NTP", status: "success" },
        { name: "DHCP", status: "success" },
      ],
      //toast: useToast()
    };
  },
  computed: {
    globalStateClass() {
      const statuses = this.processes.map((p) => p.status);

      if (statuses.includes("error")) {
        return "status-error";
      } else if (statuses.includes("warning")) {
        return "status-warning";
      } else if (statuses.includes("maintenance")) {
        return "status-maintenance";
      } else {
        return "status-success";
      }
    },
    globalStateText() {
      switch (this.globalStateClass) {
        case "status-error":
          return "Erreurs";
        case "status-warning":
          return "Avertissement";
        case "status-maintenance":
          return "Maintenance";
        case "status-success":
          return "Operationnel";
        default:
          return "";
      }
    },
    detailedStatus() {
      return this.processes
        .map(
          (p) => `${p.name}: ${this.getStatusDot(p.status)}`
        )
        .join("\n");
    }
  },
  methods: {
    getStateBadge (value) {
      switch (value) {
        case 'Erreurs':
          return 'badge-danger'
        case 'Avertissement':
          return 'badge-warning'
        case 'Maintenance':
          return 'badge-info'
        case 'Operationnel':
          return 'badge-primary'
        case 'Brouillon':
          return ''
      }
    },
    getStatusDot(status) {
      switch (status) {
        case "success":
          return "🟢";
        case "maintenance":
          return "🔵";
        case "warning":
          return "🟡";
        case "error":
          return "🔴";
        default:
          return "⚪";
      }
    },
    onNodeSelect(node) {
    },
    onNodeUnselect(node) {
    },
    onNodeExpand(node) {
    },
    onNodeCollapse(node) {
    }
  }
}

</script>

<style scoped>

.state_line {
  display: flex;
  align-items: center; /* Center items within each line */
  margin-bottom: 8px; /* Space between items, adjust as needed */
      align-items: flex-end;
}

.icon-group {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px; /* Ajustez la largeur si nécessaire */
  text-align: center;
}

.icon-item .material-symbols-outlined {
  font-size: 32px;
  color: white; /* Couleur de l'icône */
  margin-bottom: 8px;
}

.icon-item .label {
  font-size: 14px;
  color: white; /* Couleur du label */
  margin-bottom: 0px !important;
}

.icon-item .status {
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.trunk-status {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.trunk-status .icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  text-align: center;
}

.trunk-status .icon-item .material-symbols-outlined {
  font-size: 32px;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.trunk-status .icon-item .label {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.trunk-status .icon-item .status {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

/* Style pour le statut des éléments avec un point de couleur */
.state_dot {
  width: .85em;
  height: .85em;
  border-radius: 50%;
  background-color: #28a745; /* Vert pour l'actif */
  margin-left: 5px;
  display: inline-block;
}

.state_dot.inactive {
  background-color: #dc3545; /* Rouge pour l'inactif */
}

.queue-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: white;
  padding: 10px 0;
}

.queue-status .label {
  font-weight: bold;
  margin-bottom: 0px !important;
}

.queue-status .total-count {
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.sda-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: white;
  padding: 10px 0;
}

.sda-status .label {
  font-weight: bold;
  margin-bottom: 0px !important;
}

.sda-status .total-count {
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.card-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: white;
  padding: 10px 0;
}

.card-status .label {
  font-weight: bold;
  margin-bottom: 0px !important;
}

.card-status .total-count {
  font-size: 12px;
  color: white;
  font-weight: bold;
}

.admin-box .services-card .card .card-content {
  position: relative;
  margin: .5rem 0 .5rem 0;
  background-color: #4b576d;
  border-radius: 8px;
  transition: all 200ms;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,.25);
  font-size: .88rem;
}

.card-header {
    background-color: transparent;
    align-items: stretch;
    box-shadow: 0 1px 2px rgba(10, 10, 10, .1);
    display: flex;
    border-left: 0px solid transparent;
}

.p-tree-root {
    overflow: hidden !important;
}
</style>