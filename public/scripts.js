(function(){
    const context = document.getElementById('canv').getContext('2d');
    context.strokeStyle = '#900';
    context.beginPath();
    context.moveTo(100, 0);
    context.lineTo(0, 200);
    context.moveTo(100, 0);
    context.lineTo(200, 200);
    context.lineTo(0, 200);
    context.stroke();



})();
