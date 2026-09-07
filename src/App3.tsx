import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Login from "./components/Login";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  bloqueado: boolean;
  excepcion_hasta: string | null;
  motivo_excepcion: string | null;
}

interface Fiado {
  id: number;
  cliente_id: number;
  product_id: number | null;
  descripcion: string;
  cantidad: number | null;
  precio_unitario: number | null;
  monto: number;
  fecha: string;
  created_at: string;
  compra_id: string | null;
}


interface Abono {
  id: number;
  cliente_id: number;
  monto: number;
  fecha: string;
}
//producto
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  icono: string;
  activo: boolean;
}

interface ItemCarrito {
  productoId: number | null;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  total: number;
  icono: string;
}

function App() {


  const [session, setSession] = useState<Session | null>(null);
  const [authCargando, setAuthCargando] = useState(true);


  //Agregar productos 

  const [nuevoProducto, setNuevoProducto] = useState("");
const [nuevoPrecio, setNuevoPrecio] = useState("");
const [nuevoIcono, setNuevoIcono] = useState("📦");



//

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fiados, setFiados] = useState<Fiado[]>([]);
  const [abonos, setAbonos] = useState<Abono[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const [productoVariable, setProductoVariable] =
  useState(false);
  

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [clienteId, setClienteId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [cantidad, setCantidad] = useState("1");

  const [ultimoProductoId, setUltimoProductoId] =
  useState<number | null>(null);
  
  const [clienteAbonoId, setClienteAbonoId] = useState("");
  const [montoAbono, setMontoAbono] = useState("");

  const totalFiados = fiados.reduce(
    (total, fiado) => total + Number(fiado.monto || 0),
    0
  );

  const totalAbonos = abonos.reduce(
    (total, abono) => total + Number(abono.monto || 0),
    0
  );

  const saldoTotal = totalFiados - totalAbonos;


  const agregarProducto = async () => {
    if (!nuevoProducto.trim()) {
      alert("Ingrese nombre producto");
      return;
    }
  
    if (!nuevoPrecio) {
      alert("Ingrese precio");
      return;
    }
  
    const { error } = await supabase
      .from("productos")
      .insert([
        {
          nombre: nuevoProducto,
          precio: Number(nuevoPrecio),
          icono: nuevoIcono,
          activo: true,
        },
      ]);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    setNuevoProducto("");
    setNuevoPrecio("");
    setNuevoIcono("📦");
  
    await cargarProductos();
  };


  const desactivarProducto = async (
    productoId: number
  ) => {
    const { error } = await supabase
      .from("productos")
      .update({
        activo: false,
      })
      .eq("id", productoId);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    await cargarProductos();
  };
  

  const cargarClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select(
        "id,nombre,telefono,direccion,bloqueado,excepcion_hasta,motivo_excepcion"
      )
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error cargando clientes:", error);
      return;
    }

    setClientes(data || []);
  };

  const cargarFiados = async () => {
    const { data, error } = await supabase
      .from("fiados")
      .select(
        "id,cliente_id,product_id,descripcion,cantidad,precio_unitario,monto,fecha,created_at,compra_id"
      )
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Error cargando fiados:", error);
      return;
    }
  
    console.log("FIADOS CARGADOS:", data);
  
    setFiados(data || []);
  };
  const cargarAbonos = async () => {
    const { data, error } = await supabase
      .from("abonos")
      .select("id,cliente_id,monto,fecha")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando abonos:", error);
      return;
    }

    setAbonos(data || []);
  };
  const cargarProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("nombre");
  
    if (error) {
      console.error(
        "Error cargando productos:",
        error
      );
      return;
    }
  
    setProductos(data || []);
  };
  const agregarCliente = async () => {
    if (!nombre.trim()) {
      alert("Ingrese el nombre del cliente");
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .insert([
        {
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          direccion: direccion.trim(),
        },
      ]);

    if (error) {
      alert(error.message);
      console.error("Error guardando cliente:", error);
      return;
    }

    setNombre("");
    setTelefono("");
    setDireccion("");

    await cargarClientes();
  };



const registrarFiado = async () => {
  if (!clienteId) {
    alert("Seleccione un cliente");
    return;
  }

  let carritoFinal: ItemCarrito[] = [...carrito];

  if (productoVariable) {
    if (!descripcion.trim()) {
      alert("Ingrese el nombre del producto variable");
      return;
    }

    if (!monto || Number(monto) <= 0) {
      alert("Ingrese un precio válido");
      return;
    }

    if (!cantidad || Number(cantidad) <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }

    const productoVariableActual: ItemCarrito = {
      productoId: null,
      nombre: descripcion.trim(),
      precioUnitario: Number(monto),
      cantidad: Number(cantidad),
      total: Number(monto) * Number(cantidad),
      icono: "➕",
    };

    carritoFinal.push(productoVariableActual);
  }

  if (carritoFinal.length === 0) {
    alert("Agregue al menos un producto al carrito");
    return;
  }

  const compraId = crypto.randomUUID();

  const registros = carritoFinal.map((item) => ({
    cliente_id: Number(clienteId),
    product_id: item.productoId,
    descripcion: item.nombre,
    cantidad: item.cantidad,
    precio_unitario: item.precioUnitario,
    monto: item.total,
    fecha: new Date().toISOString().split("T")[0],
    compra_id: compraId,
  }));

  console.log("CARRITO FINAL:", carritoFinal);
  console.log("REGISTROS A INSERTAR:", registros);

  const { data, error } = await supabase
    .from("fiados")
    .insert(registros)
    .select(
      "id,cliente_id,product_id,descripcion,cantidad,precio_unitario,monto,fecha,created_at,compra_id"
    );

  console.log("REGISTROS GUARDADOS:", data);
  console.log("ERROR INSERT:", error);

  if (error) {
    alert(`Error guardando compra: ${error.message}`);
    return;
  }

  if (!data || data.length !== carritoFinal.length) {
    alert(
      `Se intentaron guardar ${carritoFinal.length} productos, pero Supabase confirmó ${data?.length || 0}.`
    );
    return;
  }

  alert(
    `Compra guardada correctamente. Productos registrados: ${data.length}`
  );

  setCarrito([]);
  setDescripcion("");
  setMonto("");
  setCantidad("1");
  setUltimoProductoId(null);
  setProductoVariable(false);

  await cargarFiados();
};
  

  const registrarAbono = async () => {
    if (!clienteAbonoId) {
      alert("Seleccione un cliente");
      return;
    }

    if (!montoAbono || Number(montoAbono) <= 0) {
      alert("Ingrese un monto de abono válido");
      return;
    }

    const { error } = await supabase
      .from("abonos")
      .insert([
        {
          cliente_id: Number(clienteAbonoId),
          monto: Number(montoAbono),
          fecha: new Date().toISOString().split("T")[0],
        },
      ]);

    if (error) {
      alert(error.message);
      console.error("Error guardando abono:", error);
      return;
    }

    setMontoAbono("");

    await cargarAbonos();
  };

  const editarCliente = async (cliente: Cliente) => {
    const nuevoNombre = window.prompt(
      "Nuevo nombre:",
      cliente.nombre
    );

    if (nuevoNombre === null || !nuevoNombre.trim()) {
      return;
    }

    const nuevoTelefono = window.prompt(
      "Nuevo teléfono:",
      cliente.telefono || ""
    );

    if (nuevoTelefono === null) {
      return;
    }

    const nuevaDireccion = window.prompt(
      "Nueva dirección:",
      cliente.direccion || ""
    );

    if (nuevaDireccion === null) {
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: nuevoNombre.trim(),
        telefono: nuevoTelefono.trim(),
        direccion: nuevaDireccion.trim(),
      })
      .eq("id", cliente.id);

    if (error) {
      alert(error.message);
      console.error("Error editando cliente:", error);
      return;
    }

    await cargarClientes();
  };


