<template>
  <div>
    <div class="fixed overlay" />
    <div class="fixed body container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>

<style lang="scss" scoped>
.fixed {
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
}

.body {
  z-index: 2;
  margin: 24px;
  padding: 16px;
  color:#000;
  background-color: #fff;
  opacity: 100%;
}
.overlay {
  z-index: 1;
  top: 0;
  background-color: #000;
  opacity: 50%;
}

.container {
  margin: 0 auto;
  width: calc(100vw - 16px);

  @media screen and (min-width: 800px){
    margin: 0 auto;
    max-width: calc(17 * 25px);
  }
}

</style>