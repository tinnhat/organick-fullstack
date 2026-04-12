"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  FileCopy as FileCopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import "../style.scss";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const generatePassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChars = uppercase + lowercase + numbers;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 3; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split("").sort(() => Math.random() - 0.5).join("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGeneratePassword = () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", {
        position: "bottom-right",
      });
      return;
    }

    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setIsCopied(false);
    setIsModalOpen(true);
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setIsCopied(true);
      toast.success("Password copied!", {
        position: "bottom-right",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy", {
        position: "bottom-right",
      });
    }
  };

  const handleBackToLogin = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="bkg-login-img" />
        <div className="box">
          <p className="box__title mb-0 title">Organick</p>
          <p className="box__title">Forgot Password</p>
          <p className="box__desc">
            Enter your email and we&apos;ll generate a new password for you.
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="btn-create-account"
            >
              Generate Password
            </button>
          </form>
          <p className="box__text">
            Remember your password?<span onClick={() => router.push("/login")}>Login</span>
          </p>
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#365C1B",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Password Generated
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, backgroundColor: "#f8f8f8" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#E8F5E9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckIcon sx={{ color: "#365C1B", fontSize: 32 }} />
            </Box>
            <Typography sx={{ color: "#365C1B", fontWeight: 600, mb: 0.5 }}>
              Your new password is ready!
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 14 }}>
              Copy and keep it safe
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              backgroundColor: "#fff",
              p: 1,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <TextField
              fullWidth
              readOnly
              value={generatedPassword}
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f5f5f5",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: 1,
                },
              }}
            />
            <Button
              variant={isCopied ? "contained" : "outlined"}
              onClick={handleCopyPassword}
              startIcon={isCopied ? <CheckIcon /> : <FileCopyIcon />}
              sx={{
                minWidth: 100,
                backgroundColor: isCopied ? "#365C1B" : "transparent",
                borderColor: "#365C1B",
                color: isCopied ? "#fff" : "#365C1B",
                fontSize: 14,
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: isCopied ? "#2a4515" : "#E8F5E9",
                  borderColor: isCopied ? "#2a4515" : "#365C1B",
                },
              }}
            >
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleBackToLogin}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#365C1B",
              color: "#fff",
              py: 1.5,
              borderRadius: 2,
              fontSize: 15,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#2a4515",
              },
            }}
          >
            Back to Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;