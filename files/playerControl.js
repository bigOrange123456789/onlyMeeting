function PlayerControl(go) {
    Web3DEngine.MonoBehaviour.call(this, go);
    this.instClassType = PlayerControl.classType;
    this.speed = 1;
    this._delayTime = 9;
    this.directionY_Ref = null;

    this.f=0;
}
var myPlayer,openButton,openButton2;
var myx1=0,myy1=0,mz1=0,myx2=0,myy2=0,myz2=0,mystartflag=false;
var openAnim=false,openCount=0;
var frameCount=0;
var this_myScreenControl;this_myScreenControl=-1;
var change=0;

var sprite1,sprite2;
var light;
Web3DEngine.ExtendType( PlayerControl , Web3DEngine.MonoBehaviour, {
    Start:function(){
    },
    Update:function(arg){
        if(openCount>2)
            if(light.getComponent(Web3DEngine.Transform).localEulerAngles.x>-48)
                light.getComponent(Web3DEngine.Transform).localEulerAngles=
                    new THREE.Vector3(
                        light.getComponent(Web3DEngine.Transform).localEulerAngles.x-=1,
                        light.getComponent(Web3DEngine.Transform).localEulerAngles.y,
                        light.getComponent(Web3DEngine.Transform).localEulerAngles.z);
        if(this.f==0){
            appInst._renderScenePass.scene.background = new THREE.CubeTextureLoader()
                .setPath( 'files/img/' )
                .load( [
                    'Skybox.jpg',
                    'Skybox.jpg',
                    'Skybox.jpg',
                    'Skybox.jpg',
                    'Skybox.jpg',
                    'Skybox.jpg'
                ] );

            light=myLightManager.createSpotLight();
            light.getComponent(Web3DEngine.Transform).localPosition
                =new THREE.Vector3(19.3,4.1,-6.3);
            //new ParamMeasure(light,1);




            var nowPointed=null;
            myPlayer = this;
            //初始位置设置
            this.gameObject.transform.localPosition=new THREE.Vector3(-17.5,3.5,2.5);

            //添加选中线框
            let cube=new THREE.BoxGeometry(0.5,0.8,0.5);
            let obj=new THREE.EdgesGeometry(cube,1);
            let mtl=new THREE.LineBasicMaterial({color:0xff0000,linewidth:50});
            let myobj=new THREE.LineSegments(obj,mtl);
            var scene = appInst._renderScenePass.scene;
            scene.add(myobj);
            this.updateMouse();

            ////////////////////////////////////////开始进行鼠标射线检测选座功能//////////////////////////////////////////////////////////////////////
            //将门加入射线检测

            var chairSaveObj=[]
            for (var i = 0; i < chairSave.length; i++) chairSaveObj.push(chairSave[i]._imp);
            //var inDoor=appInst._renderScenePass.scene.children[1].children[0].children[3].children[0].children[0].children[360];
            //chairSave.push(inDoor);

            function getPointer(event, domElement) {
                if (document.pointerLockElement) {
                    return {
                        x: 0,
                        y: 0,
                        button: event.button || event.buttons
                    };
                } else {
                    var pointer = event.changedTouches ? event.changedTouches[0] : event;
                    var rect = domElement.getBoundingClientRect();
                    return {
                        x: ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
                        y: (-(pointer.clientY - rect.top) / rect.height) * 2 + 1,
                        button: event.button || event.buttons
                    };
                }
            }//function getPointer(event, domElement)
            document.body.onmousedown = function (event) {//点击事件的监听
                appInst._renderer.domElement.addEventListener("mousedown", this.onPointerDown, false);
                appInst._renderer.domElement.addEventListener("touchstart", this.onPointerDown, false);

                //开始检测椅子的点击事件
                if(nowPointed!=null && nowPointed.object.enter){
                    if(openCount==0&&!openAnim)
                        myPlayer.gameObject.transform.localPosition=new THREE.Vector3(-17.5,3.5,2.5);
                    openAnim=true;
                    openButton.material.visible=false;
                    var vedio=document.getElementById('video');
                    if(vedio)vedio.volume=0.7;
                    if(vedio)vedio.play();
                }
                else if (myobj.position.y > -9) {//如果传送光圈不在初始位置//mouseOnChair==1
                    myx1 = myPlayer.gameObject.getComponent(Web3DEngine.Transform).localPosition.x;
                    myy1 = myPlayer.gameObject.getComponent(Web3DEngine.Transform).localPosition.y;
                    myz1 = myPlayer.gameObject.getComponent(Web3DEngine.Transform).localPosition.z;
                    myx2 = myobj.position.x;
                    myy2 = myobj.position.y + 0.1;//+0.75;
                    myz2 = myobj.position.z;
                    mystartflag = true;

                    //var vedio=document.getElementById('video');
                    //if(vedio.paused)vedio.play();
                }//完成检测椅子的点击事件
                //}//if (event.button === 2)
            },//document.body.onmousedown
                //完成点击事件的监听
                document.body.onmousemove=function(event){//移动事件的监听
                    appInst._renderer.domElement.addEventListener("mousedown", this.onPointerDown, false);
                    appInst._renderer.domElement.addEventListener("touchstart", this.onPointerDown, false);
                    //计算:
                    this.ray = new THREE.Raycaster();
                    var renderer = appInst._renderer;
                    let pointer = getPointer(event, renderer.domElement);
                    this.ray.setFromCamera(pointer, appInst._renderScenePass.camera);
                    var planeIntersects = this.ray.intersectObjects(chairSaveObj, true);
                    var planeIntersect = planeIntersects[0] || false;
                    if (planeIntersect) {
                        nowPointed=planeIntersect;
                        if(planeIntersect.object.name!=='')
                            myobj.position.set(planeIntersect.object.gameObject._compoents[0].position.x, planeIntersect.object.gameObject._compoents[0].position.y + 0.25, planeIntersect.object.gameObject._compoents[0].position.z);
                    }
                    else myobj.position.set(0,-100,0);
                }//document.body.onmousedown
            //完成移动事件的监听
            ////////////////////////////////////////完成鼠标射线检测选座功能//////////////////////////////////////////////////////////////////////

            //===================开门按钮====================
            var geometry = new THREE.BoxBufferGeometry(0.1, 0.5, 0.9);
            var material = new THREE.MeshStandardMaterial();
            var texture=new THREE.TextureLoader().load('files/assets/1599475603582/enter.jpg');
            texture.wrapS=THREE.RepeatWrapping;
            texture.wrapT=THREE.RepeatWrapping;
            material.map=texture;
            //console.log(material);
            openButton = new THREE.Mesh(geometry, material);
            openButton.position.set(-15,4,2.5);
            openButton.enter=true;
            var scene = appInst._renderScenePass.scene;
            scene.add(openButton);
            chairSaveObj.push(openButton);

            var geometry = new THREE.BoxBufferGeometry(0.1, 0.5, 0.9);
            var material = new THREE.MeshStandardMaterial();
            var texture=new THREE.TextureLoader().load('files/assets/1599475603582/enter2.jpg');
            texture.wrapS=THREE.RepeatWrapping;
            texture.wrapT=THREE.RepeatWrapping;
            material.map=texture;
            openButton2 = new THREE.Mesh(geometry, material);
            openButton2.position.set(-15,4,2.5);
            openButton2.enter=true;
            var scene = appInst._renderScenePass.scene;
            scene.add(openButton2);
            chairSaveObj.push(openButton2);
            openButton2.visible=-1;
            this.directionY_Ref.localEulerAngles=new THREE.Vector3(0,0,0);
        }
        if(this.f<30)this.f++;
        else{
            change++;
            if(change===10){
                change=0;
                if(openButton.visible){
                    openButton.visible=false;
                    openButton2.visible=true;
                }
                else {
                    openButton.visible = true;
                    openButton2.visible=false;
                }
            }
            if(frameCount<60 && !openAnim) {
                for (var i = 0; i < chairSave.length-2; i++) {
                    let chairPos = chairSave[i]._imp.position;

                    var nowPos = this.gameObject.transform.localPosition;
                    let distance = Math.abs(nowPos.x - chairPos.x);
                    if (distance < 25)
                        chairSave[i]._imp.visible = true;
                    else
                        chairSave[i]._imp.visible = false;

                }
                frameCount++;
            }
            else
                frameCount=0;

            ////完成房间预览
            if (mystartflag && moveToPoint(this, myx1, myy1, myz1, myx2, myy2, myz2, 10, this.directionY_Ref)) mystartflag = false;
            //开幕流程
            else if(openAnim){
                var nowPos=this.gameObject.getComponent(Web3DEngine.Transform).localPosition;
                if(openCount===0){
                    nowPos.x+=0.07;
                    if(nowPos.x>-14.7)
                        openCount=1;
                }
                else if(openCount===1){
                    nowPos.x+=0.07;
                    if(nowPos.x>-13.37)
                        openCount=2;
                }
                else if(openCount===2){
                    nowPos.x+=0.64;
                    nowPos.y-=0.02;
                    nowPos.z-=0.17;
                    if(nowPos.z<-4.13){
                        openCount=3;
                        var host=document.getElementById('hostAudio');
                        host.volume=0;
                        host.play();
                        hostsay._imp.visible=true;
                    }

                }
                else if(openCount===3){

                    var host=document.getElementById('hostAudio');
                    if(host.currentTime>5) {
                        openCount=4;
                        hostsay._imp.visible=false;
                    }

                }
                else if(openCount===4){
                    if(light.getComponent(Web3DEngine.Transform).localEulerAngles.x<-53)
                        light.getComponent(Web3DEngine.Transform).localEulerAngles=
                            new THREE.Vector3(light.getComponent(Web3DEngine.Transform).localEulerAngles.x-=0.5,
                                light.getComponent(Web3DEngine.Transform).localEulerAngles.y,
                                light.getComponent(Web3DEngine.Transform).localEulerAngles.z);
                    nowPos.z+=0.1;
                    nowPos.y-=0.02;
                    if(nowPos.z>0.7){//展示赵沁平院士
                        openCount=5;
                        //zhaopai._imp.visible=true;
                        zhaosay._imp.visible=true;

                        sprite1=new SpriteCard();
                        sprite1.fontsize=50;
                        sprite1.initChar0('赵沁平院士');//大会网络虚拟会场
                        appInst._renderScenePass.scene.add(sprite1.sprite);
                        sprite1.sprite.position.set(19.6,1.9,0.9);
                    }
                }
                else if(openCount===5){
                    var hostAudio=document.getElementById('hostAudio');
                    if(hostAudio.currentTime>15){
                        openCount=6;
                        zhaosay._imp.visible=false;
                    };
                }
                else if(openCount===6){
                    nowPos.z-=0.1;
                    if(nowPos.z<-1){
                        zhengsay._imp.visible=true;

                        sprite2=new SpriteCard();
                        sprite2.fontsize=50;
                        sprite2.initChar0('郑立国董事长');//大会网络虚拟会场
                        appInst._renderScenePass.scene.add(sprite2.sprite);
                        sprite2.sprite.position.set(19.6,1.8,-2.9);
                        //new ParamMeasure(sprite2.sprite,0);

                        openCount=7;
                    }
                }
                else if(openCount===7){
                    var host=document.getElementById('hostAudio');
                    if(host.currentTime>20){//如果目前的动作不是站立，就切换为站立
                        zhengsay._imp.visible=false;
                        openCount=8;
                    }
                }
                else if(openCount===8){
                    nowPos.z+=0.01;
                    nowPos.x+=0.2;
                    if(this.gameObject._imp.rotation.y<1.4)
                        this.gameObject._imp.rotateOnWorldAxis(new Web3DEngine.Vector3(0,1,0), -0.2);
                    if(nowPos.x>24){
                        //host.play();
                        openCount=9;
                    }
                }
                else if(openCount===9){
                    openCount=10;
                }
                else if(openCount===10){
                    if(nowPos.x>15)
                        nowPos.x-=0.1;
                    else
                        openCount=11;
                    if(nowPos.y<6)
                        nowPos.y+=0.1;
                }
                else{
                    var host=document.getElementById('hostAudio');
                    host.pause();
                    openAnim=false;
                }
            }

            //if (arg > 0.5) return;
            this.resetKeys();
            this.updateKeys(arg);
        }

    },

    updateKeys: function(arg)
    {
        if(Web3DEngine.Application.instance.inputModuleInst.getKey('A') || Web3DEngine.Application.instance.inputModuleInst.getKey('left')) this._keys.left = true;
        else if(Web3DEngine.Application.instance.inputModuleInst.getKey("D") || Web3DEngine.Application.instance.inputModuleInst.getKey('right')) this._keys.right = true;
        if(Web3DEngine.Application.instance.inputModuleInst.getKey("W") || Web3DEngine.Application.instance.inputModuleInst.getKey('up')) this._keys.forward = true;
        else if(Web3DEngine.Application.instance.inputModuleInst.getKey("S") || Web3DEngine.Application.instance.inputModuleInst.getKey('down'))  this._keys.back = true;
        this._direction.copy(new Web3DEngine.Vector3(this._keys.right - this._keys.left,0,this._keys.back - this._keys.forward)).normalize();
        this.gameObject._imp.translateOnAxis(this._direction, arg * this.speed);
        if(Web3DEngine.Application.instance.inputModuleInst.getKey("Q"))       this.gameObject.getComponent(Web3DEngine.Transform).localPosition=new THREE.Vector3(this.gameObject.getComponent(Web3DEngine.Transform).localPosition.x,this.gameObject.getComponent(Web3DEngine.Transform).localPosition.y+0.1,this.gameObject.getComponent(Web3DEngine.Transform).localPosition.z);
        else if(Web3DEngine.Application.instance.inputModuleInst.getKey("E")) this.gameObject.getComponent(Web3DEngine.Transform).localPosition=new THREE.Vector3(this.gameObject.getComponent(Web3DEngine.Transform).localPosition.x,this.gameObject.getComponent(Web3DEngine.Transform).localPosition.y-0.1,this.gameObject.getComponent(Web3DEngine.Transform).localPosition.z);
        if(Web3DEngine.Application.instance.inputModuleInst.getKeyDown("P")) console.log(this.gameObject.getComponent(Web3DEngine.Transform).localPosition,this.gameObject.getComponent(Web3DEngine.Transform).localEulerAngles,this.directionY_Ref.localEulerAngles);
     },
    updateMouse: function()
    {
        let canvas = !!document.getElementById('application-canvas') ? document.getElementById('application-canvas').childNodes[0] : document.getElementById('canvas');
        let scope = this;
        canvas.onmousemove = function (e) {
            if (event.buttons == 1) {

                //设置yaw偏航旋转
                scope.gameObject._imp.rotateOnWorldAxis(new Web3DEngine.Vector3(0, 1, 0), -event.movementX / 400);
                //设置pitch俯仰角
                scope.directionY_Ref.gameObject._imp.rotateOnAxis(new Web3DEngine.Vector3(1, 0, 0), -event.movementY / 400);
                //设置俯仰角度限制
                let pitchAngle = scope.directionY_Ref.gameObject.transform.localEulerAngles.x;
                let limitAngle = 85;
                if (Math.abs(pitchAngle) > limitAngle)scope.directionY_Ref.gameObject.transform.localEulerAngles = new Web3DEngine.Vector3(THREE.Math.clamp(pitchAngle, -limitAngle, limitAngle), 0, 0);
            }
        };
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );

        let lastTouchX = 0;
        let lastTouchY = 0;
        function onDocumentTouchStart( event ) {
            lastTouchX = event.touches[ 0 ].screenX;
            lastTouchY = event.touches[ 0 ].screenY;
        }
        function onDocumentTouchMove( event ) {
            let movementX = lastTouchX - event.touches[ 0 ].screenX;
            lastTouchX = event.touches[ 0 ].screenX;
            let movementY = lastTouchY - event.touches[ 0 ].screenY;
            lastTouchY = event.touches[ 0 ].screenY;

            scope.gameObject._imp.rotateOnWorldAxis(new Web3DEngine.Vector3(0,1,0), movementX / 300);//设置yaw偏航旋转
            scope.directionY_Ref.gameObject._imp.rotateOnAxis(new Web3DEngine.Vector3(1,0,0), movementY / 300);//设置pitch俯仰角

            //设置俯仰角度限制
            let pitchAngle = scope.directionY_Ref.gameObject.transform.localEulerAngles.x;
            let limitAngle = 85;
            if(Math.abs(pitchAngle) > limitAngle)scope.directionY_Ref.gameObject.transform.localEulerAngles = new Web3DEngine.Vector3(THREE.Math.clamp(pitchAngle, -limitAngle, limitAngle) ,0,0);
        }
    },

    resetKeys: function () {
        this._keys = {
            forward: false,
            left: false,
            back: false,
            right: false,
        };
        this._direction = new Web3DEngine.Vector3(0,0,0);
    },

});

