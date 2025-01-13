import { getWFSLegend } from "@/api/gisApi";
let measureInstance = null;
export default {
    data() {
        return {
            distanceLineArr:[],//测距线
            distanceLabelArr:[],//测距点
            areaPolygonArr:[],//测面面积
            polygonLabelArr:[],//测面点
            distanceMeasureShowFlag:false,//测距时选中样式
            areaMeasureShowFlag:false,//测面时选中样式
        };
    },
    async mounted() {
        // 实例化web球，viewer示例对象放在window上
        // window.viewer = new GT.GeoCanvas("MapContainer", {
        window.viewer = new Cesium.Viewer("MapContainer", {
            shouldAnimate: true,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            // fullscreenButton: true,//全屏
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
        });
        // 添加罗盘，比例尺等控件
        // viewer.extend(Cesium.viewerCesiumNavigationMixin);
        // 鹰眼地图初始化
        // const hawkEyeMap = new HawkEye2DMap(viewer);
        // hawkEyeMap._init();
        // 三维量测插件（github上的Cesium-measure插件）
        measureInstance = new Cesium.Measure(viewer);
        // 初始化地图
        this.initBaseLayer();
        // 获取矢量图层图例
        // this.handleWFSLegend("三调_土地利用现状");
        //飞去某处动画效果
        // this.flyTo(116.435314,40.960521,20000000);
        this.flyTo(120.03377824080187,31.559806024017824,150000);
    },
    methods: {
        //开场动画
        flyTo(lat,lon,n) {
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
            const { baseUrl } = window.gis;
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
            viewer.imageryLayers.addImageryProvider(WMSWorld,1);
            viewer.imageryLayers.addImageryProvider(WMSName);
            // viewer.imageryLayers.addImageryProvider(WMSWuXi);
            viewer.imageryLayers.addImageryProvider(WMSArea);
        },
        //图例
        async handleWFSLegend(layerName) {
            const param = {
                service: "WMS",
                version: "1.0.0",
                request: "GetLegendGraphic",
                format: "image/png",
                layer: `gserver:${layerName}`,
                LEGEND_OPTIONS:
                    "fontName:宋体;bgColor:0x1d3654;fontColor:0xffffff;forceLabels:on;fontAntiAliasing:true;",
            };
            let legend = await getWFSLegend(param);
            let legendImg =
                "data:image/png;base64," +
                    btoa(
                        new Uint8Array(legend).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            ""
                        )
                    ) || null;
            this.$store.dispatch("addLegend", legendImg);
        },
        // 测距功能
        handleCommandLine(command) {
            if(command == 'a'){
                this.handleDistanceMeasure();
            }else{
                let newIndex = command.slice(2,command.length);
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
        removeDrawLayer(i){
            measureInstance._drawLayer.entities.remove(this.distanceLineArr[i]);
            this.distanceLabelArr[i].forEach(entity=>measureInstance._drawLayer.entities.remove(entity));
            this.distanceLineArr.splice(i,1);
            this.distanceLabelArr.splice(i,1);
        },
        //测面功能
        handleCommandArea(command){
            if(command == 'a'){
                this.handleAreaMeasure();
            }else{
                let newIndex = command.slice(2,command.length);
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
        removeAreaMeasure(i){
            measureInstance._drawLayer.entities.remove(this.areaPolygonArr[i]);
            this.polygonLabelArr[i].forEach(entity=>measureInstance._drawLayer.entities.remove(entity));
            this.areaPolygonArr.splice(i,1);
            this.polygonLabelArr.splice(i,1);
        },
    },
};
