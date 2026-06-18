export enum WorkspaceRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  MEMBER = 'member',
}

export const WorkspaceRoleHierarchy: Record<WorkspaceRole, number> = {
  [WorkspaceRole.OWNER]: 4,
  [WorkspaceRole.EDITOR]: 3,
  [WorkspaceRole.MEMBER]: 2,
  [WorkspaceRole.VIEWER]: 1,
};

export function canEditWorkspace(role: WorkspaceRole): boolean {
  return WorkspaceRoleHierarchy[role] >= WorkspaceRoleHierarchy[WorkspaceRole.EDITOR];
}

export function canViewWorkspace(role: WorkspaceRole): boolean {
  return WorkspaceRoleHierarchy[role] >= WorkspaceRoleHierarchy[WorkspaceRole.VIEWER];
}
