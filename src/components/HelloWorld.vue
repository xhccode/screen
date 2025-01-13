<template>
  <div>
    <div id="my-map"></div>
    <div class="btnBox">
      <el-button type="primary" @click="onStartEntity">开始1</el-button>
<!--      <el-button @click="onStartPimitive">开始2</el-button>-->
      <el-button type="primary" @click="onClear">清除</el-button>
      <el-button type="primary" @click="onStart">开始</el-button>
      <el-button type="primary" @click="onClear1">清除</el-button>
    </div>
  </div>
</template>

<script>
import RoadThroughLine from "@/utils/cesiumCtrl/roadThrough.js";
import { getGeojson } from "@/common/api/api.js";

let primitives = null;
let _dataSource = null;
const material = new RoadThroughLine(1000, "/images/spriteline.png");
const jsonUrl = "/json/qingdaoRoad.geojson";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {

    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YzQ5MDc1MC00NjI2LTQ0NzQtYTk5MC0xNGEzOTEzZDVmNTciLCJpZCI6Njg4ODYsImlhdCI6MTczNjMxNDUzNn0.1qS1yn2kTC5TLc6iw94zxFDOa6qTIs-dNWgqx2vtlog";
      window.viewer = new Cesium.Viewer('my-map',{
        homeButton:false,
        sceneModePicker:false,
        baseLayerPicker:false,// 影像切换
        animation:false,// 是否显示动画控件
        infoBox:false,// 是否显示点击要素之后显示的信息
        selectionIndicator:false,// 要素选中框
        geocoder:false,// 是否显示地名查找控件
        timeline:false,// 是否显示时间线控件
        fullscreenButton:false,
        shouldAnimate:true,
        scene3DOnly:true,// 每个几何实例以3D渲染，节省GPU内存
        navigationHelpButton:false,// 是否显示帮助信息控件
        contextOptions: {
          webgl: {
            alpha: true,
            depth: false,
            stencil: true,
            antialias: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: true,
          },
          allowTextureFilterAnisotropic: true,
        },
        // baseLayer: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
        //   url: "https://2.16.66.38:8092/xsTdtYx116png/{z}/{x}/{y}.png",
        //   minimumLevel: 7,
        //   maximumLevel: 15
        // })),
      })

      console.log(viewer.cesiumWidget.creditContainer)
      // 去掉logo
      viewer.cesiumWidget.creditContainer.style.display = "none";

      //设置背景透明去除无关要素，这一步也是必须的
      // viewer.scene.skyBox.show = false;
      // viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0);
      // viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
      // viewer.scene.globe.enableLighting = false;
      // viewer.scene.globe.translucency.backFaceAlpha = 0.0;
      // viewer.scene.globe.showGroundAtmosphere = false;
      // viewer.scene.imageryLayers.removeAll();
      // viewer.shadows = false;
      // viewer.scene.sun.show = false;
      // viewer.scene.moon.show = false;
      // viewer.scene.skyAtmosphere.show = false;
      // viewer.scene.fog.enable = false;
      // viewer.scene.globe.depthTestAgainstTerrain = true;

      //锁定初始视角
      // viewer.camera.setView({
      //   destination: Cesium.Cartesian3.fromDegrees(
      //       120.47212,
      //       31.61092,
      //       290000.0
      //   ),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(0.0), // east, default value is 0.0 (north)
      //     pitch: Cesium.Math.toRadians(-50), // default value (looking down)
      //     roll: 0.0, // default value
      //   },
      // });

      // this.onStart();
      // this.flyTo(120.03377824080187,31.559806024017824,150000);
      // let imgLayer = new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
      //   url: "https://2.16.66.38:8092/xsTdtYx116png/{z}/{x}/{y}.png",
      //   minimumLevel: 7,
      //   maximumLevel: 15
      // }));
      // viewer.imageryLayers.add(imgLayer);

      // 优化第一步
      //这是让你的画面以一个怎样的形式出现，相当于出场动画
      // viewer.camera.flyTo({
      //   // fromDegrees()方法，将经纬度和高程转换为世界坐标，这里定位到中国
      //   destination: Cesium.Cartesian3.fromDegrees(101.8, 33.74, 5000000),
      //   orientation: {
      //     // 指向
      //     // heading:Cesium.Math.toRadians(90,0),
      //     // 视角
      //     // pitch:Cesium.Math.toRadians(-90),
      //     roll: 0.0,
      //   },
      // });
      this.flyTo(120.03377824080187,31.559806024017824,120000)
    },
    //开场动画
    flyTo(lat,lon,n) {
      //无锡坐标
      // const lon = 31.559806024017824;
      // const lat = 120.03377824080187;
      // const n = 120000;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lat, lon, n),
        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
      });
    },
    onStartEntity(){
      let _dataSource = null;
      const material = new RoadThroughLine(1000, "/images/spriteline.png");
      // 道路闪烁线
      _dataSource = new Cesium.GeoJsonDataSource();
      _dataSource.load(jsonUrl).then(function (dataSource) {
        const entities = dataSource.entities.values;
        // 聚焦
        // viewer.zoomTo(entities);
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i];
          entity.polyline.width = 1.7;
          entity.polyline.material = material;
        }
      });
      viewer.dataSources.add(_dataSource);
      viewer.flyTo(_dataSource, { duration: 3 });
    },
    // async onStartPimitive(){
    //   const { res } = await getGeojson(jsonUrl);
    //   const { features } = res;
    //   const instance = [];
    //   if (features?.length) {
    //     features.forEach((item) => {
    //       const arr = item.geometry.coordinates;
    //       arr.forEach((el) => {
    //         let arr1 = [];
    //
    //         el.forEach((_el) => {
    //           arr1 = arr1.concat(_el);
    //         });
    //         const polyline = new Cesium.PolylineGeometry({
    //           positions: Cesium.Cartesian3.fromDegreesArray(arr1),
    //           width: 1.7,
    //           vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
    //         });
    //         const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    //         instance.push(
    //             new Cesium.GeometryInstance({
    //               geometry,
    //               // attributes: {
    //               //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED),
    //               // },
    //             })
    //         );
    //       });
    //     });
    //     console.log("-----instance-----", Cesium.Material.Spriteline1Source);
    //     let source = `czm_material czm_getMaterial(czm_materialInput materialInput)
    //                       {
    //                          czm_material material = czm_getDefaultMaterial(materialInput);
    //                          vec2 st = materialInput.st;
    //                          vec4 colorImage = texture(image, vec2(fract((st.s - speed * czm_frameNumber * 0.001)), st.t));
    //                          material.alpha = colorImage.a * color.a;
    //                          material.diffuse = colorImage.rgb * 1.5 ;
    //                          return material;
    //                       }`;
    //
    //     const material = new Cesium.Material({
    //       fabric: {
    //         uniforms: {
    //           color: Cesium.Color.fromCssColorString("#7ffeff"),
    //           image: "/images/spriteline.png",
    //           speed: 10,
    //         },
    //         source,
    //       },
    //       translucent: function () {
    //         return true;
    //       },
    //     });
    //     const appearance = new Cesium.PolylineMaterialAppearance();
    //     appearance.material = material;
    //     const primitive = new Cesium.Primitive({
    //       geometryInstances: instance,
    //       appearance,
    //       asynchronous: false,
    //     });
    //
    //     primitives = viewer.scene.primitives.add(primitive);
    //   }
    // },
    onClear(){
      // 此处注意不要使用removeAll，将实例都删除的话，再次添加会报错
      _dataSource && viewer.dataSources.remove(_dataSource, false);
      primitives && viewer.scene.primitives.remove(primitives);
    },
    onClear1(){
      viewer.entities.removeAll();
    },
    async onStart(){
      const { res } = await getGeojson("/json/320205.json");
      const { features } = res;
      const maskpointArray = [];
      const maskpointArray1 = [];
      const arr = features[0].geometry.coordinates[0][0];
      for (let i = 0, l = arr.length; i < l; i++) {
        maskpointArray.push(arr[i][0]);
        maskpointArray.push(arr[i][1]);
        maskpointArray1.push(arr[i][0]);
        maskpointArray1.push(arr[i][1]);
        maskpointArray.push(-1000);
      }
      var maskspoint = Cesium.Cartesian3.fromDegreesArrayHeights(maskpointArray);
      var maskspoint1 = Cesium.Cartesian3.fromDegreesArray(maskpointArray1);

      console.log("---maskspoint", maskspoint,maskpointArray);
      const area = new Cesium.Entity({
        id: 1,
        polygon: {
          hierarchy: {
            // 定义多边形的环区域
            positions: Cesium.Cartesian3.fromDegreesArray([
              100, 0, 100, 89, 160, 89, 160, 0,
            ]),
            // 定义多边形的孔
            holes: [
              {
                positions: maskspoint1,
              },
            ],
          },
          material: Cesium.Color.BLACK.withAlpha(0.9), //外部颜色
        },
      });

      // 创建一个线性颜色渐变的纹理，从红色到蓝色
      // var gradientTexture = new Cesium.Texture({
      //   context: viewer.scene.context,
      //   width: 10,
      //   height: 10,
      //   source: {
      //     arrayBufferView: new Uint8Array([
      //       255, 0, 0, 255, // 左上角 - 红色
      //       0, 0, 255, 255  // 右下角 - 蓝色
      //     ])
      //   }
      // });
      // // 创建一个MaterialAppearance实例，并使用上面的渐变纹理
      // var appearance = new Cesium.MaterialAppearance({
      //   material: new Cesium.Material({
      //     fabric: {
      //       type: 'Color',
      //       uniforms: {
      //         color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
      //         image: gradientTexture
      //       }
      //     }
      //   })
      // });
      // var normals = Cesium.VertexFormat.POSITION_AND_NORMAL;

      // const greenWall = viewer.entities.add({
      //   wall: {
      //     positions: maskspoint,
      //     // normal: normals,
      //     // appearance: appearance,
      //     material: Cesium.Color.fromCssColorString("#0283ff").withAlpha(0.2),
      //     outline: false,
      //   },
      // });
      // viewer.zoomTo(greenWall);
      const greenWall = new Cesium.Entity({
        id:'greenWall',
        wall: {
          positions: maskspoint,
          material: Cesium.Color.fromCssColorString("#0283ff").withAlpha(0.3),
          outline: false,
        },
      });
      viewer.entities.add(greenWall);

      // const entity1 = new Cesium.Entity({
      //   id: "entity1",
      //   polygon: {
      //     hierarchy: maskspoint,
      //     material: Cesium.Color.fromCssColorString("#0283ff").withAlpha(0.9),
      //     extrudedHeight: 2000,
      //     height: 100,
      //     perPositionHeight: true,
      //   },
      // });

      const line = new Cesium.Entity({
        id: 2,
        polyline: {
          positions: maskspoint1,
          width: 4, //边界线宽
          material: Cesium.Color.fromCssColorString("#6dcdeb"), //边界线颜色
          clampToGround: false, // 贴地
        },
      });
      viewer.entities.add(area);
      viewer.entities.add(line);

      // viewer.entities.add(entity1);
      // viewer.flyTo(entity1, { duration: 3 });
      viewer.flyTo(greenWall, { duration: 3 });
    },
    drawGradientImage() {
      var canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      var ctx = canvas.getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, 'rgba(255, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(255, 0, 0, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return canvas;
    }
  }
}
</script>

<style scoped>
#my-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
}
.btnBox{
  position: absolute;
  z-index: 1;
  top: 20px;
  left: 20px;
}
</style>
