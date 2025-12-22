"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Paper,
  ClickAwayListener,
  Portal,
  useMediaQuery,
  Typography,
  Tooltip, // ✅ import Tooltip
} from "@mui/material";
import { QrCode as QrCodeIcon } from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";

export default function UserQRCode({ qrCodeString }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [position, setPosition] = useState(null);

  // Calculate popover position on desktop
  useEffect(() => {
    if (buttonRef.current && open && !isMobile) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 220, // popover height
        left: rect.left + rect.width / 2 - 100, // center horizontally
      });
    }
    if (isMobile) {
      setPosition({ top: 0, left: 0 }); // mobile ignores position
    }
  }, [buttonRef, open, isMobile]);

  return (
    <>
      {/* QR Icon with Tooltip */}
      <Tooltip title="Click to open" arrow>
        <IconButton size="small" ref={buttonRef} onClick={() => setOpen(true)}>
          <QrCodeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Popover */}
      {open && (isMobile || position) && (
        <Portal>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Paper
              sx={{
                position: "fixed",
                top: isMobile ? "50%" : position.top,
                left: isMobile ? "50%" : position.left,
                transform: isMobile ? "translate(-50%, -50%)" : "none",
                zIndex: 9999,
                p: 2,
                borderRadius: 2,
                width: isMobile ? 300 : 200,
                height: isMobile ? 320 : "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QRCodeCanvas
                value={qrCodeString}
                size={isMobile ? 250 : 200}
                level="H"
                includeMargin
              />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Scan QR to connect
              </Typography>
            </Paper>
          </ClickAwayListener>
        </Portal>
      )}
    </>
  );
}
