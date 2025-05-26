class Cube {
   constructor() {
     this.type = 'cube';
     this.color = [1.0, 1.0, 1.0, 1.0];
     this.matrix = new Matrix4();
     this.normalMatrix = new Matrix4();
     this.textureNum = -2;
   }


   render() {
     const rgba = this.color;
     gl.uniform1i(u_whichTexture, this.textureNum);
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


     const normalMat = new Matrix4();
     normalMat.setInverseOf(this.matrix);
     normalMat.transpose();
     gl.uniformMatrix4fv(u_NormalMatrix, false, normalMat.elements);


     const vertices = [
       // Front
       -0.5, -0.5,  0.5,   0.5, -0.5,  0.5,   0.5,  0.5,  0.5,
       -0.5, -0.5,  0.5,   0.5,  0.5,  0.5,  -0.5,  0.5,  0.5,
       // Back
       -0.5, -0.5, -0.5,  -0.5,  0.5, -0.5,   0.5,  0.5, -0.5,
       -0.5, -0.5, -0.5,   0.5,  0.5, -0.5,   0.5, -0.5, -0.5,
       // Top
       -0.5,  0.5, -0.5,  -0.5,  0.5,  0.5,   0.5,  0.5,  0.5,
       -0.5,  0.5, -0.5,   0.5,  0.5,  0.5,   0.5,  0.5, -0.5,
       // Bottom
       -0.5, -0.5, -0.5,   0.5, -0.5, -0.5,   0.5, -0.5,  0.5,
       -0.5, -0.5, -0.5,   0.5, -0.5,  0.5,  -0.5, -0.5,  0.5,
       // Right
        0.5, -0.5, -0.5,   0.5,  0.5, -0.5,   0.5,  0.5,  0.5,
        0.5, -0.5, -0.5,   0.5,  0.5,  0.5,   0.5, -0.5,  0.5,
       // Left
       -0.5, -0.5, -0.5,  -0.5, -0.5,  0.5,  -0.5,  0.5,  0.5,
       -0.5, -0.5, -0.5,  -0.5,  0.5,  0.5,  -0.5,  0.5, -0.5
     ];


     const normals = [
       // Front
       [0, 0, 1], [0, 0, 1], [0, 0, 1],
       [0, 0, 1], [0, 0, 1], [0, 0, 1],
       // Back
       [0, 0, -1], [0, 0, -1], [0, 0, -1],
       [0, 0, -1], [0, 0, -1], [0, 0, -1],
       // Top
       [0, 1, 0], [0, 1, 0], [0, 1, 0],
       [0, 1, 0], [0, 1, 0], [0, 1, 0],
       // Bottom
       [0, -1, 0], [0, -1, 0], [0, -1, 0],
       [0, -1, 0], [0, -1, 0], [0, -1, 0],
       // Right
       [1, 0, 0], [1, 0, 0], [1, 0, 0],
       [1, 0, 0], [1, 0, 0], [1, 0, 0],
       // Left
       [-1, 0, 0], [-1, 0, 0], [-1, 0, 0],
       [-1, 0, 0], [-1, 0, 0], [-1, 0, 0]
     ];


     const uvs = new Array(vertices.length / 3).fill([0, 0]);


     drawTriangle3DUVNormal(vertices, uvs, normals);
   }
 }


 // Helper function for drawing triangles with UV and normal info
 function drawTriangle3DUVNormal(vertices, uvs, normals) {
   // Create buffers and pass vertices, uvs, normals to attributes
   const nVerts = vertices.length / 3;


   // Flatten normal array if needed
   const flatNormals = [].concat(...normals);


   // Create & bind vertex buffer
   const vertexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(a_Position);


   const normalBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatNormals), gl.STATIC_DRAW);
   gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(a_Normal);


   const flatUVs = [].concat(...uvs);


   const uvBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatUVs), gl.STATIC_DRAW);
   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(a_UV);


   gl.drawArrays(gl.TRIANGLES, 0, nVerts);
 }
