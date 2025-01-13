<template>
  <div ref="MapWrapper" class="map-wrapper">
    <!-- 地图容器 -->
    <div id="MapContainer" class="base-map" :style="{ width: divisionShowFlag ? '50%' : '100%' }">
      <!-- 卷帘分割线 -->
      <div ref="splitSlider" v-show="showRollerShutter" id="slider"></div>
      <!-- 图层树 -->
      <div class="layer-manager" v-show="layerManagerShowFlag">
        <div class="layerTree">
          <!--                    <el-tree-->
          <!--                        :data="treeData"-->
          <!--                        :props="defaultProps"-->
          <!--                        show-checkbox-->
          <!--                        node-key="treeId"-->
          <!--                        ref="treeNode"-->
          <!--                        @check-change="treeCheckChange"-->
          <!--                    ></el-tree>-->
          <el-tree
            :data="treeData1"
            :props="defaultProps"
            show-checkbox
            node-key="treeId"
            ref="treeNode"
            @check-change="treeCheckChange1"
          ></el-tree>
        </div>
      </div>
      <!-- 图层管理 -->
      <div v-show="layerManagerShowFlag && layerManager > 0" class="right-box">
        <!-- 隐藏原图 -->
        <div id="imageLayers">
          <el-row class="image-title">
            <span class="text">图层管理</span>
            <div class="clear-layers" @click="clearAllLayers">
              <i class="el-icon-delete" title="清除所有图层"></i>
              <span>清除图层</span>
            </div>
          </el-row>
          <el-scrollbar class="scrollbar-container" wrapStyle="overflow-x: auto;">
            <el-container>
              <el-main class="el-main-custom">
                <el-row class="image-list-item" v-for="(value, index) in imageLayers" v-bind:key="value.id">
                  <div class="row-list-item">
                    <!-- <CheckboxOk
                             v-bind:show="value.imageryLayer.show"
                             v-on:click="imageCheckboxClick(value, index)"
                    /> -->
                    <span class="long-text-style">
                      <span :title="value.layerName">{{value.layerName|newText }}</span>
                    </span>
                    <div class="row-btn-group">
                      <span class="image-list-item-botton" v-bind:class="{ 'disabled-button': index === 0 }" v-on:click="imageRaiseToTop(index)" title="置顶">
                        <img src="../../assets/images/map/top.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" v-bind:class="{ 'disabled-button': index === 0 }" v-on:click="imageLayerUp(value, index)" title="上移">
                        <img src="../../assets/images/map/moveUp.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" v-bind:class="{'disabled-button': index === imageLayers.length - 1}" v-on:click="imageLayerDown(value, index)" title="下移">
                        <img src="../../assets/images/map/moveDown.png" alt=""/>
                      </span>
                      <span v-on:click="removeImageLayer(value, index)" title="删除">
                        <img src="../../assets/images/map/delete.png" alt="" />
                      </span>
                      <el-dropdown :hide-on-click="false" trigger="click">
                        <span title="更多">
                          <img src="../../assets/images/map/more.png" alt="" />
                        </span>
                        <el-dropdown-menu class="layer-color" slot="dropdown">
                          <el-dropdown-item>
                            <span>亮度</span>
                            <el-slider :step="0.1" :min="0" :max="2" :show-tooltip="false" v-model="value.imageryLayer.brightness" :format-tooltip="formatTooltip"></el-slider>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <span>透明度</span>
                            <el-slider :step="0.1" :min="0" :max="1" :show-tooltip="false" v-model="value.imageryLayer.alpha" :format-tooltip="formatAlphaTooltip"></el-slider>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <span>对比度</span>
                            <el-slider :step="0.1" :min="0" :max="2" :show-tooltip="false" v-model="value.imageryLayer.contrast" :format-tooltip="formatTooltip"></el-slider>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <span>饱和度</span>
                            <el-slider :step="0.1" :min="0" :max="2" :show-tooltip="false" v-model="value.imageryLayer.saturation" :format-tooltip="formatTooltip"></el-slider>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <span>色调</span>
                            <el-slider :step="0.1" :min="-1" :max="1" :show-tooltip="false" v-model="value.imageryLayer.hue" :format-tooltip="formatTooltip"></el-slider>
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <span>伽马</span>
                            <el-slider :step="0.1" :min="1" :max="2" :show-tooltip="false" v-model="value.imageryLayer.gamma" :format-tooltip="formatTooltip"></el-slider>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </el-row>
                <!--地形-->
                <el-row class="image-list-item" v-for="(value, index) in terrainProviders" v-bind:key="value.id">
                  <div class="row-list-item">
                    <!-- <CheckboxOk
                      v-bind:show="value.terrainShow"
                      v-on:click="showHiddenTerrain($event, index)"
                    /> -->
                    <span class="long-text-style">
                      <span :title="value.layerName">{{value.layerName }}</span>
                    </span>
                    <div class="row-btn-group">
                      <span class="image-list-item-botton" style="color: #a59d9d" title="置顶">
                        <img src="../../assets/images/map/top.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" style="color: #a59d9d" title="上移">
                        <img src="../../assets/images/map/moveUp.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" style="color: #a59d9d" title="下移">
                        <img src="../../assets/images/map/moveDown.png" alt=""/>
                      </span>
                      <span class="image-list-item-botton" v-on:click="removeTerrain(index)" title="删除">
                        <img src="../../assets/images/map/delete.png" alt="" />
                      </span>
                      <el-dropdown :hide-on-click="false">
                        <span title="更多">
                          <img src="../../assets/images/map/more.png" alt="" />
                        </span>
                        <el-dropdown-menu class="layer-color" slot="dropdown">
                          <el-dropdown-item>
                            <span>亮度</span>
                            <el-slider :min="0" :max="100" :show-tooltip="false"></el-slider>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </el-row>
                <!-- 倾斜摄影服务 -->
                <el-row class="image-list-item" v-for="(value, index) in tilesets" v-bind:key="value.id" v-on:click.native="flyToOSGB(value.tileset)">
                  <div class="row-list-item">
                    <!-- <CheckboxOk
                      v-bind:show="value.tileset.show"
                      v-on:click="showHiddenOSGB(value)"
                    /> -->
                    <span class="long-text-style">
                      <span :title="value.layerName">{{value.layerName }}</span>
                    </span>
                    <div class="row-btn-group">
                      <span class="image-list-item-botton" style="color: #a59d9d" title="置顶">
                        <img src="../../assets/images/map/top.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" style="color: #a59d9d" title="上移">
                        <img src="../../assets/images/map/moveUp.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" style="color: #a59d9d" title="下移">
                        <img src="../../assets/images/map/moveDown.png" alt=""/>
                      </span>
                      <span class="image-list-item-botton" v-on:click.stop="removeOSGB(index)" title="删除">
                        <img src="../../assets/images/map/delete.png" alt="" />
                      </span>
                    </div>
                  </div>
                </el-row>
                <!-- 时序影像 -->
                <el-row class="image-list-item" v-for="(value, index) in timeImageLayers" v-bind:key="value.id" v-on:click.native="flyToOSGB(value.tileset)">
                  <div class="row-list-item">
                    <!-- <CheckboxOk
                      v-bind:show="value.timeImageShow"
                      v-on:click="showHiddenTimeImage($event, index)"
                    /> -->
                    <span class="long-text-style">
                      <span :title="value.layerName">{{value.layerName }}</span>
                    </span>
                    <div class="row-btn-group">
                      <span class="image-list-item-botton" style="color: #a59d9d" title="置顶">
                        <img src="../../assets/images/map/top.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" style="color: #a59d9d" title="上移">
                        <img src="../../assets/images/map/moveUp.png" alt="" />
                      </span>
                      <span class="image-list-item-botton" style="color: #a59d9d" title="下移">
                        <img src="../../assets/images/map/moveDown.png" alt=""/>
                      </span>
                      <span class="image-list-item-botton" v-on:click.stop="removeTimeImage(index)" title="删除">
                        <img src="../../assets/images/map/delete.png" alt="" />
                      </span>
                    </div>
                  </div>
                </el-row>
              </el-main>
            </el-container>
          </el-scrollbar>
        </div>
      </div>
      <!-- 框选区域 -->
      <div class="boxSelection" v-show="boxSelectionShowFlag">
        <el-button type="danger" size="small" @click="removeRect">删除框选</el-button>
        <el-button type="danger" size="small" @click="editRect" v-if="coorfinateText">编辑框选</el-button>
        <el-button type="danger" size="small" @click="endRect" v-if="coorfinateText && !searchBtnRect">结束框选</el-button>
        <el-button type="primary" size="small" @click="searchRect()" v-if="coorfinateText && searchBtnRect">查询框选</el-button>
      </div>
      <!-- 工具菜单 -->
      <div class="map-tools" v-show="!divisionShowFlag">
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': boxSelectionShowFlag }" effect="dark" content="框选" placement="top">
          <img src="../../assets/images/BoxSelection.png" alt="" @click="rectGather"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': dimensionShowFlag }" effect="dark" content="二三维切换" placement="top">
          <img src="../../assets/images/map/2Dand3Dswitching.png" alt="" @click="switchDimension"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': lonlatShowFlag }" effect="dark" content="经纬网" placement="top">
          <img src="../../assets/images/map/dimension.png" alt="" @click="handleLonLat"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': distanceMeasureShowFlag }" effect="dark" content="测距" placement="top">
          <img src="../../assets/images/map/ranging.png" alt="" @click="handleDistanceMeasure" v-if="distanceLabelArr.length == 0"/>
          <el-dropdown size="mini" @command="handleCommandLine" v-if="distanceLabelArr.length > 0">
            <el-button type="primary" size="mini">
              <img src="../../assets/images/map/ranging.png" alt="" @click="handleDistanceMeasure"/>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-circle-plus" command="a">测距</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete-solid" v-for="(item, index) in distanceLabelArr" :key="item.id" :command="'b-' + index">
                删除线路{{ index + 1 }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': areaMeasureShowFlag }" effect="dark" content="测面" placement="top">
          <img src="../../assets/images/map/MeasuringSurface.png" alt="" @click="handleAreaMeasure" v-if="areaPolygonArr.length == 0"/>
          <el-dropdown size="mini" @command="handleCommandArea" v-if="areaPolygonArr.length > 0">
            <el-button type="primary" size="mini">
              <img src="../../assets/images/map/MeasuringSurface.png" alt="" @click="handleAreaMeasure"/>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-circle-plus" command="a">测距面</el-dropdown-item>
              <el-dropdown-item icon="el-icon-delete-solid" v-for="(item, index) in areaPolygonArr" :key="item.id" :command="'b-' + index">
                删除面积{{ index + 1 }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': showRollerShutter }" effect="dark" content="卷帘" placement="top">
          <img src="../../assets/images/map/RollerShutter.png" alt="" @click="handleRollerShutter"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" effect="dark" content="截图" placement="top">
          <img src="../../assets/images/map/screenshot.png" alt="" @click="exportMap"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': layerManagerShowFlag }" effect="dark" content="图层管理" placement="top">
          <img src="../../assets/images/map/layer.png" alt="" @click="handleLayerManager"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': layerLegendShowFlag }" effect="dark" content="图例" placement="top">
          <img src="../../assets/images/map/legend.png" alt="" @click="handleLayerLegend"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': navigationCesiumShowFlag }" effect="dark" content="罗盘" placement="top">
          <img src="../../assets/images/map/compass.png" alt="" @click="navigationCesium"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': hawkEyeMapShowFlag }" effect="dark" content="鹰眼图" placement="top">
          <img src="../../assets/images/map/EagleEye.png" alt="" @click="hawkEyeMapBtn"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': searchAttribute }" effect="dark" content="查询属性" placement="top">
          <img src="../../assets/images/map/query.png" alt="" @click="searchAttributeBtn"/>
        </el-tooltip>
        <el-tooltip class="map-btn" :enterable="false" :class="{ 'map-active': handleHotShowFlag }" effect="dark" content="热点列表" placement="top">
          <img src="../../assets/images/map/hotspot.png" alt="" @click="handleHotList"/>
        </el-tooltip>
<!--        <el-tooltip class="map-btn" :enterable="false" effect="dark" content="图层对比" placement="top">-->
<!--          <img src="../../assets/images/map/contrast.png" alt="" @click="contrastBtn"/>-->
<!--        </el-tooltip>-->
        <el-tooltip class="map-btn" :enterable="false" effect="dark" content="复位" placement="top">
          <img src="../../assets/images/map/reset.png" alt="" @click="resetBtn"/>
        </el-tooltip>
      </div>
    </div>
    {{ checkState }}
    <!--对比地图-->
    <div id="MapDivision" v-show="divisionShowFlag">
      <!-- 对比模块 -->
      <Map-division v-if="divisionShowFlag" />
      <!--退出对比-->
      <div class="outDivision" @click="outDivision">退出对比</div>
    </div>
    <!-- 图例 -->
    <div class="legend" v-show="layerLegendShowFlag">
      <!-- 当一地一档或者产业发展某一个有数据，图例图片就不显示 -->
      <img :src="legendImg" v-if="!layerNewLegendShowFlag"/>
      <!-- 只要某一个有数据，就会显示相应的图例 -->
      <div class="boxBg" v-else>
        <div class="BgColor" :style="{'--Color':NewLegend?.Bgcolor}"></div>
        <div class="BgName">{{NewLegend?.BgName}}</div>
      </div>
    </div>
    <!-- 时间轴 -->
    <div class="time-line-wrap" v-if="isShowTimeLine">
      <div class="time-player">
        <img src="./videoPlay.png" @click="playTimeImage" v-if="isPlay === false" alt=""/>
        <img src="./videoPause.png" @click="pausePlay" v-if="isPlay === true" alt=""/>
      </div>
      <div class="time-slider">
        <el-slider v-model="currentTimeNode" :format-tooltip="timestepToolTip" :step="timeStep" @change="changePlay" :show-stops="true" :show-tooltip="false" :marks="marksData">
        </el-slider>
      </div>
    </div>
    <!--街景：暂时不加-->
    <!-- <div id="streetscape"></div> -->
    <!-- 卷帘模块 -->
    <roller-shutter v-if="showRollerShutter" />
    <!-- 热点列表 -->
    <div class="hotBox" v-if="handleHotShowFlag">
      <div class="hotTitle">
        <span>热点列表</span>
        <span class="removeBtn" @click="clearHot()">
          <i class="el-icon-delete"></i>
          清空热点
        </span>
      </div>
      <div class="hotList">
        <div v-for="(item, index) in hotList" class="hotItem">
          <div class="text" title="item.name">
            <el-input v-model="item.name" placeholder="请输入内容" autofocus="true" v-if="editHotIndex == index" @blur="hotInputChange"></el-input>
            <div v-if="editHotIndex != index">{{ item.name }}</div>
          </div>
          <div class="btnGroup">
            <i class="el-icon-location-outline" title="定位" @click="flyToHot(item)"></i>
            <i class="el-icon-edit" title="编辑" @click="editHot(index)"></i>
            <i class="el-icon-delete" title="删除" @click="removeHot(item.id)"></i>
          </div>
        </div>
      </div>
      <div class="addBtn" @click="addHotBtn" :class="{ addPoint: addHot }">
        <i class="el-icon-plus"></i>
        <span>添加热点</span>
      </div>
    </div>
    <!-- 底部状态栏 -->
    <div class="bottom-status-panel">
      <div class="bottom-status-panel-item">
        <span>经度：</span>
        <span>{{ earthMsg.lon }}</span>
      </div>
      <div class="bottom-status-panel-item">
        <span>纬度：</span>
        <span>{{ earthMsg.lat }}</span>
      </div>
      <div class="bottom-status-panel-item">
        <span>视高：</span>
        <span>{{ earthMsg.viewHeight }}</span>
      </div>
      <div class="bottom-status-panel-item">
        <span>海拔：</span>
        <span>{{ earthMsg.elevation }}</span>
      </div>
      <div class="bottom-status-panel-item">
        <span>层级：</span>
        <span>{{ earthMsg.level }}</span>
      </div>
    </div>
    <!-- 框选数据 -->
    <leftMap ref="leftMap" :positionData="positionData"></leftMap>
  </div>
</template>

<script>
import mapBaseMixin from './mixins/mapBaseMixin'
import mapEventMixin from './mixins/mapEventMixin'
import mapLayerManager from './mixins/mapLayerManager'
import RollerShutter from '@/components/RollerShutter'
import MapDivision from '@/components/MapDivision'
import html2canvas from 'html2canvas'
import leftMap from '../LayerQueries/index.vue'
import { deleteHotspot, putHotspot, deleteAllHotspot } from '@/api/hotspot'
import {
  getLayerSelectionAcreage,
  postLayerTypeList,
  postMapServiceList,
  postLayerList
} from '@/api/layerData'
import store from "@/store";
import {ControlChildName} from "../../filters/ControlRedLine"

let lonLatArr = []
export default {
  name: 'BaseMap',
  mixins: [mapBaseMixin, mapEventMixin, mapLayerManager],
  components: {
    RollerShutter,
    MapDivision,
    leftMap
  },
  data() {
    return {
      showRollerShutter: false, //卷帘显示与隐藏
      layerManagerShowFlag: false, //图层管理显示隐藏
      lonlatShowFlag: false, //经纬网显示隐藏
      dimensionShowFlag: false, //二三维切换
      layerLegendShowFlag: false, //图例显示隐藏
      navigationCesiumShowFlag: false, //比例尺、缩放、罗盘显示隐藏
      hawkEyeMapShowFlag: null, //鹰眼图显示隐藏
      handleHotShowFlag: false, //热点列表展示隐藏
      addHot: false, //点击添加热点
      hotList: [], //热点俩表
      editHotIndex: -1, //编辑热点
      divisionShowFlag: false, //对比显示隐藏
      handler: null, //对比事件
      handler1: null, //对比事件

      boxSelectionShowFlag: false, //框选功能选中
      handlerBox: null, //事件
      currentPoint: null, //编辑点
      pointsId: [], //所有编辑点
      rect: null, //框选区域
      gon: null, //编辑事件
      coorfinateText: '', //坐标区域
      a: 0,//影像显示状态

      primitiveInstance1:null,//绘制几何图形
      searchBtnRect:false,//查询框选的显示状态
      pointEntityMark:null,//热点标记点位
    }
  },
  async mounted() {
    //获取图层树
    await this.getTreeList();
    //获取所有图层
    await this.getLayers();
  },
  computed: {
    //统计图层树节点数
    layerManager() {
      return (
        this.imageLayers.length +
        this.terrainProviders.length +
        this.tilesets.length +
        this.timeImageLayers.length
      )
    },
    //判断热点数量
    showDetail() {
      return this.$store.state.hot.hotList.length > 0 ? true : false
    },
    //图例
    legendImg() {
      this.layerLegendShowFlag = this.$store.state.legend.legend != '' ? true : false
      return this.$store.state.legend.legend
    },
    // 获取对应图例数据并渲染
    NewLegend(){
      return this.$store.state.legend.NewLegend
    },
    //判断图例显示类型
    layerNewLegendShowFlag(){
      return !!this.$store.state.legend.NewLegend?.Bgcolor
    },
    //时序影像展示第一个时序
    checkState() {
      if (this.$store.state.layers.layerArr.length > 0) {
        if (this.$store.state.legend.status) {
          this.a = 1
          this.treeCheckChange(
            this.$store.state.layers.layerArr[4].children[0],
            true
          )
        } else {
          if (this.a == 1) {
            this.a = 0
            this.treeCheckChange(
              this.$store.state.layers.layerArr[4].children[0],
              false
            )
          } else {
          }
        }
      }
      return
    }
  },
  beforeDestroy() {
    this.removePrimitive();
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
    //获取图层
    async getLayers() {
      let param = {
        keyword:'',
        page:0,
        pageSize:10,
        layerTypeId:'',
        serviceType:''
      };
      postLayerList(param).then(async res => {
        let newArr = []
        res.records.map((item) => {
          newArr.push({
            key: item.id,
            label: item.layerName
          })
        })
        await this.$store.dispatch('changeAdminLayerArr',newArr);
      })
    },
    //获取图层树
    async getTreeList() {
      let params = {
        "keyword": "",
        "page": 0,
        "pageSize": 0
      };
      await Promise.all([postLayerTypeList(params), postMapServiceList(params)]).then(
        async (response) => {
          let newTree = [];
          let layerList = store.state.user.layerList;
          response[0].records.map((res) => {
            let newLayerList = [];
            res.layerList.map(x => {
              let index = layerList.findIndex(item => item.id === x.id);
              if(index > -1){
                newLayerList.push({
                  'layerName':x.name,
                  'treeId':x.id,
                  ...x
                })
              }
            })
            if(newLayerList.length > 0){
              newTree.push({
                treeId: res.id,
                disabled: true,
                layerName: res.name,
                children: newLayerList
              })
            }
          })
          newTree.push({
            treeId: 'outService',
            disabled: true,
            layerName: '外部服务',
            children: response[1].records
          })
          // 添加对照名称
          newTree.forEach(item => {
            this.$set(item, 'ControlName', item.layerName)
            if (item.children.length) {
              item.children.forEach(ite => {
                let index = ControlChildName.findIndex(
                 it => it.oldName == ite.layerName
                )
                if (index != -1) {
                  this.$set(ite, 'ControlName', ControlChildName[index].newName)
                } else {
                  this.$set(ite, 'ControlName', ite.layerName)
                }
              })
            }
          })
          this.treeData1 = newTree;
        }
      )
    },
    //删除定位点
    removePrimitive(){
      if(this.primitiveInstance1){
        viewer.entities.remove(this.primitiveInstance1);
        this.primitiveInstance1 = null;
      }
    },
    // 定位点
    positionData(item){
      // 点位框选
      if(item.geometry.type=='Point'){
        this.flyTo(item.geometry.coordinates[0],item.geometry.coordinates[1],600)
        return
      }
      this.removePrimitive();
      let maskpointArray = [];
      for (let i = 0; i < item.geometry.coordinates[0][0].length; i++) {
        maskpointArray.push(item.geometry.coordinates[0][0][i][0]);
        maskpointArray.push(item.geometry.coordinates[0][0][i][1]);
      }
      let maskspoint = Cesium.Cartesian3.fromDegreesArray(maskpointArray);
      let entity2 = new Cesium.Entity({
        id: 3,
        polyline: {
          positions: maskspoint,
          width: 2,
          material: Cesium.Color.fromCssColorString('#6dcdeb')
        }
      });
      this.primitiveInstance1 = viewer.entities.add(entity2);
      viewer.flyTo(entity2,{
        duration: 3,//飞行时间,单位：秒
        offset: {
          heading: Cesium.Math.toRadians(0.0),//旋转角度
          pitch: Cesium.Math.toRadians(-100),//倾斜角度
          // range: updatedPositions.obj.eyeHeight//视角高度
          range:1000
        }
      });
    },

    //查询框选
    async searchRect(val) {
      this.removePrimitive();
      if(this.coorfinateText === ''){
        this.$notify({
          title: '信息提示',
          type: 'warning',
          message: '请添加框选区域',
          position: 'bottom-right'
        });
        return;
      }

      let layerId = this.$store.state.legend.layerId;
      let layerName = this.$store.state.layerName.currentWFSLayerName[0];
      if(layerId === ''){
        this.$notify({
          title: '信息提示',
          type: 'warning',
          message: '无此图层数据',
          position: 'bottom-right'
        });
        return;
      }
      let data={
        fieldScope:'selection',//绑定字段区分selection框选字段，statistic统计字段
        layerId,
        pageSize: val?val.pageSize:10,
        page: val?val.page:1,
        maxFeatures:'',
        typeName:`gserver:${layerName}`,
        CQL_FILTER:`INTERSECTS(the_geom, POLYGON((${this.coorfinateText})))`
      };
      if (data.typeName) {
        await getLayerSelectionAcreage(data).then(res => {
          this.$refs.leftMap.dataList(res);
        })
      }
    },
    //获取坐标区域
    getCoorfinateText(dke) {
      let east = Cesium.Math.toDegrees(dke.east) //东
      let west = Cesium.Math.toDegrees(dke.west) //西
      let north = Cesium.Math.toDegrees(dke.north) //北
      let south = Cesium.Math.toDegrees(dke.south) //南
      let pointLT = west + ' ' + north //左上角坐标
      let pointLB = west + ' ' + south //左下角坐标
      let pointRT = east + ' ' + south //右上角坐标
      let pointRB = east + ' ' + north //右下角坐标
      this.coorfinateText =
        pointLT + ',' + pointLB + ',' + pointRB + ',' + pointRT + ',' + pointLT
    },
    //结束框选
    endRect() {
      this.searchBtnRect = true;
      //鼠标变成默认
      document.getElementById('MapContainer').style.cursor = 'default'
      viewer.scene.screenSpaceCameraController.enableRotate = true
      viewer.scene.screenSpaceCameraController.enableZoom = true
      if (this.handlerBox !== null && !this.handlerBox.isDestroyed()) {
        this.handlerBox.destroy()
      }
      for (let id of this.pointsId) {
        viewer.entities.removeById(id)
      }
      this.pointsId = []
      if (this.gon) {
        let dke = this.gon.rectangle.coordinates.getValue()
        this.getCoorfinateText(dke)
      }
      this.gon = null
    },
    //编辑框选
    editRect() {
      this.searchBtnRect = false;
      document.getElementById('MapContainer').style.cursor = 'pointer'
      //去掉双击事件
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
      this.handlerBox = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      let isEditting = false
      let entityBox = viewer.entities.getById('rectBox')
      if (entityBox.name === 'rectBox' && !isEditting) {
        this.gon = entityBox
        // 生成边界编辑点
        let degrees = this.gon.rectangle.coordinates.getValue()
        let cartesianArr = []
        let westNorth = Cesium.Cartesian3.fromRadians(
          degrees.west,
          degrees.north
        )
        westNorth.flag = 'westNorth'
        cartesianArr.push(westNorth)
        let eastNorth = Cesium.Cartesian3.fromRadians(
          degrees.east,
          degrees.north
        )
        eastNorth.flag = 'eastNorth'
        cartesianArr.push(eastNorth)
        let eastSouth = Cesium.Cartesian3.fromRadians(
          degrees.east,
          degrees.south
        )
        eastSouth.flag = 'eastSouth'
        cartesianArr.push(eastSouth)
        let westSouth = Cesium.Cartesian3.fromRadians(
          degrees.west,
          degrees.south
        )
        westSouth.flag = 'westSouth'
        cartesianArr.push(westSouth)
        for (let i = 0; i < cartesianArr.length; i++) {
          let cartesian = cartesianArr[i]
          let point = viewer.entities.add({
            name: 'rect_point',
            position: cartesian,
            point: {
              color: Cesium.Color.WHITE,
              pixelSize: 8,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 1,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND //贴地
            }
          })
          point.flag = cartesian.flag
          this.pointsId.push(point.id)
        }
        // 生成中心编辑点
        let centerLng = (degrees.west + degrees.east) / 2
        let centerLat = (degrees.north + degrees.south) / 2
        let rect_center_cartesian = Cesium.Cartesian3.fromRadians(
          centerLng,
          centerLat
        )
        let pointTemp = viewer.entities.add({
          name: 'rect_point',
          position: rect_center_cartesian,
          point: {
            color: Cesium.Color.RED,
            pixelSize: 10,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND //贴地
          }
        })
        pointTemp.flag = 'center'
        this.pointsId.push(pointTemp.id)

        isEditting = true
        viewer.scene.screenSpaceCameraController.enableRotate = false
        viewer.scene.screenSpaceCameraController.enableZoom = false
      }
      //鼠标点击事件
      this.handlerBox.setInputAction((event) => {
        let windowPosition = event.position
        let pickedObject = viewer.scene.pick(windowPosition)
        if (Cesium.defined(pickedObject)) {
          let entity = pickedObject.id
          if (entity.name === 'rect_point') {
            this.currentPoint = entity
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

      // 对鼠标移动事件的监听
      this.handlerBox.setInputAction((event) => {
        if (
          isEditting &&
          this.currentPoint &&
          this.currentPoint.name == 'rect_point'
        ) {
          //获取加载地形后对应的经纬度和高程：地标坐标
          let ray = viewer.camera.getPickRay(event.endPosition)
          let cartesian = viewer.scene.globe.pick(ray, viewer.scene)
          let points = []
          if (!cartesian) {
            return
          }
          //更新当前点的位置
          this.currentPoint.position = cartesian
          for (let i = 0; i < this.pointsId.length; i++) {
            if (this.currentPoint.id == this.pointsId[i]) {
              let objTemp = this.currentPoint.position._value
              objTemp.flag = this.currentPoint.flag
              points.push(objTemp)
            } else {
              let id = this.pointsId[i]
              let objTemp = viewer.entities.getById(id).position._value
              objTemp.flag = viewer.entities.getById(id).flag
              points.push(objTemp)
            }
          }
          if (typeof this.currentPoint == 'undefined') {
            let radians = Cesium.Rectangle.fromDegrees(west, south, east, north)
            return radians
          }
          //当前移动是哪个点，获取新的矩形边界
          let ellipsoid = viewer.scene.globe.ellipsoid
          let lngArr = []
          let latArr = []
          if (
            this.currentPoint.flag == 'westNorth' ||
            this.currentPoint.flag == 'eastSouth'
          ) {
            for (let i = 0; i < points.length; i++) {
              if (
                points[i].flag == 'westNorth' ||
                points[i].flag == 'eastSouth'
              ) {
                let cartographic = ellipsoid.cartesianToCartographic(points[i])
                let lng = Cesium.Math.toDegrees(cartographic.longitude)
                let lat = Cesium.Math.toDegrees(cartographic.latitude)
                lngArr.push(lng)
                latArr.push(lat)
              }
            }
          } else if (
            this.currentPoint.flag == 'eastNorth' ||
            this.currentPoint.flag == 'westSouth'
          ) {
            for (let i = 0; i < points.length; i++) {
              if (
                points[i].flag == 'eastNorth' ||
                points[i].flag == 'westSouth'
              ) {
                let cartographic = ellipsoid.cartesianToCartographic(points[i])
                let lng = Cesium.Math.toDegrees(cartographic.longitude)
                let lat = Cesium.Math.toDegrees(cartographic.latitude)
                lngArr.push(lng)
                latArr.push(lat)
              }
            }
          } else if (this.currentPoint.flag == 'center') {
            let cartographic = ellipsoid.cartesianToCartographic(
              this.currentPoint.position._value
            )
            let centerLng = Cesium.Math.toDegrees(cartographic.longitude)
            let centerLat = Cesium.Math.toDegrees(cartographic.latitude)
            let rectInfo = this.gon.rectangle.coordinates.getValue()
            let rectWidth =
              Cesium.Math.toDegrees(rectInfo.east) -
              Cesium.Math.toDegrees(rectInfo.west)
            let rectHeight =
              Cesium.Math.toDegrees(rectInfo.north) -
              Cesium.Math.toDegrees(rectInfo.south)
            let rectInfoEast = centerLng + rectWidth / 2
            lngArr.push(rectInfoEast)
            let rectInfoWest = centerLng - rectWidth / 2
            lngArr.push(rectInfoWest)
            let rectInfoNorth = centerLat + rectHeight / 2
            latArr.push(rectInfoNorth)
            let rectInfoSouth = centerLat - rectHeight / 2
            latArr.push(rectInfoSouth)
          }
          let east = Math.max.apply(null, lngArr)
          let west = Math.min.apply(null, lngArr)
          let north = Math.max.apply(null, latArr)
          let south = Math.min.apply(null, latArr)
          //更新所有编辑点的位置
          for (let i = 0; i < this.pointsId.length; i++) {
            let id = this.pointsId[i]
            let entityTemp = viewer.entities.getById(id)
            if (
              typeof entityTemp != 'undefined' &&
              typeof this.currentPoint != 'undefined'
            ) {
              if (entityTemp.flag != this.currentPoint.flag) {
                if (entityTemp.flag == 'westNorth') {
                  entityTemp.position = Cesium.Cartesian3.fromDegrees(
                    west,
                    north
                  )
                } else if (entityTemp.flag == 'eastNorth') {
                  entityTemp.position = Cesium.Cartesian3.fromDegrees(
                    east,
                    north
                  )
                } else if (entityTemp.flag == 'eastSouth') {
                  entityTemp.position = Cesium.Cartesian3.fromDegrees(
                    east,
                    south
                  )
                } else if (entityTemp.flag == 'westSouth') {
                  entityTemp.position = Cesium.Cartesian3.fromDegrees(
                    west,
                    south
                  )
                } else if (entityTemp.flag == 'center') {
                  let centerLng = (west + east) / 2
                  let centerLat = (north + south) / 2
                  entityTemp.position = Cesium.Cartesian3.fromDegrees(
                    centerLng,
                    centerLat
                  )
                }
              }
            }
          }
          if (west >= east || south >= north) {
            this.currentPoint = undefined
            return
          }
          let radians = Cesium.Rectangle.fromDegrees(west, south, east, north)
          //更新矩形位置
          this.gon.rectangle.coordinates = new Cesium.CallbackProperty(
            function (time, result) {
              return radians
            },
            false
          )
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // 对鼠标抬起事件的监听
      this.handlerBox.setInputAction((event) => {
        // isEditting = false;
        this.currentPoint = undefined
      }, Cesium.ScreenSpaceEventType.LEFT_UP)
    },
    //删除框选
    removeRect() {
      this.endRect();
      this.coorfinateText = '';
      viewer.entities.remove(this.rect);
      this.removePrimitive();
      this.searchBtnRect = false;
      this.boxSelectionShowFlag = false;
      this.$refs.leftMap.dataList();
    },
    //框选功能
    async rectGather() {
      let layerName = this.$store.state.layerName.currentWFSLayerName[0];
      //有对应属性矢量图层
      if (!layerName){
        this.$notify({
          title: '信息提示',
          type: 'warning',
          message: '请添加对应矢量图层',
          position: 'bottom-right'
        });
        return;
      }
      await this.getLayerId(layerName);//获取图层ID
      if(this.boxSelectionShowFlag){//判断框选状态
        this.removeRect();
        return;
      }
      this.searchBtnRect = true;
      this.boxSelectionShowFlag = true;
      let startPoint = null //起始点
      //鼠标变成加号
      document.getElementById('MapContainer').style.cursor = 'crosshair'
      //进制地图移动
      viewer.scene.screenSpaceCameraController.enableRotate = false
      viewer.scene.screenSpaceCameraController.enableZoom = false
      this.handlerBox = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      //鼠标点击事件
      this.handlerBox.setInputAction((event) => {
        //获取加载地形后对应的经纬度和高程：地标坐标
        let ray = viewer.camera.getPickRay(event.position)
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (!Cesium.defined(cartesian)) {
          return
        }
        startPoint = viewer.entities.add({
          name: 'point',
          position: cartesian,
          point: {
            color: Cesium.Color.CHARTREUSE.withAlpha(1),
            pixelSize: 10,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1
          }
        })

        this.rect = viewer.entities.add({
          id: 'rectBox',
          name: 'rectBox',
          rectangle: {
            coordinates: Cesium.Rectangle.fromCartesianArray([
              cartesian,
              cartesian
            ]),
            material: Cesium.Color.GREENYELLOW.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3
          }
        })
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

      // 对鼠标移动事件的监听
      this.handlerBox.setInputAction((event) => {
        if (startPoint == null || this.rect == null) {
          return
        }
        //获取加载地形后对应的经纬度和高程：地标坐标
        let ray = viewer.camera.getPickRay(event.endPosition)
        let cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        if (!cartesian) {
          return
        }
        let startCartesian = startPoint.position.getValue(
          Cesium.JulianDate.now()
        )

        this.rect.rectangle.coordinates = new Cesium.CallbackProperty(function (
            time,
            result
          ) {
            return Cesium.Rectangle.fromCartesianArray([
              startCartesian,
              cartesian
            ])
          },
          false)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // 对鼠标抬起事件的监听(结束点采集)
      this.handlerBox.setInputAction((event) => {
        //鼠标变成默认
        document.getElementById('MapContainer').style.cursor = 'default'
        viewer.scene.screenSpaceCameraController.enableRotate = true
        viewer.scene.screenSpaceCameraController.enableZoom = true
        viewer.entities.remove(startPoint)
        //移除地图鼠标点击事件
        this.handlerBox.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
        //移除地图鼠标移动事件
        this.handlerBox.removeInputAction(
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        )
        //移除地图鼠标抬起事件
        this.handlerBox.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)

        let dke = this.rect.rectangle.coordinates.getValue()
        // console.log("修改后的面坐标(笛卡尔)：", dke);
        this.getCoorfinateText(dke)
      }, Cesium.ScreenSpaceEventType.LEFT_UP)
    },
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
    //添加热点时状态
    addHotBtn() {
      if (this.addHot) {
        this.$notify({
          title: '信息提示',
          type: 'warning',
          message: '功能已开启，请点击图层添加对应热点。',
          position: 'bottom-right'
        });
        return
      }
      this.addHot = true
    },
    //热点列表显示隐藏
    async handleHotList() {
      this.showRollerShutter = false
      this.layerManagerShowFlag = false
      this.handleHotShowFlag = !this.handleHotShowFlag
      if (this.handleHotShowFlag) {
        await this.getHotspot()
        for (let i = 0; i < this.hotList.length; i++) {
          this.addEntities(this.hotList[i], 'str')
        }
      } else {
        for (let i = 0; i < this.hotList.length; i++) {
          viewer.entities.removeById(this.hotList[i].id)
        }
        this.hotList = []
      }
    },
    //点位名称
    addEntities(item, i) {
      let textArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      // 热点图标
      const pinBuilder = new Cesium.PinBuilder()
      let text = ''
      if (i == 'str') {
        text = item.name.slice(-1, item.name.length)
      } else {
        text = textArr[(i - 1) % 26]
      }
      viewer.entities.add({
        id: item.id,
        name: '标注点',
        position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat),
        billboard: {
          image: pinBuilder
            .fromText(text, Cesium.Color.ROYALBLUE, 40)
            .toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        }
      })
    },
    //清除热点图标
    clearHot() {
      let params = {
        primaryKeys: []
      }
      this.hotList.map((item) => {
        params.primaryKeys.push(item.id)
      })
      deleteAllHotspot(params)
        .then((res) => {
          for (let i = 0; i < this.hotList.length; i++) {
            viewer.entities.removeById(this.hotList[i].id)
          }
          this.hotList = []
        })
        .catch((err) => {})
    },
    //热点输入框失去焦点
    hotInputChange() {
      let params = {
        id: this.hotList[this.editHotIndex].id,
        name: this.hotList[this.editHotIndex].name,
        lon: this.hotList[this.editHotIndex].lon,
        lat: this.hotList[this.editHotIndex].lat
      }
      putHotspot(params)
        .then((res) => {
          this.editHotIndex = -1
          this.getHotspot()
        })
        .catch((err) => {})
    },
    //编辑热点
    editHot(index) {
      this.editHotIndex = index
    },
    //移除热点
    removeHot(id) {
      let that = this
      deleteHotspot(id).then((res) => {
        // 根据ID删除
        viewer.entities.removeById(id)
        this.getHotspot()
      })
    },
    /* 热点图放大 */
    HeightApi (item) {
      // 镜头拉进,
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(item.lon, item.lat,2000/1.8),
        duration:1.0
      })
    },
    //飞去热点
    flyToHot(item) {
      this.HeightApi(item)
      this.mark(item)
    },
    // 当前热点标记 TODO
    mark(item){
      if(this.pointEntityMark){//清除初始标记加载新图层
        viewer.entities.remove(this.pointEntityMark);
        // this.pointEntityMark.destroy();
        this.pointEntityMark = null;
      }
      this.pointEntityMark = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 0.0), // 点的位置
        point: {
          color: Cesium.Color.RED, // 颜色
          outlineColor: Cesium.Color.PINK, // 轮廓线颜色
          outlineWidth: 5, // 轮廓线宽度
          pixelSize: 8, // 点的大小
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10, 10000), // 可视距离
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 相对高度
          scaleByDistance: new Cesium.NearFarScalar(100, 1, 10000, 1), // 距离缩放
          translucencyByDistance: new Cesium.NearFarScalar(100, 0.4, 200, 0.8), // 距离透明
          show: true, // 显示和隐藏
        }
      })
    },
    //查询属性显隐
    searchAttributeBtn() {
      const layerName = this.$store.state.layerName.currentWFSLayerName[0]
      //有对应属性矢量图层
      if (!layerName) {
        this.$notify({
          title: '错误',
          type: 'error',
          message: '请添加对应矢量图层以查询数据',
          position: 'bottom-right'
        });
        return
      }
      this.searchAttribute = !this.searchAttribute
    },
    // 图层管理显隐
    handleLayerManager() {
      this.layerManagerShowFlag = !this.layerManagerShowFlag
      this.showRollerShutter = false
      //关闭热点列表
      if (this.handleHotShowFlag) {
        this.handleHotList()
      }
    },
    //鹰眼图显示隐藏
    hawkEyeMapBtn() {
      if (this.hawkEyeMapShowFlag == null) {
        // 鹰眼地图初始化
        const hawkEyeMap = new HawkEye2DMap(viewer)
        hawkEyeMap._init()
        this.hawkEyeMapShowFlag = true
        return
      }
      let demo = document.getElementById('hawkEye2dMap')
      if (this.hawkEyeMapShowFlag) {
        demo.style.display = 'none'
      } else {
        demo.style.display = 'block'
      }
      this.hawkEyeMapShowFlag = !this.hawkEyeMapShowFlag
    },
    //退出对比
    outDivision() {
      this.clearHandler()
      this.divisionShowFlag = false
      window.viewerBox = null
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
    // //图形对比
    // contrastBtn() {
    //   this.resetBtn() //复位
    //   this.divisionShowFlag = true
    //   // 实例化web球，viewer示例对象放在window上
    //   window.viewerBox = new GT.GeoCanvas('MapDivision', {
    //     shouldAnimate: true,
    //     animation: false,
    //     timeline: false,
    //     baseLayerPicker: false,
    //     // fullscreenButton: true,//全屏
    //     contextOptions: {
    //       webgl: {
    //         alpha: true,
    //         depth: false,
    //         stencil: true,
    //         antialias: true,
    //         premultipliedAlpha: true,
    //         preserveDrawingBuffer: true,
    //         failIfMajorPerformanceCaveat: true
    //       },
    //       allowTextureFilterAnisotropic: true
    //     }
    //   })
    //   this.initBaseLayer1()
    //   this.initHandler(viewer, viewerBox)
    // },
    //初始化对比地图
    // initBaseLayer1() {
    //   const { baseUrl } = window.gis
    //   // wmts
    //   const WMTSWorld = new Cesium.WebMapTileServiceImageryProvider({
    //     url: `${baseUrl}/maptilecache/service/wmts`,
    //     layer: '全球影像-PNG-4326',
    //     tileMatrixSetID: 'EPSG:4326',
    //     format: 'image/png',
    //     tilingScheme: new Cesium.GeographicTilingScheme()
    //     // token: getToken(),
    //     // minimumLevel: item.minLevel,
    //     // maximumLevel: item.maxLevel,
    //   })
    //   // wms底图
    //   const WMSWorld = new Cesium.WebMapServiceImageryProvider({
    //     url: `${baseUrl}/maptilecache/service/wms`,
    //     layers: '全球影像-PNG-4326',
    //     parameters: {
    //       // transparent: true,
    //       format: 'image/png'
    //     },
    //     srs: 'EPSG:4326'
    //   })
    //   // wms地名
    //   const WMSName = new Cesium.WebMapServiceImageryProvider({
    //     url: `${baseUrl}/maptilecache/service/wms`,
    //     layers: '全球地名-PNG-4326',
    //     parameters: {
    //       // transparent: true,
    //       format: 'image/png'
    //     },
    //     srs: 'EPSG:4326'
    //   })
    //   viewerBox.imageryLayers.addImageryProvider(WMSWorld)
    //   viewerBox.imageryLayers.addImageryProvider(WMSName)
    // },
    //两个地图联动对比
    // initHandler(viewer0, viewer1) {
    //   var _self = this
    //   if (
    //     _self.handler &&
    //     _self.handler.getInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    //   ) {
    //     return
    //   }
    //   _self.handler = new Cesium.ScreenSpaceEventHandler(viewer0.scene.canvas)
    //   _self.handler1 = new Cesium.ScreenSpaceEventHandler(viewer1.scene.canvas)
    //   _self.handler.setInputAction(function (movement) {
    //     var _camerca = viewer0.camera
    //     viewer1.camera.setView({
    //       destination: _camerca.position,
    //       orientation: {
    //         direction: _camerca._direction,
    //         up: _camerca.up,
    //         heading: _camerca.heading,
    //         pitch: _camerca.pitch,
    //         roll: _camerca.roll
    //       }
    //     })
    //   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    //
    //   _self.handler.setInputAction(function (movement) {
    //     var _camerca = viewer0.camera
    //     viewer1.camera.setView({
    //       destination: _camerca.position,
    //       orientation: {
    //         direction: _camerca._direction,
    //         up: _camerca.up,
    //         heading: _camerca.heading,
    //         pitch: _camerca.pitch,
    //         roll: _camerca.roll
    //       }
    //     })
    //   }, Cesium.ScreenSpaceEventType.WHEEL)
    //
    //   _self.handler1.setInputAction(function (movement) {
    //     var _camerca = viewer1.camera
    //     viewer0.camera.setView({
    //       destination: _camerca.position,
    //       orientation: {
    //         direction: _camerca._direction,
    //         up: _camerca.up,
    //         heading: _camerca.heading,
    //         pitch: _camerca.pitch,
    //         roll: _camerca.roll
    //       }
    //     })
    //   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    //
    //   _self.handler1.setInputAction(function (movement) {
    //     var _camerca = viewer1.camera
    //     viewer0.camera.setView({
    //       destination: _camerca.position,
    //       orientation: {
    //         direction: _camerca._direction,
    //         up: _camerca.up,
    //         heading: _camerca.heading,
    //         pitch: _camerca.pitch,
    //         roll: _camerca.roll
    //       }
    //     })
    //   }, Cesium.ScreenSpaceEventType.WHEEL)
    // },
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
    // 图例显隐
    handleLayerLegend() {
      console.log(this.$refs.treeNode.getCheckedNodes(), '图层树选中节点')
      let vectorList = this.treeData[1].children
      let treeChooseList = this.$refs.treeNode.getCheckedNodes()
      let layerName = this.$store.state.layerName.currentWFSLayerName[0]
      if (treeChooseList.length > 0) {
        let arr = 0
        for (let i = 0; i < treeChooseList.length; i++) {
          let findIndex = vectorList.findIndex(
            (item) => item.layerName == treeChooseList[i].layerName
          )
          if (findIndex > -1) {
            arr++
          }
        }
        if (arr > 0) {
          this.layerLegendShowFlag = !this.layerLegendShowFlag
          return
        }
      } else if (layerName) {
        this.layerLegendShowFlag = !this.layerLegendShowFlag
        return
      }
      this.$notify({
        title: '错误',
        type: 'error',
        message: '暂无图例',
        position: 'bottom-right'
      });
      return
    },
    // 地图场景截屏
    exportMap() {
      const mapDom = document.getElementById('MapContainer')
      html2canvas(mapDom, {
        backgroundColor: null,
        useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
        logging: false // 日志开关，便于查看html2canvas的内部执行流程
      }).then((canvas) => {
        let link = document.createElement('a')
        link.href = canvas.toDataURL() //下载链接
        link.setAttribute('download', '专题图.png')
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
    },
    //卷帘显示隐藏
    handleRollerShutter() {
      this.showRollerShutter = !this.showRollerShutter
      this.layerManagerShowFlag = false
      //关闭热点列表
      if (this.handleHotShowFlag) {
        this.handleHotList()
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
    //图斑查看详情
    showDetails(data) {
      this.$store.dispatch('addhotList', data)
    },
    //更新信息
    showDetailsData(data) {
      this.$store.dispatch('addhotList', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
#MapDivision {
  width: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 50%;
  border-left: 5px solid #cdeefc;
  .outDivision {
    position: fixed;
    bottom: 30px;
    right: 2vw;
    z-index: 1;
    cursor: pointer;
    text-align: center;
    height: 60px;
    width: 130px;
    color: #fff;
    line-height: 60px;
    border: 1px solid #419aff;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.65),
        rgba(65, 154, 255, 1)
    );
  }
}

.map-tools {
  position: absolute;
  top: 90px;
  right: 20px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  width: 100px;
  /*flex-direction: column;*/
  justify-content: space-between;
  align-items: flex-end;
  img {
    width: 24px;
  }
  .map-btn {
    background-color: #dfeef0;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    border: 3px solid transparent;
    margin-bottom: 10px;
    &:hover {
      border-color: #00bbb3;
      box-shadow: 0 0 5px #00bbb3;
    }
  }
  .map-active {
    border-color: #00bbb3;
    box-shadow: 0 0 5px #00bbb3;
  }
  .el-dropdown {
    margin: 0 0 10px 0;
    .el-button {
      margin: 0;
      padding: 0;
      background-color: transparent;
      border-color: transparent;
    }
  }
  .el-button {
    margin: 5px 0;
  }
}

.legend {
  position: absolute;
  right: 20px;
  bottom: 35px;

  .boxBg{
    display: flex;
    padding: 3px 3px;
    align-items: center;
    background-color: #1d3654;
    height: 30px;
    width: 105px;
    .BgColor{
      width: 15px;
      height: 15px;
      background-color: var(--Color);
    }
    .BgName{
      font-size: 12px;
      color: #fff;
      padding-left: 5px;
    }
  }
}

#slider {
  position: absolute;
  left: 50%;
  top: 0px;
  background-color: #cdeefc;
  width: 5px;
  height: 100%;
  z-index: 99;
  //box-shadow: 10px 0 10px #419aff;
}

#slider:hover {
  //cursor: ew-resize;
  cursor: col-resize;
}

.layer-manager {
  position: absolute;
  top: 90px;
  right: 140px;
  z-index: 1;
  border-radius: 3px;
  background-image: linear-gradient(
      to bottom,
      rgb(255 255 255 / 85%),
      rgb(152 199 198 / 85%)
  );
  .layerTree {
    width: 270px;
    max-height: 80vh;
    overflow: auto;
    margin: 10px 10px 10px 0;
    ::v-deep .el-tree {
      background-color: rgba(12, 28, 49, 0);
      color: #0b504d;
      padding: 10px;
      .el-tree-node {
        margin: 5px 0;
      }
      .el-tree-node__label {
        font-size: 16px;
      }
      .el-tree-node__expand-icon {
        color: #0b504d;
      }
      .el-tree-node__content:hover,
      .el-upload-list__item:hover {
        background-color: #cbc1c1;
      }
      .el-tree-node:focus > .el-tree-node__content {
        background-color: #cbc1c1;
      }
      .el-tree-node__label {
        width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-checkbox__inner {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background-color: #fff;
        border: 2px solid #0b504d;
      }
      .el-checkbox__inner::after {
        border: 2px solid #0b504d;
        border-left: 0;
        border-top: 0;
        height: 12px;
        left: 5px;
        top: 0;
        width: 5px;
      }
      .el-tree-node__children .el-tree-node__expand-icon {
        display: none;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner {
        /*background-color: #0B504D;*/
        /*border-color: #0B504D;*/
      }
    }
    //隐藏禁用
    ::v-deep .is-disabled {
      display: none;
    }
  }
}

.time-line-wrap {
  bottom: 60px;
  width: 800px;
  position: absolute;
  z-index: 10;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.65);
  top: 85%;
  right: 15%;
  padding: 45px 20px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ::v-deep .el-slider__button-wrapper {
    width: 42px;
    height: 38px;
    top: -25px;
    .el-slider__button {
      width: 42px;
      height: 38px;
      border: none;
      background-color: transparent;
      border-radius: 0;
      background-image: url('../../assets/images/sliderActive.png');
    }
  }
  ::v-deep .el-slider__stop {
    /*el-slider__stop */
    /*el-slider__marks-stop*/
    height: 14px;
    width: 14px;
    top: -4px;
    border: 2px solid #8c7d73;
  }
  ::v-deep .el-slider__bar {
    background-color: #6c7885b8;
  }
  ::v-deep .el-slider__marks-text {
    padding: 5px 10px;
    margin-top: 20px;
  }
  /*transform: translate(-50%, -50%);*/
}

.time-slider {
  width: 90%;
  display: inline-block;
  height: 55px;
}

.time-player {
  float: left;
  cursor: pointer;
}

.time-player i {
  font-size: 25px;
  color: #409eff;
}

#streetscape {
  overflow: hidden;
  z-index: 1000;
}

.right-box {
  position: absolute;
  right: 430px;
  top: 90px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  background-image: linear-gradient(
      to bottom,
      rgb(255 255 255 / 85%),
      rgb(152 199 198 / 85%)
  );
  color: #0b504d;
  padding: 0 10px;
  font-size: 16px;
  #imageLayers {
    margin: 10px 0;
    padding-right: 10px;
    max-height: 340px;
    width: 280px;
    overflow: auto;
    .image-title {
      .text {
        font-size: 18px;
        display: inline-block;
        float: left;
      }
      .clear-layers {
        float: right;
        cursor: pointer;
        font-weight: 700;
        span {
          font-weight: 400;
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
    .el-card__body,
    .el-main {
      padding: 10px 0;
      padding-top: 0;
      padding-bottom: 20px;
    }

    .row-list-item {
      display: flex;
      width: 100%;
      margin-top: 10px;
      justify-content: space-between;
      align-items: center;
      .long-text-style {
        display: inline-block;
        flex: 1;
        margin-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .row-btn-group {
        display: flex;
        justify-content: flex-end;
        span {
          display: inline-block;
          cursor: pointer;
          margin: 0 4px;
        }
        .disabled-button {
          color: #a59d9d;
          cursor: no-drop;
          opacity: 0.6;
        }
        .el-dropdown {
          margin: 0;
        }
      }
    }
  }
}

.el-dropdown {
  margin: 0 10px;
}

.bottom-status-panel {
  position: absolute;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 25px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  padding-left: 10px;

  &-item {
    width: 155px;
    color: #fff;

    > span:first-child {
      color: #00bbb3;
    }
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    span {
      display: inline-block;
      width: 60px;
    }
    div {
      width: 150px;
    }
  }
}
.hotBox {
  position: absolute;
  top: 90px;
  right: 140px;
  border-radius: 3px;
  background-image: linear-gradient(
      to bottom,
      rgb(255 255 255 / 85%),
      rgb(152 199 198 / 85%)
  );
  color: #0b504d;
  width: 320px;
  .hotTitle {
    font-size: 16px;
    font-weight: 600;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .removeBtn {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .hotList {
    padding: 10px;
    .hotItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .text {
        div {
          width: 195px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .btnGroup {
        i {
          padding: 5px;
          margin-left: 5px;
          cursor: pointer;
          font-size: 20px;
        }
      }
    }
  }
  .addBtn {
    width: auto;
    height: 20px;
    margin: 10px;
    border-radius: 3px;
    background-color: #00b9ff;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-image: linear-gradient(#03b7aa, #0d6f6b);
    padding: 10px;
    span {
      margin-left: 10px;
    }
  }
  .addPoint {
    opacity: 0.8;
    cursor: no-drop;
  }
}
.boxSelection {
  position: absolute;
  top: 90px;
  right: 200px;
  z-index: 2;
}
#imageLayers::-webkit-scrollbar,
.layerTree::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
#imageLayers::-webkit-scrollbar-thumb,
.layerTree::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}
#imageLayers::-webkit-scrollbar-track,
.layerTree::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /*box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
  /*border-radius: 10px;*/
  /*background: #ededed;*/
}
</style>
