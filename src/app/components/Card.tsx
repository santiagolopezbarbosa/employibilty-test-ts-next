import type { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: ReactNode;
  imageUrl?: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function Card({
  title,
  description,
  imageUrl,
  onClick,
  isFavorite = false,
  onToggleFavorite,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 300,
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      )}

      {/* Botón de Favorito */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evitar que el clic del botón propague al card
            onToggleFavorite();
          }}
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            backgroundColor: isFavorite
              ? "rgba(239, 68, 68, 0.9)"
              : "rgba(255, 255, 255, 0.85)",
            color: isFavorite ? "#fff" : "#9ca3af",
            fontSize: "1.25rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      )}

      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#333" }}>
          {title}
        </h3>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#666",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
