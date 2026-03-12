export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  STAFF: "staff",
};

export const ROLE_LABELS = {
  [ROLES.OWNER]: "Sahip",
  [ROLES.ADMIN]: "Yönetici",
  [ROLES.STAFF]: "Personel",
};

export const ROUTE_PERMISSIONS = {
  "/dashboard": [ROLES.OWNER, ROLES.ADMIN, ROLES.STAFF],
  "/members": [ROLES.OWNER, ROLES.ADMIN],
  "/trainers": [ROLES.OWNER, ROLES.ADMIN],
  "/classes": [ROLES.OWNER, ROLES.ADMIN, ROLES.STAFF],
  "/bookings": [ROLES.OWNER, ROLES.ADMIN, ROLES.STAFF],
  "/memberships": [ROLES.OWNER, ROLES.ADMIN],
  "/membership-plans": [ROLES.OWNER, ROLES.ADMIN],
  "/payments": [ROLES.OWNER, ROLES.ADMIN],
  "/notifications": [ROLES.OWNER, ROLES.ADMIN, ROLES.STAFF],
  "/settings": [ROLES.OWNER, ROLES.ADMIN],
  "/staff": [ROLES.OWNER],
  "/subscription": [ROLES.OWNER],
};

export function hasPermission(role, path) {
  if (!role || !path) return false;

  const matchingRoute = Object.keys(ROUTE_PERMISSIONS)
    .sort((a, b) => b.length - a.length)
    .find((route) => path === route || path.startsWith(route + "/"));

  if (!matchingRoute) return true;
  return ROUTE_PERMISSIONS[matchingRoute].includes(role);
}

export function getPermittedRoutes(role) {
  if (!role) return [];
  return Object.entries(ROUTE_PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([route]) => route);
}
