import {AssetsManager} from "../../public/index"
import {SceneManager} from "../../public/index"
import {WeatherState} from "../../public/index";
import Texture = BABYLON.Texture;
import Color3 = BABYLON.Color3;

export class ExGameScene{

    private static instance: ExGameScene;

    public static get ins(): ExGameScene {
        if (!this.instance) {
            this.instance = new ExGameScene();
        }
        return this.instance;
    }

    public display;

    protected scene;

    constructor(){
       // super()
    }


    public creatScene(){
        this.scene=SceneManager.ins.scene
        //设置背景色
        this.scene.clearColor=new BABYLON.Color4(52/255,156/255,255/255)
      //  SceneManager.ins.engine.setHardwareScalingLevel(1)

     

        /**
         * 室内相机校准模型
         * */
        var cameraBox = BABYLON.MeshBuilder.CreateBox("camera2Box", {height:  0.5, width: 0.5, depth: 0.5}, this.scene);
        cameraBox.isVisible=false;
        cameraBox.rotation=new BABYLON.Vector3(0,0,0)


        //准星辅助模型
        var pickMesh = BABYLON.MeshBuilder.CreateBox("pickMesh", {height:  0.5, width: 0.5, depth: 0.5}, this.scene);
        pickMesh.position=new BABYLON.Vector3(0,0,3000);
        pickMesh.isPickable=false;
        pickMesh.parent=cameraBox
        pickMesh.isVisible=false;
       // pickMesh.rotation=new BABYLON.Vector3(0,0,0)

         /**
             * 灯光延时跟随相机
             */
           

         /**
         * 室内相机校准模型
         * */
        var camera2Box = BABYLON.MeshBuilder.CreateBox("camera2Box", {height:  0.5, width: 0.5, depth: 0.5}, this.scene);
        camera2Box.position=new BABYLON.Vector3(0,0.5,-3);
        camera2Box.isVisible=false;
        camera2Box.rotation=new BABYLON.Vector3(0,0,0)

        camera2Box.parent=cameraBox


        var steering = BABYLON.MeshBuilder.CreateBox("steering", {height:  2000, width: 2000, depth: 2000}, this.scene);
        steering.visibility=0;
        steering.scaling=new BABYLON.Vector3(0.001,0.001,0.001)
        steering.rotation=new BABYLON.Vector3(0,0.3,Math.PI*0.5)


             /**
         * 室内相机
         * */
        var camera2 = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0.112, 0.31), this.scene);
        camera2.speed=40;
        camera2.inertia=0;
        camera2.rotation.y=-Math.PI*2
      //  camera2.rotation.z=-0.6
        camera2.fov=1.6
      /*   camera2.position.z=-3;
        camera2.position.y=0.5; */
        camera2.attachControl(SceneManager.ins.canvas);
        camera2.detachControl(SceneManager.ins.canvas);
      //  this.scene.activeCamera=camera2;
        camera2.minZ=-5;
        camera2.maxZ=2000000;
        camera2.parent=cameraBox;
       
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseTexture =  AssetsManager.ins.resourceObject["textures"]["gameScene"]["skybox13"].clone();
        skyboxMaterial.emissiveTexture =  AssetsManager.ins.resourceObject["textures"]["gameScene"]["skybox13"].clone();
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        //   skyboxMaterial.emissiveColor  = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = false;
        

        var skySphere = BABYLON.MeshBuilder.CreateSphere("skySphere", {diameter: 100000}, this.scene);
        skySphere.rotation.x=Math.PI;
        skySphere.position.y=10000;
        skySphere.material=skyboxMaterial
        skySphere.applyFog=false;

        var camera3 = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(200, -300, 150), this.scene);
        camera3.radius = -10;
        console.log("camera")
        camera3.heightOffset = 5;
        camera3.rotationOffset = 0;
        camera3.cameraAcceleration = 0.6;
        camera3.maxCameraSpeed = 300;
        //camera3.isStereoscopicSideBySide=false;
        camera3.noRotationConstraint=false;
        camera3.fov=1.3
        camera3.detachControl(SceneManager.ins.canvas);
        camera3.update()
        camera3.maxZ=2000000;
        camera3.layerMask = 1;


        this.scene.activeCamera=camera3;


               /**
         * 室内相机
         * */
        var camera4 = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0.112, 0.31), this.scene);
        camera4.rotation.y=-Math.PI*1
        camera4.position.x=-0.05
        camera4.fov=1.2
        camera4.detachControl(SceneManager.ins.canvas);
        camera4.minZ=-5;
        camera4.maxZ=2000000;
        camera4.parent=cameraBox;
      //  camera4.upVector = new BABYLON.Vector3(-1,-1, -3);

        var camera5 = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0.112, 0.31), this.scene);
        camera5.rotation.y=-Math.PI*1
        camera5.position.x=+0.05
        camera5.fov=1.2
        camera5.detachControl(SceneManager.ins.canvas);
        camera5.minZ=-5;
        camera5.maxZ=2000000;
        camera5.parent=cameraBox;
      //  camera4.layerMask = 0x20000000;


        this.scene.activeCameras.push(camera3);
        this.scene.activeCameras.push(camera4);
        this.scene.activeCameras.push(camera5);
       
       
       
        camera4.viewport = new BABYLON.Viewport(0, 0.8, 0.2, 0.2);
        camera5.viewport = new BABYLON.Viewport(0.8, 0.8, 0.2, 0.2);
        camera3.viewport = new BABYLON.Viewport(0, 0, 1.0, 1.0);
        this.scene.cameraToUseForPointers = camera3;

       // camera3.target = cameraBox;
        camera3.lockedTarget = cameraBox;

        var freeMateial=new BABYLON.StandardMaterial("free",this.scene);
        console.log("freeMateial")
        console.log(freeMateial)
      //  freeMateial.disableLighting=true;
        freeMateial["emissiveColor"]=new BABYLON.Color3(1,1,1)
        freeMateial["diffuseColor"]=new BABYLON.Color3(0,0,0)
        freeMateial["emissiveTexture"]=AssetsManager.ins.resourceObject["textures"]["gameScene"]["boom"]

        var boomMateial=new BABYLON.StandardMaterial("boom",this.scene);
        console.log("boomMateial")
        console.log(boomMateial)
        boomMateial.disableLighting=true;
        boomMateial["emissiveColor"]=new BABYLON.Color3(1,1,1)
        boomMateial["diffuseColor"]=new BABYLON.Color3(0,0,0)
        boomMateial["emissiveTexture"]=AssetsManager.ins.resourceObject["textures"]["gameScene"]["boom"]


       /*  var pipeline = new BABYLON.StandardRenderingPipeline(
            "standard", // The name of the pipeline
            this.scene, // The scene instance
            1.0, // The rendering pipeline ratio
            null, // The original post-process that the pipeline will be based on
            [camera3] // The list of cameras to be attached to
        );
        //pipeline.LensFlareEnabled = true;
        pipeline.lensTexture = AssetsManager.ins.resourceObject["textures"]["gameScene"]["lensdirt"];
        pipeline.lensFlareHaloWidth = 1 */

     //   pipeline.LensFlareEnabled = true;
     //   pipeline.lensStarTexture = AssetsManager.ins.resourceObject["textures"]["gameScene"]["lensstar"];

      //  lensdirt lensstar

      //  pipeline.MotionBlurEnabled = true;
      //  pipeline.BloomEnabled = true;

     //   pipeline.motionStrength = 1.5;

     //   pipeline.motionBlurSamples = 32.0;

       /*  var pipeline = new BABYLON.DefaultRenderingPipeline(
            "default", // The name of the pipeline
            true, // Do you want HDR textures ?
            this.scene, // The scene instance
            [ camera3] // The list of cameras to be attached to
             );
        
        pipeline.bloomEnabled = true;
        
        pipeline.bloomThreshold = 0.2;
        pipeline.bloomWeight = 0.5;
        pipeline.bloomKernel = 64;
        pipeline.bloomScale = 0.5; */



      /*  this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        this.scene.fogDensity = 0.001;
        this.scene.fogColor = new BABYLON.Color3(1,1,1);*/


        /**
         * 环境光
         * */
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 10, 0), this.scene);
        light.intensity=0.4
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.groundColor = new BABYLON.Color3(1, 1, 1);
       /*  var light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -10, 0), this.scene);
        light2.intensity=0.4 */

        /**
         * 平行光
         * */
        var light3 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0.2, -0.3, 0.2), this.scene);
        light3.intensity=1
        //  light3.autoUpdateExtends=false;
        light3.shadowFrustumSize=200
        light3.shadowMinZ=-100
        light3.shadowMaxZ=100


        setInterval(()=>{
            light3.position=new BABYLON.Vector3(
                cameraBox.position.x,
                cameraBox.position.y+1,
                cameraBox.position.z-0
            );
        },100)


        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light3);
        shadowGenerator.bias = 0.0004;
        shadowGenerator.usePercentageCloserFiltering = true;
        shadowGenerator.filteringQuality=0.1;
        shadowGenerator.forceBackFacesOnly=true;


        var terrainMaterial = new BABYLON["TerrainMaterial"]("terrainMaterial", this.scene);

    
        terrainMaterial.mixTexture = AssetsManager.ins.resourceObject["textures"]["gameScene"]["maptr2"].clone()


        var gl = new BABYLON.GlowLayer("glow", this.scene);
        gl.intensity = 1;
   

        terrainMaterial.diffuseTexture1 = AssetsManager.ins.resourceObject["textures"]["gameScene"]["grass"].clone()
        terrainMaterial.diffuseTexture1.uScale=20
        terrainMaterial.diffuseTexture1.vScale=20
        terrainMaterial.diffuseTexture2 = AssetsManager.ins.resourceObject["textures"]["gameScene"]["grass"].clone()
        terrainMaterial.diffuseTexture2.uScale=20
        terrainMaterial.diffuseTexture2.vScale=20
        terrainMaterial.diffuseTexture3 = AssetsManager.ins.resourceObject["textures"]["gameScene"]["ground"].clone()
        terrainMaterial.diffuseTexture3.uScale=20
        terrainMaterial.diffuseTexture3.vScale=20

         //添加光晕

         var lens3 = BABYLON.Mesh.CreateSphere("centerHidenPick", 16, 0.1, this.scene);
         lens3.visibility=0
         lens3.position=new BABYLON.Vector3(-300000, 10000, 0)

         var lensFlareSystem3 = new BABYLON.LensFlareSystem("lensFlareSystem", lens3, this.scene);
         var flare00 = new BABYLON.LensFlare(0.3, 1.3, new BABYLON.Color3(1,1,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["ty"].src, lensFlareSystem3);
         var flare01 = new BABYLON.LensFlare(0.13, 1, new BABYLON.Color3(0,1,0), AssetsManager.ins.resourceObject["images"]["gameScene"]["Bphl4qj"].src, lensFlareSystem3);
         var flare02 = new BABYLON.LensFlare(0.2, 1, new BABYLON.Color3(0,0,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["Bphl4qj"].src, lensFlareSystem3);
         var flare03 = new BABYLON.LensFlare(0.1, 0.8, new BABYLON.Color3(.5,.7,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["IIyZhcg"].src, lensFlareSystem3);
         var flare04 = new BABYLON.LensFlare(0.2, 0.6, new BABYLON.Color3(.5,.5,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["HRsf4I5"].src, lensFlareSystem3);
         var flare05 = new BABYLON.LensFlare(0.1, 0.5, new BABYLON.Color3(.4,.6,.9),  AssetsManager.ins.resourceObject["images"]["gameScene"]["XaJRD9j"].src, lensFlareSystem3);
         var flare06 = new BABYLON.LensFlare(0.1, 0.35, new BABYLON.Color3(.5,.5,.9), AssetsManager.ins.resourceObject["images"]["gameScene"]["it5c3Vr"].src, lensFlareSystem3);
         var flare07 = new BABYLON.LensFlare(0.12, -0.5, new BABYLON.Color3(.9,.75,.5), AssetsManager.ins.resourceObject["images"]["gameScene"]["XaJRD9j"].src, lensFlareSystem3);
         var flare08 = new BABYLON.LensFlare(0.25, -0.25, new BABYLON.Color3(1,.85,.5), AssetsManager.ins.resourceObject["images"]["gameScene"]["IIyZhcg"].src, lensFlareSystem3);
         var flare09 = new BABYLON.LensFlare(2.6, 0, new BABYLON.Color3(1,1,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["lensdirt"].src, lensFlareSystem3);
         var flare10 = new BABYLON.LensFlare(1.6, 1.3, new BABYLON.Color3(1,1,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["lens2"].src, lensFlareSystem3);


         var lens4 = BABYLON.Mesh.CreateSphere("centerHidenPick", 16, 0.1, this.scene);
         lens4.visibility=0
        // lens4.position=new BABYLON.Vector3(-300000, 10000, 0)
         var lensFlareSystem4 = new BABYLON.LensFlareSystem("lensFlareSystem", lens4, this.scene);
         var _lens4 = new BABYLON.LensFlare(1.6, 1.3, new BABYLON.Color3(1,1,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["lens"].src, lensFlareSystem3);
        
         var lens5 = BABYLON.Mesh.CreateSphere("centerHidenPick", 16, 0.1, this.scene);
         lens5.visibility=0
         var lensFlareSystem5 = new BABYLON.LensFlareSystem("lensFlareSystem", lens5, this.scene);
         var _lens5 = new BABYLON.LensFlare(1.6, 1.3, new BABYLON.Color3(1,1,1), AssetsManager.ins.resourceObject["images"]["gameScene"]["lens"].src, lensFlareSystem3);


         var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
         advancedTexture.layer.layerMask=1;

         this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
         this.scene.fogDensity = 0.00005;
         this.scene.fogColor = new BABYLON.Color3(0.8,0.8,0.8);
    
        this.display={
            camera2:camera2,
            camera3:camera3,
            camera4:camera4,
            camera5:camera5,
            light:light,
           // light2:light2,
            light3:light3,
            cameraBox:cameraBox,
            camera2Box:camera2Box,
            steering:steering,
            terrainMaterial:terrainMaterial,
            shadowGenerator:shadowGenerator,
            freeMateial:freeMateial,
            boomMateial:boomMateial,
            lensFlareSystem3:lensFlareSystem3,
            pickMesh:pickMesh,
            advancedTexture:advancedTexture,
            lens4:lens4,
            lens5:lens5,
        }

        console.log(this.display)

      //  GameSceneCon.ins.resetGame(this.display);
    }



}


