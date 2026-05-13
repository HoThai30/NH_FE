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
        console.log("Fetched posts:", p.data?.length || 0);
        console.log("Fetched active posts:", a.data?.length || 0);
        console.log("Fetched services:", s.data?.length || 0, s.data);
        console.log("posts:", p.data);
        setPosts(p.data || []);
        setActivePosts(a.data || []);
        setServices(s.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        console.error("Error details:", error.response?.data || error.message);
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

 const hero = "/public/uploads/anhhero1.jpg";
 const about = "/public/uploads/anhbia.jpg"

 const [galleryPage, setGalleryPage] = useState(0);
 const galleryImages = [
  "/public/uploads/khachhang3.jpg",
  "/public/uploads/khachhang2.jpg",
  "/public/uploads/khachhang1.jpg",
  "/public/uploads/khachhang4.jpg",
  "/public/uploads/khachhang5.jpg",
  "/public/uploads/khachhang6.jpg",
  "/public/uploads/khachhang7.jpg",
  "/public/uploads/khachhang8.jpg",
  "/public/uploads/khachhang9.jpg",
  "/public/uploads/khachhang10.jpg",
 ]
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
       {/* <div
         className="w-full h-[180px] overflow-hidden"
         style={{ backgroundColor: "#f5ede6" }}
       >
         {service.imgService ? (
           <img
             src={service.imgService}
             alt={service.name}
             className="w-full h-full object-cover"
             onError={(e) => {
               e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
             }}
           />
         ) : (
           <div className="flex items-center justify-center h-full text-gray-300 text-xs">
             Chưa có ảnh
           </div>
         )}
       </div> */}

       {/* <div
          className="relative w-full h-[180px] overflow-hidden"
          style={{ backgroundColor: "#f5ede6" }}
        >
          {service.imgService ? (
            <>
              <img
                src={service.imgService}
                alt={service.name}
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
              />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                <img
                  src={service.imgService}
                  alt={service.name}
                  className="max-w-full max-h-full object-contain transition duration-500 group-hover:scale-105 drop-shadow-2xl"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-xs">
              Chưa có ảnh
            </div>
          )}
        </div> */}

        <div
          className="relative w-full h-[180px] overflow-hidden"
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
              <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                <img
                  src={service.imgService}
                  alt={service.name}
                  className="
                    max-w-full
                    max-h-full
                    object-contain
                    transition
                    duration-500
                    group-hover:scale-105
                    drop-shadow-2xl
                  "
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
        
       <div className="px-4 py-4 flex flex-col flex-1">
         <p className="text-[10px] font-bold tracking-widest uppercase text-[#1a0500] mb-1">
           {service.category || "Nha Khoa"}
         </p>

         <p className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[40px]">
           {service.name}
         </p>

         <p className="text-gray-400 text-xs mt-1 line-clamp-3 min-h-[48px]">
           {service.description || "Dịch vụ nha khoa chuyên nghiệp"}
         </p>

         <p className="font-black text-gray-900 text-sm mt-auto">
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

 const map = "/public/uploads/map.jpg";

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
        <div className="max-w-[1200px] mx-auto px-10 py-16 flex flex-col md:flex-row items-center gap-12">
          
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Badge */}
            <div
                className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl w-fit shadow-lg"
                style={{
                  backgroundColor: "rgba(82, 1, 1, 0.8)",
                  boxShadow: "0 0 20px rgba(212, 168, 67, 0.6)" // ánh vàng
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/public/uploads/logo.jpg"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>

                <div>
                  <p className="text-sm font-bold tracking-widest uppercase text-yellow-400">
                    Nha Khoa Á Châu II
                  </p>
                  <p className="text-xs text-white">
                    Nha khoa • Đại Lộc
                  </p>
                </div>
              </div>

            {/* Info */}
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-full text-xs bg-white/10">
                ⭐ 4.9/5 Google Maps
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs bg-white/10">
                💬 2.1K+ đánh giá
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs bg-white/10">
                🕐 08:00 – 20:00
              </span>
            </div>

            {/* Sub title */}
            <p className="text-xs tracking-[0.2em] uppercase text-yellow-400 font-medium">
              Niềng Răng • Cấy Implant • Thẩm Mỹ Nụ Cười
            </p>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black leading-none font-serif">
              Nha Khoa <br /> Á Châu II
            </h1>

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
               Chăm sóc răng miệng toàn diện tại nha khoa quốc tế Á Châu II với đội ngũ bác sĩ chuyên môn cao và công nghệ hiện đại.
            </p>
          </div>
          <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/20">
                  <img
                    src={hero}
                    className="w-full h-[400px] object-cover"
                    style={{ objectPosition: "40% 60%" }}
                  />

                  {/* 3 ô thông tin */}
                  <div className="grid grid-cols-3 gap-4 p-4">
                    
                    <div className="bg-white rounded-lg p-4 text-center backdrop-blur-sm">
                      <p className="text-xl text-red-800 font-bold">10+</p>
                      <p className="text-xs text-red-800">Năm kinh nghiệm</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 text-center backdrop-blur-sm">
                      <p className="text-xl text-red-800 font-bold">5000+</p>
                      <p className="text-xs text-red-800">Khách hàng</p>
                    </div>

                    <div className="bg-yellow-300 rounded-lg p-4 text-center backdrop-blur-sm">
                      <p className="text-xl text-red-800 font-bold">100%</p>
                      <p className="text-xs text-red-800">Hài lòng</p>
                    </div>

                  </div>
              </div>
            </div>
        </div>
      </div>

     {/* ABOUT */}
      <div className="py-16 bg-yellow-100">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          {/* IMAGE */}
          <div className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
            <img
              src={about}
              alt="Nha khoa Á Châu"
              className="h-[320px] w-full object-cover transform hover:scale-105 transition duration-500"
            />
          </div>

          {/* CONTENT */}
          <div className="bg-yellow-50 p-8 rounded-2xl shadow-md">
            <h2 className="text-primaryDark font-bold mb-4 text-xl">
              NHA KHOA QUỐC TẾ Á CHÂU II
            </h2>

            <p className="text-gray-700 leading-relaxed">
                Nha khoa Quốc tế Á Châu là địa chỉ uy tín trong lĩnh vực chăm sóc và điều trị
                răng miệng, được nhiều khách hàng tin tưởng lựa chọn. Với trang thiết bị hiện
                đại cùng đội ngũ bác sĩ giàu kinh nghiệm, chúng tôi mang đến các giải pháp
                điều trị an toàn, hiệu quả và phù hợp với từng khách hàng.

                Mỗi khách hàng đều được thăm khám kỹ lưỡng và tư vấn cá nhân hóa, từ các dịch
                vụ cơ bản đến chuyên sâu như chỉnh nha, implant hay phục hình thẩm mỹ. Chúng
                tôi cam kết mang lại nụ cười tự tin, khỏe mạnh và trải nghiệm thoải mái trong
                suốt quá trình điều trị.
              </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 bg-primaryDark text-white px-6 py-3 rounded-xl hover:bg-green-800 transition"
            >
              Đặt lịch khám
            </button>
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
      <div id="dich-vu" className="py-14 px-6 relative" style={{ background: "#2b0202" }}>
        
        {/* chữ mờ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <div className="text-center font-black text-white leading-none opacity-5" style={{ fontFamily: "serif" }}>
            <div style={{ fontSize: "clamp(60px, 11vw, 150px)", letterSpacing: "0.08em" }}>Á CHÂU</div>
            <div style={{ fontSize: "clamp(50px, 9vw, 120px)", letterSpacing: "0.15em" }}>II</div>
          </div>
        </div>

        <div className="max-w-[1100px] mx-auto relative z-10">

          {/* header */}
          <div className="flex items-start justify-between mb-10">
            <div className="max-w-lg">
              <h2 className="text-3xl font-black leading-tight text-white mb-3" style={{ fontFamily: "serif" }}>
                Dịch Vụ Nha Khoa
              </h2>
              <p className="text-white/50 text-sm">
                Khám phá các dịch vụ nổi bật tại Nha Khoa Quốc Tế Á Châu II
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setServicePage((prev) => Math.max(0, prev - 1))}
                disabled={servicePage === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white" }}
              >
                ←
              </button>

              <button
                onClick={() => setServicePage((prev) => Math.min(totalServicePages - 1, prev + 1))}
                disabled={servicePage === totalServicePages - 1}
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#D4A843", color: "#1a0000" }}
              >
                →
              </button>
            </div>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {serviceCards}
          </div>

        </div>
      </div>

            {/* NEWS */}
            <div className="py-16 bg-[#f5efc7]">
              <div className="max-w-[1100px] mx-auto px-4">

                {/* TITLE */}
                <div className="text-center mb-10">
                  <p className="text-[11px] tracking-[0.3em] uppercase text-yellow-700 font-bold mb-3">
                    Dental News
                  </p>

                  <h2
                    className="text-4xl md:text-5xl font-black"
                    style={{
                      color: "#1a0a00",
                      fontFamily: "serif",
                    }}
                  >
                    Tin tức & Khuyến mãi
                  </h2>
                </div>

                {posts.length === 0 && !isLoading ? (
                  <div className="text-center py-12 text-gray-500">
                    {error || "Không có tin tức nào"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

                    {/* FEATURED POST */}
                    {posts[0] && (
                      <Link
                        to={`/posts/${posts[0].id}`}
                        className="group lg:col-span-2 relative h-[520px] rounded-[32px] overflow-hidden transition hover:-translate-y-1"
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
                        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-10">

                          {/* badge */}
                          <div
                            className=" w-fit px-4 h-9 rounded-full flex items-center text-[11px] font-black uppercase tracking-[0.18em] mb-5 backdrop-blur-md"
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
                            className="text-white font-black leading-[1.1] text-3xl md:text-5xl max-w-4xl drop-shadow-2xl"
                            style={{
                              fontFamily: "serif",
                            }}
                          >
                            {posts[0].title}
                          </h3>

                          {/* desc */}
                          <p
                            className=" text-white/85 text-sm md:text-base leading-relaxed mt-5 max-w-3xl line-clamp-3"
                          >
                            {posts[0].description || posts[0].content || ""}
                          </p>

                          {/* footer */}
                          <div className="flex items-center gap-4 mt-7">

                            <div className="text-white/60 text-sm">
                              {posts[0].createdAt
                                ? new Date(posts[0].createdAt).toLocaleDateString()
                                : ""}
                            </div>

                            <div className="w-1 h-1 rounded-full bg-white/40" />

                            <div className="text-yellow-300 text-sm font-semibold">
                              Xem chi tiết →
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* RIGHT POSTS - GIỮ BỐ CỤC CŨ */}
                    <div className="flex flex-col gap-5">

                      {posts.slice(1, 5).map((p) => (
                        <Link
                          key={p.id}
                          to={`/posts/${p.id}`}
                          className="flex gap-4 bg-white rounded-2xl shadow-md p-3 items-center hover:shadow-xl transition hover:-translate-y-1"
                        >

                          {/* IMAGE */}
                          <div className="relative w-[120px] h-[90px] rounded-xl overflow-hidden flex-shrink-0">

                            <img
                              src={p.imageUrl || "/no-image.png"}
                              alt={p.title}
                              className=" absolute inset-0 w-full h-full object-cover transition duration-500 hover:scale-105"
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

                            <div className="text-xs text-gray-400 mb-2">
                              {p.createdAt
                                ? new Date(p.createdAt).toLocaleDateString()
                                : ""}
                            </div>

                            <div className="text-[#1a0a00] font-black text-sm line-clamp-2 leading-snug mb-2">
                              {p.title}
                            </div>

                            <div className="text-xs text-gray-600 line-clamp-2">
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
     <div id="dia-chi" className="py-16 px-6" style={{backgroundColor: "#f5ede6"}}>
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-5 items-stretch">
        {/* left */}
        <div className="flex flex-col justify-between rounded-3xl p-8 md:w-[380px] flex-shrink-0" style={{backgroundColor: "#2D0A0A",height: 500}}>
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{color: "#C07A3A"}}> Thông tin &amp; Bản Đồ</p>
            <h2 className="text-3xl font-black text-white mb-8 leading-tight" style={{fontFamily: "serif"}}> Đến khám <br/> hôm nay. </h2>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1"style={{color: "#C07A3A"}}> Địa Chỉ</p>
                <p className="text-white/80 text-sm leading-relaxed">125 Đường Hùng Vương, Ái Nghĩa <br/> Đại Lộc, TP. Đà Nẵng</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color:"#C07A3A"}}>Giờ Mở Cửa</p>
                <p className="text-white/80 text-sm">08:00 - 20:00, Thứ hai - Chủ nhật</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{color:"#C07A3A"}}>Liên Hệ</p>
                <p className="text-xl font-black" style={{color:"#D4A843"}}> 0775771771</p>
              </div>
            </div>
          </div>
          {/* bottom */}
            <div className="flex gap-3 mt-8">
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-[1.02]"
                style={{
                  backgroundColor: "#D4A843",
                  color: "#1a0000",
                }}
              >
                <span className="text-base">📍</span>
                <span>Mở Google Maps</span>
              </a>

              <a
                href="tel:0775771771"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition"
              >
                <span className="text-base">📞</span>
                <span>Liên hệ ngay</span>
              </a>
            </div>
            </div>
           {/* right */}
           <div className="flex-1 rounded-3xl overflow-hidden" style={{height: 500}}>
           <img src={map} alt="Nha Khoa Á Châu II" 
              className="w-full h-full object-cover"
              style={{display:"block"}}
           />
           </div>
      </div>

      {/* bottom */}
      <div className="maw-w-[1100px] mx-auto mt-8 pt-6 border-t flex items-center justify-between text-xs" style={{borderColor:"#d6c4b0", color:"#8B5E3C"}}>
        <span>@2026 Nha Khoa Quốc Tế Á Châu II. All rights reserved.</span>
        <span>Thiết kế bởi Nha Khoa Á Châu II</span>
      </div>
     </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Đặt lịch khám</h2>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <input
                name="patientPhone"
                value={booking.patientPhone}
                onChange={handleBookingChange}
                placeholder="Số điện thoại"
                className="w-full border p-3 rounded"
              />
              <input
                name="patientName"
                value={booking.patientName}
                onChange={handleBookingChange}
                placeholder="Họ tên"
                className="w-full border p-3 rounded"
              />
              <input
                type="datetime-local"
                name="appointmentTime"
                value={booking.appointmentTime}
                onChange={handleBookingChange}
                className="w-full border p-3 rounded"
              />
              <textarea
                name="reason"
                value={booking.reason}
                onChange={handleBookingChange}
                placeholder="Lý do"
                className="w-full border p-3 rounded"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-700 text-white rounded"
                >
                  {submitting ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;