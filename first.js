//constants: 
//http://physics.nist.gov/cgi-bin/cuu/Category?view=html&Universal.x=81&Universal.y=7   
var epsilon0 = 8.854187817e-12; //electric constant F m-1
var z0 = 376.730313461; //ohm, characteristic impedance of vacuum 
var u0 = 12.566370614e-7; // 4 pi, magnetic constant 
var c0 = 299792458; //m.s-1, speed of light in vacuum 
var e = 1.6021766208e-19; //C, elementary charge
var mu = 1.660539040e-27; //kg, atomic mass constant 

var muc2 = 931.4940954; //atomic mass constant energy equivalent in MeV


function pSel_o() {
    document.getElementById("Z").value = 1;
    document.getElementById("Q").value = 1;
}

function pSel_e() {
    document.getElementById("Z").value = 5.48579909070e-4;
    document.getElementById("Q").value = 1;
}

function pSel_p() {
    document.getElementById("Z").value = 1.007276466879;
    document.getElementById("Q").value = 1;
}

function pSel_d() {
    document.getElementById("Z").value = 2.013553212745;
    document.getElementById("Q").value = 1;
}



function FtoE() {
    // code like Solve() in mathematic is necessary
    // fitting data
    var f = document.getElementById("mwfreq").value;
    var kp = document.getElementById("kp").value;
    var E = 0.0288524 * f - 0.0000164048 * f * f + 1.50285 * Math.log(1 + 3.21312 * f);
    document.getElementById("es").value = E * kp;
}

function EtoF() {
    var E = document.getElementById("es").value;
    var kp = document.getElementById("kp").value;
    E = E / kp;
    var f = 1.6 * E * E * Math.exp(-8.5 / E);

    document.getElementById("mwfreq").value = f;
}

function VtoBeta() {
    var Ndigit = 4;
    var Z = document.getElementById("Z").value;
    var Q = document.getElementById("Q").value;

    //particle at beginning
    var Vbegin = document.getElementById("E_begin").value; //MV
    var p = new particle(Z, Q, Vbegin);
    document.getElementById("gamma_begin").value = p.gamma.toFixed(Ndigit); //
    document.getElementById("beta_begin").value = p.beta.toFixed(Ndigit); //

    //particle at SH
    var Vsh = document.getElementById("E_SH").value; //MV
    p.accelerate(Vsh);
    document.getElementById("gamma_SH").value = p.gamma.toFixed(Ndigit); //
    document.getElementById("beta_SH").value = p.beta.toFixed(Ndigit); //

    //particle at GB
    var Vgb = document.getElementById("E_GB").value; //MV
    p.accelerate(Vgb);
    document.getElementById("gamma_GB").value = p.gamma.toFixed(Ndigit); //
    document.getElementById("beta_GB").value = p.beta.toFixed(Ndigit); //

    //partcile at RFQ end
    var Vend = document.getElementById("E_RFQ").value; //MV
    p.accelerate(Vend);
    document.getElementById("gamma_RFQ").value = p.gamma.toFixed(Ndigit); //
    document.getElementById("beta_RFQ").value = p.beta.toFixed(Ndigit); //
}

function Bstart() {
    var Ndigit = 4;
    var kk = 1.36;
    var E = document.getElementById("es").value / kk; // Es=k*v/r0

    var Z = document.getElementById("Z").value;
    var Q = document.getElementById("Q").value;
    var f = document.getElementById("mwfreq").value; //MHz
    var B = document.getElementById("B").value;
    var m = document.getElementById("modulation").value;
    var phis = document.getElementById("phs_s").value;

    var Vgb = document.getElementById("E_GB").value; //MV

    var GBcell = new RFQcell(Z, Q, Vgb, f, E, m, phis);

    GBcell.setFromB(B);

    document.getElementById("r0").value = GBcell.r0.toFixed(Ndigit) * 100; //m -> cm
    document.getElementById("V0").value = GBcell.V0.toFixed(Ndigit) * 1000; // MV->kV
    document.getElementById("L").value = GBcell.L.toFixed(Ndigit) * 100; //m->cm
    document.getElementById("lambda").value = GBcell.lambda.toFixed(Ndigit); //m
    document.getElementById("X").value = GBcell.X.toFixed(Ndigit); //
    document.getElementById("A").value = GBcell.A.toFixed(Ndigit); //
    document.getElementById("E0").value = GBcell.E0.toFixed(Ndigit); //
    document.getElementById("dW").value = GBcell.dW.toFixed(Ndigit); //
    document.getElementById("aperture").value = GBcell.a.toFixed(Ndigit) * 100; //m->cm

}

