class Model {
   constructor() {
     this.vertices = [];
     this.normals = [];
     this.matrix = new Matrix4();
     this.color = [1.0, 1.0, 1.0, 1.0];
     this.textureNum = -2;
   }


   loadOBJ(filepath) {
     OBJLoader.load(filepath, (obj) => {
       this.vertices = obj.vertices;
       this.normals = obj.normals;
     });
   }


   render() {
     if (this.vertices.length === 0) return;


     gl.uniform1i(u_whichTexture, this.textureNum);
     gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


     const normalMat = new Matrix4();
     normalMat.setInverseOf(this.matrix);
     normalMat.transpose();
     gl.uniformMatrix4fv(u_NormalMatrix, false, normalMat.elements);


     drawOBJModel(this.vertices, this.normals);
   }
 }
