import { useState } from 'react';
import { login as apiLogin } from '../services/api';
import Loading from '../components/Loading';
import './Login.css';

export default function Login({ onLogin }) {
  const [step, setStep] = useState('phone');
  const [telefone, setTelefone] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!telefone.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await apiLogin(telefone.trim());
      if (result.success) {
        setUserName(result.nome);
        setStep('confirm');
      } else {
        setError('Telefone não encontrado. Verifique o número.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onLogin({ telefone: telefone.trim(), nome: userName });
  };

  const handleBack = () => {
    setStep('phone');
    setTelefone('');
    setUserName('');
    setError('');
  };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-logo-container">
          <img 
            src="/logo-exatas.png" 
            alt="Fantasy Exatas Cup" 
            className="login-logo-image"
          />
        </div>
        <h1 className="login-title">Fantasy Exatas Cup</h1>
        <p className="login-subtitle">Monte seu time e dispute o campeonato do futsal!</p>

        {step === 'phone' && (
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="tel"
              className="login-input"
              placeholder="Digite seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              disabled={loading}
              autoFocus
            />
            {error && <p className="login-error">{error}</p>}
            {loading ? (
              <Loading text="Verificando..." />
            ) : (
              <button type="submit" className="login-btn">
                Entrar
              </button>
            )}
          </form>
        )}

        {step === 'confirm' && (
          <div className="login-confirm">
            <div className="login-confirm-box">
              <p className="login-confirm-label">Esse é o time de</p>
              <p className="login-confirm-name">{userName}</p>
              <p className="login-confirm-label">Deseja continuar?</p>
            </div>
            <div className="login-confirm-actions">
              <button className="login-btn" onClick={handleConfirm}>
                Sim, continuar
              </button>
              <button className="login-btn-secondary" onClick={handleBack}>
                Não, trocar número
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
