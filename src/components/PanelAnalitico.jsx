import { useState } from "react";
import { obtenerDatosClimaticos } from "../services/dataService";

function PanelAnalitico(){

    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    async function consultarDatos(){

        setCargando(true);
        setError(null);

        
        try {

            const respuesta = await obtenerDatosClimaticos(
                19.4326,
                -99.1332
            );

            setDatos(respuesta.current);

        }catch (error) {

            setError("No fue posible obtener los datos meteorológicos.");

            console.error("Error al consultar la API:", error);

        }finally {

            setCargando(false);
        }
    }

    // pegar return
    return (
        <div className="panel-analitico">

            <h2>Panel de Análisis Meteorológico</h2>

            <p>
                Consulta información meteorológica en tiempo real.
            </p>

            <button
                onClick={consultarDatos}
                disabled={cargando}
            >
                {cargando ? "Analizando datos..." : "Consultar datos"}
            </button>

            {cargando && (
                <p>Obteniendo información de la API...</p>

            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {datos &&(
                <div className="datos-climaticos">

                    <div className="tarjeta-clima">
                        <h3>Temperatura</h3>
                        <p>{datos.temperature_2m} °C</p>
                    </div>

                    <div className="tarjeta-clima">
                        <h3>Humedad</h3>
                        <p>{datos.relative_humidity_2m} %</p>

                    </div>

                    <div className="tarjeta-clima">
                        <h3>Velocidad del viento</h3>
                        <p>{datos.wind_speed_10m} km/h</p>

                    </div>

                </div>    
            )}
        </div>
    );


}

export default PanelAnalitico; 