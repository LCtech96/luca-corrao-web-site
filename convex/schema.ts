import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // File management table for uploaded images
  files: defineTable({
    // File information
    storageId: v.id("_storage"), // Convex storage ID
    name: v.string(), // Original filename
    type: v.string(), // MIME type
    size: v.number(), // File size in bytes
    
    // Organization
    category: v.optional(v.string()), // e.g., "accommodation", "profile", "general"
    tags: v.optional(v.array(v.string())), // For categorization
    
    // Metadata
    description: v.optional(v.string()),
    altText: v.optional(v.string()),
    uploadedBy: v.optional(v.string()), // User ID who uploaded
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    
    // Status
    isActive: v.optional(v.boolean()),
  })
    .index("by_category", ["category"])
    .index("by_uploaded_by", ["uploadedBy"])
    .index("by_created_at", ["createdAt"]),

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
    
    // Images
    mainImage: v.string(),
    images: v.array(v.string()),
    imageDescriptions: v.optional(v.array(v.string())),
    
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
