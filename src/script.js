import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg');
const doorAmbientOcculusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg');

const grassAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg');
const grassColorTexture = textureLoader.load('textures/grass/color.jpg');
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg');

grassColorTexture.repeat.set(8,8);
grassAmbientOcclusionTexture.repeat.set(8,8);
grassNormalTexture.repeat.set(8,8);
grassRoughnessTexture.repeat.set(8,8);

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


const bricksColorTexture = textureLoader.load('textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load('textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture = textureLoader.load('textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg');

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);
house.position.y = 1.25

// walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture
    })
)
walls.receiveShadow = true
house.add(walls)

walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

// roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({ color: 'white' })
)

roof.position.y = 1.25 + 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial(
        {
            side: THREE.DoubleSide,
            map: doorColorTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            aoMap: doorAmbientOcculusionTexture,
            displacementMap: doorHeightTexture, // need more verticies to add height
            wireframe: false,
            displacementScale: 0.1,
            normalMap: doorNormalTexture,
            roughness: doorRoughnessTexture,
            //metalness: doorMetalnessTexture,
        }
    )
)

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

house.add(door)
door.position.x = 0;
door.position.z = 2;

door.position.y = -0.5
//door.rotation.y = Math.PI * 0.5;

// bushes
const bushGeometry = new THREE.SphereGeometry(.7, 32, 32);
const bushMaterial = new THREE.MeshStandardMaterial({color: 'green'});
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);

scene.add(bush1, bush2, bush3)

bush1.position.set(-2, 0.3, 2.5);
bush1.scale.set(0.8, 0.8, 0.8);

bush2.position.set(-1.2, 0.3, 2.5);
bush2.scale.set(0.6, 0.6, 0.6)

bush3.position.set(-1.5, 0.2, 3);
bush3.scale.set(0.3, 0.3, 0.3);

//
// graves
const graves = new THREE.Group();
scene.add(graves);
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({color: 'grey'});

for(let i=1; i<50; i++){

    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6

    const angleX = Math.sin(angle) * radius
    const angleZ = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(angleX, 0.4, angleZ)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave);

}


// ghosts
const ghosts = new THREE.Group();
const ghost1 = new THREE.PointLight(0x0000ff, 2,3);
const ghost2 = new THREE.PointLight(0x00ff00, 2,3);
const ghost3 = new THREE.PointLight(0xff00ff, 2,3);

scene.add(ghost1, ghost2, ghost3)
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;


// Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
//scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        normalMap: grassNormalTexture,
        aoMap: grassAmbientOcclusionTexture,
        roughness: grassRoughnessTexture
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true;
scene.add(floor);

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
moonLight.castShadow = true;
scene.add(moonLight)

//door light
const pointLight = new THREE.PointLight('yellow', 1, 7);
pointLight.position.set(0,2,2.5);
scene.add(pointLight); 
pointLight.castShadow = true;

const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)

// fog
scene.fog = new THREE.Fog(0xb9d5ff, 2, 40)

// shadows
pointLight.shadow.mapSize.width = 256
pointLight.shadow.mapSize.height = 256
pointLight.shadow.camera.far= 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far= 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far= 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far= 7

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    console.log((Math.random() - 0.5) * 4)
    // update ghosts
    const elapsedTime = clock.getElapsedTime()
    const ghostAngle1 = elapsedTime * 0.32
    const ghostAngle2 = elapsedTime * 0.32
    const ghostAngle3 = elapsedTime * 0.4

    ghost1.position.z = Math.cos(ghostAngle1) * 5
    ghost1.position.x = Math.sin(ghostAngle1) * 5
    ghost1.position.y = Math.sin(ghostAngle1) * 0.9


    ghost2.position.z = -(Math.cos(ghostAngle2) *6)
    ghost2.position.x = -(Math.sin(ghostAngle2) *6)
    ghost2.position.y = Math.sin(elapsedTime * 4)+ Math.sin(elapsedTime * 2.5)


    ghost3.position.z = -(Math.cos(ghostAngle3) * (7 + Math.sin(ghostAngle3 * 0.32)))
    ghost3.position.x = -(Math.sin(ghostAngle3) * (7 + Math.sin(ghostAngle3 * 0.32)))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 3)



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()