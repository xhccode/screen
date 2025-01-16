<style lang="scss">
.box{
  // width: 450px;
  width: 450px;
  position: relative;
  bottom: 0;
  left: 0;
  .close{
    position: absolute;
    color: #fff;
    font-family: 'pang';
    font-size: 25px;
    top: 0px;
    right: 10px;
    line-height: 40px;
    z-index: 5;
    cursor: pointer;
  }
  .box-wrap {
    position: absolute;
    left: 42%;
    top: 50px;
    width: 100%;
    height: auto;
    z-index: 99;
    min-height: 210px;
    padding-bottom: 10px;
    border-radius: 8px;
    background-image:linear-gradient(to bottom,#a1e5d8e6,#ffffffe6,#ffffff,#ffffffe6,#a1e5d8e6);

  }
  .box-wrap .area {
    position: absolute;
    width: 100%;
    height: 40px;
  }
  .pine {
    position: absolute;
    /*z-index: 1;*/
    width: 100px;
    height: 100px;
    box-sizing: border-box;
    line-height: 120px;
    text-indent: 5px;
  }
  .pine::before {
    content: "";
    position: absolute;
    right: -107px;
    top: 35px;
    width: 100%;
    height: 100px;
    z-index: 99;
    box-sizing: border-box;
    border-bottom: 1px solid #fff;
    transform-origin: bottom center;
    transform: rotateZ(120deg) scale(1.5);
    filter: drop-shadow(1px 0px 2px #03abb4);
  }
  .pine::after {
    content: "";
    position: absolute;
    right: -98px;
    top: 60px;
    width: 6px;
    height: 6px;
    z-index: 99;
    background-color:rgb(255, 119, 0);
    box-sizing: border-box;
    border: 1px solid #fff;
    transform-origin: bottom center;
    transform: rotateZ(120deg) scale(1.5);
  }
  .area .area-title {
    line-height: 40px;
    font-size: 20px;
    font-family: 'pang';
    padding: 0 15px;
  }
  .textColor {
    color: #0d6f6b;
    font-size: 16px;
    font-weight: 600;
  }
  .yellowColor {
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }
  .data-value{
    width: 245px;
    word-break:break-all
  }
  .fontColor {
    font-weight: 900;
    color:#326c69;
    margin-left: 5px;
  }
  .content {
    padding: 60px 20px 0px 30px;
    animation: fontColor 1s;
  }
  .content .data-li {
    margin-bottom: 8px;
    display: flex;
    background-color: #d0eae6;
    padding: 10px 5px;
    align-items: start;
    opacity: .75;
  }
  .btnBox{
    width: 20%;
    padding: 8px 10px;
    margin: 15px auto;

    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    cursor: pointer;
    border-radius: 3px;
    background-image: linear-gradient(#03B7AA, #0D6F6B);
    i{
      margin-left: 6px;
    }
  }
  .data-label{
    margin-right: 15px;
    width: 50%;
  }

  @keyframes fontColor {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>

<template>
    <div :id="id" class="box">
        <div class="box-wrap">
            <div class="topBal">
              <div class="area">
                  <div class="area-title fontColor">
                    <i class="lefticon"></i>
                      <span>{{ title }}</span>
                  </div>
              </div>
               <div class="close" @click="closeClick">X</div>
            </div>
            <div class="content">
                <template v-for="i in commonInfo">
                    <div class="data-li" v-if="i.visible != 2">
                        <div class="data-label textColor">{{i.label | filtersText}}
                          <span v-for="(it,index) in area" :key="index">
                            <span v-if="it.fieldName == i.label">({{it.bindValue}})</span>
                          </span>：
                        </div>
                        <div class="data-value">
                          <span class="label-num yellowColor">{{i | codeText}}</span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="btnBox" @click="showDetails">
                <span class='box12'>查看详情</span>
                <i class="el-icon-right"></i>
            </div>
        </div>
        <div class="pine"></div>
    </div>
</template>

<script>
    import {objArr,codeArr} from "./objName";
    export default {
        name: "DynamicLabel",
        data() {
            return {};
        },
        filters:{
            //中英对照
            filtersText(val){
                for(let key in objArr){
                    if(key === val){
                        return objArr[key]
                    }
                }
                return val
            },
            //获取对应值
            codeText(val){
                for(let key in codeArr){
                    if(key === val.label){
                        for(let item in codeArr[key]){
                            if(val.content == item){
                                return codeArr[key][item]
                            }
                        }
                    }
                }
                return val.content?val.content:'暂无'
            }
        },
        props: {
            title: {
                type: String,
                default:'基本情况',
            },
            commonInfo: {
                type: Array,
                default: [],
            },
            id: {
                type: String,
                default: "001",
            },
            area: {
                type: Array,
                default:[],
            },
        },
        methods:{
            //关闭弹框
            closeClick(){
                if(this.closeEvent){
                    this.closeEvent();
                }
            },
            //显示详情
            showDetails(){
                if(this.showBox){
                    this.showBox();
                }
            }
        },
    };
</script>
