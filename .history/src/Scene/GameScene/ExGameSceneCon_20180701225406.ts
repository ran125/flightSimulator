import {AssetsManager, SceneManager} from "../../public/index";
import {DisplayPool} from "../../public/index";
import {ModuleName} from "../../public/index";
import {EventCon} from "../../other/EventCon";
import {ExGameScene} from "./ExGameScene";
import {GameScenes} from "../../public/index";
import {particleCon} from "../../public/index";
import {CannonCreateObj} from "./CannonCreateObj";
import {UseMaterial} from "./UseMaterial";
import {CarCon} from "./CarCon";
import {CarSkinBind} from "./CarSkinBind";
import {WeatherState} from "../../public/index";


export class ExGameSceneCon extends GameScenes{
    private _gold;
    private static instance: ExGameSceneCon;

    public static get ins(): ExGameSceneCon {
        if (!this.instance) {
            this.instance = new ExGameSceneCon();
        }
        return this.instance;
    }


    protected display;

    protected scene;

    private gameDeState;

    constructor(){
        super()
    }

    protected importMeshes=[]


    public init(){
        DisplayPool.ins.displayPool[ModuleName.GAME_PLAY_SCENE]=this;
    }

    protected resetGame(){

        this.importMeshes=[
            {
                rootUrl:AssetsManager.ins.resourceObject["models"]["gameScene"]["car"].rootUrl,
                sceneFilename:AssetsManager.ins.resourceObject["models"]["gameScene"]["car"].sceneFilename
            },
            {
                rootUrl:AssetsManager.ins.resourceObject["models"]["gameScene"]["wheel"].rootUrl,
                sceneFilename:AssetsManager.ins.resourceObject["models"]["gameScene"]["wheel"].sceneFilename
            },
            {
                rootUrl:AssetsManager.ins.resourceObject["models"]["gameScene"]["map"+localStorage.map].rootUrl,
                sceneFilename:AssetsManager.ins.resourceObject["models"]["gameScene"]["map"+localStorage.map].sceneFilename
            }
        ]
        SceneManager.ins.engine.displayLoadingUI();
        SceneManager.ins.engine.loadingUIText = "Initializing...";
        this.ImportMeshes(this.importMeshes,(newMeshes)=>{
            ExGameScene.ins.creatScene()
            var scene=SceneManager.ins.scene;
            this.scene=SceneManager.ins.scene;
            this.display=ExGameScene.ins.display;
            scene.meshes.forEach((mesh)=>{
                this.display.shadowGenerator.getShadowMap().renderList.push(mesh);
            })
          

            /**
             * 使用皮卡车皮肤
             */
            var carSkinBind=new CarSkinBind(this.scene,this.display);
            carSkinBind.pickupTruckInit()

            var ground = scene.getMeshByName("default");
            console.log("新地图")
            console.log(ground.name)
            ground.scaling.copyFromFloats(1, 1, 1);
            ground["bakeCurrentTransformIntoVertices"]();
            ground.material=this.display.terrainMaterial;

            //设置材质
            var useMaterial=new UseMaterial(scene)
            useMaterial.setCarMaterial()

            //创建物理世界
            let cannonCreateObj=new CannonCreateObj(SceneManager.ins.scene,this.display.shadowGenerator,
                {x:parseInt(localStorage.car_x),y:parseInt(localStorage.car_y),z:parseInt(localStorage.car_z),})
            cannonCreateObj.HeightMap(ground);
            cannonCreateObj.carCtrl();


            let carCon=new CarCon(this.scene,this.display)


            /**
             * 灯光延时跟随相机
             */
            setInterval(()=>{
                this.display.light3.position=new BABYLON.Vector3(
                    this.scene.getMeshByName("carBox").position.x,
                    this.scene.getMeshByName("carBox").position.y+1,
                    this.scene.getMeshByName("carBox").position.z-0
                );
            },500)




            //湖水
            this.waterRenderList()


            if(localStorage.weatherState==WeatherState.RAIN_DAY){
                //闪电
                this.setLightning()

                //下雨
                this.setRain()

                this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                this.scene.fogDensity = 0.005;
                this.scene.fogColor = new BABYLON.Color3(0.3,0.3,0.3);

                carCon.setCarLight(true)

                this.display.postProcess.depth=0.08
                this.display.postProcess1.depth=0.08

                this.display.light.intensity=0.1
                this.display.light2.intensity=0.1
                this.display.light3.intensity=0.2
                this.display.lensFlareSystem3.dispose()
            }


            if(localStorage.weatherState==WeatherState.SUNNY_DAY){

                this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                this.scene.fogDensity = 0.001;
                this.scene.fogColor = new BABYLON.Color3(1,1,1);

                carCon.setCarLight(false)

                this.display.postProcess.depth=0
                this.display.postProcess1.depth=0

                this.display.light.intensity=0.2
                this.display.light2.intensity=0.2
                this.display.light3.intensity=1
            }


            if(localStorage.weatherState==WeatherState.NIGHT_DAY){

                this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                this.scene.fogDensity = 0.009;
                this.scene.fogColor = new BABYLON.Color3(0,0,0);

                //车灯
                carCon.setCarLight(true)

                this.display.postProcess.depth=0
                this.display.postProcess1.depth=0

                this.display.light.intensity=0.1
                this.display.light2.intensity=0.1
                this.display.light3.intensity=0.3
                this.display.lensFlareSystem3.dispose()
            }

            if(localStorage.weatherState==WeatherState.AFTERNOON_DAY){

                this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
                this.scene.fogDensity = 0.001;
                this.scene.fogColor = new BABYLON.Color3(255/255,90/255,0/255);

                //车灯
                carCon.setCarLight(true)

                this.display.postProcess.depth=0
                this.display.postProcess1.depth=0

                this.display.light.intensity=0.1
                this.display.light2.intensity=0.1
                this.display.light3.intensity=0.3
            }





            this.display.steering.parent=this.scene.getMeshByName("carBox")
            this.display.steering.position.z=0.7
            this.display.steering.position.x=0.8
            this.display.steering.position.y=-0.76

            this.scene.getMeshByName("Jeep GC-P 15").position=new BABYLON.Vector3(0,0,0)
            this.scene.getMeshByName("Jeep GC-P 15").parent=this.display.steering

            //设置汽车和相机绑定
            this.setCameraParent()


            EventCon.ins.key.add((e)=>{
                this.gameDeState=e
                console.log(e)
                this.viewCtrl(e)
            });


            setTimeout(()=>{
                SceneManager.ins.engine.hideLoadingUI();
            },500)

        })
    }


