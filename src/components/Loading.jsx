import './Loading.css';

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading">
      <div className="loading-spinner" />
      <p>{text}</p>
    </div>
  );
}
