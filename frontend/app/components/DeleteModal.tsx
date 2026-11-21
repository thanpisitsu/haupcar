import type { Car } from '../types/car';

interface DeleteModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ car, isOpen, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
          <span>⚠️</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          ยืนยันการลบข้อมูลรถยนต์?
        </h3>

        <p className="text-sm text-gray-600 text-center">
          คุณกำลังจะลบรถยนต์ <strong className="text-gray-900">{car.brand} {car.model}</strong>
        </p>
        <p className="text-sm text-gray-600 text-center mb-4">
          ทะเบียน <span className="font-mono font-bold text-gray-900 px-1.5 py-0.5 rounded">{car.regisNumber}</span> ออกจากระบบ
        </p>

        <div className="flex items-center justify-between space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            ยืนยันลบ
          </button>
        </div>
      </div>
    </div>
  );
}
