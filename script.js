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