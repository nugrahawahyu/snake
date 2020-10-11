<template>
  <main>
    <Board ref="board" @eat="eat" />
    <Modal v-if="showModal">
      <div class="modal-content">
        <div class="text-center modal-item">
          <h2>Game Over</h2>
        </div>
        <div class="text-center modal-item">
          Score: {{ score }}
        </div>
        <div class="text-center modal-item">
          Highest score: {{ highestScore }}
        </div>
        <div class="modal-action">
          <button @click="restart">Play again</button>
        </div>
      </div>
    </Modal>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { BodyFragment, Snake } from './modules/snake'
import { Direction } from './modules/direction'
import { Coordinate } from './modules/coordinate'
import Board, { Role } from './components/Board.vue'
import Modal from './components/Modal.vue'

const BOARD_WIDTH = 17
const BOARD_HEIGHT = 17

interface BoardInterface {
  setTileRole(coordinate: Coordinate, role: Role): void;
  emptyAllTiles(): void;
}

function checkKeyFactory (snake: Snake) {
  return function checkKey(e: KeyboardEvent) {
    if (e.keyCode === 38) {
      snake.setDirection(Direction.Up)
    }
    else if (e.keyCode === 40) {
      snake.setDirection(Direction.Down)
    }
    else if (e.keyCode === 37) {
      snake.setDirection(Direction.Left)
    }
    else if (e.keyCode === 39) {
      snake.setDirection(Direction.Right)
    }
    snake.freezeSetDirection()
  }
}

export default Vue.extend({
  components: {
    Board,
    Modal
  },
  data () {
    return {
      score: 0,
      highestScore: 0,
      showModal: false,
      interval: undefined as number | undefined,
      activeCoordinates: [] as Coordinate[],
      foodCoordinates: [] as Coordinate[],
      snake: undefined as Snake | undefined
    }
  },
  mounted () {
    this.restart()
  },
  methods: {
    checkIfIsValidHeadPosition (head: BodyFragment): Boolean {
      const activeCoordinates: Coordinate[] = this.activeCoordinates
      const { coordinate } = head
      const isInBoardCoordinate = coordinate.positionX >=0 && coordinate.positionX < 17 && coordinate.positionY >= 0 && coordinate.positionY < 17
      const isNonActiveCoordinate = !activeCoordinates.find(c => c.positionX === coordinate.positionX && c.positionY === coordinate.positionY)
      return isInBoardCoordinate && isNonActiveCoordinate
    },
    endGame () {
      // eslint-disable-next-line no-console
      console.log('Game over')
      clearInterval(this.interval)
      document.onkeydown = null;
      this.showModal = true
    },
    restart () {
      const board = this.$refs.board as unknown as BoardInterface
      const snake = new Snake({ 
        initialSnakeHeadPositionX: 7,
        initialSnakeHeadPositionY: 7,
        direction: Direction.Right
      })
      const checkKey = checkKeyFactory(snake)
      snake.nextTick(() => {
        snake.unFreezeSetDirection()
      })
      this.score = 0
      this.showModal = false
      this.snake = snake
      this.foodCoordinates = []
      this.activeCoordinates = snake.getBodyFragmentPositions()
      this.activeCoordinates.forEach((coordinate: Coordinate) => {
        board.setTileRole(coordinate, Role.active)
      })
      board.emptyAllTiles()
      this.interval = setInterval(() => {
        this.appLog()
        const oldTail = snake.getTail()
        const [head, tail] = snake.tick()
        if (this.checkIfIsValidHeadPosition(head)) {
          board.setTileRole(oldTail.coordinate, Role.empty)
          board.setTileRole(head.coordinate, Role.active)
          this.activeCoordinates = snake.getBodyFragmentPositions()
        } else {
          this.endGame()
        }
      }, 100)

      const foodCoordinate = this.spawnFoods()
      document.onkeydown = checkKey;
    },
    spawnFoods (count = 1): Coordinate {
      const board = this.$refs.board as unknown as BoardInterface
      const foodCoordinates: Coordinate[] = this.foodCoordinates
      const activeCoordinates: Coordinate[] = this.activeCoordinates
      const positionX = Math.floor(Math.random() * BOARD_WIDTH)
      const positionY = Math.floor(Math.random() * BOARD_HEIGHT)

      for (let coordinate of foodCoordinates) {
        if (coordinate.positionX === positionX && coordinate.positionY === positionY) {
          return this.spawnFoods(count)
        }
      }

      for (let coordinate of activeCoordinates) {
        if (coordinate.positionX === positionX && coordinate.positionY === positionY) {
          return this.spawnFoods(count)
        }
      }

      const foodCoordinate = new Coordinate(positionX, positionY)
      foodCoordinates.push(foodCoordinate)
      board.setTileRole(foodCoordinate, Role.food)
      return foodCoordinate
    },
    eat (coordinate: Coordinate) {
      const snake: Snake | undefined = this.snake
      const foodCoordinates: Coordinate[] = this.foodCoordinates
      for (let i = 0; i < foodCoordinates.length; i++) {
        const foodCoordinate: Coordinate = foodCoordinates[i]
        if (snake && foodCoordinate.positionX === coordinate.positionX && foodCoordinate.positionY === coordinate.positionY) {
          snake.eat(1)
          this.score += 1
          foodCoordinates.splice(i, 1)
          this.spawnFoods(1)
        }
      }
    },
    appLog () {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify({
        foodPositions: this.foodCoordinates.map(c => `(${c.positionX},${c.positionY})`)
      }))
    }
  }
})
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}

.modal-action {
  padding-top: 24px;
  text-align: center;
}

.modal-item {
  flex-direction: row;
}
</style>
