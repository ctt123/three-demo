import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const getTorus = () => {
    var radius = 2,
        tube = 0.05,
        radialSegments = 32,
        tubularSegments = 200,
        arc = Math.PI * 2;

    var torusGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    var torusMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var torus = new THREE.Mesh(torusGeometry, torusMaterial);
    return torus;
}
export const draw = ()=>{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );



    const torus = getTorus();
    scene.add(torus);

    const turus1 = getTorus();
    turus1.rotation.x = Math.PI /2
    scene.add(turus1)


    camera.position.z = 10;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.update();

//     const controls = new OrbitControls( camera, renderer.domElement );
//
// //controls.update() must be called after any manual changes to the camera's transform
//     camera.position.set( 0, 20, 100 );
//     controls.update();


    function animate() {
        requestAnimationFrame( animate );

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

    animate();
}

