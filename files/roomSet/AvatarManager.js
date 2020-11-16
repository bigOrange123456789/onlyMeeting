var myAvatarManager=new AvatarManager();
var guest1=null;
function AvatarManager(){
    this.avatarType=[];
    this.avatar1=null;
    this.avatar2=null;
    this.avatar3=null;
    this.avatar4=null;
    this.loadNum=0;
    this.loadAvatar=function () {
        this.host();
        //this.loadGuest2();
        //this.loadGuest1();
        this.loadAvatarTool1(1,'avatar/Man01.glb');
        this.loadAvatarTool1(2,'avatar/Female01.glb');
        this.loadAvatarTool1(3,'avatar/Ganpa01.glb');
        this.loadAvatarTool1(4,'avatar/Granny01.glb');
    }
    this.loadAvatar2=function () {
        //alert(1)
        this.loadAvatarTool2(1,'avatar/Man01.glb');
        this.loadAvatarTool2(2,'avatar/Female01.glb');
        this.loadAvatarTool2(3,'avatar/Ganpa01.glb');
        this.loadAvatarTool2(4,'avatar/Granny01.glb');
    }
    this.loadAvatarTool1=function (type,url) {
        var loader = new Web3DEngine._W3DGLTFLoader;
        //开始加载男性模型
        //var url;
        var thisAvatarType=this.avatarType;
        var myThis=this;
        loader.load(
            url,//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                if(gltf.scene.transform._sceneRootGO)gltf.scene.transform._sceneRootGO.transform._removeChild(gltf.scene.transform);// 若存在于场景中，则移除
                if(type==1)myThis.avatar1=mesh;

                for (var i = 0; i < thisAvatarType.length/2; i++)
                    if (thisAvatarType[i] == type) {
                        //setTimeout(function(){
                        var nowMan = new Web3DEngine.GameObject();
                        var SkinnedMeshRenderer = nowMan.addComponent(Web3DEngine.SkinnedMeshRenderer);//为对象添加蒙皮渲染插件
                        nowMan.addComponent(Web3DEngine.AnimationPlayer);
                        SkinnedMeshRenderer.mesh = mesh;//将模型赋值给蒙皮组件
                        ////////////////////////////
                        nowMan.getComponent(Web3DEngine.Transform).localScale = new THREE.Vector3(0.5, 0.5, 0.5);
                        nowMan.getComponent(Web3DEngine.Transform).localEulerAngles = new THREE.Vector3(0, 90, 0);
                        var nowPos =chairSave[i].getComponent(Web3DEngine.Transform).localPosition;
                        nowMan.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(nowPos.x + 0.2, nowPos.y + 0.1, nowPos.z);
                        var play = nowMan.getComponent(Web3DEngine.SkinnedMeshRenderer).gameObject.getComponent(Web3DEngine.AnimationPlayer);

                        play.CrossFade('Clap', 0.1);
                        nowMan._imp.traverse(node => {
                            if (node.material) {
                                node.material.side = 0;
                            }
                        })
                        //},100);
                    }
                ///////////////完成布置NPC/////////////
            }//loader.load
        );//完成加载模型
    }
    this.loadAvatarTool2=function (type,url) {
        var loader = new Web3DEngine._W3DGLTFLoader;
        //开始加载男性模型
        //var url;
        var thisAvatarType=this.avatarType;
        var myThis=this;
        loader.load(
            url,//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                if(gltf.scene.transform._sceneRootGO)gltf.scene.transform._sceneRootGO.transform._removeChild(gltf.scene.transform);// 若存在于场景中，则移除
                if(type==1)myThis.avatar1=mesh;

                for (var i =0; i < thisAvatarType.length; i++)
                    if (thisAvatarType[i] == type) {
                        //setTimeout(function(){
                        var nowMan = new Web3DEngine.GameObject();
                        var SkinnedMeshRenderer = nowMan.addComponent(Web3DEngine.SkinnedMeshRenderer);//为对象添加蒙皮渲染插件
                        nowMan.addComponent(Web3DEngine.AnimationPlayer);
                        SkinnedMeshRenderer.mesh = mesh;//将模型赋值给蒙皮组件
                        ////////////////////////////
                        nowMan.getComponent(Web3DEngine.Transform).localScale = new THREE.Vector3(0.5, 0.5, 0.5);
                        nowMan.getComponent(Web3DEngine.Transform).localEulerAngles = new THREE.Vector3(0, 90, 0);
                        var nowPos =chairSave[i].getComponent(Web3DEngine.Transform).localPosition;
                        nowMan.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(nowPos.x + 0.2, nowPos.y + 0.1, nowPos.z);
                        var play = nowMan.getComponent(Web3DEngine.SkinnedMeshRenderer).gameObject.getComponent(Web3DEngine.AnimationPlayer);

                        play.CrossFade('Clap', 0.1);
                        nowMan._imp.traverse(node => {
                            if (node.material) {
                                node.material.side = 0;
                            }
                        })
                        //},100);
                    }
                ///////////////完成布置NPC/////////////
            }//loader.load
        );//完成加载模型
    }
    this.host=function () {//主持人
        var loader = new Web3DEngine._W3DGLTFLoader;
        var thisAvatarType=this.avatarType;
        loader.load(
            'avatar/host.glb',//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                gltf.scene.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(19.6, 0.87, -6.4);
                gltf.scene.getComponent(Web3DEngine.Transform).localEulerAngles=new THREE.Vector3(0,-90,0);
                gltf.scene.getComponent(Web3DEngine.Transform).localScale=new THREE.Vector3(1,1,1);
                var play = gltf.scene.addComponent(Web3DEngine.AnimationPlayer);
                //play.CrossFade('huishou', 0.1);
            }//loader.load
        );//完成加载模型
    }
    this.loadGuest1=function () {//嘉宾1
        var loader = new Web3DEngine._W3DGLTFLoader;
        var thisAvatarType=this.avatarType;
        loader.load(
            'avatar/dongshizhang.glb',//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                gltf.scene.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(19.71, 0.87, -2);
                gltf.scene.getComponent(Web3DEngine.Transform).localEulerAngles=new THREE.Vector3(0,-90,0);
                gltf.scene.getComponent(Web3DEngine.Transform).localScale=new THREE.Vector3(0.11,0.11,0.11);
                var play = gltf.scene.addComponent(Web3DEngine.AnimationPlayer);
                play.CrossFade('huishou', 0.1);
            }//loader.load
        );//完成加载模型
    }
    this.loadGuest2=function () {//嘉宾1
        var loader = new Web3DEngine._W3DGLTFLoader;
        var thisAvatarType=this.avatarType;
        loader.load(
            'avatar/zhao.glb',//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                gltf.scene.getComponent(Web3DEngine.Transform).localPosition = new THREE.Vector3(19.71, 0.85, 0);
                gltf.scene.getComponent(Web3DEngine.Transform).localEulerAngles=new THREE.Vector3(0,-90,0);
                gltf.scene.getComponent(Web3DEngine.Transform).localScale=new THREE.Vector3(0.11,0.11,0.11);
                var play = gltf.scene.addComponent(Web3DEngine.AnimationPlayer);
                play.CrossFade('huishou', 0.1);
            }//loader.load
        );//完成加载模型
    }

}