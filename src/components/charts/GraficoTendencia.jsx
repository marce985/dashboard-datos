import { useEffect, useRef } from "react";
import * as d3 from "d3";

function GraficoTendencia({ datos }) {

    //Referencia al elemento SVG
    const svgRef = useRef();

    //Dibujamos el gráfico cuando cambian los datos
    useEffect(() => {

        //Seleccionamos el contenedor SVG
        const svg = d3.select(svgRef.current);

        //Limpiamos el gráfico anterior
        svg.selectAll("*").remove();

        //Verificamos que existan datos
        if (
            !datos ||
            !Array.isArray(datos.labels)||
            !Array.isArray(datos.values)||            
            datos.labels.length === 0 ||
            datos.values.length === 0
        ) {
            return;
        }

        // Dimensiones del gráfico
        const ancho = 600;
        const alto = 350;

        const margen = {
            top: 30,
            right: 30,
            bottom: 50,
            left: 70
        };

        const anchoUtil = ancho - margen.left - margen.right;
        const altoUtil = alto - margen.top - margen.bottom;

        //Configuramos el SVG
        svg
            .attr("viewBox", `0 0 ${ancho} ${alto}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        //Creamos el área de dibujo
        const grupo = svg.append("g")
            .attr("transform", `translate(${margen.left},${margen.top})`);

        //Preparamos los datos
        const registros = datos.labels.map((mes, indice) => ({
            mes,
            valor: Number(datos.values[indice])

        })).filter(d => Number.isFinite(d.valor));

        if (registros.length === 0) return;

        //Escala horizontal para los meses
        const escalaX = d3.scalePoint()
            .domain(registros.map(d => d.mes))
            .range([0, anchoUtil]);

        //Escala vertical para las ventas
        const maximo = d3.max(registros, d => d.valor);

        const escalaY = d3.scaleLinear()
            .domain([0, maximo > 0 ? maximo * 1.1 : 1])
            .range([altoUtil, 0]);

        //dibujamos el eje horizontal
        grupo.append("g")
            .attr("transform", `translate(0,${altoUtil})`)
            .call(d3.axisBottom(escalaX));

        //dibujamos el eje vertical
        grupo.append("g")
            .call(d3.axisLeft(escalaY));

        //Creamos la línea
        const linea = d3.line()
            .x(d => escalaX(d.mes))
            .y(d => escalaY(d.valor));

        //Dibujamos la línea en el gráfico
        grupo.append("path")
            .datum(registros)
            .attr("fill", "none")
            .attr("stroke", "#2563eb")
            .attr("stroke-width", 3)
            .attr("d", linea);

        //dibujamos los puntos
        grupo.selectAll(".punto")
            .data(registros)
            .join("circle")
            .attr("class", "punto")
            .attr("cx", d => escalaX(d.mes))
            .attr("cy", d => escalaY(d.valor))
            .attr("r", 6)
            .attr("fill", "#2563eb")
            .append("title") 
            .text(d => `${d.mes}: $${d.valor.toLocaleString("es-MX")}`);
        
    }, [datos]);

    return (
        <div className="grafico-tendencia">
            <h3>Evolución de ventas mensuales</h3>
            <svg ref={svgRef} width="100%" height="350"></svg>

        </div>   
    );
}

export default GraficoTendencia;