const eliminarCliente = async (id: number) => {
  const confirmado = window.confirm(
    "¿Seguro que desea eliminar este cliente?"
  );

  if (!confirmado) {
    return;
  }

  const { data, error } = await supabase
  .from("productos")
  .select("*")
  .order("nombre");
  console.log("Cliente eliminado:", data);
  console.log("Error al eliminar:", error);

  if (error) {
    alert(error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert(
      "Supabase no eliminó ninguna fila. Revisa que exista la policy DELETE para anon."
    );
    return;
  }

  setClientes((clientesActuales) =>
    clientesActuales.filter((cliente) => cliente.id !== id)
  );
};


const agregarProductoAlCarrito = (producto: Producto) => {
  const cantidadNumerica =
  ultimoProductoId === producto.id
    ? Number(cantidad)
    : 1;
 
  setUltimoProductoId(producto.id);
  setCantidad("1");
  if (cantidadNumerica <= 0) {
    alert("Ingrese una cantidad válida");
    return;
  }

  const productoExistente = carrito.find(
    (item) => item.productoId === producto.id
  );

  if (productoExistente) {
    setCarrito(
      carrito.map((item) =>
        item.productoId === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + cantidadNumerica,
              total:
                (item.cantidad + cantidadNumerica) *
                item.precioUnitario,
            }
          : item
      )
    );
  } else {
    const nuevoItem: ItemCarrito = {
      productoId: producto.id,
      nombre: producto.nombre,
      precioUnitario: Number(producto.precio),
      cantidad: cantidadNumerica,
      total: Number(producto.precio) * cantidadNumerica,
      icono: producto.icono,
    };

    setCarrito([...carrito, nuevoItem]);
  }
  setCantidad("1");
  setUltimoProductoId(producto.id);
  
};

