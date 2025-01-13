/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-14 10:19:02
 * @FilePath: /visualization/src/Dashboard/ARing/index.js
 */
import * as PIXI from 'pixi.js'

import image from './a_bg.png'

export function renderALayer (app) {
  const isoScalingContainer = new PIXI.Container()
  isoScalingContainer.position.set(
    app.screen.width / 2,
    app.screen.height / 2 - 300
  )

  const tag = PIXI.Sprite.from(image)
  tag.scale.set(0.7, 0.7)
  tag.anchor.set(0.5, 0.5)
  tag.position.set(0, 0)
  isoScalingContainer.addChild(tag)

  const style = new PIXI.TextStyle({
    fontSize: 40,
    fill: '#ffffff'
  })

  const basicText = new PIXI.Text('区中心', style)
  basicText.anchor.set(0.5, 0.5)
  basicText.position.set(0, -10)
  isoScalingContainer.addChild(basicText)

  app.stage.addChild(isoScalingContainer)
}
