var myWord3DManager=new Word3DManager();
function Word3DManager() {
    //this.
    this.init=function () {

    }
    this.loadModel=function (src) {
        var loader= new Web3DEngine._W3DGLTFLoader;
        loader.load(
            src,//'robot06.glb',//'files/assets/man.glb',//'birds.glb',//'files/assets/man.glb',
            function ( gltf ) {//console.log(Web3DEngine.SceneManager.GetActiveScene()._imp.children);
                var mesh= new Web3DEngine.Mesh;
                mesh._originalAsset = gltf;
            }//loader.load
        );//完成加载房间模型
    }
}