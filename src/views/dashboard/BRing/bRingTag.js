import * as PIXI from 'pixi.js'
import arrow from './tag.jpg'

export function makeBRingTag (text, x, y, scaleY) {
  const tagContainer = new PIXI.Container()
  tagContainer.position.set(x, y)
  tagContainer.scale.y = 1 / scaleY

  const tag = PIXI.Sprite.from(arrow)
  tag.anchor.set(0.5, 0.84)
  tagContainer.addChild(tag)
  const style = new PIXI.TextStyle({
    fontSize: 16,
    fill: '#ffffff'
  })
  const basicText = new PIXI.Text(text, style)
  basicText.anchor.set(0.5, 0.5)
  basicText.position.set(0, -53)
  tagContainer.addChild(basicText)
  tagContainer.interactive = true
  tagContainer.buttonMode = true

  return tagContainer
}
