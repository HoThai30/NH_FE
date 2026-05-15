import React, { useEffect, useState } from "react";
import api, { postAPI, dentalServiceAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [activePosts, setActivePosts] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [servicePage, setServicePage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [booking, setBooking] = useState({
    patientName: user?.name || "",
    patientPhone: user?.phone || "",
    appointmentTime: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [p, a, s] = await Promise.all([
          postAPI.getAllPublished(),
          postAPI.getAllActive(),
          dentalServiceAPI.getAll(),
        ]);
        setPosts(p.data || []);
        setActivePosts(a.data || []);
        setServices(s.data || []);
      } catch (error) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const validateBooking = () => {
    const nextErrors = {};
    if (!booking.patientName.trim())
      nextErrors.patientName = "Vui lòng nhập họ tên";
    if (!booking.patientPhone.trim())
      nextErrors.patientPhone = "Vui lòng nhập số điện thoại";
    if (!booking.appointmentTime)
      nextErrors.appointmentTime = "Vui lòng chọn thời gian";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!validateBooking()) return;

    setSubmitting(true);
    try {
      await api.post("/appointments/anonymous", {
        patientName: booking.patientName,
        patientPhone: booking.patientPhone,
        appointmentTime: booking.appointmentTime,
        consultationNeeds: booking.reason,
      });

      alert("Đặt lịch thành công");
      setModalOpen(false);
      setBooking((prev) => ({
        ...prev,
        appointmentTime: "",
        reason: "",
      }));
    } catch (err) {
      alert("Đặt lịch thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

 const hero = "/uploads/anhhero1.jpg";
 const about = "/uploads/anhbia.jpg"

 const [galleryPage, setGalleryPage] = useState(0);
 const galleryImages = [
  "/uploads/khachhang3.jpg",
  "/uploads/khachhang2.jpg",
  "/uploads/khachhang1.jpg",
  "/uploads/khachhang4.jpg",
  "/uploads/khachhang5.jpg",
  "/uploads/khachhang6.jpg",
  "/uploads/khachhang7.jpg",
  "/uploads/khachhang8.jpg",
  "/uploads/khachhang9.jpg",
  "/uploads/khachhang10.jpg",
 ]

const map = "/uploads/map.jpg";

 const totalGalleryPages = Math.ceil(galleryImages.length / 5);
 const currentGallery = galleryImages.slice(galleryPage * 5, galleryPage * 5+5);

 const servicesPerPage = 4;
 const totalServicePages = Math.max(1, services.length - servicesPerPage + 1);
 const currentServices = services.slice(servicePage, servicePage + servicesPerPage);

 useEffect(() => {
   if (servicePage > totalServicePages - 1) {
     setServicePage(totalServicePages - 1);
   }
 }, [servicePage, totalServicePages]);

const serviceCards = isLoading ? (
   <div className="text-white/50 py-8">Đang tải dịch vụ...</div>
 ) : currentServices.length > 0 ? (
   currentServices.map((service) => (
     <div
       key={service.id}
       className="rounded-2xl overflow-hidden flex flex-col bg-white transition hover:-translate-y-1 hover:shadow-xl"
       style={{ boxShadow: "0 4px 18px rgba(0,0,0,0.15)" }}
     >
       <div
          className="relative w-full h-[150px] sm:h-[180px] overflow-hidden"
          style={{ backgroundColor: "#f5ede6" }}
        >
          {service.imgService ? (
            <>
              {/* Background blur */}
              <img
                src={service.imgService}
                alt={service.name}
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
              />

              {/* Overlay nhẹ */}
              <div className="absolute inset-0 bg-black/5" />

              {/* Main image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-3">
                <img
                  src={service.imgService}
                  alt={service.name}
                  className="max-w-full max-h-full object-contain transition duration-500 group-hover:scale-105 drop-shadow-2xl"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-xs">
              Chưa có ảnh
            </div>
          )}
        </div>
        
       <div className="px-3 sm:px-4 py-3 sm:py-4 flex flex-col flex-1">
         <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#1a0500] mb-1">
           {service.category || "Nha Khoa"}
         </p>

         <p className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 min-h-[32px] sm:min-h-[40px]">
           {service.name}
         </p>

         <p className="text-gray-400 text-[10px] sm:text-xs mt-1 line-clamp-3 min-h-[36px] sm:min-h-[48px]">
           {service.description || "Dịch vụ nha khoa chuyên nghiệp"}
         </p>

         <p className="font-black text-gray-900 text-xs sm:text-sm mt-auto">
           {formatPrice(service.price)}
         </p>
       </div>
     </div>
   ))
 ) : (
   <div className="text-white/50 py-8">
     {error || "Đang cập nhật dịch vụ nha khoa"}
   </div>
 );



  return (
    <div className="bg-white text-sm">

      {/* HERO */}
      <div
        style={{ backgroundColor: "#2b0202" }}
        className="w-full min-h-screen text-white"
      >
          {/* chữ mờ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{zIndex: 0}}>
              <div className="text-center font-black text-white leading-none" style={{opacity: 0.05, fontFamily: "serif"}}>
                <div style={{fontSize: "clamp(60px, 11vw, 150px)", letterSpacing: "0.08em"}}>Á CHÂU</div>
                <div style={{fontSize: "clamp(50px, 9vw, 120px)", letterSpacing: "0.15em"}}>II</div>
              </div>
        </div>

        {/* HERO BODY */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 md:py-16 flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12">
          
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5">

            {/* Badge */}
            <div
                className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl w-fit shadow-lg"
                style={{
                  backgroundColor: "rgba(82, 1, 1, 0.8)",
                  boxShadow: "0 0 20px rgba(212, 168, 67, 0.6)" // ánh vàng
                }}
              >
                <div className="w-8 sm:w-9 lg:w-10 h-8 sm:h-9 lg:h-10 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/uploads/logo.jpg"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-yellow-400">
                    Nha Khoa Á Châu II
                  </p>
                  <p className="text-[10px] sm:text-xs text-white">
                    Nha khoa • Đại Lộc
                  </p>
                </div>
              </div>

            {/* Info */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs bg-white/10">
                ⭐ 4.9/5 Google Maps
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs bg-white/10">
                💬 2.1K+ đánh giá
              </span>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs bg-white/10">
                🕐 08:00 – 20:00
              </span>
            </div>

            {/* Sub title */}
            <p className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-yellow-400 font-medium">
              Niềng Răng • Cấy Implant • Thẩm Mỹ Nụ Cười
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight sm:leading-none font-serif">
              Nha Khoa <br className="hidden sm:block" /> Á Châu II
            </h1>

            {/* Description */}
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-md">
               Chăm sóc răng miệng toàn diện tại nha khoa quốc tế Á Châu II với đội ngũ bác sĩ chuyên môn cao và công nghệ hiện đại.
            </p>
          </div>
          <div className="flex-1 w-full sm:w-auto">
      <div
        className="relative rounded-[28px] overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl"
      >

    {/* IMAGE */}
    <div className="relative">

      <img
        src={hero}
        alt="Nha khoa Á Châu"
        className="w-full h-[260px] sm:h-[360px] md:h-[500px] object-cover"
        style={{ objectPosition: "40% 60%" }}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* FLOATING MINI TAG */}
      <div
        className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 bg-primaryDark backdrop-blur-xl border border-white/15 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 shadow-xl"
      >
        <div className="flex items-center gap-2">

          {/* dot */}
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />

          <p
            className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-yellow-400 whitespace-nowrap"
          >
            Nha khoa chuẩn<br/> quốc tế  
          </p>
        </div>
      </div>

          {/* FLOATING MINI TAGS */}
          <div
            className="absolute left-3 right-3 bottom-3 sm:left-6 sm:right-6 sm:bottom-6 flex gap-2 sm:gap-3"
          >
            {/* TAG 1 */}
            <div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white shadow-xl"
            >
              <span className="text-sm sm:text-base">🦷</span>

              <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                Công nghệ hiện đại
              </span>
            </div>

            {/* TAG 2 */}
            <div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white shadow-xl"
            >
              <span className="text-sm sm:text-base"> ✨</span>

              <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                Chuẩn quốc tế
              </span>
            </div>

            {/* TAG 3 */}
            <div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 text-white shadow-xl"
            >
              <span className="text-sm sm:text-base">👨‍⚕️</span>

              <span className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                Bác sĩ tận tâm
              </span>
            </div>
          </div>
          </div>
          </div>
          </div>
        </div>
      </div>

  {/* ABOUT */}
        <div className="relative overflow-hidden py-10 sm:py-14 lg:py-18 bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-50">

          {/* BACKGROUND GLOW */}
          <div className="absolute top-0 left-0 w-60 h-60 bg-yellow-300/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full" />

          <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* IMAGE */}
              <div className="relative group">

                {/* glow */}
                <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-[28px] group-hover:scale-105 transition duration-700" />

                {/* image */}
                <div className="relative overflow-hidden rounded-[24px] border-4 border-white shadow-2xl">

                  <img
                    src={about}
                    alt="Nha khoa Á Châu"
                    className="h-[240px] sm:h-[340px] lg:h-[430px] w-full object-cover group-hover:scale-105 transition duration-700"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                  {/* floating badge */}
                  <div
                    className=" absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl"
                  >
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">
                      Khách hàng hài lòng
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <h3 className="text-xl font-black text-primaryDark">
                        5000+
                      </h3>

                      <span className="text-yellow-500 text-sm">
                        ⭐⭐⭐⭐⭐
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div>

                {/* BADGE */}
                <div
                  className="inline-flex items-center gap-2 bg-yellow-200 text-primaryDark px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold shadow-sm mb-4"
                >
                  ✨ Hơn 10 năm chăm sóc nụ cười Việt
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Chúng tôi mang đến trải nghiệm nha khoa hiện đại,
                  an toàn và cá nhân hóa với đội ngũ bác sĩ chuyên môn cao
                  cùng công nghệ điều trị tiên tiến.
                </p>

                {/* FEATURES */}
                <div className="space-y-4 mt-6">

                  <div className="flex items-start gap-3">
                    <div
                      className=" w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-base flex-shrink-0"
                    >
                      👨‍⚕️
                    </div>

                    <div>
                      <h4 className="font-bold text-primaryDark text-sm">
                        Bác sĩ giàu kinh nghiệm
                      </h4>

                      <p className="text-gray-500 text-sm mt-1">
                        Điều trị tận tâm theo từng tình trạng riêng biệt.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-bas flex-shrink-0"
                    >
                      🦷
                    </div>

                    <div>
                      <h4 className="font-bold text-primaryDark text-sm">
                        Công nghệ hiện đại
                      </h4>

                      <p className="text-gray-500 text-sm mt-1">
                        Thiết bị tiên tiến giúp điều trị nhẹ nhàng hơn.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className=" w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-base flex-shrink-0"
                    >
                      💎
                    </div>

                    <div>
                      <h4 className="font-bold text-primaryDark text-sm">
                        Dịch vụ chuẩn quốc tế
                      </h4>

                      <p className="text-gray-500 text-sm mt-1">
                        Không gian sang trọng và quy trình chuyên nghiệp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* REVIEW */}
                <div
                  className=" mt-6 bg-white rounded-2xl p-4 shadow-lg border border-yellow-100"
                >
                  <p className="text-gray-600 italic leading-relaxed text-sm">
                    “Bác sĩ tư vấn rất tận tình, không gian sạch đẹp và dịch vụ cực kỳ chuyên nghiệp.”
                  </p>

                  <div className="flex items-center justify-between mt-4">

                     <div className="flex items-center gap-3 mt-3">

                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-300 flex items-center justify-center font-bold text-[#2b0202] text-sm  sm:text-base "
                      >
                        M
                      </div>

                      <div>
                        <p className="font-bold text-xs sm:text-sm text-[#2b0202]">
                          Minh Anh
                        </p>

                        <p className="text-[10px] sm:text-[11px] text-gray-500">
                          Khách hàng Implant
                        </p>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm">
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-3 mt-6">

                  <button
                    onClick={() => setModalOpen(true)}
                    className=" px-5 sm:px-7 py-3 rounded-2xl text-sm font-bold shadow-xl transition hover:scale-105 text-black"
                    style={{
                      background:
                        "linear-gradient(135deg, #D4A843 0%, #f0c96a 100%)",
                    }}
                  >
                    Đặt lịch ngay
                  </button>

                  <button
                  onClick={() => {
                    document.getElementById("dich-vu")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-primaryDark/20 text-primaryDark font-semibol hover:bg-white transition"
                >
                  Xem dịch vụ
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
       {/* Hinh anh khach hang*/}
      <div id="gallery" className="py-16 px-6" style={{backgroundColor: "#f5ede6"}}>
          <div className="max-w-[1100px] mx-auto">

            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] uppercase mb-2" style={{color:"#8B5E3C"}}> Gallery thực tế</p>
                <h2 className="text-3xl font-black leading-tight" style={{color:"#1a0a00", fontFamily:"serif", maxWidth: 400}}>
                  Nụ cười thật<br/> khách hàng thật.
                </h2>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setGalleryPage(p => Math.max(0, p-1))}
                        disabled={setGalleryPage ===0}
                        className="w-10 h-10 rounded-full flex items-center justify-center border text-lg font-bold transition"
                        style={{backgroundColor: galleryPage === 0? "#e8d8cc" : "white", color: galleryPage === 0? "#b0907a":"#1a0a00", borderColor:"d6c4b0", cursor: galleryPage ===0?"default": "pointer"}}
                  >   ← </button>
                <button onClick={() => setGalleryPage(p => Math.min(totalGalleryPages -1, p+1))}
                        disabled={galleryPage === totalGalleryPages -1}
                        className="w-10 h-10 rounded-full flex items-center justify-center border text-lg font-bold transition"
                        style={{backgroundColor: galleryPage === totalGalleryPages -1? "#e8d8cc" : "white", color: galleryPage === totalGalleryPages -1? "#b0907a":"#1a0a00", borderColor:"d6c4b0", cursor: galleryPage ===totalGalleryPages -1?"default": "pointer"}}
                  >   → </button>
              </div>
            </div>

              <div className=" grid grid-rows-2 gap-3" style={{height:480 , gridTemplateColumns: "3fr 1.1fr 1.1fr"}}>
                <div className="relative row-span-2 rounded-3xl overflow-hidden col-span-1">
                  <img src= {currentGallery[0]} alt="khách hàng 1" 
                  className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{backgroundColor: "rgba(255,255,255,0.88)", color: "#1a0a00"}}>
                          Ảnh khách hàng
                  </div>
                </div>
                
                <div className="rounded-3xl overflow-hidden col-span-1">
                  <img src={currentGallery[1]} alt="khách hàng 2"
                  className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden col-span-1">
                  <img src={currentGallery[2]} alt="khách hàng 3"
                  className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

                <div className="rounded-3xl overflow-hidden col-span-1">
                  <img src={currentGallery[3]} alt="khách hàng 4"
                  className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden col-span-1">
                  <img src={currentGallery[4]} alt="khách hàng 5"
                  className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>

              </div>    
          </div>
      </div>
   {/* service */}
      <div id="dich-vu" className="py-8 sm:py-12 md:py-14 px-4 sm:px-6 relative" style={{ background: "#2b0202" }}>
        
        {/* chữ mờ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <div className="text-center font-black text-white leading-none opacity-5" style={{ fontFamily: "serif" }}>
            <div style={{ fontSize: "clamp(60px, 11vw, 150px)", letterSpacing: "0.08em" }}>Á CHÂU</div>
            <div style={{ fontSize: "clamp(50px, 9vw, 120px)", letterSpacing: "0.15em" }}>II</div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto relative z-10">

          {/* header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="max-w-lg">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white mb-2 sm:mb-3" style={{ fontFamily: "serif" }}>
                Dịch Vụ Nha Khoa
              </h2>
              <p className="text-white/50 text-xs sm:text-sm">
                Khám phá các dịch vụ nổi bật tại Nha Khoa Quốc Tế Á Châu II
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setServicePage((prev) => Math.max(0, prev - 1))}
                disabled={servicePage === 0}
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white" }}
              >
                ←
              </button>

              <button
                onClick={() => setServicePage((prev) => Math.min(totalServicePages - 1, prev + 1))}
                disabled={servicePage === totalServicePages - 1}
                className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#D4A843", color: "#1a0000" }}
              >
                →
              </button>
            </div>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {serviceCards}
          </div>

        </div>
      </div>

            {/* NEWS */}
            <div className="py-8 sm:py-12 md:py-16 bg-[#f5efc7]">
              <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-4">

                {/* TITLE */}
                <div className="text-center mb-8 sm:mb-10">
                  <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-yellow-700 font-bold mb-2 sm:mb-3">
                    Dental News
                  </p>

                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl font-black"
                    style={{
                      color: "#1a0a00",
                      fontFamily: "serif",
                    }}
                  >
                    Tin tức & Khuyến mãi
                  </h2>
                </div>

                {posts.length === 0 && !isLoading ? (
                  <div className="text-center py-8 sm:py-12 text-gray-500 text-sm">
                    {error || "Không có tin tức nào"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-7">

                    {/* FEATURED POST */}
                    {posts[0] && (
                      <Link
                        to={`/posts/${posts[0].id}`}
                        className="group lg:col-span-2 relative h-[300px] sm:h-[400px] md:h-[520px] rounded-2xl sm:rounded-[32px] overflow-hidden transition hover:-translate-y-1"
                        style={{
                          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
                        }}
                      >

                        {/* FULL IMAGE */}
                        <img
                          src={posts[0].imageUrl || "/no-image.png"}
                          alt={posts[0].title}
                          className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "/no-image.png";
                          }}
                        />

                        {/* DARK OVERLAY */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.88) 8%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.08) 100%)",
                          }}
                        />

                        {/* CONTENT */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10">

                          {/* badge */}
                          <div
                            className="w-fit px-3 sm:px-4 h-7 sm:h-9 rounded-full flex items-center text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.18em] mb-3 sm:mb-5 backdrop-blur-md"
                            style={{
                              background: "rgba(212,168,67,0.22)",
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                          >
                            Tin nổi bật
                          </div>

                          {/* title */}
                          <h3
                            className="text-white font-black leading-tight text-lg sm:text-2xl md:text-3xl lg:text-5xl max-w-4xl drop-shadow-2xl"
                            style={{
                              fontFamily: "serif",
                            }}
                          >
                            {posts[0].title}
                          </h3>

                          {/* desc */}
                          <p
                            className="text-white/85 text-[11px] sm:text-sm md:text-base leading-relaxed mt-3 sm:mt-5 max-w-3xl line-clamp-2 sm:line-clamp-3"
                          >
                            {posts[0].description || posts[0].content || ""}
                          </p>

                          {/* footer */}
                          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-7">

                            <div className="text-white/60 text-[10px] sm:text-sm">
                              {posts[0].createdAt
                                ? new Date(posts[0].createdAt).toLocaleDateString()
                                : ""}
                            </div>

                            <div className="w-1 h-1 rounded-full bg-white/40" />

                            <div className="text-yellow-300 text-[10px] sm:text-sm font-semibold">
                              Xem chi tiết →
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* RIGHT POSTS - GIỮ BỐ CỤC CŨ */}
                    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">

                      {posts.slice(1, 5).map((p) => (
                        <Link
                          key={p.id}
                          to={`/posts/${p.id}`}
                          className="flex gap-3 sm:gap-4 bg-white rounded-lg sm:rounded-2xl shadow-md p-2.5 sm:p-3 items-center hover:shadow-xl transition hover:-translate-y-1"
                        >

                          {/* IMAGE */}
                          <div className="relative w-[100px] sm:w-[120px] h-[75px] sm:h-[90px] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">

                            <img
                              src={p.imageUrl || "/no-image.png"}
                              alt={p.title}
                              className="absolute inset-0 w-full h-full object-cover transition duration-500 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "/no-image.png";
                              }}
                            />

                            {/* overlay */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.35), rgba(0,0,0,0.05))",
                              }}
                            />
                          </div>

                          {/* CONTENT */}
                          <div className="flex-1 min-w-0">

                            <div className="text-[9px] sm:text-xs text-gray-400 mb-1 sm:mb-2">
                              {p.createdAt
                                ? new Date(p.createdAt).toLocaleDateString()
                                : ""}
                            </div>

                            <div className="text-[#1a0a00] font-black text-xs sm:text-sm line-clamp-2 leading-snug mb-1 sm:mb-2">
                              {p.title}
                            </div>

                            <div className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">
                              {p.description || ""}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            </div>

                {/* FOOTER */}
                <div id="dia-chi" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6" style={{backgroundColor: "#f5ede6"}}>
                  <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-4 sm:gap-5 items-stretch">
                    {/* left */}
                    <div className="flex flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 w-full md:w-[380px] flex-shrink-0" style={{backgroundColor: "#2D0A0A", minHeight: "300px", mdHeight: "500px"}}>
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.18em] uppercase mb-2 sm:mb-3" style={{color: "#C07A3A"}}> Thông tin &amp; Bản Đồ</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 leading-tight" style={{fontFamily: "serif"}}> Đến khám <br/> hôm nay. </h2>

                        <div className="flex flex-col gap-4 sm:gap-5">
                          <div>
                            <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1"style={{color: "#C07A3A"}}> Địa Chỉ</p>
                            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">125 Đường Hùng Vương, Ái Nghĩa <br/> Đại Lộc, TP. Đà Nẵng</p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1" style={{color:"#C07A3A"}}>Giờ Mở Cửa</p>
                            <p className="text-white/80 text-xs sm:text-sm">08:00 - 20:00, Thứ hai - Chủ nhật</p>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1" style={{color:"#C07A3A"}}>Liên Hệ</p>
                            <p className="text-lg sm:text-xl font-black" style={{color:"#D4A843"}}> 0775771771</p>
                          </div>
                        </div>
                      </div>
                      {/* bottom */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
                          <a
                            href="https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&fbclid=IwY2xjawRw_illeHRuA2FlbQIxMABicmlkETFITXpTRHc5azUxbnB1U1o4c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHqj7LtAwGbeBB2A0vjbt7aPZX6LBUa6HlLGYPZNNg6JW0FgpKoUplUPige8o_aem_cFX7H9-JBwTHp3IIOTcekQ&FORM=FBKPL1&q=125+H%C3%B9ng+V%C6%B0%C6%A1ng++%C3%81i+Ngh%C4%A9a+%C4%90%E1%BA%A1i+L%E1%BB%99c+Qu%E1%BA%A3ng+Nam%2C+Quang+Nam%2C+Vietnam%2C+51000&cp=15.882057%7E108.120305&lvl=16&style=r"
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition hover:scale-[1.02]"
                            style={{
                              backgroundColor: "#D4A843",
                              color: "#1a0000",
                            }}
                          >
                            <span className="text-sm sm:text-base">📍</span>
                            <span>Mở Maps</span>
                          </a>

                          <a
                            href="tel:0775771771"
                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition"
                          >
                            <span className="text-sm sm:text-base">📞</span>
                            <span>Liên hệ</span>
                          </a>
                        </div>
                        </div>
                      {/* right */}
                      <div className="flex-1 rounded-2xl sm:rounded-3xl overflow-hidden" style={{height: "300px", mdHeight: "500px"}}>
                      <img src={map} alt="Nha Khoa Á Châu II" 
                          className="w-full h-full object-cover"
                          style={{display:"block"}}
                      />
                      </div>
                  </div>

                  {/* bottom */}
                  <div className="max-w-[1100px] mx-auto mt-6 sm:mt-8 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs" style={{borderColor:"#d6c4b0", color:"#8B5E3C"}}>
                    <span>@2026 Nha Khoa Quốc Tế Á Châu II. All rights reserved.</span>
                    <span className="hidden sm:inline">Thiết kế bởi hồ phước thái</span>
                  </div>
                </div>

                  {/* MODAL */}
                {modalOpen && (
              <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">

                {/* MODAL */}
                <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">

                  {/* HEADER */}
                  <div
                    className="px-5 sm:px-7 py-5 sm:py-6 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #2b0202 0%, #4a0505 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-yellow-400 text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-2">
                          Nha Khoa Quốc Tế
                        </p>

                        <h2 className="text-xl sm:text-2xl font-black">
                          Đặt lịch khám
                        </h2>

                        <p className="text-white/70 text-xs sm:text-sm mt-2">
                          Vui lòng điền thông tin để được tư vấn nhanh nhất
                        </p>
                      </div>

                      {/* CLOSE */}
                      <button
                        onClick={() => setModalOpen(false)}
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-lg flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">

                    <form
                      onSubmit={handleBookingSubmit}
                      className="space-y-5"
                    >

                      {/* PHONE */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Số điện thoại
                        </label>

                        <input
                          name="patientPhone"
                          value={booking.patientPhone}
                          onChange={handleBookingChange}
                          placeholder="Nhập số điện thoại"
                          className="w-full h-12 sm:h-13 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />

                        {errors.patientPhone && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.patientPhone}
                          </p>
                        )}
                      </div>

                      {/* NAME */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Họ và tên
                        </label>

                        <input
                          name="patientName"
                          value={booking.patientName}
                          onChange={handleBookingChange}
                          placeholder="Nhập họ và tên"
                          className="w-full h-12 sm:h-13 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition  focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />

                        {errors.patientName && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.patientName}
                          </p>
                        )}
                      </div>

                      {/* DATETIME */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngày giờ khám
                        </label>

                        <div className="relative">

                          <input
                            type="datetime-local"
                            name="appointmentTime"
                            value={booking.appointmentTime}
                            onChange={handleBookingChange}
                            className="w-full min-h-[52px] rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100
                              appearance-none
                              text-gray-700

                              [&::-webkit-calendar-picker-indicator]:opacity-100
                              [&::-webkit-calendar-picker-indicator]:cursor-pointer
                              [&::-webkit-calendar-picker-indicator]:block
                              [&::-webkit-calendar-picker-indicator]:absolute
                              [&::-webkit-calendar-picker-indicator]:right-4
                            "
                          />
                        </div>

                        <p className="text-[11px] text-gray-400 mt-2">
                          Chọn ngày và giờ bạn muốn đặt lịch
                        </p>

                        {errors.appointmentTime && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.appointmentTime}
                          </p>
                        )}
                      </div>

                      {/* REASON */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Lý do khám
                        </label>

                        <textarea
                          name="reason"
                          value={booking.reason}
                          onChange={handleBookingChange}
                          placeholder="Mô tả tình trạng hoặc nhu cầu khám..."
                          rows="4"
                          className=" w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition resize-none  focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                        />
                      </div>

                      {/* BUTTONS */}
                      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className=" w-full sm:w-auto px-5 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100  transition"
                        >
                          Hủy
                        </button>

                        <button
                          type="submit"
                          disabled={submitting}
                          className=" w-full sm:w-auto px-6 h-11 rounded-xl text-white font-bold shadow-lg transition hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{
                            background:
                              "linear-gradient(135deg, #D4A843 0%, #b98d2d 100%)",
                          }}
                        >
                          {submitting ? "Đang gửi..." : "Xác nhận đặt lịch"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

    </div>
  );
};

export default HomePage;