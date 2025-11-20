const clientes = [
  { id: 1, nombre: "PRUEBA 1", nit: "12345601" },
  { id: 2, nombre: "PRUEBA 2", nit: "48651321" },
  { id: 3, nombre: "PRUEBA 3", nit: "55599988" }
];

export default function ClientList({ onSelect }) {

  return (
    <div>
      <h2>Lista de Clientes</h2>

      {clientes.map(c => (
        <div key={c.id} style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 5
        }}>
          <span>{c.nombre}</span>
          <button onClick={() => onSelect(c)}>Generar Factura</button>
        </div>
      ))}
    </div>
  );
}
