var arrTest = [1, 2, 3, 4]
var arrControl = [1, 2, 3, 4]
var thingToPush = 5


//función flors con errata
    /*function myPush(array, elementToPush) {
        array[array.length] = elementToPush;
        return elementToPush
    }*/

//función corregida
function myPush(array, elementToPush) {
    array[array.length] = elementToPush;  // Agrega el elemento al final
    return array.length;  // Cambiado para que devuelva la longitud // Devuelve la nueva longitud del array
}

//TESTEO
var result1 = arrControl.push(thingToPush); // Usamos el push original
var result2 = myPush(arrTest, thingToPush); // Usamos nuestra versión

// Test 1: Verificar que devuelven la misma longitud
console.assert(result1 === result2, 'Error: both functions should return the same length');


// Test 2: Verificar que los arrays son iguales después de la operación
for (var i = 0; i < arrControl.length; i++) {
    console.assert(arrTest[i] === arrControl[i], `Error at index ${i}: ${arrTest[i]} !== ${arrControl[i]}`);
}

