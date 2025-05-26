


const VERTEX_SHADER = `
 attribute vec4 a_Position;
 attribute vec3 a_Normal;
 attribute vec2 a_UV;


 uniform mat4 u_ModelMatrix;
 uniform mat4 u_ViewMatrix;
 uniform mat4 u_ProjectionMatrix;
 uniform mat4 u_NormalMatrix;


 varying vec3 v_Normal;
 varying vec3 v_VertPos;
 varying vec2 v_UV;


 void main() {
   gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
   v_VertPos = vec3(u_ModelMatrix * a_Position);
   v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 0.0)));
   v_UV = a_UV;
 }
`;


const FRAGMENT_SHADER = `
 precision mediump float;
 uniform vec4 u_FragColor;
 uniform sampler2D u_Sampler0;
 uniform int u_whichTexture;
 uniform bool u_lightOn;
 uniform bool u_normalOn;
 uniform vec3 u_LightPos;
 uniform vec3 u_cameraPos;


 varying vec3 v_Normal;
 varying vec3 v_VertPos;
 varying vec2 v_UV;


 void main() {
   vec3 normal = normalize(v_Normal);
   vec3 lightDir = normalize(u_LightPos - v_VertPos);
   vec3 viewDir = normalize(u_cameraPos - v_VertPos);
   vec3 reflectDir = reflect(-lightDir, normal);


   float nDotL = max(dot(normal, lightDir), 0.0);
   float specular = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
   vec3 ambient = vec3(0.2) * vec3(u_FragColor);
   vec3 diffuse = vec3(0.7) * vec3(u_FragColor) * nDotL;
   vec3 highlight = vec3(0.8) * specular;


   vec4 baseColor = u_FragColor;
   if (u_whichTexture == 0) {
     baseColor = texture2D(u_Sampler0, v_UV);
   }


   if (u_normalOn) {
     gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
   } else if (u_lightOn) {
     gl_FragColor = vec4(ambient + diffuse + highlight, baseColor.a);
   } else {
     gl_FragColor = baseColor;
   }
 }
`;


// Globals
let canvas, gl;
let a_Position, a_Normal, a_UV;
let u_ModelMatrix, u_ViewMatrix, u_ProjectionMatrix, u_NormalMatrix;
let u_FragColor, u_whichTexture, u_Sampler0;
let u_LightPos, u_cameraPos, u_lightOn, u_normalOn;


let g_lightPos = [0, 1, -2];
let g_lightOn = true;
let g_normalOn = false;
let g_globalAngle = 0;


function main() {
 canvas = document.getElementById("webgl");
 gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
 if (!gl) {
   console.log("WebGL not supported");
   return;
 }


 gl.enable(gl.DEPTH_TEST);


 const program = initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER);
 gl.useProgram(program);
 gl.program = program;


 // Connect attributes
 a_Position = gl.getAttribLocation(program, "a_Position");
 a_Normal = gl.getAttribLocation(program, "a_Normal");
 a_UV = gl.getAttribLocation(program, "a_UV");


 // Connect uniforms
 u_ModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
 u_ViewMatrix = gl.getUniformLocation(program, "u_ViewMatrix");
 u_ProjectionMatrix = gl.getUniformLocation(program, "u_ProjectionMatrix");
 u_NormalMatrix = gl.getUniformLocation(program, "u_NormalMatrix");


 u_FragColor = gl.getUniformLocation(program, "u_FragColor");
 u_whichTexture = gl.getUniformLocation(program, "u_whichTexture");
 u_Sampler0 = gl.getUniformLocation(program, "u_Sampler0");


 u_LightPos = gl.getUniformLocation(program, "u_LightPos");
 u_cameraPos = gl.getUniformLocation(program, "u_cameraPos");
 u_lightOn = gl.getUniformLocation(program, "u_lightOn");
 u_normalOn = gl.getUniformLocation(program, "u_normalOn");


 addUIEventListeners();


 requestAnimationFrame(tick);
}


function addUIEventListeners() {
 document.getElementById("normalOn").onclick = () => g_normalOn = true;
 document.getElementById("normalOff").onclick = () => g_normalOn = false;
 document.getElementById("lightOn").onclick = () => g_lightOn = true;
 document.getElementById("lightOff").onclick = () => g_lightOn = false;


 document.getElementById("lightSlideX").oninput = e => g_lightPos[0] = parseFloat(e.target.value);
 document.getElementById("lightSlideY").oninput = e => g_lightPos[1] = parseFloat(e.target.value);
 document.getElementById("lightSlideZ").oninput = e => g_lightPos[2] = parseFloat(e.target.value);


 document.getElementById("angleSlide").oninput = e => g_globalAngle = parseFloat(e.target.value);
}


function tick() {
 renderScene();
 requestAnimationFrame(tick);
}


