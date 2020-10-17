interface Point {
  x: number;
  y: number;
}

class Touches {
  touchstart: Point = { x: -1, y: -1 } 
  touchmove: Point = { x: -1, y: -1 }
  touchend: Boolean = false
}

export class TouchController {
  protected element: Element
  protected handler: Function
  protected touches: Touches
  protected listener: EventListener
  protected touchTolerant: number

  public constructor ({
    element,
    handler,
    touchTolerant = 16
  }: {
    element: Element,
    handler: Function,
    touchTolerant?: number
  }) {
    this.touches = new Touches()
    this.element = element
    this.handler = handler
    this.touchTolerant = touchTolerant
    this.listener = (evt: Event) => this.defaultListener(evt as TouchEvent)
    this.register()
  }

  public deregister (): void {
    const { element, listener } = this
    element.removeEventListener('touchstart', listener);
    element.removeEventListener('touchmove', listener);
    element.removeEventListener('touchcancel', listener);
    element.removeEventListener('touchend', listener);
  }

  protected register () {
    const { element, listener } = this

    this.deregister()

    element.addEventListener('touchstart', listener, false);
    element.addEventListener('touchmove', listener, false);
    element.addEventListener('touchcancel', listener, false);
    element.addEventListener('touchend', listener, false);
  }

  protected defaultListener (event: TouchEvent) {
    var touch;
    if (typeof event !== 'undefined'){	
      if (typeof event.touches !== 'undefined') {
        touch = event.touches[0];
        switch (event.type) {
          case 'touchstart':
            this.touches.touchstart.x = touch.pageX;
            this.touches.touchstart.y = touch.pageY;
            break;
          case 'touchmove':
            if (Math.abs(this.touches.touchstart.x - touch.pageX) < this.touchTolerant && Math.abs(this.touches.touchstart.y - touch.pageY) < this.touchTolerant) {
              return
            }
            this.touches.touchmove.x = touch.pageX;
            this.touches.touchmove.y = touch.pageY;
            this.handler(this.calculateRad({
              x: this.touches.touchstart.x,
              y: this.touches.touchstart.y,
            }, {
              x: this.touches.touchmove.x,
              y: this.touches.touchmove.y,
            }))
            this.touches.touchstart.x = touch.pageX
            this.touches.touchstart.y = touch.pageY
            break;
          case 'touchend':
            this.touches.touchend = true;
            break;
          default:
            break;
        }
      }
    }
  }

  protected calculateRad (point1: Point, point2: Point): number {
    const x2n = point2.x - point1.x
    const y2n = point2.y - point1.y
    const isQ4 = x2n < 0 && y2n >= 0
    const isQ3 = x2n >= 0 && y2n >= 0
    const isQ2 = x2n >= 0 && y2n < 0
    const isQ1 = x2n < 0 && y2n < 0
    const x2nAbs = Math.abs(x2n)
    const y2nAbs = Math.abs(y2n)

    const atan = Math.atan(y2nAbs / x2nAbs)

    let rad = 0

    if (isQ1) {
      rad = atan
    } else if (isQ2) {
      rad = Math.PI - atan
    } else if (isQ3) {
      rad = Math.PI + atan
    } else if (isQ4) {
      rad = (2 * Math.PI) - atan
    }

    return rad
  }
}
