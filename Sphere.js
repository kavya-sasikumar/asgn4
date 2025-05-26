class Sphere {
   constructor() {
     this.type = 'sphere';
     this.color = [1.0, 0.0, 0.0, 1.0];
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


     const d = Math.PI / 10;
     const dd = Math.PI / 100;


     for (let t = 0; t < Math.PI; t += d) {
       for (let r = 0; r < 2 * Math.PI; r += d) {
         const p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
         const p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
         const p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
         const p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];


         const normals1 = [p1, p2, p4];
         const normals2 = [p1, p4, p3];


         const verts1 = [...p1, ...p2, ...p4];
         const verts2 = [...p1, ...p4, ...p3];


         const uvs = [[0, 0], [0, 0], [0, 0]];


         drawTriangle3DUVNormal(verts1, uvs, normals1);
         drawTriangle3DUVNormal(verts2, uvs, normals2);
       }
     }
   }
 }