function renderScene() {
 gl.clearColor(0.2, 0.2, 0.2, 1.0);
 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


 const proj = new Matrix4();
 proj.setPerspective(60, canvas.width / canvas.height, 1, 100);
 gl.uniformMatrix4fv(u_ProjectionMatrix, false, proj.elements);


 const view = new Matrix4();
 view.setLookAt(0, 2, 5, 0, 0, 0, 0, 1, 0);
 gl.uniformMatrix4fv(u_ViewMatrix, false, view.elements);


 gl.uniform3fv(u_LightPos, g_lightPos);
 gl.uniform3f(u_cameraPos, 0, 2, 5);
 gl.uniform1i(u_lightOn, g_lightOn);
 gl.uniform1i(u_normalOn, g_normalOn);


 const globalRot = new Matrix4().setIdentity().rotate(g_globalAngle, 0, 1, 0);


 const floor = new Cube();
 floor.color = [0.6, 0.8, 1.0, 1.0];
 floor.textureNum = -2;
 floor.matrix = globalRot.clone().translate(0, -1, 0).scale(10, 0.1, 10);
 floor.render();


//  const ball = new Sphere();
//  ball.color = [1.0, 0.0, 0.0, 1.0];
//  ball.textureNum = -2;
//  ball.matrix = globalRot.clone().translate(-2, 0, -2).scale(1, 1, 1);
//  ball.render();

 const midCube = new Cube();
 midCube.color = [0.9, 0.4, 0.6, 1.0]; // soft pink
 midCube.textureNum = -2;
 midCube.matrix = globalRot.clone().translate(1, 0, 1).scale(1.5, 1.5, 1.5); // medium cube
 midCube.render();


 const lightMarker = new Cube();
 lightMarker.color = [2, 2, 0, 1];
 lightMarker.textureNum = -2;
 lightMarker.matrix.setIdentity();
 lightMarker.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
 lightMarker.matrix.scale(0.1, 0.1, 0.1);
 lightMarker.render();
}


function initShaders(gl, vsSource, fsSource) {
 const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
 const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);


 const program = gl.createProgram();
 gl.attachShader(program, vertexShader);
 gl.attachShader(program, fragmentShader);
 gl.linkProgram(program);


 if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
   console.error('Failed to link program:', gl.getProgramInfoLog(program));
   return null;
 }
 return program;
}

function renderWorld() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);

  // Light position & control (animated)
  const lightPos = [Math.sin(Date.now() * 0.001) * 10, 5, Math.cos(Date.now() * 0.001) * 10];
  gl.uniform3fv(u_LightPos, lightPos);
  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform1i(u_normalOn, g_normalOn);

  // Ground
  const ground = new Cube();
  ground.color = [0.2, 0.6, 0.2, 1.0];
  ground.textureNum = -2;
  ground.matrix = new Matrix4().setTranslate(0, -1, 0).scale(32, 0.1, 32);
  ground.render();

  // Light marker cube
  const lightCube = new Cube();
  lightCube.color = [1.0, 1.0, 0.0, 1.0];
  lightCube.textureNum = -2;
  lightCube.matrix = new Matrix4().setTranslate(...lightPos).scale(0.3, 0.3, 0.3);
  lightCube.render();

  // Blocks
  for (let x = 0; x < 32; x++) {
    for (let z = 0; z < 32; z++) {
      let height = worldMap[x][z];
      for (let y = 0; y < height; y++) {
        const block = new Cube();
        block.color = [0.5, 0.25 + y * 0.05, 0.1, 1.0];
        block.textureNum = -2;
        block.matrix = new Matrix4().setTranslate(x - 16, y, z - 16);
        block.render();
      }
    }
  }

  // Animal (same design)
  for (let i = 0; i < 4; i++) {
    const leg = new Cube();
    leg.color = [0.4, 0.2, 0, 1];
    leg.textureNum = -2;
    let dx = (i % 2 === 0) ? 0.1 : 0.7;
    let dz = (i < 2) ? 0.1 : 0.7;
    leg.matrix = new Matrix4().setTranslate(2 + dx, 0, 2 + dz).scale(0.2, 0.5, 0.2);
    leg.render();
  }

  const body = new Cube();
  body.color = [1.0, 0.5, 0.3, 1.0];
  body.textureNum = -2;
  body.matrix = new Matrix4().setTranslate(2, 0.5, 2).scale(1, 0.5, 1);
  body.render();

  const head = new Cube();
  head.color = [1.0, 0.8, 0.6, 1.0];
  head.textureNum = -2;
  head.matrix = new Matrix4().setTranslate(2.35, 1, 2).scale(0.3, 0.3, 0.3);
  head.render();

  const earLeft = new Cube();
  earLeft.color = [0.8, 0.4, 0.4, 1.0];
  earLeft.textureNum = -2;
  earLeft.matrix = new Matrix4().setTranslate(2.3, 1.3, 2).scale(0.1, 0.1, 0.1);
  earLeft.render();

  const earRight = new Cube();
  earRight.color = [0.8, 0.4, 0.4, 1.0];
  earRight.textureNum = -2;
  earRight.matrix = new Matrix4().setTranslate(2.55, 1.3, 2).scale(0.1, 0.1, 0.1);
  earRight.render();

  // Floating cube
  const magicCube = new Cube();
  magicCube.color = [1.0, 0.2, 0.8, 0.7];
  magicCube.textureNum = -2;
  magicCube.matrix = new Matrix4().setTranslate(2, 2.5 + Math.sin(Date.now() * 0.005), 2).scale(0.5, 0.5, 0.5);
  magicCube.render();

  // Story and win detection
  if (showGoal) {
    alert("Your animal is stuck on the tower! Build stairs to reach it.");
    showGoal = false;
  }

  const cam = camera.eye.elements;
  if (Math.abs(cam[0] - 2) < 1.5 && Math.abs(cam[2] - 2) < 1.5 && cam[1] < 2) {
    alert("You reached your animal! 🐾 Mission Complete!");
  }
}


function loadShader(gl, type, source) {
 const shader = gl.createShader(type);
 gl.shaderSource(shader, source);
 gl.compileShader(shader);


 if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
   console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
   gl.deleteShader(shader);
   return null;
 }
 return shader;
}






