import * as THREE from 'three'

export const draw = () =>{
    // 创建场景、相机和渲染器
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 创建一个圆点几何体
    var geometry = new THREE.CircleGeometry(1, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var circle = new THREE.Mesh(geometry, material);
    circle.position.set(0, 0, 0);
    scene.add(circle);

    // 创建一个辅助线，表示Y轴
    var axisHelper = new THREE.AxesHelper(5);
    scene.add(axisHelper);

    // 监听鼠标拖动事件
    var mouseDown = false;
    var mouseX = 0;
    var previousMouseX = 0;
    window.addEventListener("mousedown", function (event) {
        mouseDown = true;
        mouseX = event.clientX;
        previousMouseX = mouseX;
    });
    window.addEventListener("mouseup", function () {
        mouseDown = false;
    });
    window.addEventListener("mousemove", function (event) {
        if (mouseDown) {
            mouseX = event.clientX;
            var rotationDelta = (mouseX - previousMouseX) * 0.01;
            circle.rotation.y += rotationDelta;
            previousMouseX = mouseX;
        }
    });

    // 设置相机位置
    camera.position.z = 2;
    // camera.position.y=1;
    // camera.rotation.x=Math.PI/4

    // 渲染循环
    function animate() {
        requestAnimationFrame(animate);
        updateCircleDistance();
        renderer.render(scene, camera);
    }
    animate();

    // 更新圆点与Y轴的距离
    function updateCircleDistance() {
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(circle.matrixWorld);
        var distanceToYAxis = Math.sqrt(
            Math.pow(position.x, 2) + Math.pow(position.z, 2)
        );
        var scaleFactor = 2 / distanceToYAxis;
        circle.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
}
