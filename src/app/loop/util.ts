import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createPlane} from "../clipping/util";
import {Vector3} from "three";
import {DragControls} from "three/examples/jsm/controls/DragControls";

export const getTorus = (initArc?: number, color?: string) => {
    const radius = 2,
        tube = 0.05,
        radialSegments = 32,
        tubularSegments = 200,
        arc = initArc || Math.PI * 2;

    const torusGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    const torusMaterial = new THREE.MeshBasicMaterial({ color: color || 'yellow' });
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

export const getBall = ()  => {
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.z=2;
    return ball;
}
export const draw = ()=>{
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,0,10)
    camera.rotation.x=-Math.PI/6
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    //
    // const torus = getTorus();
    // scene.add(torus);
    //
    // const turus1 = getTorus();
    // turus1.rotation.x = Math.PI /2
    // scene.add(turus1)
    //
    //

    const plane = createPlane(new Vector3(0,0,0), 4,4);
    scene.add(plane)
    const ball = getBall()
    scene.add(ball)

    renderer.domElement.addEventListener('mousedown', function(event) {
        console.log('mousedown')
        // 获取鼠标点击位置的标准化设备坐标（NDC）
        var mouse = new THREE.Vector2();
        console.log('mouse',mouse)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log('mouse::', mouse)
        // 创建一个射线从相机发出经过鼠标点击位置
        // var raycaster = new THREE.Raycaster();
        // raycaster.setFromCamera(mouse, camera);
        //
        // // 检测射线与左边小球的相交情况
        // var intersects = raycaster.intersectObject(leftSphere);
        // if (intersects.length > 0) {
        //     isDragging = true;
        // }
    }, false);

    // const arrow = getArrow();
    // scene.add(arrow)

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

export const render1 = () => {
    // 创建场景
    var scene = new THREE.Scene();

// 创建相机
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // 设置相机位置

// 创建渲染器
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

// 创建几何体（小圆球）
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 设置材质颜色为红色

// 创建左边的小球
    var leftSphere = new THREE.Mesh(geometry, material);
    leftSphere.position.x = -2; // 设置左边小球的位置
    scene.add(leftSphere);

// 创建右边的小球
    var rightSphere = new THREE.Mesh(geometry, material);
    rightSphere.position.x = 2; // 设置右边小球的位置
    scene.add(rightSphere);

// 是否拖动左边小球的标志
    var isDragging = false;

// 监听鼠标按下事件
    renderer.domElement.addEventListener('mousedown', function(event) {
        // 获取鼠标点击位置的标准化设备坐标（NDC）
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 创建一个射线从相机发出经过鼠标点击位置
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // 检测射线与左边小球的相交情况
        var intersects = raycaster.intersectObject(leftSphere);
        if (intersects.length > 0) {
            isDragging = true;
        }
    }, false);

// 监听鼠标移动事件
    renderer.domElement.addEventListener('mousemove', function(event) {
        if (isDragging) {
            // 获取鼠标移动位置的标准化设备坐标（NDC）
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // 创建一个射线从相机发出经过鼠标移动位置
            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            // 计算射线与一个平面（右边小球所在平面）的交点
            var plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
            var intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectPoint);

            // 更新右边小球的位置
            rightSphere.position.copy(intersectPoint);
        }
    }, false);

// 监听鼠标

}

export const render2 = () => {
    // 创建场景
    const scene = new THREE.Scene();

// 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

// 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

// 添加窗口大小改变时的响应
    window.addEventListener('resize', function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

// 创建球体
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

// 创建 OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

// 渲染循环
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
    }

    animate();
}

export const render3 = () => {
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(renderer.domElement);
    const objects = []
    // const system = new THREE.Object3D();
    // scene.add(system);
    // objects.push(system);
    // const solarSystem = new THREE.Object3D();
    // scene.add(solarSystem);
    // objects.push(solarSystem);

    var plane = createPlane(new Vector3(0,0,5),5,5);
    scene.add(plane);

    const torus = getTorus();
    torus.rotation.y = Math.PI /2
    plane.add(torus);

    const torus1 = getTorus();
    torus1.rotation.x = Math.PI /2
    plane.add(torus1)

    const axesHelper = new THREE.AxesHelper( 5 );
    plane.add( axesHelper );


    const blueShortTorus = getTorus(Math.PI/2, 'blue')
    blueShortTorus.rotation.z=-Math.PI/4;
    blueShortTorus.rotation.y=-Math.PI/2;

    plane.add(blueShortTorus)


    const redShortTorus = getTorus(Math.PI/2, 'red')
    redShortTorus.rotation.x = (Math.PI /2)
    redShortTorus.rotation.z = (Math.PI/4)
    plane.add(redShortTorus)

    const arrow = getArrow();
    plane.add(arrow);

    const ball = getBall();
    plane.add(ball)

    camera.position.z = 20;
    camera.position.y=10;
    camera.rotation.x= -Math.PI/6


    var mouseDown = false;
    var currentPosition = 'x';

    const mouseValue = {x:{
        position: 'x', // 'x'|'y'|'z'
        value: 0,
        client: 'clientX',
        planeRotationPosition: 'y',
            change: (plane, value)=>{
                plane.rotation.y += value;
            }
    },y:{
            position: 'y', // 'x'|'y'|'z'
            value: 0,
            client: 'clientY',
            planeRotationPosition: 'x',
            change: (plane, value)=>{
                plane.rotation.x += value;
            }
        },z:{
            position: 'z', // 'x'|'y'|'z'
            value: 0,
            client: 'clientY',
            planeRotationPosition: 'z',
            change: (plane, value)=>{
                plane.position.z += value;
            }
        }}

    document.addEventListener('mousedown', function(event) {
        console.log('eventdown::',event)
        mouseDown = true;
        mouseValue[currentPosition].value = event[mouseValue[currentPosition].client];
    }, false);

    document.addEventListener('mouseup', function(event) {
        mouseDown = false;
    }, false);

    document.addEventListener('mousemove', function(event) {
        if (mouseDown) {
            console.log('mousemove::', event)
            var rotationSpeed = 0.01; // 鼠标拖动旋转速度
            var delta = event[mouseValue[currentPosition].client] - mouseValue[currentPosition].value;
            // plane.position[mouseValue[currentPosition].planeRotationPosition] += delta * rotationSpeed;
            // plane.rotation[mouseValue[currentPosition].planeRotationPosition] += delta * rotationSpeed;
            mouseValue[currentPosition].change(plane, delta * rotationSpeed)
            mouseValue[currentPosition].value = event[mouseValue[currentPosition].client];
        }
    }, false);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    const changeVisible = () => {
        torus.visible = false;
        torus1.visible = false;

    }


//     const controls = new DragControls( [blueShortTorus], camera, renderer.domElement );
//
// // add event listener to highlight dragged objects
//
//     controls.addEventListener( 'hoveron',  ( event )=> {
//         console.log('hover-on', torus)
//         torus.visible = true;
//         console.log('torus::', torus)
//     } );
//
//     controls.addEventListener( 'hoveroff', function ( event ) {
//         console.log('hover-off')
//         // event.object.material.emissive.set( 0x000000 );
//
//     } );

    animate();
    changeVisible();


}
