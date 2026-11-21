import { useState, useEffect } from 'react';
import type { Car, CarFormData, CarStatus } from '../types/car';

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CarFormData) => void;
  initialData?: Car | null;
  existingPlates: string[];
}

export function CarFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingPlates,
}: CarFormModalProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<CarFormData>({
    regisNumber: '',
    brand: '',
    model: '',
    province: '',
    year: new Date().getFullYear(),
    color: '',
    seats: 5,
    fuelType: 'Gasoline',
    status: 'AVAILABLE',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        regisNumber: initialData.regisNumber,
        brand: initialData.brand,
        model: initialData.model,
        year: initialData.year || new Date().getFullYear(),
        province: initialData.province || '',
        color: initialData.color || '',
        seats: initialData.seats || 5,
        fuelType: initialData.fuelType || 'Gasoline',
        status: initialData.status || 'AVAILABLE',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        regisNumber: '',
        brand: '',
        model: '',
        province: '',
        year: new Date().getFullYear(),
        color: '',
        seats: 5,
        fuelType: 'Gasoline',
        status: 'AVAILABLE',
        notes: '',
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const regTrimmed = formData.regisNumber.trim();
    if (!regTrimmed) {
      setError('กรุณากรอกทะเบียนรถยนต์ (Registration Number is required)');
      return;
    }
    if (!formData.brand.trim()) {
      setError('กรุณากรอกยี่ห้อรถ (Car Brand is required)');
      return;
    }
    if (!formData.model.trim()) {
      setError('กรุณากรอกรุ่นรถ (Car Model is required)');
      return;
    }

    // Duplicate check
    const isDuplicate = existingPlates.some(
      (plate) =>
        plate.toLowerCase() === regTrimmed.toLowerCase() &&
        (!isEditing || plate.toLowerCase() !== initialData?.regisNumber.toLowerCase()),
    );

    if (isDuplicate) {
      setError(`ทะเบียนรถ "${regTrimmed}" มีอยู่ในระบบแล้ว กรุณาใช้เลขทะเบียนอื่น`);
      return;
    }

    onSubmit({
      ...formData,
      regisNumber: regTrimmed,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      color: formData.color.trim(),
      notes: formData.notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold">
              {isEditing ? 'แก้ไขข้อมูลรถยนต์' : 'เพิ่มข้อมูลรถยนต์ใหม่'}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            X
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Registration Plate */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ทะเบียนรถยนต์ (Registration Number) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.regisNumber}
              onChange={(e) => setFormData({ ...formData, regisNumber: e.target.value })}
              placeholder="เช่น 1กข 1234 กทม"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Row 2: Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ยี่ห้อรถ (Brand) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="เช่น Toyota, Honda, BYD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                รุ่นรถ (Model) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="เช่น Yaris Ativ, Civic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Year & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ปีที่ผลิต (Year)
              </label>
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                สีรถ (Color)
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="เช่น White, Black, Silver"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 4: Seats, Fuel & Mileage */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ที่นั่ง (Seats)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">เชื้อเพลิง</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Gasoline">Gasoline (เบนซิน)</option>
                <option value="Diesel">Diesel (ดีเซล)</option>
                <option value="Hybrid">Hybrid (ไฮบริด)</option>
                <option value="Electric">Electric (ไฟฟ้า 100%)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              สถานะการใช้งาน (Status)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'AVAILABLE', label: 'ว่าง (Available)', color: 'text-emerald-700 border-emerald-300 bg-emerald-50' },
                { val: 'IN_USE', label: 'ใช้งานอยู่ (In Use)', color: 'text-amber-700 border-amber-300 bg-amber-50' },
                { val: 'UNAVAILABLE', label: 'ไม่พร้อมใช้งาน (Unavailable)', color: 'text-rose-700 border-rose-300 bg-rose-50' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.val}
                  onClick={() => setFormData({ ...formData, status: s.val as CarStatus })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition cursor-pointer ${
                    formData.status === s.val
                      ? `${s.color} ring-1 font-bold`
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              หมายเหตุ (Notes / Etc.)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="บันทึกรายละเอียดเพิ่มเติม"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มรถยนต์'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
