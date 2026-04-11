"use client";
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cloneDeep } from "lodash";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import client from "@/app/client";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface ModalQuickViewProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ModalQuickView({ product, open, onClose }: ModalQuickViewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!product) return null;

  const hasSale = product.priceSale && product.priceSale > 0 && product.price > product.priceSale;

  const handleAddToCart = () => {
    if (!session) {
      toast.error("Please login first", {
        position: "bottom-right",
        duration: 3000,
      });
      router.push("/login");
      return;
    }
    client.setQueryData(["User Cart"], (initalValue: any) => {
      const updatedValue = Array.isArray(initalValue)
        ? [
            ...initalValue,
            {
              ...product,
              quantityAddtoCart: 1,
            },
          ]
        : [
            {
              ...product,
              quantityAddtoCart: 1,
            },
          ];
      const arrValue = cloneDeep(updatedValue).reduce((acc: any, item: any) => {
        const existingItem = acc.find((i: any) => i._id === item._id);
        if (existingItem) {
          existingItem.quantityAddtoCart += item.quantityAddtoCart;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      return arrValue;
    });
    toast.success("Added to cart", {
      position: "bottom-right",
      duration: 3000,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          bgcolor: "rgba(255,255,255,0.9)",
          "&:hover": { bgcolor: "#7eb693", color: "white" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", md: "50%" },
              height: { xs: 300, md: "100%" },
              minHeight: { xs: 300, md: 400 },
              bgcolor: "#f5f5f5",
            }}
          >
            {product.image && (
              <Image
                src={typeof product.image === "string" ? product.image : "/assets/img/placeholder.webp"}
                alt={product.name}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            )}
          </Box>

          <Box
            sx={{
              p: 4,
              width: { xs: "100%", md: "50%" },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#7eb693",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: "0.75rem",
              }}
            >
              {product.category?.[0]?.name || "Uncategorized"}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#274c5b",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  style={{
                    fontSize: "0.875rem",
                    color: i < (product.star || 0) ? "#ffa858" : "#d4d4d4",
                  }}
                />
              ))}
              <Typography variant="body2" sx={{ ml: 0.5, color: "text.secondary" }}>
                ({product.reviewCount || 0} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: hasSale ? "#e74c3c" : "#274c5b",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                ${hasSale ? product.priceSale : product.price}
              </Typography>
              {hasSale && (
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  ${product.price}
                </Typography>
              )}
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              {product.description || "No description available."}
            </Typography>

            {product.quantity === 0 ? (
              <Button
                variant="contained"
                disabled
                startIcon={<ShoppingCartIcon />}
                sx={{
                  bgcolor: "#ccc",
                  color: "#fff",
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#ccc" },
                }}
              >
                Sold Out
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleAddToCart}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  bgcolor: "#7eb693",
                  color: "white",
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#6aa583" },
                }}
              >
                Add to Cart
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}