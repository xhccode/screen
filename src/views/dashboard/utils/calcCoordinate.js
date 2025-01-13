/*
 * @LastEditors: xander.kang
 * @LastEditTime: 2021-05-13 15:12:42
 * @FilePath: /visualization/src/Dashboard/calcCoordinate.js
 */
export function calcCoordinate (n, r) {
  let angle = (2 * Math.PI) / n
  let startAngle = -Math.PI

  var coors = []
  for (let i = 0; i < n; i++) {
    let dx = Math.sin(startAngle + i * angle)
    let dy = Math.cos(startAngle + i * angle)

    let x1 = dx * r
    let y1 = dy * r

    coors[i] = { x: x1, y: y1 }
  }
  return coors
}
