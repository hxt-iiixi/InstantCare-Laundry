import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { getDefaultRouteByRole } from "../utils/auth.js";

export default function GoogleButton() {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        try {
          const credential = res?.credential;

          // Use the same endpoint that returns user + role as your LoginPage
          const { data } = await api.post("/api/auth/google/login", { credential });

          // Save everything your ProtectedRoute / app relies on
          localStorage.setItem("token", data.token);
          if (data?.user?.role) localStorage.setItem("role", data.user.role);
          if (data?.user?.name) localStorage.setItem("name", data.user.name);
          if (data?.user?.churchName) localStorage.setItem("churchName", data.user.churchName);
          if (data?.user?.email) localStorage.setItem("prefillEmail", data.user.email);
          if (data?.user?.username) localStorage.setItem("username", data.user.username);
          if (data?.user?.avatar) localStorage.setItem("avatar", data.user.avatar);
          if (data?.user?.churchName) {
            localStorage.setItem("churchName", data.user.churchName);
            window.dispatchEvent(new CustomEvent("churchName:update", { detail: data.user.churchName }));
          } else if (data?.user?.role === "church-admin") {
            try {
              const resp = await api.get("/api/church-admin/me/church", {
                headers: { Authorization: `Bearer ${data.token}` },
              });
              const name = resp?.data?.church?.name;
              if (name) {
                localStorage.setItem("churchName", name);
                window.dispatchEvent(new CustomEvent("churchName:update", { detail: name }));
              }
            } catch {}
          }

          window.dispatchEvent(new Event("auth:update"));

          if (data.needsPassword) {
            toast.message("Almost done — create a password for email login.");
            navigate("/create-password", { replace: true });
            return;
          }

          toast.success("Signed in with Google");
          const dest = getDefaultRouteByRole(data?.user?.role);
          navigate(dest, { replace: true });
        } catch (e) {
          const status = e?.response?.status;
          const code = e?.response?.data?.code;
          const msg = e?.response?.data?.message;

          if (status === 403 && code === "UNDER_REVIEW") {
            toast.info("Your church admin application is under review. We’ll email you once it’s approved.");
            return;
          }
          toast.error(msg || "Google sign-in failed");
        }
      }}
      onError={() => toast.error("Google sign-in cancelled")}
      ux_mode="popup"
      text="continue_with"
      shape="pill"
      size="large"
      width="100%"
    />
  );
}
