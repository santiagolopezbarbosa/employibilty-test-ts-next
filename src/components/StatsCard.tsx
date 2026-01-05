interface StatsCardProps {
  title: string;
  value: number;
  variant?: 'success' | 'danger' | 'warning' | 'default';
}

export default function StatsCard({
  title,
  value,
  variant = 'default',
}: StatsCardProps) {
  const colorMap = {
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    default: 'text-dark',
  };

  return (
    <div className="card text-center p-3 shadow-sm">
      <h6>{title}</h6>
      <p className={`fw-bold ${colorMap[variant]}`}>
        {value}
      </p>
    </div>
  );
}
