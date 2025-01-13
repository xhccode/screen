import {
    getBaseImageLayer,
    getImageLayer,
    getVector,
    getVectorTile,
    getTerrain,
    getOSGB,
    getImageLayerByTime,
    getAllTimingImageInfo,
    getStreetViewLayers,
    getStreetViewInfo,
} from "@/api/gisApi";
import CheckboxOk from "@/components/CheckboxOk";
import { getToken } from "@/utils/auth";
import StreetView from "/public/streetView/streetView";
import { Message } from "element-ui";
const baseUrl = window.gis.baseUrl;
export default {
    components: { CheckboxOk },
    data() {
        return {
            treeData1:[],
            treeData: [
                {
                    treeId:'1',
                    layerName: "影像服务",
                    // layerName: "发展规划",
                    disabled: true,
                    children: [],
                },
                {
                    treeId:'2',
                    layerName: "矢量服务",
                    // layerName: "基础支撑",
                    disabled: true,
                    children: [],
                },
                {
                    treeId:'3',
                    layerName: "地形服务",
                    // layerName: "监测专题",
                    disabled: true,
                    children: [],
                },
                // {
                //     treeId:'4',
                //     layerName: "地名服务",
                //     disabled: true,
                //     chiildren: [],
                // },
                {
                    treeId:'5',
                    layerName: "倾斜摄影服务",
                    // layerName: "基准现势",
                    disabled: true,
                    children: [],
                },
                {
                    treeId:'6',
                    layerName: "时序影像服务",
                    disabled: true,
                    children: [],
                },
                // {
                //     treeId:'7',
                //     layerName: "街景服务",
                //     disabled: true,
                //     children: [],
                // },
            ],
            defaultProps: {
                children: "children",
                label: function (data) {
                    let result = data.ControlName;
                    if (result.length > 34) {
                        result = result.slice(0, 34) + "......";
                    }
                    return result;
                },
            },
            imageLayers: [],
            terrainProviders: [],
            tilesets: [],
            timeImageLayers: [],
            isShowTimeLine: false,
            isPlay: false,
            toolmsg: [
                "30 min",
                "1 hours",
                "6 hours",
                "1 day",
                "7 day",
                "30 day",
            ],
            currentTimeNode: 0,
            timeStep: 10,
            playTimer: null,
            timeImageList: [],
            timeImageLayer: null, // 记录当前上球的时序影像，只能上球一张时序影像
            streetViewLayers: [],
            streetViewBox: null,
            streetView: null, // 街景,球上只能添加一个街景
            defaultTerrainProvider: null,
            marksData:{},
            serviceLayerArr:[],//外部服务
        };
    },
    mounted() {
        this.defaultTerrainProvider = viewer.terrainProvider;
        this.getMenu();
    },
    methods: {
        //设置树节点
        setTreeId(data,key){
            return data.map((item,index) => {
                item.treeId = `${key}-${index}`
                return item
            })
        },
        //设置树key
        setKey(data, key) {
            return data.map(function (item) {
                if (
                    ["png", "jpeg"].indexOf(item.mimeType.toLocaleLowerCase()) <
                        0 ||
                    item.tileStatus.toLocaleLowerCase() !== "success"
                ) {
                    item.disabled = true;
                    return
                }
                item.treeKey = key;
                return item;
            }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
        },
        // 获取图层列表
        async getMenu() {
            // const vm = this;
            let treeData = this.treeData;
            // 基础影像
            let baseImageLayerData = await getBaseImageLayer();
            let newArr = [];
            for(let i = 0; i < baseImageLayerData.data.length;i++){
                // if(!(baseImageLayerData.data[i].layerName == '全球影像-PNG-4326') && !(baseImageLayerData.data[i].layerName == '全球地名-PNG-4326')){
                    newArr.push(baseImageLayerData.data[i])
                // }
            }
            let keyData0 = this.setKey(newArr, 0)
            treeData[0].children = this.setTreeId(keyData0,'1');
            // 影像
            // const imageLayerData = await getImageLayer();
            // let keyData1 = this.setKey(imageLayerData.data, 0);
            // treeData[1].children = this.setTreeId(keyData1,'2');
            const vectorData = await getVector();
            let vectorArray = vectorData.data.map(function (item) {
                if (item.status.toLocaleLowerCase() !== "success") {
                    item.disabled = true;
                    return
                }
                if (item.operation === -1) {
                    item.disabled = true;
                    return
                }
                item.treeKey = 1;
                return item;
            }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            // 矢量
            let vectorTileData = await getVectorTile();
            let vectorTileArray = vectorTileData.data.map(function (itemTile) {
                if (itemTile.tileStatus.toLocaleLowerCase() !== "success") {
                    itemTile.disabled = true;
                    return
                }
                if (itemTile.operation === -1) {
                    itemTile.disabled = true;
                    return
                }
                itemTile.treeKey = 1;
                return itemTile;
            }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            vectorArray.push(...vectorTileArray);
            treeData[1].children = this.setTreeId(vectorArray,'2');
            // 地形
            const terrainData = await getTerrain();
            let keyData2 = terrainData.data.map(function (item) {
                let mimeType = item.mimeType.toLocaleLowerCase();
                if (
                    item.tileStatus.toLocaleLowerCase() !== "success" ||
                    ["raw"].indexOf(mimeType) > -1
                ) {
                    item.disabled = true;
                    return
                }
                if (item.operation === -1) {
                    item.disabled = true;
                    return
                }
                item.treeKey = 2;
                return item;
            }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            treeData[2].children = this.setTreeId(keyData2,'3')
            // 倾斜摄影
            const osgbData = await getOSGB();
            let keyData3 = osgbData.data.map(function (item) {
                let format = item.format.toLocaleLowerCase();
                if (format !== "b3dm") {
                    item.disabled = true;
                    return
                }
                if (item.operation === -1) {
                    item.disabled = true;
                    return
                }
                item.treeKey = 3;
                return item;
            }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            treeData[3].children = this.setTreeId(keyData3,'4')
            // 时序
            const timeData = await getImageLayerByTime();
            let keyData4 = timeData.data.map(function (item) {
                item.treeKey = 4;
                if (item.operation === -1) {
                    item.disabled = true;
                    return
                }
                return item;
            }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            treeData[4].children = this.setTreeId(keyData4,'5')
            // 街景
            // const streetViewData = await getStreetViewLayers();
            // let keyData6 = streetViewData.data.map((item) => {
            //     item.layerName = item.svName;
            //     item.treeKey = 6;
            //     if (item.operation === -1) {
            //         item.disabled = true;
            //         return
            //     }
            //     return item;
            // }).filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            // treeData[6].children = this.setTreeId(keyData6,'7')
            await this.$store.dispatch('changeLayerArr',treeData);
        },
        //图层分类
        treeCheckChange1(data, checked){
            let layers = viewer.imageryLayers._layers;
            if(!data.children){//去除父级选择事件
                if(data.serviceFrom){//外部服务
                    if(checked){//选中图层
                        this.$refs.treeNode.setChecked(data, true)
                        this.nodeClick(data);
                    }else{//取消选中图层
                        this.$refs.treeNode.setChecked(data, false)
                        this.cancelClick(data);
                    }
                    return;
                }
                let layerServiceIndex = this.treeData.findIndex(item => item.layerName === data.type);
                if(layerServiceIndex > -1){
                    let layerIndex = this.treeData[layerServiceIndex].children.findIndex(item => item.layerName === data.layerName);
                    if(layerIndex > -1){
                        let layerData = this.treeData[layerServiceIndex].children[layerIndex];
                        if(checked){//选中图层
                            this.$refs.treeNode.setChecked(data, true)
                            this.nodeClick(layerData);
                        }else{//取消选中图层
                            this.$refs.treeNode.setChecked(data, false)
                            this.cancelClick(layerData);
                        }
                    }else{
                        if(checked){
                            this.$refs.treeNode.setChecked(data, false);
                            this.$notify({
                              title: '错误',
                              type: 'error',
                              message: '无此图层服务数据，请前往后台添加',
                              position: 'bottom-right'
                            });
                            return
                        }
                    }
                }else{
                    if(checked){
                        this.$refs.treeNode.setChecked(data, false);
                        this.$notify({
                          title: '错误',
                          type: 'error',
                          message: '当前图层服务类型错误，请前往后台更改',
                          position: 'bottom-right'
                        });
                        return
                    }
                }
            }
        },
        //树节点选项框点击事件
        treeCheckChange(data, checked, indeterminate) {
            if(!data.children){//去除父级选择事件
                if(checked){//选中图层
                    this.$refs.treeNode.setChecked(data, true)
                    this.nodeClick(data);
                }else{//取消选中图层
                    this.$refs.treeNode.setChecked(data, false)
                    this.cancelClick(data);
                }
            }
            let layers = viewer.imageryLayers._layers;
        },
        // tree取消事件
        cancelClick(data){
            if(data.serviceFrom){//外部服务
                let index = this.serviceLayerArr.findIndex(item => item.id === data.id);
                if(index > -1){
                    let imageryLayer = this.serviceLayerArr[index].imageryLayer;
                    this.serviceLayerArr.splice(index,1);
                    viewer.imageryLayers.remove(imageryLayer);
                    imageryLayer.destroy();
                    return;
                }
            }
            let treeKey = data.treeKey;
            if (treeKey === 0) {//影像
                let imageLayersIndex = this.imageLayers.findIndex(item => item.layerName == data.layerName);
                if(imageLayersIndex > -1){
                    this.removeImageLayer('',imageLayersIndex)
                }
            } else if (treeKey === 1) {// 矢量服务
                const layerName = this.$store.state.layerName.currentWFSLayerName[0];
                if(data.layerName == layerName){
                    this.layerLegendShowFlag = false;
                }
                let imageLayersIndex = this.imageLayers.findIndex(item => item.layerName == data.layerName);
                if(imageLayersIndex > -1){
                    this.removeImageLayer(data,imageLayersIndex)
                }

            } else if (treeKey === 2) {//地形
                let terrainProvidersLayersIndex = this.terrainProviders.findIndex(item => item.layerName == data.layerName);
                this.removeTerrain(terrainProvidersLayersIndex)
            } else if (treeKey === 3) {//倾斜
                let tilesetseLayersIndex = this.tilesets.findIndex(item => item.layerName == data.layerName);
                this.removeOSGB(tilesetseLayersIndex)
            } else if (treeKey === 4) {// 时序
                let timeImageLayersIndex = this.timeImageLayers.findIndex(item => item.layerName == data.layerName);
                this.removeTimeImage(timeImageLayersIndex);
            }
        },
        // tree选中事件
        nodeClick(node) {
            if(node.serviceFrom){//外部服务
                let imageryLayer = this.addServiceLayer(node);
               this.serviceLayerArr.push({
                   ...node,
                   imageryLayer,
               });
                return;
            }
            this.nodeList = node;
            let treeKey = node.treeKey;
            if (treeKey === 0) {
                this.addImageLayer(node);
            } else if (treeKey === 1) {
                if(!node?.children){
                    this.$store.dispatch("changeLayerName", node.layerName);
                    // 获取矢量图层图例
                    this.handleWFSLegend(node.layerName);
                    this.addVectorLayer(node); // 矢量服务
                }
            } else if (treeKey === 2) {
                this.addTerrain(node);
            } else if (treeKey === 3) {
                this.addOSGB(node);
            } else if (treeKey === 4) {
                this.addTimeImageLayer(node); // 时序
            }
            // else if (treeKey === 6) {
            //     this.addStreetViewLayers(node);
            // }
        },
        //添加外部服务
        addServiceLayer(node){
            return viewer.imageryLayers.addImageryProvider(
                new Cesium.WebMapTileServiceImageryProvider({
                    url:node.serviceUrl + node.serviceToken,
                    layer: node.name,
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible",
                })
            );
        },
        //外部删除对应树节点
        removeTreeNode(value){
            let getList = this.$refs.treeNode.getCheckedNodes();
            let newArr = [];
            for(let i = 0;i < getList.length;i++){
                if(!getList[i].children){//去除父级选择事件
                    newArr.push(getList[i]);
                }
            }
            let newGetList = newArr.filter(item=>!["",null,undefined,NaN,false,true].includes(item));
            let getIndex = newGetList.findIndex(item => item.layerName == value.layerName);
            if(getIndex > -1){
                newGetList.splice(getIndex,1);
                this.$refs.treeNode.setCheckedNodes(newGetList);
            }
        },

        addImageToMap(item) {
            let tilingScheme = Cesium.WebMercatorTilingScheme();
            if (
                item.gridSet.indexOf("4326") > -1 ||
                item.gridSet.indexOf("4490") > -1
            ) {
                tilingScheme = new Cesium.GeographicTilingScheme();
            }
            let provider = new Cesium.WebMapTileServiceImageryProvider({
                url: baseUrl + "/maptilecache/service/wmts?token=" + getToken('Authorization'),
                layer: item.layerName,
                tileMatrixSetID: item.gridSet,
                format: "image/" + item.mimeType.toLocaleLowerCase(),
                tilingScheme: tilingScheme,
                // minimumLevel: item.minLevel,
                // maximumLevel: item.maxLevel,
            });
            this.flyToLayer(item);

            return viewer.imageryLayers.addImageryProvider(provider);
        },
        flyToLayer(item) {
            viewer.camera.flyTo({
                destination: Cesium.Rectangle.fromDegrees(
                    item.minX,
                    item.minY,
                    item.maxX,
                    item.maxY
                ),
            });
        },
        // 添加影像图层
        addImageLayer(item) {
            let imageLayers = this.imageLayers;
            if (this.checkList(item, imageLayers)) {
                return;
            }

            let imageryLayer = this.addImageToMap(item);

            imageLayers.unshift({
                ...item,
                imageryLayer,
            });
        },
        checkList(item, list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if (element.id === item.id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 添加矢量影像图层
         */
        addVectorLayer(item) {
            let imageLayers = this.imageLayers;
            if (this.checkList(item, imageLayers)) {
                return;
            }
            //判断是发的wms服务进行添加
            //没有geojson数据无法测试
            // 如果是矢量栅格，使用wmts服务添加
            if (item.storageType) {
                let imageryLayer = this.addImageToMap(item);
                imageLayers.unshift({
                    ...item,
                    imageryLayer,
                });
            } else if (
                ["png", "jpeg", "geojson", "pbf"].indexOf(
                    item.mimeType.toLocaleLowerCase()
                ) >= 0
            ) {
                let imageryLayer = this.addWmsService(item);
                imageLayers.unshift({
                    ...item,
                    imageryLayer,
                });
            }
        },
        // 添加wms服务
        addWmsService(item) {
            let mimeType = item.mimeType.toLocaleLowerCase();
            let gridSet = item.gridSet;
            let layerName = item.layerName;
            let is4326 = gridSet.indexOf("4326") > -1;
            let rectangle = Cesium.Rectangle.MAX_VALUE.clone();
            //判断是4326设置范围,数据没有3857,无法测试
            if (is4326) {
                rectangle = new Cesium.Rectangle(
                    Cesium.Math.toRadians(
                        Cesium.Math.clamp(item.minX, -180, 180)
                    ),
                    Cesium.Math.toRadians(
                        Cesium.Math.clamp(item.minY, -90, 90)
                    ),
                    Cesium.Math.toRadians(
                        Cesium.Math.clamp(item.maxX, -180, 180)
                    ),
                    Cesium.Math.toRadians(Cesium.Math.clamp(item.maxY, -90, 90))
                );
            }
            let provider = new Cesium.WebMapServiceImageryProvider({
                url: baseUrl + "/mapservice/gserver/" + layerName + "/wms",
                layers: "gserver:" + layerName,
                parameters: {
                    format:
                        "image/" +
                        (["geojson", "pbf"].indexOf(
                            item.mimeType.toLocaleLowerCase()
                        ) >= 0
                            ? "png"
                            : mimeType),
                    request: "GetMap",
                    service: "WMS",
                    styles: "",
                    version: "1.3.0",
                    TRANSPARENT: true,
                    token: getToken('Authorization'),
                },
                rectangle: rectangle,
            });
            this.flyToLayer(item);
            return viewer.imageryLayers.addImageryProvider(provider);
        },
        /**
         * 添加地形图层
         */
        addTerrain(item) {
            let terrainProviders = this.terrainProviders;
            if (this.checkList(item, terrainProviders)) {
                return;
            }
            let mimeType = item.mimeType.toLocaleLowerCase();
            let layerName = item.layerName;
            let terrainProvider;
            if (mimeType === "bil") {
                terrainProvider = viewer.terrainProvider =
                    new GT.BilTerrainProvider({
                        url:
                            baseUrl +
                            "/maptilecache/api/v1/layer/" +
                            item.layerName +
                            "?z={z}&x={x}&y={y}",
                        maxLevel: item.maxLevel,
                        minLevel: item.minLevel,
                    });
            } else {
                const showUrl =
                    baseUrl +
                    "/maptilecache/service/terrain/" +
                    layerName +
                    "?token=" +
                    getToken('Authorization');
                terrainProvider = viewer.terrainProvider =
                    new Cesium.CesiumTerrainProvider({
                        url:
                            baseUrl +
                            "/maptilecache/service/terrain/" +
                            layerName +
                            "?token=" +
                            getToken('Authorization'),
                    });
            }
            this.hiddenTerrain();
            terrainProviders.push({
                ...item,
                terrainProvider,
                terrainShow: true,
            });
            this.flyToLayer(item);
        },
        /**
         * 将所有地形图层隐藏
         */
        hiddenTerrain() {
            this.terrainProviders.map((item) => {
                item.terrainShow = false;
            });
        },
        /**
         * 添加3dtile模型
         */
        addOSGB(item) {
            let tilesets = this.tilesets;
            if (this.checkList(item, tilesets)) {
                return;
            }
            let url =
                baseUrl +
                "/pano3d/api/v1/layers/dataset/" +
                item.layerName +
                "/tileset.json?token=" +
                getToken('Authorization');
            let tileset = viewer.scene.primitives.add(
                new Cesium.Cesium3DTileset({
                    url: url,
                })
            );
            this.tilesets.push({
                ...item,
                tileset,
            });
            viewer.flyTo(tileset);
        },
        /**
         * 添加时间影像
         */
        addTimeImageLayer(item) {
            // this.$notify({
            // title: '信息提示',
            //   type: 'warning',
            //   message: '若要加载时序影像，需清空球上影像',
            //   position: 'bottom-right'
            // });
            let timeImageLayers = this.timeImageLayers;
            if (this.checkList(item, timeImageLayers)) {
                return;
            }
            this.isShowTimeLine = true;
            this.isPlay = false;
            this.currentTimeNode = 0;
            clearInterval(this.playTimer);
            this.setTimeLine(item);
            this.hiddenAllTimeImage();
            timeImageLayers.push({
                ...item,
                timeImageShow: true,
            });
        },
        addTimeImageLayerToEarth(item) {
            if (this.timeImageLayer) {
                viewer.imageryLayers.remove(this.timeImageLayer);
            }
            this.timeImageLayer = this.addImageToMap(item);
            // this.commitTimeImageLayer();
        },
        // 通过item设置时间轴，同时更新时序影像列表
        setTimeLine(item) {
            let layerName = item.layerName;
            let gridSet = item.gridSet;
            let mimeType = item.mimeType;
            this.timeImageList = [];
            this.toolmsg = [];
            getAllTimingImageInfo(layerName).then((data) => {
                let set = parseInt(100 / (data.length + 1) );
                this.marksData = {};
                data.forEach((val,index) => {
                    let item1 = val;
                    item1.gridSet = gridSet;
                    item1.mimeType = mimeType;
                    this.timeImageList.push(item1);
                    this.marksData[(set*(index + 1))]= this.formatTimeString(item1.time);
                    this.toolmsg.push(this.formatTimeString(item1.time));
                });
                let len = this.timeImageList.length;
                this.timeStep = parseInt(100 / (len + 1));
            });
        },
        // 显示或隐藏时序影像
        showHiddenTimeImage(show, index) {
            let item = this.timeImageLayers[index];
            this.hiddenAllTimeImage();
            if (show) {
                item.timeImageShow = true;
                this.isShowTimeLine = true;
                this.setTimeLine(item);
            } else {
                //item.timeImageShow = false;
                this.isShowTimeLine = false;
            }
        },

        // 隐藏所有的时序影像
        hiddenAllTimeImage() {
            this.timeImageLayers.map((item) => {
                item.timeImageShow = false;
            });
            if (this.timeImageLayer) {
                this.viewer.imageryLayers.remove(this.timeImageLayer);
            }
            this.timeImageLayer = null;
            // this.commitTimeImageLayer();
        },
        // 移除时序影像
        removeTimeImage(index) {
            let timeImage = this.timeImageLayers.splice(index, 1);
            this.removeTreeNode(timeImage[0]);
            if (timeImage[0]?.timeImageShow === true) {
                this.isShowTimeLine = false;
                clearInterval(this.playTimer);
                this.currentTimeNode = 0;
                this.isPlay = false;
                if (this.timeImageLayer) {
                    viewer.imageryLayers.remove(this.timeImageLayer);
                }
                this.timeImageLayer = null;
            }
        },
        // 播放时序影像
        playTimeImage() {
            this.isPlay = true;
            let i = 0;
            let item = this.timeImageList[i];
            this.currentTimeNode = (i + 1) * this.timeStep;
            this.addTimeImageLayerToEarth(item);
            if (this.timeImageList.length > 1) {
                this.playTimer = setInterval(() => {
                    i = i + 1;
                    this.currentTimeNode = (i + 1) * this.timeStep;
                    if (i === this.timeImageList.length) {
                        // i = 0;
                        this.isPlay = false;
                        clearInterval(this.playTimer);
                        return;
                    }
                    item = this.timeImageList[i];
                    this.addTimeImageLayerToEarth(item);

                }, 7000);
            } else {
                setTimeout(() => {
                    this.isPlay = false;
                }, 5000);
            }
        },
        // 暂停播放
        pausePlay() {
            this.isPlay = false;
            clearInterval(this.playTimer);
        },
        // 向左播放
        leftPlay() {
            this.isPlay = false;
            clearInterval(this.playTimer);
            let currentIndex = this.currentTimeNode / this.timeStep;
            if (currentIndex === 0) {
                return;
            }
            this.currentTimeNode = this.currentTimeNode - this.timeStep;
            let item = this.timeImageList[currentIndex - 1];
            this.addTimeImageLayerToEarth(item);
        },
        // 向右播放
        rightPlay() {
            this.isPlay = false;
            clearInterval(this.playTimer);
            let currentIndex = this.currentTimeNode / this.timeStep;
            if (currentIndex === this.timeImageList.length - 1) {
                return;
            }
            this.currentTimeNode = this.currentTimeNode + this.timeStep;
            let item = this.timeImageList[currentIndex + 1];
            this.addTimeImageLayerToEarth(item);
        },
        changePlay(index) {
            this.isPlay = false;
            clearInterval(this.playTimer);
            if(index == 0){
                return
            }else if(index == 100){
                return;
            }
            let currentIndex = index / this.timeStep - 1;
            let item = this.timeImageList[currentIndex];
            this.addTimeImageLayerToEarth(item);
        },
        timestepToolTip(index) {
            /* 自定义mask文字颜色 */
            const customClassValue = document.getElementsByClassName('el-slider__marks-text');
            for (let i = 0; i < customClassValue.length; i++) {
                let value = customClassValue[i].innerHTML
                /* 当滑块的值大于mask时改变颜色 */
                if (this.marksData[index] == value) {
                    customClassValue[i].style.color = '#FFFFFF';
                    customClassValue[i].style.backgroundImage = 'linear-gradient(to right,transparent, #fca242, transparent)';
                } else {
                    customClassValue[i].style.color = '#212121';
                    customClassValue[i].style.backgroundImage = '';
                }
            }
            return this.toolmsg[index / this.timeStep];
        },
        // 把时间字符串格式化
        formatTimeString(timeString) {
            let year = timeString.slice(0, 4);
            let month = timeString.slice(4, 6);
            let day = timeString.slice(6, 8);
            let hour = timeString.slice(8, 10);
            let minute = timeString.slice(10, 12);
            let second = timeString.slice(12, 14);
            return (
                [year, month, day].join("-")
            );
            // return (
            //     [year, month, day].join("-") +
            //     " " +
            //     [hour, minute, second].join(":")
            // );
        },
        // 往街景列表中添加街景
        addStreetViewLayers(item) {
            // 去掉边框、清掉街景、隐藏所有的导航点图层
            this.hiddenAllStreetView();
            // getToken('Authorization');
            // let navPointImagerLayer = this.addTMSImagerLayers(navPointUrl);
            // 添加街景
            this.addStreetView(item);
            this.streetViewLayers.push({
                ...item,
                // navPointImagerLayer,
                streetShow: true,
            });
        },
        // 删除街景
        removeStreetView(index) {
            let value = this.streetViewLayers.splice(index, 1)[0];
            let imageryLayer = value.navPointImagerLayer;
            this.viewer.imageryLayers.remove(imageryLayer);
            imageryLayer && imageryLayer.destroy();
            if (value.streetShow === true) {
                this.streetView.remove();
                this.viewer.entities.remove(this.streetViewBox);
            }
        },
        // 显示或隐藏街景
        showHiddenStreetView(show, index) {
            let item = this.streetViewLayers[index];
            this.hiddenAllStreetView();
            if (show) {
                item.streetShow = true;
                item.navPointImagerLayer.show = true;
                this.addStreetView(item); //添加街景和边框
            }
        },
        // 隐藏所有街景
        hiddenAllStreetView() {
            // 清除边框
            if (this.streetViewBox) {
                viewer.entities.remove(this.streetViewBox);
            }
            // 清除街景
            if (this.streetView) {
                this.streetView.remove(); // 移除街景
            }
            this.streetViewLayers.map((item) => {
                item.streetShow = false;
                item.navPointImagerLayer.show = false;
            });
        },
        // 往球上添加街景
        async addStreetView(item) {
            let info = await getStreetViewInfo(item.id);
            Message({
                showClose: true,
                message: "点击左键查看街景",
            });
            // const viewer = this.viewer;
            this.streetViewBox = viewer.entities.add({
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(
                        info.minX,
                        info.minY,
                        info.maxX,
                        info.maxY
                    ),
                    material: Cesium.Color.fromCssColorString(
                        "rgba(255,255,255,0)"
                    ),
                    fill: false,
                    outline: true,
                    outlineColor: Cesium.Color.fromCssColorString("#fb0101"),
                },
            });
            //let rectangle = {'rectangle' : [info.minX, info.minY, info.maxX, info.maxY]};
            this.flyToLayer(info);
            this.streetView = new StreetView(viewer, {
                isFly: false,
                parentDom: document.getElementById("streetscape"),
                miniMapUrl: window.gis.map ? window.gis.map.url : null,
                scapeUrl: `${baseUrl}/streetmap/api/v1/${info.svName}`,
                navPointUrl:
                    baseUrl +
                    "/streetmap/api/v1/map/tms/1.0.0/" +
                    info.svName +
                    "@EPSG:4326@png",
                miniMap: escape(JSON.stringify(window.gis.map)),
            });
        },
        // 清除并重置图层 清除树节点选中
        clearAllLayers() {
            // 清除所有的服务
            this.clearAllService();
            this.resetAllLayers();
            //清除图层树选中
            this.$refs.treeNode.setCheckedNodes([]);
        },
        // 清除所有的服务
        clearAllService() {
            // 清除影像
            this.imageLayers.forEach((value) => {
                let imageryLayer = value.imageryLayer;
                this.$store.dispatch("deleteLayerName", [value.layerName]);
                viewer.imageryLayers.remove(imageryLayer);
                imageryLayer.destroy();
            });
            // 清除地形
            viewer.terrainProvider = this.defaultTerrainProvider;
            // 清除街景
            // this.streetViewLayers.forEach((value) => {
            //     let imageryLayer = value.navPointImagerLayer;
            //     viewer.imageryLayers.remove(imageryLayer);
            //     imageryLayer && imageryLayer.destroy();
            //     if (value.streetShow === true) {
            //         this.streetView.remove();
            //         this.viewer.entities.remove(this.streetViewBox);
            //     }
            // });
            // 清除时序影像
            // === 防止万一，时间轴事件清除 2022.08.24
            this.isShowTimeLine = false;
            clearInterval(this.playTimer);
            this.currentTimeNode = 0;
            this.isPlay = false;
            // ===
            if (this.timeImageLayer) {
                viewer.imageryLayers.remove(this.timeImageLayer);
            }
            // 清除所有倾斜摄影
            this.tilesets.forEach((val) => {
                let tileset = val.tileset;
                viewer.scene.primitives.remove(tileset);
                tileset.destroy();
            });
            // 清除地名
            // if (this.placeLayers.length > 0) {
            //     viewer.tileLayer.remove(this.placeLayers[0].placeLayer.id);
            // }
        },
        resetAllLayers() {
            this.imageLayers = [];
            this.terrainProviders = [];
            this.tilesets = [];
            this.timeImageLayers = [];
        },
        /**
         * 影像图层置顶
         */
        imageRaiseToTop(index) {
            if (index === 0) {
                return;
            }
            let value = this.imageLayers.splice(index, 1)[0];
            let imageryLayer = value.imageryLayer;
            if (imageryLayer.show === true) {
                this.flyToLayer(value);
                const layerName = value.layerName;
                const legend = legendMap.get(layerName);
            }
            viewer.imageryLayers.raiseToTop(imageryLayer);
            this.imageLayers.unshift(value);
        },
        /**
         * 影像图层显隐
         */
        imageCheckboxClick(value, index) {
            console.log(value, 'value')
            console.log(index, 'index')
            value.show = !value.show;
            if (value.show && index === 0) {
                this.flyToLayer(value);
            }
        },
        /**
         * 影像图层上移
         */
        imageLayerUp(value, index) {
            if (index === 0) {
                return;
            }
            let imageLayers = this.imageLayers.slice();
            viewer.imageryLayers.raise(value.imageryLayer);
            let changeLayer = imageLayers[index - 1];
            imageLayers[index - 1] = imageLayers[index];
            imageLayers[index] = changeLayer;
            this.$store.dispatch("changeLayerUp", value.layerName);
            if (index === 1 && value.imageryLayer.show === true) {
                this.flyToLayer(value);
                // 获取当前矢量图例
                //   const layerName = imageLayers[index].layerName
                //   const legend = legendMap.get(layerName)
            }
            this.imageLayers = imageLayers;
        },
        /**
         * 影像图层下移
         */
        imageLayerDown(value, index) {
            let imageLayers = this.imageLayers.slice();
            if (index === imageLayers.length - 1) {
                return;
            }
            viewer.imageryLayers.lower(value.imageryLayer);
            let changeLayer = imageLayers[index + 1];
            imageLayers[index + 1] = imageLayers[index];
            imageLayers[index] = changeLayer;
            this.$store.dispatch("changeLayerDown", value.layerName);
            // if (index === 0 && imageLayers[0].imageryLayer.show === true) {
            //     this.flyToLayer(value);
            //     // 获取当前矢量图例
            //     //   const layerName = imageLayers[index].layerName
            //     //   const legend = legendMap.get(layerName)
            // }
            this.imageLayers = imageLayers;
            const topLayer = imageLayers[0]
            if (topLayer && topLayer.imageryLayer.show) {
                this.flyToLayer(topLayer)
            }
        },
        /**
         * 影像图层置顶
         */
        imageRaiseToTop(index) {
            if (index === 0) {
                return;
            }
            let value = this.imageLayers.splice(index, 1)[0];
            this.$store.dispatch("toTopLayer", value.layerName);
            let imageryLayer = value.imageryLayer;
            if (imageryLayer.show === true) {
                this.flyToLayer(value);
                // 获取矢量图例
                // const layerName = value.layerName;
                // const legend = legendMap.get(layerName);
            }
            viewer.imageryLayers.raiseToTop(imageryLayer);
            this.imageLayers.unshift(value);
        },
        /**
         * 删除影像图层
         */
        removeImageLayer(needDeleteValue, index) {
            this.$store.dispatch("deleteLayerName", [needDeleteValue.layerName]);
            let value = this.imageLayers.splice(index, 1)[0];
            this.removeTreeNode(value);
            let imageryLayer = value.imageryLayer;
            viewer.imageryLayers.remove(imageryLayer);
            imageryLayer.destroy();
            if (this.imageLayers.length) {
                let value = this.imageLayers[0];
                let imageryLayer = value.imageryLayer;
                if (imageryLayer.show) {
                    this.flyToLayer(value);
                    //获取矢量图例
                    // const layerName = value.layerName;
                    // const legend = legendMap.get(layerName);
                }
            }
        },
        /**
         * 将所有地形图层隐藏
         */
        hiddenTerrain() {
            this.terrainProviders.map((item) => {
                item.terrainShow = false;
            });
        },
        /**
         * 将所有地形图层隐藏
         */
        hiddenTerrain() {
            this.terrainProviders.map((item) => {
                item.terrainShow = false;
            });
        },
        /**
         * 显示隐藏地形图层
         */
        showHiddenTerrain(show, index) {
            let item = this.terrainProviders[index];
            this.hiddenTerrain();
            if (show) {
                item.terrainShow = true;
                viewer.terrainProvider = item.terrainProvider;
                this.flyToLayer(item);
            } else {
                viewer.terrainProvider = this.terrainProviders;
            }
        },
        /**
         * 飞向添加的3dtile模型
         */
        flyToOSGB(tileset) {
            viewer.flyTo(tileset, {
                duration: 2,
            });
        },
        /**
         * 显示隐藏3dtile模型
         */
        showHiddenOSGB(item) {
            item.tileset.show = !item.tileset.show;
        },
        /**
         * 删除3dtile模型
         */
        removeOSGB(index) {
            let item = this.tilesets.splice(index, 1)[0];
            let tileset = item.tileset;
            viewer.scene.primitives.remove(tileset);
            tileset.destroy();
            this.removeTreeNode(item);
        },
        formatTooltip(val) {
            return val / 100;
        },
        formatAlphaTooltip(val) {
            return val;
        },
        /**
         * 删除地形图层
         */
        removeTerrain(index) {
            let value = this.terrainProviders.splice(index, 1);
            this.removeTreeNode(value[0]);
            viewer.terrainProvider = this.defaultTerrainProvider;
            // this.commitTerrainProviders();
        },
    },
};
