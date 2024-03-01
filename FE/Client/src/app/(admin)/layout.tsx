import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { baselightTheme } from "../utils/theme/DefaultColors";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <AppRouterCacheProvider>
        <ThemeProvider theme={baselightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}

