//My slice
//return a shallow copy of a portion of an array into a new array object from start to end (end not included) where start and end represent the index of items in the array. 
//original array not modified

var controlArray = ['perro', 'gato', 'pez', 'conejo', 'vaca', 'oveja'];
var testArray = ['perro', 'gato', 'pez', 'conejo', 'vaca', 'oveja'];
var controlElement = controlArray.slice(2);

console.log(controlArray);
console.log(controlElement);
//expected output: ['pez', 'conejo', 'vaca', 'oveja']

function mySlice (array, j) {
    var array1 = [...array]
    for(var i = j; i < array.length; i++){
        array1[i - j] = array1[i] 
    }
    array1.length = array1.length - j;
    return array1;
}
var testElement = mySlice(testArray, 2)
console.log(testArray)
console.log(testElement)

for(var i = 0; i < testElement.length; i++) {
    console.assert(testElement[i] === controlElement[i], `Error: la shallow copy no coincide.`)
}
for(var i = 0; i < controlArray.length; i++) {
    console.assert(controlArray[i] === testArray[i], `Error at index ${i}: ${testArray[i]} !== ${controlArray[i]}.`);
    };