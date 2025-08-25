import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../utils/api";

function UserSetting() {
  const [activeTab, setActiveTab] = useState("user");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showSellerWarning, setShowSellerWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          const response = await apiService.getCurrentUserProfile(user.id);
          console.log("API Response:", response?.data); // Debug log
          
          if (response?.data?.success && response?.data?.user) {
            const userData = response.data.user;
            console.log("User data:", userData); // Debug log
            
            setForm(prev => ({
              ...prev,
              fullName: userData?.fullName || "",
              email: userData?.email || "",
              phoneNumber: userData?.phoneNumber || "",
              address: userData?.address || "",
            }));
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setMessage({ text: "Cannot load user information", type: "error" });
        }
      }
    };

    loadUserData();
  }, [user]);

  // Early return if user is not loaded yet
  if (!user) {
    return (
      <div className="container mt-4 d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setMessage({ text: "Cannot find user information", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Update profile
      const updateData = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      };

      const response = await apiService.updateUserProfile(user.id, updateData);
      
      if (response.data.success) {
        setMessage({ text: "Successfully updated information!", type: "success" });
        
        // Update password if provided
        if (showPasswordChange && form.oldPassword && form.newPassword) {
          if (form.newPassword !== form.confirmPassword) {
            setMessage({ text: "New password does not match!", type: "error" });
            setLoading(false);
            return;
          }

          try {
            const passwordResponse = await apiService.changePassword(user.id, {
              oldPassword: form.oldPassword,
              newPassword: form.newPassword,
            });

            if (passwordResponse.data.success) {
              setMessage({ text: "Successfully updated information and password!", type: "success" });
              setForm(prev => ({
                ...prev,
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }));
              setShowPasswordChange(false);
            }
          } catch (passwordError) {
            console.error("Password change error:", passwordError);
            const errorMsg = passwordError.response?.data?.message || "Cannot change password";
            setMessage({ text: `Information updated, but ${errorMsg}`, type: "warning" });
          }
        }

        // Optionally navigate back after successful update
        setTimeout(() => {
          navigate("/user");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMsg = error.response?.data?.message || "Cannot update information";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500, border: "1px solid black", padding: "20px", borderRadius: "10px"}}>
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link${activeTab === "user" ? " active" : ""}`}
            onClick={() => setActiveTab("user")}
            type="button"
          >
            User
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            type="button"
            onClick={() => {
              if (user?.role === "seller") {
                navigate("/seller");
              } else {
                setShowSellerWarning(true);
              }
            }}
          >
            Seller
          </button>
        </li>
      </ul>
      {showSellerWarning && (
        <div className="alert alert-warning" role="alert">
          You must register to become a seller
        </div>
      )}

      {/* Message Display */}
      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : message.type === 'success' ? 'success' : 'warning'}`} role="alert">
          {message.text}
        </div>
      )}

      {/* User Info Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            disabled
            title="Email cannot be changed"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        {/* Danger Zone: Change Password */}
        <div className="mt-4">
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={() => setShowPasswordChange((v) => !v)}
          >
            Change Password
          </button>
          {showPasswordChange && (
            <div className="border border-danger rounded p-3 mt-3 bg-light">
              <h6 className="text-danger mb-3">Change Password</h6>
              <div className="mb-2">
                <label htmlFor="oldPassword" className="form-label">Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter old password"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <div className="mt-4 d-flex justify-content-end">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserSetting; 