/**地图事件相关 */
// import { getWFSFeature } from "@/api/gisApi";
// import { generatePolygon } from "@/utils/spatialAnalysis";
// import { getArea,getField } from '@/api/layerData'
// import { getInformation } from '@/api/user'

//=====
import Bubble from "./bubble/index.js";
import DragEntity from "./dragentity.js";
//=====
// import { getHotspotList, postHotspot } from "@/api/hotspot"

// 弹窗对象
let bubbleBox = null;
// 弹窗图层
let graphicLayer;
export default {
    data() {
        return {
            currentLevel: 0,
            earthMsg: {
                viewHeight: "",
                lon: "",
                lat: "",
                elevation: "",
                level: "",
            },
            searchAttribute: false,//查询属性
            primitiveInstance: null,//绘制几何图形
            bubbles: null,
            routePath: '',//路由路径
        };
    },
    watch: {
        $route: {
            immediate: true,//初始加载
            handler(route) {
                if (this.routePath) {
                    if (this.routePath != route.meta.from) {
                        if (this.bubbles) {
                            this.bubbles.windowClose();
                            // 根据ID删除
                            viewer.entities.removeById('001');
                        }
                    }
                }
                this.routePath = route.meta.from;
            }
        }
    },
    mounted() {
        this.addMouseLeftClickEvent();
        // this.getHotspot();
        // 添加相机监听事件
        viewer.camera.moveEnd.addEventListener(() => {
            this.tileLevel(viewer);
        });
        // Bus.$on("closeBubble", this.resetBubble);
        let that = this;
        viewer.screenSpaceEventHandler.setInputAction(function (movement) {
            let scene = viewer.scene;
            let pick = new Cesium.Cartesian2(
                movement.endPosition.x,
                movement.endPosition.y
            );
            if (pick) {
                let cartesian = scene.globe.pick(
                    viewer.camera.getPickRay(pick),
                    scene
                );
                if (cartesian) {
                    //世界坐标转地理坐标（弧度）
                    let cartographic =
                        scene.globe.ellipsoid.cartesianToCartographic(
                            cartesian
                        );
                    if (cartographic) {
                        //海拔
                        let height = scene.globe.getHeight(cartographic);
                        //视角海拔高度
                        let he = Math.sqrt(
                            scene.camera.positionWC.x *
                            scene.camera.positionWC.x +
                            scene.camera.positionWC.y *
                            scene.camera.positionWC.y +
                            scene.camera.positionWC.z *
                            scene.camera.positionWC.z
                        );
                        let he2 = Math.sqrt(
                            cartesian.x * cartesian.x +
                            cartesian.y * cartesian.y +
                            cartesian.z * cartesian.z
                        );
                        //地理坐标（弧度）转经纬度坐标
                        let point = [
                            (cartographic.longitude / Math.PI) * 180,
                            (cartographic.latitude / Math.PI) * 180,
                        ];
                        if (!height) {
                            height = 0;
                        }
                        if (!he) {
                            he = 0;
                        }
                        if (!he2) {
                            he2 = 0;
                        }
                        if (!point) {
                            point = [0, 0];
                        }
                        that.earthMsg.viewHeight = (he - he2).toFixed(1); //视高
                        that.earthMsg.lon = point[0].toFixed(6); //经度
                        that.earthMsg.lat = point[1].toFixed(6); //纬度
                        that.earthMsg.elevation = height.toFixed(2); //海拔
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    methods: {
        // 获取当前地图瓦片级别
        tileLevel() {
            let tiles = new Set();
            let tilesToRender = viewer.scene.globe._surface._tilesToRender;
            if (Cesium.defined(tilesToRender)) {
                for (let i = 0; i < tilesToRender.length; i++) {
                    tiles.add(tilesToRender[i].level);
                }
                const setToArray = Array.from(tiles);
                this.earthMsg.level = setToArray[0];
            }
        },
        //获取热点
        async getHotspot(i) {
            await getHotspotList().then(res => {
                this.hotList = res;
                if (i == 1) {
                    this.addEntities(res[res.length - 1], res.length)
                    this.addHot = false;
                }
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        //添加鼠标左击点击事件
        addMouseLeftClickEvent() {
            let _this = this;
            graphicLayer = viewer.graphicLayer;
            viewer.screenSpaceEventHandler.setInputAction(
                async function onLeftClick(event) {
                    // 当前是矢量图层
                    // TODO: 不同层级，阈值不同，后期应该分的更细致
                    let tolerance = _this.currentLevel < 11 ? 0.5 : 0.001;
                    const degreesPosition = _this.screenToDegree(
                        viewer,
                        event.position
                    );
                    const { lon, lat } = degreesPosition;
                    const _polygonParams = {
                        x: lon,
                        y: lat,
                        tolerance,
                    };
                    const filterPoint = generatePolygon(_polygonParams);
                    //添加热点
                    if (_this.addHot) {
                        let textArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                        let index = _this.hotList.length + 1
                        let data = {
                            name: '标注' + index + '-' + textArr[(index - 1) % 26],
                            lon,
                            lat
                        };
                        postHotspot(data).then(res => {
                            _this.getHotspot(1);
                        }).catch(err => {
                            console.log(err, 'postErr')
                        })
                    }

                    //查询属性
                    if (!_this.searchAttribute) return;

                    //此处代码替换下方注释代码----精简--------------
                    let pickRay = viewer.camera.getPickRay(event.position);
                    let clickfeaturesPromise = [];
                    try {
                        clickfeaturesPromise = await viewer.imageryLayers.pickImageryLayerFeatures(pickRay, viewer.scene);
                    } catch (error) {
                        _this.$notify({
                          title: '信息提示',
                          type: 'warning',
                          message: '请选择对应图层!',
                          position: 'bottom-right'
                        });
                        return null;
                    }
                    if (clickfeaturesPromise.length > 0) {
                        const { position, formatData: wfsInfo } =
                            _this.getCurrentLayerInfo(
                                degreesPosition,
                                clickfeaturesPromise[0].data
                            );
                        if(!wfsInfo)return;
                        //已加载矢量图层组
                        let layerNameList = _this.$store.state.layerName.currentWFSLayerName;
                        //默认选中图层
                        let layerName = layerNameList[0];
                        console.log(clickfeaturesPromise,"clickfeaturesPromise");
                        //点击图层名称
                        let layerTextName = clickfeaturesPromise[0].data.id.split('.');
                        console.log(layerName,'layerName');
                        if(layerTextName[0] != layerName){
                          let index = layerNameList.findIndex(item => item === layerTextName[0]);
                          if(index > -1){
                            await _this.$store.dispatch("toTopLayer", layerTextName[0]);
                            layerName = layerTextName[0];
                          }else{
                            _this.$notify({
                              title: '信息提示',
                              type: 'warning',
                              message: '请选择对应图层!',
                              position: 'bottom-right'
                            });
                            return
                          }
                        }
                        //有对应属性矢量图层
                        if (!layerName) return;
                        let layerId = await _this.getLayerId(layerName);//获取图层ID
                        console.log(layerId,"id");
                        if(layerId === ''){
                          _this.$notify({
                            title: '信息提示',
                            type: 'warning',
                            message: '无此图层数据',
                            position: 'bottom-right'
                          });
                          return;
                        }
                        //面积单位
                        let areaList = await _this.getAreaData(layerId,wfsInfo);
                        // 详情字段显示顺序
                        let detailList = await _this.getDetail(wfsInfo,areaList);
                        _this.bubble(position, detailList, layerName, areaList);

                        // 获取权属
                        let bsmIndex = wfsInfo.findIndex(item => item.label.toUpperCase() === 'BSM');
                        if(bsmIndex > -1){
                          await _this.getInformation(layerId,wfsInfo[bsmIndex].content);
                        }
                        //获取图层详情
                        //判断不是点数据时，图斑高亮
                        if (clickfeaturesPromise[0].data.geometry.type != 'Point') {
                            _this.addDataToGlobe([clickfeaturesPromise[0].data]);
                        }
                    } else {
                        _this.$notify({
                          title: '信息提示',
                          type: 'warning',
                          message: '未查询到要素信息，请重新尝试',
                          position: 'bottom-right'
                        });
                        return null;
                    }
                    return;
                    //判断是点数据还是面数据 定义各参数 -- （遗留问题无法判断是点数据还是面数据）
                    // let params = {};
                    // if(layerName == '全球机场-PNG-4326'){//点数据
                    //     params = {
                    //         service: "WFS",
                    //         version: "1.0.0",
                    //         request: "GetFeature",
                    //         maxFeatures: 100,//限制接受个数
                    //         typeName: `gserver:${layerName}`,
                    //         outputFormat: "json",
                    //         CQL_FILTER: `INTERSECTS(the_geom, POLYGON((${filterPoint})))`,
                    //     };
                    // }else{//面数据
                    //     params = {
                    //         service: "WFS",
                    //         version: "1.0.0",
                    //         request: "GetFeature",
                    //         maxFeatures: 100,//限制接受个数
                    //         typeName: `gserver:${layerName}`,
                    //         outputFormat: "json",
                    //         CQL_FILTER: `Contains(the_geom, POINT(${lon} ${lat}))`,
                    //     };
                    // }
                    // //请求数据
                    // const nearestFeature = await _this.interactWithWFSLayer(
                    //     params
                    // );
                    // console.log(nearestFeature,'88889999')
                    // if (nearestFeature[0]) {
                    //     const { position, formatData: wfsInfo } =
                    //         _this.getCurrentLayerInfo(
                    //             degreesPosition,
                    //             nearestFeature[0]
                    //         );
                    //     console.log(nearestFeature,'88889999',position,wfsInfo,layerName)
                    //     wfsInfo && _this.bubble(position,wfsInfo,layerName);
                    // }
                    // //图层高亮
                    // if(layerName != '全球机场-PNG-4326'){
                    //     let patternSpot = nearestFeature[0];
                    //     if(layerName == '无锡行政区划1'){
                    //         //筛选最小面积
                    //         let minNum = nearestFeature.sort((x,y) => {
                    //             return x.properties.Shape_Area > y.properties.Shape_Area ? 1 : -1
                    //         })
                    //         patternSpot = minNum[0];
                    //     }
                    //     _this.addDataToGlobe([patternSpot]);
                    // }
                },
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
        },
        //获取点击图层的ID
        async getLayerId(layerName){
          let adminLayerArr = this.$store.state.layers.adminLayerArr;
          let layerId = '';
          let index = adminLayerArr.findIndex(x => x.label === layerName);
          if(index > -1){
            layerId = adminLayerArr[index].key;
          }
          await this.$store.dispatch('addLayerId',layerId);
          return layerId
        },
        //冒泡排序
        getSort(list){
          let arr = [];
          //筛选非隐藏数据
          list.map(item => {
            if(item.visible > 0){
              arr.push(item);
            }
          })
          for(let i = 0; i < arr.length-1; i++){
            //每一轮比较要比多少次
            for(let j = 0; j < arr.length - 1 - i; j++){
              //如果第一个比第二个大，就交换他们两个位置
              if(arr[j].sortNum > arr[j+1].sortNum){
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
              }
            }
          }
          return arr;
        },
        // 获取详情字段
        async getDetail(wfsInfoList,areaList) {
          let param = {
              layerId:this.$store.state.legend.layerId,
              visible:-1
          }
          let list = await getField(param);
          let sortList = [];
          wfsInfoList.map(item => {
            let index = list.findIndex(i => item.label === i.fieldName);
            if(index > -1){
              sortList.push({
                'visible':list[index].visible,
                'sortNum':list[index].sortNum,
                ...item
              });
            }
          })
          sortList.map(item => {
            let index = areaList.findIndex(x => x.fieldName == item.label);
            if (index > -1) {//保留两位小数
              item.content = Math.floor(item.content * 100) / 100
            }
            return item
          })
          let getSortList = this.getSort(sortList);
          return getSortList
        },
        // 获取图斑面积单位
        async getAreaData(layerId,wfsInfoList) {
          let param = {
            layerId,
            fieldScope: 'unit'
          };
          let areaList = [];
          let res = await getArea(param);
          wfsInfoList.map(item => {
            let index = res.findIndex(x => x.fieldName === item.label);
            if(index > -1){// 将获取到的面积单位和面积字段存到vuex中
              areaList.push({
                bindValue: res[index].bindValue,
                fieldName: res[index].fieldName
              })
            }
          })
          await this.$store.dispatch("MjArea", areaList);
          return areaList
        },
        // 权属信息
        async getInformation(id, bsm) {
           await getInformation({ 'layerId': id }).then(res => {
             res?.forEach(item => {
               item.bsm=bsm
             })
             this.$store.dispatch('addOwner', res)
           })
        },
        // 添加几何图形
        addDataToGlobe(features) {
            if (this.primitiveInstance) {
                this.removePrimitives();
            }
            const instances = [];
            for (let i = 0; i < features.length; i++) {
                for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
                    const polygonArr = features[i].geometry.coordinates[j].toString().split(',');
                    const polygon = new Cesium.PolygonGeometry({
                        polygonHierarchy: new Cesium.PolygonHierarchy(
                            Cesium.Cartesian3.fromDegreesArray(polygonArr)
                        ),
                        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                    });
                    const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
                    instances.push(new Cesium.GeometryInstance({
                        geometry: geometry,
                        attributes: {
                            color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 })),
                        },
                    }));
                }
            }

            const primitive = new Cesium.Primitive({
                geometryInstances: instances,
                appearance: new Cesium.PerInstanceColorAppearance({ // 为每个instance着色
                    translucent: true,
                    closed: false
                }),
                asynchronous: false,  // 确定基元是异步创建还是阻塞直到准备就绪
            });
            this.primitiveInstance = viewer.scene.primitives.add(primitive);
        },
        //删除几何图形
        removePrimitives() {
            if (this.primitiveInstance) {
                // 当在框选范围类进行属性查询时，点击属性查询和关闭详情弹框会报错，
                this.primitiveInstance.destroy();
                this.primitiveInstance = null;
            }
        },
        // Cesium屏幕转经纬度坐标
        screenToDegree(viewer, pick) {
            let cartesian = viewer.scene.globe.pick(
                viewer.camera.getPickRay(pick),
                viewer.scene
            );
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lon = Cesium.Math.toDegrees(cartographic.longitude);
            let alt = cartographic.height;
            // console.log("经度：" + lon + "\n纬度：" + lat + "\n高度：" + alt);
            return { lon, lat };
        },
        // 世界坐标转经纬度
        cartesianToDegree(position) {
            let cartographic = Cesium.Cartographic.fromCartesian(
                position,
                viewer.scene.globe.ellipsoid,
                new Cesium.Cartographic()
            );
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let lon = Cesium.Math.toDegrees(cartographic.longitude);
            let alt = cartographic.height; // 高度，椭球面height永远等于0
            return { lon, lat, alt };
        },
        // WFS图层交互
        async interactWithWFSLayer(wfsParams) {
            const featureRes = await getWFSFeature(wfsParams);
            const { features, totalFeatures } = featureRes;
            if (!totalFeatures) {
                this.$notify({
                  title: '信息提示',
                  type: 'warning',
                  message: '未查询到要素信息，请重新尝试',
                  position: 'bottom-right'
                });
                return null;
            }
            return features;
        },
        // 获取当前图层信息
        getCurrentLayerInfo(degreePosition, layerInfo) {
            let commonInfo = this.formatWFSInfo(degreePosition, layerInfo);
            return commonInfo;
        },
        // 序列化wfs属性信息
        formatWFSInfo(degreePosition, { geometry, properties }) {
            let formatData = [];
            const entries = Object.entries(properties);
            entries.forEach(([key, value]) => {
                const item = {
                    label: key,
                    content: value,
                    colspan: 2,
                    // labelWidth:
                };
                formatData.push(item);
            });
            let position = null;
            const { type, coordinates } = geometry;
            switch (type) {
                case "Point":
                    const {
                        coordinates: [lon, lat],
                    } = geometry;
                    position = { lon, lat };
                    break;
                case "MultiPolygon":
                case "MultiLineString":
                    position = {
                        lon: degreePosition.lon,
                        lat: degreePosition.lat,
                    };
                    break;
                default:
                    break;
            }
            return { position, formatData };
        },
        //    ======= 图钉方式加载图层==============
        bubble(position, commonInfo, layerName, area) {
            if (this.bubbles) {
                this.bubbles.windowClose();
                // 根据ID删除
                viewer.entities.removeById('001');
            }
            let data = {
                id: '001',
                commonInfo,
                position: {
                    x: position.lon,
                    y: position.lat
                }
            };
            let drag = new DragEntity({ viewer });
            let newData = drag.addEntity(data);
            this.bubbles = new Bubble(
                Object.assign(newData, {
                    viewer, self: this, area
                })
            );
        },

    },
};
