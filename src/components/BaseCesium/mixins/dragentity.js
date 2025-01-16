/**
 * @param {Viewer} viewer
 *
 */
export default class DragEntity{
    constructor(val){
        this.viewer = val.viewer
    }
    addEntity(value){
        let pinBuilder = new Cesium.PinBuilder();
        let poin = this.viewer.entities.add({
            id:value.id,
            name: value.name,
            position: Cesium.Cartesian3.fromDegrees(value.position.x, value.position.y),
            billboard: {
                // image: pinBuilder.fromText(value.text,Cesium.Color.ROYALBLUE, 0).toDataURL(),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            monitoItems:{
                data:value
            },
        });
        return poin
    }

}
