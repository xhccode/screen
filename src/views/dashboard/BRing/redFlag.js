/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-14 11:22:18
 * @FilePath: /visualization/src/Dashboard/BRing/redFlag.js
 */
import * as PIXI from 'pixi.js'
import image from './yingji.png'

export function makeRedFlag (text, x, y, scaleY) {
  const container = new PIXI.Container()
  container.position.set(x, y)
  container.scale.y = 1 / scaleY

  const flag = PIXI.Sprite.from(image)
  flag.scale.set(0.8, 0.8)
  flag.anchor.set(0.1, 0.96)
  flag.position.set(4, -82)
  container.addChild(flag)
  const style = new PIXI.TextStyle({
    fontSize: 17,
    fill: '#ffffff'
  })
  const basicText = new PIXI.Text(text, style)
  basicText.anchor.set(0.5, 0.5)
  basicText.position.set(32, -112)
  container.addChild(basicText)
  return container
}
