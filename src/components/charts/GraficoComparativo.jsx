import { useEffect, useRef } from "react";
import * as d3 from "d3";

function GraficoComparativo({ datos }) {

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
            !Array.isArray(datos.labels) ||
            !Array.isArray(datos.values) ||
            datos.labels.length === 0 ||
            datos.values.length === 0

        ) {
            return;     
        }

        //Dimensiones del gráfico
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

        // Configuramos el SVG
        svg

            .attr("viewBox", `0 0 ${ancho} ${alto}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        //Creamos el área de dibujo
        const grupo = svg.append("g")
            .attr("transform", `translate(${margen.left}, ${margen.top})`);

        //Preparamos los datos
        const registros = datos.labels.map ((mes, indice) => ({
            mes,
            valor: Number(datos.values[indice])

        })).filter(d => Number.isFinite(d.valor));

        if (registros.length === 0) return;

        // Escala horizontal para los meses
        const escalaX = d3.scaleBand()
            .domain(registros.map(d => d.mes))
            .range([0, anchoUtil])
            .padding(0.2);

        // Escala vertical para las ventas
        const maximo = d3.max(registros, d => d.valor);
        
        const escalaY = d3.scaleLinear()
            .domain([0, maximo > 0 ? maximo * 1.1 : 1])
            .range([altoUtil, 0]);

        //Dibujamos el eje horizontal
        grupo.append("g")
            .attr("transform", `translate(0,${altoUtil})`)
            .call(d3.axisBottom(escalaX));

        //Dibujamos el eje vertical
        grupo.append("g")
            .call(d3.axisLeft(escalaY));

       //Dibujamos las barras
       grupo.selectAll(".barra")
        .data(registros)
        .join("rect")
        .attr("class", "barra")
        .attr("x", d => escalaX(d.mes))
        .attr("y", d => escalaY(d.valor))
        .attr("width",escalaX.bandwidth())
        .attr("height", d => altoUtil - escalaY(d.valor))
        .attr("fill", "#16a34a")
        .append("title")
        .text(d => `${d.mes}: ${d.valor.toLocaleString("es-MX")} pedidos`);

}, [datos]);

return (
    <div className="grafico-comparativo">
        <h3>Comparación de pedidos mensuales</h3>
        <svg ref={svgRef} width="100%" height="350"></svg>

    </div>
);

}

export default GraficoComparativo;

