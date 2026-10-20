import React, { useState, useEffect } from 'react';
import {
  Zap,
  ShoppingBag,
  Bike,
  Flame,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  TrendingDown,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CarbonData, UserProfile } from '../types';
import { storage } from '../utils/storage';

interface CarbonCalculatorViewProps {
  currentUser: UserProfile;
  onSavedLog?: () => void;
  onNavigateToJournal?: () => void;
}

export const CarbonCalculatorView: React.FC<CarbonCalculatorViewProps> = ({
  currentUser,
  onSavedLog,
  onNavigateToJournal,
}) => {
  // Màn hình ban đầu hiển thị số liệu bằng 0 hoặc trống theo yêu cầu mục 4
  const [electricityKwh, setElectricityKwh] = useState<number>(0);
  const [singleUsePlasticCount, setSingleUsePlasticCount] = useState<number>(0);
  const [petrolMotorbikeKm, setPetrolMotorbikeKm] = useState<number>(0);
  const [electricBikeKm, setElectricBikeKm] = useState<number>(0);
  const [busKm, setBusKm] = useState<number>(0);
  const [bicycleWalkingKm, setBicycleWalkingKm] = useState<number>(0);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load stored carbon data if available
  useEffect(() => {
    const stored = storage.getCarbonData();
    if (stored) {
      setElectricityKwh(stored.electricityKwh || 0);
      setSingleUsePlasticCount(stored.singleUsePlasticCount || 0);
      setPetrolMotorbikeKm(stored.petrolMotorbikeKm || 0);
      setElectricBikeKm(stored.electricBikeKm || 0);
      setBusKm(stored.busKm || 0);
      setBicycleWalkingKm(stored.bicycleWalkingKm || 0);
    }
  }, []);

  // Công thức tính toán thời gian thực chuẩn:
  // - Điện năng tiêu thụ: kWh * 0.8 kg CO2e
  // - Rác thải nhựa dùng 1 lần: Số sản phẩm * 0.075 kg CO2e
  // - Giao thông: km xe máy xăng * 0.08 kg CO2e, km xe điện * 0.02 kg CO2e, bus/xe đạp/đi bộ = 0 kg CO2e
  const co2Electricity = Number((electricityKwh * 0.8).toFixed(3));
  const co2Plastic = Number((singleUsePlasticCount * 0.075).toFixed(3));
  const co2PetrolBike = Number((petrolMotorbikeKm * 0.08).toFixed(3));
  const co2ElectricBike = Number((electricBikeKm * 0.02).toFixed(3));
  const co2GreenTransport = 0; // Bus, xe đạp, đi bộ = 0 kg CO2e

  const co2TransportTotal = Number((co2PetrolBike + co2ElectricBike + co2GreenTransport).toFixed(3));
  const totalCo2Weekly = Number((co2Electricity + co2Plastic + co2TransportTotal).toFixed(3));
  const totalCo2Yearly = Number((totalCo2Weekly * 52).toFixed(1));

  // Tự động lưu giá trị tính toán vào storage
  useEffect(() => {
    const carbonPayload: CarbonData = {
      electricityKwh,
      singleUsePlasticCount,
      petrolMotorbikeKm,
      electricBikeKm,
      busKm,
      bicycleWalkingKm,
      totalKgCO2e: totalCo2Weekly,
      updatedAt: new Date().toISOString(),
    };
    storage.saveCarbonData(carbonPayload);
  }, [electricityKwh, singleUsePlasticCount, petrolMotorbikeKm, electricBikeKm, busKm, bicycleWalkingKm, totalCo2Weekly]);

  // Phân tích điểm nóng phát thải (Emission Hotspot)
  let hotspot = 'Chưa có số liệu phát thải';
  let hotspotAdvice = 'Hãy nhập các chỉ số tiêu thụ điện, rác thải nhựa và phương tiện di chuyển hàng tuần để xem kết quả phân tích thời gian thực.';
  let hotspotColor = 'text-slate-500';

  if (totalCo2Weekly > 0) {
    if (co2Electricity >= co2Plastic && co2Electricity >= co2TransportTotal) {
      hotspot = 'Tiêu thụ Điện năng (Điện lưới)';
      hotspotAdvice = `Điện năng chiếm ${Math.round((co2Electricity / totalCo2Weekly) * 100)}% lượng phát thải của bạn. Hãy tắt quạt, điều hòa và bóng đèn khi ra khỏi phòng học, tận dụng tối đa ánh sáng và gió tự nhiên.`;
      hotspotColor = 'text-amber-500';
    } else if (co2Plastic >= co2Electricity && co2Plastic >= co2TransportTotal) {
      hotspot = 'Rác thải Nhựa dùng 1 lần';
      hotspotAdvice = `Đồ nhựa dùng một lần chiếm ${Math.round((co2Plastic / totalCo2Weekly) * 100)}% lượng phát thải. Hãy mang theo bình nước cá nhân, hộp cơm inox tái sử dụng để cắt giảm triệt để chai nhựa và túi nilon.`;
      hotspotColor = 'text-rose-500';
    } else {
      hotspot = 'Phương tiện Giao thông dùng Xăng';
      hotspotAdvice = `Giao thông chiếm ${Math.round((co2TransportTotal / totalCo2Weekly) * 100)}% lượng phát thải. Hãy ưu tiên đi bộ, đi xe đạp hoặc sử dụng xe điện đi học để đưa phát thải về mức 0 kg CO2e!`;
      hotspotColor = 'text-orange-500';
    }
  }

  // Cấp độ Sinh thái
  let ecoLevel = { title: 'Mầm Xanh (Khởi đầu)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300' };
  if (totalCo2Weekly === 0) {
    ecoLevel = { title: 'Chưa tính toán (0 kg CO2e)', color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300' };
  } else if (totalCo2Weekly < 5) {
    ecoLevel = { title: 'Lớp Học Xanh Xuất Sắc (Thấp)', color: 'bg-emerald-500/20 text-emerald-600 border-emerald-400 dark:text-emerald-300' };
  } else if (totalCo2Weekly <= 15) {
    ecoLevel = { title: 'Mức Trung Bình Học Đường', color: 'bg-blue-500/20 text-blue-600 border-blue-400 dark:text-blue-300' };
  } else {
    ecoLevel = { title: 'Cảnh Báo Phát Thải Cao', color: 'bg-rose-500/20 text-rose-600 border-rose-400 dark:text-rose-300' };
  }

  const handleReset = () => {
    setElectricityKwh(0);
    setSingleUsePlasticCount(0);
    setPetrolMotorbikeKm(0);
    setElectricBikeKm(0);
    setBusKm(0);
    setBicycleWalkingKm(0);
  };

  const handleSaveToJournal = () => {
    storage.addLog({
      id: 'log_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      actionType: 'electricity',
      title: `Ghi nhận Dấu chân Carbon tuần: ${totalCo2Weekly} kg CO2e`,
      description: `Điện: ${electricityKwh} kWh (${co2Electricity} kg CO2e) | Nhựa: ${singleUsePlasticCount} SP (${co2Plastic} kg CO2e) | Đi lại: ${co2TransportTotal} kg CO2e`,
      savedCO2Kg: Math.max(0, Number((12.5 - totalCo2Weekly).toFixed(2))),
      points: totalCo2Weekly > 0 && totalCo2Weekly < 10 ? 30 : 15,
      date: new Date().toISOString().split('T')[0],
    });
    setSavedSuccess(true);
    if (onSavedLog) onSavedLog();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-[#0A192F] to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" /> Mô phỏng Thời Gian Thực (Real-time Carbon Footprint)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mô phỏng Dấu chân Carbon Cá nhân & Lớp học
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Hệ thống tính toán thời gian thực theo tiêu chuẩn khí thải học đường Việt Nam. Nhập số liệu trực tiếp hoặc kéo thanh trượt để phát hiện điểm nóng phát thải.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Đặt lại (0)
            </button>
            <button
              onClick={handleSaveToJournal}
              disabled={totalCo2Weekly === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                totalCo2Weekly === 0
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 hover:scale-105'
              }`}
            >
              <CheckCircle className="w-4 h-4" /> Lưu vào Nhật ký Xanh
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Đã lưu dữ liệu mô phỏng vào Nhật ký Xanh của <strong>{currentUser.name}</strong> thành công!
            </span>
            {onNavigateToJournal && (
              <button
                onClick={onNavigateToJournal}
                className="underline text-emerald-300 hover:text-white font-semibold"
              >
                Xem Nhật ký & Xuất chứng nhận →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Modules (8 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Module 1: Điện năng tiêu thụ */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    1. Điện năng tiêu thụ (Lớp học / Nhà)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hệ số phát thải điện lưới Việt Nam: <strong>1 kWh = 0.8 kg CO2e</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                  {co2Electricity} kg CO2e
                </span>
                <span className="block text-[11px] text-slate-400">tuần</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Số điện tiêu thụ (kWh/tuần):
                </label>
                {/* Input số trực tiếp song song slider theo mục 4 */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="0.5"
                    value={electricityKwh || ''}
                    placeholder="0"
                    onChange={(e) => setElectricityKwh(Math.max(0, Number(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">kWh</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={electricityKwh}
                onChange={(e) => setElectricityKwh(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 kWh (Tắt hết)</span>
                <span>25 kWh (Trung bình lớp)</span>
                <span>50 kWh</span>
                <span>100 kWh</span>
              </div>
            </div>
          </div>

          {/* Module 2: Rác thải nhựa dùng một lần */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    2. Rác thải nhựa dùng 1 lần
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chai nhựa, ly trà sữa, hộp xốp, túi nilon: <strong>1 sản phẩm = 0.075 kg CO2e</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                  {co2Plastic} kg CO2e
                </span>
                <span className="block text-[11px] text-slate-400">tuần</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Số món đồ nhựa dùng 1 lần (cái/tuần):
                </label>
                {/* Input số trực tiếp song song slider theo mục 4 */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={singleUsePlasticCount || ''}
                    placeholder="0"
                    onChange={(e) => setSingleUsePlasticCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm text-center focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">món</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={singleUsePlasticCount}
                onChange={(e) => setSingleUsePlasticCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 món (Zero Plastic)</span>
                <span>10 món</span>
                <span>25 món</span>
                <span>50 món</span>
              </div>
            </div>
          </div>

          {/* Module 3: Giao thông đi học */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    3. Giao thông đi học hàng ngày
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Xe xăng: <strong>0.08 kg CO2e/km</strong> | Xe điện: <strong>0.02 kg CO2e/km</strong> | Xe đạp/Đi bộ: <strong>0 kg CO2e</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  {co2TransportTotal} kg CO2e
                </span>
                <span className="block text-[11px] text-slate-400">tuần</span>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {/* Xe máy xăng */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    🛵 Xe máy xăng phụ huynh đưa đón (km/tuần):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={petrolMotorbikeKm || ''}
                      placeholder="0"
                      onChange={(e) => setPetrolMotorbikeKm(Math.max(0, Number(e.target.value) || 0))}
                      className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs text-center"
                    />
                    <span className="text-xs text-slate-500">km</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={petrolMotorbikeKm}
                  onChange={(e) => setPetrolMotorbikeKm(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Xe đạp điện / Xe máy điện */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    ⚡ Xe đạp điện / Xe máy điện (km/tuần):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={electricBikeKm || ''}
                      placeholder="0"
                      onChange={(e) => setElectricBikeKm(Math.max(0, Number(e.target.value) || 0))}
                      className="w-20 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs text-center"
                    />
                    <span className="text-xs text-slate-500">km</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={electricBikeKm}
                  onChange={(e) => setElectricBikeKm(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Xe buýt / Xe đạp / Đi bộ */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    🚲 Đi bộ / Xe đạp / Xe buýt (Không phát thải CO2e):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={bicycleWalkingKm || ''}
                      placeholder="0"
                      onChange={(e) => setBicycleWalkingKm(Math.max(0, Number(e.target.value) || 0))}
                      className="w-20 px-2 py-1 rounded border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs text-center"
                    />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">km</span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                  🌟 Đi bộ hoặc đạp xe giúp bạn đạt huy hiệu "Kiện tướng Giao thông Xanh" và giảm 100% khí thải di chuyển!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Analysis, Charts & Hotspot (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Total Score Card */}
          <div className="bg-gradient-to-br from-[#0A192F] via-slate-900 to-[#107941] rounded-2xl p-6 text-white shadow-xl border border-emerald-500/40 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Dấu chân Carbon thời gian thực
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${ecoLevel.color}`}>
                {ecoLevel.title}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-emerald-400">
                {totalCo2Weekly}
              </span>
              <span className="text-slate-300 text-sm font-semibold">kg CO2e / tuần</span>
            </div>

            <div className="mt-2 text-xs text-slate-300 flex items-center gap-2">
              <span>Tương đương ước tính:</span>
              <strong className="text-amber-300 text-sm">{totalCo2Yearly} kg CO2e / năm</strong>
            </div>

            {/* Visual Progress Bar Breakdown */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-300">
                <span>Cơ cấu thành phần phát thải:</span>
                <span>{totalCo2Weekly > 0 ? '100%' : '0%'}</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                {totalCo2Weekly > 0 ? (
                  <>
                    <div
                      style={{ width: `${(co2Electricity / totalCo2Weekly) * 100}%` }}
                      className="bg-amber-500 transition-all duration-500"
                      title={`Điện: ${co2Electricity} kg`}
                    />
                    <div
                      style={{ width: `${(co2Plastic / totalCo2Weekly) * 100}%` }}
                      className="bg-rose-500 transition-all duration-500"
                      title={`Nhựa: ${co2Plastic} kg`}
                    />
                    <div
                      style={{ width: `${(co2TransportTotal / totalCo2Weekly) * 100}%` }}
                      className="bg-blue-500 transition-all duration-500"
                      title={`Giao thông: ${co2TransportTotal} kg`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-slate-700 text-center text-[9px] text-slate-400 flex items-center justify-center">
                    Chưa có phát thải
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Điện ({co2Electricity}kg)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Nhựa ({co2Plastic}kg)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Đi lại ({co2TransportTotal}kg)
                </span>
              </div>
            </div>
          </div>

          {/* Emission Hotspot (Điểm nóng phát thải) Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Điểm nóng phát thải (Emission Hotspot)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Phát hiện tự động khu vực cần can thiệp cấp bách
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${hotspotColor}`} />
                <span className={`text-sm font-bold ${hotspotColor}`}>{hotspot}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {hotspotAdvice}
              </p>
            </div>
          </div>

          {/* Equivalent Ecological Impact Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              Quy đổi bù đắp sinh thái cần thiết
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {totalCo2Yearly > 0 ? Math.ceil(totalCo2Yearly / 22) : 0}
                </span>
                <span className="block text-[11px] text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">
                  Cây xanh cần trồng để hấp thụ hết CO2 / năm
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
                <span className="text-2xl font-black text-blue-700 dark:text-blue-300">
                  {Math.round(totalCo2Weekly * 1.25)}
                </span>
                <span className="block text-[11px] text-blue-800 dark:text-blue-400 font-medium mt-0.5">
                  Điểm thưởng sinh thái dự kiến
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              1 cây xanh trưởng thành hấp thụ trung bình khoảng 22 kg CO2 mỗi năm theo dữ liệu UNEP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
