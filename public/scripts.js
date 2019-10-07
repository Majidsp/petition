(function(){

    const context = document.getElementById('canv').getContext('2d');
    const drawBox = document.getElementById('canv');
    let lastX;
    let lastY;
    let mousePressed = false;
    const signInput = document.getElementById('signInput');

    //Events
    drawBox.addEventListener('mousedown', e => {
        mousePressed = true;
        draw(e.pageX - drawBox.offsetLeft, e.pageY - drawBox.offsetTop, false);
    });

    drawBox.addEventListener('mousemove', e => {
        if(mousePressed) {
            draw(e.pageX - drawBox.offsetLeft, e.pageY - drawBox.offsetTop, true);
        }
    });

    drawBox.addEventListener('mouseup', () => {
        mousePressed = false;
    });

    drawBox.addEventListener('mouseleave', () => {
        mousePressed = false;
    });

    const draw = (x, y, mouseDown) => {
        if(mouseDown) {
            context.strokeStyle = 'white';
            context.lineWidth = 1;
            context.lineJoin = 'round';
            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(x, y);
            context.stroke();
            let dataURL = drawBox.toDataURL();
            signInput.value = dataURL;
        }
        lastX = x;
        lastY = y;
    };

})();