const eliminarProductoDelCarrito = (
  productoId: number | null
) => {
``
  setCarrito((carritoActual) =>
    carritoActual.filter(
      (item) => item.productoId !== productoId
    )
  );
};



const tieneExcepcionVigente = (
  cliente: Cliente
) => {
  if (!cliente.excepcion_hasta) {
    return false;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaLimite = new Date(
    `${cliente.excepcion_hasta}T23:59:59`
  );

  return fechaLimite >= hoy;
};



const otorgarExcepcion = async (
  cliente: Cliente
) => {
  const fecha = window.prompt(
    "Excepción válida hasta, formato AAAA-MM-DD:",
    cliente.excepcion_hasta || ""
  );

  if (fecha === null || !fecha.trim()) {
    return;
  }

  const motivo = window.prompt(
    "Motivo de la excepción:",
    cliente.motivo_excepcion || ""
  );

  if (motivo === null) {
    return;
  }

  const { error } = await supabase
    .from("clientes")
    .update({
      excepcion_hasta: fecha.trim(),
      motivo_excepcion: motivo.trim(),
    })
    .eq("id", cliente.id);

  if (error) {
    alert(error.message);
    return;
  }

  await cargarClientes();
};


useEffect(() => {
  let componenteMontado = true;

  const revisarSesion = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error revisando la sesión:", error);
    }

    if (componenteMontado) {
      setSession(session);
      setAuthCargando(false);
    }
  };

  revisarSesion();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, nuevaSession) => {
    setSession(nuevaSession);
    setAuthCargando(false);
  });

  return () => {
    componenteMontado = false;
    subscription.unsubscribe();
  };
}, []);

useEffect(() => {
  if (!session) {
    setClientes([]);
    setFiados([]);
    setAbonos([]);
    setProductos([]);
    setCarrito([]);
    return;
  }

  cargarClientes();
  cargarFiados();
  cargarAbonos();
  cargarProductos();
}, [session]);



const cerrarSesion = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error cerrando sesión:", error);
    alert("No se pudo cerrar la sesión.");
  }
};

if (authCargando) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Verificando sesión...</h2>
    </div>
  );
}

if (!session) {
  return <Login />;
}

return (
 <div style={{ padding: "20px" }}>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "20px",
    }}
  >
    <div>
      <h1 style={{ marginBottom: "5px" }}>
        🛒 Minimarket Sara | Fiados
      </h1>

      <small>
        Sesión iniciada como: {session.user.email}
      </small>
    </div>

    <button
      type="button"
      onClick={cerrarSesion}
      style={{
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "10px 16px",
        cursor: "pointer",
      }}
    >
      Cerrar sesión
    </button>
  </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div className="card">
          <h3>Total Fiados</h3>
          <p>${totalFiados.toLocaleString("es-CL")}</p>
        </div>

        <div className="card">
          <h3>Total Abonos</h3>
          <p>${totalAbonos.toLocaleString("es-CL")}</p>
        </div>

        <div className="card">
          <h3>Saldo Pendiente</h3>
          <p>${saldoTotal.toLocaleString("es-CL")}</p>
        </div>
      </div>

      <div className="card">
      <details>
  <summary>
    ➕ Nuevo Cliente
  </summary>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(event) => setTelefono(event.target.value)}
        />

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(event) => setDireccion(event.target.value)}
        />

        <button onClick={agregarCliente}>
          Guardar Cliente
          </button>
</details>
</div>

      <div className="card">




        <h2>Registrar Fiado</h2>

        <h3 className="selector-titulo">
  Seleccione un cliente
</h3>

