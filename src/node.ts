import { Vector2 } from 'three'

export class node {
  baseRange: number;
  angle: number;
  center: Vector2;
  private _range: number = 0;
  constructor(baseRange: number, angle: number, center: Vector2) {
    this.baseRange = baseRange;
    this.angle = angle;
    this.center = center;
  }
  public get positionA() {
    const range = this._range + this.baseRange;
    const x = Math.cos(this.angle * Math.PI / 180) * range;
    const y = Math.sin(this.angle * Math.PI / 180) * range;
    return new Vector2(this.center.x + x, this.center.y + y);
  }
  public get positionB() {
    const range = this._range * -1 + this.baseRange;
    const x = Math.cos(this.angle * Math.PI / 180) * range;
    const y = Math.sin(this.angle * Math.PI / 180) * range;
    return new Vector2(this.center.x + x, this.center.y + y);
  }
  public set strength(newStrength: number) {
    const theStrength = newStrength;
    const lastStrength = theStrength;
    const targetRange = Math.max(theStrength - lastStrength, 0);
    if (targetRange > this._range) this._range = targetRange;
  }
  public transition(delay: number) {
    this._range = Math.max(this._range - delay * this._range * 5, 0);
  }
}
