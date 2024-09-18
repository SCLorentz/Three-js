// Crie uma cena
var scene = new THREE.Scene();

const size = 8; // Tamanho do grid
const divisions = 8; // Divisões do grid
const colorCenterLine = new THREE.Color(0x0000ff); // Cor das linhas centrais do grid
const colorGrid = new THREE.Color(0x808080); // Cor das demais linhas do grid
const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
gridHelper.name = 'grid'
for(let x = 0; x<64; x+=8) {
    for(let z = 0; z<64; z+=8) {
        var clonedObject2 = gridHelper.clone();
        clonedObject2.position.set(gridHelper.position.x+x, 0, gridHelper.position.z+z)
        scene.add(clonedObject2);
    }
}

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load('https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a7/Cobblestone_%28texture%29_JE5_BE3.png');

//chunks
class Chunk {
    constructor() {
        this.blocks = [];
        this.mesh = new THREE.Group(); // Crie um grupo para a chunk
    }

    addBlock(type, x, y, z, facing, breakingTime) {
        const block = new Block(type, x, y, z, facing, breakingTime);
        this.blocks.push(block);
        this.mesh.add(block.mesh); // Adicione o bloco ao grupo da chunk
    }
}

class Block {
    constructor(type, x, y, z, facing, breakingTime) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;
        this.facing = facing;
        this.breakingTime = breakingTime;
        this.build();
    }

    build() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ map: this.type });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.x, this.y, this.z);
    }
}
// Criar uma nova chunk
const chunk = new Chunk();

// Adicionar blocos à chunk
const texture1 = textureLoader.load('https://th.bing.com/th/id/R.a1212201264c4554eaade725e7477f96?rik=kDgevlvSlWDXNQ&pid=ImgRaw&r=0');
chunk.addBlock(texture1, 0.5, 1, 0.5, null, null);
chunk.addBlock(texture1, 1.5, 1, 0.5, null, null);

// Adicionar a chunk à cena
scene.add(chunk.mesh);

// Adicione o grid helper à cena
scene.add(gridHelper);

// Crie uma câmera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;
camera.position.y = 1;

var spherical = new THREE.Spherical();
spherical.setFromVector3(camera.position);
var playerSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
playerSphere.name = "player";
scene.add(playerSphere);

// Crie um objeto pai para a câmera
var cameraParent = new THREE.Object3D();
playerSphere.add(cameraParent);

// Adicione a câmera como filho do objeto pai
cameraParent.add(camera);

function onMouseMove(event) {
    // Calcula a diferença de posição do mouse em relação ao último frame
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    // Define a sensibilidade da rotação
    const rotationSpeed = 0.002;
    // Aplica a rotação da câmera com base no movimento do mouse
    playerSphere.rotation.y -= movementX * rotationSpeed;
    camera.rotation.x -= movementY * rotationSpeed;
    // Limita a rotação vertical da câmera entre -PI/2 e PI/2 para evitar a inversão
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
}
window.addEventListener('mousemove', onMouseMove, false);

// Variáveis para controlar a movimentação e rotação da câmera
var movementSpeed = 0.15;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;

var rotationSpeed = 0.01;
var mouseSpeed = 0.002;

function updatePlayerSphere() {
    var direction = new THREE.Vector3();
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
        var left = new THREE.Vector3(-direction.z, 0, direction.x);
        playerSphere.position.add(left.multiplyScalar(movementSpeed));
    }
    if (moveLeft) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        var right = new THREE.Vector3(direction.z, 0, -direction.x);
        playerSphere.position.add(right.multiplyScalar(movementSpeed));
    }
    if(moveUp) {
        playerSphere.position.y += movementSpeed;
    }
    if(moveDown) {
        playerSphere.position.y -= movementSpeed;
    }
}

// Adicione os eventos de escuta para as teclas pressionadas
document.addEventListener('keydown', function (event) {
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



// Centralize o cursor do mouse inicialmente
centerMouse();

// Função para centralizar o cursor do mouse
function centerMouse() {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: centerX,
        clientY: centerY
    }));
}

// Crie um renderizador
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00Afff);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
var canvas = renderer.domElement;
document.body.appendChild(renderer.domElement);

// Evento para capturar o mouse
window.addEventListener('keydown', function () {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    canvas.requestPointerLock();
});

// Adicione uma luz direcional à cena
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(20, 50, 2);
scene.add(light);

const cellSize = 1; // Tamanho da célula do grid

const gridX = 2; // Posição X do grid (em células)
const gridY = 0; // Posição Y do grid (em células)
const gridZ = -3; // Posição Z do grid (em células)