<div className="clientes-selector">
  {clientes.map((cliente) => (
    <button
      type="button"
      key={cliente.id}
      className={
        cliente.bloqueado &&
        !tieneExcepcionVigente(cliente)
          ? "cliente-selector-card bloqueado"
          : Number(clienteId) === Number(cliente.id)
          ? "cliente-selector-card seleccionado"
          : "cliente-selector-card"
      }
      onClick={() => {
        if (
          cliente.bloqueado &&
          !tieneExcepcionVigente(cliente)
        ) {
          alert(
            `${cliente.nombre} tiene la cuenta bloqueada por deuda pendiente.`
          );
      
          return;
        }
      
        if (
          carrito.length > 0 &&
          clienteId !== "" &&
          Number(clienteId) !== Number(cliente.id)
        ) {
          const confirmarCambio = window.confirm(
            "La compra actual contiene productos.\n\n¿Deseas cambiar de cliente y vaciar el carrito?"
          );
      
          if (!confirmarCambio) {
            return;
          }
      
          setCarrito([]);
          setDescripcion("");
          setMonto("");
          setCantidad("1");
        }
      
        setClienteId(String(cliente.id));
      }}
    >
      <span className="cliente-avatar">
        {cliente.nombre.charAt(0).toUpperCase()}
      </span>

      <span className="cliente-selector-nombre">
        {cliente.nombre}
      </span>

      {Number(clienteId) === Number(cliente.id) && (
        <span className="seleccion-check">
          ✓
        </span>
      )}
    </button>
    
  ))}

<div className="carrito-compra">
  <h3>🧺 Compra actual</h3>

  {carrito.length === 0 ? (
    <p>No hay productos agregados.</p>
  ) : (
    <>
    {carrito.map((item, index) => (
  <div
    key={`${item.productoId ?? "variable"}-${index}`}
    className="carrito-item"
  >
 <span>
   {item.icono} {item.cantidad} x {item.nombre}
 </span>

 <strong>
   ${item.total.toLocaleString("es-CL")}
 </strong>

 <button
   type="button"
   style={{
     marginLeft: "10px",
     background: "#dc2626",
     color: "white",
     border: "none",
     borderRadius: "6px",
     cursor: "pointer",
     padding: "4px 8px"
   }}
   onClick={() =>
     eliminarProductoDelCarrito(
       item.productoId
     )
   }
 >
   🗑️
 </button>
</div>
))}

      <div className="carrito-total">
        Total de la visita: $
        {carrito
          .reduce(
            (total, item) => total + item.total,
            0
          )
          .toLocaleString("es-CL")}
      </div>
    </>
  )}
</div>
</div>

{clientes.length === 0 && (
  <p className="mensaje-vacio">
    No hay clientes registrados.
  </p>

  
)}
<h3 className="selector-titulo">
  Productos Frecuentes
</h3>

<div className="productos-selector">


<button
  type="button"
  className={
    productoVariable
      ? "producto-card seleccionado"
      : "producto-card"
  }
  onClick={() => {
    setProductoVariable(true);

    setUltimoProductoId(null);

    setDescripcion("");
    setMonto("");
    setCantidad("1");
  }}
>

  <span className="producto-icono">
    ➕
  </span>

  <span className="producto-nombre">
    Producto Variable
  </span>

  <span className="producto-precio">
    Precio libre
  </span>
</button>




  {productos.map((producto) => (
    <button
      type="button"
      key={producto.nombre}
      className={
        descripcion === producto.nombre
          ? "producto-card seleccionado"
          : "producto-card"
      }

     
      onClick={() => {
        setDescripcion(producto.nombre);
        setCantidad("1");
        setUltimoProductoId(null);
      
        if (Number(producto.precio) === 0) {
          setProductoVariable(true);
          setMonto("");
          return;
        }
      
        setProductoVariable(false);
        setMonto(String(producto.precio));
        agregarProductoAlCarrito(producto);
      }}
    >
      <span className="producto-icono">
        {producto.icono}
      </span>

      <span className="producto-nombre">
        {producto.nombre}
      </span>

      <span className="producto-precio">
  {Number(producto.precio) === 0
    ? "Precio variable"
    : `$${Number(producto.precio).toLocaleString("es-CL")}`}
</span>
    </button>
  ))}
 
</div>
<h5>Producto</h5>
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
        />
        <h5>Cantidad</h5>
        <input
  type="number"
  min="1"
  placeholder="Cantidad"
  value={cantidad}
  onChange={(event) => {
    const nuevaCantidad = event.target.value;

    setCantidad(nuevaCantidad);

    if (!ultimoProductoId) {
      return;
    }

    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.productoId === ultimoProductoId
          ? {
              ...item,
              cantidad: Number(nuevaCantidad),
              total:
                Number(nuevaCantidad) *
                item.precioUnitario,
            }
          : item
      )
    );
  }}
/>

<p

  style={{
    fontSize: "20px",
    fontWeight: "bold",
    color: "#22c55e"
  }}
>
  Total: $
  {(
    Number(monto || 0) *
    Number(cantidad || 1)
  ).toLocaleString("es-CL")}
</p>
       




// PEGA AQUIII








        

        <button onClick={registrarFiado}>
          Guardar Fiado
        </button>
      </div>

      <div className="card">
  




      <div className="card">
  






