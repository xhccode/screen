/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-14 10:24:06
 * @FilePath: /visualization/src/Dashboard/CRing/index.js
 */
import * as PIXI from 'pixi.js'

import { zipWith } from 'ramda'

import { makeBRingTag } from './cRingTag'
import { calcCoordinate } from '../utils/calcCoordinate'

let list = ['厚桥社区', '南桥头村', '年余村', '太芙村', '新联村', '新厚桥村', '嵩山村', '中东村', '谢埭荡村']
let isoScalingContainer
export function renderCLayer (app, scaleY, drawAxis, lists) {
  list = lists || list
  if (isoScalingContainer) {
    isoScalingContainer.removeChildren(0)
  } else {
    isoScalingContainer = new PIXI.Container()
  }
  isoScalingContainer.scale.y = scaleY
  isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2 + 50)

  const isometryPlane = new PIXI.Graphics()
  isometryPlane.rotation = Math.PI / 4
  // isometryPlane.rotation = 0
  isoScalingContainer.addChild(isometryPlane)

  if (drawAxis) {
    isometryPlane.lineStyle(2, 0x555555)
    for (let i = -500; i <= 500; i += 15) {
      isometryPlane.moveTo(-500, i)
      isometryPlane.lineTo(500, i)
      isometryPlane.moveTo(i, -500)
      isometryPlane.lineTo(i, 500)
    }
  }

  // #00d677
  isometryPlane.lineStyle(6, 0x00a6f3)
  isometryPlane.drawCircle(0, 0, 450)
  isometryPlane.lineStyle(300, 0x006394, 0.2)
  isometryPlane.drawCircle(0, 0, 300)

  const tagList = zipWith((x, y) => ({ text: x, position: y }), list, calcCoordinate(list.length, 450)).map(item => makeBRingTag(item.text, item.position.x, item.position.y, scaleY))
  tagList.forEach(item => {
    isometryPlane.addChild(item)
  })

  let step = 0

  app.ticker.add(delta => {
    step += delta
  })
  app.ticker.add(() => {
    isometryPlane.rotation = step * 0.0015
    tagList.forEach(item => {
      item.rotation = -step * 0.0015
    })
  })

  app.stage.addChild(isoScalingContainer)
}
