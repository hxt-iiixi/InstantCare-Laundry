// src/pages/auth/CreatePasswordPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";

export default function CreatePasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("prefillEmail") || "");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Must be logged in via Google already (token present)
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in with Google first.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (pw1.length < 8) return toast.error("Password must be at least 8 characters.");
    if (pw1 !== pw2) return toast.error("Passwords do not match.");

    setLoading(true);
    try {
      await api.post("/api/set-password", { newPassword: pw1 });
      toast.success("Password created! You can now use email + password.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-2 text-center">Create Password</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        For <span className="font-medium">{email || "your account"}</span>
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="password"
          placeholder="New password (min 8 chars)"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-500 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Password"}
        </button>
      </form>
    </div>
  );
}
