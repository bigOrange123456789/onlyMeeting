function SceneSet(go) {
    Web3DEngine.MonoBehaviour.call(this, go);
    this.instClassType = SceneSet.classType;
    this.chair=null;
    this.stats=null;
    this.hosttalk=null;
    this.zhengtalk=null;
    this.zhaotalk=null;

    this.f=0;
}

var chairSave;
chairSave=[];
var peopleSave;
peopleSave=[];

var door1,door2,bigScreen,dsz,zhaoys;
var hostsay,zhaosay,zhengsay;//,zhaopai,zhengpai;

Web3DEngine.ExtendType( SceneSet , Web3DEngine.MonoBehaviour, {
	Awake:function(arg){
	    //主持人台词
        hostsay=creater(this.hosttalk);
        hostsay.transform.localEulerAngles=new THREE.Vector3(0,-90,0);
        hostsay.getComponent(Web3DEngine.Transform).localPosition.set(19.626518677119865,
            3.8053613617811672,
            -5.92564156484776);
        hostsay._imp.visible=false;

        //赵院士台词
        zhaosay=creater(this.zhaotalk);
        zhaosay.transform.localEulerAngles=new THREE.Vector3(0,-90,0);
        zhaosay.getComponent(Web3DEngine.Transform).localPosition.set(19.793363383810075,
            3.831724484699498,
            0.472692491836213);
        zhaosay._imp.visible=false;

        //董事长台词
        zhengsay=creater(this.zhengtalk);
        zhengsay.transform.localEulerAngles=new THREE.Vector3(0,-90,0);
        zhengsay.getComponent(Web3DEngine.Transform).localPosition.set(19.636799879669237,
            3.795298040096972,
            -1.5);
        zhengsay._imp.visible=false;
    },
	Update:function(arg){
        updateWindowSize();
	    if(this.f==1){
            myRoomManager.loadRoom();
            ///开始PM
            var camera=appInst._renderScenePass.camera;
            var LODArray=[70]//1个数字表示距离，可以将模型分为1级;
            var pmLoader = new MyPMLoader(
                '/myModel/dongshizhang5', //模型路径
                LODArray,//LOD等级的数组
                camera,//LOD需要判断到相机的距离
                0,//有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                0.2//动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
            var myModel=pmLoader.obj;

            var pmLoader2 = new MyPMLoader(
                '/myModel/zhao1', //模型路径
                LODArray,//LOD等级的数组
                camera,//LOD需要判断到相机的距离
                0,//有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                0.2//动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            );//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
            var myModel2=pmLoader2.obj;

            myModel.rotation.set(0,-Math.PI/2,0);
            myModel.scale.set(0.105,0.105,0.105);
            myModel.position.set(19,0.9,-1.8);//x是前后，z是左右//rootObject.rotation.set();
            appInst._renderScenePass.scene.add(myModel);//new ParamMeasure(myModel,0);/**/

            myModel2.rotation.set(0,-Math.PI/2,0);
            myModel2.scale.set(0.105,0.105,0.105);
            myModel2.position.set(19,0.9,-0.6 );//x是前后，z是左右//rootObject.rotation.set();
            appInst._renderScenePass.scene.add(myModel2);
            //console.log(new Web3DEngine.GameObject());

            var obj=new Web3DEngine.GameObject();
            console.log(myModel2);//.children
            obj._imp.add(myModel2);
            obj.transform.localScale=new THREE.Vector3(1,1,1);
            obj.transform.position=new THREE.Vector3(0,0,0);
            var obj2=Web3DEngine.GameObject.Instantiate(obj);//0000
            obj2.transform.position=new THREE.Vector3(0.5,0,0);
            console.log(obj2);
            //console.log(myModel2.child[0]);
            //完成新的PM
        }else if(this.f==3){
            //椅子摆放
            var firstChair=creater(this.chair);
            firstChair.transform.localScale.set(0.03,0.03,0.03);
            firstChair.transform.localEulerAngles=new THREE.Vector3(0,-90,0);
            firstChair.getComponent(Web3DEngine.Transform).localPosition.set(-11,-2,15);

            for(var k=0;k<3;k++)//一楼前部分
                for(var i=0;i<12;i++)
                    for(var j=0;j<13;j++){
                        var newChair=Web3DEngine.GameObject.Instantiate(firstChair);
                        newChair.getComponent(Web3DEngine.Transform).localPosition.set(10.5-0.6*i,0.1+i*0.03,8.5-0.4*j-k*7.6);//前后、上下、左右
                        chairSave.push(newChair);
                    }

            for(var k=0;k<3;k++)//一楼后部分
                for(var i=0;i<17;i++)
                    for(var j=0;j<13;j++){
                        var newChair=Web3DEngine.GameObject.Instantiate(firstChair);
                        newChair.getComponent(Web3DEngine.Transform).localPosition.set(3.2-0.9*i,0.5+i*0.145,8.5-0.4*j-k*7.6);//前后、上下、左右
                        chairSave.push(newChair);
                    }
            for(var k=0;k<3;k++)//二楼//
                for(var i=0;i<14;i++)
                    for(var j=0;j<13;j++){
                        var newChair=Web3DEngine.GameObject.Instantiate(firstChair);
                        newChair.getComponent(Web3DEngine.Transform).localPosition.set(-1.6-0.9*i,8.95+i*0.5,8.5-0.4*j-k*7.6);//前后、上下、左右
                        chairSave.push(newChair);
                    }
            /*chairSave[1].getComponent(Web3DEngine.Transform).localScale
            =new THREE.Vector3(0.1,0.5,0.1);
            chairSave[0].getComponent(Web3DEngine.Transform).localPosition
                =new THREE.Vector3(0,0,0);
                //这里用到的应该不是真正的实例化渲染技术
                */
            console.log(chairSave[1].getComponent(Web3DEngine.Transform).localScale);
            //==========================================
            //==============添加人物================
            for(var i=0;i<chairSave.length/10;i++)myAvatarManager.avatarType.push(randomNum(1,4));
            //====================================
        }else if(this.f==70) myAvatarManager.loadAvatar();
	    //else if(this.f==180)myAvatarManager.loadAvatar2();
	    if(this.f<182)this.f++;
    },
    LateUpdate:function(arg){
    },
	OnDestroy:function(dt){
	}

});
var myW=0,myH=0;
function updateWindowSize(){
    if(myH!=window.innerHeight||myW!=window.innerWidth){
        myH=window.innerHeigh;
        myW=window.innerWidth;
        appInst.setRenderSize(window.innerWidth, window.innerHeight);
        Web3DEngine.Camera.allCameras[0].aspect=window.innerWidth/window.innerHeight;
    }
}
SceneSet.attributes.add( 'hosttalk', {
    type: 'asset',
    title: 'hosttalk'
});
SceneSet.attributes.add( 'zhengtalk', {
    type: 'asset',
    title: 'zhengtalk'
});
SceneSet.attributes.add( 'zhaotalk', {
    type: 'asset',
    title: 'zhaotalk'
});
SceneSet.attributes.add( 'chair', {
    type: 'asset',
    title: 'chair'
});

function creater(model,haveAnimation){
    var obj = new Web3DEngine.GameObject();
    var SkinnedMeshRenderer=obj.addComponent(Web3DEngine.SkinnedMeshRenderer);//为对象添加蒙皮渲染插件
    if(typeof(haveAnimation) != "undefined"&&haveAnimation)obj.addComponent(Web3DEngine.AnimationPlayer);
    SkinnedMeshRenderer.mesh = model;//将模型赋值给蒙皮组件
    return obj;
}

//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        default:
            return 0;
    }
}