    /**
     * 湖水
     * */

    private waterRenderList():void{
        this.display.water.addToRenderList(this.scene.getMeshByName("default"));
        this.display.water.addToRenderList(this.scene.getMeshByName("skyBox"));
        this.display.water.addToRenderList(this.scene.getMeshByName("car"));
        this.display.water.addToRenderList(this.scene.getMeshByName("w1_1"));
        this.display.water.addToRenderList(this.scene.getMeshByName("w2_1"));
        this.display.water.addToRenderList(this.scene.getMeshByName("w3_1"));
        this.display.water.addToRenderList(this.scene.getMeshByName("w4_1"));
        console.log(this.scene.getMeshByName("car"))
        this.scene.getMeshByName("car")._children.forEach((mesh)=>{
            this.display.water.addToRenderList(mesh);
        })

        if(localStorage.map=="1"){
            this.display.waterMesh.position.y=123;
        }

        if(localStorage.map=="2"){
            this.display.waterMesh.position.y=43;
        }
    }


    /**
     * 闪电
     * */

    private setLightning():void{
        setInterval(()=>{
            this.display.light3.intensity = 2;
            this.scene.getMeshByName("lighting").visibility=2
            this.display.lighting.position.y=this.scene.getMeshByName("carBox").absolutePosition.y+100;
            this.display.lighting.position.z=Math.random()*600-300;
            this.display.lighting.position.x=Math.random()*600-300;

            setTimeout(()=>{
                this.display.light3.intensity = 0.3;
                this.scene.getMeshByName("lighting").visibility=0
            },100)

            setTimeout(()=>{
                this.display.light3.intensity = 1;
                this.display.lighting.position.z=Math.random()*600-300;
                this.display.lighting.position.x=Math.random()*600-300;
                this.scene.getMeshByName("lighting").visibility=1
            },500)

            setTimeout(()=>{
                this.display.light3.intensity = 0.3;
                this.scene.getMeshByName("lighting").visibility=0
            },600)
        },6000)
    }


    /**
     * 下雨
     * */

    private setRain():void{
        //下雨
        var tailFlower=new particleCon(new BABYLON.Vector3(0,50,0),this.scene, this.display.particleRain);
        // tailFlower.Parent(scene.getMeshByName("car"))
        tailFlower.start()
        SceneManager.ins.engine.runRenderLoop(()=>{
            tailFlower.Position(new BABYLON.Vector3(
                this.scene.getMeshByName("car").absolutePosition.x+50,
                this.scene.getMeshByName("car").absolutePosition.y+50,
                this.scene.getMeshByName("car").absolutePosition.z) )
        })
    }



    /**
     * 页面UI控制
     * */
    private viewCtrl(e):void{
        var _state=e["view"];
        if(_state==true){
            this.display.camera2.detachControl(SceneManager.ins.canvas,false);
            this.scene.activeCamera=this.display.camera
            this.display.camera.alpha=-Math.PI*1;
            this.display.camera.beta=1.260483446598473
            this.display.camera.attachControl(SceneManager.ins.canvas,true);

        }else{
            this.display.camera.detachControl(SceneManager.ins.canvas,false);
            this.scene.activeCamera=this.display.camera2
            this.display.camera2.rotation=new BABYLON.Vector3(0.1,Math.PI*0.5,0)
            this.display.camera2.attachControl(SceneManager.ins.canvas,true);
        }
    }


    /**
     * 设置相机和汽车绑定
     * */

    private setCameraParent(){
        this.display.camera2Box.parent=this.scene.getMeshByName("carBox");
        this.display.camera.setTarget(this.scene.getMeshByName("carBox"));
        this.display.camera.target=this.scene.getMeshByName("carBox");
    }


    protected removeEvent(){
       // SceneManager.ins.scene.onBeforeRenderObservable.remove(this.beforeEvent)
    }

    public get gold(){
        return this._gold;
    }

    public ImportMeshes(importMeshes,onSuccess){
        var _length=importMeshes.length;
        var _meshes=[]
        var _skeletons=[]
        var _loadCount=0;
        importMeshes.forEach((list)=>{
            BABYLON.SceneLoader.ImportMesh(
                "",
                list.rootUrl,
                list.sceneFilename,
                SceneManager.ins.scene,
                (_mesh,_skeleton)=> {
                    try {
                        _meshes.push(_mesh)
                        _skeletons.push(_skeleton)
                        _loadCount++
                        if(_loadCount==_length){
                            onSuccess(_meshes,_skeletons)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            );
        })
    }

}