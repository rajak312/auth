import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useRegisterUserMutation } from "../api/query/auth";
import { useToast } from "../providers/ToastProvider";
import type { RegisterPayload } from "../types/auth";
import { useSearchParams } from "react-router-dom";

type RegisterFormValues = RegisterPayload & {
  confirmPassword: string;
};

export default function Register() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const redirect_uri = searchParams.get("redirect_uri") || "/";

  const registerMutation = useRegisterUserMutation();

  const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phoneNumber: "",
    },
  });

  watch("password");

  const onSubmit = (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    const payload: RegisterPayload = {
      username: data.username,
      password: data.password,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };

    registerMutation.mutate(payload, {
      onSuccess: (res) => {
        showToast(res.message, "success");
        const loginUrl = `/login?redirect_uri=${encodeURIComponent(
          redirect_uri
        )}`;
        window.location.href = loginUrl;
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
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Username"
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

          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: "Confirm Password is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Invalid email format",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email (optional)"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Phone must be 10–15 digits",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Phone Number (optional)"
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
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
