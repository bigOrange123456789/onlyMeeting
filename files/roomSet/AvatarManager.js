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
        this.host();//this.loadGuest2();//this.loadGuest1();
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
    function makeInstanced(geo, mtxObj, oriName, type){
        let mtxKeys = Object.keys(mtxObj);
        let instanceCount = mtxKeys.length + 1;
        //生成mesh只需要两样东西，材质material和几何igeo
        //1.material
        var vert = document.getElementById('vertInstanced').textContent;
        var frag = document.getElementById('fragInstanced').textContent;
        let myTexture = selectTextureByType(type,0.001);
        var uniforms={texture:{type: 't', value: myTexture}};
        var material=new THREE.RawShaderMaterial({
            uniforms:uniforms,
            vertexShader:vert,
            fragmentShader:frag
        });
        //2.igeo几何//InstancedBufferGeometry//将原网格中的geo拷贝到igeo中
        //设置位置信息
        var igeo=new THREE.InstancedBufferGeometry();//geometry//threeJS中有一种对象叫InstancedMesh，构造方法为InstancedMesh( geometry : BufferGeometry, material : Material, count : Integer )
        var vertices=geo.attributes.position.clone();
        igeo.addAttribute('position',vertices);//设置几何中的点
        igeo.setIndex(geo.index);
        var mcol0,mcol1,mcol2,mcol3;
        mcol0=mcol1=mcol2=mcol3=new THREE.InstancedBufferAttribute(
            new Float32Array(instanceCount * 3), 3
        );
        mcol0.setXYZ(0,1,0,0);//设置原始mesh的变换矩阵与名称
        mcol1.setXYZ(0,0,1,0);//四元数、齐次坐标
        mcol2.setXYZ(0,0,0,1);
        mcol3.setXYZ(0,0,0,0);//这16个数字构成了一个 4*4 的矩阵
        let instancedMeshName=oriName;
        for (let i=1,ul=instanceCount; i < ul; i++){
            let currentName=mtxKeys[i - 1];
            let mtxElements=mtxObj[currentName];
            mcol0.setXYZ(i,mtxElements[0], mtxElements[1], mtxElements[2]);
            mcol1.setXYZ(i,mtxElements[4], mtxElements[5], mtxElements[6]);
            mcol2.setXYZ(i,mtxElements[8], mtxElements[9], mtxElements[10]);
            mcol3.setXYZ(i,mtxElements[12], mtxElements[13], mtxElements[14]);
            instancedMeshName+=('_' + currentName);
        }
        igeo.addAttribute('mcol0', mcol0);//四元数、齐次坐标
        igeo.addAttribute('mcol1', mcol1);
        igeo.addAttribute('mcol2', mcol2);
        igeo.addAttribute('mcol3', mcol3);//console.log(igeo);
        var colors=new THREE.InstancedBufferAttribute(
            new Float32Array(instanceCount * 3), 3
        );
        for(let i=0,ul=colors.count;i<ul;i++){// colors.setXYZ(i, color.r, color.g, color.b);
            colors.setXYZ(i,0.33,0.33,0.33);
        }
        igeo.addAttribute('color', colors);
        //3.mesh
        var mesh=new THREE.Mesh(igeo, material);//生成的还是mesh对象
        mesh.scale.set(0.001, 0.001, 0.001);
        mesh.material.side=THREE.DoubleSide;
        mesh.frustumCulled=false;
        mesh.name = oriName;
        sceneRoot.add(mesh);
    }
    this.loadAvatarTool1=function (type,url) {
        var loader=new Web3DEngine._W3DGLTFLoader;
        //开始加载男性模型
        var thisAvatarType=this.avatarType;
        var myThis=this;
        loader.load(
            url,//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                if(gltf.scene.transform._sceneRootGO)gltf.scene.transform._sceneRootGO.transform._removeChild(gltf.scene.transform);// 若存在于场景中，则移除
                if(type==1)myThis.avatar1=mesh;

                var nowMan0 = new Web3DEngine.GameObject();
                var SkinnedMeshRenderer = nowMan0.addComponent(Web3DEngine.SkinnedMeshRenderer);//为对象添加蒙皮渲染插件
                nowMan0.addComponent(Web3DEngine.AnimationPlayer);
                SkinnedMeshRenderer.mesh = mesh;

                for (var i = 0; i < thisAvatarType.length; i++)
                    if (thisAvatarType[i] == type) {
                        /*var nowMan = new Web3DEngine.GameObject();
                        var SkinnedMeshRenderer = nowMan.addComponent(Web3DEngine.SkinnedMeshRenderer);//为对象添加蒙皮渲染插件
                        nowMan.addComponent(Web3DEngine.AnimationPlayer);
                        SkinnedMeshRenderer.mesh = mesh;*///将模型赋值给蒙皮组件

                        console.log("XIN KUAI");
                        var nowMan=Web3DEngine.GameObject.Instantiate(nowMan0);


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