// Calcule as coordenadas do bloco com base no grid
const blockX = gridX * cellSize - 0.5;
const blockY = gridY * cellSize;
const blockZ = gridZ * cellSize - 0.5;

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({ map: texture });
var cube = new THREE.Mesh(geometry, material);
cube.interactive = true;
cube.position.set(blockX, blockY, blockZ);
//scene.add(cube);

const geometry1 = new THREE.BoxGeometry(1.001, 1.001, 1.001);
const edges = new THREE.EdgesGeometry(geometry1);
const material1 = new THREE.LineBasicMaterial({ color: 0xffffff });
const line = new THREE.LineSegments(edges, material1);
line.position.set(blockX, blockY, blockZ);
scene.add(line);

for(let j = 0; j<50; j++) {
    for(let i = 1; i<120; i++) {
        var clonedObject = cube.clone();
        clonedObject.position.set(blockX+j - 5, 0, blockZ-i + 5)
        scene.add(clonedObject);
    }
}

// Renderize a cena
function animate() {
    requestAnimationFrame(animate);
    updatePlayerSphere();
    renderer.render(scene, camera);
}
animate();

var canvas2d = document.getElementById('canvas2d');
var context2d = canvas2d.getContext('2d');
// Exemplo: Desenhe uma crosshair no centro do canvas 2D
canvas2d.width = window.innerWidth;
canvas2d.height = window.innerHeight;
var centerX = canvas2d.width / 2;
var centerY = canvas2d.height / 2;

var image = new Image();
// Defina o caminho da imagem
image.src = 'img/grass_block_side.png';

// Aguarde o carregamento da imagem
image.onload = function () {
    // Desenhe a imagem no canvas
    context2d.drawImage(image, 0, 0);
};

context2d.beginPath();
context2d.moveTo(centerX - 10, centerY);
context2d.lineTo(centerX + 10, centerY);
context2d.moveTo(centerX, centerY - 10);
context2d.lineTo(centerX, centerY + 10);
context2d.strokeStyle = 'white';
context2d.lineWidth = 2;
context2d.stroke();

let breakBlock = new Audio("sound/break.mp3");
let reach_distance = 7;
document.addEventListener('click', (event) => {
    if(event.button == 0){
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        canvas.requestPointerLock();
        // Definir o raio de projeção a partir da posição da câmera
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

        // Verificar objetos intersectados pelo raio, ignorando os objetos especificados
        var intersects = raycaster.intersectObjects(scene.children, true).filter(function (intersection) {
            return intersection.object.name !== 'player' && intersection.object.name !== 'grid';;
        });
        // Verificar se houve interseção com algum objeto
        if (intersects.length > 0) {
            // Objeto 3D clicado
            var clickedObject = intersects[0].object;
            // Faça algo com o objeto clicado
            if (clickedObject.name !== "chão" && playerSphere.position.distanceTo(clickedObject.position)<reach_distance) {
                scene.remove(clickedObject);
                breakBlock.play();
            }
        }
    } else if(event.button == 2) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        canvas.requestPointerLock();
        // Definir o raio de projeção a partir da posição da câmera
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        // Verificar objetos intersectados pelo raio, ignorando os objetos especificados
        var intersects = raycaster.intersectObjects(scene.children, true).filter(function (intersection) {
            return intersection.object.name !== 'player' && intersection.object.name !== 'grid';;
        });
        // Verificar se houve interseção com algum objeto
        if (intersects.length > 0) {
            var faceIndex = intersects[0].faceIndex;
            // Objeto 3D clicado
            var clickedObject = intersects[0].object;
            if (clickedObject.name !== "chão" && playerSphere.position.distanceTo(clickedObject.position)<reach_distance) {
                var clonedObject1 = clickedObject.clone();
                switch (faceIndex) {
                    case 0:
                    case 1:
                        clonedObject1.position.set(clickedObject.position.x+1, clickedObject.position.y, clickedObject.position.z)
                        break;
                    case 2:
                    case 3:
                        clonedObject1.position.set(clickedObject.position.x-1, clickedObject.position.y, clickedObject.position.z)
                        break;
                    case 4:
                    case 5:
                        clonedObject1.position.set(clickedObject.position.x, clickedObject.position.y+1, clickedObject.position.z)
                        break;
                    case 6:
                    case 7:
                        clonedObject1.position.set(clickedObject.position.x, clickedObject.position.y-1, clickedObject.position.z)
                        break;
                    case 8:
                    case 9:
                        clonedObject1.position.set(clickedObject.position.x, clickedObject.position.y, clickedObject.position.z+1)
                        break;
                    case 10:
                    case 11:
                        clonedObject1.position.set(clickedObject.position.x, clickedObject.position.y, clickedObject.position.z-1)
                        break;
                }
                scene.add(clonedObject1);
            }
        }
    }
}, false);