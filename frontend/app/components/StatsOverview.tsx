interface StatsOverviewProps {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export function StatsOverview({
  total,
  available,
  inUse,
  maintenance,
  selectedStatus,
  onSelectStatus,
}: StatsOverviewProps) {
  const cards = [
    {
      label: 'Total Cars',
      sublabel: 'รถยนต์ทั้งหมด',
      count: total,
      value: 'ALL',
      bgColor: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeColor: 'bg-blue-600 text-white',
      ringColor: 'ring-blue-500',
    },
    {
      label: 'Available',
      sublabel: 'ว่างพร้อมใช้งาน',
      count: available,
      value: 'AVAILABLE',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeColor: 'bg-emerald-600 text-white',
      ringColor: 'ring-emerald-500',
    },
    {
      label: 'In Use',
      sublabel: 'กำลังใช้งาน',
      count: inUse,
      value: 'IN_USE',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeColor: 'bg-amber-600 text-white',
      ringColor: 'ring-amber-500',
    },
    {
      label: 'Maintenance',
      sublabel: 'ซ่อมบำรุง',
      count: maintenance,
      value: 'MAINTENANCE',
      bgColor: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeColor: 'bg-rose-600 text-white',
      ringColor: 'ring-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const isSelected = selectedStatus === card.value;
        return (
          <button
            key={card.value}
            onClick={() => onSelectStatus(selectedStatus === card.value ? 'ALL' : card.value)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-xs ${card.bgColor} ${
              isSelected ? `ring-2 ${card.ringColor} shadow-md` : 'hover:shadow-sm opacity-90 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between relative">
              <div className="flex flex-col">
                <div className="font-bold text-md">{card.label}</div>
                <div className="font-semibold text-xs opacity-75">{card.sublabel}</div>
              </div>
              <div className={`min-h-10 text-xl font-bold flex items-center justify-center aspect-square rounded-md ${card.badgeColor}`}>
                <span >
                  {card.count}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
