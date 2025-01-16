import * as PIXI from 'pixi.js'
import image from './active-tag.png'
import arrowImg from './active-arrow.png'

export function makeActiveBRingTag (text, x, y, scaleY) {
  const tagContainer = new PIXI.Container()
  tagContainer.position.set(x, y)
  tagContainer.scale.y = 1 / scaleY

  const tag = PIXI.Sprite.from(image)
  const arrow = PIXI.Sprite.from(arrowImg)
  tag.scale.set(1, 1)
  tag.anchor.set(0.5, 0.84)
  arrow.anchor.set(0.5, 0.5)
  arrow.scale.set(0.6, 0.6)
  arrow.position.set(0, -110)
  tagContainer.addChild(tag)
  tagContainer.addChild(arrow)
  const style = new PIXI.TextStyle({
    fontSize: 22,
    fill: '#ffffff',
    fontWeight: 'bold'
  })
  const basicText = new PIXI.Text(text, style)
  basicText.anchor.set(0.5, 0.5)
  basicText.position.set(0, -64)
  tagContainer.addChild(basicText)
  tagContainer.interactive = true
  tagContainer.buttonMode = true
  return tagContainer
}
