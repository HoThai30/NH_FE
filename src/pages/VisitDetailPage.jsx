import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { visitAPI } from "../services/api";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export default function VisitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [visit, setVisit] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    notes: "",
    procedures: "",
    cost: 0,
  });

  useEffect(() => {
    const loadVisit = async () => {
      try {
        const response = await visitAPI.getById(id);

        setVisit(response.data);

        setFormData({
          notes: response.data.notes || "",
          procedures: response.data.procedures || "",
          cost: response.data.cost || 0,
        });
      } catch (err) {
        setError("Không thể tải hồ sơ khám");
      } finally {
        setLoading(false);
      }
    };

    loadVisit();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await visitAPI.update(id, formData);

      alert("Cập nhật thành công");

      const response = await visitAPI.getById(id);

      setVisit(response.data);
    } catch (err) {
      alert(
        "Lỗi: " +
          (err.response?.data ||
            "Không thể cập nhật")
      );
    }
  };

const handleExport = async () => {
  try {
    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetch(
      "/fonts/NotoSans-Regular.ttf"
    ).then((res) => res.arrayBuffer());

    const customFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.addPage([595, 842]);

    const { width, height } = page.getSize();

    const margin = 40;

    let y = height - 40;

    // COLORS
    const primary = rgb(0.15, 0.15, 0.15);
    const gold = rgb(0.8, 0.64, 0.26);
    const gray = rgb(0.45, 0.45, 0.45);
    const lightGray = rgb(0.92, 0.92, 0.92);

    // ================= HELPERS =================

    const drawSectionTitle = (title) => {
      page.drawText(title, {
        x: margin,
        y,
        size: 13,
        font: customFont,
        color: gold,
      });

      y -= 18;

      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: lightGray,
      });

      y -= 18;
    };

    const drawField = (label, value, left, top) => {
      page.drawText(label, {
        x: left,
        y: top,
        size: 9,
        font: customFont,
        color: gray,
      });

      page.drawText(String(value || "N/A"), {
        x: left,
        y: top - 14,
        size: 11,
        font: customFont,
        color: primary,
      });
    };

    const drawMultilineText = (text, x, startY) => {
      const lines = String(text || "").split("\n");

      lines.forEach((line) => {
        page.drawText(line || " ", {
          x,
          y: startY,
          size: 10,
          font: customFont,
          color: primary,
          maxWidth: 500,
        });

        startY -= 15;
      });

      return startY;
    };

    // ================= HEADER =================

    page.drawRectangle({
      x: 0,
      y: height - 110,
      width,
      height: 110,
      color: rgb(0.98, 0.98, 0.98),
    });

    page.drawText("NHA KHOA QUỐC TẾ Á CHÂU II", {
      x: margin,
      y: height - 55,
      size: 22,
      font: customFont,
      color: primary,
    });

    page.drawText("PHIẾU HỒ SƠ KHÁM BỆNH", {
      x: margin,
      y: height - 82,
      size: 13,
      font: customFont,
      color: gold,
    });

    page.drawText(
      `Mã hồ sơ: #${visit.id}`,
      {
        x: width - 170,
        y: height - 60,
        size: 11,
        font: customFont,
        color: gray,
      }
    );

    y = height - 140;

    // ================= PATIENT BOX =================

    page.drawRectangle({
      x: margin,
      y: y - 120,
      width: width - margin * 2,
      height: 120,
      borderWidth: 1,
      borderColor: lightGray,
    });

    page.drawText("THÔNG TIN BỆNH NHÂN", {
      x: margin + 15,
      y: y - 20,
      size: 12,
      font: customFont,
      color: gold,
    });

    drawField(
      "Họ và tên",
      visit.patient?.user?.name ||
        visit.appointment?.patientName,
      margin + 15,
      y - 45
    );

    drawField(
      "Số điện thoại",
      visit.patient?.user?.phone ||
        visit.appointment?.patientPhone,
      margin + 250,
      y - 45
    );

    drawField(
      "Tuổi",
      visit.patient?.age ||
        visit.appointment?.patientAge,
      margin + 15,
      y - 85
    );

    drawField(
      "Giới tính",
      visit.patient?.gender ||
        visit.appointment?.patientGender,
      margin + 150,
      y - 85
    );

    drawField(
      "Ngày khám",
      visit.appointment?.startTime
        ? new Date(
            visit.appointment.startTime
          ).toLocaleString("vi-VN")
        : "N/A",
      margin + 300,
      y - 85
    );

    y -= 150;

    // ================= NOTES =================

    drawSectionTitle("GHI CHÚ TÌNH TRẠNG");

    y = drawMultilineText(
      formData.notes || "Không có ghi chú",
      margin,
      y
    );

    y -= 20;

    // ================= PROCEDURES =================

    drawSectionTitle("THỦ THUẬT ĐIỀU TRỊ");

    y = drawMultilineText(
      formData.procedures ||
        "Không có thủ thuật",
      margin,
      y
    );

    y -= 30;

    // ================= COST BOX =================

    page.drawRectangle({
      x: margin,
      y: y - 70,
      width: width - margin * 2,
      height: 70,
      color: rgb(0.98, 0.97, 0.93),
      borderWidth: 1,
      borderColor: rgb(0.9, 0.85, 0.7),
    });

    page.drawText("TỔNG CHI PHÍ ĐIỀU TRỊ", {
      x: margin + 20,
      y: y - 28,
      size: 11,
      font: customFont,
      color: gray,
    });

    page.drawText(
      `${Number(formData.cost).toLocaleString(
        "vi-VN"
      )} ₫`,
      {
        x: margin + 20,
        y: y - 55,
        size: 22,
        font: customFont,
        color: gold,
      }
    );

    y -= 110;

    // ================= SIGNATURE =================

    page.drawText(
      `Ngày tạo hồ sơ: ${
        visit.createdAt
          ? new Date(
              visit.createdAt
            ).toLocaleString("vi-VN")
          : "N/A"
      }`,
      {
        x: margin,
        y,
        size: 9,
        font: customFont,
        color: gray,
      }
    );

    page.drawText("Bác sĩ phụ trách", {
      x: width - 180,
      y,
      size: 10,
      font: customFont,
      color: gray,
    });

    y -= 60;

    page.drawLine({
      start: { x: width - 210, y },
      end: { x: width - 90, y },
      thickness: 1,
      color: lightGray,
    });

    // ================= FOOTER =================

    page.drawLine({
      start: { x: margin, y: 40 },
      end: { x: width - margin, y: 40 },
      thickness: 1,
      color: lightGray,
    });

    page.drawText(
      "Hệ thống quản lý nha khoa • Nha Khoa Quốc Tế Á Châu II",
      {
        x: margin,
        y: 25,
        size: 8,
        font: customFont,
        color: gray,
      }
    );

    // ================= EXPORT =================

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `hosokham-${visit.id}.pdf`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);

    alert("Lỗi: Không thể xuất PDF");
  }
};

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1a0000" }}
      >
        <div className="w-14 h-14 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen px-6 py-10"
        style={{ backgroundColor: "#1a0000" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white/50"
        style={{ backgroundColor: "#1a0000" }}
      >
        Không tìm thấy hồ sơ khám
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1a0000" }}
    >
      {/* TOPBAR */}
      <div className="border-b border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 h-[78px] flex items-center justify-between">

          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-yellow-400 font-bold mb-1">
              Medical Visit Records
            </p>

            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "serif" }}
            >
              Chi Tiết Hồ Sơ Khám
            </h1>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => navigate(-1)}
            className="h-11 px-5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] transition text-sm font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1300px] mx-auto px-6 py-8">

        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-[30px] border border-white/10 p-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          }}
        >
          {/* GLOW */}
          <div
            className="absolute -top-24 -right-24 w-[320px] h-[320px] rounded-full blur-3xl"
            style={{
              background: "rgba(212,168,67,0.10)",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-400 font-bold mb-3">
                Dental Visit Information
              </p>

              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: "serif" }}
              >
                Hồ Sơ
                <br />
                #{visit.id}
              </h2>

              <p className="text-white/50 text-sm leading-relaxed mt-5 max-w-xl">
                Theo dõi lịch sử khám bệnh, thủ thuật điều trị và chi phí
                của bệnh nhân trong hệ thống nha khoa luxury dental.
              </p>
            </div>

            {/* STATUS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Visit ID
                </p>

                <h3 className="text-3xl font-black text-white">
                  #{visit.id}
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Chi phí
                </p>

                <h3 className="text-2xl font-black text-yellow-400">
                  {Number(formData.cost).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  ₫
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  Trạng thái
                </p>

                <h3 className="text-2xl font-black text-green-400">
                  Active
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-white/40 text-xs uppercase mb-2">
                  System
                </p>

                <h3 className="text-lg font-black text-white">
                  Stable
                </h3>
              </div>

            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[380px,1fr] gap-6">

          {/* LEFT SIDEBAR */}
          <div
            className="rounded-[28px] border border-white/10 p-7 h-fit"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
              Patient Information
            </p>

            <div className="space-y-5">

              <div>
                <p className="text-white/35 text-xs uppercase mb-2">
                  Họ tên
                </p>

                <p className="text-white text-lg font-semibold">
                  {visit.patient?.user?.name ||
                    visit.appointment?.patientName ||
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="text-white/35 text-xs uppercase mb-2">
                  Điện thoại
                </p>

                <p className="text-white/80">
                  {visit.patient?.user?.phone ||
                    visit.appointment?.patientPhone ||
                    "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-white/35 text-xs uppercase mb-2">
                    Tuổi
                  </p>

                  <p className="text-white/80">
                    {visit.patient?.age ||
                      visit.appointment?.patientAge ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-white/35 text-xs uppercase mb-2">
                    Giới tính
                  </p>

                  <p className="text-white/80">
                    {visit.patient?.gender ||
                      visit.appointment?.patientGender ||
                      "N/A"}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-white/35 text-xs uppercase mb-2">
                  Thời gian khám
                </p>

                <p className="text-white/80 leading-relaxed">
                  {visit.appointment?.startTime
                    ? new Date(
                        visit.appointment.startTime
                      ).toLocaleString("vi-VN")
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-white/35 text-xs uppercase mb-2">
                  Ngày tạo hồ sơ
                </p>

                <p className="text-white/80 leading-relaxed">
                  {visit.createdAt
                    ? new Date(
                        visit.createdAt
                      ).toLocaleString("vi-VN")
                    : "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT FORM */}
          <div
            className="rounded-[28px] border border-white/10 p-7"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-yellow-400 font-bold mb-6">
              Medical Treatment Details
            </p>

            <form onSubmit={handleSubmit}>

              <div className="space-y-6">

                {/* NOTES */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Ghi chú tình trạng
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Ghi chú về tình trạng bệnh nhân..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 outline-none resize-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* PROCEDURES */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Thủ thuật điều trị
                  </label>

                  <textarea
                    name="procedures"
                    value={formData.procedures}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Nhập các thủ thuật đã thực hiện..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/25 outline-none resize-none focus:border-yellow-400/40 transition"
                  />
                </div>

                {/* COST */}
                <div>
                  <label className="block text-white/35 text-xs uppercase tracking-[0.18em] mb-3">
                    Chi phí điều trị (VND)
                  </label>

                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-white outline-none focus:border-yellow-400/40 transition"
                  />
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  type="submit"
                  className="h-12 px-6 rounded-2xl text-sm font-bold transition hover:scale-[1.02]"
                  style={{
                    background: "#D4A843",
                    color: "#1a0000",
                  }}
                >
                  Cập Nhật Hồ Sơ
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  className="h-12 px-6 rounded-2xl border border-white/10 text-white/80 hover:bg-white/[0.05] transition text-sm font-semibold"
                >
                  Xuất File
                </button>

              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}