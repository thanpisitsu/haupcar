interface CarFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  totalFiltered: number;
}

// for future backend api key
const brands = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Ford', 'Chevrolet','BYD','Isuzu','Tesla','MG'];

export function CarFilters({
  search,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  totalFiltered,
}: CarFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาทะเบียน, ยี่ห้อ, รุ่น, สี หรือหมายเหตุ..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters & View toggles */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Brand Selector */}
        <select
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <div className="text-xs text-gray-500 whitespace-nowrap">
          found <strong>{totalFiltered}</strong> cars
        </div>
      </div>
    </div>
  );
}
