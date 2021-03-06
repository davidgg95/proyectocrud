import {Schema, model } from 'mongoose'

export class Futbol{
    private _nombre: string
    private _estadio: string
    private _longitud: number
    private "_ancho": number

    constructor(_nombre: string, _estadio: string, _longitud: number
        ){
        this._nombre = _nombre
        this._estadio = _estadio
        this._longitud = _longitud
    }
    get nombre(){
        return this._nombre
    }

    get estadio(){
        return this._estadio
    }

    get longitud(){
        return this._longitud
    }

    get ancho(){
        return this._ancho
    }

    set ancho(_ancho: number){
        if (_ancho <= 0){
            throw "Ancho incorrecto, debe ser > 0"
        }
        this._ancho = _ancho
    }
    
    perimetro(){
        let perimetro: number
        perimetro = 2*this._longitud+2*this._ancho
        if (perimetro == 0){
            throw "Campo de futbol no creado"
        }
        return perimetro
    }

    area(){
        if (isNaN(this._ancho)){
            throw "Ancho no asignada"
        }
        return this._longitud*this._ancho
    }
}

// Definimos el type

export type fFutbol = {
    _nombre: string,
    _estadio: string,
    _longitud: number,
    _ancho: number
}

// Definimos el Schema
const futbolSchema = new Schema({
    _nombre:  {
        type: String,
        unique: true 
    },
    _estadio: String,
    _longitud: Number,
    _ancho: Number
})

// La colección de la BD: vehiculos (Plural siempre)
export const Futbols = model('futbol', futbolSchema)