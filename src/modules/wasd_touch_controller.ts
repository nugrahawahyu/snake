import { TouchController } from '@/modules/touch_controller'
import { Direction } from '@/modules/direction'

export class WasdTouchController {
  protected touchController: TouchController

  public constructor ({ 
    element,
    handler,
    totalDirection
  }: {
    element: Element,
    handler: Function,
    totalDirection: number
  }) {
    this.touchController = new TouchController({
      element,
      handler (rad: number) {
        const FULL_RAD = 2 * Math.PI

        let direction

        switch (totalDirection) {
          case 4:
            if (rad < FULL_RAD / 8 || rad > (7 * FULL_RAD) / 8) {
              direction = Direction.LEFT
            } else if (rad >= FULL_RAD / 8 && rad < (3 * FULL_RAD) / 8) {
              direction = Direction.UP
            } else if (rad >= (3 * FULL_RAD) / 8 && rad < (5 * FULL_RAD) / 8) {
              direction = Direction.RIGHT
            } else if (rad >= (5 * FULL_RAD) / 8 && rad < (7 * FULL_RAD) / 8) {
              direction = Direction.DOWN
            }
            break
          case 8:
            if (rad < FULL_RAD / 16 || rad > (15 * FULL_RAD) / 16) {
              direction = Direction.LEFT
            } else if (rad >= FULL_RAD / 16 && rad < (3 * FULL_RAD) / 16) {
              direction = Direction.UP_LEFT
            } else if (rad >= (3 * FULL_RAD) / 16 && rad < (5 * FULL_RAD) / 16) {
              direction = Direction.UP
            } else if (rad >= (5 * FULL_RAD) / 16 && rad < (7 * FULL_RAD) / 16) {
              direction = Direction.UP_RIGHT
            } else if (rad >= (7 * FULL_RAD) / 16 && rad < (9 * FULL_RAD) / 16) {
              direction = Direction.RIGHT
            } else if (rad >= (9 * FULL_RAD) / 16 && rad < (11 * FULL_RAD) / 16) {
              direction = Direction.DOWN_RIGHT
            } else if (rad >= (11 * FULL_RAD) / 16 && rad < (13 * FULL_RAD) / 16) {
              direction = Direction.DOWN
            } else if (rad >= (13 * FULL_RAD) / 16 && rad < (15 * FULL_RAD) / 16) {
              direction = Direction.DOWN_LEFT
            }
            break
          default:
            throw new Error('invalid totalDirection')
        }

        handler(direction)
      }
    })
  }

  public deregister (): void {
    this.touchController.deregister()
  }
}
