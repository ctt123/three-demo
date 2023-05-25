import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createPlane} from "../clipping/util";
import {LineCurve3, Object3D, Vector3} from "three";
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
    const hex = 'white';

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

export const getArrowGeometry = () => {
    const geometry = new THREE.CylinderGeometry(
        0, 0.2, 0.5, 50 );
    const geometry1 = new THREE.CylinderGeometry(
        0.1, 0.1, 1, 50 );

    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
    const arrow = new THREE.Mesh(geometry1, cylinderMaterial);
    const head = new THREE.Mesh(geometry, cylinderMaterial);
// 将箭头添加到场景中
//     const arrow = new THREE.Group();
    head.position.y=0.75;
    // arrow.add(body);
    // arrow.add(head);
    arrow.add(head)

    return {arrow, head};

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
    torus1.rotation.x = Math.PI /2;
    torus1.onPointerOver=()=>{
        if(torus1.visible) {
            torus1.visible = true;
        }
    }
    torus.onPointerOver=()=>{
        if(torus.visible) {
            torus.visible = true;
        }
    }

    plane.add(torus1)

    const axesHelper = new THREE.AxesHelper( 5 );
    plane.add( axesHelper );


    const blueShortTorus = getTorus(Math.PI/2, 'blue')
    blueShortTorus.rotation.z=-Math.PI/4;
    blueShortTorus.rotation.y=-Math.PI/2;

    plane.add(blueShortTorus)
    blueShortTorus.onPointerOver = () => {
        console.log('----------------------------------------')
        if(blueShortTorus.visible){
            torus.visible = true
            torus1.visible = false
            currentMouseValue = mouseValue.y;
            blueShortTorus.visible=false;
            redShortTorus.visible=false;
            arrow.visible=false;
            drawPreviousLine();
        }
    }
    blueShortTorus.onPointerOut = () => {
        // if(!mouseDown){
        //     torus1.visible = false;
        //     torus.visible = false;
        //     blueShortTorus.visible=true;
        //     redShortTorus.visible=true;
        // }
    }

    const redShortTorus = getTorus(Math.PI/2, 'red')
    redShortTorus.rotation.x = (Math.PI /2)
    redShortTorus.rotation.z = (Math.PI/4)
    plane.add(redShortTorus)
    redShortTorus.onPointerOver = () => {
        if(redShortTorus.visible) {
            torus1.visible = true
            torus.visible = false
            currentMouseValue = mouseValue.x;
            blueShortTorus.visible=false;
            redShortTorus.visible=false;
            arrow.visible=false;
            drawPreviousLine();
        }
    }
    redShortTorus.onPointerOut = () => {
    }

    // const arrow = getArrow();
    // plane.add(arrow);


    const ball = getBall();
    plane.add(ball)

    const { arrow, body: arrowBody, head: arrowHead} = getArrowGeometry();
    arrow.rotateX(Math.PI/2)
    arrow.position.z=0.5
    plane.add(arrow)
    arrow.onPointerOver = () => {
        console.log('111111111111111', arrowHead)
        if(arrow.visible) {
            torus1.visible = false;
            torus.visible = false
            currentMouseValue = mouseValue.z;
            blueShortTorus.visible=false;
            redShortTorus.visible=false;
            // arrowBody.setColor('yellow'); // 这句无效
            // arrowHead.setColor('yellow'); // 这句无效
            // drawPreviousLine();
        }
    }


    camera.position.z = 20;
    camera.position.y=10;
    camera.rotation.x= -Math.PI/6


    var mouseDown = false;

    const mouseValue = {x:{
        position: 'x', // 'x'|'y'|'z'
        value: 0,
        client: 'clientX',
        planeRotationPosition: 'y',
            change: (plane, value)=>{
                // plane.rotation.y += value;
                plane.rotateY(value)
            }
    },y:{
            position: 'y', // 'x'|'y'|'z'
            value: 0,
            client: 'clientY',
            planeRotationPosition: 'x',
            change: (plane, value)=>{
                // plane.rotation.x += value;
                plane.rotateX(value)
            }
        },z:{
            position: 'z', // 'x'|'y'|'z'
            value: 0,
            client: 'clientY',
            planeRotationPosition: 'z',
            change: (plane, value)=> {
                plane.translateOnAxis(new Vector3(0,0,1),value);
            }
        }}
    var currentMouseValue: null | {
        position: 'x' | 'y' | 'z';
        value: number;
        client: 'clientY' | 'clientX';
        planeRotationPosition: 'x' | 'y' | 'z';
        change: (plane, value) => void;
    } = mouseValue.x;

    const resetTool = () => {
            if(torus1.visible || torus.visible || arrow.visible){
                torus1.visible = false;
                torus.visible = false;
                blueShortTorus.visible=true;
                redShortTorus.visible=true;
                arrow.visible=true;
                // arrowHead.setColor('white');
                // arrowBody.setColor('white');
                currentMouseValue = null;
                if(splineObject){
                    splineObject.removeFromParent(scene);
                    splineObject=null;
                }


            }

    }
    document.addEventListener('mousedown', function(event) {
        mouseDown = true;
        if(currentMouseValue){
            currentMouseValue.value = event[currentMouseValue.client];
        }
    }, false);

    document.addEventListener('mouseup', function(event) {
        mouseDown = false;
        resetTool();
    }, false);

    document.addEventListener('mousemove', function(event) {
        if (mouseDown && currentMouseValue) {
            var rotationSpeed = 0.01; // 鼠标拖动旋转速度
            var delta = event[currentMouseValue.client] - currentMouseValue.value;
            // plane.position[mouseValue[currentPosition].planeRotationPosition] += delta * rotationSpeed;
            // plane.rotation[mouseValue[currentPosition].planeRotationPosition] += delta * rotationSpeed;
            currentMouseValue.change(plane, delta * rotationSpeed)
            currentMouseValue.value = event[currentMouseValue.client];
        }
    }, false);
    const pointer = new THREE.Vector2();
    const animate= () =>{

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    const hovered = {}
    function onPointerMove( event ) {
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera( pointer, camera );
// 计算物体和射线的焦点
        const intersects = raycaster.intersectObjects( scene.children );
        // for ( let i = 0; i < intersects.length; i ++ ) {

        Object.keys(hovered).forEach((key) => {
            const hit = intersects.find((hit) => hit.object.uuid === key)
            if (hit === undefined) {
                const hoveredItem = hovered[key]
                if (hoveredItem.object.onPointerOver) {
                    hoveredItem.object?.onPointerOut&&hoveredItem.object?.onPointerOut(hoveredItem)}
                delete hovered[key]
            }
        })

        intersects.forEach((hit) => {
            // If a hit has not been flagged as hovered we must call onPointerOver
            if (!hovered[hit.object.uuid]) {
                hovered[hit.object.uuid] = hit
                if (hit.object.onPointerOver) hit.object.onPointerOver(hit)
            }
            // Call onPointerMove
            if (hit.object.onPointerMove) hit.object.onPointerMove(hit)
        })

        // }
    }
    window.addEventListener( 'pointermove', onPointerMove );

    const changeVisible = () => {
        torus.visible = false;
        torus1.visible = false;

    }
    var ballPosition = new THREE.Vector3();
    var planePosition = new THREE.Vector3();
    let splineObject;
    const drawPreviousLine = () => {
        ball.getWorldPosition(ballPosition);
        plane.getWorldPosition(planePosition);


        const curve = new LineCurve3( planePosition, ballPosition)

        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const material = new THREE.LineBasicMaterial( { color: 'grey' } );

// Create the final object to add to the scene
        splineObject = new THREE.Line( geometry, material );


        // 直线
        scene.add(splineObject);
    }



    const raycaster = new THREE.Raycaster();

    animate();
    changeVisible();

}
