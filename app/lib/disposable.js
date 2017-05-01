/**
 * Created by barthclem on 4/19/17.
 */
'use strict';

module.exports = function anony(inputString, inputArray) {

    let stringElems = inputString.split(/,/);
    let result = inputArray || [];
    let index = result.length || 1;
    stringElems.forEach(elem => {
        let temp = elem.split(/:/);
        console.log("Temp =>"+ temp);
        result.push({id : index++, title : (()=>{return temp[1].replace(/'/g, '').trim()})() })
    });

    return result;
};
