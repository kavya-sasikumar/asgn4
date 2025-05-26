const OBJLoader = {
   load: function(url, callback) {
     fetch(url)
       .then(response => response.text())
       .then(data => {
         const obj = OBJParser.parse(data);
         callback(obj);
       });
   }
 };


 const OBJParser = {
   parse: function(data) {
     const lines = data.split('\n');
     const positions = [];
     const normals = [];
     const vertices = [];
     const vnormals = [];


     for (let line of lines) {
       line = line.trim();
       const parts = line.split(' ');
       if (parts[0] === 'v') {
         positions.push(parts.slice(1).map(Number));
       } else if (parts[0] === 'vn') {
         normals.push(parts.slice(1).map(Number));
       } else if (parts[0] === 'f') {
         for (let i = 1; i <= 3; i++) {
           const [vIdx, , nIdx] = parts[i].split('/').map(str => parseInt(str) - 1);
           vertices.push(...positions[vIdx]);
           vnormals.push(...normals[nIdx]);
         }
       }
     }


     return {
       vertices: new Float32Array(vertices),
       normals: new Float32Array(vnormals)
     };
   }
 };








