import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
