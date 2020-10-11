import { Direction } from './direction'
import { Coordinate } from './coordinate'

const INITIAL_SNAKE_LENGTH = 3

export class BodyFragment {
  public coordinate: Coordinate
  public next: BodyFragment | undefined

  public constructor ({ coordinate, next }: { coordinate: Coordinate, next: BodyFragment | undefined }) {
    this.coordinate = coordinate
    this.next = next
  }
}

export class Snake {
  protected head: BodyFragment
  protected direction: Direction
  protected nextTickHandlers: Function[] = []
  protected isSetDirectionAllowed: Boolean = true
  
  public constructor ({ direction, initialSnakeHeadPositionX, initialSnakeHeadPositionY }: { direction: Direction, initialSnakeHeadPositionX: number, initialSnakeHeadPositionY: number }) {
    this.direction = direction
    this.head = new BodyFragment({ coordinate: new Coordinate(initialSnakeHeadPositionX, initialSnakeHeadPositionY), next: undefined })
    this.eat(INITIAL_SNAKE_LENGTH - 1)
  }

  public tick (): BodyFragment[] {
    const { direction } = this
    const oldHead = this.getHead()
    let newHeadPositionX: number = 0
    let newHeadPositionY: number = 0
    switch (direction) {
      case Direction.Up:
        newHeadPositionX = oldHead.coordinate.positionX
        newHeadPositionY = oldHead.coordinate.positionY - 1
        break;
      case Direction.Down:
        newHeadPositionX = oldHead.coordinate.positionX
        newHeadPositionY = oldHead.coordinate.positionY + 1
        break;
      case Direction.Right:
        newHeadPositionX = oldHead.coordinate.positionX + 1
        newHeadPositionY = oldHead.coordinate.positionY
        break;
      case Direction.Left:
        newHeadPositionX = oldHead.coordinate.positionX - 1
        newHeadPositionY = oldHead.coordinate.positionY
        break;
      default:
        break;
    }
    const newHead = new BodyFragment({
      coordinate: new Coordinate(newHeadPositionX, newHeadPositionY),
      next: oldHead
    })

    const newTail = this.removeTail()
    this.head = newHead
    this.nextTickHandlers.forEach((handler) => {
      handler()
    })
    return [newHead, newTail]
  }

  public freezeSetDirection (): void {
    this.isSetDirectionAllowed = false
  }

  public unFreezeSetDirection (): void {
    this.isSetDirectionAllowed = true
  }

  public nextTick (handler: Function): void {
    this.nextTickHandlers.push(handler)
  }

  public setDirection (direction: Direction) {
    const currentDirection = this.direction
    if (!this.isSetDirectionAllowed) return
    switch (direction) {
      case Direction.Up:
        if (currentDirection === Direction.Down) return
        break;
      case Direction.Down:
        if (currentDirection === Direction.Up) return
        break;
      case Direction.Right:
        if (currentDirection === Direction.Left) return
        break;
      case Direction.Left:
        if (currentDirection === Direction.Right) return
        break;
      default:
        break;
    }
    this.direction = direction
  }

  public getHead (): BodyFragment {
    return this.head
  }

  public getTail (): BodyFragment {
    let node = this.head
    while (node.next) {
      node = node.next
    }
    return node
  }

  public removeTail (): BodyFragment {
    let node = this.head
    let parent = node
    while (node.next) {
      node = node.next
      if (node.next) {
        parent = node
      }
    }
    parent.next = undefined
    return parent
  }

  public getBodyFragmentPositions (): Coordinate[] {
    let node = this.head
    let position = [node.coordinate]
    while (node.next) {
      node = node.next
      position.push(node.coordinate)
    }
    return position
  }

  public eat (value: number, tail = this.getTail(), curr = 1): BodyFragment {
    if (value < 1) throw new Error('value must be greater than 0')
    if (curr <= value) {
      tail.next = new BodyFragment({
        coordinate: new Coordinate(tail.coordinate.positionX - 1, tail.coordinate.positionY),
        next: undefined
      })
      return this.eat(value, tail.next, curr + 1)
    }
    return tail
  }
}
