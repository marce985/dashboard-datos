function TablaDatos({ datos }) {
    return (
        <div className="tabla-contenedor">
            <h2>Detalle de ventas mensuales</h2>

            <table>
                <thead>
                    <tr>
                        <th>Mes</th>
                        <th>Ventas</th>
                        <th>Pedidos</th>
                                           
                    </tr>
                </thead>

                <tbody>
                    {datos.map((registro) =>(
                    <tr key={registro.id}>
                        <td>{registro.mes}</td>
                        <td>
                            ${registro.ventas.toLocaleString("es-MX")}

                        </td>
                        <td>{registro.pedidos}</td>


                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default TablaDatos;