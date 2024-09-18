// Crie uma cena
const scene = new THREE.Scene(),
    // other important values for the scene
    size = 8,                                                                        // Tamanho do grid
    divisions = 8,                                                                   // Divisões do grid
    colorCenterLine = new THREE.Color(0x0000ff),                                     // Cor das linhas centrais do grid
    colorGrid = new THREE.Color(0x808080),                                           // Cor das demais linhas do grid
    gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);

gridHelper.name = 'grid'

// Adicione o grid helper à cena
scene.add(gridHelper);

// Crie uma câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;
camera.position.y = 1;

const spherical = new THREE.Spherical();
spherical.setFromVector3(camera.position);
var playerSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
playerSphere.name = "player";
scene.add(playerSphere);

// Crie um objeto pai para a câmera
const cameraParent = new THREE.Object3D();
playerSphere.add(cameraParent);

// Adicione a câmera como filho do objeto pai
cameraParent.add(camera);

function onMouseMove(event) {
    // Calcula a diferença de posição do mouse em relação ao último frame
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0,
        movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0,
    // Define a sensibilidade da rotação
    rotationSpeed = 0.002;
    // Aplica a rotação da câmera com base no movimento do mouse
    playerSphere.rotation.y -= movementX * rotationSpeed;
    camera.rotation.x -= movementY * rotationSpeed;
    // Limita a rotação vertical da câmera entre -PI/2 e PI/2 para evitar a inversão
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
}
window.addEventListener('mousemove', onMouseMove, false);

// Variáveis para controlar a movimentação e rotação da câmera
const moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false,
    moveUp = false,
    moveDown = false,
    // speed
    rotationSpeed = 0.01,
    mouseSpeed = 0.002,
    movementSpeed = 0.1;

function updatePlayerSphere() {
    const direction = new THREE.Vector3();
    // camera.getWorldDirection(direction)

    const movment = {
        // front
        87: () => {
            // notice that this line is beeing repeted over and over again
            camera.getWorldDirection(direction);
            direction.y = 0;
            //
            playerSphere.position.add(direction.multiplyScalar(movementSpeed));
        },
        // back
        83: () => {
            camera.getWorldDirection(direction);
            direction.y = 0;
            //
            playerSphere.position.add(direction.multiplyScalar(-movementSpeed));
        },
        // right
        68: () => {
            camera.getWorldDirection(direction);
            const left = new THREE.Vector3(-direction.z, 0, direction.x);
            //
            playerSphere.position.add(left.multiplyScalar(movementSpeed));
        },
        // left
        65: () => {
            camera.getWorldDirection(direction);
            const right = new THREE.Vector3(direction.z, 0, -direction.x);
            //
            playerSphere.position.add(right.multiplyScalar(movementSpeed));
        },
        // up
        32: () => playerSphere.position.y += 0.1,
        // down
        16: () => playerSphere.position.y -= 0.1
    }
    
    /*if (moveForward) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        playerSphere.position.add(direction.multiplyScalar(movementSpeed));
    }
    if (moveBackward) {
        camera.getWorldDirection(direction);
        direction.y = 0;
        playerSphere.position.add(direction.multiplyScalar(-movementSpeed));
    }
    if (moveRight) {
        camera.getWorldDirection(direction);
        var left = new THREE.Vector3(-direction.z, 0, direction.x);
        playerSphere.position.add(left.multiplyScalar(movementSpeed));
    }
    if (moveLeft) {
        camera.getWorldDirection(direction);
        var right = new THREE.Vector3(direction.z, 0, -direction.x);
        playerSphere.position.add(right.multiplyScalar(movementSpeed));
    }
    if(moveUp) {
        playerSphere.position.y += 0.1;
    }
    if(moveDown) {
        playerSphere.position.y -= 0.1;
    }*/
}

// Adicione os eventos de escuta para as teclas pressionadas
document.addEventListener('keydown', function (event) {
    // o codigo antigo ainda tem uma vantagem que eu posso prever, não posso testar agora pois estou em aula e no editor default do github
    // mas é possivel de prever que o personagem só será capaz de se mover para uma direção de cada vez.
    // Ou seja, tentar se mover para a direita e frente ao mesmo tempo não fará o player andar na diagonal, mas sim somente para frente
    moviment[event.keycode]()?
/*switch (event.keyCode) {
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
}*/
});
/*document.addEventListener('keyup', function (event) {
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
});*/
// Centralize o cursor do mouse inicialmente
centerMouse();

// Função para centralizar o cursor do mouse
function centerMouse() {
    const centerX = window.innerWidth / 2,
         centerY = window.innerHeight / 2;
    //
    window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: centerX,
        clientY: centerY
    }));
}

// Crie um renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00Afff);
//
const canvas = renderer.domElement;
document.body.appendChild(renderer.domElement);

// Evento para capturar o mouse
window.addEventListener('keydown', function () {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    canvas.requestPointerLock();
});

// Adicione uma luz direcional à cena
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 5, 2);
scene.add(light);

// mais valores, observe que são variaveis globais. Tente criar uma função para isso.
const textureLoader = new THREE.TextureLoader(),
    texture = textureLoader.load('https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/a7/Cobblestone_%28texture%29_JE5_BE3.png'),

    cellSize = 1,        // Tamanho da célula do grid

    gridX = 2,           // Posição X do grid (em células)
    gridY = 0,           // Posição Y do grid (em células)
    gridZ = -3;          // Posição Z do grid (em células)

// Calcule as coordenadas do bloco com base no grid
const blockX = gridX * cellSize - 0.5;
const blockY = gridY * cellSize;
const blockZ = gridZ * cellSize - 0.5;

const geometry = new THREE.BoxGeometry(1, 1, 1),
    material = new THREE.MeshPhongMaterial({ map: texture }),
    cube = new THREE.Mesh(geometry, material);
//
cube.interactive = true;
cube.position.set(blockX, blockY, blockZ);
scene.add(cube);

// ok, tenho 99% de certeza que tem uma forma melhor de fazer isso, seja lá o que for
for(let j = 0; j<5; j++) {
    for(let i = 1; i<12; i++) {
        var clonedObject = cube.clone();
        clonedObject.position.set(blockX+j - 5, 0, blockZ-i + 5)
        scene.add(clonedObject);
    }
}

const geometry2 = new THREE.BoxGeometry(20, 1, 20),
    material2 = new THREE.MeshPhongMaterial({ color: 0xff0f00 }),
    cube2 = new THREE.Mesh(geometry2, material2);
//
cube2.position.set(0, -1, 0);
cube2.name = "chão";
scene.add(cube2);

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
function onMouseClick(event) {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    canvas.requestPointerLock();
    // Definir o raio de projeção a partir da posição da câmera
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // Verificar objetos intersectados pelo raio, ignorando os objetos especificados
    const intersects = raycaster.intersectObjects(scene.children, true).filter(function (intersection) {
        return intersection.object.name != 'player' && intersection.object.name != 'grid';
    });

    // Verificar se houve interseção com algum objeto
    if (intersects.length > 0) {
        // Objeto 3D clicado
        const clickedObject = intersects[0].object;
        // Faça algo com o objeto clicado
        console.log('Objeto 3D clicado:', clickedObject);
        if (clickedObject.name == "chão") return
        //
        scene.remove(clickedObject);
        breakBlock.play();
    }
}
document.addEventListener('click', onMouseClick, false);
