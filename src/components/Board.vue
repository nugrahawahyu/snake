<template>
  <div class="board">
    <ul class="flex" v-for="(row, y) of board" :key="y">
      <li class="flex-item" v-for="(tile, x) of row" :key="x" :class="{ active: tile.role === Role.active, food: tile.role === Role.food }">
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Coordinate } from '../modules/coordinate'

export enum Role {
  active,
  food,
  empty
}

class Tile {
  public status: Boolean
  public coordinate: Coordinate
  public role: Role

  public constructor ({ coordinate, status, role }: { coordinate: Coordinate, status: Boolean, role: Role }) {
    this.status = status
    this.coordinate = coordinate
    this.role = role
  }
}

export default Vue.extend({
  data () {
    const board  = new Array(17)
    for (let i = 0; i < board.length; i++) {
      board[i] = new Array(17)
    }

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        board[y][x] = new Tile({
          status: false,
          role: Role.empty,
          coordinate: new Coordinate(x, y)
        })
      }
    }

    return {
      board,
      Role
    }
  },
  methods: {
    setTileRole (coordinate: Coordinate, role: Role) {
      const board = this.board
      const { positionX, positionY } = coordinate
      const tile: Tile = board[positionY][positionX]
      const oldRole = tile.role
      tile.role = role
      if (oldRole === Role.food) {
        this.$emit('eat', coordinate)
      }
    },
    emptyAllTiles () {
      const board = this.board
      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          board[y][x].role = Role.empty
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.board {
  margin: 0 auto;
  width: calc(100vw - 16px);
  height: calc(100vw - 16px);

  @media screen and (min-width: 800px){
    margin: 0 auto;
    max-width: calc(17 * 25px);
    max-height: calc(17 * 25px);
  }
}

.flex {
  display: flex;
  height: calc(100% / 17);
}

.flex-item {
  width: calc(100% / 17);
  height: 100%;
  flex-direction: column;
  background-color: #eee;
  border: solid 1px #add8e6;

  &.active {
    background-color: green;
  }

  &.food {
    background-color: red;
  }
}
</style>
