import React, { useEffect, useState } from "react";
import { dentalServiceAPI } from "../services/api";

const PricingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await dentalServiceAPI.getAll();
      // Filter only active services
      const activeServices = res.data.filter((service) => service.active !== false);
      setServices(activeServices);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] px-2 sm:px-4 md:px-5 py-6 md:py-10">
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-8 md:mb-12 animate-[fadeIn_.6s_ease]">
        <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-bold text-[#1a3a52] mb-2 tracking-[-0.5px]">
          Bảng Giá Dịch Vụ
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#556d7b] font-medium">
          Khám phá các dịch vụ chất lượng cao với giá cả hợp lý
        </p>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.1)] animate-[fadeIn_.8s_ease]">

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-14 px-4">
            <div className="w-10 h-10 mx-auto mb-5 rounded-full border-4 border-[#f3f3f3] border-t-[#3498db] animate-spin"></div>

            <p className="text-[#556d7b] text-base md:text-lg">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : error ? (

          /* ERROR */
          <div className="text-center py-14 px-4">
            <p className="text-red-500 text-base md:text-lg">
              {error}
            </p>

            <button
              onClick={loadServices}
              className="mt-5 px-5 py-2.5 bg-[#3498db] hover:bg-[#2980b9]
              text-white rounded-lg font-semibold transition duration-300
              hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(52,152,219,0.3)]"
            >
              Thử lại
            </button>
          </div>
        ) : services.length === 0 ? (

          /* EMPTY */
          <div className="text-center py-14 px-4">
            <p className="text-[#556d7b] text-base md:text-lg">
              Hiện tại không có dịch vụ nào khả dụng
            </p>
          </div>
        ) : (

          <>
            {/* DESKTOP + TABLET */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="bg-gradient-to-r from-[#1a3a52] to-[#2a5a72] text-white">
                  <tr>
                    <th className="px-3 md:px-5 py-4 text-left uppercase tracking-[0.5px] text-sm md:text-base font-semibold border-b-[3px] border-[#154360]">
                      STT
                    </th>

                    <th className="px-3 md:px-5 py-4 text-left uppercase tracking-[0.5px] text-sm md:text-base font-semibold border-b-[3px] border-[#154360]">
                      Tên Dịch Vụ
                    </th>

                    <th className="px-3 md:px-5 py-4 text-left uppercase tracking-[0.5px] text-sm md:text-base font-semibold border-b-[3px] border-[#154360]">
                      Mô Tả
                    </th>

                    <th className="px-3 md:px-5 py-4 text-right uppercase tracking-[0.5px] text-sm md:text-base font-semibold border-b-[3px] border-[#154360]">
                      Giá
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service, index) => (
                    <tr
                      key={service.id || index}
                      className="border-b border-[#ecf0f1]
                      hover:bg-[#f8f9fa]
                      hover:shadow-[inset_0_0_8px_rgba(52,152,219,0.1)]
                      hover:scale-[1.01]
                      transition duration-300"
                    >
                      {/* STT */}
                      <td className="px-3 md:px-5 py-4 text-center font-semibold text-[#3498db]">
                        {index + 1}
                      </td>

                      {/* SERVICE */}
                      <td className="px-3 md:px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[180px]">
                          {service.imgService && (
                            <img
                              src={service.imgService}
                              alt={service.name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover
                              border-2 border-[#ecf0f1]
                              shadow-md flex-shrink-0"
                            />
                          )}

                          <span className="font-semibold text-[#1a3a52] text-sm md:text-base">
                            {service.name}
                          </span>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-3 md:px-5 py-4 text-[#7f8c8d] italic text-sm min-w-[180px] max-w-[280px]">
                        {service.description || "N/A"}
                      </td>

                      {/* PRICE */}
                      <td className="px-3 md:px-5 py-4 text-right whitespace-nowrap">
                        <span className="font-bold text-base md:text-lg bg-gradient-to-r from-[#27ae60] to-[#2ecc71] bg-clip-text text-transparent">
                          {formatPrice(service.price)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD */}
            <div className="flex flex-col gap-4 sm:hidden">
              {services.map((service, index) => (
                <div
                  key={service.id || index}
                  className="bg-white border border-[#ecf0f1]
                  rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="p-4 flex gap-3">

                    {service.imgService && (
                      <img
                        src={service.imgService}
                        alt={service.name}
                        className="w-14 h-14 rounded-lg object-cover border border-[#ecf0f1]"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-[#1a3a52] text-sm">
                          {service.name}
                        </h3>

                        <span className="text-xs font-semibold text-[#3498db]">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="text-xs text-[#7f8c8d] italic leading-relaxed mb-3">
                        {service.description || "N/A"}
                      </p>

                      <div className="font-bold text-sm bg-gradient-to-r from-[#27ae60] to-[#2ecc71] bg-clip-text text-transparent">
                        {formatPrice(service.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="mt-5 md:mt-7 p-4 md:p-5 bg-[#ecf8ff] border-l-4 border-[#3498db] rounded-lg">
              <p className="text-[#1a3a52] text-sm md:text-[15px] leading-7">
                <strong>Lưu ý:</strong> Giá trên là giá tiêu biểu. Vui lòng liên
                hệ với chúng tôi để được tư vấn chi tiết và nhận các ưu đãi
                đặc biệt.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}
export default PricingPage;
