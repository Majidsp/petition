(function(){

    const context = document.getElementById('canv').getContext('2d');
    const drawBox = document.getElementById('canv');
    let lastX;
    let lastY;
    let mousePressed = false;
    const submitBtn = document.getElementById('submitBtn');
    const signInput = document.getElementById('signInput');
    const inputs = document.getElementsByTagName('input');

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

    submitBtn.addEventListener('click', () => {
        inputValidator();
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

    const inputValidator = () => {
        for(let i = 0; i < inputs.length; i++) {
            if(inputs[i].validity.valid == false) {
                alert('Sth went wrong');
                break;
            }
        }
    };

})();
