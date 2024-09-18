const isChunkCreated = false,
     scene = new THREE.Scene(),
     size = 8,
     divisions = 8,
     colorCenterLine = new THREE.Color(0x0000ff),
     colorGrid = new THREE.Color(0x808080),
     gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
// there should be a better way to do this
gridHelper.name = 'grid'
for (let x = 0; x < 64; x += 8) {
    for (let z = 0; z < 64; z += 8) {
        const clonedObject2 = gridHelper.clone();
        clonedObject2.position.set(gridHelper.position.x + x, 0, gridHelper.position.z + z)
        scene.add(clonedObject2);
    }
}

const material = new THREE.MeshPhongMaterial(),
     textureLoader = new THREE.TextureLoader(),
     texture = textureLoader.load('https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a7/Cobblestone_%28texture%29_JE5_BE3.png'),
     CHUNK_SIZE = 16,
     TEXTURE_COLUMNS = 16,
     TEXTURE_ROWS = 16;

class Chunk {
    constructor() {
        this.blocks = new Array(CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE).fill(0);
        this.chunkSize = CHUNK_SIZE;
        this.mesh = null;
    }
    setBlock(x, y, z, type) {
        this.blocks[x + y * this.chunkSize + z * this.chunkSize * this.chunkSize] = type;
    }
    generateMesh() {
        const geometry = new THREE.BufferGeometry(),
             material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.FrontSide }),
             //
             vertices = [],
             uv = [],
             indices = [];

        // Preencha as coordenadas dos vértices, coordenadas UV e índices conforme necessário
        // Exemplo de preenchimento de vértices, coordenadas UV e índices para um cubo:
        for (let i = 0; i < 8; i++) {
            const x = i & 1 ? 1 : -1,
                 y = i & 2 ? 1 : -1,
                 z = i & 4 ? 1 : -1;

            vertices.push(x, y, z);
            uv.push(0, 0); // Substitua por coordenadas UV reais
        }

        // Defina os atributos do BufferGeometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));

        // Defina os índices para renderização
        // Exemplo de definição de índices para renderizar um cubo:
        // wtf is this?
        const cubeIndices = [
            0, 1, 2, 2, 3, 0, // Face frontal
            4, 5, 6, 6, 7, 4, // Face traseira
            0, 1, 5, 5, 4, 0, // Lado esquerdo
            2, 3, 7, 7, 6, 2, // Lado direito
            0, 3, 7, 7, 4, 0, // Topo
            1, 2, 6, 6, 5, 1  // Fundo
        ];

        geometry.setIndex(cubeIndices);

        const types = [],
            indicesArray = new Uint32Array(indices),
            typesArray = new Uint8Array(types);

        geometry.setIndex(new THREE.BufferAttribute(indicesArray, 1));
        geometry.setAttribute('type', new THREE.BufferAttribute(typesArray, 1));

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        isChunkCreated = true;
        //
        return this.mesh;
    }
}

const chunk = new Chunk();
chunk.setBlock(2, 1, 2, 1); // O último argumento 1 representa o tipo do bloco
chunk.generateMesh();

scene.add(gridHelper);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;
camera.position.y = 1;

const spherical = new THREE.Spherical();
spherical.setFromVector3(camera.position);
const playerSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
playerSphere.name = "player";
scene.add(playerSphere);

const cameraParent = new THREE.Object3D();
playerSphere.add(cameraParent);

cameraParent.add(camera);

function onMouseMove(event) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0,
         movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0,
         rotationSpeed = 0.002;
    //
    playerSphere.rotation.y -= movementX * rotationSpeed;
    camera.rotation.x -= movementY * rotationSpeed;
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
}
window.addEventListener('mousemove', onMouseMove, false);

const movementSpeed = 0.15,
    moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false,
    moveUp = false,
    moveDown = false,
    rotationSpeed = 0.01,
    mouseSpeed = 0.002;

function updatePlayerSphere() {
    const direction = new THREE.Vector3();
    // fuck this code
    if (moveForward) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        playerSphere.position.add(direction.multiplyScalar(movementSpeed));
    }
    if (moveBackward) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        playerSphere.position.add(direction.multiplyScalar(-movementSpeed));
    }
    if (moveRight) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        const left = new THREE.Vector3(-direction.z, 0, direction.x);
        playerSphere.position.add(left.multiplyScalar(movementSpeed));
    }
    if (moveLeft) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        const right = new THREE.Vector3(direction.z, 0, -direction.x);
        playerSphere.position.add(right.multiplyScalar(movementSpeed));
    }
    if (moveUp) {
        playerSphere.position.y += movementSpeed;
    }
    if (moveDown) {
        playerSphere.position.y -= movementSpeed;
    }
}

document.addEventListener('keydown', function (event) {
    // nope, forget it
    switch (event.keyCode) {
        case 87: // Tecla W
        moveForward = true;
        break;
        case 83: // Tecla S
        moveBackward = true;
        break;
        case 65: // Tecla A
        moveLeft = true;
        break;
        case 68: // Tecla D
        moveRight = true;
        break;
        case 32:
        moveUp = true;
        break;
        case 16:
        moveDown = true;
        break;
    }
});
document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 87: // Tecla W
        moveForward = false;
        break;
        case 83: // Tecla S
        moveBackward = false;
        break;
        case 65: // Tecla A
        moveLeft = false;
        break;
        case 68: // Tecla D
        moveRight = false;
        break;
        case 32:
        moveUp = false;
        break;
        case 16:
        moveDown = false;
        break;
    }
});

const COLLISION_DISTANCE = 0.025;
const SAMPLE_SIZE = 50;

centerMouse();

function centerMouse() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    //
    window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: centerX,
        clientY: centerY
    }));
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00Afff);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.localClippingEnabled = true;
const canvas = renderer.domElement;
document.body.appendChild(renderer.domElement);

window.addEventListener('keydown', function () {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    canvas.requestPointerLock();
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(20, 50, 2);
scene.add(light);

const geometry1 = new THREE.BoxGeometry(1.001, 1.001, 1.001);
const edges = new THREE.EdgesGeometry(geometry1);
const material1 = new THREE.LineBasicMaterial({ color: 0xffffff });
const line = new THREE.LineSegments(edges, material1);
line.position.set(1, 1, 1);
scene.add(line);

function animate() {
    requestAnimationFrame(animate);
    updatePlayerSphere();
    renderer.render(scene, camera);
}
animate();

const canvas2d = document.getElementById('canvas2d');
const context2d = canvas2d.getContext('2d');
canvas2d.width = window.innerWidth;
canvas2d.height = window.innerHeight;
const centerX = canvas2d.width / 2;
const centerY = canvas2d.height / 2;

context2d.beginPath();
context2d.moveTo(centerX - 10, centerY);
context2d.lineTo(centerX + 10, centerY);
context2d.moveTo(centerX, centerY - 10);
context2d.lineTo(centerX, centerY + 10);
context2d.strokeStyle = 'white';
context2d.lineWidth = 2;
context2d.stroke();

// It would be better to create something from scratch, realy