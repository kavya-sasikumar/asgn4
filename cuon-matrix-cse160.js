class Matrix4 {
   constructor(opt_src) {
     const s = opt_src && opt_src.elements || new Float32Array(16);
     const d = new Float32Array(16);
     for (let i = 0; i < 16; ++i) d[i] = s[i];
     this.elements = d;
   }


   setIdentity() {
     const e = this.elements;
     e[0] = 1; e[4] = 0; e[8] = 0;  e[12] = 0;
     e[1] = 0; e[5] = 1; e[9] = 0;  e[13] = 0;
     e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
     e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
     return this;
   }


   clone() {
     return new Matrix4(this);
   }


   transpose() {
     const e = this.elements;
     let t;
     t = e[1]; e[1] = e[4]; e[4] = t;
     t = e[2]; e[2] = e[8]; e[8] = t;
     t = e[3]; e[3] = e[12]; e[12] = t;
     t = e[6]; e[6] = e[9]; e[9] = t;
     t = e[7]; e[7] = e[13]; e[13] = t;
     t = e[11]; e[11] = e[14]; e[14] = t;
     return this;
   }


   multiply(other) {
     const a = this.elements;
     const b = other.elements;
     const e = new Float32Array(16);
     for (let i = 0; i < 4; ++i) {
       const ai0 = a[i], ai1 = a[i + 4], ai2 = a[i + 8], ai3 = a[i + 12];
       e[i]      = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
       e[i + 4]  = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
       e[i + 8]  = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
       e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
     }
     this.elements = e;
     return this;
   }


   rotate(angle, x, y, z) {
     const rad = angle * Math.PI / 180;
     const s = Math.sin(rad);
     const c = Math.cos(rad);
     const len = Math.hypot(x, y, z);
     if (len === 0) return this;
     x /= len; y /= len; z /= len;
     const nc = 1 - c;


     const r = new Matrix4();
     const e = r.elements;


     e[0] = x * x * nc + c;
     e[1] = x * y * nc + z * s;
     e[2] = x * z * nc - y * s;
     e[3] = 0;


     e[4] = y * x * nc - z * s;
     e[5] = y * y * nc + c;
     e[6] = y * z * nc + x * s;
     e[7] = 0;


     e[8] = z * x * nc + y * s;
     e[9] = z * y * nc - x * s;
     e[10] = z * z * nc + c;
     e[11] = 0;


     e[12] = 0;
     e[13] = 0;
     e[14] = 0;
     e[15] = 1;


     return this.multiply(r);
   }


   translate(x, y, z) {
     const e = this.elements;
     e[12] += e[0] * x + e[4] * y + e[8] * z;
     e[13] += e[1] * x + e[5] * y + e[9] * z;
     e[14] += e[2] * x + e[6] * y + e[10] * z;
     e[15] += e[3] * x + e[7] * y + e[11] * z;
     return this;
   }


   scale(x, y, z) {
     const e = this.elements;
     e[0] *= x; e[4] *= y; e[8]  *= z;
     e[1] *= x; e[5] *= y; e[9]  *= z;
     e[2] *= x; e[6] *= y; e[10] *= z;
     e[3] *= x; e[7] *= y; e[11] *= z;
     return this;
   }


   setPerspective(fovy, aspect, near, far) {
     const e = this.elements;
     const f = 1.0 / Math.tan((fovy * Math.PI) / 360.0);
     const nf = 1 / (near - far);
     e[0] = f / aspect;
     e[1] = 0;
     e[2] = 0;
     e[3] = 0;
     e[4] = 0;
     e[5] = f;
     e[6] = 0;
     e[7] = 0;
     e[8] = 0;
     e[9] = 0;
     e[10] = (far + near) * nf;
     e[11] = -1;
     e[12] = 0;
     e[13] = 0;
     e[14] = (2 * far * near) * nf;
     e[15] = 0;
     return this;
   }


   setLookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
     const e = this.elements;
     const fx = cx - ex;
     const fy = cy - ey;
     const fz = cz - ez;
     let rlf = 1 / Math.hypot(fx, fy, fz);
     const fxn = fx * rlf;
     const fyn = fy * rlf;
     const fzn = fz * rlf;


     const sx = fyn * uz - fzn * uy;
     const sy = fzn * ux - fxn * uz;
     const sz = fxn * uy - fyn * ux;
     const rls = 1 / Math.hypot(sx, sy, sz);
     const sxn = sx * rls;
     const syn = sy * rls;
     const szn = sz * rls;


     const ux1 = syn * fzn - szn * fyn;
     const uy1 = szn * fxn - sxn * fzn;
     const uz1 = sxn * fyn - syn * fxn;


     e[0] = sxn; e[1] = ux1; e[2] = -fxn; e[3] = 0;
     e[4] = syn; e[5] = uy1; e[6] = -fyn; e[7] = 0;
     e[8] = szn; e[9] = uz1; e[10] = -fzn; e[11] = 0;
     e[12] = 0;  e[13] = 0;  e[14] = 0;   e[15] = 1;


     return this.translate(-ex, -ey, -ez);
   }


   setInverseOf(other) {
     return this.setIdentity();
   }
 }


 class Vector3 {
   constructor(opt_src) {
     const s = opt_src && opt_src.elements || new Float32Array(3);
     this.elements = new Float32Array(3);
     for (let i = 0; i < 3; ++i) this.elements[i] = s[i];
   }
 }


 class Vector4 {
   constructor(opt_src) {
     const s = opt_src && opt_src.elements || new Float32Array(4);
     this.elements = new Float32Array(4);
     for (let i = 0; i < 4; ++i) this.elements[i] = s[i];
   }
 }


