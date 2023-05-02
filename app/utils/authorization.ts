import { Role } from "@prisma/client";

export function isAllowedToEditEvents(role: Role) {
    return role === Role.SOCIAL || role === Role.SOCIAL_PLUS || role === Role.ADMIN;
  }
  
export function isAllowedToCheckInGuest(role: Role) {
    return role === Role.SOCIAL || role === Role.SOCIAL_PLUS || role === Role.ADMIN;
  }