interface FiltersPanelProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function FiltersPanel({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: FiltersPanelProps) {
  return (
    <div className="p-3 bg-light rounded mb-4">
      <div className="row g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar personaje..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={status}
            onChange={e => onStatusChange(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
    </div>
  );
}
