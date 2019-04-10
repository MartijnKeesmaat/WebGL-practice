// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;

function init() {

	container = document.querySelector('#scene-container');

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x8FBCD4);

	createCamera();
	createControls();
	createLights();
	createMeshes();
	createRenderer();

	// start the animation loop
	renderer.setAnimationLoop(() => {

		update();
		render();

	});

}


function createCamera() {

	camera = new THREE.PerspectiveCamera(
		35, // FOV
		container.clientWidth / container.clientHeight, // aspect
		0.1, // near clipping plane
		100, // far clipping plane
	);

	camera.position.set(-5, 5, 7);

}


function createControls() {
	controls = new THREE.OrbitControls(camera, container);
}


function createLights() {

	const ambientLight = new THREE.HemisphereLight(
		0xddeeff, // sky color
		0x202020, // ground color
		5, // intensity
	);

	const mainLight = new THREE.DirectionalLight(0xffffff, 5);
	mainLight.position.set(10, 10, 10);

	scene.add(ambientLight, mainLight);

}


function createGeometries() {
	const nose = new THREE.CylinderBufferGeometry(0.75, 0.75, 2, 12);
	const cabin = new THREE.BoxBufferGeometry(2, 2.25, 1.5);
	const chimney = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5);
	const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
	wheel.rotateX(Math.PI / 2);

	return {
		nose,
		cabin,
		chimney,
		wheel
	};
}

function createMaterials() {
	const body = new THREE.MeshStandardMaterial({
		color: 0xff3333,
		flatShading: true
	});
	body.color.convertSRGBToLinear();


	const detail = new THREE.MeshStandardMaterial({
		color: 0x333333,
		flatShading: true
	});

	detail.color.convertSRGBToLinear();

	return {
		body,
		detail
	};
}

const train = new THREE.Group();
function createMeshes() {
	scene.add(train);
	const materials = createMaterials();
	const geometries = createGeometries();

	// Nose
	const nose = new THREE.Mesh(geometries.nose, materials.body);
	nose.rotation.z = Math.PI / 2; // equals to rotation 90 deg
	nose.position.x = -1;

	// Cabin
	const cabin = new THREE.Mesh(geometries.cabin, materials.body);
	cabin.position.set(1, 0.4, 0); // shorthand for thingie.position.x y z

	const chimney = new THREE.Mesh(geometries.chimney, materials.detail);
	chimney.position.set(-1.5, 0.9, 0);

	const smallWheelRear = new THREE.Mesh(geometries.wheel, materials.detail);
	smallWheelRear.position.set(0, -0.5, 0);

	const smallWheelCenter = smallWheelRear.clone();
	smallWheelCenter.position.x = -1;

	const smallWheelFront = smallWheelRear.clone();
	smallWheelCenter.position.x = -2;

	const bigWheel = smallWheelRear.clone();
	bigWheel.scale.set(2, 2, 1.25);
	bigWheel.position.set(1.5, -0.1, 0);

	train.add(
		nose,
		cabin,
		chimney,
		smallWheelRear,
		smallWheelCenter,
		smallWheelFront,
		bigWheel
	);
	train.position.x = 5;
}

function createRenderer() {

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(container.clientWidth, container.clientHeight);

	renderer.setPixelRatio(window.devicePixelRatio);

	renderer.gammaFactor = 2.2;
	renderer.gammaOutput = true;

	renderer.physicallyCorrectLights = true;

	container.appendChild(renderer.domElement);

}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {

	// Don't delete this function!
	train.position.x -= 0.02;
}

// render, or 'draw a still image', of the scene
function render() {

	renderer.render(scene, camera);

}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {

	// set the aspect ratio to match the new browser window aspect ratio
	camera.aspect = container.clientWidth / container.clientHeight;

	// update the camera's frustum
	camera.updateProjectionMatrix();

	// update the size of the renderer AND the canvas
	renderer.setSize(container.clientWidth, container.clientHeight);

}

window.addEventListener('resize', onWindowResize);

// call the init function to set everything up
init();