PlayerControl.attributes.add( 'speed', {
    type: 'number',
    default: 1,
    title: 'speed'
});

PlayerControl.attributes.add( 'directionY_Ref', {
    type: 'entity',
    default: null,
    title: 'directionY_Ref',
    description: 'directionY_Ref'
});

function moveToPoint(thisObj,x1,y1,z1,x2,y2,z2,time,mycamera,k){//已到返回true
    var x=thisObj.gameObject.getComponent(Web3DEngine.Transform).localPosition.x;
    var z=thisObj.gameObject.getComponent(Web3DEngine.Transform).localPosition.z;
    var flag=0;
    if(z1!=z2&&!(z1<=z&&z<=z2)&&!(z2<=z&&z<=z1))flag=1;
    else if(x1!=x2&&!(x1<=x&&x<=x2)&&!(x2<=x&&x<=x1))flag=1;//已到达目的地
    else if(x1==x2&&y1==y2)flag=1;
    if(flag==1){
        thisObj.gameObject.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(x2, y2, z2);
        thisObj.gameObject.getComponent(Web3DEngine.Transform).localEulerAngles = new THREE.Vector3(0, -90, 0);
        mycamera.localEulerAngles = new THREE.Vector3(0, 0, 0);
        return true;
    }
    if(typeof(k)=='undefined')k=0.004;//用于视角的起伏
    k*=(Math.abs(x1-x2)+Math.abs(z1-z2));
    if((x-x1)/(x2-x1)>0.5)k*=-1;
    //if((x-x1)/(x2-x1)>0.9)time*=10;
    move(thisObj,1,(x2-x1)/time);
    move(thisObj,2,(y2-y1)/time+k);
    move(thisObj,3,(z2-z1)/time);
    return false;
}

