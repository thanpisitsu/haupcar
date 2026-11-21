import type { Car } from '../types/car';
import { StatusBadge } from './CarTable';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onEdit: (car: Car) => void;
}

export function CarDetailModal({ car, onClose, onEdit }: CarDetailModalProps) {
  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-gray-400">รายละเอียดรถยนต์</span>
            <div className="flex items-center space-x-3 mt-1">
              <span className="bg-white text-gray-900 font-mono text-sm font-bold px-3 py-1 rounded-md">
                {car.regisNumber}
              </span>
              <StatusBadge status={car.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">
              ปีที่ผลิต: {car.year} • สี: {car.color || 'ไม่ระบุ'}
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">ประเภทพลังงาน</span>
              <span className="font-semibold text-gray-900 text-sm">{car.fuelType}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">จำนวนที่นั่ง</span>
              <span className="font-semibold text-gray-900 text-sm">{car.seats} ที่นั่ง</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <span className="text-xs font-semibold text-gray-700 block mb-1">หมายเหตุ (Notes):</span>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-sm text-gray-700">
              {car.notes || 'ไม่มีหมายเหตุเพิ่มเติม'}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 space-y-0.5">
            <div>เพิ่มเข้าระบบเมื่อ: {new Date(car.createdAt).toLocaleString('th-TH')}</div>
            <div>แก้ไขล่าสุดเมื่อ: {new Date(car.updatedAt).toLocaleString('th-TH')}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium transition cursor-pointer"
            >
              ปิด
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(car);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              แก้ไขข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
