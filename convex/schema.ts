import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // File storage table for managing uploaded files
  files: defineTable({
    storageId: v.id("_storage"), // Convex storage ID
    fileName: v.string(),
    fileType: v.string(), // MIME type
    fileSize: v.number(), // Size in bytes
    description: v.optional(v.string()),
    category: v.string(), // e.g., "accommodation", "structure", "profile"
    ownerId: v.optional(v.string()), // User who uploaded the file
    uploadedAt: v.number(),
    isActive: v.boolean(),
    deletedAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_owner", ["ownerId"])
    .index("by_active", ["isActive"])
    .index("by_uploaded_at", ["uploadedAt"]),

  accommodations: defineTable({
    // Basic Information
    name: v.string(),
    subtitle: v.optional(v.string()),
    description: v.string(),
    
    // Location
    address: v.optional(v.string()),
    distance: v.optional(v.string()),
    capacity: v.string(),
    
    // Features and Amenities
    features: v.array(v.string()),
    highlight: v.optional(v.string()),
    
    // Images - Updated to support both file IDs and URLs for backward compatibility
    mainImage: v.string(), // Can be file ID or URL
    images: v.array(v.string()), // Can be file IDs or URLs
    imageDescriptions: v.optional(v.array(v.string())),
    
    // New file-based image fields
    mainImageFileId: v.optional(v.id("files")),
    imageFileIds: v.optional(v.array(v.id("files"))),
    
    // Pricing
    price: v.string(),
    cleaningFee: v.optional(v.number()),
    petsAllowed: v.optional(v.boolean()),
    petSupplement: v.optional(v.number()),
    
    // Owner and Rating
    owner: v.string(),
    rating: v.optional(v.number()),
    isOwner: v.optional(v.boolean()),
    
    // Metadata
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_owner", ["owner"])
    .index("by_active", ["isActive"])
    .index("by_created_at", ["createdAt"]),
});