<h2>📦 Productos</h2>

<input
  type="text"
  placeholder="Nombre producto"
  value={nuevoProducto}
  onChange={(event) =>
    setNuevoProducto(event.target.value)
  }
/>

<input
  type="number"
  placeholder="Precio"
  value={nuevoPrecio}
  onChange={(event) =>
    setNuevoPrecio(event.target.value)
  }
/>

<input
  type="text"
  placeholder="Icono"
  value={nuevoIcono}
  onChange={(event) =>
    setNuevoIcono(event.target.value)
  }
/>

<button onClick={agregarProducto}>
  Guardar Producto
</button>

<hr />

{productos.map((producto) => (
  <div
    key={producto.id}
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    }}
  >
    <span>
      {producto.icono} {producto.nombre}
      {" - "}
      $
      {producto.precio.toLocaleString("es-CL")}
    </span>

    <button
      onClick={() =>
        desactivarProducto(producto.id)
      }
    >
      Desactivar
    </button>
  </div>
))}
</div> 

<h2>Clientes</h2>
<h2>Registrar Abono</h2>

<select
  value={clienteAbonoId}
  onChange={(event) =>
    setClienteAbonoId(event.target.value)
  }
>
  <option value="">Seleccione cliente</option>

  {clientes.map((cliente) => (
    <option
      key={cliente.id}
      value={cliente.id}
    >
      {cliente.nombre}
    </option>
  ))}
</select>

<input
  type="number"
  min="1"
  placeholder="Monto del abono"
  value={montoAbono}
  onChange={(event) =>
    setMontoAbono(event.target.value)
  }
/>

<button onClick={registrarAbono}>
  Guardar Abono
</button>
</div>

      {clientes.map((cliente) => {
        const fiadosCliente = fiados.filter(
          (fiado) =>
            Number(fiado.cliente_id) === Number(cliente.id)
        );

        const abonosCliente = abonos.filter(
          (abono) =>
            Number(abono.cliente_id) === Number(cliente.id)
        );

        const totalFiadoCliente = fiadosCliente.reduce(
          (total, fiado) =>
            total + Number(fiado.monto || 0),
          0
        );

        const totalAbonadoCliente = abonosCliente.reduce(
          (total, abono) =>
            total + Number(abono.monto || 0),
          0
        );

        const saldoCliente =
          totalFiadoCliente - totalAbonadoCliente;

        return (
          <div
            key={cliente.id}
            className="card"
          >
            <h3>{cliente.nombre}</h3>

            <p>
              Teléfono: {cliente.telefono || "Sin teléfono"}
            </p>

            <p>
              Dirección: {cliente.direccion || "Sin dirección"}
            </p>

            <p>
              Total Fiado: $
              {totalFiadoCliente.toLocaleString("es-CL")}
            </p>

            <p>
              Total Abonado: $
              {totalAbonadoCliente.toLocaleString("es-CL")}
            </p>

            <h3>
              Saldo Pendiente: $
              {saldoCliente.toLocaleString("es-CL")}
            </h3>

            {cliente.bloqueado ? (
  tieneExcepcionVigente(cliente) ? (
    <p className="estado-excepcion">
      Crédito excepcional hasta{" "}
      {cliente.excepcion_hasta}
    </p>
  ) : (
    <p className="estado-bloqueado">
      Cuenta bloqueada
    </p>
  )
) : (
  <p className="estado-activo">
    Cuenta activa
  </p>
)}

            <h4>Fiados</h4>

            {fiadosCliente.length === 0 ? (
              <p>Sin fiados registrados</p>
            ) : (
              <ul>
                {fiadosCliente.map((fiado) => (
                  <li key={fiado.id}>
                    {fiado.descripcion} | $
                    {Number(fiado.monto).toLocaleString("es-CL")} |{" "}
                    {new Date(
  fiado.created_at
).toLocaleString("es-CL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})}
                  </li>
                ))}
              </ul>
            )}

            <h4>Abonos</h4>

            {abonosCliente.length === 0 ? (
              <p>Sin abonos registrados</p>
            ) : (
              <ul>
                {abonosCliente.map((abono) => (
                  <li key={abono.id}>
                    Abono | $
                    {Number(abono.monto).toLocaleString("es-CL")} |{" "}
                    {abono.fecha}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => editarCliente(cliente)}
            >
              Editar
            </button>

            <button
              onClick={() => eliminarCliente(cliente.id)}
            >
              Eliminar
            </button>

            <button
  type="button"
  onClick={() => otorgarExcepcion(cliente)}
>
  Extender crédito
</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;

