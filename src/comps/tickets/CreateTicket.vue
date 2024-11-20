<template>

  <div data-v-65729484="" tabindex="-1" :class="active ? 'modal modalSupportDiag is-active' : 'modal modalSupportDiag'">

    <div class="modal-background"></div>
    <div class="animation-content" style="max-width: 960px;">
      <div data-v-65729484="" class="modal-card">
        <div data-v-65729484="" class="modal-card-head">
          <p data-v-65729484="" class="modal-card-title">
            Demande d'assistance
          </p>
          <button @click="quitCreateTicket()" type="button" class="delete"></button>
        </div>
        
        <section data-v-65729484="" class="modal-card-body">
          <div data-v-65729484="">
            <div data-v-65729484="" class="container is-fluid supportDiag">
              <div data-v-42540544="" data-v-65729484=""><div data-v-42540544="" class="container is-fluid supportDiag">

                <!--
                <div class="container" v-show="showLoading != false">
                  <div class="loading-inline">
                    <div class="loading-icon"></div>
                    <br>
                  </div>
                </div>
                -->

                <div v-show="isValidate == false" data-v-42540544="">
                  
                  <div class="level">
                    <div class="level_title">
                      {{helpdesk.message}}
                    </div>
                    <div v-for="h in helpdesk.values" :key="h.id">
                      <button v-if="h.type == 'select'" type="button" :class="ticketCategorie === h.name ? 'button diagBtn is-rounded has-icon active' : 'button diagBtn is-rounded has-icon'" @click="selectTicketSubject(h)">
                        <span>

                          <svg v-if="h.name === 'IPBX'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                              <path d="m 15.923531,64.545496 c 0,1.390999 1.125824,2.516823 2.516823,2.516823 1.390998,0 2.516823,-1.125824 2.516823,-2.516823 0,-1.390998 -1.125825,-2.521475 -2.516823,-2.521475 -1.390999,0 -2.516823,1.130477 -2.516823,2.521475"></path>
                              <path d="m 11.531883,48.355949 c -3.1309091,0 -5.6756454,2.549389 -5.6756454,5.680298 v 12.714377 c 0,3.126257 2.5447363,5.675646 5.6756454,5.675646 h 42.711561 c 0.642,0 1.163042,-0.521043 1.163042,-1.163042 0,-0.642 -0.521042,-1.163042 -1.163042,-1.163042 H 11.531883 c -1.8469106,0 -3.349561,-1.507303 -3.349561,-3.349562 V 54.036247 c 0,-1.846911 1.5026504,-3.354214 3.349561,-3.354214 H 45.31128 C 45.101933,49.919078 44.929803,49.15147 44.804194,48.355949 H 11.531883"></path>
                              <path d="m 87.725102,48.355949 h -1.730606 c -0.125609,0.795521 -0.297739,1.563129 -0.507087,2.326084 h 2.237693 c 1.846911,0 3.349562,1.507303 3.349562,3.354214 v 7.196905 c 0,0.646651 0.521043,1.163042 1.163042,1.163042 0.646651,0 1.163042,-0.516391 1.163042,-1.163042 v -7.196905 c 0,-3.130909 -2.544736,-5.680298 -5.675646,-5.680298"></path>
                              <path d="M 41.682589,73.193878 H 29.484602 c -0.641999,0 -1.163042,0.521043 -1.163042,1.163042 0,0.641999 0.521043,1.163042 1.163042,1.163042 h 12.197987 c 0.641999,0 1.163042,-0.521043 1.163042,-1.163042 0,-0.641999 -0.521043,-1.163042 -1.163042,-1.163042"></path>
                              <path d="m 78.183504,50.682033 c -0.888564,0.483826 -1.893432,0.781565 -2.972735,0.781565 -1.079304,0 -2.07952,-0.297739 -2.968084,-0.781565 -1.004868,-0.544303 -1.842259,-1.344476 -2.419128,-2.326084 -0.55826,-0.935086 -0.893216,-2.009737 -0.893216,-3.172779 0,-3.461214 2.819214,-6.280428 6.280428,-6.280428 3.461213,0 6.280427,2.819214 6.280427,6.280428 0,1.163042 -0.334956,2.237693 -0.888564,3.172779 -0.581521,0.981608 -1.418911,1.781781 -2.419128,2.326084 z m -10.164988,0.618739 -0.530347,0.162826 -0.762956,-0.400087 -0.265174,-0.381478 -1.60965,-2.326084 -1.595694,-2.302823 h -2.451693 v 4.48469 l -0.06048,0.144217 c -0.07909,0.432652 -0.409391,0.781565 -0.869956,0.781565 -0.455912,0 -0.786216,-0.348913 -0.865303,-0.781565 l -0.06048,-0.144217 v -5.410472 c 0,-0.516391 0.414043,-0.930434 0.925781,-0.930434 h 4.661473 c 0.953695,0 1.725955,-0.77226 1.725955,-1.725954 0,-0.962999 -0.77226,-1.735259 -1.725955,-1.735259 h -4.266038 c -0.511739,0 -0.925782,-0.418695 -0.925782,-0.930434 0,-0.511739 0.414043,-0.930434 0.925782,-0.930434 h 4.266038 c 1.97252,0 3.58217,1.609651 3.58217,3.58217 0,1.684085 -1.176998,3.028562 -2.726171,3.423996 l 1.721303,2.474954 1.139781,1.65152 0.144217,0.674564 z m -17.785241,0.153521 c -0.451261,0 -0.781565,-0.34426 -0.860651,-0.77226 l -0.06978,-0.153521 v -5.401168 c 0,-0.516391 0.418695,-0.930434 0.930434,-0.930434 h 4.019474 c 0.953694,0 1.725954,-0.77226 1.725954,-1.725954 0,-0.962999 -0.77226,-1.735259 -1.725954,-1.735259 h -3.577518 c -0.511739,0 -0.925782,-0.418695 -0.925782,-0.930434 0,-0.511739 0.414043,-0.930434 0.925782,-0.930434 h 3.577518 c 1.977171,0 3.582169,1.609651 3.582169,3.58217 0,1.991128 -1.604998,3.596127 -3.582169,3.596127 h -3.08904 v 4.475386 l -0.06513,0.153521 c -0.08374,0.428 -0.414043,0.77226 -0.865303,0.77226 z m 36.08222,-6.285079 c 0,-11.551335 -9.364815,-20.911499 -20.91615,-20.911499 -11.551335,0 -20.916151,9.360164 -20.916151,20.911499 0,1.093259 0.162826,2.139997 0.321,3.186735 0.125609,0.795521 0.297739,1.563129 0.507086,2.326084 2.433085,8.862382 10.458076,15.403331 20.088065,15.403331 9.629989,0 17.65498,-6.540949 20.088064,-15.403331 0.209348,-0.762955 0.381478,-1.530563 0.507087,-2.326084 0.158173,-1.046738 0.320999,-2.093476 0.320999,-3.186735 z"></path>
                              <path d="m 75.210769,40.758958 c -2.442389,0 -4.424213,1.986476 -4.424213,4.424212 0,1.251433 0.530347,2.372606 1.367738,3.172779 0.795521,0.767608 1.865519,1.251433 3.056475,1.251433 1.190955,0 2.260954,-0.483825 3.056474,-1.251433 0.837391,-0.800173 1.367738,-1.921346 1.367738,-3.172779 0,-2.437736 -1.986476,-4.424212 -4.424212,-4.424212"></path>
                            </g>
                          </svg>

                          
                          <svg v-if="h.name === 'OPERATEUR'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                              <path d="m 36.24999,7.1302981 c -2.305373,0.00223 -4.460196,1.1884927 -5.698266,3.1332119 l -10.485813,14.788755 -0.02507,0.03341 c -0.593305,0.909318 -0.906224,1.972284 -0.902366,3.058025 v 59.840154 c -0.04577,2.539698 2.072386,4.66621 4.612087,4.620441 h 14.128693 39.052341 0.985914 a 2.1391526,2.1391526 0 0 0 1.963482,-1.236576 c 0.959228,-0.8429 1.629268,-1.983613 1.629268,-3.342092 V 14.098559 C 81.57913,10.343497 78.54774,7.1979527 74.792657,7.1302981 h -0.02524 z m 0,4.2778769 h 38.459117 c 1.443022,0.0261 2.549756,1.172173 2.52328,2.615187 v 0.01673 73.985555 c 0,0.190708 -0.11007,0.300778 -0.300777,0.300778 H 37.87926 23.700435 23.67537 c -0.173669,0.0031 -0.262144,-0.08535 -0.259013,-0.259017 v -0.02524 -59.915347 c -8.91e-4,-0.250782 0.07184,-0.491809 0.20888,-0.701839 l 10.510879,-14.822176 0.02507,-0.05014 c 0.456511,-0.716904 1.238745,-1.143673 2.088805,-1.144495 z"></path>
                              <path d="m 34.453615,44.135609 c -2.238148,0 -4.110772,1.864269 -4.110772,4.102417 v 27.939887 c 0,2.238147 1.872624,4.102416 4.110772,4.102416 h 31.574412 c 2.238147,0 4.102416,-1.864269 4.102416,-4.102416 V 48.238026 c 0,-2.238148 -1.864269,-4.102417 -4.102416,-4.102417 z m 0.167107,4.277877 H 65.852566 V 76.002452 H 34.62072 Z"></path>
                              <path d="m 42.023453,44.093832 v 2.138939 31.950397 2.138939 h 4.277878 V 78.183168 46.232771 44.093832 Z"></path>
                              <path d="m 42.023453,55.13109 v 4.277877 h 2.138939 23.787335 2.138939 V 55.13109 H 67.949727 44.162392 Z"></path>
                              <path d="m 42.023453,65.048745 v 4.277878 h 2.138939 23.787335 2.138939 V 65.048745 H 67.949727 44.162392 Z"></path>
                            </g>
                          </svg>
                          
                          <br>
                            {{h.name}}
                        </span>
                      </button>
                    </div>

                  </div>


                  <div class="level" v-if="ticketCategorieId === 1 && helpdesk.values[ticketCategorieId].values" v-show="ticketCategorieId === 1 && ticketCategorie.length > 1 && helpdesk.values[ticketCategorieId].values">
                    <div class="level_title">
                      {{helpdesk.values[ticketCategorieId].message}}
                    </div>
                    <div v-for="h in helpdesk.values[ticketCategorieId].values" :key="h.name">
                      <button v-if="ticketCategorieId == 1" type="button" :class="ticketSubcategorie === h.name ? 'button diagBtn is-rounded has-icon active' : 'button diagBtn is-rounded has-icon'" @click="selectTicketSubcategorie(h)">
                        <span>
                          <i v-if="h.name === 'Trunk'" style="font-size: xx-large;" class="fas fa-sim-card"></i>
                          <i v-if="h.name === 'Centrex'" style="font-size: xx-large;" class="fas fa-server"></i>
                          <br>
                          <br>
                            {{h.name}}
                        </span>
                      </button>
                    </div>
                  </div>


                  <div v-if="ticketCategorieId == 0 && ticketCategorie.length > 1 && helpdesk.values[ticketCategorieId].values" v-show="ticketCategorie.length > 1 && helpdesk.values[ticketCategorieId].values && ticketCategorieId == 0">
                    <div class="level">
                      <div data-v-65e9c1a5="" class="level">
                        <div data-v-65e9c1a5="" class="level_title">
                        {{helpdesk.values[ticketCategorieId].message}}
                        </div>
                        <div data-v-65e9c1a5="" class="field" v-for="h in helpdesk.values[ticketCategorieId].values" :key="h.name">
                          <div data-v-65e9c1a5="" class="autocomplete control" @blur="showMenu = false">
                            <div class="control has-icons-right is-clearfix">
                              <input v-model="ticketContext" type="text" autocomplete="off" @focus="showMenu = true" :placeholder="h.message" class="input">
                              <span class="icon is-right is-clickable">
                                <i></i>
                              </span>
                              <div class="dropdown-menu" :style="showMenu == true ? '' : 'display: none'">
                                <div class="dropdown-content" :style="showMenu == true ? '' : 'display: none'">
                                  <a class="dropdown-item" v-for="i in myIPBX" :key="i.client_id" @click="selectIPBX(i)">
                                    <span v-if="i.virtual_ip">
                                      {{i.client_label}} : {{i.virtual_ip}}
                                    </span>
                                    <span v-else>
                                      {{i.client_label}}
                                    </span>
                                  </a>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="ticketContext.length > 1 && ticketCategorieId === 0 && ticketCategorie.length > 1 && helpdesk.values[ticketCategorieId].values[0].values" v-show="ticketContext.length > 1 && ticketCategorieId === 0 && ticketCategorie.length > 1 && helpdesk.values[ticketCategorieId].values[0].values">
                        <div class="level">
                          <div class="level_title">
                            {{helpdesk.values[ticketCategorieId].values[0].message}}
                          </div>
                          <div v-for="h in helpdesk.values[ticketCategorieId].values[0].values" :key="h.name">
                            <button type="button" :class="ticketService === h.name ? 'button diagBtn is-rounded active has-icon': 'button diagBtn is-rounded has-icon'" @click="selectTicketService(h)">
                              <span>
                                <svg v-if="h.id === '0'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="M 50,16.249999 C 68.639611,16.249999 83.75,31.36039 83.75,50 83.75,68.639611 68.639611,83.750001 50,83.750001 31.360389,83.750001 16.25,68.639611 16.25,50 16.25,31.36039 31.360389,16.249999 50,16.249999 m 0,-3.75 C 29.289324,12.499999 12.5,29.289322 12.5,50 12.5,70.710676 29.289324,87.500001 50,87.500001 70.710676,87.500001 87.5,70.710676 87.5,50 87.5,40.054382 83.54912,30.51611 76.516505,23.483494 69.48389,16.450883 59.945619,12.499999 50,12.499999 Z"></path>
                                    <path d="m 53.225,37.6625 h -6.45 v -4.8 h 6.45 z m 0,29.475 h -6.45 v -23.775 h 6.45 z"></path>
                                  </g>
                                </svg>

                                <svg v-if="h.id === '1'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                                  <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                    <path d="m 12.528642,57.835063 v -15.00179 c 0,-1.176502 0.961088,-2.137588 2.13759,-2.137588 h 0.513685 v 19.276967 h -0.513685 c -1.176502,0 -2.13759,-0.955563 -2.13759,-2.137589 z m 5.551105,4.899332 -0.138088,-0.679389 V 37.331883 c 0,-2.220445 1.800656,-4.0211 4.021099,-4.0211 h 5.015325 c 2.220443,0 4.026622,1.800656 4.026622,4.0211 v 24.723123 c 0,2.220443 -1.806179,4.026622 -4.026622,4.026622 h -5.015325 c -1.977408,0 -3.551602,-1.458199 -3.883011,-3.347233 z m 40.072894,13.372361 c -2.651274,0 -4.750198,1.944266 -5.208648,4.462975 l -0.193322,0.938986 0.104953,0.51921 C 43.614832,83.580027 34.197287,78.542612 29.712215,69.450956 L 29.16539,68.401492 c 2.656798,-0.922422 4.601065,-3.374849 4.601065,-6.346486 V 37.331883 c 0,-3.739402 -3.043442,-6.782843 -6.788366,-6.782843 H 26.64668 c 2.187301,-8.456459 9.036424,-14.697998 17.216708,-14.697998 h 20.12206 c 0.762243,0 1.380873,-0.61863 1.380873,-1.380872 0,-0.762241 -0.61863,-1.380871 -1.380873,-1.380871 h -20.12206 c -9.688195,0 -17.785626,7.456707 -20.066826,17.459741 h -1.833797 c -3.744924,0 -6.782841,3.043441 -6.782841,6.782843 v 0.602058 h -0.513685 c -2.700985,0 -4.899332,2.198347 -4.899332,4.899332 v 15.001789 c 0,2.706508 2.198347,4.899333 4.899332,4.899333 h 0.651771 c 0.353504,3.407991 3.142864,6.108976 6.644755,6.108976 h 4.402219 v 0.138088 c 4.098425,9.997511 13.416547,16.145148 23.137883,16.145148 1.458201,0 2.927448,-0.17675 4.385649,-0.45845 0.983181,1.32564 2.485569,2.24254 4.264132,2.24254 2.988205,0 5.407492,-2.41377 5.407492,-5.40197 0,-2.982683 -2.419287,-5.401969 -5.407492,-5.401969 z"></path>
                                    <path d="m 47.663582,47.500619 v 0.04972 c 0,1.358778 -1.038414,2.248059 -2.745172,2.248059 h -2.270152 v -4.567923 h 2.248059 c 1.728851,0 2.767265,0.789858 2.767265,2.270152 z m -9.804187,-6.296774 v 17.282988 h 4.788863 v -4.937996 h 2.369575 c 4.297272,0 7.434612,-2.148635 7.434612,-6.224969 v -0.04419 c 0,-3.827776 -2.816977,-6.075835 -7.186055,-6.075835 z"></path>
                                    <path d="m 64.985237,47.450908 c 0,1.259356 -0.938993,2.049214 -2.568421,2.049214 h -3.159435 v -4.148138 h 3.131817 c 1.607334,0 2.596039,0.690435 2.596039,2.049212 z m 4.816479,-0.298268 v -0.0497 c 0,-1.701233 -0.519208,-3.032393 -1.535529,-4.02662 -1.159931,-1.182025 -2.988205,-1.872462 -5.628432,-1.872462 h -8.17476 v 17.282988 h 4.794386 v -5.230741 h 2.098924 l 3.479797,5.230741 h 5.529011 l -4.120522,-6.0206 c 2.148636,-0.916902 3.557125,-2.667848 3.557125,-5.313598 z"></path>
                                    <path d="m 85.339284,49.897813 c 0,2.491091 -1.750946,4.617635 -4.396695,4.617635 -2.618132,0 -4.418789,-2.176254 -4.418789,-4.672871 v -0.04419 c 0,-2.496617 1.750944,-4.617635 4.374601,-4.617635 2.640227,0 4.440883,2.17073 4.440883,4.661822 z m -4.396695,-9.041947 c -5.330164,0 -9.334692,4.026621 -9.334692,8.986711 v 0.05523 c 0,4.960091 3.954816,8.937001 9.290504,8.937001 5.330164,0 9.334692,-4.026621 9.334692,-8.992236 v -0.04419 c 0,-4.965613 -3.954816,-8.942524 -9.290504,-8.942524 z"></path>
                                  </g>
                                </svg>

                                <span v-if="h.id === '2'"><i style="margin-bottom: 0.5rem; font-size: 4em;" class="fal fa-people-carry"></i></span>

                                <br>
                                  {{h.name}}
                              </span>
                            </button>
                          </div>
                        </div>
                        
                        <div v-if="ticketService.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values" v-show="ticketService.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values">
                          <div class="level">
                            <div class="level_title">
                              {{helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].message}}
                            </div>
                            <div class="field" v-if="helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values.length > 0">
                              <div class="control">
                                <span class="select is-empty">
                                  <select v-model="ticketServiceDetails" v-on:change="updateticketServiceDetailsId(ticketServiceDetails)">
                                    <option v-for="h in helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values" :key="h.name" :value="h.name">
                                      {{h.name}}
                                    </option>
                                  </select>
                                </span>
                              </div>
                            </div>
                          <div class= "level_title" v-else>
                            <div class="control">
                              <textarea v-model="ticketServiceDetails" v-on:change="updateticketServiceDetailsStatus(ticketServiceDetails)" type="text" autocomplete="off" :placeholder="helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].message" class="input" style="padding-right: 0.5em; height: 5rem;"></textarea>
                            </div>
                          </div>
                          </div>
                        </div>


                        <div v-if="ticketServiceDetails.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId]" v-show="ticketServiceDetails.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values">
                          <div class="level">
                            <div class="level_title">
                              {{helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].message}}
                            </div>
                            <div class="field">
                              <div class="control">
                                <span class="select is-empty" v-if="helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values.length > 0">
                                  <select v-model="ticketServiceDetailsSec" v-on:change="updateticketServiceDetailsSecId(ticketServiceDetailsSec)">
                                    <option v-for="h in helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values" :key="h.name" :value="h.name">
                                      {{h.name}}
                                    </option>
                                  </select>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="ticketServiceDetailsSec.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values.length > 0" v-show="ticketServiceDetailsSec.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values.length > 0">
                          <div class="level">
                            <div class="level_title">
                              {{helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].message}}
                            </div>
                            <div class="field">
                              <div class="control">
                                <span class="select is-empty" v-if="helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values.length > 0">
                                  <select v-model="ticketServiceDetailsThird" v-on:change="updateticketServiceDetailsThirdId(ticketServiceDetailsThird)">
                                    <option v-for="h in helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values" :key="h.name" :value="h.name">
                                      {{h.name}}
                                    </option>
                                  </select>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="ticketInfos.length > 1" v-show="ticketInfos.length > 1">
                            <div class="level">
                              <div class="level_title" v-if="ticketInfos == 'mac'">
                                Veuillez saisir la MAC de votre téléphone
                              </div>
                              <div class="level_title" v-if="ticketInfos == 'sda+horodatage'">
                                Veuillez saisir la (ou les) SDA ainsi que l'horodatage (~15mins)
                              </div>
                              <div class="level_title" v-if="ticketInfos == 'sda'">
                                Veuillez saisir la (ou les) SDA
                              </div>
                              <div class="field">
                                <div class="control">
                                  <div>
                                    <input v-if="ticketInfos == 'mac'" v-model="macVal" maxlength="14" type="" autocomplete="off" placeholder="AZ-12-ER-34-T5" class="input">
                                    <input v-if="ticketInfos == 'sda' || ticketInfos == 'sda+horodatage'" v-model="sdaInfo" type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" maxlength="10" autocomplete="off" placeholder="0123456789" class="input">
                                    <input v-if="ticketInfos == 'sda+horodatage'" v-model="horodatageInfo" type="datetime-local" autocomplete="off" placeholder="01/01/2022 10:00:00" class="input">
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>

                      </div>
                  </div>


                  <div v-if="ticketSubcategorie.length > 1 && ticketCategorieId === 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values" v-show="ticketSubcategorie.length > 1 && ticketCategorieId === 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values">
                    <div class="level">
                      <div data-v-65e9c1a5="" class="level">
                        <div data-v-65e9c1a5="" class="level_title">
                        {{helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].message}}
                        </div>
                        <div data-v-65e9c1a5="" class="field" v-for="h in helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values" :key="h.name">
                          <div data-v-65e9c1a5="" class="autocomplete control" @blur="showMenu = false">
                            <div class="control has-icons-right is-clearfix">
                              <input v-model="ticketTrunk" type="text" autocomplete="off" @focus="showMenu = true" :placeholder="h.message" class="input">
                              <span class="icon is-right is-clickable">
                                <i></i>
                              </span>
                              <div class="dropdown-menu" :style="showMenu == true ? '' : 'display: none'">
                                <div class="dropdown-content" :style="showMenu == true ? '' : 'display: none'">
                                  <a class="dropdown-item" v-for="t in myTrunk" :key="t.id" @click="selectTrunk(t)">
                                    <span>
                                      {{t.client}} - {{t.contract_number}}
                                    </span>
                                  </a>
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>


                   <div v-if="ticketTrunk.length > 8 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values" v-show="ticketSubcategorie.length > 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values">
                      <div class="level">
                        <div class="level_title">
                          {{helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].message}}
                        </div>
                        <div v-for="h in helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values" :key="h.name">
                          <button type="button" :class="ticketService === h.name ? 'button diagBtn is-rounded active has-icon': 'button diagBtn is-rounded has-icon'" @click="selectTicketService(h)">
                            <span>
                              <svg v-if="h.id === '0'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                  <path d="M 50,16.249999 C 68.639611,16.249999 83.75,31.36039 83.75,50 83.75,68.639611 68.639611,83.750001 50,83.750001 31.360389,83.750001 16.25,68.639611 16.25,50 16.25,31.36039 31.360389,16.249999 50,16.249999 m 0,-3.75 C 29.289324,12.499999 12.5,29.289322 12.5,50 12.5,70.710676 29.289324,87.500001 50,87.500001 70.710676,87.500001 87.5,70.710676 87.5,50 87.5,40.054382 83.54912,30.51611 76.516505,23.483494 69.48389,16.450883 59.945619,12.499999 50,12.499999 Z"></path>
                                  <path d="m 53.225,37.6625 h -6.45 v -4.8 h 6.45 z m 0,29.475 h -6.45 v -23.775 h 6.45 z"></path>
                                </g>
                              </svg>

                              <svg v-if="h.id === '1'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon svg-4x">
                                <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                  <path d="m 12.528642,57.835063 v -15.00179 c 0,-1.176502 0.961088,-2.137588 2.13759,-2.137588 h 0.513685 v 19.276967 h -0.513685 c -1.176502,0 -2.13759,-0.955563 -2.13759,-2.137589 z m 5.551105,4.899332 -0.138088,-0.679389 V 37.331883 c 0,-2.220445 1.800656,-4.0211 4.021099,-4.0211 h 5.015325 c 2.220443,0 4.026622,1.800656 4.026622,4.0211 v 24.723123 c 0,2.220443 -1.806179,4.026622 -4.026622,4.026622 h -5.015325 c -1.977408,0 -3.551602,-1.458199 -3.883011,-3.347233 z m 40.072894,13.372361 c -2.651274,0 -4.750198,1.944266 -5.208648,4.462975 l -0.193322,0.938986 0.104953,0.51921 C 43.614832,83.580027 34.197287,78.542612 29.712215,69.450956 L 29.16539,68.401492 c 2.656798,-0.922422 4.601065,-3.374849 4.601065,-6.346486 V 37.331883 c 0,-3.739402 -3.043442,-6.782843 -6.788366,-6.782843 H 26.64668 c 2.187301,-8.456459 9.036424,-14.697998 17.216708,-14.697998 h 20.12206 c 0.762243,0 1.380873,-0.61863 1.380873,-1.380872 0,-0.762241 -0.61863,-1.380871 -1.380873,-1.380871 h -20.12206 c -9.688195,0 -17.785626,7.456707 -20.066826,17.459741 h -1.833797 c -3.744924,0 -6.782841,3.043441 -6.782841,6.782843 v 0.602058 h -0.513685 c -2.700985,0 -4.899332,2.198347 -4.899332,4.899332 v 15.001789 c 0,2.706508 2.198347,4.899333 4.899332,4.899333 h 0.651771 c 0.353504,3.407991 3.142864,6.108976 6.644755,6.108976 h 4.402219 v 0.138088 c 4.098425,9.997511 13.416547,16.145148 23.137883,16.145148 1.458201,0 2.927448,-0.17675 4.385649,-0.45845 0.983181,1.32564 2.485569,2.24254 4.264132,2.24254 2.988205,0 5.407492,-2.41377 5.407492,-5.40197 0,-2.982683 -2.419287,-5.401969 -5.407492,-5.401969 z"></path>
                                  <path d="m 47.663582,47.500619 v 0.04972 c 0,1.358778 -1.038414,2.248059 -2.745172,2.248059 h -2.270152 v -4.567923 h 2.248059 c 1.728851,0 2.767265,0.789858 2.767265,2.270152 z m -9.804187,-6.296774 v 17.282988 h 4.788863 v -4.937996 h 2.369575 c 4.297272,0 7.434612,-2.148635 7.434612,-6.224969 v -0.04419 c 0,-3.827776 -2.816977,-6.075835 -7.186055,-6.075835 z"></path>
                                  <path d="m 64.985237,47.450908 c 0,1.259356 -0.938993,2.049214 -2.568421,2.049214 h -3.159435 v -4.148138 h 3.131817 c 1.607334,0 2.596039,0.690435 2.596039,2.049212 z m 4.816479,-0.298268 v -0.0497 c 0,-1.701233 -0.519208,-3.032393 -1.535529,-4.02662 -1.159931,-1.182025 -2.988205,-1.872462 -5.628432,-1.872462 h -8.17476 v 17.282988 h 4.794386 v -5.230741 h 2.098924 l 3.479797,5.230741 h 5.529011 l -4.120522,-6.0206 c 2.148636,-0.916902 3.557125,-2.667848 3.557125,-5.313598 z"></path>
                                  <path d="m 85.339284,49.897813 c 0,2.491091 -1.750946,4.617635 -4.396695,4.617635 -2.618132,0 -4.418789,-2.176254 -4.418789,-4.672871 v -0.04419 c 0,-2.496617 1.750944,-4.617635 4.374601,-4.617635 2.640227,0 4.440883,2.17073 4.440883,4.661822 z m -4.396695,-9.041947 c -5.330164,0 -9.334692,4.026621 -9.334692,8.986711 v 0.05523 c 0,4.960091 3.954816,8.937001 9.290504,8.937001 5.330164,0 9.334692,-4.026621 9.334692,-8.992236 v -0.04419 c 0,-4.965613 -3.954816,-8.942524 -9.290504,-8.942524 z"></path>
                                </g>
                              </svg>

                              <br>
                                {{h.name}}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div v-if="ticketService.length > 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values" v-show="ticketService.length > 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values">
                        <div class="level">
                          <div class="level_title">
                            Pouvez vous préciser votre demande ?
                          </div>
                          <div class="field" v-if="helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values.length > 0">
                            <div class="control">
                              <span class="select is-empty">
                                <select v-model="ticketServiceDetails" v-on:change="updateticketServiceDetailsId(ticketServiceDetails)">
                                  <option v-for="h in helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values" :key="h.name" :value="h.name">
                                    {{h.name}}
                                  </option>
                                </select>
                              </span>
                            </div>
                          </div>
                          <div class= "level_title" v-else>
                            <div class="control">
                              <textarea v-model="ticketServiceDetails" v-on:change="updateticketServiceDetailsStatus(ticketServiceDetails)" type="text" autocomplete="off" :placeholder="helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].message" class="input" style="padding-right: 0.5em; height: 5rem;"></textarea>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!--
                      <div v-if="ticketServiceDetails.length > 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId] && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values.length > 0" v-show="ticketServiceDetails.length > 1 && helpdesk.values[ticketCategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId] && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId] && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values.length > 0">
                          <div class="level">
                            <div class="level_title">
                              {{helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].message}}
                            </div>
                            <div class="field">
                              <div class="control">
                                <span class="select is-empty" v-if="helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values.length > 0">
                                  <select v-model="ticketServiceDetailsSec" v-on:change="updateticketServiceDetailsSecId(ticketServiceDetailsSec)">
                                    <option v-for="h in helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values" :key="h.name" :value="h.name">
                                      {{h.name}}
                                    </option>
                                  </select>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="ticketServiceDetailsSec.length > 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values.length > 0" v-show="ticketServiceDetailsSec.length > 1 && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values && helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values.length > 0">
                          <div class="level">
                            <div class="level_title">
                              {{helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].message}}
                            </div>
                            <div class="field">
                              <div class="control">
                                <span class="select is-empty" v-if="helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values.length > 0">
                                  <select v-model="ticketServiceDetailsThird" v-on:change="updateticketServiceDetailsThirdId(ticketServiceDetailsThird)">
                                    <option v-for="h in helpdesk.values[ticketCategorieId].values[ticketSubcategorieId].values[0].values[ticketServiceId].values[ticketServiceDetailsId].values[ticketServiceDetailsSecId].values" :key="h.name" :value="h.name">
                                      {{h.name}}
                                    </option>
                                  </select>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        -->

                        <div v-if="ticketInfos.length > 1" v-show="ticketInfos.length > 1">
                            <div class="level">
                              <div class="level_title" v-if="ticketInfos == 'mac'">
                                Veuillez saisir la MAC de votre téléphone
                              </div>
                              <div class="level_title" v-if="ticketInfos == 'sda+horodatage'">
                                Veuillez saisir la (ou les) SDA ainsi que l'horodatage (~15mins)
                              </div>
                              <div class="level_title" v-if="ticketInfos == 'sda'">
                                Veuillez saisir la (ou les) SDA
                              </div>
                              <div class="field">
                                <div class="control">
                                  <div>
                                    <input v-if="ticketInfos == 'mac'" v-model="macVal" maxlength="14" type="" autocomplete="off" placeholder="AZ-12-ER-34-T5" class="input">
                                    <input v-if="ticketInfos == 'sda' || ticketInfos == 'sda+horodatage'" v-model="sdaInfo" type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" maxlength="10" autocomplete="off" placeholder="0123456789" class="input">
                                    <input v-if="ticketInfos == 'sda+horodatage'" v-model="horodatageInfo" type="datetime-local" autocomplete="off" placeholder="01/01/2022 10:00:00" class="input">
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>

                    </div>

                  <div class="level" v-if="ticketServiceDetails.length > 1">
                    <div class="level_title">
                      <p class="mb-2 answer_title">
                        Veuillez vérifier les informations de votre ticket
                      </p>
                      <button type="button" class="button is-admin-primary is-small" @click="isValidate = true">
                        <span>
                          Valider
                        </span>
                      </button>
                    </div>
                  </div>
                </div>


                <div v-show="isValidate == true">
                  <div class="answer_title">
                    Nos solutions pour répondre à votre demande :
                  </div>
                  <!--
                  <div class="answer">
                    <p class="mb-2 answer_title">
                      FAQ : Gérer mes services de téléphonie
                    </p>
                    <a href="" target="_blank" rel="noopener noreferrer" class="button is-admin-secondary-light is-small">
                      Paramétrer mes services de téléphonie
                    </a>
                  </div>
                  -->
                  <div class="answer">
                    <p class="mb-2 answer_title">
                      Notre Centre d’expertise client vous répond dans les meilleurs délais.
                    </p>
                    <button type="button" class="button is-admin-primary is-small" @click="submitTicket()">
                      <span>
                        Ouvrir un ticket
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  </div>