function V0start() {
    var Ndigit = 4;
    var kk = 1.36;
    var E = document.getElementById("es").value / kk; // Es=k*v/r0

    var Z = document.getElementById("Z").value;
    var Q = document.getElementById("Q").value;;
    var f = document.getElementById("mwfreq").value; //Mhz->hz
    var V0 = document.getElementById("V0").value;
    var m = document.getElementById("modulation").value;
    var phis = document.getElementById("phs_s").value;

    var Vgb = document.getElementById("E_GB").value; //MV
    var GBcell = new RFQcell(Z, Q, Vgb, f, E, m, phis);

    GBcell.setFromV(V0);

    document.getElementById("r0").value = GBcell.r0.toFixed(Ndigit) * 100; //m -> cm
    document.getElementById("B").value = GBcell.B.toFixed(Ndigit); //
    document.getElementById("L").value = GBcell.L.toFixed(Ndigit) * 100; //m->cm
    document.getElementById("lambda").value = GBcell.lambda.toFixed(Ndigit); //m
    document.getElementById("X").value = GBcell.X.toFixed(Ndigit); //
    document.getElementById("A").value = GBcell.A.toFixed(Ndigit); //
    document.getElementById("E0").value = GBcell.E0.toFixed(Ndigit); //
    document.getElementById("dW").value = GBcell.dW.toFixed(Ndigit); //
    document.getElementById("aperture").value = GBcell.a.toFixed(Ndigit) * 100; //m->cm


}

//particle object
function particle(Z, Q, V) {
    this.Z = Z;
    this.Q = Q;
    this.beta = 0;
    this.gamma = 1;
    this.restEnergy = Z * muc2;
    this.kineticEnergy = Q * V;
    this.totalEnergy = Z * muc2 + Q * V;
    this.accelerate(V);
}

particle.prototype.accelerate = function (V) {
    this.kineticEnergy = this.Q * V; //MeV
    this.restEnergy = this.Z * muc2; //MeV
    this.totalEnergy = this.restEnergy + this.kineticEnergy; //MeV
    this.gamma = this.kineticEnergy / this.restEnergy + 1;
    this.beta = Math.sqrt(1 - 1 / (this.gamma * this.gamma));
}

// RFQ cell object
function RFQcell(pZ, pQ, pV, f, Es, m, phis) {
    //L,B,r0,V0,betas,phis,psi,m,a,X,E0,

    //microwave related
    this.f = f; //microwave frequency, MHz
    this.lambda = c0 / (f * 1e6);
    this.phis = phis; //synchronous phase
    this.k = 0;

    this.synchronousParticle = new particle(pZ, pQ, pV);

    this.z = 0; // position
    this.L = 0; // cell length,m

    this.B = 0; // focusing efficiency
    this.r0 = 0; // cell-mid radius,m
    this.V0 = 0; // vane voltage,V
    this.Es = Es; //maximum surface field MV/m

    this.m = m; //modulation
    this.a = 0; //minimum aperture,m
    this.X = 0; //focusing coeificient
    this.A = 0; //accelearating coefficient

    this.E0 = 0; //average electric field
    this.dW = 0; //energy obtained

    this.ini();
    //control parameters:B,m,Es,a,V0
    // this.setFromB(B); //B,m,Es->r0,V0
    //this.setFromV(V0); //V,Es->B,r0
    //this.setOthers();

}

RFQcell.prototype.ini = function () {
    var b = this.synchronousParticle.beta;
    this.L = b * this.lambda / 2;
    this.k = Math.PI / this.L;
}

RFQcell.prototype.setFromB = function (B) {
    this.B = B;
    var p = this.synchronousParticle;
    //B, Es related
    var cc = p.Q / (p.Z * muc2); //MV^-1
    var r0 = cc * this.Es * this.lambda * this.lambda / B;
    var V0 = cc * this.Es * this.Es * this.lambda * this.lambda / B; //MV
    this.r0 = r0;
    this.V0 = V0;

    this.setOthers();

}

RFQcell.prototype.setFromV = function (V0) {

    this.V0 = V0 / 1000; //kV->MV
    var p = this.synchronousParticle;

    //B, Es related
    var cc = p.Q / (p.Z * muc2); //MV^-1
    var B = cc * this.Es * this.Es * this.lambda * this.lambda / this.V0; //MV
    var r0 = cc * this.Es * this.lambda * this.lambda / B;
    this.r0 = r0;
    this.B = B;

    this.setOthers();
}

RFQcell.prototype.setOthers = function () {
    var r0 = this.r0;
    var V0 = this.V0;
    var k = this.k;
    var m = this.m;

    var b0 = 4 + 4 * m * m - k * k * r0 * r0 - k * k * m * m * r0 * r0;
    var a2 = (-b0 + Math.sqrt(b0 * b0 + 64 * k * k * m * m * r0 * r0)) / (4 * k * k * m * m);
    var a = Math.sqrt(a2);
    //m related
    var I0ka = 1 + (k * a) * (k * a) / 4;
    var I0kma = 1 + (k * m * a) * (k * m * a) / 4;

    this.a = a;
    this.X = (I0ka + I0kma) / (m * m * I0ka + I0kma);
    this.A = (1 - this.X) / I0ka;
    this.E0 = this.A * V0 / this.L;
    this.dW = this.synchronousParticle.Q * this.E0 * this.L * Math.cos(this.phis * Math.PI / 360) * Math.PI / 4;
}

//