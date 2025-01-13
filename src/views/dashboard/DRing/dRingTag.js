/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-13 16:02:18
 * @FilePath: /visualization/src/Dashboard/dRingTag.js
 */
import * as PIXI from 'pixi.js'
import tagImg from './d_tag.png'

export function makeBRingTag (text, x, y, scaleY) {
  const tagContainer = new PIXI.Container()
  tagContainer.position.set(x, y)
  tagContainer.scale.y = 1 / scaleY

  const tag = PIXI.Sprite.from(tagImg)
  tag.scale.set(0.6, 0.6)
  tag.anchor.set(0.5, 0.76)
  tagContainer.addChild(tag)
  const style = new PIXI.TextStyle({
    fontSize: 12,
    fill: '#ffffff'
  })
  const basicText = new PIXI.Text(text, style)
  basicText.anchor.set(0.5, 0.5)
  basicText.position.set(0, -42)
  tagContainer.addChild(basicText)
  return tagContainer
}
