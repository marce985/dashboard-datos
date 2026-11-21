import { useState, useEffect } from "react";


import TarjetaMetrica from "./components/TarjetaMetrica";
import TablaDatos from "./components/TablaDatos";
import PanelAnalitico from "./components/PanelAnalitico";

import GraficoTendencia from "./components/charts/GraficoTendencia";
import GraficoComparativo from "./components/charts/GraficoComparativo";

import {
  obtenerDatosVisualizacion,
  procesarDatos,
  formatearParaGrafico
} from "./services/dataService";

import "./App.css";

function App() {

  //estado para almacenar los datos procesados
  const [datos, setDatos] = useState(null);

  //estado para controlar la carga
  const [cargando, setCargando] = useState(true);

  //estado para controlar posibles errores
  const [error, setError] = useState(null);

  // Crear el estado del filtro
  const [mesSeleccionado, setMesSeleccionado] = useState("Todos");

  
    // Filtramos los registros según el mes seleccionado
    const registrosFiltrados = datos
      ? mesSeleccionado === "Todos"
        ? datos.registros
        : datos.registros.filter(
          registro => registro.mes === mesSeleccionado

        ) 
      : [];

    // Preparamos los datos filtrados para los gráficos
    const datosVentas = formatearParaGrafico(
      registrosFiltrados,
      "ventas"
    );

    const datosPedidos = formatearParaGrafico(
      registrosFiltrados,
      "pedidos"
    );

  //Calculamos las métricas según los registros filtrados
  const totalVentasFiltradas = registrosFiltrados.reduce(
    (total, registro) => total + Number(registro.ventas),
    0
  );

  const totalPedidosFiltrados = registrosFiltrados.reduce(
    (total, registro) => total + Number(registro.pedidos),
    0
  );

  const promedioVentasFiltradas = registrosFiltrados.length > 0
    ? totalVentasFiltradas / registrosFiltrados.length
    : 0;


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

      {/* Panel de filtros */}
      <section className="panel-filtros">
        <label htmlFor="filtro-mes">Seleccionar mes:</label>

        <select
        id="filtro-mes"
        value={mesSeleccionado}
        onChange={(evento) => setMesSeleccionado(evento.target.value)}
      >
        <option value="Todos">Todos los meses</option>

        {datos.registros.map((registro) =>(
          <option key={registro.id} value={registro.mes}>
            {registro.mes}
          </option>
        ))}
      </select>
      </section>

      <section className="metricas">

        <TarjetaMetrica
          titulo="Total de ventas"
          valor={`$${totalVentasFiltradas.toLocaleString("es-MX")}`}
          descripcion="Ventas del periodo seleccionado"
        />

        <TarjetaMetrica
          titulo="Total de pedidos"
          valor={totalPedidosFiltrados.toLocaleString("es-MX")}
          descripcion="Pedidos del periodo seleccionado"
        />

        <TarjetaMetrica
          titulo="Promedio de ventas"
          valor={`$${promedioVentasFiltradas.toLocaleString("es-MX", {
            maximumFractionDigits: 2
          })}`}

          descripcion="Promedio del periodo seleccionado"
        />
      
      </section>

      <section className="seccion-tabla">
        <TablaDatos datos={registrosFiltrados}/>
      </section>

      <section className="seccion-analitica">
        <PanelAnalitico />
      </section>

      {/* Sección de gráficos */}
      <section className="seccion-graficos">

        <GraficoTendencia datos={datosVentas} />

        <GraficoComparativo datos={datosPedidos} />

      </section>
    

    </div>
  );
}

export default App;


