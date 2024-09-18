import * as THREE from '../../../node_modules/three/build/three.module.js';
//import { FilmShader } from './three/examples/jsm/shaders/FilmShader.js';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;
camera.position.y = 1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000)
var canvas = renderer.domElement;
document.body.appendChild(renderer.domElement);
window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
})

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 5, 2);
scene.add(light);

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load('./img/blue.png');

var wallGeometry = new THREE.BoxGeometry(15.5, 20, 0);
var wallMaterial = new THREE.MeshBasicMaterial({ color: 0x32ff00 });
var wallMaterial2 = new THREE.MeshBasicMaterial({ color: 0x328ff0 });
var wallMaterial3 = new THREE.MeshBasicMaterial({ color: 0xfff000 });
var wallMaterial4 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var wallMaterial5 = new THREE.MeshBasicMaterial({ map: texture })
var WP = 7.5
var wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(WP, 1, 0);
wall.rotation.y = Math.PI / 2;
wall.name = "wall1";
scene.add(wall);

var wall2 = new THREE.Mesh(wallGeometry, wallMaterial2);
wall2.position.set(0, 1, WP);
scene.add(wall2);

var wall3 = new THREE.Mesh(wallGeometry, wallMaterial3);
wall3.position.set(0, 1, -WP);
scene.add(wall3);

var wall4 = new THREE.Mesh(wallGeometry, wallMaterial4);
wall4.position.set(-WP, 1, 0);
wall4.rotation.y = Math.PI / 2;
scene.add(wall4);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

function rotacaoSuave(rotacaoAlvo) {
    // Calcula a diferença de rotação entre a posição atual e a posição alvo
    var diferencaRotacao = rotacaoAlvo - camera.rotation.y;
    // Cria uma animação suave usando TweenMax
    TweenMax.to(camera.rotation, 0.5, { 
        y: rotacaoAlvo, ease: Power1.easeInOut,
        onComplete: () => {
            rotate = false; // Define a variável de controle como false quando a rotação estiver concluída
        }
    });
}
var rotate = false;
document.addEventListener('keydown',(event)=>{
    if(!rotate) {
        if (event.keyCode === 39) {
            rotate = true;
            rotacaoSuave(camera.rotation.y - (90 * (Math.PI / 180)));
        }
        if (event.keyCode === 37) {
            rotate = true;
            rotacaoSuave(camera.rotation.y + (90 * (Math.PI / 180)));
        }
    }
})

var canvas2d = document.getElementById('canvas2d');
var context2d = canvas2d.getContext('2d');
// Exemplo: Desenhe uma crosshair no centro do canvas 2D
canvas2d.width = window.innerWidth;
canvas2d.height = window.innerHeight;
var centerX = canvas2d.width / 2;
var centerY = canvas2d.height / 2;
const comfortaa = new FontFace("comfortaa", "url(Comfortaa-VariableFont_wght.woff2)");

comfortaa.load().then(function(font) {
    document.fonts.add(font);
    
    context2d.font = '30px Comfortaa, sans-serif';
    context2d.textAlign = 'center';
    context2d.fillStyle = 'white';
    context2d.fillText("texto", centerX, 45);
})