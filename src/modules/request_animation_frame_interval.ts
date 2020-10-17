export class RequestAnimationFrameInterval {
  protected start: number
  protected isStop: boolean = false
  
  public constructor (callback: Function, delay: number) {
    this.start = Date.now()
    const requestAnimation = window.requestAnimationFrame
    const intervalFunc = () => {
      Date.now() - this.start < delay || (this.start += delay, callback());
      this.isStop || requestAnimation(intervalFunc)
    }
    requestAnimation(intervalFunc);
  }

  public stop (): void {
    this.isStop = true
  }
}
