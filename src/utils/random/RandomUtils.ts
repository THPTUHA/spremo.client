// export const shuffle = (array: any[]) => {
//     // see more Knuth shuffle
//     var current_index = array.length;
//     var random_index = - 1;

//     while (0 !== current_index) {

//         // chon 1 phan tu ngau nhien de doi cho
//         random_index = Math.floor(Math.random() * current_index);
//         current_index--;

//         // swap 2 phan tu
//         [array[current_index], array[random_index]] = [
//             array[random_index], array[current_index]];
//     }

//     return array;
// }


export const pickSubArray = (array: any[], k: number) => {
    if (array.length < k) {
        console.log("can not pick more elements than array size");
        return [];
    }

    var module = Math.floor(array.length / k) + 1;

    var result = [];
    for (let i = 0; i < array.length; i++) {
        if ([0, 1].indexOf(i % module) > -1) {
            result.push(array[i]);
        }
    }

    return result;
}