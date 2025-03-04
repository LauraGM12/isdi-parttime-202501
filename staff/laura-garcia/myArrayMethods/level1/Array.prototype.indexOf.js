var arr = ['hola', 'qué', 'tal', '?'];
var index1 = arr.indexOf('qué');  
var index2 = arr.indexOf('adiós'); 

console.log(index1); // 1 (la palabra "qué" está en la posición 1)
console.log(index2); // -1 (el elemento "adiós" no está en el array)


function myIndexOf(arr, element, fromIndex = 0) {
    for (var i = fromIndex; i < arr.length; i++) {
        if (arr[i] === element) {
            return i; // Si encontramos el elemento, devolvemos su índice
        }
    }
    return -1; // Si no lo encontramos, devolvemos -1
}

//TESTEO
var controlArray = ['hola', 'qué', 'tal', '?'];
var searchElement = 'qué';
var missingElement = 'adiós';

// Ejecutar función nativa `indexOf()`
var controlIndex = controlArray.indexOf(searchElement);
var controlIndexMissing = controlArray.indexOf(missingElement);
var controlIndexFrom = controlArray.indexOf(searchElement, 1);

// Ejecutar nuestra función `myIndexOf()`
var testIndex = myIndexOf(controlArray, searchElement);
var testIndexMissing = myIndexOf(controlArray, missingElement);
var testIndexFrom = myIndexOf(controlArray, searchElement, 1);

console.info('running tests')

// Test 1: Verificar que los índices coincidan cuando el elemento está presente
console.assert(testIndex === controlIndex, `Error: Expected ${controlIndex}, but got ${testIndex}`);

// Test 2: Verificar que devuelvan `-1` si el elemento no está
console.assert(testIndexMissing === controlIndexMissing, `Error: Expected ${controlIndexMissing}, but got ${testIndexMissing}`);

// Test 3: Verificar `fromIndex`
console.assert(testIndexFrom === controlIndexFrom, `Error: Expected ${controlIndexFrom}, but got ${testIndexFrom}`);
