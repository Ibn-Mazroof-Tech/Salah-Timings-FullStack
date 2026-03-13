import { Role } from "@prisma/client";

export function canCreateMosque(role: Role) {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export function canEditMosque(role: Role) {
  return role === Role.ADMIN || role === Role.EDITOR;
}

export function canDeleteMosque(role: Role) {
  return role === Role.ADMIN;
}

export function canManageUsers(role: Role) {
  return role === Role.ADMIN;
}
