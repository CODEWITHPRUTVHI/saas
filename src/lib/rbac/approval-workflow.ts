import { db } from "../db";

// ─── Approval Stage Definitions ───────────────────────────────────────────────
export const APPROVAL_STAGES = [
  "DRAFT",
  "SUBMITTED",
  "EDITOR_REVIEW",
  "MANAGER_REVIEW",
  "OWNER_APPROVED",
  "PUBLISHED",
  "REJECTED",
] as const;

export type ApprovalStage = typeof APPROVAL_STAGES[number];

export interface StageTransition {
  from: ApprovalStage;
  to: ApprovalStage;
  requiredRole: string; // RBAC role that can trigger this transition
  label: string;
  actionLabel: string;
}

// ─── State Machine Transition Map ────────────────────────────────────────────
export const TRANSITIONS: StageTransition[] = [
  { from: "DRAFT",          to: "SUBMITTED",      requiredRole: "EDITOR",   label: "Submit for Review",     actionLabel: "Submit" },
  { from: "SUBMITTED",      to: "EDITOR_REVIEW",  requiredRole: "EDITOR",   label: "Start Editor Review",   actionLabel: "Begin Review" },
  { from: "EDITOR_REVIEW",  to: "MANAGER_REVIEW", requiredRole: "MANAGER",  label: "Escalate to Manager",   actionLabel: "Approve → Manager" },
  { from: "MANAGER_REVIEW", to: "OWNER_APPROVED", requiredRole: "OWNER",    label: "Owner Final Approval",  actionLabel: "Approve → Publish" },
  { from: "OWNER_APPROVED", to: "PUBLISHED",       requiredRole: "PUBLISHER",label: "Mark Published",        actionLabel: "Publish Now" },
  // Reject from any review stage
  { from: "SUBMITTED",      to: "REJECTED",       requiredRole: "EDITOR",   label: "Reject",               actionLabel: "Reject" },
  { from: "EDITOR_REVIEW",  to: "REJECTED",       requiredRole: "EDITOR",   label: "Reject",               actionLabel: "Reject" },
  { from: "MANAGER_REVIEW", to: "REJECTED",       requiredRole: "MANAGER",  label: "Reject",               actionLabel: "Reject" },
  // Return to draft from rejected
  { from: "REJECTED",       to: "DRAFT",          requiredRole: "EDITOR",   label: "Return to Draft",       actionLabel: "Revise" },
];

// ─── Valid Next Stages from a Given Stage ─────────────────────────────────────
export function getAvailableTransitions(currentStage: ApprovalStage): StageTransition[] {
  return TRANSITIONS.filter((t) => t.from === currentStage);
}

// ─── Stage Color & Icon Mapping (for UI) ──────────────────────────────────────
export const STAGE_CONFIG: Record<ApprovalStage, { label: string; color: string; dotColor: string }> = {
  DRAFT:          { label: "Draft",           color: "text-gray-400 bg-gray-500/15 border-gray-500/30",     dotColor: "bg-gray-400" },
  SUBMITTED:      { label: "Submitted",       color: "text-blue-400 bg-blue-500/15 border-blue-500/30",     dotColor: "bg-blue-400" },
  EDITOR_REVIEW:  { label: "Editor Review",   color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30",     dotColor: "bg-cyan-400" },
  MANAGER_REVIEW: { label: "Manager Review",  color: "text-amber-400 bg-amber-500/15 border-amber-500/30",  dotColor: "bg-amber-400" },
  OWNER_APPROVED: { label: "Owner Approved",  color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", dotColor: "bg-emerald-400" },
  PUBLISHED:      { label: "Published",       color: "text-brand-accent bg-brand-500/15 border-brand-500/30", dotColor: "bg-brand-accent" },
  REJECTED:       { label: "Rejected",        color: "text-red-400 bg-red-500/15 border-red-500/30",        dotColor: "bg-red-400" },
};

// ─── Advance Content Item Through Workflow ────────────────────────────────────
export async function advanceWorkflowStage(
  contentItemId: string,
  toStage: ApprovalStage,
  userId: string,
  rejectionReason?: string
): Promise<{ success: boolean; newStage: ApprovalStage; error?: string }> {
  const item = await db.contentItem.findUnique({
    where: { id: contentItemId },
  });

  if (!item) return { success: false, newStage: "DRAFT", error: "Content item not found." };

  const currentStage = (item.approvalStage ?? "DRAFT") as ApprovalStage;
  const validTransition = TRANSITIONS.find((t) => t.from === currentStage && t.to === toStage);

  if (!validTransition) {
    return {
      success: false,
      newStage: currentStage,
      error: `Invalid transition: ${currentStage} → ${toStage}`,
    };
  }

  const updateData: any = {
    approvalStage: toStage,
    updatedAt: new Date(),
  };

  if (toStage === "OWNER_APPROVED" || toStage === "PUBLISHED") {
    updateData.approvedBy = userId;
    updateData.approvedAt = new Date();
    if (toStage === "PUBLISHED") updateData.status = "PUBLISHED";
  }

  if (toStage === "REJECTED") {
    updateData.rejectedBy = userId;
    updateData.rejectionReason = rejectionReason ?? "No reason provided.";
  }

  await db.contentItem.update({
    where: { id: contentItemId },
    data: updateData,
  });

  // Write audit log
  const contentItem = await db.contentItem.findUnique({ where: { id: contentItemId }, include: { brand: { include: { workspace: true } } } });
  if (contentItem?.brand?.workspace?.id) {
    await db.auditLog.create({
      data: {
        workspaceId: contentItem.brand.workspace.id,
        userId,
        action: `APPROVAL_STAGE_ADVANCED:${currentStage}_TO_${toStage}`,
        entityType: "CONTENT_ITEM",
        entityId: contentItemId,
        details: rejectionReason ?? null,
      },
    });
  }

  return { success: true, newStage: toStage };
}
