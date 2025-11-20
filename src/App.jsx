import { useState } from "react";
import ClientList from "./components/ClientList";
import FacturaPDF from "./components/FacturaPDF";

function App() {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      {!clienteSeleccionado ? (
        <ClientList onSelect={setClienteSeleccionado} />
      ) : (
        <FacturaPDF cliente={clienteSeleccionado} onBack={() => setClienteSeleccionado(null)} />
      )}
    </div>
  );
}

export default App;
