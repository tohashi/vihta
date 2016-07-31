import * as THREE from 'three';

const dx = 0.001;
const dy = 0.001;
const yEdge = 400;

function createPoints(count, map) {
  const particles = new THREE.Geometry();
  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 4,
    map,
    transparent: true
  });

  for (let i = 0; i < count; i++) {
    const particle = new THREE.Vector3(
      Math.round(Math.random() * 1000) - 500,
      Math.round(Math.random() * 1000) - 500,
      Math.round(Math.random() * 1000) - 500
    );

    particle.velocity = new THREE.Vector3(0, -Math.random().toFixed(3) - 0, 0);
    particles.vertices.push(particle);
  }
  const points = new THREE.Points(particles, material);
  points.sortParticles = true;
  return points;
}

function updatePoints(points) {
  points.rotation.y += dx;
  
  points.geometry.vertices.forEach((particle) => {
    if (particle.y < -yEdge) {
      particle.y = yEdge;
      particle.velocity.y = -Math.random().toFixed(3) - 0;
    }
    particle.velocity.y -= (Math.random().toFixed(3) - 0) * dy;
    particle.add(particle.velocity);
  });
  points.geometry.verticesNeedUpdate = true;
}

export default {
  createPoints, updatePoints
}
