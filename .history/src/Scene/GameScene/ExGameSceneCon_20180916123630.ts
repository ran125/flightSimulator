import {AssetsManager, SceneManager} from "../../public/index";
import {DisplayPool} from "../../public/index";
import {ModuleName} from "../../public/index";
import {EventCon} from "../../other/EventCon";
import {ExGameScene} from "./ExGameScene";
import {GameScenes} from "../../public/index";
import {particleCon} from "../../public/index";
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

    protected doEvents=[];

    private gameDeState;

    constructor(){
        super()
    }

    protected importMeshes=[]


    public init(){
        DisplayPool.ins.displayPool[ModuleName.GAME_PLAY_SCENE]=this;
    }

    private frees=[]
    private booms=[]


    private probe;

    private ray

    private rect1;

    protected resetGame(){
        ExGameScene.ins.creatScene()
        var scene=SceneManager.ins.scene;
        this.scene=SceneManager.ins.scene;
        this.display=ExGameScene.ins.display;
        SceneManager.ins.engine.displayLoadingUI();
        SceneManager.ins.engine.loadingUIText = "Initializing...";
        SceneManager.ins.engine.hideLoadingUI();



         // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.rect1 = new BABYLON.GUI.Rectangle();
    this.rect1.width = 0.2;
    this. rect1.height = "40px";
    this.rect1.cornerRadius = 20;
    this.rect1.color = "Orange";
    this.rect1.thickness = 4;
    this.rect1.background = "green";
    advancedTexture.addControl( this.rect1);

    var label = new BABYLON.GUI.TextBlock();
    label.text = "Sphere";
    this.rect1.addControl(label);

    //this.rect1.linkWithMesh(sphere);   
    this.rect1.linkOffsetY = -50;
      

     /*    var hit = scene.pickWithRay(ray);

        if (hit.pickedMesh){
		   hit.pickedMesh.scaling.y += 0.01;
	    } */


        this.scene.getMeshByName("气流1").material.backFaceCulling=false;
        this.scene.getMeshByName("气流2").material.backFaceCulling=false;
       // this.scene.getMeshByName("锥体.003").material.backFaceCulling=false;


      /*   this.probe = new BABYLON.ReflectionProbe("main", 64, this.scene);
        this.probe.renderList.push( this.scene.getMeshByName("default"));
        this.probe.attachToMesh(this.display.cameraBox); */


        for(var i=0;i<=60;i++){
            this.frees[i]= BABYLON.MeshBuilder.CreateBox("frees", {height:  0.2, width: 0.2, depth: 5}, this.scene);
            this.frees[i].lifeState=false;
            this.frees[i].isPickable=false;
            this.frees[i].material=this.display.freeMateial;
           // this.frees[i].scaling=new BABYLON.Vector3(1,0.001,0.001)
           // this.frees[i].rotation=new BABYLON.Vector3(0,0.3,Math.PI*0.5)
        }

        for(var i=0;i<=60;i++){
            this.booms[i]= BABYLON.MeshBuilder.CreateSphere("boom", {diameter: 10}, this.scene);
            this.booms[i].lifeState=false;
            this.booms[i].isPickable=false;
            this.booms[i].material=this.display.boomMateial;
           // this.frees[i].scaling=new BABYLON.Vector3(1,0.001,0.001)
           // this.frees[i].rotation=new BABYLON.Vector3(0,0.3,Math.PI*0.5)
        }

       // alert()

    

        console.log("this.scene")
        console.log(this.scene)
        this.scene.createDefaultSkybox(AssetsManager.ins.resourceObject["cubeTextures"]["gameScene"]["skybox"], true, 10000);


      //  this.scene.environmentTexture=this.probe.cubeTexture;

        /* var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
        backgroundMaterial.reflectionTexture=this.probe.cubeTexture */

        this.scene.getMeshByName("__root__").getChildMeshes(false,(mesh)=>{
            console.log(mesh)
            console.log(mesh.name)
            mesh.isPickable=false;
        })

        this.scene.getMeshByName("__root__").parent=this.display.cameraBox
        this.scene.getMeshByName("__root__").rotation.y=-Math.PI*1
      //  this.scene.getMeshByName("__root__").position.x=-0.1;
        this.scene.getMeshByName("__root__").position.y=-0;
        this.display.cameraBox.scaling=new BABYLON.Vector3(10,10,10)
        this.scene.getMeshByName("default").material=this.display.terrainMaterial
        this.scene.getMeshByName("default").isPickable=true;
        this.display.cameraBox.position.y=-10;
        this.display.camera.target=this.display.cameraBox.position;
       // this.scene.beginAnimation(this.scene.skeletons[0],6,6.001, false);
       /*  setTimeout(()=>{
            this.scene.beginAnimation(this.scene.skeletons[0], 1, 1.0001, false);
        },2000) */
       
        console.log( "this.scene")
        console.log( this.scene)



        var origin = this.display.cameraBox.position;
	
	    var forward = new BABYLON.Vector3(0,0,1);		
	    forward = this.vecToLocal(forward, this.display.cameraBox);
	
	    var direction = forward.subtract(origin);
	    direction = BABYLON.Vector3.Normalize(direction);
	
	    //var length = 100;
	
	    this.ray = new BABYLON.Ray(origin, direction, 1000);

	
        
       // ray.parent=this.display.cameraBox
       
    }


    private j;


    private freeState;


    protected addEvent(){

        this.freeState=false;
        this.doEvents["BeforeRender"]=SceneManager.ins.scene.onBeforeRenderObservable.add(()=>{
            this.beforeRender()
        })
        this.keyevent()


        setInterval(()=>{

            if(this.freeState){
                var ram=Math.random()/50;

                if(this.j<=this.frees.length-1){
               
                  /*   for(let i=this.j;i<this.frees.length;i++){
                        console.log(i)
                        console.log(this.frees[i])
                        if(this.frees[i].lifeState==false){
                            this.frees[i].position=this.display.cameraBox.position;
                            this.frees[i].forword=this.display.cameraBox.forword;
                            this.j++;
                            break;
                        }else{
                            this.j++;
                        }
                    } */
                    
                    this.frees[this.j].position=new BABYLON.Vector3(this.display.cameraBox.absolutePosition.x+ram,this.display.cameraBox.absolutePosition.y+ram,this.display.cameraBox.absolutePosition.z) ;
                    this.frees[this.j].rotation=new BABYLON.Vector3(this.display.cameraBox.rotation.x+ram,this.display.cameraBox.rotation.y+ram,this.display.cameraBox.rotation.z);
                    this.frees[this.j].lifeState=true;
                    this.j++;
                  //  this.timerNpc.start();
                }else{
                    this.j=0;
                  
                    this.frees[this.j].position=new BABYLON.Vector3(this.display.cameraBox.absolutePosition.x,this.display.cameraBox.absolutePosition.y,this.display.cameraBox.absolutePosition.z) ;
                    this.frees[this.j].rotation=new BABYLON.Vector3(this.display.cameraBox.rotation.x,this.display.cameraBox.rotation.y,this.display.cameraBox.rotation.z);
                    this.frees[this.j].lifeState=true;
                   // console.log("归零")
                  //  this.creatNpc()
                   // this.timerNpc.start();
                }
            }
           
        },50)

       /*  this.scene.meshes.forEach((mesh)=>{
            console.log(mesh.name)
        }) */
    }

    private lastSystemTime;
    private times

    protected beforeRender(){


        var useTime;
        if(this.lastSystemTime) {
            useTime =new Date().getTime() - this.lastSystemTime;
        }else{
             useTime = 1000 / 60;
        }
         //本次消耗的时间 / 正常每帧应该消耗的时间 算出倍率
        this.times = useTime / (1000/ 60);
       // console.log(1144)
     //   this.display.cameraBox.rotation.y=-this.display.camera.alpha+Math.PI*0.5;
      //  console.log(this.display.camera.beta/Math.PI)

      /*   console.log((1-this.display.camera.beta/Math.PI))

        var  se=(1-this.display.camera.beta/Math.PI)

        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Head"), se*4+2, se*4+2+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_L Arm"), se*4+2, se*4+2+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_R Arm"),se*4+2, se*4+2+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Bone"), se*4+2, se*4+2+0.001, false); */

      /*   this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Head"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_L Arm"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_R Arm"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Bone"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false); */
       /*  console.log(this.display.camera.alpha)
        console.log(this.display.cameraBox.rotation.y) */

        this.movePlayer()
        this.freeUpdate()


        
       

        this._s=this.moveX;
    }

      //前进状态
      private moveForward = false;
      //后退状态
      private moveBackward = false;
      //左转状态
      private moveLeft = false;
      //右转状态
      private moveRight = false;

       //空格状态
    private canJump = false;
       //速度状态
    private speedCharacter=-0.5;

    private character



        /**
     * 创建射线
     * @param localMeshDirection 
     * @param localMeshOrigin 
     * @param intersectsMeshes 
     * @param body 
     * @param length 
     * @param callback 
     */
    private rayEventCon(id,localMeshDirection,localMeshOrigin,intersectsMeshes,body,length,callback):void{
        var ray = new window["BABYLON"].Ray();
        var rayHelper = new window["BABYLON"].RayHelper(ray);
        //var localMeshDirection = new BABYLON.Vector3(0, 0, -1);
       // var localMeshOrigin = new BABYLON.Vector3(0, 0, -.4);
       // var length = length;
        rayHelper.attachToMesh(body, localMeshDirection, localMeshOrigin, length);
        rayHelper["show"](SceneManager.ins.scene);
        this.doEvents[id]=SceneManager.ins.scene.onAfterRenderObservable.add(()=>{
            //var hitInfo = ray.intersectsMeshes([SceneManager.ins.scene.getMeshByName("直道_21")]);
            var hitInfo = ray.intersectsMeshes([intersectsMeshes]);
            if(hitInfo.length){
                callback(true)
            }else{
                callback(false)
            }
        });
    }


    private vecToLocal(vector, mesh){
        var m = mesh.getWorldMatrix();
        var v = BABYLON.Vector3.TransformCoordinates(vector, m);
		return v;		 
    }

   /*  private castRay(){       
        var origin = box.position;
	
	    var forward = new BABYLON.Vector3(0,0,1);		
	    forward = vecToLocal(forward, box);
	
	    var direction = forward.subtract(origin);
	    direction = BABYLON.Vector3.Normalize(direction);
	
	    var length = 100;
	
	    var ray = new BABYLON.Ray(origin, direction, length);

		let rayHelper = new BABYLON.RayHelper(ray);		
		rayHelper.show(scene);		

        var hit = scene.pickWithRay(ray);

        if (hit.pickedMesh){
		   hit.pickedMesh.scaling.y += 0.01;
	    }
    } */

    private freeUpdate() {

       /*  if(!this.freeState){
            return;
        } */
        var origin = this.display.cameraBox.position;
	
        /*   var forward = new BABYLON.Vector3(0,0,1);		
          forward = this.vecToLocal(forward, this.display.cameraBox); */

          var forward = new BABYLON.Vector3(0,0,1);		
          forward = this.vecToLocal(forward, this.display.cameraBox);
      
          var direction = forward.subtract(origin);
          direction = BABYLON.Vector3.Normalize(direction);
      /* 
          var direction = this.display.cameraBox.forward.subtract(origin);
          direction = BABYLON.Vector3.Normalize(direction); */
      
          //var length = 100;
      
          this.ray.origin = origin;
          this.ray.direction =direction;

       /*    let rayHelper = new BABYLON.RayHelper(this.ray);		
          rayHelper.show(this.scene,new BABYLON.Color3(1,1,1));	 */


        var ram=Math.random;

        var hit = this.scene.pickWithRay(this.ray);

        if (hit.pickedMesh){
		   console.log("hit.pickedMesh.name")
		   console.log(hit.pickedMesh.name)
           console.log(hit.pickedPoint)
           this.rect1.moveToVector3(hit.pickedPoint,this.scene)
	    }

        this.frees.forEach((free,i)=>{
            if(free.lifeState==true){
                var forword=new BABYLON.Vector3(free.forward.x*10*this.times,free.forward.y*10*this.times,free.forward.z*10*this.times)
                free.moveWithCollisions(forword);
                free.isVisible=true;

                if (hit.pickedMesh){
                    /* console.log("hit.pickedMesh.name")
                    console.log(hit.pickedMesh.name)
                    console.log(hit.pickedPoint) */
                    if(!free.boomPosition){
                        free.boomPosition=new BABYLON.Vector3(hit.pickedPoint.x,hit.pickedPoint.y,hit.pickedPoint.z)
                    }
                   
                    //this.booms[i].position=hit.pickedPoint;
                 }

                 if(free.boomPosition){
                    var jl2=this.getDistance(
                        free.position.x,
                        free.position.y, 
                        free.position.z, 
                        free.boomPosition.x,
                        free.boomPosition.y, 
                        free.boomPosition.z, 
                        )
    
                     if(jl2<=50){
                        free.lifeState=false;
                        this.booms[i].position=new BABYLON.Vector3(free.boomPosition.x,free.boomPosition.y,free.boomPosition.z);
                        free.boomPosition=null;
                     }
                 }
                 
               

 /*                var pointToIntersect = new BABYLON.Vector3(10, -5, 0);
if (balloon3.intersectsPoint(pointToIntersect)){
  balloon3.material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
} */
              /*   if (this.scene.getMeshByName("default").intersectsPoint(free.position)) {
                    //free.material.emissiveColor = new BABYLON.Color4(1, 0, 0, 1);
                    this.booms[i].position=new BABYLON.Vector3(free.position.x,free.position.y,free.position.z);
                    free.lifeState=false
                  } else {
                    //free.material.emissiveColor = new BABYLON.Color4(1, 1, 1, 1);
                } */

               /*  this.rayEventCon(
                    "frontPick",
                    new BABYLON.Vector3(0, 0, -1),
                    new BABYLON.Vector3(0, 0, 0),
                    this.scene.getMeshByName("default"),
                    free,
                    5,
                    (e)=>{
                        //console.log(e)
                        if(e){
                            //console.log("撞到前面")
                            this.booms[i].position=new BABYLON.Vector3(free.position.x,free.position.y,free.position.z);
                            free.lifeState=false
                        }
                    }
                )
 */
                var jl=this.getDistance(
                    free.position.x,
                    free.position.y, 
                    free.position.z, 
                    this.display.cameraBox.position.x, 
                    this.display.cameraBox.position.y, 
                    this.display.cameraBox.position.z
                    )

                if(jl>=600){
                    free.lifeState=false;
                    free.boomPosition=null;
                    free.position=new BABYLON.Vector3(this.display.cameraBox.absolutePosition.x,this.display.cameraBox.absolutePosition.y,this.display.cameraBox.absolutePosition.z) ;
                    free.rotation=new BABYLON.Vector3(this.display.cameraBox.rotation.x,this.display.cameraBox.rotation.y,this.display.cameraBox.rotation.z);    
                }
            }else{
                free.position=new BABYLON.Vector3(this.display.cameraBox.absolutePosition.x,this.display.cameraBox.absolutePosition.y,this.display.cameraBox.absolutePosition.z) ;
                free.rotation=new BABYLON.Vector3(this.display.cameraBox.rotation.x,this.display.cameraBox.rotation.y,this.display.cameraBox.rotation.z);    
                free.isVisible=false;
            }
        })

        
    }


    
   

    private movePlayer():void{

      
       // this.scene.getMeshByName("尾翼").rotation=new BABYLON.Vector3(0,1,0);
        var gravity = 0;
        this.character = this.display.cameraBox;
       /*  this.character.ellipsoid = new BABYLON.Vector3(3,6, 3);
        this.character.ellipsoidOffset = new BABYLON.Vector3(0, 3.2, 0); */
        var forwards

       /*  console.log("this.display.cameraBox")
        console.log(this.display.cameraBox) */
        //if(this.moveForward){
          /*   if(this.moveLeft){
                this.character.rotation.y-=0.04
              //  console.log("asdasdasd")
              //  console.log(this.display.cameraBox.rotation.y)
               // this.display.cameraBox.rotation.z+=0.03
            } */


           // console.log(this.display.cameraBox.rotation.z)

        //   console.log(this.scene.meshes)
           //this.barrierCon(true)

           this.canardUpdate()
           this.empennageUpdate()
           this.wingsUpdate()
           this.airflowUpdate()


            this.display.cameraBox.rotation.y-=this.display.cameraBox.rotation.z/50*this.times;

            if(this.moveY>=50||this.moveY<=-50){
                this.display.cameraBox.rotation.x-=this.moveY/40000*this.times
            }

            if(this.display.cameraBox.rotation.x>Math.PI*2){
                this.display.cameraBox.rotation.x=0
             }
  
             if(this.display.cameraBox.rotation.x<=-Math.PI*2){
                this.display.cameraBox.rotation.x=0
             }
           
           // console.log(40+this.display.cameraBox.rotation.z*10)


           // this.setMeshVal(this.scene.getMeshByName("右翼"),this.display.cameraBox.rotation.z)

            if(this.display.cameraBox.rotation.z>0){
               // console.log("2223355")
            }
    
            var forword=new BABYLON.Vector3(this.character.forward.x*2*this.times,this.character.forward.y*2*this.times,this.character.forward.z*2*this.times)
     
            this.character.moveWithCollisions(forword);
    }


    private  _s=0;
    private  _s_y=0;
    private  moveX=0;
    private  moveY=0;

    private keyevent():void{
        var onKeyDown =  ( event )=> {
            switch ( event.keyCode ) {
                case 38: // up
                case 87: // w
                    this.moveForward = true;
                    break;
                case 37: // left
                case 65: // a
                    this.moveLeft = true; break;
                case 40: // down
                case 83: // s
                    this.moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    this.moveRight = true;
                    break;
                case 32: // space
                    this.canJump = true;
                    break;
            }
        };
        var onKeyUp =  ( event )=> {
            switch( event.keyCode ) {
                case 38: // up
                case 87: // w
                    this.moveForward = false;
                    //speedCharacter=-2
                    break;
                case 37: // left
                case 65: // a
                    this.moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    this.moveBackward = false;
                    this.speedCharacter=-2
                    break;
                case 39: // right
                case 68: // d
                    this.moveRight = false;
                    break;
                case 32: // space
                    this.canJump = false;
                    break;
            }
        };
        /*   document.addEventListener( 'keydown', onKeyDown, false );
           document.addEventListener( 'keydown', onKeyDown, false );*/
        document.addEventListener( 'keydown', (event)=>{
            onKeyDown(event)
           // console.log(4455)
        }, false );
        document.addEventListener( 'keyup', (event)=>{
            onKeyUp(event)
        }, false );


       

        var eleImage = document.getElementById('renderCanvas');
            if (eleImage) {
                // 起始值
              //  var moveX = 0, moveY = 0;
                // 图片无限变换的方法
                var rotate3D =  (event)=> {
                    this.moveX = this.moveX + event.movementX;
                    this.moveY = this.moveY + event.movementY;

                   // console.log(event)

                  //  console.log(this.moveY)

                 // if(-this.moveX*0.001)

                if(this.moveX*0.001>Math.PI*2){
                    this.moveX=0
                 }
      
                 if(this.moveX*0.001<=-Math.PI*2){
                    this.moveX=0
                 }

                this.display.cameraBox.rotation.z=-this.moveX*0.001;
                };

                // 触发鼠标锁定
                eleImage.addEventListener('click',  ()=> {
                    eleImage.requestPointerLock();
                });

                // 再次点击页面，取消鼠标锁定处理
              /*   document.addEventListener('click', ()=> {
                    if (document.pointerLockElement == eleImage) {
                        document.exitPointerLock();
                    }
                }); */



                // 检测鼠标锁定状态变化
                document.addEventListener('pointerlockchange', ()=> {
                    if (document.pointerLockElement == eleImage) {
                        document.addEventListener("mousemove", rotate3D, false);

                        document.addEventListener("mousedown",()=>{
                            this.freeState=true;
                        })

                        document.addEventListener("mouseup",()=>{
                            this.freeState=false;
                        })
                    } else {
                        document.removeEventListener("mousemove", rotate3D, false);

                        document.addEventListener("mousedown",()=>{
                            this.freeState=true;
                        })

                        document.addEventListener("mouseup",()=>{
                            this.freeState=false;
                        })
                    }
                }, false);
            }
    }

    private flayState=[];

    private setMeshVal(mesh,state,val){


        var _sd=[];
        _sd["up-go"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 0, 0.7916666865348816*val,0, false);
        _sd["up-back"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 0.7916666865348816, 1.625*val,0, false);
        _sd["down-go"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 1.625, 2.4583332538604736*val,0, false);
        _sd["down-back"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 2.4583332538604736, 3.2916667461395264*val,0, false);
        _sd["back"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 3.0*val, 3.2916667461395264*val,0, false);

        this.flayState[mesh.name]=state;

       if(state=="up-go"){
           //console.log("4455")
           _sd["up-go"+mesh.name].weight = 1
           _sd["up-back"+mesh.name].weight = 0
           _sd["down-go"+mesh.name].weight = 0
           _sd["down-go"+mesh.name].weight = 0
           _sd["back"+mesh.name].weight = 0
          /*  _sd.forEach((sd,i)=>{
               console.log("sd")
               console.log(sd)
               console.log(i)
           
           }) */
           
       }

       if(state=="up-back"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 1
        _sd["down-go"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 0
        _sd["back"+mesh.name].weight = 0
           // this.scene.beginAnimation(mesh, 0.7916666865348816, 1.625*val, false);
       }

       if(state=="down-go"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 1
        _sd["down-back"+mesh.name].weight = 0
        _sd["back"+mesh.name].weight = 0
           // this.scene.beginAnimation(mesh, 1.625, 2.4583332538604736*val, false);
       }

       if(state=="down-back"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 0
        _sd["down-back"+mesh.name].weight = 1
        _sd["back"+mesh.name].weight = 0
           // this.scene.beginAnimation(mesh, 2.4583332538604736, 3.2916667461395264*val, false);
       }
       if(state=="back"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 0
        _sd["down-back"+mesh.name].weight = 0
        _sd["back"+mesh.name].weight = 1
        console.log("中")
           // this.scene.beginAnimation(mesh, 2.4583332538604736, 3.2916667461395264*val, false);
       }
    }

    private  canardUpdate(){
        if(this.display.cameraBox.rotation.x>0.1){
          //  console.log("大")
            if(this.flayState["鸭翼左"]!="up-go"){
                this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"up-go",1)
            }

            if(this.flayState["鸭翼右"]!="up-go"){
                //this.airflowCon(true)
                this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"up-go",1)
            }
        }

        if(this.display.cameraBox.rotation.x<-0.1){
           // console.log("大")
            if(this.flayState["鸭翼左"]!="down-go"){
               
                this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"down-go",1)
            }
            if(this.flayState["鸭翼右"]!="down-go"){
                this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"down-go",1)
            }
           
        }


        if(this.display.cameraBox.rotation.x>=-0.1&&this.display.cameraBox.rotation.x<=0.1){

       
            if(this.flayState["鸭翼左"]=="down-go"){
                if(this.flayState["鸭翼左"]!="down-back"){
                  

                  //  console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"down-back",1)
                }
            }

            if(this.flayState["鸭翼左"]=="up-go"){
                if(this.flayState["鸭翼左"]!="up-back"){
                    

                  //  console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"up-back",1)
                }
            }

            if(this.flayState["鸭翼右"]=="down-go"){
                if(this.flayState["鸭翼右"]!="down-back"){
                
                   // console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"down-back",1)
                }
            }

            if(this.flayState["鸭翼右"]=="up-go"){
                if(this.flayState["鸭翼右"]!="up-back"){
             

                  //  console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"up-back",1)
                }
            }

           
        }
    }



    private empennageUpdate(){
        if(this.display.cameraBox.rotation.z>0.3){
            //console.log("大")
            if(this.flayState["尾翼"]!="up-go"){
                this.setMeshVal(this.scene.getMeshByName("尾翼"),"up-go",1)
            }
        }

        if(this.display.cameraBox.rotation.z<-0.3){
           // console.log("大")
            if(this.flayState["尾翼"]!="down-go"){
                this.setMeshVal(this.scene.getMeshByName("尾翼"),"down-go",1)
            }
        }


        if(this.display.cameraBox.rotation.z>=-0.3&&this.display.cameraBox.rotation.z<=0.3){
       
            if(this.flayState["尾翼"]=="down-go"){
                if(this.flayState["尾翼"]!="down-back"){
                   // console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("尾翼"),"down-back",1)
                }
            }

            if(this.flayState["尾翼"]=="up-go"){
                if(this.flayState["尾翼"]!="up-back"){
                    //console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("尾翼"),"up-back",1)
                }
            }
        }
    }


    private wingsUpdate(){
             //  this.character.rotation.y=
             if(this._s>this.moveX){
             //   console.log("大")
                if(this.flayState["右翼"]!="up-go"){
                    this.setMeshVal(this.scene.getMeshByName("右翼"),"up-go",1)
                }
    
                if(this.flayState["左翼"]!="down-go"){
                    this.setMeshVal(this.scene.getMeshByName("左翼"),"down-go",1)
                }
            }
    
            if(this._s<this.moveX){
                if(this.flayState["右翼"]!="down-go"){
                    this.setMeshVal(this.scene.getMeshByName("右翼"),"down-go",1)
                }
              //  console.log("小")
                if(this.flayState["左翼"]!="up-go"){
                    this.setMeshVal(this.scene.getMeshByName("左翼"),"up-go",1)
                }
            }
    
            if(this._s==this.moveX){
               
                if(this.flayState["右翼"]=="down-go"){
                    if(this.flayState["右翼"]!="down-back"){
                     //   console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("右翼"),"down-back",1)
                    }
                }
    
                if(this.flayState["右翼"]=="up-go"){
                    if(this.flayState["右翼"]!="up-back"){
                      //  console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("右翼"),"up-back",1)
                    }
                }
               
               // console.log("小")
               if(this.flayState["左翼"]=="down-go"){
                    if(this.flayState["左翼"]!="down-back"){
                      //  console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("左翼"),"down-back",1)
                    }
               }
    
               if(this.flayState["左翼"]=="up-go"){
                    if(this.flayState["左翼"]!="up-back"){
                     //   console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("左翼"),"up-back",1)
                    }
                }
                
            }
    }


      /** * 求两点距离 */ 
      public getDistance(x1: number, y1: number, z1: number, x2: number, y2: number,z2: number) 
      {   var _x: number = Math.abs(x1 - x2); 
          var _y: number = Math.abs(y1 - y2); 
          var _z: number = Math.abs(z1 - z2); 
          return Math.sqrt(_x * _x + _y * _y+ _z * _z); 
      }


      private airflowUpdate(){
        if(this.display.cameraBox.rotation.x>0.1){
             
                 this.airflowCon(false)
              
          }
  
          if(this.display.cameraBox.rotation.x<-0.1){
             
                this.airflowCon(true)
            
          }
  
          if(this.display.cameraBox.rotation.x>=-0.1&&this.display.cameraBox.rotation.x<=0.1){
           
                this.airflowCon(false)
            
          }
      }


      private airflowConTime;
      private airflowConState;

      private airflowCon(airflowConState){

        if(this.airflowConState==airflowConState){
            return;
        }

        console.log("airflowCon")
        clearInterval(this.airflowConTime);
        
        if(airflowConState){
            this.airflowConTime=setInterval(()=>{ 
                this.scene.getMeshByName("气流1").isVisible=!this.scene.getMeshByName("气流1").isVisible;
                this.scene.getMeshByName("气流2").isVisible=!this.scene.getMeshByName("气流2").isVisible;
            },30)
        }else{
            this.scene.getMeshByName("气流1").isVisible=false;
            this.scene.getMeshByName("气流2").isVisible=false;
        }

        this.airflowConState=airflowConState
      }


   


    /*   private barrierConTime;
      private barrierConState;

      private barrierCon(barrierConState){

        if(this.barrierConState==barrierConState){
            return;
        }

        console.log("airflowCon")
        clearInterval(this.barrierConTime);
        
        if(barrierConState){
            this.barrierConTime=setInterval(()=>{ 

                this.scene.getMeshByName("气流3").isVisible=!this.scene.getMeshByName("气流3").isVisible;
             //   this.scene.getMeshByName("气流2").isVisible=!this.scene.getMeshByName("气流2").isVisible;
            },30)
        }else{
            this.scene.getMeshByName("气流3").isVisible=false;
            //this.scene.getMeshByName("气流2").isVisible=false;
        }

        this.barrierConState=barrierConState
      } */
}
