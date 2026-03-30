export function SkeletonCard() {
  return (
    <>
      <div className="skeleton-card">
        <div className="image-placeholder" />
        <div className="content">
          <div className="title-placeholder" />
          <div className="info-placeholder" />
        </div>
      </div>
      <style jsx>{`
        .skeleton-card {
          width: 290px;
          height: 330px;
          border-radius: 20px;
          background: rgba(17, 24, 39, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          position: relative;
        }
        
        .image-placeholder {
          width: 100%;
          height: 220px;
          background: #1f2937;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .content {
          padding: 16px 20px;
        }

        .title-placeholder {
          height: 24px;
          width: 70%;
          background: #374151;
          border-radius: 4px;
          margin-bottom: 12px;
          animation: pulse 1.5s infinite ease-in-out;
          animation-delay: 0.2s;
        }

        .info-placeholder {
          height: 16px;
          width: 40%;
          background: #374151;
          border-radius: 4px;
          animation: pulse 1.5s infinite ease-in-out;
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
