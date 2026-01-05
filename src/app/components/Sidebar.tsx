import React from "react";

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface SidebarProps {
  title?: string;
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  title = "Dashboard",
  items,
}) => {
  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: "0 0 24px 0",
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {title}
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: item.active ? "#1e293b" : "transparent",
              color: item.active ? "#fff" : "#cbd5f5",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e =>
              !item.active &&
              ((e.currentTarget.style.backgroundColor = "#1e293b"))
            }
            onMouseLeave={e =>
              !item.active &&
              ((e.currentTarget.style.backgroundColor = "transparent"))
            }
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};
