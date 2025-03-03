function myJoin(separator, array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        if (i > 0) {
            result += separator;
        }
        result += array[i];
    }
    return result;
}
var names = ['Dani','Juan']
myJoin("+", names)


//codigo dani
var wordArray = ["Dani", "Juan"]; //declaramos nuestro array

function myJoin (arr, separator = ",") {
    if (arr.length === 0) return " ";
    var result = arr[0];
    for (var i = 1; i < arr.length; i++) {
        result += separator;
        result += arr[i]
    }
    
    return result;
}
myJoin(wordArray, " ");