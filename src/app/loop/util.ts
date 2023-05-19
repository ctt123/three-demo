import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const getTorus = () => {
    const radius = 2,
        tube = 0.05,
        radialSegments = 32,
        tubularSegments = 200,
        arc = Math.PI * 2;

    const torusGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    return torus;
}

export const getArrow = () => {
    const dir = new THREE.Vector3( 0, 0, 2 );

//normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const origin = new THREE.Vector3( 0, 0 , 0 );
    const length = 2;
    const hex = 0xffff00;

    const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex,0.5,0.3 );
    return arrowHelper;
}
export const draw = ()=>{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,3,10)
    camera.rotation.y=-Math.PI/6
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );



    const torus = getTorus();
    torus.rotation.y = Math.PI /2
    scene.add(torus);

    const torus1 = getTorus();
    torus1.rotation.x = Math.PI /2
    scene.add(torus1)

    const arrow = getArrow();
    scene.add(arrow)

    // const dragControls = new DragControls( [arrow ], camera, renderer.domElement );
    // dragControls.addEventListener( 'drag', render );


    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 2;
    // controls.maxDistance = 20;
    controls.update();



    function animate() {
        requestAnimationFrame( animate );

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        renderer.render( scene, camera );
    }

    animate();
}

