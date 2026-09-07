import { useState } from "react";
import { supabase } from "../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const iniciarSesion = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingrese el correo y la contraseña.");
      return;
    }

    setCargando(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setCargando(false);

    if (loginError) {
      console.error("Error iniciando sesión:", loginError);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "#111827",
      }}
    >
      <form
        onSubmit={iniciarSesion}
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "30px",
          borderRadius: "16px",
          background: "#1f2937",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.35)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "8px",
            textAlign: "center",
            color: "white",
          }}
        >
          🛒 Minimarket Sara
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#9ca3af",
            marginBottom: "25px",
          }}
        >
          Ingrese para administrar los fiados
        </p>

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#e5e7eb",
          }}
        >
          Correo
        </label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #4b5563",
            background: "#111827",
            color: "white",
          }}
        />

        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#e5e7eb",
          }}
        >
          Contraseña
        </label>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: "16px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #4b5563",
            background: "#111827",
            color: "white",
          }}
        />

        {error && (
          <p
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: "#7f1d1d",
              color: "#fecaca",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: cargando ? "#4b5563" : "#16a34a",
            color: "white",
            fontWeight: "bold",
            cursor: cargando ? "not-allowed" : "pointer",
          }}
        >
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default Login;