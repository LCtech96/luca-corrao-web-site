import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for file upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Generate a secure upload URL that the client can use to upload files
    return await ctx.storage.generateUploadUrl();
  },
});

// Store file metadata after upload
export const storeFile = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    description: v.optional(v.string()),
    category: v.optional(v.string()), // e.g., "accommodation", "structure", "profile"
    ownerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fileId = await ctx.db.insert("files", {
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      description: args.description,
      category: args.category || "general",
      ownerId: args.ownerId,
      uploadedAt: Date.now(),
      isActive: true,
    });

    return fileId;
  },
});

// Get file URL from storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get file metadata by file ID
export const getFileById = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) return null;

    const url = await ctx.storage.getUrl(file.storageId);
    return {
      ...file,
      url,
    };
  },
});

// Get files by category or owner
export const getFilesByCategory = query({
  args: {
    category: v.optional(v.string()),
    ownerId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("files").filter((q) => q.eq(q.field("isActive"), true));

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.ownerId) {
      query = query.filter((q) => q.eq(q.field("ownerId"), args.ownerId));
    }

    const files = await query
      .order("desc")
      .take(args.limit || 50);

    // Get URLs for all files
    const filesWithUrls = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );

    return filesWithUrls;
  },
});

// Delete file (soft delete)
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.fileId, {
      isActive: false,
      deletedAt: Date.now(),
    });

    return { success: true };
  },
});

// Permanently delete file from storage
export const deleteFileHard = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error("File not found");

    // Delete from storage
    await ctx.storage.delete(file.storageId);
    
    // Delete from database
    await ctx.db.delete(args.fileId);

    return { success: true };
  },
});

// Update file metadata
export const updateFile = mutation({
  args: {
    fileId: v.id("files"),
    fileName: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fileId, ...updates } = args;
    
    // Filter out undefined values
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(fileId, {
      ...cleanedUpdates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(fileId);
  },
});

// Get file storage usage statistics
export const getStorageStats = query({
  args: { ownerId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("files").filter((q) => q.eq(q.field("isActive"), true));

    if (args.ownerId) {
      query = query.filter((q) => q.eq(q.field("ownerId"), args.ownerId));
    }

    const files = await query.collect();

    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0);
    const categories = files.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles,
      totalSize,
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      categories,
    };
  },
});

