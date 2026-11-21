import { useState, useEffect, useMemo } from 'react';
import type { Route } from './+types/home';
import type { Car, CarFormData } from '../types/car';
import { INITIAL_MOCK_CARS } from '../data/mockCars';
import { StatsOverview } from '../components/StatsOverview';
import { CarFilters } from '../components/CarFilters';
import { CarTable } from '../components/CarTable';
import { CarFormModal } from '../components/CarFormModal';
import { CarDetailModal } from '../components/CarDetailModal';
import { DeleteModal } from '../components/DeleteModal';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Haupcar Fleet Manager - ข้อมูลรถยนต์บริษัท' },
    { name: 'description', content: 'ระบบบันทึกและจัดการข้อมูลรถยนต์ บริษัท ฮ้อปคาร์ จำกัด' },
  ];
}

const STORAGE_KEY = 'haupcar_fleet_data_v1';

export default function Home() {
  // initial state
  const [cars, setCars] = useState<Car[]>(INITIAL_MOCK_CARS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters & display state
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [detailCar, setDetailCar] = useState<Car | null>(null);
  const [deletingCar, setDeletingCar] = useState<Car | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load from localStorage on client-side
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCars(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial mock data:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever cars change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
      } catch (e) {
        console.warn('Could not write to localStorage:', e);
      }
    }
  }, [cars, isLoaded]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Stats calculation
  const stats = useMemo(() => {
    let available = 0;
    let inUse = 0;
    let maintenance = 0;

    cars.forEach((car) => {
      if (car.status === 'AVAILABLE') available++;
      else if (car.status === 'IN_USE') inUse++;
      else if (car.status === 'MAINTENANCE') maintenance++;

    });

    return {
      total: cars.length,
      available,
      inUse,
      maintenance,
    };
  }, [cars]);

  // Filtered cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Text search
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const match =
          car.regisNumber.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.color.toLowerCase().includes(q) ||
          car.notes.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Brand filter
      if (selectedBrand && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && car.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [cars, search, selectedBrand, selectedStatus]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingCar(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: CarFormData) => {
    const now = new Date().toISOString();

    if (editingCar) {
      // Update existing car
      setCars((prev) =>
        prev.map((c) =>
          c.id === editingCar.id
            ? {
                ...c,
                ...formData,
                updatedAt: now,
              }
            : c,
        ),
      );
      showToast(`แก้ไขข้อมูลรถ ${formData.brand} ${formData.model} เรียบร้อยแล้ว`);
    } else {
      // Add new car
      const newCar: Car = {
        ...formData,
        id: `car-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: now,
        updatedAt: now,
      };
      setCars((prev) => [newCar, ...prev]);
      showToast(`เพิ่มรถยนต์ ${formData.brand} ${formData.model} เข้าสู่ระบบแล้ว`);
    }

    setIsFormOpen(false);
    setEditingCar(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingCar) return;

    setCars((prev) => prev.filter((c) => c.id !== deletingCar.id));
    showToast(`ลบข้อมูลรถยนต์ ${deletingCar.regisNumber} เรียบร้อยแล้ว`, 'info');
    setDeletingCar(null);
  };

  const handleResetData = () => {
    if (confirm('ต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่?')) {
      setCars(INITIAL_MOCK_CARS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      showToast('รีเซ็ตข้อมูลกลับเป็นตัวอย่างเริ่มต้นแล้ว', 'info');
    }
  };

  const existingPlates = useMemo(() => cars.map((c) => c.regisNumber), [cars]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro banner */}
        <div className="mb-6 rounded-2xl py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ระบบบันทึกข้อมูลรถยนต์
            </h1>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 text-white bg-blue-700 hover:bg-white hover:text-blue-700 border border-blue-700  font-bold text-sm rounded-xl shadow-xs 
            transition cursor-pointer flex items-center space-x-2 whitespace-nowrap"
          >
            <span>+</span>
            <span>เพิ่มรถยนต์ใหม่</span>
          </button>
        </div>

        {/* Fleet Statistics Overview */}
        <StatsOverview
          total={stats.total}
          available={stats.available}
          inUse={stats.inUse}
          maintenance={stats.maintenance}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
        />

        {/* Search & Filter Controls */}
        <CarFilters
          search={search}
          onSearchChange={setSearch}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          totalFiltered={filteredCars.length}
        />

        {/* Content: Table */}
        <CarTable
          cars={filteredCars}
          onView={setDetailCar}
          onEdit={handleOpenEdit}
          onDelete={setDeletingCar}
        />
      </main>

      {/* Modals */}
      <CarFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCar(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCar}
        existingPlates={existingPlates}
      />

      <CarDetailModal
        car={detailCar}
        onClose={() => setDetailCar(null)}
        onEdit={handleOpenEdit}
      />

      <DeleteModal
        car={deletingCar}
        isOpen={Boolean(deletingCar)}
        onClose={() => setDeletingCar(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toast Notification */}
      <div className={`${toast ? 'block' : 'hidden'} fixed top-6 right-6 z-50 flex items-center rounded-md shadow-lg text-sm font-medium animate-in slide-in-from-top-5 duration-500 overflow-hidden`}>
        <div className={`px-3 py-4 text-white ${toast?.type === 'success' ? 'bg-green-500' : toast?.type === 'info' ? 'bg-blue-500' : 'bg-rose-500'}`} >
          <span>{toast?.message}</span>
        </div>
      </div>
    </div>
  );
}
