import type { Role } from "@prisma/client";

export function getRoleClass(role: Role): string {
  switch (role) {
    case "USER":
      return "text-violet-700 bg-violet-50 ring-violet-600/20";
    case "RISK":
      return "text-green-700 bg-green-50 ring-green-600/20";
    case "SOCIAL":
      return "text-blue-700 bg-blue-50 ring-blue-600/20";
    case "SOCIAL_PLUS":
      return "text-yellow-700 bg-yellow-50 ring-yellow-600/20";
    case "ADMIN":
      return "text-red-700 bg-red-50 ring-red-600/20";
    default:
      return "text-gray-700 bg-gray-50 ring-gray-600/20";
  }
}

export function getRoleString(role: Role): string {
    switch (role) {
      case "USER":
        return "User";
      case "RISK":
        return "Risk Manager";
      case "SOCIAL":
        return "Social";
      case "SOCIAL_PLUS":
        return "Social+";
      case "ADMIN":
        return "Admin";
      default:
        return "Unverified";
    }
  }
  