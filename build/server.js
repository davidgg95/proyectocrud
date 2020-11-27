"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const menu_1 = require("./vistas/menu");
const lecturaTeclado_1 = require("./vistas/lecturaTeclado");
const Futbol_1 = require("./model/Futbol");
const database_1 = require("./database/database");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let n;
    let query;
    let nombre, estadio, longitud, ancho;
    let futbol = new Futbol_1.Futbol("", "", 0);
    yield setBD(false); // true BD local; false BD Atlas
    do {
        n = yield menu_1.menuFutbol();
        switch (n) {
            case 1:
                nombre = yield lecturaTeclado_1.leerTeclado('Introduzca el nombre único del club de futbol');
                estadio = yield lecturaTeclado_1.leerTeclado('Introduzca el estadio del campo de futbol');
                longitud = parseInt(yield lecturaTeclado_1.leerTeclado('Introduzca la longitud del campo de futbol'));
                ancho = parseInt(yield lecturaTeclado_1.leerTeclado('Introduzca el ancho del campo de futbol'));
                futbol = new Futbol_1.Futbol(nombre, estadio, longitud);
                try {
                    futbol.ancho = ancho;
                }
                catch (error) {
                    console.log(error);
                    futbol = new Futbol_1.Futbol("", "", 0);
                }
                break;
            case 2:
                try {
                    let area = futbol.area();
                    console.log(`Área del campo de futbol= ${area} cm2`);
                }
                catch (e) {
                    console.log("No ha entrado en la opción 1: " + e);
                }
                break;
            case 3:
                try {
                    let perimetro = futbol.perimetro();
                    console.log(`Perímetro del campo de futbol= ${perimetro} cm`);
                }
                catch (e) {
                    console.log("No ha entrado en la opción 1: " + e);
                }
                break;
            case 4:
                yield database_1.db.conectarBD();
                const dSchema = {
                    _nombre: futbol.nombre,
                    _estadio: futbol.estadio,
                    _longitud: futbol.longitud,
                    _ancho: futbol.ancho
                };
                const oSchema = new Futbol_1.Futbols(dSchema);
                yield oSchema.save()
                    .then((doc) => console.log('Salvado Correctamente: ' + doc))
                    .catch((err) => console.log('Error: ' + err));
                yield database_1.db.desconectarBD();
                break;
            case 5:
                yield database_1.db.conectarBD();
                nombre = yield lecturaTeclado_1.leerTeclado('Introduzca el nombre del club de futbol que va a cargar de la BD');
                yield Futbol_1.Futbols.findOne({ _nombre: nombre }, (error, doc) => {
                    if (error)
                        console.log(error);
                    else {
                        if (doc == null)
                            console.log('No existe');
                        else {
                            console.log('Existe: ' + doc);
                            futbol =
                                new Futbol_1.Futbol(doc._nombre, doc._estadio, doc._longitud);
                            futbol.ancho = doc._ancho;
                        }
                    }
                });
                yield database_1.db.desconectarBD();
                break;
            case 6:
                yield database_1.db.conectarBD();
                yield Futbol_1.Futbols.findOneAndUpdate({ _nombre: futbol.nombre }, {
                    _nombre: futbol.nombre,
                    _estadio: futbol.estadio,
                    _longitud: futbol.longitud,
                    _ancho: futbol.ancho
                }, {
                    runValidators: true
                })
                    .then(() => console.log('Modificado Correctamente'))
                    .catch((err) => console.log('Error: ' + err));
                yield database_1.db.desconectarBD();
                break;
            case 7:
                yield database_1.db.conectarBD();
                nombre = yield lecturaTeclado_1.leerTeclado('Introduzca el nombre del club de futbol que va a borrar de la BD');
                yield Futbol_1.Futbols.findOneAndDelete({ _nombre: nombre }, (err, doc) => {
                    if (err)
                        console.log(err);
                    else {
                        if (doc == null)
                            console.log(`No encontrado`);
                        else
                            console.log('Borrado correcto: ' + doc);
                    }
                });
                yield database_1.db.desconectarBD();
                break;
            case 8:
                console.log(`Nombre: ${futbol.nombre}`);
                console.log(`Estadio: ${futbol.estadio}`);
                console.log(`Longitud: ${futbol.longitud}`);
                console.log(`Ancho: ${futbol.ancho}`);
                break;
            case 0:
                console.log('\n--ADIÓS--');
                break;
            default:
                console.log("Opción incorrecta");
                break;
        }
    } while (n != 0);
});
const setBD = (local) => __awaiter(void 0, void 0, void 0, function* () {
    const bdLocal = 'futbol';
    const conexionLocal = `mongodb://localhost/${bdLocal}`;
    if (local) {
        database_1.db.cadenaConexion = conexionLocal;
    }
    else {
        const bdAtlas = 'proyectoFutbol';
        const userAtlas = yield lecturaTeclado_1.leerTeclado('Usuario BD Atlas');
        const passAtlas = yield lecturaTeclado_1.leerTeclado('Password BD Atlas');
        const conexionAtlas = `mongodb+srv://${userAtlas}:${passAtlas}@cluster0.bzm7u.mongodb.net/${bdAtlas}?retryWrites=true&w=majority`;
        database_1.db.cadenaConexion = conexionAtlas;
    }
});
main();
