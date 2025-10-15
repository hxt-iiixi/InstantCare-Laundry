// src/components/GoogleButton.jsx
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function GoogleButton() {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (res) => {
        try {
          const credential = res?.credential;
          const { data } = await api.post("/api/auth/google", { credential });
          localStorage.setItem("token", data.token);
          if (data?.user?.email) localStorage.setItem("prefillEmail", data.user.email);

          if (data.needsPassword) {
            toast.message("Almost done — create a password for email login.");
            navigate("/create-password", { replace: true });
          } else {
            toast.success("Signed in with Google");
            navigate("/dashboard");
          }
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
