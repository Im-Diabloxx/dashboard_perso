<template>

    <div class="account-content" :style="tab ? 'padding-left: 250px;' : ''">

        <div class="admin-box">
            <div class="dashboard">
            <div class="container is-max-widescreen">
                <h1 style="margin-top: 40px">
                    <a href="/products" class="router-link-active">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="svgicon">
                            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" stroke-linecap="square">
                                <path d="m 69.968507,12.486933 c 0.76849,0.792853 0.748712,2.05858 -0.04418,2.827036 L 35.099791,50.138511 69.427395,84.664892 c 1.914835,1.899617 -0.979599,4.749226 -2.8491,2.804976 L 29.467819,50.116443 67.097312,12.486949 c 0.78549,-0.810465 2.085718,-0.810465 2.87121,-2e-6 z"></path>
                            </g>
                        </svg>
                        Commander un Trunk
                    </a>
                </h1>
                <section style="margin-top: 20%; text-align-last: center;">
                <h1 class="dashboard-zone" style="font-size: 24px">
                    <a><i class="material-symbols-outlined size-xl">sentiment_satisfied</i></a>
                    <br>
                    <br>
                        Bientot des tarifs imbattable et une simplicité à toute épreuve.
                    <br>
                </h1>
                </section>
            </div>
            </div>
        </div>
    </div>
  
</template>
<script>
export default {
  name: 'CommandTrunk',
  props: {
    tab: Boolean
  },
  data: () => {
    return {
    }
  },
  mounted () {
    this.$globalState.loader = false
  }
}
</script>