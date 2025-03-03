var controlArray = ["uno", "dos", "tres","cuatro"]
var testArray = ["uno", "dos", "tres","cuatro"]
var controlElement
var testElement


controlElement = controlArray.reverse()

console.log(controlArray);
controlArray.reverse();
console.log(controlArray);
// Array ["cuatro", "tres", "dos", "uno"]


function myReverse(arr) {
    var left = 0;
    var right = arr.length - 1;

    while (left < right) {
        var temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        left++;
        right--;
    }

    return arr;
}

testElement = myReverse(testArray);