/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-14 11:22:45
 * @FilePath: /visualization/src/Dashboard/BRing/shortBlueFlag.js
 */
import * as PIXI from 'pixi.js'
import arrow from './short-blue-flag.png'

export function makeShortBlueFlag (text, x, y, scaleY) {
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
  basicText.position.set(21, -52)
  container.addChild(basicText)
  return container
}
