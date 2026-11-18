import datos from "../datos.json";
import apiClient from "./apiClient";

//función para obtener los datos del archivo JSON
export async function obtenerDatosVisualizacion() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(datos);
        }, 1000);
    });
}

//función para procesar los dtos
export function procesarDatos(datos) {

    //filtramos los registros que contienen información válida
    const registrosValidos = datos.filter((registro) =>
         registro.mes &&
        Number.isFinite(Number(registro.ventas)) &&
        Number.isFinite(Number(registro.pedidos))

    );

    //preparamos y damos formato a los registros
    const registros = registrosValidos.map((registro) => ({
        id: registro.id,
        mes: registro.mes.trim(),
        ventas: Number(registro.ventas),
        pedidos: Number(registro.pedidos) 
    }));

    //calculamos el total de ventas
    const totalVentas = registros.reduce(
        (total, registro) => total + registro.ventas,
        0
    );

    //calculamos el total de pedidos
    const totalPedidos = registros.reduce(

        (total, registro) => total + registro.pedidos,
        0
    );

    // calculamos el promedio de ventas
    const promedioVentas = registros.length > 0 ? totalVentas / registros.length : 0;

    //devolvemos la información procesada
    return {
        totalVentas,
        totalPedidos,
        promedioVentas,
        registros
    };

}

//función para obtener datos meteorológicos desde una API externa
export async function obtenerDatosClimaticos(latitud, longitud) {
    const respuesta = await apiClient.get("/forecast", {
        params: {
            latitude: latitud,
            longitude: longitud,
            current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
            timezone: "auto"
        }
    });

    //Extraemos los datos recibidos de la API
    return respuesta.data;
    
}
