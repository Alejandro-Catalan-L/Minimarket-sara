interface Props {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  onEliminar: (id: number) => void;
  onEditar: (id: number) => void;
}

function ClienteCard({
  id,
  nombre,
  telefono,
  direccion,
  onEliminar,
  onEditar,
}: Props) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>{telefono}</p>
      <p>{direccion}</p>

      <button onClick={() => onEditar(id)}>
        Editar
      </button>

      <button onClick={() => onEliminar(id)}>
        Eliminar
      </button>
    </div>
  );
}

export default ClienteCard;