function Preview(mystate,thisObj,time,mycamera){//thisObj,time,mycamera,k//thisObj,x1,y1,z1,x2,y2,z2,time,mycamera,k
    var x1,y1,z1,x2,y2,z2;

    console.log(x2,y2,z2);
    if(mystate==1){//x1,y1,z1,x2,y2,z2
        x1=7.5;y1=4.6;z1=-1.5;
        x2=-10;y2=3.8;z2=-12;
    }else if(mystate==2){
        x1=-10;y1=3.8;z1=-12;
        x2=25;y2=6;z2=-2;
    }
    var x=thisObj.gameObject.getComponent(Web3DEngine.Transform).localPosition.x;
    var z=thisObj.gameObject.getComponent(Web3DEngine.Transform).localPosition.z;
    var flag=0;
    if(z1!=z2&&!(z1<=z&&z<=z2)&&!(z2<=z&&z<=z1))flag=1;
    else if(x1!=x2&&!(x1<=x&&x<=x2)&&!(x2<=x&&x<=x1))flag=1;//已到达目的地
    else if(x1==x2&&y1==y2)flag=1;
    if(flag==1){
        if(mystate==1)thisObj.gameObject.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(x2, y2, z2);
        return true;
    }

    //if(typeof(k)=='undefined')k=0.004;//用于视角的起伏
    //k*=(Math.abs(x1-x2)+Math.abs(z1-z2));
    //if((x-x1)/(x2-x1)>0.5)k*=-1;
    //player控制左右，相机控制上下

    //if(flag==1)rotation1(thisObj,2,180/time);
    rotation1(thisObj,2,-180/time);
    if(mystate==1&&(x-x1)/(x2-x1)<0.5)rotation1(thisObj.directionY_Ref,1,-90/time);
    else if(mystate==1||(mystate==2&&(x-x1)/(x2-x1)>0.5))rotation1(thisObj.directionY_Ref,1,-45/time);//.directionY_Ref
    else rotation1(thisObj.directionY_Ref,1,3*45/time);
    move(thisObj,1,(x2-x1)/time);
    move(thisObj,2,(y2-y1)/time);//+k);
    move(thisObj,3,(z2-z1)/time);
    return false;
}
function move(myTransform,direction,step){//移动游戏对象、相机、光源
    if(typeof(step) == "undefined")step=0.1;
    if(typeof(myTransform.x) == "undefined")myTransform=myTransform.gameObject.getComponent(Web3DEngine.Transform);
    control(myTransform.localPosition,direction,step);
}
function control(control,direction,step){//为其它几个函数提供服务
    if(direction<0){//字母与数字比较大小结果始终为false
        step*=-1;
        direction*=-1;
    }
    if(direction=='x'||direction==1)control.x+=step;
    else if(direction=='y'||direction==2)control.y+=step;
    else if(direction=='z'||direction==3)control.z+=step;
}
function rotation1(myTransform,direction,step){//旋转游戏对象、相机、光源
    if(typeof(step) == "undefined")step=0.1;
    if(typeof(myTransform.x) == "undefined")myTransform=myTransform.gameObject.getComponent(Web3DEngine.Transform);
    if(direction<0){//字母与数字比较大小结果始终为false
        step*=-1;
        direction*=-1;
    }
    var dx=myTransform.localEulerAngles.x,dy=myTransform.localEulerAngles.y,dz=myTransform.localEulerAngles.z;
    if(direction=='x'||direction==1){dx+=step;dx=tool(dx);}
    else if(direction=='y'||direction==2){dy+=step;dy=tool(dy);}
    else if(direction=='z'||direction==3){dz+=step;dz=tool(dz);}
    myTransform.localEulerAngles=new THREE.Vector3(dx,dy,dz);
    function tool(n){
        if(n<0){
            n+=360;
            n=tool(n);
        }else if(n>=360){
            n-=360;
            n=tool(n);
        }return n;
    }
}