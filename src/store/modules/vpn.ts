import { Module } from 'vuex';
import mqtt, { MqttClient } from 'mqtt/dist/mqtt.min.js';
import axios from 'axios';

interface Client {
  id: number;
  client_id: string;
  client_label: string;
  status: string;
  virtual_ip: string;
  real_ip: string;
  real_port: string;
  connected_since: string;
  disconnected_since: string;
  vpn_port: string;
  server_name: string;
  partner_name: any;
  server_id: number;
  note: string;
  note_modification_date: string;
}

interface Server {
  vpn_port: string;
  server_name: string;
  partner_name: any;
  server_id: number;
}

interface VPNState {
  clients: { [key: number]: Client };
  servers: { [key: number]: Server };
  mqttClient: MqttClient | null;
  mqttTopic: string;
  notes: any[];
}

const mqttListener = (topic: string, message: Buffer, commit: any, state: VPNState) => {
  try {
    const data = JSON.parse(message.toString());

    if (topic.startsWith('openvpn/')) {
      commit('updateClient', data);
      commit('updateServer', data);

      const clientNote = state.notes.find(note => note.client_id === data.client_id);
      if (clientNote) {
        commit('updateClientNote', {
          clientId: data.id,
          note: clientNote.note,
          noteModificationDate: clientNote.note_modification_date,
        });
      }
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
};

const connect = (options: mqtt.IClientOptions, commit: any, state: VPNState, dispatch: any, url: any) => {
  const client = mqtt.connect(url, options);

  client.on('connect', () => {
    commit('setMqttClient', client);
    const topic = state.mqttTopic;
    client.subscribe(topic, (err: any) => {
      if (err) {
        console.error(`Error subscribing to topic: ${topic}`, err);
      }
    });
  });

  client.on('message', (topic: string, message: Buffer) => {
    mqttListener(topic, message, commit, state);
  });

  client.on('close', () => {
    console.log('MQTT client closed');
  });

  client.on('error', (err: any) => {
    console.error('MQTT client error', err);
  });
};

const moduleVPN: Module<VPNState, any> = {
  state: {
    clients: {},
    servers: {},
    mqttClient: null,
    mqttTopic: '',
    notes: []
  },
  mutations: {
    setClients(state, clients: Client[]) {
      state.clients = {};
      clients.forEach(client => {
        state.clients[client.id] = client;
      });
    },
    setServers(state, servers: Server[]) {
      state.servers = {};
      servers.forEach(server => {
        state.servers[server.server_id] = server;
      });
    },
    setNotes(state, notes) {
      state.notes = notes;
    },
    updateClient(state, updatedClient) {
      state.clients[updatedClient.id] = {
        ...state.clients[updatedClient.id],
        ...updatedClient
      };
    },
    updateClientNote(state, { clientId, note, noteModificationDate }) {
      if (state.clients[clientId]) {
        state.clients[clientId].note = note;
        state.clients[clientId].note_modification_date = noteModificationDate;
      }
    },
    updateServer(state, updatedServer) {
      state.servers[updatedServer.server_id] = updatedServer;
    },
    revokeClient(state, revokedClientId) {
      delete state.clients[revokedClientId];
    },
    resetClientsAndServers(state) {
      state.clients = {};
      state.servers = {};
      state.notes = [];
    },
    setMqttTopic(state, topic: string) {
      state.mqttTopic = topic;
    },
    setMqttClient(state, client: MqttClient | null) {
      state.mqttClient = client;
    },
    resetMqttState(state) {
      state.mqttClient = null;
      state.mqttTopic = '';
    }
  },
  actions: {
    updateClientNote({ commit }, { clientId, note, noteModificationDate }) {
      commit('updateClientNote', { clientId, note, noteModificationDate });
    },
    async fetchClientNotes({ commit, rootState }) {
      const apiUrl = process.env.ODOO_API;
      const sessionId = rootState.session_id;
      if (!apiUrl || !sessionId) {
        throw new Error('API URL or session ID is missing');
      }
      const response = await axios.get(`${apiUrl}api/v2/ipbx/note/list?session_id=${sessionId}`);
      const notes = response.data.notes;
      commit('setNotes', notes);
    },
    async initializeMqtt({ state, commit, dispatch, rootState }) {
      const apiUrl = process.env.ODOO_API;
      const sessionId = rootState.session_id;
      if (!apiUrl || !sessionId) {
        throw new Error('API URL or session ID is missing');
      }
      const response = await axios.get(`${apiUrl}api/v2/mqtt/credentials?session_id=${sessionId}`);
      const topic = response.data.MQTT_TOPIC;
      commit('setMqttTopic', topic);

      const credentials = {
        url: response.data.MQTT_URL,
        clientId: response.data.MQTT_CLIENT_ID,
        username: response.data.MQTT_USERNAME,
        password: response.data.MQTT_PASSWORD,
      };

      const options = {
        clientId: `${credentials.clientId}${rootState.id}`,
        username: credentials.username,
        password: credentials.password,
        keepalive: 25,
        clean: true,
        reconnectPeriod: 10 * 1000
      };

      connect(options, commit, state, dispatch, credentials.url);
    },
    mqttMessage({ commit, state }, { topic, message }) {
      mqttListener(topic, message, commit, state);
    },
    disconnectMqtt({ state, commit }) {
      const client = state.mqttClient;
      if (client && typeof client.end === 'function') {
        client.end();
        commit('resetMqttState');
      }
    },
    updateClient({ commit }, client) {
      commit('updateClient', client);
    },
    updateServer({ commit }, server) {
      commit('updateServer', server);
    },
    revokeClient({ commit }, client_id) {
      commit('revokeClient', client_id);
    },
    resetClientsAndServers({ commit }) {
      commit('resetClientsAndServers');
    }
  },
  getters: {
    clients: state => Object.values(state.clients),
    servers: state => Object.values(state.servers),
    getVPNClientByCn: (state) => (cn: string) => {
      return Object.values(state.clients).find(client => client.client_id === cn) || null;
    },
    totalConnectedClients: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => client.status === 'connected').length;
    },
    totalClients: state => Object.keys(state.clients).length,
    totalDisconnectedClients: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => client.status === 'disconnected').length;
    },
    totalClientsGuest: state => {
      if (!state.mqttClient) return 0;
      return Object.values(state.clients).filter(client => client.vpn_port === '9999').length;
    }
  }
};

export default moduleVPN;
