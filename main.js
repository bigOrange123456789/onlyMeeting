function PMLoader(){//整体性能最重要
    this.splitCount;//PM模型的JSON文件的总数量数量

    this.loadMesh=function (path){
        this.path=path;
        this.loadBaseMesh(this.path+'/'+this.BaseMeshFileName);
        return this.rootObject;
    }
    this.loadBaseMesh=function(path)//加载基础网格
    {
        var THIS=this;
        THIS.loadLocalFile(path, function (data)
        {
            var jsonData = JSON.parse(data);//JSON.parse用于将一个JSON字符串转换为对象
            for(var i=0;i<jsonData.geometries[0].data.vertices.length/3;++i) {
                THIS.meshData.vertices.push([
                    jsonData.geometries[0].data.vertices[i * 3 + 0],
                    jsonData.geometries[0].data.vertices[i * 3 + 1],
                    jsonData.geometries[0].data.vertices[i * 3 + 2]
                ]);
            }
            for (var i=0;i<jsonData.geometries[0].data.uvs.length / 6;   ++i) {
                THIS.meshData.uvs[i]=[
                    jsonData.geometries[0].data.uvs[i * 6 + 0],
                    jsonData.geometries[0].data.uvs[i * 6 + 1],
                    jsonData.geometries[0].data.uvs[i * 6 + 2],
                    jsonData.geometries[0].data.uvs[i * 6 + 3],
                    jsonData.geometries[0].data.uvs[i * 6 + 4],
                    jsonData.geometries[0].data.uvs[i * 6 + 5]
                ];
            }
            for(var i=0;i<jsonData.geometries[0].data.faces.length/3;++i){
                THIS.meshData.faces[i]=[
                    jsonData.geometries[0].data.faces[i * 3 + 0],
                    jsonData.geometries[0].data.faces[i * 3 + 1],
                    jsonData.geometries[0].data.faces[i * 3 + 2]
                ];
            }
            THIS.computeIncidentFaces();//从meshData中获得当前incidentFaces的值

            ///////////在这里可以绑定贴图
            var texture=THREE.ImageUtils.loadTexture(this.texturesPath);
            texture.wrapS= THREE.RepeatWrapping;
            texture.wrapT= THREE.RepeatWrapping;
            THIS.meshMat = new THREE.MeshStandardMaterial({map: texture});

            THIS.loadLocalFile(THIS.path+'/desc.json',function (data)
            {
                var jsonData = JSON.parse(data);
                THIS.splitCount = jsonData.splitCount;
                THIS.startPmLoading(THIS);
            },THIS);
        },THIS);
    }
    this.computeIncidentFaces=function()//只服务于--loadBaseMesh加载基础网格--只执行一次
    {//清空incidentFaces，并重置incidentFaces
        this.incidentFaces={}
        for(var i=0;i<this.meshData.vertices.length ; ++i)
            this.incidentFaces[i] = [];
        for(var fi in this.meshData.faces)
            for(var vi = 0 ; vi < this.meshData.faces[fi].length ; ++vi)
                this.incidentFaces[this.meshData.faces[fi][vi]].push(fi);
    }
    this.startPmLoading=function()//完调加载函数后，如果还有没加载的json就调用自己
    {
        var THIS=this;

        this.loadPmMesh(THIS.pmCount , function()
        {
            if (THIS.pmCount<THIS.splitCount)THIS.startPmLoading(THIS);//setTimeout(function(){THIS.startPmLoading(THIS);} , 300);
            //else if(THIS.isPmLoading==false)this.restoreMesh(THIS);
        },THIS);
        THIS.pmCount++;
    }
    PMLoader1.call(this);
}
function PMLoader1(){
    this.path='pm';
    this.texturesPath='textures/dulong.jpg';
    this.BaseMeshFileName='basemesh.json';
    this.isPmLoading=true;
    this.rootObject=new THREE.Object3D();
    this.mesh;///
    this.pmMeshHistory=[];
    this.meshMat=null;
    this.pmCount=0;
    this.incidentFaces = {};
    this.meshData={vertices:[],faces:{}, uvs:{}};
    this.loadPmMesh=function(index,callback,THIS)//加载PM网格//被调用了53次
    {
        console.log('加载等级'+(index+1));
        console.log(this.mesh);
        THIS.loadLocalFile(THIS.path+'/pmmesh' + index + '.json', function (data)
        {
            var pmData=JSON.parse(data);//data是读取的json文件数据
            THIS.pmRestore(pmData,THIS);
            //开始测试
            if(THIS.pmMeshHistory.length==53){
                document.onkeydown = function(e){
                    if (e.key == "N"||e.key == "n")THIS.nextPmLevel();
                }
                //var myobj1=THIS.rootObject.clone();
                //var myobj1=new THREE.Object3D();myobj1.copy(THIS.rootObject);
                //console.log(myobj1.children[0].geometry);
                //myobj1.position.set(5.5,-5,-1.6);
                //appInst._renderScenePass.scene.add(myobj1);

                /*var lod = new THREE.LOD();
                for( var i = 0; i <THIS.pmMeshHistory.length; i++ ) {
                    lod.addLevel(THIS.pmMeshHistory[i], i *0.1);
                }
                lod.position.set(5.5,-5,-1.6);
                lod.scale.set(30,30,30);
                appInst._renderScenePass.scene.add( lod );*/




            }
            //完成测试
            if(callback)callback();
        },THIS);
    }
    this.nextPmLevel=function()
    {
        var i=prompt("请输入1-"+this.pmMeshHistory.length+"的数字",0);
        if(i<1)i=1;else if(i>this.pmMeshHistory.length)i=this.pmMeshHistory.length;
        this.rootObject.add(this.pmMeshHistory[i]);
        this.rootObject.remove(this.mesh);
        this.mesh=this.pmMeshHistory[i+1];
        this.rootObject.add(this.mesh);
        console.log(this.mesh.geometry);
    }
    this.pmRestore=function(pmData,THIS)//加载完json文件后进行，每加载一个JSON文件运行一次
    {
        //每个JSON文件是一个数组，数组的每个元素是一组面的数据
        for(var si=0;si<pmData.length;++si)THIS.restoreVertexSplit(si,pmData[si],THIS);
        if(THIS.isPmLoading)THIS.restoreMesh(THIS);
    }
    this.restoreVertexSplit=function(si,vsData,THIS)//加载完一个PM JOSON后，处理JSON数组中的一组数据
    {
        //JSON数组中的每组数据修正一个点
        THIS.meshData.vertices[vsData.S][0]=vsData.SPosition[0];
        THIS.meshData.vertices[vsData.S][1]=vsData.SPosition[1];
        THIS.meshData.vertices[vsData.S][2]=vsData.SPosition[2];

        //JSON数组中的每组数据除了上面的修正一个点外，还会添加1个点
        THIS.meshData.vertices.push([vsData.TPosition[0],vsData.TPosition[1],vsData.TPosition[2]]);
        var t=THIS.meshData.vertices.length-1;//最后一个点对应的下标
        THIS.incidentFaces[t]=[];//将面数扩充为点数

        var newFacesOfS=[];
        var addnum=0;
        for (var fosi=0;fosi<THIS.incidentFaces[vsData.S].length ; ++fosi)
        {
            //内部每个三角面执行一次
            var objectF={faceIndex:0,faceSIndex:0};
            var c=THIS.isOriginalFaceOfT(t,objectF,THIS.incidentFaces[vsData.S][fosi] , vsData,THIS);
            var bufferIndex=THIS.incidentFaces[vsData.S][fosi];
            if (c<0)
            {
                var faceIndexS=objectF.faceSIndex;
                newFacesOfS.push(bufferIndex);
                var newfUVs=[
                    vsData.UVs[faceIndexS*6+0],
                    vsData.UVs[faceIndexS*6+1],
                    vsData.UVs[faceIndexS*6+2],
                    vsData.UVs[faceIndexS*6+3],
                    vsData.UVs[faceIndexS*6+4],
                    vsData.UVs[faceIndexS*6+5]
                ];
                THIS.meshData.uvs[bufferIndex]=newfUVs;
                continue;
            }
            addnum++;

            THIS.meshData.faces[bufferIndex][c]=t;
            THIS.incidentFaces[t].push(bufferIndex);
            //updata uv
            var faceIndex=objectF.faceIndex;
            var newfUV=[
                vsData.UVs[faceIndex*6+0],
                vsData.UVs[faceIndex*6+1],
                vsData.UVs[faceIndex*6+2],
                vsData.UVs[faceIndex*6+3],
                vsData.UVs[faceIndex*6+4],
                vsData.UVs[faceIndex*6+5]
            ];
            THIS.meshData.uvs[bufferIndex]=newfUV;
        }
        THIS.incidentFaces[vsData.S] = newFacesOfS;

        for (var sfi = 0 ; sfi < vsData.Faces.length ; sfi+=3)
        {
            var hasST;

            if     (vsData.Faces[sfi+0] == vsData.S){hasST=(vsData.Faces[sfi+1] ==t ||vsData.Faces[sfi+2] == t)}
            else if(vsData.Faces[sfi+1] == vsData.S){hasST=(vsData.Faces[sfi+0] ==t ||vsData.Faces[sfi+2] == t)}
            else if(vsData.Faces[sfi+2] == vsData.S){hasST=(vsData.Faces[sfi+0] ==t ||vsData.Faces[sfi+1] == t)}
            else hasST=false;

            if (!hasST)continue;

            var newFace=[vsData.Faces[sfi+0] , vsData.Faces[sfi+1] , vsData.Faces[sfi+2]];
            var index=(sfi/3);
            var iUV=[vsData.UVs[index*6+0],vsData.UVs[index*6+1],vsData.UVs[index*6+2],vsData.UVs[index*6+3],vsData.UVs[index*6+4],vsData.UVs[index*6+5]];
            var num=THIS.objLength(THIS.meshData.faces);
            THIS.meshData.uvs[num]=iUV;
            THIS.meshData.faces[num]=newFace;

            for (var i=0;i<newFace.length;++i)
                THIS.incidentFaces[newFace[i]].push(num);
        }
    }
    this.loadLocalFile=function(fileName,loadCallback)//文件名，？//应该是用于加载json文件的
    {
        var xmlhttp=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function()
        {//每当 readyState 属性改变时，就会调用该函数。readyState从0-4发生变化。
            if (xmlhttp.readyState== 4&&xmlhttp.status == 200&&loadCallback)
                loadCallback(xmlhttp.responseText);
        }
        xmlhttp.open("GET", fileName, true);
        xmlhttp.send();
    }
    /////////////////////////////////////////////////////////////
    this.restoreMesh=function(THIS)//加载好了新的资源，更新root对象的网格//执行次数为json文件的个数
    {
        if(THIS.mesh)THIS.rootObject.remove(THIS.mesh);
        var geometry=new THREE.BufferGeometry();
        THIS.mesh = new THREE.Mesh(geometry,THIS.meshMat);//THIS.meshMat是材质贴图
        THIS.updateGeometry(THIS.mesh.geometry,THIS);
        THIS.rootObject.add(THIS.mesh);
        THIS.pmMeshHistory.push(THIS.mesh);
        THIS.pmMeshHistory_flag=THIS.pmMeshHistory.length-1;
    }

    PMLoader2.call(this);
}
function PMLoader2() {//只被调用1次且不调用其它函数的函数
    this.isOriginalFaceOfT=function(tIndex,objectF,face,vsData,THIS)///还原坍塌点
    {//每个三角面执行一次
        for (var vsfi =0;vsfi<vsData.Faces.length;vsfi+=3)
        {
            var index =-1;
            var isFace=true;
            for (var i=0;i<3;++i)
            {
                if(vsData.Faces[vsfi+i]==THIS.meshData.faces[face][i])
                    objectF.faceSIndex=(vsfi/3);
                if(vsData.Faces[vsfi+i] == tIndex && THIS.meshData.faces[face][i]== vsData.S)
                {
                    index = i;
                    objectF.faceIndex=(vsfi/3);
                }
                else if(vsData.Faces[vsfi+i] != THIS.meshData.faces[face][i])isFace = false;
            }
            if (isFace)return index;
        }
        return -1;
    }
    this.updateGeometry=function(geometry ,THIS)
    {
        var verticesArray=new Float32Array(THIS.objLength(THIS.meshData.faces) * 3 * 3);
        var indicesArray =new Uint32Array(THIS.objLength(THIS.meshData.faces) * 3);
        var uvsArray=new Float32Array(THIS.objLength(THIS.meshData.faces) * 3*2);
        var f1=0;
        for (var key in THIS.meshData.faces)
        {
            indicesArray[f1 * 3 + 0] = f1 * 3 + 0;
            indicesArray[f1 * 3 + 1] = f1 * 3 + 1;
            indicesArray[f1 * 3 + 2] = f1 * 3 + 2;

            //position
            var fx=THIS.meshData.faces[key][0];
            var fy=THIS.meshData.faces[key][1];
            var fz=THIS.meshData.faces[key][2];
            verticesArray[f1*9+0]=THIS.meshData.vertices[fx][0];
            verticesArray[f1*9+1]=THIS.meshData.vertices[fx][1];
            verticesArray[f1*9+2]=THIS.meshData.vertices[fx][2];
            verticesArray[f1*9+3]=THIS.meshData.vertices[fy][0];
            verticesArray[f1*9+4]=THIS.meshData.vertices[fy][1];
            verticesArray[f1*9+5]=THIS.meshData.vertices[fy][2];
            verticesArray[f1*9+6]=THIS.meshData.vertices[fz][0];
            verticesArray[f1*9+7]=THIS.meshData.vertices[fz][1];
            verticesArray[f1*9+8]=THIS.meshData.vertices[fz][2];

            //uv
            uvsArray[f1*6+0]=THIS.meshData.uvs[f1][0];
            uvsArray[f1*6+1]=THIS.meshData.uvs[f1][1];
            uvsArray[f1*6+2]=THIS.meshData.uvs[f1][2];
            uvsArray[f1*6+3]=THIS.meshData.uvs[f1][3];
            uvsArray[f1*6+4]=THIS.meshData.uvs[f1][4];
            uvsArray[f1*6+5]=THIS.meshData.uvs[f1][5];
            f1++;
        }

        geometry.setIndex( new THREE.BufferAttribute(indicesArray, 1));
        geometry.addAttribute( 'position', new THREE.BufferAttribute(verticesArray , 3));
        geometry.addAttribute('uv',new THREE.BufferAttribute(uvsArray,2));
        geometry.computeVertexNormals();
        verticesArray=null;
        indicesArray=null;
        uvsArray=null;
        geometry.needsUpdate = true;
    }
    this.objLength = function (object)//统计对象中成员变量的数量
    {//模型的每一部分被加载好后都会执行多次，可以首先计算好再存储起来，这样可以更加节省时间
        var n = 0;
        for (var i in object) n++;
        return n;
    }
}