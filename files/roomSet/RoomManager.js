var myRoomManager=new RoomManager();
function RoomManager(){
    this.component=[];
    this.loadRoom=function(){
        //return;//用于测试为了更好看到PM效果
        var This=this;
        var loader= new Web3DEngine._W3DGLTFLoader;
        loader.load(
            'room/component/0010.glb',//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh0 = new Web3DEngine.Mesh;
                mesh0._originalAsset = gltf;
                //console.log(gltf.scene);
                gltf.scene._imp.traverse(node=>{
                    if(node.material){
                        if(node.material.map!=null) {
                            var nowMap = node.material.map;
                            nowMap.wrapS = THREE.RepeatWrapping;
                            nowMap.wrapT = THREE.RepeatWrapping;
                            node.material.lightMapIntensity=0.8;
                            nowMap.needsUpdate = true;
                        }
                    }
                })
                This.component.push(gltf.scene);
            }//loader.load
        );//完成加载房间模型
        for(var i=1;i<=9;i++)
        loader.load(
            'room/component/00'+i+'.glb',//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh0 = new Web3DEngine.Mesh;
                mesh0._originalAsset = gltf;
                gltf.scene._imp.traverse(node=>{
                    if(node.material){
                        if(node.material.map!=null) {
                            var nowMap = node.material.map;
                            nowMap.wrapS = THREE.RepeatWrapping;
                            nowMap.wrapT = THREE.RepeatWrapping;
                            node.material.lightMapIntensity=0.8;
                            nowMap.needsUpdate = true;
                        }
                    }
                })
                This.component.push(gltf.scene);
            }//loader.load
        );//完成加载房间模型
        //开始加载完整模型
        loader.load(
            'room/room.glb',//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function (gltf) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh = new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
                gltf.scene._imp.traverse(node=>{
                    if(node.material){
                        if(node.material.map!=null) {
                            var nowMap = node.material.map;
                            nowMap.wrapS = THREE.RepeatWrapping;
                            nowMap.wrapT = THREE.RepeatWrapping;
                            node.material.lightMapIntensity=0.8;
                            nowMap.needsUpdate = true;
                        }
                    }
                })
                //console.log(This.component);
                /*for(var i=0;i<This.component.length;i++){
                    This.component[i].transform._sceneRootGO.transform._removeChild(This.component[i].transform);
                }*/


            }//loader.load
        );
        //完成加载完整模型
    }
}