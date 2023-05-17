import * as Three from 'three'
export const draw = () => {
    const renderer = new Three.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement)

    const camera = new Three.PerspectiveCamera(45,window.innerHeight/window.innerWidth,1,500);
    camera.position.set(0,0,100);
    camera.lookAt(0,0,0);

    const scene = new Three.Scene();

    const material = new Three.LineBasicMaterial({
        color: 0x0000ff
    })

    const points = [];
    points.push( new Three.Vector3(-10,0,0));
    points.push( new Three.Vector3(0,10,0));
    points.push( new Three.Vector3(10,0,0));

    const geometry = new Three.BufferGeometry().setFromPoints(points)

    const line = new Three.Line(geometry, material);

    scene.add(line);
    renderer.render(scene,camera)
}
