<template>
  <div>
    <header class="container">
      <div class="content">
        <div>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="#f44336" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.2575 4.5C3.9225 2.655 6.3225 1.5 9 1.5C11.6775 1.5 14.085 2.6625 15.7425 4.5L9 16.5L2.2575 4.5ZM4.1325 4.77L9 13.44L13.8675 4.77C12.51 3.6375 10.785 3 9 3C7.215 3 5.49 3.6375 4.1325 4.77ZM6.75 4.125C6.1275 4.125 5.625 4.6275 5.625 5.25C5.625 5.8725 6.1275 6.375 6.75 6.375C7.3725 6.375 7.875 5.8725 7.875 5.25C7.875 4.6275 7.365 4.125 6.75 4.125ZM9 10.875C8.3775 10.875 7.875 10.3725 7.875 9.75C7.875 9.1275 8.385 8.625 9 8.625C9.615 8.625 10.125 9.1275 10.125 9.75C10.125 10.3725 9.615 10.875 9 10.875Z" fill="#f44336" fill-opacity="0.54"/>
          </svg>
          <span style="margin-left: 8px;">{{ score }}</span>
        </div>
        <div>
          <span style="color: #333">{{ config.text }}</span>
        </div>
      </div>
    </header>
    <main>
      <Board ref="board" @eat="eat" />
      <div style="position: fixed; bottom: 0; left: 0; right: 0; margin-bottom: 24px;">
        <VirtualController
          v-if="platform === Platform.mobile"
          :disabled="isGameOver"
          @up="checkVirtualKey"
          @down="checkVirtualKey"
          @left="checkVirtualKey"
          @right="checkVirtualKey"
        />
      </div>
    </main>
    <Modal v-if="showNewGameModal">
      <div class="modal-content">
        <div class="text-center modal-item">
          <h2>Welcome</h2>
        </div>
        <div class="modal-item">
          <div class="info-container">
            <div>
              Difficulty: 
            </div>
            <select name="size" v-model="config">
              <option v-for="(config, i) in configs" v-bind:value="config" :key="i" >
                {{ config.text }}
              </option>
            </select>
          </div>
          <div class="info-container">
            <div>
              Goal:
            </div>
            <div>
              Eat as much as you can
            </div>
          </div>
          <div class="info-container">
            <div>
              Nagivation:
            </div>
            <div>
              Arrow keys
            </div>
          </div>
        </div>
        <div class="modal-action">
          <button ref="startButton" @click="restart">Got it</button>
        </div>
      </div>
    </Modal>
    <Modal v-if="showGameOverModal">
      <div class="modal-content">
        <div class="text-center modal-item">
          <span>Game Over</span>
        </div>
        <div class="text-center modal-item">
          <h2>Score: {{ score }}</h2>
        </div>
        <div class="text-center modal-item">
          Highest score: {{ highestScore }}
        </div>
        <div class="text-center modal-item">
          Difficulty: {{ config.text }}
        </div>
        <div class="modal-action">
          <button ref="restartButton" @click="openWelcomeScreen">Play again</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BodyFragment, Snake } from './modules/snake'
import { Direction } from './modules/direction'
import { Coordinate } from './modules/coordinate'
import Board, { Role } from './components/Board.vue'
import VirtualController from './components/VirtualController.vue'
import Modal from './components/Modal.vue'

const BOARD_WIDTH = 17
const BOARD_HEIGHT = 17
const HIGHEST_SCORE_CACHE_KEY = 'highestScore'

enum Platform {
  desktop,
  mobile
}

interface BoardInterface {
  setTileRole(coordinate: Coordinate, role: Role): void;
  emptyAllTiles(): void;
}

class Config {
  public text: string
  public interval: number

  constructor (text: string, interval: number) {
    this.text = text
    this.interval = interval
  }
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
  }
}

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    // eslint-disable-next-line no-useless-escape
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

