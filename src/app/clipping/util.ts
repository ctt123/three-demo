import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import {DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Vector3} from "three";
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
// 创建圆形
const getCircle = ()=>{
    const geometry = new THREE.CircleGeometry(1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const circle = new THREE.Mesh(geometry, material);
    return circle;
}

const getLineLoop = () => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff
    })
    const lineLoop = new THREE.LineLoop(geometry, material)
    return lineLoop
}

export const drawCircle = () => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 5;
    camera.position.z = 0;

    // const light = new THREE.DirectionalLight( 0xffffff );
    // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    // light.position.set( 10, 10, -1 );
    const light = new THREE.PointLight( 0xff0000, 1, 100 );
    light.position.set( 50, 50, 50 );
    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the first circle
    // const circleGeometry1 = new THREE.CircleGeometry(1, 32);
    // const circleMaterial1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const circle1 = new THREE.Mesh(circleGeometry1, circleMaterial1);
    // circle1.position.set(0, 0, 0);
    // // circle1.rotation.z=Math.PI/3
    // scene.add(circle1);

    // 一个正方体
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );


    // Create the second circle
    // const circleGeometry2 = new THREE.CircleGeometry(1, 32);
    // const circleMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const circle2 = new THREE.Mesh(circleGeometry2, circleMaterial2);
    // circle2.position.set(1, 0, 0);
    // scene.add(circle2);

    // Render the scene
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}



