import { useRouteError } from 'react-router-dom';

export const GlobalErrorFallbackPage = () => {
  const error = useRouteError();
  console.error('Router Error:', error);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Something went wrong 😓</h1>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => window.location.href = '/'}>Go Home</button>
    </div>
  );
};
