import { useState, useEffect } from "react";
import ClienteCard from "../components/clientecard";
import { supabase } from "../lib/supabase";




function Clientes() {
  alert("ENTRE A CLIENTES");

  const [clientes, setClientes] = useState([]);



function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);

  const agregarCliente = async () => {
    await cargarClientes();
  };

  const cargarClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("*");
  
    console.log("DATA:", data);
    console.log("ERROR:", error);

    alert("CARGANDO CLIENTES");
  
    if (error) {
      return;
    }
  
    setClientes(data || []);
  };

  const eliminarCliente = (id: number) => {
    console.log("Eliminar:", id);
  };
  
  const editarCliente = (id: number) => {
    console.log("Editar:", id);
  };

  useEffect(() => {
    console.log("EJECUTANDO cargarClientes");
    cargarClientes();
  }, []);

  console.log("CLIENTES:", clientes);
  return (
    <div>
      <h2>Clientes</h2>
  
      <button onClick={agregarCliente}>
        Nuevo Cliente
      </button>
  
      {clientes.map((cliente) => (
        <ClienteCard
          key={cliente.id}
          id={cliente.id}
          nombre={cliente.nombre}
          telefono={cliente.telefono}
          direccion={cliente.direccion}
          onEliminar={eliminarCliente}
          onEditar={editarCliente}
        />
      ))}
    </div>
  );

export default Clientes;