export const render = () => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 10, 10, 10 );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 10, 10 );
    scene.add( light );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // 画了一个正方体
    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // 画一个圆圈
    const lineLoop = getLineLoop()
    scene.add(lineLoop)

    // 添加圆形到场景中
    // const circle = getCircle();
    // scene.add(circle);





    function animate() {
        requestAnimationFrame( animate );

        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

    animate();
}
export const draw = ()=>{
    let camera, scene, renderer, object, stats;
    let planes, planeObjects, planeHelpers;
    let clock;

    const params = {

        animate: false,
        planeX: {

            constant: 1,
            negated: false,
            displayHelper: false

        },
        planeY: {

            constant: 1,
            negated: false,
            displayHelper: false

        },
        planeZ: {

            constant: 1,
            negated: false,
            displayHelper: false

        }


    };

    init();
    animate();

    function createPlaneStencilGroup( geometry, plane, renderOrder ) {
        console.log('createPlaneStencilGroup::', createPlaneStencilGroup)

        const group = new THREE.Group();
        const baseMat = new THREE.MeshBasicMaterial();
        baseMat.depthWrite = false;
        baseMat.depthTest = false;
        baseMat.colorWrite = false;
        baseMat.stencilWrite = true;
        baseMat.stencilFunc = THREE.AlwaysStencilFunc;

        // back faces
        const mat0 = baseMat.clone();
        mat0.side = THREE.BackSide;
        mat0.clippingPlanes = [ plane ];
        mat0.stencilFail = THREE.IncrementWrapStencilOp;
        mat0.stencilZFail = THREE.IncrementWrapStencilOp;
        mat0.stencilZPass = THREE.IncrementWrapStencilOp;

        const mesh0 = new THREE.Mesh( geometry, mat0 );
        mesh0.renderOrder = renderOrder;
        group.add( mesh0 );

        // front faces
        const mat1 = baseMat.clone();
        mat1.side = THREE.FrontSide;
        mat1.clippingPlanes = [ plane ];
        mat1.stencilFail = THREE.DecrementWrapStencilOp;
        mat1.stencilZFail = THREE.DecrementWrapStencilOp;
        mat1.stencilZPass = THREE.DecrementWrapStencilOp;

        const mesh1 = new THREE.Mesh( geometry, mat1 );
        mesh1.renderOrder = renderOrder;

        group.add( mesh1 );

        return group;

    }

    function init() {

        clock = new THREE.Clock();

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 36, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set( 0, 10, 0 );

        scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.position.set( 0, 10, 0 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.top	= 2;
        dirLight.shadow.camera.bottom = - 2;

        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        scene.add( dirLight );

        planes = [
            new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), 1 ),
            new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 1 ),
            new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 1 )
        ];

        planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 2, 0xffffff ) );
        planeHelpers.forEach( ph => {

            ph.visible = false;
            scene.add( ph );

        } );

        const geometry = new THREE.TorusKnotGeometry( 0.4, 0.15, 220, 60 );
        object = new THREE.Group();
        scene.add( object );

        // Set up clip plane rendering
        planeObjects = [];
        const planeGeom = new THREE.PlaneGeometry( 4, 4 );

        for ( let i = 0; i < 3; i ++ ) {

            const poGroup = new THREE.Group();
            const plane = planes[ i ];
            console.log('plane:::', plane)
            const stencilGroup = createPlaneStencilGroup( geometry, plane, i + 1 );

            // plane is clipped by the other clipping planes
            const planeMat =
                new THREE.MeshStandardMaterial( {

                    color: 0xE91E63,
                    metalness: 0.1,
                    roughness: 0.75,
                    clippingPlanes: planes.filter( p => p !== plane ),

                    stencilWrite: true,
                    stencilRef: 0,
                    stencilFunc: THREE.NotEqualStencilFunc,
                    stencilFail: THREE.ReplaceStencilOp,
                    stencilZFail: THREE.ReplaceStencilOp,
                    stencilZPass: THREE.ReplaceStencilOp,

                } );
            const po = new THREE.Mesh( planeGeom, planeMat );
            po.onAfterRender = function ( renderer ) {

                renderer.clearStencil();

            };

            po.renderOrder = i + 1.1;

            object.add( stencilGroup );
            poGroup.add( po );
            planeObjects.push( po );
            scene.add( poGroup );

        }

        const material = new THREE.MeshStandardMaterial( {

            color: 0xFFC107,
            metalness: 0.1,
            roughness: 0.75,
            clippingPlanes: planes,
            clipShadows: true,
            shadowSide: THREE.DoubleSide,

        } );

        // add the color
        const clippedColorFront = new THREE.Mesh( geometry, material );
        clippedColorFront.castShadow = true;
        clippedColorFront.renderOrder = 6;
        object.add( clippedColorFront );


        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry( 9, 9, 1, 1 ),
            new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.25, side: THREE.DoubleSide } )
        );

        ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
        ground.position.y = - 1;
        ground.receiveShadow = true;
        scene.add( ground );

        // Stats
        stats = new Stats();
        document.body.appendChild( stats.dom );

        // Renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( 0x263238 );
        window.addEventListener( 'resize', onWindowResize );
        document.body.appendChild( renderer.domElement );

        renderer.localClippingEnabled = true;

        // Controls
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 2;
        controls.maxDistance = 20;
        controls.update();

        // GUI
        const gui = new GUI();
        gui.add( params, 'animate' );

        const planeX = gui.addFolder( 'planeX' );
        planeX.add( params.planeX, 'displayHelper' ).onChange( v => planeHelpers[ 0 ].visible = v );
        planeX.add( params.planeX, 'constant' ).min( - 1 ).max( 1 ).onChange( d => planes[ 0 ].constant = d );
        planeX.add( params.planeX, 'negated' ).onChange( () => {

            planes[ 0 ].negate();
            params.planeX.constant = planes[ 0 ].constant;

        } );
        planeX.open();

        const planeY = gui.addFolder( 'planeY' );
        planeY.add( params.planeY, 'displayHelper' ).onChange( v => planeHelpers[ 1 ].visible = v );
        planeY.add( params.planeY, 'constant' ).min( - 1 ).max( 1 ).onChange( d => planes[ 1 ].constant = d );
        planeY.add( params.planeY, 'negated' ).onChange( () => {

            planes[ 1 ].negate();
            params.planeY.constant = planes[ 1 ].constant;

        } );
        planeY.open();

        const planeZ = gui.addFolder( 'planeZ' );
        planeZ.add( params.planeZ, 'displayHelper' ).onChange( v => planeHelpers[ 2 ].visible = v );
        planeZ.add( params.planeZ, 'constant' ).min( - 1 ).max( 1 ).onChange( d => planes[ 2 ].constant = d );
        planeZ.add( params.planeZ, 'negated' ).onChange( () => {

            planes[ 2 ].negate();
            params.planeZ.constant = planes[ 2 ].constant;

        } );
        planeZ.open();




        // 添加面板
        const clipMask = createPlane(new Vector3(0,0,0.2),10,10)
        scene.add(clipMask)
        planes[ 2 ].constant=0.2

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        const delta = clock.getDelta();

        requestAnimationFrame( animate );

        if ( params.animate ) {

            object.rotation.x += delta * 0.5;
            object.rotation.y += delta * 0.2;

        }

        for ( let i = 0; i < planeObjects.length; i ++ ) {

            const plane = planes[ i ];
            const po = planeObjects[ i ];
            plane.coplanarPoint( po.position );
            po.lookAt(
                po.position.x - plane.normal.x,
                po.position.y - plane.normal.y,
                po.position.z - plane.normal.z,
            );

        }

        stats.begin();
        renderer.render( scene, camera );
        stats.end();

    }
}

export const createPlane = ( position: Vector3, width: number, height: number ) =>{
    let geo = new PlaneGeometry(width, height)
    let material = new MeshBasicMaterial({
        color: 0x2375E1,
        side: DoubleSide,
        opacity: 0.1,
        transparent: true,
        depthTest: false     // fix: 某些角度下，后面的线框未显示
    })

    let plane = new Mesh(geo, material)
    if (position) {
        plane.position.copy(position)
    }
    return plane
}
