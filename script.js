main();

function main() {
	const canvas = document.querySelector('#glCanvas');
	// Init GL context
	const gl = canvas.getContext('webgl');

	// Continue if WebGL is working
	if (gl === null) {
		alert('WebGl isn\'t working');
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black, fully opaque
	gl.clear(gl.COLOR_BUFFER_BIT); // Clear the color buffer with specified clear color
}


// Init shader
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create shader program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If shader failed
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Shader not working ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}


function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// Check if it was succesfull
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('Shader error' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}


const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

const programInfo = {
	program: shaderProgram,
	attribLocations: {
		vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
	},
	uniformLocations: {
		projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
		modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
	}
};


function initBuffers(gl) {
	// Create a buffer for the square's positions
	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Create arr of positions for the square
	const positions = [
		-1.0, 1.0,
		1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.1
	];

	gl.bufferData(gl.ARRAY_BUFFER,
		new Float32Array(positions),
		gl.STATIC_DRAW);

	return {
		position: positionBuffer
	};
}


function drawScene(gl, programInfo, buffers) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// Clear canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.
	const fieldOfView = 45 * Math.PI / 180;
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionmatrix = mat4.create();

	mat4.perspective(projectionMatrix,
		fieldOfView,
		aspect,
		zNear,
		zFar);

	// Set drawing position to the id point, which is the center
	const modelViewMatrix = mat4.create();

	mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

	const numComponents = 2;
	const type = gl.FLOAT;
	const normalize = 0;

	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
	gl.vertexAttribPointer(
		programInfo.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(
		programInfo.attribLocations.vertexPosition);
}


// Tell WebGL to use our program when drawing

gl.useProgram(programInfo.program);

// Set the shader uniforms

gl.uniformMatrix4fv(
	programInfo.uniformLocations.projectionMatrix,
	false,
	projectionMatrix);
gl.uniformMatrix4fv(
	programInfo.uniformLocations.modelViewMatrix,
	false,
	modelViewMatrix);

{
	const offset = 0;
	const vertexCount = 4;
	gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}
