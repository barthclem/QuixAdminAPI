/**
 * Created by aanu.oyeyemi on 01/04/2017.
 */
'use strict';

//let go raw
/**
 * @description this an implementation of service Locator
 */

function Locator(){
    this._registry = {};
};

Locator.prototype.register = function register(name, value) {
    if(this._registry[name]){
        throw new Error(`Object ${name} has been registered`);
    }

    this._registry[name] = value(this);
};

Locator.prototype.get = function (name) {
    console.log(name);
    if(!this._registry[name]){
        console.log(`${JSON.stringify(this._registry)}`);
        throw new Error(`Object ${name} is not registered`);
    }
    return this._registry[name];
};

module.exports = new Locator();
