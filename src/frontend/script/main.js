import * as THREE from '../../../node_modules/three/build/three.module.js'; // idk how this is supposed to work
//import { FilmShader } from './three/examples/jsm/shaders/FilmShader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;
camera.position.y = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000)
//const canvas = renderer.domElement; <-- not used
document.body.appendChild(renderer.domElement);
window.addEventListener('resize',() => renderer.setSize(window.innerWidth, window.innerHeight))

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 5, 2);
scene.add(light);

const textureLoader = new THREE.TextureLoader(),
    texture = textureLoader.load('./img/blue.png'), // <-- not used
    wallGeometry = new THREE.BoxGeometry(15.5, 20, 0),
    // materials
    wallMaterial = new THREE.MeshBasicMaterial({ color: 0x32ff00 }),
    wallMaterial2 = new THREE.MeshBasicMaterial({ color: 0x328ff0 }),
    wallMaterial3 = new THREE.MeshBasicMaterial({ color: 0xfff000 }),
    wallMaterial4 = new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    wallMaterial5 = new THREE.MeshBasicMaterial({ map: texture }), // <-- not used
    WP = 7.5;

const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(WP, 1, 0);
wall.rotation.y = Math.PI / 2;
wall.name = "wall1";
scene.add(wall);

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial2);
wall2.position.set(0, 1, WP);
scene.add(wall2);

const wall3 = new THREE.Mesh(wallGeometry, wallMaterial3);
wall3.position.set(0, 1, -WP);
scene.add(wall3);

const wall4 = new THREE.Mesh(wallGeometry, wallMaterial4);
wall4.position.set(-WP, 1, 0);
wall4.rotation.y = Math.PI / 2;
scene.add(wall4);

_animate_scene: {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function rotacaoSuave(rotacaoAlvo) {
    // Calcula a diferença de rotação entre a posição atual e a posição alvo
    const diferencaRotacao = rotacaoAlvo - camera.rotation.y; // <-- not used
    // Cria uma animação suave usando TweenMax
    TweenMax.to(camera.rotation, 0.5, { 
        y: rotacaoAlvo, ease: Power1.easeInOut,
        onComplete: () => rotate = false // Define a constiável de controle como false quando a rotação estiver concluída
    });
}
const rotate = false;
document.addEventListener('keydown',(event)=>{
    if(!rotate) {
        if (event.key == 39) {
            rotate = true;
            rotacaoSuave(camera.rotation.y - (90 * (Math.PI / 180)));
        }
        if (event.key == 37) {
            rotate = true;
            rotacaoSuave(camera.rotation.y + (90 * (Math.PI / 180)));
        }
    }
})

const canvas2d = document.getElementById('canvas2d'),
    context2d = canvas2d.getContext('2d');
// Exemplo: Desenhe uma crosshair no centro do canvas 2D
canvas2d.width = window.innerWidth;
canvas2d.height = window.innerHeight;
const centerX = canvas2d.width / 2,
     centerY = canvas2d.height / 2, // <-- not used
     comfortaa = new FontFace("comfortaa", "url(Comfortaa-constiableFont_wght.woff2)");

comfortaa.load().then(font => {
    document.fonts.add(font);
    
    context2d.font = '30px Comfortaa, sans-serif';
    context2d.textAlign = 'center';
    context2d.fillStyle = 'white';
    context2d.fillText("texto", centerX, 45);
})