var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();

window.requestAnimationFrame(draw);


function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function drawCircle(x, y, radius, a) {
    ctx.beginPath();
    const grd = ctx.createRadialGradient(x, y, 3, x, y, radius);
    const color = hsv2rgb(a/(Math.PI),1,1)//{r: 255, g: 0, b: 255};

    grd.addColorStop(0.5, "rgba("+color.r+","+color.g+","+color.b+", 1)");
    grd.addColorStop(1, "rgba("+color.r+","+color.g+","+color.b+", 0)");

    grd.addColorStop(0, "white");

    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = grd;

    ctx.fill()
}


function generateRow(phi, arc) {
    const innerCircumference = Math.sin(phi)*Math.PI*2
    const pointCount = Math.floor(innerCircumference / arc)
    const arr = []

    for (let i = 0; i < pointCount; i++) {
        arr.push([phi, (i/pointCount)*Math.PI*2])
    }

    return arr
}

let points = []

for (let i = 0; i<20; i++) {
    points = points.concat(generateRow(Math.PI*2*i/20, Math.PI/10))
}

iso_points = [
    [1.5707963267949, 0.553583753299266],
        [1.5707963267949, -0.553583753299266],
        [1.5707963267949, -2.58800890029053],
        [1.5707963267949, 2.58800890029053],
        [0.553583753299266, 0],
        [-0.553583753299266, 0],
        [2.58800890029053, 0],
        [-2.58800890029053, 0],
        [1.01721257349563, 1.5707963267949],
        [2.12438008009416, 1.5707963267949],
        [2.12438008009416, -1.5707963267949],
        [1.01721257349563, -1.5707963267949],
]

function draw() {
    ctx.clearRect(0, 0, 1000, 1000);

    const time = Date.now();

    const a = (time / 2900) % (2*Math.PI)
    const b = (time / 3000) % (2*Math.PI)
    const g = 0

    points = points.sort((a, b) => Math.sin(a[0]) * Math.sin(a[1]) - Math.sin(b[0]) * Math.sin(b[1]))

    for (const point of points) {
        const x = 300 * Math.sin(point[0]) * Math.cos(point[1])
        const y = 300 * Math.sin(point[0]) * Math.sin(point[1])
        const z = 300 * Math.cos(point[0])


        const sin = Math.sin
        const cos = Math.cos

        const tx = cos(b)*cos(g)*x + (sin(a)*sin(b)*cos(g) - cos(a)*sin(g))*y + (cos(a)*sin(b)*cos(g) + sin(a)*sin(g))*z
        const ty = cos(b)*sin(g)*x + (sin(a)*sin(b)*sin(g) + cos(a)*cos(g))*y + (cos(a)*sin(b)*sin(g) - sin(a)*cos(g))*z

        drawCircle(tx+550, ty+350, 10, (point[0]+point[1]+(x/300)+1)/3)
    }

    const grd = ctx.createLinearGradient(550, 0, 600, 0)
    grd.addColorStop(0, "rgba(0,0,0,0)")
    grd.addColorStop(1, "black")

    ctx.fillStyle = grd
    ctx.fillRect(550,0,50,700)

    window.requestAnimationFrame(draw);
}