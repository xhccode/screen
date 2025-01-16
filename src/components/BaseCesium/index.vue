<template>
  <div ref="MapWrapper" class="map-wrapper">
    <!-- 地图容器 -->
    <div id="MapContainer" class="base-map" :style="{ width: '100%' }">

    </div>
  </div>
</template>

<script>
import mapBaseMixin from './mixins/mapBaseMixin'
import mapEventMixin from './mixins/mapEventMixin'
import mapLayerManager from './mixins/mapLayerManager'

let lonLatArr = []
export default {
  name: 'BaseMap',
  mixins: [mapBaseMixin, mapEventMixin, mapLayerManager],
  components: {},
  data() {
    return {

    }
  },
  async mounted() {

  },
  computed: {

  },
  beforeDestroy() {
  },
  // 监听,当路由发生变化的时候关闭框选界面
  watch: {
    $route: {
      handler: function(val, oldVal){
        if(val.name!=oldVal.name){
           this.removeRect();
        }
      },
      // 深度监听
      deep: true
    }
  },
  methods: {
    //复位(需验证重写)
    resetBtn() {
      //关闭二三维切换
      if (this.dimensionShowFlag) {
        this.switchDimension()
      }
      //关闭经纬网
      if (this.lonlatShowFlag) {
        this.handleLonLat()
      }
      //关闭罗盘
      if (this.navigationCesiumShowFlag) {
        this.navigationCesium()
      }
      //关闭鹰眼图
      if (this.hawkEyeMapShowFlag) {
        this.hawkEyeMapBtn()
      }
      //关闭热点列表
      if (this.handleHotShowFlag) {
        this.handleHotList()
      }
      this.showRollerShutter = false //关闭卷帘
      this.layerManagerShowFlag = false //关闭图层管理
      this.clearAllLayers() //清除所有图层
      this.layerLegendShowFlag = false //图例隐藏
      this.searchAttribute = false //关闭查询属性
      //判断是否有弹窗
      if (this.bubbles) {
        this.bubbles.windowClose()
        // 根据ID删除
        viewer.entities.removeById('001')
      }
      //飞行到起始位置
      this.flyTo(120.03377824080187, 31.559806024017824, 150000)
    },
    //清除事件
    clearHandler() {
      let _self = this
      if (_self.handler) {
        _self.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        _self.handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL)
      }
      if (_self.handler1) {
        _self.handler1.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        _self.handler1.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL)
      }
    },
    //比例尺、罗盘、缩放
    navigationCesium() {
      this.navigationCesiumShowFlag = !this.navigationCesiumShowFlag
      if (this.navigationCesiumShowFlag) {
        viewer.extend(Cesium.viewerCesiumNavigationMixin, {
          enableCompass: true, //罗盘
          enableZoomControls: true, //缩放
          enableDistanceLegend: true, //比例尺
          enableCompassOuterRing: true //指南针外环
        })
      } else {
        viewer.cesiumNavigation.destroy()
      }
    },
    // 二三维切换
    switchDimension() {
      const status = viewer.scene.mode === Cesium.SceneMode.SCENE3D
      if (status) {
        this.dimensionShowFlag = true
        viewer.scene.mode = Cesium.SceneMode.SCENE2D
      } else {
        this.dimensionShowFlag = false
        viewer.scene.mode = Cesium.SceneMode.SCENE3D
      }
    },
    // 经纬网
    handleLonLat() {
      if (lonLatArr.length) {
        this.lonlatShowFlag = false
        lonLatArr.forEach((entity) => viewer.entities.remove(entity))
        lonLatArr = []
        return
      }
      this.lonlatShowFlag = true
      if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
        //判断是否支持图像渲染像素化处理
        viewer.resolutionScale = window.devicePixelRatio
      }
      //开启抗锯齿
      viewer.scene.fxaa = true
      viewer.scene.postProcessStages.fxaa.enabled = true

      const entities = viewer.entities
      for (let lang = -180; lang <= 180; lang += 20) {
        let text = ''
        if (lang === 0) {
          text = '0'
        }
        text += lang === 0 ? '' : '' + lang + '°'
        if (lang === -180) {
          text = ''
        }

        const entity = entities.add({
          position: Cesium.Cartesian3.fromDegrees(lang, 0),
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
              lang,
              -90,
              lang,
              0,
              lang,
              90
            ]),
            width: 1.0,
            material: Cesium.Color.WHITE
          },
          label: {
            text: text,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            font: '12px sans-serif',
            fillColor: Cesium.Color.WHITE
          }
        })
        lonLatArr.push(entity)
      }

      //纬度
      let langS = []
      for (let lang = -180; lang <= 180; lang += 5) {
        langS.push(lang)
      }

      //每隔10读绘制一条纬度线和纬度标注
      for (let lat = -80; lat <= 80; lat += 10) {
        let text = ''
        text += '' + lat + '°'
        if (lat === 0) {
          text = ''
        }
        const entity = entities.add({
          position: Cesium.Cartesian3.fromDegrees(0, lat),
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(
              langS
                .map((long) => {
                  return [long, lat].join(',')
                })
                .join(',')
                .split(',')
                .map((item) => Number(item))
            ),
            width: 1.0,
            material: Cesium.Color.WHITE
          },
          label: {
            text: text,
            font: '12px sans-serif',
            fillColor: Cesium.Color.WHITE
          }
        })
        lonLatArr.push(entity)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#MapContainer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* z-index: 1; */
}
</style>
