import 'whatwg-fetch';
import * as THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import _ from 'lodash';
import { getPhotoUrl } from '../utils';
import { fetchPhotos } from '../actions/photo';
import { createPoints, updatePoints } from './particles';
import textures from './particle_texture';
import { ActionTypes } from '../constants';

let width = window.innerWidth;
let height = window.innerHeight;

window.addEventListener('resize', handleResize);

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const pi = Math.PI;
const rad1 = pi / 180;
const rad2 = rad1 * 1.25;
const rad3 = rad1 * 1.5;
const visiblePlanes = [];
const hiddenPlanes = [];
const photos = [];
const PLANE_LIMIT = 30;

let loadingCount = 0;
const loadingDuration = 1 * 60 * 1000;
const LOADING_COUNT_LIMIT = 10;

loader.setCrossOrigin('*');

function setPlaneParams(plane) {
  plane.position.set(
    _.sample(_.range(-width, Math.round(width / 3), 10)),
    _.sample(_.range(-Math.round(height / 2), Math.round(height / 2), 10)),
    Math.round(Math.random() * 300) + 300
  );

  plane.rotation.set(
    ((Math.round(Math.random() * 20) - 10) * rad1),
    0,
    ((Math.round(Math.random() * 40) - 20) * rad1)
  );

  plane.params = {
    dirZ: -Math.floor(Math.random() * 30 + 10) / 10,
    dirRad: _.sample([rad1, rad2, rad3])
  }

  plane.name = 'photo-insert';
  if (visiblePlanes.length < PLANE_LIMIT) {
    plane.visible = true;
    visiblePlanes.push(plane);
  } else {
    plane.visible = false;
    hiddenPlanes.unshift(plane);
  }
}

function addPlane(photo) {
  loader.load(getPhotoUrl(photo), (texture) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(texture.image.width, texture.image.height),
      new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
      })
    );
    setPlaneParams(plane);
    scene.add(plane);
  });
}

function updatePlane() {
  visiblePlanes.forEach((plane, i) => {
    switch (plane.name) {
      case 'photo-insert':
        plane.position.z += plane.params.dirZ;
        plane.rotation.x += plane.params.dirRad;
        plane.rotation.y += plane.params.dirRad;
        if (plane.rotation.x > pi * 2) {
          plane.rotation.x = 0;
        }
        if (plane.position.z < 0 && plane.rotation.x === 0) {
          plane.name = 'photo-flowing';
        }
        break;
      case 'photo-flowing':
        if (plane.position.x > width) {
          plane.visible = false;
          visiblePlanes.splice(i, 1);
          hiddenPlanes.push(plane);
        } else {
          plane.position.x += 1;
        }
        break;
      default:
        break;
    }
  });

  for (let i = 0; i < PLANE_LIMIT - visiblePlanes.length; i++) {
    let hiddenPlane = hiddenPlanes.shift();
    if (hiddenPlane) {
      setPlaneParams(hiddenPlane);
    }
  }
}

const points = createPoints(3000, textures.white);
scene.add(points);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 100, 30);
scene.add(light);

const ambient = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambient);

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
camera.position.set(0, 0, 500);
camera.lookAt(scene.position);

const controls = new (OrbitControls(THREE))(camera);
// controls.autoRotate = true;

// helper
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);
// const axisHelper = new THREE.AxisHelper(1000);
// scene.add(axisHelper);
// const lightHelper = new THREE.DirectionalLightHelper(light, 20);
// scene.add(lightHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

// fog
scene.fog = new THREE.FogExp2(0x000000, 0.0001);

function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
};

function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
  updatePlane();
  updatePoints(points);
}

function start() {
  render();
  getPhotoData();
}

function getPhotoData() {
  fetchPhotos()((action) => {
    if (action.type === ActionTypes.FETCH_PHOTOS) {
      action.photos.forEach((newPhoto) => {
        if (!_.find(photos, (photo) => photo._id === newPhoto._id)) {
          photos.push(newPhoto);
          addPlane(newPhoto);
        }
      });
    }
    if (++loadingCount < LOADING_COUNT_LIMIT) {
      setTimeout(getPhotoData, loadingDuration);
    } else {
      location.reload();
    }
  });
}

document.getElementById('root').appendChild(renderer.domElement);
start();
