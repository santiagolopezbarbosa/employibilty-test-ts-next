import type { ReactNode } from "react";

interface CardProps {
  title: string;
  status?: string;
  species?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function Card({
  title,
  status = "unknown",
  species = "Human",
  imageUrl,
  isFavorite = false,
  onToggleFavorite,
}: CardProps) {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "alive": return "#97ce4c"; // Rick & Morty Portal Green
      case "dead": return "#ef4444"; // Red
      default: return "#94a3b8"; // Slate
    }
  };

  return (
    <>
      <div className="card" onClick={onToggleFavorite}>
        <div className="image-container">
          {imageUrl && (
            <img src={imageUrl} alt={title} className="image" loading="lazy" />
          )}
          
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`fav-btn ${isFavorite ? "active" : ""}`}
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "#97ce4c" : "none"}
                stroke={isFavorite ? "#97ce4c" : "#ffffff"} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="heart-icon"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>
          )}

          <div className="image-overlay" />
        </div>

        <div className="content">
          <h3 className="title">{title}</h3>
          
          <div className="info">
            <span className="species">{species}</span>
            <span className="separator">•</span>
            <div className="status-wrapper">
              <span 
                className="dot" 
                style={{ backgroundColor: getStatusColor(status), boxShadow: `0 0 8px ${getStatusColor(status)}80` }} 
              />
              <span className="status">{status}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          width: 290px;
          border-radius: 20px;
          background: rgba(17, 24, 39, 0.7); /* Estilo profundo oscuro */
          border: 1px solid rgba(151, 206, 76, 0.15); /* Borde sutíl verde portal */
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                      box-shadow 0.4s ease,
                      border-color 0.4s ease,
                      background 0.4s ease;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
        }

        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 40px -10px rgba(0, 0, 0, 0.8), 
                      0 0 25px rgba(151, 206, 76, 0.25); /* Resplandor Portal Rick & Morty */
          border-color: rgba(151, 206, 76, 0.4);
          background: rgba(17, 24, 39, 0.85);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover .image {
          transform: scale(1.1) rotate(1deg); /* Ligero caos a lo Rick */
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0) 100%);
          pointer-events: none;
        }

        .fav-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(17, 24, 39, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .fav-btn:hover {
          background: rgba(17, 24, 39, 0.9);
          transform: scale(1.1) translateY(-2px);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .fav-btn.active {
          border-color: rgba(151, 206, 76, 0.5);
          background: rgba(151, 206, 76, 0.15);
          box-shadow: 0 0 15px rgba(151, 206, 76, 0.3);
        }
        
        .fav-btn.active:hover {
          background: rgba(151, 206, 76, 0.25);
          box-shadow: 0 0 20px rgba(151, 206, 76, 0.5);
        }

        .heart-icon {
          width: 22px;
          height: 22px;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .fav-btn.active .heart-icon {
          animation: heartPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .content {
          padding: 0 20px 24px;
          position: relative;
          z-index: 2;
          margin-top: -10px;
        }

        .title {
          margin: 0 0 12px 0;
          font-size: 1.4rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.92rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .separator {
          color: #475569;
          font-size: 0.8rem;
        }

        .status-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .status {
          color: #cbd5e1;
        }

        @keyframes heartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
