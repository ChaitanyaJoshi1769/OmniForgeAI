export enum OrganizationRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export const OrganizationRoleHierarchy: Record<OrganizationRole, number> = {
  [OrganizationRole.OWNER]: 4,
  [OrganizationRole.ADMIN]: 3,
  [OrganizationRole.MEMBER]: 2,
  [OrganizationRole.GUEST]: 1,
};

export function canManageRole(
  userRole: OrganizationRole,
  targetRole: OrganizationRole,
): boolean {
  return OrganizationRoleHierarchy[userRole] > OrganizationRoleHierarchy[targetRole];
}
