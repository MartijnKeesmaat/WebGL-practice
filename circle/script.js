// Setup
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');
gl.viewport(0, 0, gl.canvas.width,gl.canvas.height);





function createShader(gl,type,source){
	const Shader = gl.createShader(type);
	gl.shaderSource(Shader,source);
	gl.compileShader(Shader);
	if(gl.getShaderParameter(Shader, gl.COMPILE_STATUS)){
		return Shader;
	}
	console.error('create shader fails:'+gl.getShaderInfoLog(Shader));
	gl.deleteShader(Shader);
}

function createProgram(gl,vertexShader,fragmentShader){
	const Program = gl.createProgram();
	gl.attachShader(Program,vertexShader);
	gl.attachShader(Program,fragmentShader);
	gl.linkProgram(Program);
	if(gl.getProgramParameter(Program,gl.LINK_STATUS)){
		return Program;
	}
	console.error('create program fails:'+gl.getProgramInfoLog(Program));
	gl.deleteProgram(Program);
}





const vertexShaderSource = `
	precision mediump float;

	attribute vec2 a_position;
	uniform vec2 u_resolution;
	uniform vec2 u_center;
	uniform float u_radius;

	void main() {
		vec2 delta = a_position*u_radius*1.2;
		gl_Position = vec4(((u_center+delta) / u_resolution * 2.0 - 1.0), 0, 1);
	}
`;

const fragmentShaderSource = `
	precision mediump float;

	uniform vec4 u_color;
	uniform vec4 u_haloColor;
	uniform vec2 u_center;
	uniform float u_radius;
	uniform float u_haloRadius;

	void main(){
		vec2 uv = gl_FragCoord.xy;
		float dist = length(uv-u_center);
		float gap = dist-u_radius;
		vec4 color = vec4(0.0);
		float alpha = smoothstep(-0.5, 1.0, gap);
		if(u_haloRadius>0.0){
			float alpha2 = smoothstep(-u_haloRadius, 1.5-u_haloRadius, gap);
			color = mix(u_haloColor,vec4(0.0),alpha);
			color = mix(u_color,color,alpha2);
		}
		else{
			color = mix(u_color,color,alpha);
		}

		gl_FragColor = color;
	}
`;






// Shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

gl.linkProgram(program);
gl.useProgram(program);




const vertices = [
	0,  0,
	-1, -1,
	 1, -1,
	 1,  1,
];

const a_position = gl.getAttribLocation(program, 'a_position');
const u_color = gl.getUniformLocation(program, 'u_color');
const u_haloColor = gl.getUniformLocation(program, 'u_haloColor');

const u_resolution = gl.getUniformLocation(program, 'u_resolution');
const u_center = gl.getUniformLocation(program, 'u_center');
const u_radius = gl.getUniformLocation(program, 'u_radius');
const u_haloRadius = gl.getUniformLocation(program, 'u_haloRadius');


gl.enableVertexAttribArray(a_position);


gl.uniform4fv(u_color, new Float32Array([1,0,0,1]));
gl.uniform4fv(u_haloColor, new Float32Array([0,1,0,1]));
gl.uniform2fv(u_resolution, [gl.canvas.width,gl.canvas.height]);
gl.uniform2fv(u_center, [400, 400]);
gl.uniform1f(u_radius, 200.0);
gl.uniform1f(u_haloRadius, 10.0);

gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
