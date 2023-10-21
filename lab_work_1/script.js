var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');

var isDrawing = false; 
var startX, startY;    

canvas.addEventListener('mousedown', function (e) {
    isDrawing = true;
    startX = e.clientX - canvas.getBoundingClientRect().left;
    startY = e.clientY - canvas.getBoundingClientRect().top;
});

canvas.addEventListener('mouseup', function (e) {
    if (isDrawing) {
        isDrawing = false;
        var endX = e.clientX - canvas.getBoundingClientRect().left;
        var endY = e.clientY - canvas.getBoundingClientRect().top;

        var width = Math.abs(endX - startX);
        var height = Math.abs(endY - startY);

        var centerX = (startX + endX) / 2;
        var centerY = (startY + endY) / 2;

        ctx.fillStyle = '#FD7E14'; 
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (isDrawing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var endX = e.clientX - canvas.getBoundingClientRect().left;
        var endY = e.clientY - canvas.getBoundingClientRect().top;

        var width = Math.abs(endX - startX);
        var height = Math.abs(endY - startY);

        var centerX = (startX + endX) / 2;
        var centerY = (startY + endY) / 2;

        ctx.fillStyle = '#FFC107';
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
    }
});

canvas.addEventListener('mouseout', function () {
    isDrawing = false;
});
