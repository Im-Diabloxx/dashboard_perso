<template>
  <div tabindex="-1" :class="active ? 'modal modalCreateVPNClient is-active' : 'modal modalCreateVPNClient'">
    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title size-xxl">Parcours de l'appel {{ getCallerInfo(call_log) }}</p>
          
          <button @click="close()" class="delete"></button>
        </div>
        <p class="label ml-5">Date: {{ date }}</p>
        <p class="label ml-5">Référence: {{ unique_id }}</p>
        <div style="overflow-y: auto;">
          <section v-if="call_log !== undefined" class="modal-card-body" >
            <!-- //AF debug
            <label class="label">time ________|____ unique_id _____|_ lastapp _|_ disposition _|_ source _|_ destination _|_ type _|_ duree</label>
            <div v-for="call of call_log.call_flow" >
              <div class="field">
                <label class="label">{{ call.unix_time }} | {{ call.unique_id }} | {{ call.lastapp }} | {{ call.disposition }} | {{ call.src }} | {{ call.dst }} | {{ call.type }} | {{ call.duration }}</label>
              </div>
            </div>
            <label class="label">time ________|____ unique_id _____|_ queue_name _|__ event __|_ data1 _|_ data2 _|_ data3 _|_ user _|_ phone </label>
            <div v-for="log of call_log.queue_logs" > 
              <div v-for="event of log.events" > 
                <div class="field">
                  <label class="label">{{ event.unix_time }} | {{ event.unique_id }} | {{ event.queue_name }} | {{ event.event }} | {{ event.data1 }} | {{ event.data2 }} | {{ event.data3 }} | {{ event.id_user }} | {{ event.id_phone }}</label>
                </div>
              </div>
            </div>-->
            


            <div class="ibox-content" id="ibox-content" style="background-color: transparent;border: none;">
                <div id="vertical-timeline" class="vertical-container dark-timeline left-orientation">
                    <div v-for="event of call_log.events" :key="event.unix_time" class="vertical-timeline-block">
                        <div class="vertical-timeline-icon" :class="colorStatus(event.action)">
                          <span class="material-symbols-outlined" :class="event.type === 'Start' && event.action !== 'internal' ? 'fa-rotate-90':''" style="font-variation-settings: 'wght' 400;">
                            {{ iconStatus(event.action) }}
                          </span>
                        </div>

                        <div class="vertical-timeline-content">
                            <div>
                              {{ convertTime(event.start) }}
                            </div>
                            <div v-if="event.type === 'Start'">
                              <div v-if="event.action === 'incoming'">
                                Appel entrant de <B>{{ getCallerInfo(call_log) }}</B> à destination de <B title="SDA">{{ event.sda }}</B>
                              </div>
                              <div v-else-if="event.action === 'outgoing'">
                                Appel sortant de <B>{{ getCallerInfo(call_log) }}</B> vers <B title="Destinataire">{{ getCalleeInfo(call_log.callee) }}</B>
                              </div>
                              <div v-else-if="event.action === 'internal'">
                                Appel interne de <B>{{ getCallerInfo(call_log) }}</B> à destination de <B>{{ getCalleeInfo(call_log.callee) }}</B>
                              </div>
                              
                            </div>
                            <div v-if="!actionsManaged.includes(event.action)">
                              {{ event.action }} {{ event.data ?" data: "+event.data:"" }}  {{ event.callee.contact? " user " + event.callee.contact:""  }}  {{ event.duration ? " durant " + formatDuration(event.duration):"" }}
                            </div>
                            <div v-if="event.type === 'queue' && event.action === 'Enter'">
                              Entrée dans la file d'attente <B>{{ event.name }}</B>
                            </div>
                            <div v-if="event.type === 'svi' && event.action === 'Enter'">
                              Entrée dans le <B>{{ event.name }}</B>
                            </div>
                            <div v-if="event.action === 'Ring'">
                              <div v-if="event.callees.length === 1" >
                                Sonnerie du téléphone de <B>{{ getCalleeInfo(event.callees[0]) }}</B>
                              </div>
                              <div v-else>
                                Sonnerie des postes connectés membres de la file d'attente <B>{{ event.queue.name }}</B>
                                <div v-if="showMembers">
                                  <br/>
                                  Liste des personnes contactées: 
                                  <div v-for="(callee, index) in event.callees" :key="index" style="padding-left: 20px;">
                                    {{ getCalleeInfo(callee) }}
                                  </div>
                                </div>
                              </div>
                              <div v-if="event.callees.length > 1" class="button-container-right">
                                <button class="button" @click="showMembersList()"
                                  :title="showMembers?'Retire la lise des membres':'Affiche la liste des membres ayant eu la sonnerie sur leur poste'">
                                  {{ showMembers? 'Retirer les membres':'Afficher les membres' }}
                                </button>
                              </div>
                              
                            </div>
                            <div v-if="event.type === 'direct' && event.action === 'Wait'">
                              Antente de disponibilité de <B>{{ getCalleeInfo(event.callee) }}</B>
                            </div>
                            <div v-if="event.type === 'queue' && event.action === 'Wait'">
                              Antente de disponibilité d'un membre de la file d'attente <B>{{ (event.queue.name) }}</B>
                              <div v-if="showMembersWait">
                                <br/>
                                Liste des personnes non disponibles : 
                                <div v-for="(callee, index) in event.callees" :key="index" style="padding-left: 20px;">
                                  {{ getCalleeInfo(callee) }}
                                </div>
                              </div>
                              <div class="button-container-right">
                                <button class="button" @click="showMembersWaitList()"
                                  :title="showMembersWait?'Retire la lise des membres':'Affiche la liste des membres ayant eu la sonnerie sur leur poste'">
                                  {{ showMembersWait? 'Retirer les membres':'Afficher les membres' }}
                                </button>
                              </div>

                            </div>
                            <div v-if="event.action === 'Call'">
                              Début de la communication avec <B>{{ getCalleeInfo(event.callee) }}</B>
                            </div>
                            <div v-if="event.action === 'Transfer'">
                              Transfert vers <B>{{ getCalleeInfo(event.callee) }}</B>
                            </div>
                            <div v-if="event.action === 'VoiceMail' && event.action_type === 'Speak'">
                              Début de la messagerie de <B>{{ getCalleeInfo(event.callee) }}</B>
                            </div>
                            <div v-if="event.action === 'VoiceMail' && event.action_type === 'Read'">
                              Début de la consultation des messages de <B>{{ getCallerInfo(call_log) }}</B>
                            </div>
                            <div v-if="event.action === 'Playback'">
                              <div v-if="event.type === 'svi'">
                                Début de l'exéctuion du <B>{{ event.name }}</B>
                              </div>
                              <div v-else>
                                Début de lecture du message système
                              </div>
                            </div>
                            <div v-if="event.action === 'Abandon'">
                              Abandon de l'appel par l'appelant
                            </div>
                            <div v-if="event.action === 'Timeout'">
                              Durée maximum de présence dans la file d'attente atteinte ({{ formatDuration(event.configuration) }})
                            </div>
                            <div v-if="event.action === 'Congestion'">
                              Congestion de l'appel vers <B>{{ getCalleeInfo(event.callee) }}</B>
                            </div>
                            <div v-if="event.action === 'Fail'">
                              Echec de l'appel vers <B>{{ getCalleeInfo(event.callee) }}</B>
                            </div>
                            <div v-if="event.action === 'NotConfigured'">
                              Appel du numéro <B>{{ getCalleeInfo(event.callee) }}</B> attribué par l'opérateur et non configuré sur l'IPBX
                            </div>
                            <div v-if="event.action === 'Hangup'">
                              Fin d'appel
                            </div>
                        </div>
                        <div v-if="event.duration && event.duration > 0" class="vertical-timeline-duration">
                          {{ formatDuration(event.duration) }}
                        </div>
                  </div>
              </div>
              

            </div>
           
          </section>

          <div class="box-content has-text-centered" v-show="call_log !== undefined && call_log.events.length === 0">
            <div style="height: 120px; margin-top: 10%">
              <span><i class="fa fa-frown fa-3x"></i></span><br>
              Oups! Pas de données disponibles
            </div>
          </div>
          <div class="box-content has-text-centered" v-show="call_log === undefined">
            <div class="loading-inline" style="height: 120px; margin-top: 10%">
              <div class="loading-icon loading-bg"></div>
              <br>
            </div>
          </div>

          <footer class="modal-card-foot">
            <button type="button" class="button is-admin-primary is-large" @click="close()">Fermer</button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallFlow',
  props: {
    active: Boolean,
    unique_id: String
  },
  data: () => {
    return {
      cnLabel: '',
      email: '',
      call_log: undefined,
      events: [],
      actionsManaged: ['internal', 'incoming', 'outgoing', 'Enter', 'Ring', 'Call', 'Transfer', 'VoiceMail', 'Playback', 'Abandon', 'Timeout', 'Wait', 'Congestion', 'Fail', 'NotConfigured', 'Hangup'],
      showMembers: false,
      showMembersWait: false,
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    date () {
      if (this.call_log?.unix_time)
        return this.$dayjs.unix(this.call_log.unix_time).locale('FR-fr').format('DD-MM-YYYY');
      else
        return "";
    },
    sda () {
      return this.call_log?.sda || "";
    }
  },
  methods: {
    close () {
      this.$emit('CallFlow', false)
    },
    colorStatus(action) {
      let color = 'grey';
      switch (action) {
        case 'internal':
        case 'incoming':
        case 'outgoing':
          color = 'blue';
          break;
        case 'Enter':
          color = 'peacock';
          break;          
        case 'Ring':
          color = 'yellow';
          break;
        case 'Call':
          color = 'navy';
          break;
        case 'Transfer':
          color = 'purple';
          break;
        case 'VoiceMail':
        case 'Playback':
          color = 'black';
          break;
        case 'Abandon':
        case 'Timeout':
        case 'Wait':
          color = 'dark-gray';
          break;
        case 'Congestion':
        case 'Fail':
        case 'NotConfigured':
          color = 'orange';
          break;
        case 'Hangup':
          color = 'red';
          break;
      }
      return color + '-bg';
    },
    iconStatus(action) {
      switch (action) {
        case 'incoming':
          return 'input_circle';
        case 'outgoing':
          return 'output_circle';
        case 'internal':
          return 'arrow_circle_right';
        case 'Enter':
          return 'login';
        case 'Ring':
          return 'notifications';
        case 'Call':
          return 'call';
        case 'Transfer':
          return 'phone_forwarded';
        case 'VoiceMail':
          return 'voicemail';
        case 'Playback':
          return 'play_arrow';
        case 'Abandon':
          return 'logout';
        case 'Timeout':
        case 'Wait':
          return 'timer';
        case 'Congestion':
          return 'close_fullscreen';
        case 'Fail':
          return 'warning';
        case 'Hangup':
          return 'call_end';
        case 'NotConfigured':
          return 'edit_off';
        default:
          return 'question_mark';
      }
    },
    convertTime (unix_time) {
      return this.$dayjs.unix(unix_time).locale('FR-fr').format('HH:mm:ss');
    },
    get_call_flow_by_id (unique_id) {
      return this.call_log.call_flow.filter(call => call.unique_id === unique_id)
    },
    formatDuration(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      const hoursStr = hours > 0 ? `${hours}h ` : '';
      const minutesStr = minutes > 0 ? `${minutes}min ` : '';
      const secondsStr = `${secs}sec`;

      return `${hoursStr}${minutesStr}${secondsStr}`;
    },
    getCallerInfo(call_log) {
      let callerInfo = "";

      if (!call_log)
        return callerInfo;

      if (call_log.caller?.contact?.title) {
        callerInfo = call_log.caller.contact.title + " (" + call_log.caller.number + ")"
      }
      else if (call_log.caller?.name) {
        callerInfo = call_log.caller.name
        if (call_log.caller?.number) {
          callerInfo += " (" + call_log.caller.number + ")";
        }
      }
      else if (call_log.caller?.number) {
        callerInfo = call_log.caller.number;
      }
    
      return callerInfo;
    },
    getCalleeInfo(callee) {
      let calleeInfo = "";

      if (!callee)
        return calleeInfo;

      if (callee.contact?.title) {
        calleeInfo = callee.contact.title + " (" + callee.number + ")"
      }
      else if (callee.name) {
        calleeInfo = callee.name
        if (callee.number) {
          calleeInfo += " (" + callee.number + ")";
        }
      }
      else if (callee.number) {
        calleeInfo = callee.number;
      }

      return calleeInfo;
    },
    showMembersList() {
      this.showMembers = !this.showMembers;
    },
    showMembersWaitList() {
      this.showMembersWait = !this.showMembersWait;
    },
  },
  mounted() {
    this.call_log = this.$store.getters.getCallLog(this.unique_id);
    //console.log("AF debug CallFlow ", this.call_log)
  }
}
</script>

<style scoped>
/* Ajoutez vos styles de modal ici */
</style>
