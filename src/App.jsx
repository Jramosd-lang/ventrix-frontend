import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProveedorNotificaciones from "./components/proveedorNotificaciones/index.jsx";
import { iniciarConexion } from "./utils/Conexion_hub";

import Login from "./page/login/index.jsx";
import Registro from "./page/registro/index.jsx";
import Home from "./page/home/index.jsx";
import Negocio from "./page/cliente/negocio/index.jsx";
import Pedidos from "./page/vendedor/pedidos/index.jsx";
import Usuario from "./components/usuario/index.jsx";
import PagoSeguro from "./page/pagos/index.jsx";

import "./App.css";

function App() {
  const [cuenta, setCuenta] = useState(null);
  const [loading, setLoading] = useState(true);
    const [signalrConn, setSignalrConn] = useState(null);
  const navigate = useNavigate();

  // Cargar sesión desde localStorage en el primer render
  useEffect(() => {
    const data = localStorage.getItem("cuenta");

    if (data) {
      try {
        const parsed = JSON.parse(data);

        // Validar que tenga un rol válido
        if (parsed?.rol === "vendedor" || parsed?.rol === "comprador") {
          setCuenta(parsed);
        } else {
          localStorage.removeItem("cuenta");
        }
      } catch {
        localStorage.removeItem("cuenta");
      }
    }

    setLoading(false);
  }, []);

  // Login vendedor
  const onLoginV = (vendedorData) => {
    const payload = { ...vendedorData }; // Debe incluir: rol, token, id
    localStorage.setItem("cuenta", JSON.stringify(payload));
    setCuenta(payload);

    navigate("/productos", { replace: true });
  };

  // Login comprador
  const onLoginC = (compradorData) => {
    const payload = { ...compradorData };
    localStorage.setItem("cuenta", JSON.stringify(payload));
    setCuenta(payload);

    navigate("/usuario", { replace: true });
  };

  // Logout
  const onLogout = () => {
    setCuenta(null);
    localStorage.removeItem("cuenta");
    navigate("/", { replace: true });
  };
  // Flags fáciles
  const sesionActiva = cuenta !== null;
  const esVendedor = cuenta?.rol === "vendedor";
  const esComprador = cuenta?.rol === "comprador";

  // Mantener una única conexión SignalR para la app cuando el usuario es vendedor
  useEffect(() => {
    let mounted = true;
    async function startConn() {
      if (!esVendedor) return;
      try {
        const conn = await iniciarConexion();
        if (mounted) setSignalrConn(conn);
        console.log("App - SignalR connection started", conn?.state);
      } catch (err) {
        console.error("App - Error starting SignalR connection", err);
      }
    }

    startConn();

    return () => {
      mounted = false;
      // don't stop connection here globally; it's managed by iniciarConexion lifecycle
    };
  }, [esVendedor]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
  {esVendedor && <ProveedorNotificaciones connection={signalrConn} cuenta={cuenta} />}
      <Routes>
      {/* --- PÚBLICAS --- */}
      <Route
        path="/"
        element={
          sesionActiva ? (
            esVendedor ? (
              <Navigate to="/productos" replace />
            ) : (
              <Navigate to="/usuario" replace />
            )
          ) : (
            <Login onLoginC={onLoginC} onLoginV={onLoginV} />
          )
        }
      />

      <Route
        path="/registro"
        element={
          sesionActiva ? (
            esVendedor ? (
              <Navigate to="/productos" replace />
            ) : (
              <Navigate to="/usuario" replace />
            )
          ) : (
            <Registro />
          )
        }
      />

      {/* --- PRIVADAS VENDEDOR --- */}
      <Route
        path="/productos"
        element={
          esVendedor ? (
            <Home onLogout={onLogout} />
          ) : sesionActiva ? (
            <Navigate to="/usuario" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/pedidos"
        element={esVendedor ? <Pedidos /> : <Navigate to="/" replace />}
      />

      {/* --- PRIVADAS COMPRADOR --- */}
      <Route
        path="/usuario"
        element={
          esComprador ? (
            <Usuario onLogout={onLogout} cuenta={cuenta} />
          ) : sesionActiva ? (
            <Navigate to="/productos" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="/negocio/checkout/" element={<PagoSeguro />} />

      <Route path="/negocio/:id" element={<Negocio cuenta={cuenta} />} />

      {/* --- DEFAULT --- */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              sesionActiva
                ? esVendedor
                  ? "/productos"
                  : "/usuario"
                : "/"
            }
            replace
          />
        }
      />
    </Routes>
    </>
  );
}

export default App;
