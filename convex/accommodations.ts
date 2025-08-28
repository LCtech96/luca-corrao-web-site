import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get all active accommodations
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const accommodations = await ctx.db
      .query("accommodations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
    
    return accommodations;
  },
});

// Query to get accommodations by owner
export const getByOwner = query({
  args: { owner: v.string() },
  handler: async (ctx, args) => {
    const accommodations = await ctx.db
      .query("accommodations")
      .withIndex("by_owner", (q) => q.eq("owner", args.owner))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    return accommodations;
  },
});

// Query to get a single accommodation by ID
export const getById = query({
  args: { id: v.id("accommodations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to create a new accommodation
export const create = mutation({
  args: {
    name: v.string(),
    subtitle: v.optional(v.string()),
    description: v.string(),
    address: v.optional(v.string()),
    distance: v.optional(v.string()),
    capacity: v.string(),
    features: v.array(v.string()),
    highlight: v.optional(v.string()),
    mainImage: v.string(),
    images: v.array(v.string()),
    imageDescriptions: v.optional(v.array(v.string())),
    price: v.string(),
    cleaningFee: v.optional(v.number()),
    petsAllowed: v.optional(v.boolean()),
    petSupplement: v.optional(v.number()),
    owner: v.string(),
    rating: v.optional(v.number()),
    isOwner: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const accommodationId = await ctx.db.insert("accommodations", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    
    return accommodationId;
  },
});

// Mutation to update an existing accommodation
export const update = mutation({
  args: {
    id: v.id("accommodations"),
    name: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    description: v.optional(v.string()),
    address: v.optional(v.string()),
    distance: v.optional(v.string()),
    capacity: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    highlight: v.optional(v.string()),
    mainImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    imageDescriptions: v.optional(v.array(v.string())),
    price: v.optional(v.string()),
    cleaningFee: v.optional(v.number()),
    petsAllowed: v.optional(v.boolean()),
    petSupplement: v.optional(v.number()),
    owner: v.optional(v.string()),
    rating: v.optional(v.number()),
    isOwner: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // Filter out undefined values
    const cleanedUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(id, {
      ...cleanedUpdateData,
      updatedAt: Date.now(),
    });
    
    return await ctx.db.get(id);
  },
});

// Mutation to soft delete an accommodation (set isActive to false)
export const remove = mutation({
  args: { id: v.id("accommodations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Mutation to permanently delete an accommodation
export const deleteHard = mutation({
  args: { id: v.id("accommodations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Query to search accommodations by name or description
export const search = query({
  args: { 
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const searchTerm = args.searchTerm.toLowerCase();
    
    const accommodations = await ctx.db
      .query("accommodations")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Filter by search term in name, description, or features
    const filtered = accommodations.filter(accommodation => 
      accommodation.name.toLowerCase().includes(searchTerm) ||
      accommodation.description.toLowerCase().includes(searchTerm) ||
      accommodation.features.some(feature => 
        feature.toLowerCase().includes(searchTerm)
      )
    );
    
    return filtered.slice(0, limit);
  },
});
