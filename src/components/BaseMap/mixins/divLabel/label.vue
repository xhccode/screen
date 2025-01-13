<style lang="scss">
.box1 {
  width: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  font-size: 12px;
}
.box2{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  height: 120px;
  color: #4B2309;
  /*background-image: url("./homePage.gif");*/
  background-image: url("./Board.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 12px;
  .tit{
    font-weight: 700;
  }
}
.box3{
  background-image: url("./cameraIcon.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 12px;
  width: 45px;
  height: 46px;
}
.clearBox{
  width: 100%;
  height: 40px;
}
</style>

<template>
    <div :id="id" class="box1">
        <div class="box2" v-if="!dataList.monitor">
            <span class="clearBox"></span>
            <span class="tit">{{ dataList.title }}</span>
            <span class="">{{dataList.number | baseText}}万亩</span>
        </div>
        <div class="box3" v-if="dataList.monitor" @click="showBox()"></div>
    </div>
</template>

<script>
    export default {
        name: "DynamicLabel",
        filters:{
            baseText(val){
                return (val/10000).toFixed(2)
            }
        },
        data() {
            return {
                show: true,
            };
        },
        props: {
            dataList: {
                type: Object,
                default: () => {},
            },
            id:{
                type:String,
                default:'001'
            }
        },
        methods:{
            showBox(){
                if(this.showMonitor){
                    this.showMonitor();
                }
            },
        }
    };
</script>
