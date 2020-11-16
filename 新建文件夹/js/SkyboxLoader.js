THREE.SkyboxLoader = function ( manager )
{
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};

THREE.SkyboxLoader.prototype = {
    constructor: THREE.SkyboxLoader,

    load: function (onLoad, onProgress, onError)
    {
        var scope = this;
        
        scope.parse(onLoad);
    },

    parse: function (onLoad)
    {
        var rootObject = new THREE.Object3D();

        var allProbes = {"probes":[{"name":"Skybox","positiveX":"HDR_0_Skybox_PositiveX","positiveY":"HDR_0_Skybox_PositiveY","positiveZ":"HDR_0_Skybox_PositiveZ","negativeX":"HDR_0_Skybox_NegativeX","negativeY":"HDR_0_Skybox_NegativeY","negativeZ":"HDR_0_Skybox_NegativeZ","affectedMesh":["glass_ED861906","Mesh_25D8A930"]}]};

        var loadedCounter = 0;
        var cubeProbes = [];

        var probes = allProbes.probes;
        for (var i = 0 ; i < probes.length ; ++i)
        {
            var genCubeUrls = function( probeTextures , prefix , postfix) {
                return [
                    prefix + probeTextures.positiveX + postfix,
                    prefix + probeTextures.negativeX + postfix,
                    prefix + probeTextures.negativeY + postfix,
                    prefix + probeTextures.positiveY + postfix,
                    prefix + probeTextures.positiveZ + postfix,
                    prefix + probeTextures.negativeZ + postfix
                ];
            };

            var probeData = probes[i];
            var cubeTextureLoader = new THREE.CubeTextureLoader();
            var url = genCubeUrls(probes[i] , 'skybox' + '/' , '.png');
            cubeTextureLoader.load(url , function(reflectionCube)
            {
                reflectionCube.format = THREE.RGBFormat;
                reflectionCube.minFilter = THREE.LinearFilter;
                reflectionCube.magFilter = THREE.LinearFilter;

                cubeProbes.push(reflectionCube);

                if (probeData.name == "Skybox")
                {
                    setupSkybox(reflectionCube);

                    onLoad(rootObject);
                }

                loadedCounter++;
            });
        }

        /***************************************************************************************************************/
        function setupSkybox(skyProbe)
        {
            var cubeShader = THREE.ShaderLib[ "cube" ];
            var cubeMaterial = new THREE.ShaderMaterial( {
                fragmentShader: cubeShader.fragmentShader,
                vertexShader: cubeShader.vertexShader,
                uniforms: cubeShader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            } );

            cubeMaterial.uniforms[ "tCube" ].value = skyProbe;

            var cubeMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), cubeMaterial );
            rootObject.add( cubeMesh );
        }
    }
}