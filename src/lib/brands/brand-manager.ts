import { db } from "../db";

export interface BrandCreateInput {
  workspaceId: string;
  name: string;
  logoUrl?: string;
  brandVoiceProfile?: string;
  defaultHashtags?: string;
  primaryLanguage?: string;
  targetLanguages?: string;
  templateId?: string;
}

// ─── Create Brand ─────────────────────────────────────────────────────────────
export async function createBrand(input: BrandCreateInput) {
  let templateData: Partial<BrandCreateInput> = {};

  if (input.templateId) {
    const template = await db.brandTemplate.findUnique({ where: { id: input.templateId } });
    if (template) {
      templateData = {
        brandVoiceProfile: template.brandVoiceProfile ?? undefined,
        defaultHashtags: template.defaultHashtags ?? undefined,
        primaryLanguage: template.primaryLanguage,
        targetLanguages: template.targetLanguages ?? undefined,
        logoUrl: template.logoUrl ?? undefined,
      };
    }
  }

  const brand = await db.brand.create({
    data: {
      workspaceId: input.workspaceId,
      name: input.name,
      logoUrl: input.logoUrl ?? templateData.logoUrl,
      brandVoiceProfile: input.brandVoiceProfile ?? templateData.brandVoiceProfile,
      defaultHashtags: input.defaultHashtags ?? templateData.defaultHashtags,
      primaryLanguage: input.primaryLanguage ?? templateData.primaryLanguage ?? "en",
      targetLanguages: input.targetLanguages ?? templateData.targetLanguages,
      templateId: input.templateId,
    },
  });

  // Create default brand kit
  await db.brandKit.create({
    data: {
      brandId: brand.id,
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      accentColor: "#06b6d4",
      fontPrimary: "Inter",
      fontSecondary: "Roboto",
    },
  });

  // Create default approval workflow
  await db.approvalWorkflow.create({
    data: {
      brandId: brand.id,
      name: "Standard Approval",
      stages: "DRAFT,SUBMITTED,EDITOR_REVIEW,MANAGER_REVIEW,OWNER_APPROVED",
      isActive: true,
    },
  });

  return brand;
}

// ─── Duplicate Brand ──────────────────────────────────────────────────────────
export async function duplicateBrand(sourceBrandId: string, newName: string) {
  const source = await db.brand.findUnique({
    where: { id: sourceBrandId },
    include: { brandKit: true },
  });

  if (!source) throw new Error(`Brand ${sourceBrandId} not found.`);

  const newBrand = await db.brand.create({
    data: {
      workspaceId: source.workspaceId,
      name: newName,
      logoUrl: source.logoUrl,
      brandVoiceProfile: source.brandVoiceProfile,
      defaultHashtags: source.defaultHashtags,
      primaryLanguage: source.primaryLanguage,
      targetLanguages: source.targetLanguages,
      templateId: source.templateId,
      isDuplicate: true,
      duplicatedFromId: sourceBrandId,
    },
  });

  // Clone brand kit
  if (source.brandKit) {
    await db.brandKit.create({
      data: {
        brandId: newBrand.id,
        logoUrl: source.brandKit.logoUrl,
        iconUrl: source.brandKit.iconUrl,
        primaryColor: source.brandKit.primaryColor,
        secondaryColor: source.brandKit.secondaryColor,
        accentColor: source.brandKit.accentColor,
        fontPrimary: source.brandKit.fontPrimary,
        fontSecondary: source.brandKit.fontSecondary,
      },
    });
  }

  // Clone approval workflow
  await db.approvalWorkflow.create({
    data: {
      brandId: newBrand.id,
      name: "Standard Approval",
      stages: "DRAFT,SUBMITTED,EDITOR_REVIEW,MANAGER_REVIEW,OWNER_APPROVED",
      isActive: true,
    },
  });

  return newBrand;
}

// ─── List Brands (paginated, with search) ─────────────────────────────────────
export async function listBrands(workspaceId: string, options?: {
  search?: string;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}) {
  const { search, page = 1, pageSize = 20, isActive } = options ?? {};
  const skip = (page - 1) * pageSize;

  const where: any = {
    workspaceId,
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search ? { name: { contains: search } } : {}),
  };

  const [brands, total] = await Promise.all([
    db.brand.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        brandKit: true,
        _count: { select: { contentItems: true, socialAccounts: true } },
      },
    }),
    db.brand.count({ where }),
  ]);

  return { brands, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// ─── Create Brand Template ────────────────────────────────────────────────────
export async function createBrandTemplate(workspaceId: string, data: {
  name: string;
  description?: string;
  brandVoiceProfile?: string;
  defaultHashtags?: string;
  primaryColor?: string;
  secondaryColor?: string;
  defaultPlatforms?: string;
}) {
  return db.brandTemplate.create({
    data: { workspaceId, ...data },
  });
}
