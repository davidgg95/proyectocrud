import { leerTeclado } from '../vistas/lecturaTeclado'

export const menuFutbol = async () => {
    let n: number
    console.log('\n')
    console.log('1.- Crear Equipo Futbol')
    console.log('2.- Área')
    console.log('3.- Perímetro')
    console.log('4.- Guardar en BD')
    console.log('5.- Cargar Equipo Futbol de la BD')
    console.log('6.- Modificar Equipo Futbol de la BD')
    console.log('7.- Borrar Equipo Futbol de la BD')
    console.log('8.- Mostrar Equipo Futbol')
    console.log('0.- SALIR')
    n = parseInt( await leerTeclado('--OPCIÓN--') )
    return n
}