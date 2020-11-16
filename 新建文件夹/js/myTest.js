/*function loadLocalFile(fileName , loadCallback)
{
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function ()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            if (loadCallback)
            {
                loadCallback(xmlhttp.responseText);
            }
        }
    }

    xmlhttp.open("GET", fileName, true);
    xmlhttp.send();
}
loadLocalFile('startup.json', function (data) {
    var mainScene ="dongshizhang";//JSON.parse(data).mainScene;//值为模型文件的名字
    //开始加载PM文件
    //console.log(window.PMLoader );
    var pmLoader = new window.PMLoader();//加载PM文件
    pmLoader.load(mainScene, function (pmModel) {
        setupAnimationMixer(pmModel);//设置PM动画
        sceneRoot.add(pmModel);
    });
    //完成加载PM文件
    loadLocalFile('startup.json', function (data) {
        var mainScene = JSON.parse(data).mainScene;//值为模型文件的名字
        //开始加载PM文件
        var pmLoader = new window.PMLoader();//加载PM文件
        pmLoader.load(mainScene, function (pmModel) {
            setupAnimationMixer(pmModel);//设置PM动画
            sceneRoot.add(pmModel);
        });
        //完成加载PM文件
    });
});*/
//开始创建PM对象
var camera=new THREE.Object3D();
var LODArray=[45,46,50,55]//4个数字表示距离，可以将模型分为5级;
var pmLoader = new myPMLoader(
    '/myModel/dongshizhang5', //模型路径
    LODArray,//LOD等级的数组
    camera,//LOD需要判断到相机的距离
    0,//有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
    0.2//动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
);//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
var myModel=pmLoader.obj;

//出现BUG的原因是，将第一个mesh添加到了第二个对象当中
var pmLoader2 = new myPMLoader2(
    '/myModel/zhao1', //模型路径
    LODArray,//LOD等级的数组
    camera,//LOD需要判断到相机的距离
    0,//有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
    0.2//动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
);//pmLoader = new myPMLoader('myModel/dongshizhang', LODNumber);//pmLoader = new THREE.PMLoader();//加载PM文件
var myModel2=pmLoader2.obj;/**/
//完成创建PM对象