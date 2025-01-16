import * as PIXI from 'pixi.js'
import { makeBRingTag } from './bRingTag'
import { makeActiveBRingTag } from './activeTag'
import { calcCoordinate } from '../utils/calcCoordinate'

import { zipWith } from 'ramda'
import { makeBlueFlag } from './blueFlag'
import { makeShortBlueFlag } from './shortBlueFlag'
import { makeGreenFlag } from './greenFlag'
import { makeYellowFlag } from './yellowFlag'
import { makeRedFlag } from './redFlag'

let list = [
  {
    text: '锡北镇',
    active: false,
    orgCode: '320205106000'
  },
  {
    text: '羊尖镇',
    active: false,
    orgCode: '320205102000'
  },
  {
    text: '东港镇',
    active: false,
    orgCode: '320205107000'
  },
  {
    text: '安镇',
    active: false,
    orgCode: '320205002000'
  },
  {
    text: '厚桥街道',
    active: true,
    orgCode: '320205005000'
  },
  {
    text: '鹅湖镇',
    active: false,
    orgCode: '320205104000'
  },
  {
    text: '东北塘街道',
    active: false,
    orgCode: '320205003000'
  },
  {
    text: '云林街道',
    active: false,
    orgCode: '320205004000'
  },
  {
    text: '东亭街道',
    active: false,
    orgCode: '320205001000'
  }
]
let isoScalingContainer
export function renderBLayer (app, scaleY, drawAxis, router, orgCode) {
  if (isoScalingContainer) {
    isoScalingContainer.removeChildren(0)
  } else {
    isoScalingContainer = new PIXI.Container()
  }

  isoScalingContainer.scale.y = scaleY
  isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2 - 100)

  const isometryPlane = new PIXI.Graphics()
  isometryPlane.rotation = Math.PI / 4
  isoScalingContainer.addChild(isometryPlane)

  if (drawAxis) {
    isometryPlane.lineStyle(2, 0x555555)
    for (let i = -400; i <= 400; i += 15) {
      isometryPlane.moveTo(-400, i)
      isometryPlane.lineTo(400, i)
      isometryPlane.moveTo(i, -400)
      isometryPlane.lineTo(i, 400)
    }
  }

  // #00d677
  isometryPlane.lineStyle(4, 0x00d677)
  isometryPlane.drawCircle(0, 0, 400)

  // #faa40c
  isometryPlane.lineStyle(4, 0xfaa40c)
  isometryPlane.drawCircle(0, 0, 385)

  // #f80000
  isometryPlane.lineStyle(4, 0xf80000)
  isometryPlane.drawCircle(0, 0, 370)

  isometryPlane.lineStyle(100, 0x00a6f3, 0.2)
  isometryPlane.drawCircle(0, 0, 280)
  isometryPlane.lineStyle(4, 0x00a6f3, 0.8)
  isometryPlane.drawCircle(0, 0, 330)

  // #00a6f3
  isometryPlane.lineStyle(4, 0x00a6f3, 0.5)
  isometryPlane.drawCircle(0, 0, 230)

  const blueFlag1 = makeBlueFlag('行政审批', 0, 230, scaleY)
  const blueFlag2 = makeShortBlueFlag('教育', 230, 0, scaleY)
  const blueFlag3 = makeShortBlueFlag('交通', 0, -230, scaleY)
  const blueFlag4 = makeShortBlueFlag('卫健', -230, 0, scaleY)
  const greenFlag = makeGreenFlag('环保', 0, 400, scaleY)
  const yellowFlag = makeYellowFlag('城管', -385, 0, scaleY)
  const redFlag = makeRedFlag('应急', 370, 0, scaleY)
  isometryPlane.addChild(blueFlag1)
  isometryPlane.addChild(blueFlag2)
  isometryPlane.addChild(blueFlag3)
  isometryPlane.addChild(blueFlag4)
  isometryPlane.addChild(greenFlag)
  isometryPlane.addChild(yellowFlag)
  isometryPlane.addChild(redFlag)

  const tagList = zipWith((x, y) => ({ text: x.text, position: y, active: x.active, orgCode: x.orgCode }), list, calcCoordinate(list.length, 330)).map(item =>
    item.orgCode == orgCode ? makeActiveBRingTag(item.text, item.position.x, item.position.y, scaleY) : makeBRingTag(item.text, item.position.x, item.position.y, scaleY)
  )
  const mouseon = () => {
    ticker.stop()
  }
  const mouseout = () => {
    ticker.start()
  }
  const onClick = item => {
    if (item.orgCode != '320205005000') return
    router.push('/datahome')
  }
  const onDbClick = item => {
    if (item.orgCode != '320205005000') return
    router.push('/datahome')
  }
  tagList.forEach((item, index) => {
    isometryPlane.addChild(item)
    item.on('click', () => onClick(list[index]))
    item.on('dbclick', () => onDbClick(list[index]))
    item.on('mouseover', mouseon)
    item.on('mouseout', mouseout)
  })

  let step = 0

  app.ticker.add(delta => {
    step += delta
  })
  let ticker = app.ticker.add(() => {
    isometryPlane.rotation = step * 0.002
    blueFlag1.rotation = -step * 0.002
    blueFlag2.rotation = -step * 0.002
    blueFlag3.rotation = -step * 0.002
    blueFlag4.rotation = -step * 0.002
    greenFlag.rotation = -step * 0.002
    yellowFlag.rotation = -step * 0.002
    redFlag.rotation = -step * 0.002
    tagList.forEach(item => {
      item.rotation = -step * 0.002
    })
  })

  app.stage.addChild(isoScalingContainer)
}
