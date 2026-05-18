import React, { useEffect, useState } from "react";
import { dentalServiceAPI } from "../services/api";
import "../styles/pricing-page.css";

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
    <div className="pricing-page">
      <div className="pricing-container">
        {/* Header */}
        <div className="pricing-header">
          <h1>Bảng Giá Dịch Vụ</h1>
          <p>Khám phá các dịch vụ chất lượng cao với giá cả hợp lý</p>
        </div>

        {/* Content */}
        <div className="pricing-content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadServices} className="retry-btn">
                Thử lại
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="no-services">
              <p>Hiện tại không có dịch vụ nào khả dụng</p>
            </div>
          ) : (
            <div className="pricing-table-wrapper">
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Dịch Vụ</th>
                    <th>Mô Tả</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service.id || index} className="service-row">
                      <td className="stt">{index + 1}</td>
                      <td className="service-name">
                        {service.imgService && (
                          <img
                            src={service.imgService}
                            alt={service.name}
                            className="service-image"
                          />
                        )}
                        <span>{service.name}</span>
                      </td>
                      <td className="service-description">
                        {service.description || "N/A"}
                      </td>
                      <td className="service-price">
                        <span className="price-value">
                          {formatPrice(service.price)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {services.length > 0 && (
          <div className="pricing-footer">
            <p>
              <strong>Lưu ý:</strong> Giá trên là giá tiêu biểu. Vui lòng liên
              hệ với chúng tôi để được tư vấn chi tiết và nhận các ưu đãi
              đặc biệt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
