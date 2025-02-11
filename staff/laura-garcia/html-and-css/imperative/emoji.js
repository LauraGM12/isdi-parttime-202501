debugger
// Crear y configurar el canvas
document.body.style.background = '#000'; // Fondo oscuro para resaltar el pixel art
var canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 200;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

// Definir tamaño de píxel
var totalPixels = 15; // Ajustado al tamaño real del pixelMap
var pixelSize = canvas.width / totalPixels;

// Mapa del emoticono (1 = color dorado, 2 = blanco, 0 = transparente)
var pixelMap = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 1],
    [1, 0, 2, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0]
];

// Colores
var defaultColor = '#FFD700'; // Amarillo dorado
var whiteColor = '#FFFFFF'; // Blanco para las gafas (corregido el nombre de la variable)
var strokeColor = '#000000';  // Negro para bordes

// Dibujar el emoticono
for (let y = 0; y < pixelMap.length; y++) {
    for (let x = 0; x < pixelMap[y].length; x++) {
        if (pixelMap[y][x] === 1) {
            ctx.fillStyle = defaultColor;
        } else if (pixelMap[y][x] === 2) {
            ctx.fillStyle = whiteColor;
        } else {
            continue;
        }
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        
        // Contorno negro
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
}

