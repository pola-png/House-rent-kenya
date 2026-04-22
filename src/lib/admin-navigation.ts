const ADMIN_MODE_PATHS = [
  "/admin/admin-dashboard",
  "/admin/users",
  "/admin/analytics",
  "/admin/bulk-actions",
  "/admin/settings",
  "/admin/blog",
  "/admin/all-properties",
  "/admin/promotions",
  "/admin/payment-approvals",
  "/admin/system-settings",
  "/admin/leads",
  "/admin/my-team",
];

export function isAdminModePath(pathname?: string | null) {
  return ADMIN_MODE_PATHS.some((path) => pathname?.startsWith(path));
}

export function getDashboardUrlForPath(pathname?: string | null, role?: string | null) {
  if (role !== "admin") {
    return "/admin/dashboard";
  }

  return isAdminModePath(pathname) ? "/admin/admin-dashboard" : "/admin/dashboard";
}
