import * as THREE from './assets/vendor/three.module.min.js';

const stage = document.querySelector('.helmet-stage');
const canvas = stage.querySelector('canvas');
const controls = document.querySelector('.helmet-controls');
const status = document.querySelector('#helmet-status');

function startViewer() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
  const helmet = new THREE.Group();
  scene.add(helmet, new THREE.HemisphereLight(0xe8f2ff, 0x71839a, 2.2));

  function light(color, intensity, x, y, z) {
    const lamp = new THREE.DirectionalLight(color, intensity);
    lamp.position.set(x, y, z);
    scene.add(lamp);
  }
  light(0xfff8ed, 3.4, -3, 5, 5);
  light(0xaacbff, 2.1, 3, 3, -4);

  const white = new THREE.MeshPhysicalMaterial({ color: 0xf8f9fc, roughness: 0.24, clearcoat: 0.75, side: THREE.DoubleSide });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x111821, roughness: 0.7, side: THREE.DoubleSide });
  const trim = new THREE.MeshPhysicalMaterial({ color: 0x202936, roughness: 0.34, clearcoat: 0.4, side: THREE.DoubleSide });
  const visor = new THREE.MeshPhysicalMaterial({ color: 0x24344a, roughness: 0.16, metalness: 0.24, clearcoat: 1, side: THREE.DoubleSide });
  const metal = new THREE.MeshStandardMaterial({ color: 0xa5b4c8, metalness: 0.65, roughness: 0.32 });

  // Cross sections run from the neck opening to the crown. Front is +Z.
  const rings = [
    [-0.89, .67, .76, .02], [-0.77, .77, .95, .08],
    [-0.57, .85, 1.13, .11], [-0.28, .94, 1.08, .09],
    [ .04, .99, 1.05, .02], [ .37, .97, 1.01, -.04],
    [ .65, .86, .92, -.09], [ .89, .65, .73, -.13],
    [1.11, .35, .43, -.15], [1.14, .002, .002, -.15]
  ];
  const widths = new THREE.CatmullRomCurve3(rings.map(([y, x, z]) => new THREE.Vector3(x, y, z)));
  const centers = new THREE.CatmullRomCurve3(rings.map(([y, , , center]) => new THREE.Vector3(center, y, 0)));

  function shellPoint(angle, t, offset = 0) {
    const ring = widths.getPoint(t);
    const center = centers.getPoint(t);
    return new THREE.Vector3(
      Math.sin(angle) * (ring.x + offset),
      ring.y,
      center.x + Math.cos(angle) * (ring.z + offset)
    );
  }

  function surface(material, sample, columns, rows) {
    const points = [], indices = [];
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        points.push(...sample(column / columns, row / rows).toArray());
        if (!row || !column) continue;
        const d = row * (columns + 1) + column;
        const a = d - columns - 2;
        indices.push(a, a + 1, d, a, d, d - 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    helmet.add(new THREE.Mesh(geometry, material));
  }

  surface(white, (u, v) => shellPoint((u - .5) * Math.PI * 2, v), 112, 80);
  surface(rubber, (u, v) => {
    const point = shellPoint(u * Math.PI * 2, 0, .017);
    point.x *= 1 - .42 * v;
    point.z *= 1 - .39 * v;
    point.y -= .055 * Math.sin(v * Math.PI);
    return point;
  }, 96, 12);
  surface(rubber, (u, v) => {
    const point = shellPoint(u * Math.PI * 2, 0);
    point.x *= .58 * (1 - v);
    point.z *= .61 * (1 - v);
    point.y += .27 * v;
    return point;
  }, 64, 10);

  function shield(u, v, offset, border) {
    const angle = (u - .5) * (border ? 2.73 : 2.62);
    const middle = Math.cos(angle);
    const low = .35 - .068 * middle + (border ? -.012 : 0);
    const high = .57 - .031 * middle + (border ? .015 : 0);
    return shellPoint(angle, low + (high - low) * v, offset);
  }
  surface(rubber, (u, v) => shield(u, v, .029, true), 64, 28);
  surface(visor, (u, v) => shield(u, v, .047, false), 64, 28);
  const highlight = new THREE.MeshBasicMaterial({ color: 0xb6d5ff, transparent: true, opacity: .24, side: THREE.DoubleSide });
  surface(highlight, (u, v) => shield(.12 + .76 * u, .80 + .075 * v, .050, false), 48, 3);

  function pod(material, angle, t, scale, offset, roll = 0) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16), material);
    mesh.scale.set(...scale);
    mesh.position.copy(shellPoint(angle, t, offset));
    mesh.rotation.set(0, angle, roll);
    helmet.add(mesh);
  }

  for (const side of [-1, 1]) {
    pod(trim, side * 1.36, .45, [.16, .145, .062], .034);
    pod(metal, side * 1.40, .45, [.059, .059, .032], .091);
    pod(trim, side * .57, .746, [.145, .10, .055], .028, side * .29);
    for (let i = 0; i < 3; i++) {
      pod(metal, side * .57, .723 + .019 * i, [.057, .012, .018], .076, side * .29);
    }
    pod(trim, Math.PI + side * .36, .69, [.14, .047, .041], .033);
  }
  pod(trim, 0, .176, [.26, .076, .040], .014);
  for (let i = 0; i < 3; i++) {
    pod(metal, 0, .151 + .021 * i, [.10 + .022 * i, .010, .012], .049);
  }

  const badge = document.createElement('canvas');
  badge.width = 256;
  badge.height = 84;
  const ink = badge.getContext('2d');
  ink.strokeStyle = ink.fillStyle = '#182232';
  ink.lineWidth = 5;
  ink.beginPath();
  ink.ellipse(128, 42, 117, 35, 0, 0, 2 * Math.PI);
  ink.stroke();
  ink.font = 'italic 900 50px Arial';
  ink.textAlign = 'center';
  ink.fillText('ZEUS', 128, 59);
  const texture = new THREE.CanvasTexture(badge);
  texture.colorSpace = THREE.SRGBColorSpace;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(.41, .135),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
  logo.position.copy(shellPoint(0, .621, .047));
  logo.rotation.x = -.21;
  helmet.add(logo);

  const presets = {
    overview: [-.57, .16], front: [0, 0], side: [Math.PI / 2, 0],
    rear: [Math.PI, 0], underside: [-.36, -1.19]
  };
  let [yaw, pitch] = presets.overview;
  let zoom = 1;
  let pointer = null;

  function draw() {
    const { clientWidth: width, clientHeight: height } = stage;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const distance = 5.35 * Math.max(1, 1.07 / camera.aspect) / zoom;
    camera.position.set(distance * Math.sin(yaw) * Math.cos(pitch),
      .08 + distance * Math.sin(pitch), distance * Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(0, .08, 0);
    renderer.render(scene, camera);
  }

  let frame = 0;
  function schedule() {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(); });
  }
  function rotate(dx, dy) {
    yaw += dx;
    pitch = Math.min(1.52, Math.max(-1.52, pitch + dy));
    controls.querySelectorAll('[aria-pressed]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    schedule();
  }

  canvas.addEventListener('pointerdown', event => {
    if (pointer || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (pointer?.id !== event.pointerId) return;
    rotate((pointer.x - event.clientX) * .009, (event.clientY - pointer.y) * .009);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  canvas.addEventListener('lostpointercapture', () => {
    pointer = null;
    canvas.classList.remove('dragging');
  });
  const keys = { ArrowLeft: [-.16, 0], ArrowRight: [.16, 0], ArrowUp: [0, .16], ArrowDown: [0, -.16] };
  canvas.addEventListener('keydown', event => {
    if (!Object.hasOwn(keys, event.key)) return;
    event.preventDefault();
    rotate(...keys[event.key]);
  });

  controls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (Object.hasOwn(presets, button.dataset.view)) {
      [yaw, pitch] = presets[button.dataset.view];
      zoom = 1;
      controls.querySelectorAll('[aria-pressed]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      status.textContent = button.textContent.trim() + ' view';
    } else {
      zoom = Math.min(1.6, Math.max(.85, zoom + Number(button.dataset.zoom) * .15));
      status.textContent = 'Zoom ' + Math.round(zoom * 100) + '%';
    }
    schedule();
  });

  draw();
  stage.dataset.ready = 'true';
  controls.hidden = false;
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    delete stage.dataset.ready;
    controls.hidden = true;
    status.textContent = '3D view paused. Showing the helmet image.';
  });
  canvas.addEventListener('webglcontextrestored', () => {
    draw();
    stage.dataset.ready = 'true';
    controls.hidden = false;
  });
  new ResizeObserver(schedule).observe(stage);
}

try {
  startViewer();
} catch {
  status.textContent = 'Interactive 3D is unavailable on this device.';
}
