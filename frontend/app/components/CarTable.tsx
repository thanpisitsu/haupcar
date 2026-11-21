import type { Car, CarStatus } from '../types/car';

interface CarTableProps {
  cars: Car[];
  onView: (car: Car) => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export function StatusBadge({ status }: { status: CarStatus }) {
  const configs: Record<CarStatus, { labelEn: string; labelTh: string; bg: string; text: string; dot: string }> = {
    AVAILABLE: {
      labelEn: 'Available',
      labelTh: 'ว่าง',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
    IN_USE: {
      labelEn: 'In Use',
      labelTh: 'ใช้งานอยู่',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
    MAINTENANCE: {
      labelEn: 'Maintenance',
      labelTh: 'ซ่อมบำรุง',
      bg: 'bg-rose-50 border-rose-200',
      text: 'text-rose-700',
      dot: 'bg-rose-500',
    },
  };

  const c = configs[status] || configs.AVAILABLE;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full  font-medium border ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${c.dot}`} />
      {c.labelEn}
    </span>
  );
}

export function CarTable({ cars, onView, onEdit, onDelete }: CarTableProps) {
  if (cars.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">🚗</div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">ไม่พบข้อมูลรถยนต์</h3>
        <p className="text-sm text-gray-500">กรุณาเปลี่ยนการค้นหา หรือเพิ่มข้อมูลรถยนต์ใหม่</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5 text-center">ทะเบียนรถ</th>
              <th scope="col" className="px-5 py-3.5 text-center">ยี่ห้อ / รุ่น</th>
              <th scope="col" className="px-5 py-3.5 text-center">ปี / สี</th>
              <th scope="col" className="px-5 py-3.5 text-center">พลังงาน / ที่นั่ง</th>
              <th scope="col" className="px-5 py-3.5 text-center">สถานะ</th>
              <th scope="col" className="px-5 py-3.5 text-center">หมายเหตุ</th>
              <th scope="col" className="px-5 py-3.5 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-blue-50/40 transition">
                {/* Registration Plate */}
                <td className="px-5 py-4 whitespace-nowrap text-center">
                  <span className="relative inline-block border-2 text-gray-900 font-semibold w-24 pb-2.5 rounded-sm">
                    {car?.regisNumber}
                    <span className="absolute text-[9px] text-gray-700 bottom-0 left-0 flex items-center justify-center w-full">
                      {car?.province}
                    </span>
                  </span>
                </td>

                {/* Brand & Model */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className=" text-gray-700">{car.brand}</div>
                  <div className="font-semibold text-gray-900">{car.model}</div>
                </td>

                {/* Year & Color */}
                <td className="px-5 py-4 whitespace-nowrap text-gray-700">
                  <div>{car.year || '-'}</div>
                  <div className="text-gray-500">{car.color || '-'}</div>
                </td>

                {/* Fuel & Seats */}
                <td className="px-5 py-4 whitespace-nowrap ">
                  <span className="text-gray-700 font-medium mr-1">
                    {car.fuelType} /
                  </span>
                  <span className="text-gray-700">{car.seats} ที่นั่ง</span>
                </td>

                {/* Status */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <StatusBadge status={car.status} />
                </td>

                {/* Notes */}
                <td className="px-5 py-4 line-clamp-2 text-gray-500" title={car.notes}>
                  {car.notes || '-'}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 whitespace-nowrap text-right  font-medium">
                  <div className="inline-flex items-center space-x-1">
                    <button
                      onClick={() => onView(car)}
                      title="ดูรายละเอียด"
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEdit(car)}
                      title="แก้ไขข้อมูล"
                      className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition cursor-pointer"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(car)}
                      title="ลบข้อมูล"
                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
