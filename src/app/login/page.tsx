'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("usuario@rickmorty.app");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Credenciales inválidas. Acceso denegado.");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="login-container">
      <div className="portal-bg" />
      <form onSubmit={handleSubmit} className="login-box">
        <h1 className="rm-title">Autorización Requerida</h1>
        <p className="subtitle">Identificación de la Ciudadela</p>
        
        {error && <div className="error-alert">{error}</div>}

        <div className="input-group">
          <label>Identificador Cósmico (Email)</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="modern-input"
          />
        </div>

        <div className="input-group">
          <label>Clave de Encripción</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="modern-input"
          />
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Verificando..." : "Abrir Portal"}
        </button>
      </form>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Inter:wght@400;500;600;700;900&display=swap');
        body {
          margin: 0;
          background-color: #0b101a;
          color: #f8fafc;
          font-family: "Inter", sans-serif;
        }
      `}</style>
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .portal-bg {
          position: absolute;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, #97ce4c 0%, transparent 60%);
          filter: blur(100px);
          opacity: 0.3;
          z-index: 0;
          animation: float 10s infinite alternate;
        }
        .login-box {
          background: rgba(17, 24, 39, 0.7);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid rgba(151, 206, 76, 0.3);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          backdrop-filter: blur(16px);
          z-index: 10;
          width: 100%;
          max-width: 400px;
        }
        .rm-title {
          font-family: 'Creepster', cursive;
          font-size: 3rem;
          color: #97ce4c;
          margin: 0 0 0.5rem 0;
          text-align: center;
          text-shadow: 0 0 10px rgba(151,206,76,0.5);
        }
        .subtitle {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 2rem;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #cbd5e1;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .modern-input {
          width: 100%;
          box-sizing: border-box;
          padding: 1rem;
          background: rgba(31, 41, 55, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 12px;
          font-size: 1rem;
        }
        .modern-input:focus {
          outline: none;
          border-color: #97ce4c;
          box-shadow: 0 0 0 3px rgba(151, 206, 76, 0.2);
        }
        .login-btn {
          width: 100%;
          padding: 1rem;
          background: #97ce4c;
          color: #0b101a;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(151, 206, 76, 0.3);
          background: #a3e651;
        }
        .error-alert {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}