export default Vue.extend({
  components: {
    Board,
    Modal,
    VirtualController
  },
  data () {
    const configs = [
      new Config('Easy', 200),
      new Config('Medium', 100),
      new Config('Hard', 50),
    ]
    return {
      configs,
      config: configs[1],
      Platform,
      score: 0,
      isGameOver: false,
      checkKey: undefined as Function | undefined,
      highestScore: 0,
      showGameOverModal: false,
      showNewGameModal: true,
      interval: undefined as number | undefined,
      activeCoordinates: [] as Coordinate[],
      foodCoordinates: [] as Coordinate[],
      snake: undefined as Snake | undefined
    }
  },
  computed: {
    platform () {
      return isMobile ? Platform.mobile : Platform.desktop
    },
  },
  mounted () {
    this.openWelcomeScreen()
  },
  methods: {
    openWelcomeScreen () {
      this.showGameOverModal = false
      this.showNewGameModal = true
      this.$nextTick(() => {
        const startButton = this.$refs.startButton as HTMLElement
        startButton.focus()
      })
    },
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
      const highestScore = parseInt(localStorage.getItem(HIGHEST_SCORE_CACHE_KEY) as string) || 0;
      const score = this.score
      if (score > highestScore) {
        this.highestScore = score
        localStorage.setItem(HIGHEST_SCORE_CACHE_KEY, String(score))
      }
      clearInterval(this.interval)
      // @ts-ignore
      document.removeEventListener('keydown', this.checkKey);
      this.isGameOver = true
      setTimeout(() => {
        this.showGameOverModal = true
        this.$nextTick(() => {
          const restartButton = this.$refs.restartButton as HTMLElement
          restartButton.focus()
        })
      }, 500)
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
      this.isGameOver = false
      this.checkKey = checkKey
      this.showNewGameModal = false
      this.score = 0
      this.highestScore = parseInt(localStorage.getItem(HIGHEST_SCORE_CACHE_KEY) as string) || 0;
      this.showGameOverModal = false
      this.snake = snake
      this.foodCoordinates = []
      this.activeCoordinates = snake.getBodyFragmentPositions()
      this.activeCoordinates.forEach((coordinate: Coordinate) => {
        board.setTileRole(coordinate, Role.active)
      })
      board.emptyAllTiles()
      this.interval = setInterval(() => {
        this.appLog()
        const oldHead = snake.getHead()
        const oldTail = snake.getTail()
        const [head, tail] = snake.tick()
        if (this.checkIfIsValidHeadPosition(head)) {
          if (oldTail.coordinate.positionX >= 0 && oldTail.coordinate.positionY >= 0 && oldTail.coordinate.positionX < BOARD_WIDTH && oldTail.coordinate.positionY < BOARD_HEIGHT) {
            board.setTileRole(oldTail.coordinate, Role.empty)
          } else {
            // eslint-disable-next-line no-console
            console.log('TODO: fix this error')
            // eslint-disable-next-line no-console
            console.log({ errorContext: { oldTail, head, tail }})
          }
          board.setTileRole(oldHead.coordinate, Role.active)
          board.setTileRole(tail.coordinate, Role.tail)
          board.setTileRole(head.coordinate, Role.head)
          this.activeCoordinates = snake.getBodyFragmentPositions()
        } else {
          this.endGame()
        }
      }, this.config.interval)

      const foodCoordinate = this.spawnFoods()
      document.addEventListener('keydown', checkKey)
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
    checkVirtualKey (direction: Direction): void {
      const snake = this.snake as Snake
      snake.setDirection(direction)
    },
    appLog () {
      if (process.env.DEBUG) {
      // eslint-disable-next-line no-console
        console.log(JSON.stringify({
          foodPositions: this.foodCoordinates.map(c => `(${c.positionX},${c.positionY})`)
        }))
      }
    }
  }
})
</script>

<style lang="scss" scoped>
header {
  background-color: #ddd;
}

svg, span {
  vertical-align: middle;
  display: inline-block;
}

.container {
  margin: 0 auto;
  width: calc(100vw - 16px);

  @media screen and (min-width: 800px){
    margin: 0 auto;
    max-width: calc(17 * 25px);
  }
}

.content {
  display: flex;
  justify-content: space-between;
  padding: 16px 8px;
}

.text-center {
  text-align: center;
}

.modal-action {
  padding-top: 24px;
  text-align: center;
}

.modal-content {
  padding: 16px;
}

.modal-item {
  flex-direction: row;
}

.info-container {
  display: flex;
  justify-content: space-between;
}
</style>
