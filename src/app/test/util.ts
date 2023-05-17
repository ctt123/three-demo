import * as THREE from 'three'
// import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
export const draw = () =>{
    var scene, camera, renderer;
    var cube, clippingPlane;
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    var intersection = new THREE.Vector3();
    var plane = new THREE.Plane();
    var dragPlane = new THREE.Plane();
    var dragging = false;
    var dragOffset = new THREE.Vector3();
    var axis = new THREE.Vector3();
    var initialIntersection = new THREE.Vector3();
    var controls;

    init();
    animate();

    function init() {
        // 创建场景、相机和渲染器
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(3, 3, 3);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 创建一个立方体
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 创建剖切面板
        var planeGeometry = new THREE.PlaneGeometry(1.5, 1.5);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        clippingPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(clippingPlane);

        // 设置剖切面板的初始位置和旋转
        clippingPlane.position.set(0, 0, 0);
        clippingPlane.rotation.x = Math.PI / 2;

        // 初始化剖切平面和拖动平面
        updatePlanes();

        // 添加交互控制
        controls = new OrbitControls(camera, renderer.domElement);

        // 添加事件监听器
        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mousemove', onMouseMove, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function updatePlanes() {
        plane.normal.copy(clippingPlane.getWorldDirection(plane.normal));
        plane.constant = -clippingPlane.position.dot(plane.normal);
        dragPlane.normal.copy(plane.normal);
        dragPlane.constant = -clippingPlane.position.dot(dragPlane.normal);
    }

    function onMouseDown(event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects([clippingPlane]);

        if (intersects.length > 0) {
            dragging = true;
            intersection.copy(intersects[0].point);

            plane.intersectLine(raycaster.ray, initialIntersection);
            dragOffset.subVectors(initialIntersection, clippingPlane.position);
        }
    }

    function onMouseMove(event) {
        event.preventDefault();

        if (dragging) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            plane.intersectLine(raycaster.ray, intersection);
            clippingPlane.position.copy(intersection.sub(dragOffset));

            updatePlanes();
        }
    }

    function onMouseUp(event) {
        event.preventDefault();

        dragging = false;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        // 根据剖切平面更新剖切区域
        var axis = new THREE.Vector3();
        clippingPlane.getWorldDirection(axis);
        var size = Math.abs(clippingPlane.position.clone().dot(axis) * 2);
        cube.material.clipIntersection = true;
        cube.material.clipShadows = true;
        cube.material.clippingPlanes = [plane];
        cube.material.needsUpdate = true;
        cube.geometry.computeBoundingBox();
        var box = cube.geometry.boundingBox.clone();
        box.applyMatrix4(cube.matrixWorld);
        var center = box.getCenter(new THREE.Vector3());
        var helperGeometry = new THREE.BoxGeometry(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).y, box.getSize(new THREE.Vector3()).z);
        var helperMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
        var helper = new THREE.Mesh(helperGeometry, helperMaterial);
        helper.position.copy(center);
        helper.rotation.copy(cube.rotation);
        scene.remove(scene.getObjectByName('helper'));
        scene.add(helper);

        renderer.render(scene, camera);
    }
}
export const draw1 = () =>{
    // 创建场景
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 添加正方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        clippingPlanes: [],
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 添加光源
    const light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(10, 10, 10);
    scene.add(light);

    // 添加相机控制器
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();

    // 创建剖切面
    const clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    material.clippingPlanes = [clipPlane];

    // 创建剖切面辅助对象
    const planeHelper = new THREE.PlaneHelper(clipPlane, 1, 0xffff00);
    scene.add(planeHelper);

    // 添加变换控制器
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('change', render);
    transformControls.attach(planeHelper);
    scene.add(transformControls);

    // 设置相机位置
    camera.position.z = 5;

    // 渲染函数
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    function render() {
        renderer.render(scene, camera);
    }

    // 开始渲染
    animate();
}

export const draw2 = () => {
    // 创建场景
    const scene = new THREE.Scene();

// 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

// 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

// 创建正方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

// 创建剖切面
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -1;
    scene.add(plane);

// 创建剖切面辅助对象
    const helper = new THREE.PlaneHelper(plane, 10, 0xff0000);
    scene.add(helper);

// 创建光源
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

// 监听鼠标事件
    let dragging = false;
    let dragStart = new THREE.Vector2();
    let dragEnd = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const planeNormal = new THREE.Vector3(0, 0, 1);
    const intersection = new THREE.Vector3();
    document.addEventListener('mousedown', e => {
        dragging = true;
        dragStart.set(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', e => {
        if (dragging) {
            dragEnd.set(e.clientX, e.clientY);
            const delta = dragEnd.clone().sub(dragStart);
            const movement = new THREE.Vector3(delta.x, -delta.y, 0);
            raycaster.setFromCamera(dragEnd, camera);
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                helper.position.copy(intersection);
                plane.position.copy(intersection);
                const projection = intersection.clone().projectOnPlane(planeNormal);
                const offset = projection.sub(planeNormal);
                cube.position.sub(offset);
            }
            dragStart.copy(dragEnd);
        }
    });
    document.addEventListener('mouseup', e => {
        dragging = false;
    });

// 渲染场景
    function animate() {
        // requestAnimationFrame(animate);
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}
