<template>
  <div class="virtual-controller">
    <div class="flex">
      <button :disabled="disabled" @click="$emit('left', Direction.Left)" class="flex-item">
        <span>
          <i class="fas fa-angle-left"></i>
        </span>
      </button>
      <div class="flex-item">
        <button :disabled="disabled" @click="$emit('up', Direction.Up)">
          <span>
            <i class="fas fa-angle-up"></i>
          </span>
        </button>
        <button :disabled="disabled" @click="$emit('down', Direction.Down)">
          <span>
            <i class="fas fa-angle-down"></i>
          </span>
        </button>
      </div>
      <button :disabled="disabled" @click="$emit('right', Direction.Right)" class="flex-item">
        <span>
          <i class="fas fa-angle-right"></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Direction } from '../modules/direction'
import Vue from 'vue'

export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      Direction
    }
  }
})
</script>

<style lang="scss" scoped>
.virtual-controller {
  width: 150px;
  margin: 0 auto;
  text-align: center;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;

  .flex-item, .flex-item button {
    width: 50px;
    height: 50px;
    background-color: #ddd;
    border: solid 1px #bbb;

    button {
      border: none;
      
      &:first-child {
        border-bottom: solid 1px #bbb;
      }
      height: 25px !important;
    }
  }
}
</style>