import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useLoginUserMutation,
  useLoginWithPasskeyMutation,
} from "../api/query/auth";
import { useToast } from "../providers/ToastProvider";
import type { LoginPayload } from "../types";
import { useSearchParams } from "react-router-dom";

export default function Login() {
  const { control, handleSubmit } = useForm<LoginPayload>({
    defaultValues: { username: "", password: "" },
  });

  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const redirect_uri = searchParams.get("redirect_uri") || "/";
  const prefilledUsername = searchParams.get("username") || "";

  const [webauthnSupported, setWebauthnSupported] = useState(false);
  const [platformAuthenticatorAvailable, setPlatformAuthenticatorAvailable] =
    useState(false);

  const loginMutation = useLoginUserMutation();
  const loginPasskeyMutation = useLoginWithPasskeyMutation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      setWebauthnSupported(true);

      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => {
          setPlatformAuthenticatorAvailable(available);
        })
        .catch(() => setPlatformAuthenticatorAvailable(false));
    }
  }, []);

  const onSubmit = (data: LoginPayload) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        showToast(res.message, "success");
        // Redirect to main app
        window.location.href = redirect_uri;
      },
    });
  };

  const handleWebAuthnLogin = async () => {
    const username =
      prefilledUsername ||
      (document.getElementById("username") as HTMLInputElement)?.value;
    if (!username) {
      showToast("Please enter username first", "warning");
      return;
    }

    loginPasskeyMutation.mutate(username, {
      onSuccess: (res) => {
        showToast(res.message, "success");
        window.location.href = redirect_uri;
      },
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {prefilledUsername ? (
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center" }}>
              please enter password for: <strong>{prefilledUsername}</strong>
            </Typography>
          ) : (
            <Controller
              name="username"
              control={control}
              rules={{ required: "Username / Email / Phone is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="username"
                  label="Username / Email / Phone"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}

          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        {webauthnSupported && (
          <>
            <Divider sx={{ my: 2 }}>OR</Divider>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleWebAuthnLogin}
              disabled={!platformAuthenticatorAvailable}
            >
              {platformAuthenticatorAvailable
                ? "Login with Passkey (WebAuthn)"
                : "WebAuthn not available"}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
