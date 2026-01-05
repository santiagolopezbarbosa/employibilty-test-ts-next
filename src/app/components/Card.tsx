import type { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: ReactNode;
  imageUrl?: string;
  onClick?: () => void;
}

export function Card({ title, description, imageUrl, onClick }: CardProps) {
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
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: "100%", height: 160, objectFit: "cover" }}
        />
      )}
      <div style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#333" }}>
          {title}
        </h3>
        {description && (
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#666", lineHeight: 1.4 }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
