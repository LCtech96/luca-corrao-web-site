import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Upload a file and store metadata
export const uploadFile = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    altText: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fileId = await ctx.db.insert("files", {
      ...args,
      createdAt: Date.now(),
      isActive: true,
    });
    
    return fileId;
  },
});

// Get file URL by storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get all files with optional filtering
export const getFiles = query({
  args: {
    category: v.optional(v.string()),
    uploadedBy: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("files").filter((q) => q.eq(q.field("isActive"), true));
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    if (args.uploadedBy) {
      query = query.filter((q) => q.eq(q.field("uploadedBy"), args.uploadedBy));
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

// Get file metadata by ID
export const getFileById = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file || !file.isActive) return null;
    
    return {
      ...file,
      url: await ctx.storage.getUrl(file.storageId),
    };
  },
});

// Update file metadata
export const updateFile = mutation({
  args: {
    fileId: v.id("files"),
    description: v.optional(v.string()),
    altText: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fileId, ...updates } = args;
    
    await ctx.db.patch(fileId, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return fileId;
  },
});

// Delete file (soft delete)
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) return null;
    
    // Soft delete by marking as inactive
    await ctx.db.patch(args.fileId, {
      isActive: false,
      updatedAt: Date.now(),
    });
    
    // Optionally, you can also delete from storage
    // await ctx.storage.delete(file.storageId);
    
    return args.fileId;
  },
});

// Generate upload URL for direct upload to Convex storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
