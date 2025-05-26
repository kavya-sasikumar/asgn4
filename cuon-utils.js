function initShaders(gl, vshaderSource, fshaderSource) {
   const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshaderSource);
   const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshaderSource);


   if (!vertexShader || !fragmentShader) {
     console.error("Shader compilation failed.");
     return null;
   }


   const program = gl.createProgram();
   if (!program) {
     console.error("Failed to create WebGL program.");
     return null;
   }


   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
   gl.linkProgram(program);


   const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (!linked) {
     const error = gl.getProgramInfoLog(program);
     console.error("Failed to link program:\n" + error);
     gl.deleteProgram(program);
     return null;
   }


   return program;
 }


 function loadShader(gl, type, source) {
   const shader = gl.createShader(type);
   if (!shader) {
     console.error("Unable to create shader.");
     return null;
   }


   gl.shaderSource(shader, source);
   gl.compileShader(shader);


   const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
   if (!compiled) {
     const error = gl.getShaderInfoLog(shader);
     console.error("Failed to compile shader:\n", source, "\n\n", error);
     gl.deleteShader(shader);
     return null;
   }


   return shader;
 }


 function getWebGLContext(canvas) {
   const names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
   let context = null;
   for (let name of names) {
     try {
       context = canvas.getContext(name);
     } catch (e) {}
     if (context) break;
   }
   if (!context) console.error("Failed to get WebGL context.");
   return context;
 }