</template>

<script>
import helpdeskData from '../../utils/helpdesk.json'
export default {
  name: 'CreateTicket',
  props: {
    active: Boolean
  },
  data: () => {
    return {
      isValidate: false,
      lvls: [0],
      mylevel: 0,
      showLoading: false,
      ticketContext: '',
      ticketCategorie: '',
      ticketCategorieId: null,
      ticketSubcategorie: '',
      ticketSubcategorieId: null,
      ticketService: '',
      ticketServiceId: null,
      ticketServiceDetails: '',
      ticketServiceDetailsId: '',
      ticketServiceDetailsSec: '',
      ticketServiceDetailsSecId: '',
      ticketServiceDetailsThird: '',
      ticketServiceDetailsThirdId: '',
      ticketInfos: '',
      ticketInfosValue: '',
      macInfo: '',
      sdaInfo: '',
      typeInfo: '',
      ipInfo: '',
      horodatageInfo: '',
      ticketNumber: false,
      new_ticket: [],
      categorieId: null,
      helpdesk: helpdeskData,
      isResponse: false,
      showMenu: false,
      ipbx_list: [],
      trunk_list: [],
      tags: null,
      ticketIPBX: '',
      ticketTrunk: '',
      ticketTrunkClient: '',
      ticketTrunkContract: '',
      ticketServiceStatus: false,
      savedVals: []
    }
  },
  computed: {
    macVal: {
      // getter
      get: function () {
        return this.macInfo.toUpperCase()
      },
      // setter
      set: function (newValue) {
        let val = newValue.split('-').join('')
        let newval = ''
        for (let i = 0; i < val.length; i++) {
          newval += val[i]
          if ((i + 1) % 2 === 0 && (i + 1) < val.length) {
            newval += '-'
          }
        }
        this.macInfo = newval.toUpperCase()
      }
    },
    user () {
      return this.$store.getters.getUser
    },
    myIPBX () {
      let cservers = this.ipbx_list
      if (this.ticketContext) {
        let text = this.ticketContext
        cservers = cservers.filter(s => {
          // return text.toLowerCase().split(' ').every(v => s[1].toLowerCase().includes(v) || s[2].toLowerCase().includes(v) || s[4].toLowerCase().includes(v))
          return text.toLowerCase().split(' ').every(v => s.client_label.toLowerCase().includes(v) || s.real_ip.toLowerCase().includes(v) || s.virtual_ip.toLowerCase().includes(v))
        })
        return cservers
      }
      return cservers
    },
    myTrunk () {
      let ctrunks = this.trunk_list
      if (this.ticketTrunk) {
        let text = this.ticketTrunk
        ctrunks = ctrunks.filter(t => {
          return text.toLowerCase().split(' ').every(v => t.client.toLowerCase().includes(v) || t.username.toLowerCase().includes(v))
        })
        return ctrunks
      }
      return ctrunks
    }
  },
  watch: {
    active: function (newVal, oldVal) {
      if (newVal === true) {
        this.isValidate = false
        this.ticketContext = ''
        this.ticketCategorie = ''
        this.ticketCategorieId = null
        this.ticketSubcategorie = ''
        this.ticketSubcategorieId = null
        this.ticketService = ''
        this.ticketServiceId = null
        this.ticketServiceDetails = ''
        this.ticketServiceDetailsId = null
        this.ticketServiceDetailsSec = ''
        this.ticketServiceDetailsSecId = null
        this.ticketServiceDetailsThird = ''
        this.ticketServiceDetailsThirdId = null
        this.ticketNumber = false
        this.categorieId = null
        this.isResponse = false
        this.showMenu = false
        this.tags = null
        this.ticketIPBX = ''
        this.ipInfo = ''
        this.ticketTrunk = ''
        this.ticketTrunkClient = ''
        this.ticketTrunkContract = ''
        this.macVal = ''
        this.sdaInfo = ''
        this.typeInfo = ''
        this.horodatageInfo = ''
        this.ticketInfos = ''
        this.ticketInfosValue = ''
        /* setTimeout(() => {
          this.showLoading = false
        }, 1000) */
      }
    }
  },
  methods: {
    updateticketServiceDetailsStatus (ticketServiceDetails) {
      if (ticketServiceDetails.length > 0) {
        this.ticketServiceStatus = true
      } else {
        this.ticketServiceStatus = false
      }
    },
    updateticketServiceDetailsId (ticketServiceDetails) {
      if (this.ticketCategorieId === 0) {
        for (let val of this.helpdesk.values[this.ticketCategorieId].values[0].values[this.ticketServiceId].values) {
          if (val.name === ticketServiceDetails) {
            this.ticketServiceDetailsId = val.id
            this.ticketServiceDetailsSec = ''
            this.ticketServiceDetailsSecId = null
            this.ticketServiceDetailsThird = ''
            this.ticketServiceDetailsThirdId = null
            this.macVal = ''
            this.sdaInfo = ''
            this.horodatageInfo = ''
            this.ticketInfos = ''
            this.ticketInfosValue = ''
            if (val.infos) {
              this.ticketInfos = val.infos
            }
            if (val.tags) {
              this.tags = val.tags
            }
          }
        }
      } else {
        for (let val of this.helpdesk.values[this.ticketCategorieId].values[this.ticketSubcategorieId].values[0].values[this.ticketServiceId].values) {
          if (val.name === ticketServiceDetails) {
            this.ticketServiceDetailsId = val.id
            this.ticketServiceDetailsSec = ''
            this.ticketServiceDetailsSecId = null
            this.ticketServiceDetailsThird = ''
            this.ticketServiceDetailsThirdId = null
            this.macVal = ''
            this.sdaInfo = ''
            this.horodatageInfo = ''
            this.ticketInfos = ''
            this.ticketInfosValue = ''
            if (val.infos) {
              this.ticketInfos = val.infos
            }
            if (val.tags) {
              this.tags = val.tags
            }
          }
        }
      }
    },
    updateticketServiceDetailsSecId (ticketServiceDetails) {
      if (this.ticketCategorieId === 0) {
        for (let val of this.helpdesk.values[this.ticketCategorieId].values[0].values[this.ticketServiceId].values[this.ticketServiceDetailsId].values) {
          if (val.name === ticketServiceDetails) {
            this.ticketServiceDetailsSecId = val.id
            this.ticketServiceDetailsThird = ''
            this.ticketServiceDetailsThirdId = null
            this.macVal = ''
            this.sdaInfo = ''
            this.horodatageInfo = ''
            this.ticketInfos = ''
            this.ticketInfosValue = ''
            if (val.infos) {
              this.ticketInfos = val.infos
            }
            if (val.tags) {
              this.tags = val.tags
            }
          }
        }
      } else {
        for (let val of this.helpdesk.values[this.ticketCategorieId].values[this.ticketSubcategorieId].values[0].values[this.ticketServiceId].values[this.ticketServiceDetailsId].values) {
          if (val.name === ticketServiceDetails) {
            this.ticketServiceDetailsSecId = val.id
            this.ticketServiceDetailsThird = ''
            this.ticketServiceDetailsThirdId = null
            this.macVal = ''
            this.sdaInfo = ''
            this.horodatageInfo = ''
            this.ticketInfos = ''
            this.ticketInfosValue = ''
            if (val.infos) {
              this.ticketInfos = val.infos
            }
            if (val.tags) {
              this.tags = val.tags
            }
          }
        }
      }
    },
    updateticketServiceDetailsThirdId (ticketServiceDetails) {
      if (this.ticketCategorieId === 0) {
        for (let val of this.helpdesk.values[this.ticketCategorieId].values[0].values[this.ticketServiceId].values[this.ticketServiceDetailsSecId].values) {
          if (val.name === ticketServiceDetails) {
            this.ticketServiceDetailsThirdId = val.id
            this.macVal = ''
            this.sdaInfo = ''
            this.horodatageInfo = ''
            this.ticketInfos = ''
            this.ticketInfosValue = ''
            if (val.infos) {
              this.ticketInfos = val.infos
            }
            if (val.tags) {
              this.tags = val.tags
            }
          }
        }
      } else {
        for (let val of this.helpdesk.values[this.ticketCategorieId].values[this.ticketSubcategorieId].values[0].values[this.ticketServiceId].values[this.ticketServiceDetailsId].values[this.ticketServiceDetailsSecId].values) {
          if (val.name === ticketServiceDetails) {
            this.ticketServiceDetailsThirdId = val.id
            this.macVal = ''
            this.sdaInfo = ''
            this.horodatageInfo = ''
            this.ticketInfos = ''
            this.ticketInfosValue = ''
            if (val.infos) {
              this.ticketInfos = val.infos
            }
          }
        }
      }
    },
    updateLevel () {
      this.mylevel += 1
      this.lvls.push(this.mylevel)
    },
    updateVals (val1, val2) {
      this.savedVals.push({val: val1, level: val2})
    },
    async getServers () {
      const header = {
        'Content-Type': 'application/json'
      }
      this.ipbx_list = this.$store.getters.clients
    },
    async getTrunks () {
      this.trunk_list = this.$store.getters.trunks
    },
    quitCreateTicket () {
      this.$emit('createTicket', false)
    },
    selectIPBX (i) {
      this.ticketContext = i.client_label
      this.ticketIPBX = i.client_label
      this.ipInfo = i.virtual_ip
      this.showMenu = false
    },
    selectTrunk (t) {
      this.ticketTrunk = t.username
      this.ticketTrunkClient = t.client
      this.ticketTrunkContract = t.contract_name + ': ' + t.contract_number
      if (t.cn_name) {
        this.ticketIPBX = t.cn_name
        this.ipInfo = t.ip_address
      } else {
        this.ticketIPBX = ''
        this.ipInfo = ''
      }
      this.showMenu = false
    },
    selectTicketSubject (h) {
      this.ticketCategorie = h.name
      this.ticketCategorieId = parseInt(h.id)

      this.ticketSubcategorie = ''
      this.ticketSubcategorieId = null
      this.ticketService = ''
      this.ticketServiceId = null
      this.ticketServiceDetails = ''
      this.ticketServiceDetailsId = null
      this.ticketServiceDetailsSec = ''
      this.ticketServiceDetailsSecId = null
      this.ticketServiceDetailsThird = ''
      this.ticketServiceDetailsThirdId = null
      this.ticketContext = ''
      this.ticketTrunk = ''
      this.ticketIPBX = ''
      this.macVal = ''
      this.sdaInfo = ''
      this.horodatageInfo = ''
      this.ticketInfos = ''
      this.ticketInfosValue = ''
      this.ticketServiceStatus = false
    },
    selectTicketSubcategorie (h) {
      this.ticketSubcategorie = h.name
      this.ticketSubcategorieId = parseInt(h.id)

      this.ticketService = ''
      this.ticketServiceId = null
      this.ticketServiceDetails = ''
      this.ticketServiceDetailsId = null
      this.ticketServiceDetailsSec = ''
      this.ticketServiceDetailsSecId = null
      this.ticketServiceDetailsThird = ''
      this.ticketServiceDetailsThirdId = null
      this.macVal = ''
      this.sdaInfo = ''
      this.horodatageInfo = ''
      this.ticketInfos = ''
      this.ticketInfosValue = ''
      this.ticketServiceStatus = false
    },
    selectTicketService (h) {
      this.ticketService = h.name
      this.ticketServiceId = parseInt(h.id)
      this.ticketServiceDetails = ''
      this.ticketServiceDetailsId = null
      this.ticketServiceDetailsSec = ''
      this.ticketServiceDetailsSecId = null
      this.ticketServiceDetailsThird = ''
      this.ticketServiceDetailsThirdId = null
      this.macVal = ''
      this.sdaInfo = ''
      this.horodatageInfo = ''
      this.ticketInfos = ''
      this.ticketInfosValue = ''
      this.ticketServiceStatus = false
    },
    async submitTicket () {
      if (this.showLoading) {
        return;
      }
      this.showLoading = true
      const header = {
        'Content-Type': 'application/json'
      }
      let subject = this.ticketCategorie
      if (this.ticketSubcategorie.length > 1) {
        subject += ' / '
        subject += this.ticketSubcategorie
      }
      if (this.ticketService.length > 1) {
        subject += ' / '
        subject += this.ticketService
      }
      if (this.ticketServiceDetails.length > 1 && this.ticketServiceStatus === false) {
        subject += ' / '
        subject += this.ticketServiceDetails
      }
      if (this.ticketServiceDetailsSec.length > 1) {
        subject += ' / '
        subject += this.ticketServiceDetailsSec
      }
      if (this.ticketServiceDetailsThird.length > 1) {
        subject += ' / '
        subject += this.ticketServiceDetailsThird
      }
      if (this.ticketSubcategorie.length < 1) {
        subject += ' - '
        subject += this.ticketIPBX
      } else {
        subject += ' - '
        subject += this.ticketTrunkContract
      }
      let team = 0
      if (this.ticketCategorieId === 0) {
        team = 2
      } else {
        team = 1
      }
      if (this.ticketInfos === 'mac') {
        this.ticketInfosValue = this.macVal
      } else if (this.ticketInfos === 'sda+horodatage') {
        this.ticketInfosValue = this.sdaInfo.toString() + '+' + this.horodatageInfo.toString()
      } else if (this.ticketInfos === 'sda') {
        this.ticketInfosValue = this.sdaInfo.toString()
      }
      /*
      let vals = {
        'Trunk': this.ticketTrunk,
        'Numéro': this.sdaInfo,
        'Type': this.typeInfo,
        '@MAC': this.macVal,
        'Horodatage': this.horodatageInfo,
        'Serveur': this.ticketIPBX,
        '@IP Serveur': this.ip_address
      }
      */
      let description = ''
      if (this.ticketTrunkContract.length > 1) {
        description += '<p>Contrat: ' + this.ticketTrunkContract + '</p>'
      }
      if (this.ticketTrunk.length > 1) {
        description += '<p>Trunk: ' + this.ticketTrunk + '</p>'
      }
      if (this.sdaInfo.length > 1) {
        description += '<p>Numéro: ' + this.sdaInfo + '</p>'
      }
      if (this.typeInfo.length > 1) {
        description += '<p>Type: ' + this.typeInfo + '</p>'
      }
      if (this.macVal.length > 1) {
        description += '<p>@MAC: ' + this.macVal + '</p>'
      }
      if (this.horodatageInfo.length > 1) {
        description += '<p>Horodatage: ' + this.horodatageInfo + '</p>'
      }
      if (this.ticketService.length > 1 && this.ticketServiceStatus === true) {
        description += '<p>Détails: ' + this.ticketServiceDetails + '</p>'
      }
      description += '<p>Serveur: ' + this.ticketIPBX + '</p>'
      description += '<p>@IP Serveur: ' + this.ipInfo + '</p>'
      let params = {
        'data': this.ticketIPBX,
        'subject': subject,
        'description': description,
        'tags': this.tags,
        'channel': 5,
        'team': team,
        'cn': this.ticketIPBX,
        'trunk': this.ticketTrunk,
        'ticketinfo': this.ticketInfos,
        'ip_address': this.ipInfo,
        'ticketinfovalue': this.ticketInfosValue
      }
      this.new_ticket = await this.$axios.post(process.env.ODOO_API + 'api/tickets/create?session_id=' + this.user.session_id, { params }, { headers: header }).then(response => {
        return response.data.result
      })
      this.ticketNumber = this.new_ticket.number
      setTimeout(() => {
        this.showLoading = false
        if (this.ticketNumber) {
          this.$toastr.Add({
            name: 'SuccesData',
            title: 'Ticket crée :)',
            msg: 'Nous reviendrons vers vous dans un délai plus que bref',
            clickClose: true,
            timeout: 3000,
            progressBarValue: 0,
            position: 'toast-top-right',
            type: 'success',
            preventDuplicates: true,
            classNames: ['animated', 'slideInRight'],
            style: { 'margin-top': '20%' }
          })
          this.quitCreateTicket()
          this.$globalState.loader = true
          this.$router.push('/support/ticket?number=' + this.ticketNumber)
        } else {
          this.quitCreateTicket()
        }
      }, 1000)
    }
  },
  async created () {
    await this.getServers()
    await this.getTrunks()
  },
  mounted () {
    this.$globalState.loader = false
  }
}
</script>

<style scoped>

</style>