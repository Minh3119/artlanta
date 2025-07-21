import React, { use, useEffect, useState } from "react";
import {
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState("personal");
  const [avatarPreview, setAvatarPreview] = useState("");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(false);
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [YOE, setYOE] = useState("");
  const [eKYC, setEKYC] = useState(false);
  const [specialty, setSpecialty] = useState("");

  const validateInputs = () => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const age =
      today.getFullYear() -
      dob.getFullYear() -
      (today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ? 1
        : 0);

    if (dateOfBirth && isNaN(dob.getTime())) {
      toast.error("Ngày sinh không hợp lệ");
      return false;
    }

    if (dateOfBirth && age < 18) {
      toast.error("Bạn phải đủ 18 tuổi trở lên để sử dụng hệ thống");
      return false;
    }

    if (role === "ARTIST") {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        toast.error("Số điện thoại phải có từ 10 đến 15 chữ số");
        return false;
      }

      const yoeInt = parseInt(YOE);
      if (isNaN(yoeInt) || yoeInt < 0) {
        toast.error("Số năm kinh nghiệm phải là số nguyên không âm");
        return false;
      }

      if (dateOfBirth && yoeInt > age) {
        toast.error("Số năm kinh nghiệm không thể lớn hơn tuổi");
        return false;
      }

      if (!specialty.trim()) {
        toast.error("Chuyên ngành không được để trống");
        return false;
      }
    }

    return true;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/current-user",
          { credentials: "include" }
        );
        if (!res.ok) {
          toast.error("Phiên đăng nhập hết hạn");
          return;
        }

        const data = await res.json();
        const user = data.response;

        setUsername(user.username || "");
        setFullname(user.fullName || "");
        setEmail(user.email || "");
        setAvatarPreview(user.avatarUrl || "");
        setGender(user.isMale ?? false); // ✅ sửa ở đây
        setAddress(user.location || ""); // ✅ sửa ở đây
        setBio(user.bio || "");
        setRole(user.role || "");

        if (user.DOB) {
          const date = new Date(user.DOB);
          const formatted = date.toISOString().split("T")[0]; // ✅ yyyy-mm-dd
          setDateOfBirth(formatted);
        }
      } catch (error) {
        console.error("Failed to check role:", error);
      }
    };

    checkRole();
  }, []);

  useEffect(() => {
    if (role === "ARTIST") {
      const takeArtistInfo = async () => {
        try {
          const res = await fetch(
            "http://localhost:9999/backend/api/currentArtist",
            { credentials: "include" }
          );
          if (!res.ok) {
            toast.error("Phiên đăng nhập hết hạn");
            return;
          }
          const data = await res.json();
          const user = data.response;
          setPhoneNumber(user.PhoneNumber || "");
          setSpecialty(user.Specialty || "");
          setYOE(user.ExperienceYears || "");
          setEKYC(user.iseKYC || "");
        } catch (error) {
          console.error("Failed to check artist info:", error);
        }
      };

      takeArtistInfo();
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        currentPassword !== "" ||
        newPassword !== "" ||
        confirmPassword !== ""
      ) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          toast.error("Vui lòng điền đầy đủ 3 trường mật khẩu");
          return;
        }

        const strength = checkPasswordStrength(newPassword);
        if (!strength.valid) {
          toast.warning(strength.message);
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("Mật khẩu mới và xác nhận không khớp");
          return;
        }

        const passwordRes = await fetch(
          "http://localhost:9999/backend/api/change-password",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }
        );

        const passwordData = await passwordRes.json();
        if (!passwordRes.ok || !passwordData.success) {
          toast.error(passwordData.message || "Đổi mật khẩu thất bại");
          return;
        } else {
          toast.success("Đổi mật khẩu thành công");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      }

      if (!validateInputs()) return;

      const userRes = await fetch(
        "http://localhost:9999/backend/api/update-profile",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullname,
            username,
            email,
            gender,
            address,
            bio,
            dateOfBirth
          }),
        }
      );

      const userData = await userRes.json();
      if (!userRes.ok || !userData.success) {
        toast.error(userData.message || "Cập nhật thông tin cá nhân thất bại");
        return;
      }

      if (role === "ARTIST") {
        const artistRes = await fetch(
          "http://localhost:9999/backend/api/update-artist",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber,
              specialty,
              experienceYears: parseInt(YOE),
            }),
          }
        );

        const artistData = await artistRes.json();
        if (!artistRes.ok || !artistData.success) {
          toast.error(
            artistData.message || "Cập nhật thông tin nghệ sĩ thất bại"
          );
          return;
        }
      }

      toast.success("Thông tin đã được cập nhật thành công!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật");
    }
  };

  function checkPasswordStrength(newPassword) {
    const trimmed = newPassword.trim();

    if (trimmed.length < 8 || trimmed.length > 255) {
      return {
        valid: false,
        message: "Password must be between 8 and 255 characters.",
      };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(trimmed)) {
      return {
        valid: false,
        message:
          "Password phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
      };
    }

    return { valid: true };
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-wrapper">
        <div className="edit-profile-header">
          <h1 className="edit-profile-title">Chỉnh sửa thông tin cá nhân</h1>
          <p className="edit-profile-subtitle">
            Cập nhật thông tin của bạn để giữ hồ sơ luôn được chính xác
          </p>
        </div>

        <div className="edit-profile-card">
          <div className="edit-profile-banner">
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={avatarPreview}
                alt="Profile"
                className="edit-profile-avatar"
              />
              <label className="edit-profile-avatar-label">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <h2 className="edit-profile-name">{fullname}</h2>
            <p className="edit-profile-email">{email}</p>
          </div>

          <div className="edit-profile-tabs">
            <button
              onClick={() => setActiveTab("personal")}
              className={`edit-profile-tab-button ${
                activeTab === "personal" ? "active" : ""
              }`}
            >
              <User className="w-5 h-5 mr-2" /> Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`edit-profile-tab-button ${
                activeTab === "security" ? "active" : ""
              }`}
            >
              <Shield className="w-5 h-5 mr-2" /> Bảo mật
            </button>
          </div>

          <form className="edit-profile-section" onSubmit={handleSubmit}>
            {activeTab === "personal" && (
              <>
                <div className="edit-profile-field-group">
                  <div>
                    <label className="edit-profile-label">Tên người dùng</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="edit-profile-input"
                    />
                  </div>
                  <div>
                    <label className="edit-profile-label">Họ và tên</label>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="edit-profile-input"
                    />
                  </div>
                </div>

                <div className="edit-profile-field-group">
                  <div>
                    <label className="edit-profile-label">
                      <Mail className="w-4 h-4 inline mr-1" /> Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="edit-profile-input"
                    />
                  </div>
                </div>

                <div className="edit-profile-field-group">
                  <div>
                    <label className="edit-profile-label">
                      <Calendar className="w-4 h-4 inline mr-1" /> Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="edit-profile-input"
                    />
                  </div>
                  <div>
                    <label className="edit-profile-label">Giới tính</label>
                    <select
                      value={gender ? "1" : "0"}
                      onChange={(e) => setGender(e.target.value)}
                      className="edit-profile-select"
                    >
                      <option value="0">Nam</option>
                      <option value="1">Nữ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="edit-profile-label">
                    <MapPin className="w-4 h-4 inline mr-1" /> Địa chỉ
                  </label>
                  <input
                    maxLength={500}
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="edit-profile-input"
                  />
                </div>

                <div className="bio-div">
                  <label className="edit-profile-label">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="edit-profile-textarea"
                    placeholder="Viết một vài dòng giới thiệu về bản thân..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {bio.length} / 500 ký tự
                  </p>
                </div>

                {role === "ARTIST" && (
                  <>
                    <div className="bio-div">
                      <label className="edit-profile-label">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="edit-profile-input"
                      />
                    </div>
                    <div className="bio-div">
                      <label className="edit-profile-label">
                        Số năm kinh nghiệm
                      </label>
                      <input
                        type="number"
                        value={YOE}
                        onChange={(e) => setYOE(e.target.value)}
                        className="edit-profile-input"
                      />
                    </div>
                    <div className="bio-div">
                      <label className="edit-profile-label">Chuyên ngành</label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="edit-profile-input"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === "security" && (
              <>
                <div className="sec-div">
                  <label className="edit-profile-label">
                    Mật khẩu hiện tại
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="edit-profile-input"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <span
                      className="edit-profile-password-toggle"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="sec-div">
                  <label className="edit-profile-label">Mật khẩu mới</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="edit-profile-input"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <span
                      className="edit-profile-password-toggle"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="sec-div">
                  <label className="edit-profile-label">
                    Xác nhận mật khẩu mới
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="edit-profile-input"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <span
                      className="edit-profile-password-toggle"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className="edit-profile-buttons">
              <button
                type="button"
                className="edit-profile-btn-cancel"
                onClick={() => navigate("/")}
              >
                <X className="w-5 h-5 mr-2" /> Hủy
              </button>
              <button
                type="submit"
                className="edit-profile-btn-save"
                onClick={handleSubmit}
              >
                <Save className="w-5 h-5 mr-2" /> Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
