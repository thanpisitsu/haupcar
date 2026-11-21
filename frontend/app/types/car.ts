export type CarStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';

export interface Car {
  id: string;
  regisNumber: string;        // ทะเบียนรถ (e.g. "1กข 1234 กทม")
  province: string;           // จังหวัดที่จดทะเบียน (e.g. "กรุงเทพมหานคร", "เชียงใหม่")
  brand: string;              // ยี่ห้อรถ (e.g. "Toyota", "Honda")
  model: string;              // รุ่นรถ (e.g. "Yaris Ativ", "Civic")
  year: number;               // ปีที่ผลิต
  color: string;              // สีรถ
  seats: number;              // จำนวนที่นั่ง
  fuelType: 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric'; // ชนิดเชื้อเพลิง
  status: CarStatus;          // สถานะ (AVAILABLE, IN_USE, MAINTENANCE)
  notes: string;              // หมายเหตุ
  createdAt: string;
  updatedAt: string;
}

export type CarFormData = Omit<Car, 'id' | 'createdAt' | 'updatedAt'>;
