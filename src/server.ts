import { menuFutbol } from './vistas/menu'
import { leerTeclado } from './vistas/lecturaTeclado'
import { Futbol, Futbols, fFutbol} from './model/Futbol'
import { db } from './database/database'

const main = async () => {
    let n: number
    let query: any

    let nombre: string,  estadio: string, longitud: number, ancho: number
    let futbol: Futbol = new Futbol("","",0)


    await setBD(false) // true BD local; false BD Atlas

    do {
        n = await menuFutbol()

        switch(n){
            case 1:
                nombre = await leerTeclado('Introduzca el nombre único del club de futbol')
                estadio =  await leerTeclado('Introduzca el estadio del campo de futbol')
                longitud =  parseInt( await leerTeclado('Introduzca la longitud del campo de futbol'))
                ancho =  parseInt( await leerTeclado('Introduzca el ancho del campo de futbol'))
                futbol = new Futbol(nombre, estadio, longitud)
                try {
                    futbol.ancho = ancho
                }catch(error){
                    console.log(error)
                    futbol = new Futbol("","",0)
                }
                break
            case 2:
                try{
                    let area = futbol.area()
                    console.log(`Área del campo de futbol= ${area} cm2`)
                }catch (e){
                    console.log("No ha entrado en la opción 1: " + e)
                }
                break
            case 3:
                try{
                    let perimetro = futbol.perimetro()
                    console.log(`Perímetro del campo de futbol= ${perimetro} cm`)
                }catch (e){
                    console.log("No ha entrado en la opción 1: " + e)
                }
                break
            case 4:
                await db.conectarBD()
                const dSchema = {
                    _nombre: futbol.nombre,
                    _estadio: futbol.estadio,
                    _longitud: futbol.longitud,
                    _ancho: futbol.ancho
                }
                const oSchema = new Futbols(dSchema)
                await oSchema.save()
                .then( (doc) => console.log('Salvado Correctamente: '+ doc) )
                .catch( (err: any) => console.log('Error: '+ err)) 
                await db.desconectarBD()
                break
            case 5:
                await db.conectarBD()
                nombre = await leerTeclado('Introduzca el nombre del club de futbol que va a cargar de la BD')

                await Futbols.findOne( {_nombre: nombre}, 
                    (error, doc: any) => {
                        if(error) console.log(error)
                        else{
                            if (doc == null) console.log('No existe')
                            else {
                                console.log('Existe: '+ doc)
                                futbol = 
                                    new Futbol(doc._nombre, doc._estadio, doc._longitud)
                                futbol.ancho = doc._ancho 
                            }
                        }
                    } )
                await db.desconectarBD()
                break
            case 6:
                await db.conectarBD()
                await Futbols.findOneAndUpdate( 
                    { _nombre: futbol.nombre }, 
                    {
                        _nombre: futbol.nombre,
                        _estadio: futbol.estadio,
                        _longitud: futbol.longitud,
                        _ancho: futbol.ancho

                    },
                    {
                        runValidators: true 
                    }  
                )                
                .then(() => console.log('Modificado Correctamente') )
                .catch( (err) => console.log('Error: '+err))
                await db.desconectarBD()
                break
            case 7:
                await db.conectarBD()
                nombre = await leerTeclado('Introduzca el nombre del club de futbol que va a borrar de la BD')
                await Futbols.findOneAndDelete(
                    {_nombre: nombre},
                    (err: any, doc) => {
                        if(err) console.log(err)
                        else{
                            if (doc == null) console.log(`No encontrado`)
                            else console.log('Borrado correcto: '+ doc)
                        }
                    })
                await db.desconectarBD()
                break
            case 8:
                console.log(`Nombre: ${futbol.nombre}`)
                console.log(`Estadio: ${futbol.estadio}`)
                console.log(`Longitud: ${futbol.longitud}`)
                console.log(`Ancho: ${futbol.ancho}`)                            
                break
            case 0:
                console.log('\n--ADIÓS--')
                break
            default:
                console.log("Opción incorrecta")
                break
        }
    }while (n != 0)
}

const setBD = async (local: boolean) => {
    
    const bdLocal = 'futbol'

    const conexionLocal = `mongodb://localhost/${bdLocal}`
    if (local) {
        db.cadenaConexion = conexionLocal
    }else{
        const bdAtlas = 'proyectoFutbol'
        const userAtlas = await leerTeclado('Usuario BD Atlas')
        const passAtlas = await leerTeclado('Password BD Atlas')
        const conexionAtlas =  
        `mongodb+srv://${userAtlas}:${passAtlas}@cluster0.bzm7u.mongodb.net/${bdAtlas}?retryWrites=true&w=majority`
        db.cadenaConexion = conexionAtlas
    }
}

main()