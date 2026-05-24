import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Truck, RefreshCw, Compass } from 'lucide-react';
import { Language, Theme } from '../types';

interface TrackingMapProps {
  language: Language;
  theme: Theme;
  customerName: string;
  customerArea: 'inside' | 'outside';
  courierProgress: number; // 0 to 100
  customerLat?: number;
  customerLng?: number;
}

export default function TrackingMap({
  language,
  theme,
  customerName,
  customerArea,
  courierProgress,
  customerLat,
  customerLng,
}: TrackingMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // BD Central Grooming hub: Tejgaon, Dhaka Approx Coords
  const hubCoords = { lat: 23.7808, lng: 90.4125 };

  // Set default simulated customer coords based on area if user GPS not provided
  useEffect(() => {
    if (customerLat && customerLng) {
      setCoords({ lat: customerLat, lng: customerLng });
    } else {
      if (customerArea === 'inside') {
        // Mirpur / Uttara approx
        setCoords({ lat: 23.8223, lng: 90.3654 });
      } else {
        // Gazipur / Chittagong approx
        setCoords({ lat: 24.0001, lng: 90.4256 });
      }
    }
  }, [customerArea, customerLat, customerLng]);

  // Request real-time location to place on tracking map
  const requestGeoLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'bn' ? 'জিপিএস সাপোর্ট করে না' : 'Geolocation is not supported');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGpsLoading(false);
      },
      (error) => {
        console.warn("GPS lookup denied/error:", error);
        setGpsError(
          language === 'bn'
            ? 'লোকেশান পারমিশন ব্যর্থ (সিমুলেটেড জিপিএস চলমান)'
            : 'Access denied. Using simulated location.'
        );
        setGpsLoading(false);
      },
      { timeout: 7000 }
    );
  };

  // Draw the customized tracking route on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution ratios
    const width = 450;
    const height = 240;

    // Styling properties based on theme
    const isDark = theme === 'dark';
    const gridColor = isDark ? '#1C1E22' : '#f1f5f9';
    const bgMap = isDark ? '#0F1113' : '#fafafa';
    const roadColor = isDark ? '#24282D' : '#cbd5e1';
    const routeColor = '#f59e0b'; // Amber-500 highlight
    const textThemeColor = isDark ? '#94a3b8' : '#64748b';

    // Map base background
    ctx.fillStyle = bgMap;
    ctx.fillRect(0, 0, width, height);

    // Draw grid mesh lines for realistic map look
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw some landmark roads
    ctx.strokeStyle = roadColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'butt'; // Geometric crisp edge
    ctx.lineJoin = 'miter';

    // Road A (Vertical main)
    ctx.beginPath();
    ctx.moveTo(80, 20);
    ctx.lineTo(80, height - 20);
    ctx.stroke();

    // Road B (Horizontal main)
    ctx.beginPath();
    ctx.moveTo(20, height / 2);
    ctx.lineTo(width - 20, height / 2);
    ctx.stroke();

    // Road C (Diagonal auxiliary)
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(width - 40, height - 40);
    ctx.stroke();

    // Coordinates mapping to canvas spacing
    const hubX = 80;
    const hubY = height / 2; // Midpoint
    const destX = width - 100;
    const destY = height - 120; // Bottom right area

    // Draw Route Path (Curved for beautiful display)
    ctx.beginPath();
    ctx.moveTo(hubX, hubY);
    // Control point for quadratic curve
    const ctrlX = (hubX + destX) / 2 + 50;
    const ctrlY = (hubY + destY) / 2 - 80;
    ctx.quadraticCurveTo(ctrlX, ctrlY, destX, destY);
    ctx.strokeStyle = routeColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]); // Crisper dashed track
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw Hub (Men's Grooming BD Headquarters marker)
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
    ctx.fillStyle = '#f59e0b'; // Amber-500
    ctx.beginPath();
    ctx.arc(hubX, hubY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(hubX, hubY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Destination (User delivery address pin)
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    ctx.beginPath();
    ctx.arc(destX, destY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(destX, destY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Text labels
    ctx.shadowBlur = 0; // reset shadow
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#ffffff' : '#1e293b';
    ctx.fillText("MGBD Hub (Tejgaon)", hubX - 10, hubY - 18);

    ctx.fillText(`${customerName}`, destX - 30, destY + 22);

    // Calculate current courier scooter node position along the curve
    const t = courierProgress / 100;
    // Quadratic Bézier curve point equation: B(t) = (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
    const currentX = (1 - t) * (1 - t) * hubX + 2 * (1 - t) * t * ctrlX + t * t * destX;
    const currentY = (1 - t) * (1 - t) * hubY + 2 * (1 - t) * t * ctrlY + t * t * destY;

    // Draw Courier Moving Pin
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.fillStyle = '#ffffff'; // High-contrast core scooter
    ctx.beginPath();
    ctx.arc(currentX, currentY, 11, 0, Math.PI * 2);
    ctx.fill();

    // Draw Courier Marker Inner Indicator
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Label with courier progress above the car
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`TRANSIT (${courierProgress}%)`, currentX - 35, currentY - 18);

    // Draw water bodies or landscape decorations
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(100, 116, 139, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.fillText("Hajiganj Lake", width / 2 - 30, 45);
    ctx.fillText("Dhaka Express Road", width / 2 + 20, height - 40);

  }, [theme, courierProgress, coords, customerName]);

  return (
    <div id="tracking-map-wrapper" className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-geo-dark border-geo-border text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-display font-bold text-sm flex items-center gap-2">
            <Compass className="w-5 h-5 text-geo-amber animate-spin" />
            {language === 'bn' ? 'লাইভ লোকেশন ট্র্যাকিং ম্যাপ' : 'Live Delivery Routing & Tracking'}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' 
              ? 'হাব থেকে আপনার হোম এড্রেস পর্যন্ত ডেলিভারির লাইভ চিত্র' 
              : 'Live spatial visualization of package routes to your doorstep'}
          </p>
        </div>
        
        <button
          id="tracking-map-gps-btn"
          onClick={requestGeoLocation}
          disabled={gpsLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            theme === 'dark' 
              ? 'bg-geo-amber text-geo-black' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
          {language === 'bn' ? 'আমার জিপিএস যোগ করুন' : 'Locate My GPS'}
        </button>
      </div>

      {gpsError && (
        <div className="mb-3 px-3 py-2 rounded-lg text-xs bg-amber-50 dark:bg-amber-955/20 text-geo-amber border border-amber-500/20">
          ⚠️ {gpsError}
        </div>
      )}

      {/* Geolocation visual markers */}
      <div className={`grid grid-cols-2 gap-4 mb-3 text-xs p-3 rounded-lg border font-mono ${theme === 'dark' ? 'bg-geo-black border-geo-border' : 'bg-slate-50 border-slate-200'}`}>
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase">
            {language === 'bn' ? 'মেনস গ্রুমিং হাব' : 'CENTRAL HUB'}
          </p>
          <p className="mt-0.5 font-bold">Tejgaon, Dhaka-1208</p>
          <p className="text-[10px] text-slate-400 mt-0.5">23.7808° N, 90.4125° E</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase">
            {language === 'bn' ? 'ডেলিভারি গন্তব্য' : 'DELIVERY LOCATION'}
          </p>
          <p className="mt-0.5 truncate font-bold">
            {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : 'Calculating Coordinates...'}
          </p>
          <p className="text-geo-amber text-[10px] mt-0.5 font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 animate-bounce" />
            {courierProgress === 100 
              ? (language === 'bn' ? 'ডেলিভারি সম্পন্ন!' : 'Arrived at Destination!') 
              : (language === 'bn' ? 'কুরিয়ার পথে রয়েছে' : 'Transit on Road')}
          </p>
        </div>
      </div>

      {/* Interactive Map Canvas */}
      <div className={`relative rounded-lg overflow-hidden border shadow-inner ${theme === 'dark' ? 'border-geo-border' : 'border-slate-200'}`}>
        <canvas
          id="tracking-canvas"
          ref={canvasRef}
          width={450}
          height={240}
          className="w-full h-auto block"
        />
        
        {/* Overlaid Float notification */}
        <div className="absolute top-3 left-3 bg-geo-black/90 backdrop-blur text-white px-3 py-1.5 rounded text-[10px] flex items-center gap-1.5 border border-white/10 font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-geo-amber animate-ping" />
          {language === 'bn' ? 'অর্ডার ট্র্যাকিং কোড:' : 'TRACKING ID:'} MGBD-2026-X
        </div>
      </div>
    </div>
  );
}
