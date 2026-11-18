import { useState, useEffect } from "react";

import TarjetaMetrica from "./components/TarjetaMetrica";
import TablaDatos from "./components/TablaDatos";
import PanelAnalitico from "./components/PanelAnalitico";

import {
  obtenerDatosVisualizacion,
  procesarDatos
} from "./services/dataService";

import "./App.css";

function App() {

  //estado para almacenar los datos procesados
  const [datos, setDatos] = useState(null);

  //estado para controlar la carga
  const [cargando, setCargando] = useState(true);

  //estado para controlar posibles errores
  const [error, setError] = useState(null);

  // obtener los datos cuando se carga la aplicación
  useEffect(() => {

    async function cargarDatos(){
      try {
        const respuesta = await obtenerDatosVisualizacion();

        const resultado = procesarDatos(respuesta);

        setDatos(resultado);

      } catch (error) {
        setError("No fue posible cargar los datos.");
        console.error(error);


    
      }  finally {
        setCargando(false);

      } 
     }

     cargarDatos();
  }, []);

  //mostrar mensaje mientras se cargan los datos
  if (cargando){
    return <h2>Cargando informacion...</h2>;

  }

  //mostrar mensaje si ocurre un error
  if (error) {
    return <h2>{error}</h2>;
  }

  return (

    <div className="aplicacion">

      <header className="encabezado">
        <h1>Dashboard de Análisis de Datos</h1>
        <p>Visualización de ventas y pedidos mensuales</p>

      </header>
      <section className="metricas">

        <TarjetaMetrica
          titulo="Total de ventas"
          valor={`$${datos.totalVentas.toLocaleString("es-MX")}`}
          descripcion="Ventas acumuladas"
        />

        <TarjetaMetrica
          titulo="Total de pedidos"
          valor={datos.totalPedidos.toLocaleString("es-MX")}
          descripcion="Pedidos registrados"
        />

        <TarjetaMetrica
          titulo="Promedio de ventas"
          valor={`$${datos.promedioVentas.toLocaleString("es-MX", {
            maximumFractionDigits: 2
          })}`}

          descripcion="Promedio mensual"
        />
      

      </section>

      <section className="seccion-tabla">
        <TablaDatos datos={datos.registros}/>
      </section>

      <section className="seccion-analitica">
        <PanelAnalitico />
      </section>
    

    </div>
  );
}

export default App;


