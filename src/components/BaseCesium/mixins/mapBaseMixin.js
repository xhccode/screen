// import { getWFSLegend } from "@/api/gisApi";
let measureInstance = null;
export default {
  data() {
    return {
      distanceLineArr: [],//测距线
      distanceLabelArr: [],//测距点
      areaPolygonArr: [],//测面面积
      polygonLabelArr: [],//测面点
      distanceMeasureShowFlag: false,//测距时选中样式
      areaMeasureShowFlag: false,//测面时选中样式
    };
  },
  async mounted() {
    // 实例化web球，viewer示例对象放在window上
    window.viewer = new Cesium.Viewer("MapContainer", {
      // 去除离线加载时使用token问题
      imageryProvider: new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
      }),
      homeButton:false,// 是否显示回到初始视图的按钮
      sceneModePicker:false,// 是否显示场景模式选择器（2D、3D、鹰眼视图）
      timeline:false,// 是否显示时间线控件
      shouldAnimate: true,// 设置是否启用动画效果
      baseLayerPicker:false,// 影像切换
      animation:false,// 是否显示动画控件
      infoBox:false,// 是否显示点击要素之后显示的信息
      selectionIndicator:false,// 要素选中框
      geocoder:false,// 是否显示地名查找控件
      fullscreenButton: false,// 是否显示全屏
      scene3DOnly:true,// 每个几何实例以3D渲染，节省GPU内存
      navigationHelpButton:false,// 是否显示帮助信息控件
      contextOptions: {// 允许开发者根据需求调整WebGL的渲染行为，以优化性能或实现特定的视觉效果
        webgl: {// 一个包含WebGL相关配置的对象
          alpha: true,// 布尔值，指示WebGL上下文是否包含alpha通道（即是否支持透明背景）
          depth: false,// 布尔值，指示WebGL上下文是否包含深度缓冲区
          stencil: true,// 布尔值，指示WebGL上下文是否包含模板缓冲区
          antialias: true,// 布尔值或字符串，指示是否启用抗锯齿。在某些浏览器和WebGL实现中，可能需要使用字符串来指定抗锯齿的类型（如"msaa"）
          premultipliedAlpha: true,// 布尔值，指示WebGL上下文是否期望图像数据的alpha值被预乘
          preserveDrawingBuffer: true,// 布尔值，指示WebGL上下文是否应保留绘图缓冲区直到下一次渲染调用。这对于需要读取WebGL渲染结果的场景（如截屏）非常有用。
          failIfMajorPerformanceCaveat: true,// 布尔值，指示如果WebGL上下文有重大性能缺陷，是否应创建失败。
        },
        allowTextureFilterAnisotropic: false,// 用于控制是否允许使用 anisotropic filtering（异性过滤）。开启异性过滤可能会稍微增加GPU的负担，因此在低端设备上使用时要谨慎。
      },
    });
    // 去掉logo
    viewer.cesiumWidget.creditContainer.style.display = "none";

    // 添加罗盘，比例尺等控件
    // viewer.extend(Cesium.viewerCesiumNavigationMixin);
    // 鹰眼地图初始化
    // const hawkEyeMap = new HawkEye2DMap(viewer);
    // hawkEyeMap._init();
    // 三维量测插件（github上的Cesium-measure插件）
    // measureInstance = new Cesium.Measure(viewer);
    // 初始化地图
    this.initBaseLayer();
    // 获取矢量图层图例
    // this.handleWFSLegend("三调_土地利用现状");
    //飞去某处动画效果
    // this.flyTo(116.435314,40.960521,20000000);
    this.flyTo(120.03377824080187, 31.559806024017824, 150000);
  },
  methods: {
    //开场动画
    flyTo(lat, lon, n) {
      //无锡坐标
      // const lat = 31.559806024017824;
      // const lon = 120.03377824080187;
      // const n = 120000;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lat, lon, n),
        easingFunction: Cesium.EasingFunction.LINEAR_NONE,
      });
    },
    //初始化地图
    initBaseLayer() {
      // 天地图秘钥
      let MAP_KEY = process.env.VUE_APP_MAP_CN_TOKEN;
      // 矢量地图-经纬度投影
      this.addTdtLayerC({type:process.env.VUE_APP_MAP_WMTS_VEC_C},MAP_KEY)
      return
      const {baseUrl} = window.gis;
      // wmts
      // const WMTSWorld = new Cesium.WebMapTileServiceImageryProvider({
      //     url: `${baseUrl}/maptilecache/service/wmts`,
      //     layer: "全球影像-PNG-4326",
      //     tileMatrixSetID: "EPSG:4326",
      //     format: "image/png",
      //     tilingScheme: new Cesium.GeographicTilingScheme(),
      //     // token: getToken(),
      //     // minimumLevel: item.minLevel,
      //     // maximumLevel: item.maxLevel,
      // });
      // wms底图
      const WMSWorld = new Cesium.WebMapServiceImageryProvider({
        url: `${baseUrl}/maptilecache/service/wms`,
        layers: "全球影像-PNG-4326",
        parameters: {
          // transparent: true,
          format: "image/png",
        },
        srs: "EPSG:4326",
      });
      // wms地名
      const WMSName = new Cesium.WebMapServiceImageryProvider({
        url: `${baseUrl}/maptilecache/service/wms`,
        layers: "全球地名-PNG-4326",
        parameters: {
          // transparent: true,
          format: "image/png",
        },
        srs: "EPSG:4326",
      });
      // 矢量 wms
      const WMSArea = new Cesium.WebMapServiceImageryProvider({
        url: `${baseUrl}/mapservice/gwc/service/wms`,
        layers: "gserver:县级行政区划",
        parameters: {
          // transparent: true,
          format: "image/png",
        },
        srs: "EPSG:4326",
      });
      // wms底图
      // const WMSWuXi = new Cesium.WebMapServiceImageryProvider({
      //     url: `${baseUrl}/maptilecache/service/wms`,
      //     layers: "无锡八月份三波段影像",
      //     parameters: {
      //         // transparent: true,
      //         format: "image/png",
      //     },
      //     srs: "EPSG:4326",
      // });

      // viewer.imageryLayers.addImageryProvider(WMTSWorld);
      viewer.imageryLayers.addImageryProvider(WMSWorld, 1);
      viewer.imageryLayers.addImageryProvider(WMSName);
      // viewer.imageryLayers.addImageryProvider(WMSWuXi);
      viewer.imageryLayers.addImageryProvider(WMSArea);
    },
    // 天地图(经纬度投影)
    addTdtLayerC(options,key) {
      // let url = `https://t{s}.tianditu.gov.cn/DataServer?T=${options.type}&x={x}&y={y}&l={z}&tk=${key}`
      const layerProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: `${process.env.VUE_APP_MAP_URL}/${process.env.VUE_APP_MAP_WMTS_VEC_C}/wmts?tk=${key}&format=tiles&height=256&width=256&maxZoom=18&minZoom=0&tileSize=256`,
        layer: options.type.slice(0,options.type.length - 2),
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains:["t0","t1","t2","t3","t4","t5","t6","t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
      });
      // layerProvider.hue = 3; // 图层色调
      // layerProvider.contrast = -1.2; // 图层对比度
      viewer.imageryLayers.addImageryProvider(layerProvider);

    },
    // 天地图瓦片(墨卡托投影)
    addTdtLayerW(options,key) {
      let url = `https://t{s}.tianditu.gov.cn/DataServer?T=${options.type}&x={x}&y={y}&l={z}&tk=${key}`
      const layerProvider = new Cesium.UrlTemplateImageryProvider({
        url: url,
        subdomains: ['0','1','2','3','4','5','6','7'],
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18
      });
      viewer.imageryLayers.addImageryProvider(layerProvider);
    },
    // 天地图WMTS(墨卡托投影)
    addTdtLayerW2(options,key) {
      let url = `https://t{s}.tianditu.gov.cn/${options.type}/wmts?tk=${key}`
      const layerProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: url,
        layer: options.type.slice(0,options.type.length - 2),
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: "w",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        subdomains: ['0','1','2','3','4','5','6','7'],
        maximumLevel: 18
      });
      viewer.imageryLayers.addImageryProvider(layerProvider);
    },
    //图例
    // async handleWFSLegend(layerName) {
    //     const param = {
    //         service: "WMS",
    //         version: "1.0.0",
    //         request: "GetLegendGraphic",
    //         format: "image/png",
    //         layer: `gserver:${layerName}`,
    //         LEGEND_OPTIONS:
    //             "fontName:宋体;bgColor:0x1d3654;fontColor:0xffffff;forceLabels:on;fontAntiAliasing:true;",
    //     };
    //     let legend = await getWFSLegend(param);
    //     let legendImg =
    //         "data:image/png;base64," +
    //             btoa(
    //                 new Uint8Array(legend).reduce(
    //                     (data, byte) => data + String.fromCharCode(byte),
    //                     ""
    //                 )
    //             ) || null;
    //     this.$store.dispatch("addLegend", legendImg);
    // },
    // 测距功能
    handleCommandLine(command) {
      if (command == 'a') {
        this.handleDistanceMeasure();
      } else {
        let newIndex = command.slice(2, command.length);
        this.removeDrawLayer(newIndex);
      }
    },
    //测距
    handleDistanceMeasure() {
      this.distanceMeasureShowFlag = true;
      this.searchAttribute = false;
      measureInstance.drawLineMeasureGraphics({
        unit: "米", // 单位
        clampToGround: false, // 是否贴地
        callback: (pos, lineObj, labelArr) => {
          // console.log('lineObj', lineObj)
          // console.log('labelObj', labelObj)
          //  measureInstance._drawLayer.entities.remove(lineObj);
          //  labelObj.forEach(entity=>measureInstance._drawLayer.entities.remove(entity))
          //  measureInstance._drawLayer.entities.remove(labelObj);
          this.distanceLineArr.push(lineObj);
          this.distanceLabelArr.push(labelArr);
          this.distanceMeasureShowFlag = false;
        },
      });
    },
    //删除对应测距
    removeDrawLayer(i) {
      measureInstance._drawLayer.entities.remove(this.distanceLineArr[i]);
      this.distanceLabelArr[i].forEach(entity => measureInstance._drawLayer.entities.remove(entity));
      this.distanceLineArr.splice(i, 1);
      this.distanceLabelArr.splice(i, 1);
    },
    //测面功能
    handleCommandArea(command) {
      if (command == 'a') {
        this.handleAreaMeasure();
      } else {
        let newIndex = command.slice(2, command.length);
        this.removeAreaMeasure(newIndex);
      }
    },
    // 测面
    handleAreaMeasure() {
      this.areaMeasureShowFlag = true;
      measureInstance.drawAreaMeasureGraphics({
        unit: "米", // 单位
        clampToGround: false,
        callback: (pos, polygonObj, labelArr) => {
          this.areaMeasureShowFlag = false;
          this.areaPolygonArr.push(polygonObj);
          this.polygonLabelArr.push(labelArr);
        },
      });
    },
    //删除对应面积
    removeAreaMeasure(i) {
      measureInstance._drawLayer.entities.remove(this.areaPolygonArr[i]);
      this.polygonLabelArr[i].forEach(entity => measureInstance._drawLayer.entities.remove(entity));
      this.areaPolygonArr.splice(i, 1);
      this.polygonLabelArr.splice(i, 1);
    },
  },
};
