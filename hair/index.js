function max(a, b) {
    return a > b ? a : b;
}
function min(a, b) {
    return a < b ? a : b;
}

var canvas = document.getElementById("graph"),
    context = canvas.getContext("2d"),
    graph = [
        [false, true, true, true],
        [true, false, false, true],
        [true, false, false, false],
        [true, true, false, false]
    ],
    pos = [],
    phi = [],
    w = [],
    wForce = [],
    glen = 15,
    rad = 50,
    movement = 0,
    const1 = 5 * 1e4,
    const2 = 0.05,
    const3 = 100,
    eps = 1e-3,
    fps = 30;

const L = 20;

var drawPoint = function(x, y) {
    context.beginPath();
    context.arc(x, y, 1.2, 0, 2 * Math.PI, false);
    context.fillStyle = "black";
    context.fill();
};

var drawLine = function(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = "gray";
    context.stroke();
};

var getX = function(i) {
    return (
        rad * Math.cos(2 * Math.PI / glen * i) +
        canvas.width / 2 +
        Math.random() -
        0.5
    );
};

var getY = function(i) {
    return (
        rad * Math.sin(2 * Math.PI / glen * i) +
        canvas.height / 2 +
        Math.random() -
        0.5
    );
};

var handleForces = function() {
    for (let i = glen - 1; i > 0; i -= 1) {
        let angleSum = 0;
        for (let j = 0; j < i; j += 1) angleSum += phi[j];
        wForce[i] = 9.8 / 2 * Math.cos(Math.PI / 2 - angleSum);
        if (i != glen - 1)
            wForce[i] += wForce[i + 1] * Math.cos(Math.PI - phi[1]);
    }

    for (let i = 1; i < glen; i += 1) {
        w[i] += wForce[i] / fps;
        w[i] *= 0.9;
    }

    for (let i = 0; i < glen; i += 1) {
        phi[i] += w[i] / fps;
    }

    for (let i = 1; i < glen; i += 1) {
        pos[i][0] = pos[i - 1][0] + Math.cos(phi[i]) * L;
        pos[i][1] = pos[i - 1][1] + Math.sin(phi[i]) * L;
    }

    console.log("phi", phi);
};

var render = function() {
    console.log("Rendering...");
    const dx = canvas.width / 2;
    const dy = canvas.height / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < glen - 1; i++)
        drawLine(
            pos[i][0] + dx,
            dy - pos[i][1],
            pos[i + 1][0] + dx,
            dy - pos[i + 1][1]
        );

    for (var i = 0; i < glen; i++) drawPoint(pos[i][0] + dx, dy - pos[i][1]);
};

var draw = function() {
    // var midx = 0,
    //     midy = 0;

    //count();
    handleForces();

    // var mix = canvas.width / 2,
    //     maX = canvas.width / 2,
    //     miy = canvas.height / 2,
    //     may = canvas.height / 2;
    //
    // for (var i = 0; i < glen; i++) {
    //     mix = min(mix, pos[i][0]);
    //     maX = max(maX, pos[i][0]);
    //     miy = min(miy, pos[i][1]);
    //     may = max(may, pos[i][1]);
    // }
    //
    // midx = canvas.width / 2 - (maX + mix) / 2;
    // midy = canvas.height / 2 - (may + miy) / 2;
    //
    // for (var i = 0; i < glen; i++) {
    //     pos[i][0] += midx;
    //     pos[i][1] += midy;
    // }
    //
    // var mix = canvas.width / 2,
    //     maX = canvas.width / 2,
    //     miy = canvas.height / 2,
    //     may = canvas.height / 2;
    //
    // for (var i = 0; i < glen; i++) {
    //     mix = min(mix, pos[i][0]);
    //     maX = max(maX, pos[i][0]);
    //     miy = min(miy, pos[i][1]);
    //     may = max(may, pos[i][1]);
    // }

    // if (maX > canvas.width || mix < 0 || may > canvas.height || miy < 0) {
    //     const3 *= 0.995;
    //     const1 *= 0.995;
    //     //console.log();
    // } else if (
    //     (maX < canvas.width * 4 / 5 || mix > canvas.width * 1 / 5) &&
    //     (may < canvas.height * 4 / 5 || miy > canvas.height * 1 / 5)
    // ) {
    //     const3 /= 0.999;
    //     const1 /= 0.999;
    //     console.log(const3, maX, mix);
    // }
    render();
};

var main = function() {
    window.setInterval(() => draw(), 1000 / fps);
};

var start = function() {
    var input = document.getElementById("input").value;
    input = input.split("\n");
    glen = parseInt(input[0]);

    pos = new Array(glen);
    phi = new Array(glen);
    w = new Array(glen);
    wForce = new Array(glen);
    for (let i = 0; i < glen; i += 1) {
        pos[i] = [0, -i * L];
        phi[i] = -Math.PI / 2;
        w[i] = 0;
        wForce[i] = 0;
    }

    render();

    console.log("started...", Math.PI, pos, phi, wForce);

    main();
};
