import * as PIXI from 'pixi.js'
import { zipWith, repeat } from 'ramda'

import { makeBRingTag } from './dRingTag'
import { calcCoordinate } from '../utils/calcCoordinate'

let list = [
  '王佳宇',
  '周骑程',
  '徐志栋',
  '乔晓东',
  '薛晓俊',
  '陆晔',
  '傅浩',
  '徐海涛',
  '陆晨星',
  '朱梦洁',
  '曹凯',
  '姚鑫',
  '邹增明',
  '陈一听',
  '钱科玮',
  '周天佑',
  '周其',
  '陈德华',
  '浦景宇',
  '浦世杰',
  '杨志刚',
  '浦一琛',
  '浦瑜',
  '俞锦涛',
  '刘伟',
  '荣凯',
  '浦杰',
  '陆春熙',
  '钱秋平',
  '曹辰年',
  '陈佳毅',
  '周英',
  '浦晓江',
  '朱强',
  '陆夏飞'
]
let isoScalingContainer
export function renderDLayer (app, scaleY, drawAxis, lists) {
  list = lists || list
  if (isoScalingContainer) {
    isoScalingContainer.removeChildren(0)
  } else {
    isoScalingContainer = new PIXI.Container()
  }

  isoScalingContainer.scale.y = scaleY
  isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2 + 150)

  const isometryPlane = new PIXI.Graphics()
  isometryPlane.rotation = Math.PI / 4
  // isometryPlane.rotation = 0
  isoScalingContainer.addChild(isometryPlane)

  if (drawAxis) {
    isometryPlane.lineStyle(2, 0x555555)
    for (let i = -600; i <= 600; i += 15) {
      isometryPlane.moveTo(-600, i)
      isometryPlane.lineTo(600, i)
      isometryPlane.moveTo(i, -600)
      isometryPlane.lineTo(i, 600)
    }
  }

  // #00d677
  isometryPlane.lineStyle(150, 0x00a6f3, 0.2)
  isometryPlane.drawCircle(0, 0, 550)

  isometryPlane.lineStyle(5, 0x00a6f3, 0.8)
  isometryPlane.drawCircle(0, 0, 560)

  isometryPlane.lineStyle(10, 0x00a6f3, 0.2)
  isometryPlane.drawCircle(0, 0, 610)

  isometryPlane.lineStyle(900, 0x00a6f3, 0.1)
  isometryPlane.drawCircle(0, 0, 3)

  const tagList = zipWith((x, y) => ({ text: x, position: y }), list, calcCoordinate(list.length, 560)).map(item => makeBRingTag(item.text, item.position.x, item.position.y, scaleY))
  tagList.forEach(item => {
    isometryPlane.addChild(item)
  })

  let step = 0

  app.ticker.add(delta => {
    step += delta
  })
  app.ticker.add(() => {
    isometryPlane.rotation = step * 0.002
    tagList.forEach(item => {
      item.rotation = -step * 0.002
    })
  })
  app.stage.addChild(isoScalingContainer)
}
