<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Direction } from '@/modules/direction'
import { WasdTouchController } from '@/modules/wasd_touch_controller'

const defaultListener = () => {
  // eslint-disable-next-line no-console
  console.log('hahahaha')
}

export default Vue.extend({
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      touchController: new WasdTouchController({
        totalDirection: 4,
        element: document.documentElement,
        handler: (direction: Direction) => {
          if (this.disabled) return
          switch (direction) {
            case Direction.LEFT:
              this.$emit('action', Direction.LEFT)
              break
            case Direction.UP:
              this.$emit('action', Direction.UP)
              break
            case Direction.RIGHT:
              this.$emit('action', Direction.RIGHT)
              break
            case Direction.DOWN:
              this.$emit('action', Direction.DOWN)
              break
            default:
              break
          }
        }
      })
    }
  },
  mounted () {
    
  }
})
</script>

<style>

</style>
