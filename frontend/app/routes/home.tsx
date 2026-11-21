import { useState, useEffect, useMemo, useCallback } from "react";
import type { Route } from "./+types/home";
import type { Car, CarFormData } from "../types/car";
import { StatsOverview } from "../components/StatsOverview";
import { CarFilters } from "../components/CarFilters";
import { CarTable } from "../components/CarTable";
import { CarFormModal } from "../components/CarFormModal";
import { CarDetailModal } from "../components/CarDetailModal";
import { DeleteModal } from "../components/DeleteModal";
import { carApi } from "../services/carApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Haupcar Fleet Manager - ข้อมูลรถยนต์บริษัท" },
    {
      name: "description",
      content: "ระบบบันทึกและจัดการข้อมูลรถยนต์ บริษัท ฮ้อปคาร์ จำกัด",
    },
  ];
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & display state
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [detailCar, setDetailCar] = useState<Car | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deletingCar, setDeletingCar] = useState<Car | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      setToast({ message, type });
    },
    [],
  );

  // Fetch cars from Backend API
  const loadCarsFromApi = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await carApi.getCars();
      if (Array.isArray(data) && data.length > 0) {
        setCars(data);
      } else {
        setCars([]);
      }
      setIsLoading(false);
    } catch (err) {
      console.warn(
        "Backend API connection failed",
        err,
      );
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCarsFromApi();
  }, [loadCarsFromApi]);

  // Toast timer
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Stats calculation
  const stats = useMemo(() => {
    let available = 0;
    let inUse = 0;
    let unavailable = 0;

    cars.forEach((car) => {
      if (car.status === "AVAILABLE") available++;
      else if (car.status === "IN_USE") inUse++;
      else if (car.status === "UNAVAILABLE") unavailable++;
    });

    return {
      total: cars.length,
      available,
      inUse,
      unavailable,
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
          car.province.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.color.toLowerCase().includes(q) ||
          (car.notes && car.notes.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Brand filter
      if (
        selectedBrand &&
        car.brand.toLowerCase() !== selectedBrand.toLowerCase()
      ) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "ALL" && car.status !== selectedStatus) {
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

  const handleViewCar = async (car: Car) => {
    setIsDetailOpen(true);
    setIsLoadingDetail(true);
    setDetailCar(car);

    try {
      const freshCar = await carApi.getCarById(car.id);
      setDetailCar(freshCar);
    } catch (err: any) {
      console.error("Failed to fetch car by ID:", err);
      showToast(err.message || `ไม่สามารถดึงข้อมูลรถ ${car.regisNumber} จากระบบได้`, "error");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setDetailCar(null);
  };

  const handleFormSubmit = async (formData: CarFormData) => {
    try {
      if (editingCar) {
        const updated = await carApi.updateCar(editingCar.id, formData);
        setCars((prev) =>
          prev.map((c) => (c.id === editingCar.id ? updated : c)),
        );
        showToast(
          `แก้ไขข้อมูลรถ ${formData.brand} ${formData.model} สำเร็จ`,
          "success",
        );
      } else {
        // Create via Backend API
        const created = await carApi.createCar(formData);
        setCars((prev) => [created, ...prev]);
        showToast(
          `เพิ่มรถยนต์ ${formData.brand} ${formData.model} สำเร็จ`,
          "success",
        );
      }
      setIsFormOpen(false);
      setEditingCar(null);
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCar) return;

    try {
      await carApi.deleteCar(deletingCar.id);
      setCars((prev) => prev.filter((c) => c.id !== deletingCar.id));
      showToast(`ลบข้อมูลรถยนต์ ${deletingCar.regisNumber} สำเร็จ`, "info");
      setDeletingCar(null);
    } catch (err: any) {
      showToast(err.message || "เกิดข้อผิดพลาดในการลบข้อมูล", "error");
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
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ระบบบันทึกข้อมูลรถยนต์
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              ระบบบันทึกข้อมูลรถยนต์ที่พร้อมใช้งานภายใต้บริษัท
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 text-white bg-blue-700 hover:bg-white hover:text-blue-700 border border-blue-700 font-bold text-sm rounded-xl shadow-xs 
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
          unavailable={stats.unavailable}
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
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <CarTable
            cars={filteredCars}
            onView={handleViewCar}
            onEdit={handleOpenEdit}
            onDelete={setDeletingCar}
          />
        )}
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
        isOpen={isDetailOpen}
        car={detailCar}
        isLoading={isLoadingDetail}
        onClose={handleCloseDetail}
        onEdit={handleOpenEdit}
      />

      <DeleteModal
        car={deletingCar}
        isOpen={Boolean(deletingCar)}
        onClose={() => setDeletingCar(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toast Notification */}
      <div
        className={`${toast ? "block" : "hidden"} fixed top-6 right-6 z-50 flex items-center rounded-md shadow-lg text-sm font-medium animate-in slide-in-from-top-5 duration-500 overflow-hidden`}
      >
        <div
          className={`px-4 py-3 text-white ${toast?.type === "success" ? "bg-emerald-600" : toast?.type === "info" ? "bg-blue-600" : "bg-rose-600"}`}
        >
          <span>{toast?.message}</span>
        </div>
      </div>
    </div>
  );
}
