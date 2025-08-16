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

type LoginFormValues = {
  username: string;
  password: string;
};

export default function Login() {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: { username: "", password: "" },
  });

  const [webauthnSupported, setWebauthnSupported] = useState(false);
  const [platformAuthenticatorAvailable, setPlatformAuthenticatorAvailable] =
    useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.PublicKeyCredential) {
      setWebauthnSupported(true);

      // optional: check if platform authenticator is available
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => {
          setPlatformAuthenticatorAvailable(available);
        })
        .catch(() => {
          setPlatformAuthenticatorAvailable(false);
        });
    }
  }, []);

  const onSubmit = (data: LoginFormValues) => {
    console.log("Login form data:", data);
    // TODO: call password login mutation
  };

  const handleWebAuthnLogin = async () => {
    console.log("Attempting WebAuthn login...");
    // TODO: implement navigator.credentials.get(...) with backend challenge
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignContent="center"
      alignSelf="center"
      alignItems="center"
      minHeight="100vh"
      minWidth="100vw"
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username / Email / Phone is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Username / Email / Phone"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

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

        {/* Divider for clarity */}
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
