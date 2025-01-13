/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-14 11:22:36
 * @FilePath: /visualization/src/Dashboard/BRing/blueFlag.js
 */
import * as PIXI from 'pixi.js'
import arrow from './blue-flag.png'

export function makeBlueFlag (text, x, y, scaleY) {
  const container = new PIXI.Container()
  container.position.set(x, y)
  container.scale.y = 1 / scaleY

  const flag = PIXI.Sprite.from(arrow)
  flag.scale.set(0.6, 0.6)
  flag.anchor.set(0.1, 0.96)
  container.addChild(flag)
  const style = new PIXI.TextStyle({
    fontSize: 16,
    fill: '#ffffff'
  })
  const basicText = new PIXI.Text(text, style)
  basicText.anchor.set(0.5, 0.5)
  basicText.position.set(35, -52)
  container.addChild(basicText)
  return container
}
