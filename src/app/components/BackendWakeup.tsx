import { useEffect, useState } from 'react';

interface Props {
  isWaking: boolean;
}

export function BackendWakeup({ isWaking }: Props) {
  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isWaking) return;
    const dotsId = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    const elapsedId = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => { clearInterval(dotsId); clearInterval(elapsedId); };
  }, [isWaking]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#fdfcfa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        zIndex: 9999,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid #e8dfd3',
          borderTopColor: '#7c6f5f',
          animation: 'spin 0.9s linear infinite',
        }}
      />

      {isWaking && (
        <>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#2d2a26', fontSize: '17px', fontWeight: 500, margin: 0, marginBottom: '6px' }}>
              Сервер ачаалж байна{dots}
            </p>
            <p style={{ color: '#8a7f73', fontSize: '13px', margin: 0 }}>
              {elapsed < 10
                ? 'Түр хүлээнэ үү'
                : elapsed < 30
                  ? 'Бэлдэж байна, удахгүй болно'
                  : 'Ихэвчлэн 30–60 секунд зарцуулдаг'}
            </p>
          </div>

          {elapsed > 5 && (
            <div style={{ width: '200px', height: '4px', backgroundColor: '#e8dfd3', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#7c6f5f',
                  borderRadius: '2px',
                  width: `${Math.min((elapsed / 60) * 100, 95)}%`,
                  transition: 'width 1s ease',
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
