<template>
  <div class="virtual-controller">
    <div class="flex">
      <button :disabled="disabled" @click="$emit('left', Direction.Left)" class="flex-item">
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 7L9.5 12L14.5 17V7Z" fill="black" fill-opacity="0.54"/>
          </svg>
        </span>
      </button>
      <div class="flex-item">
        <button :disabled="disabled" @click="$emit('up', Direction.Up)">
          <span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14.5L12 9.5L17 14.5H7Z" fill="black" fill-opacity="0.54"/>
            </svg>
          </span>
        </button>
        <button :disabled="disabled" @click="$emit('down', Direction.Down)">
          <span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 9.5L12 14.5L17 9.5H7Z" fill="black" fill-opacity="0.54"/>
            </svg>
          </span>
        </button>
      </div>
      <button :disabled="disabled" @click="$emit('right', Direction.Right)" class="flex-item">
        <span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 17L14.5 12L9.5 7V17Z" fill="black" fill-opacity="0.54"/>
          </svg>
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