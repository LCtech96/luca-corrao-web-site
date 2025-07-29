import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(), // "admin", "user", "manager"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  structures: defineTable({
    name: v.string(),
    description: v.string(),
    address: v.string(),
    city: v.string(),
    province: v.string(),
    postalCode: v.string(),
    country: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    type: v.string(), // "hotel", "b&b", "apartment", "villa"
    capacity: v.number(),
    pricePerNight: v.number(),
    currency: v.string(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    isActive: v.boolean(),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_city", ["city"])
    .index("by_type", ["type"])
    .index("by_active", ["isActive"]),

  bookings: defineTable({
    structureId: v.id("structures"),
    userId: v.id("users"),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.optional(v.string()),
    checkIn: v.number(), // timestamp
    checkOut: v.number(), // timestamp
    guests: v.number(),
    totalPrice: v.number(),
    currency: v.string(),
    status: v.string(), // "pending", "confirmed", "cancelled", "completed"
    paymentStatus: v.string(), // "pending", "paid", "refunded"
    specialRequests: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_structure", ["structureId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_dates", ["checkIn", "checkOut"]),

  verificationCodes: defineTable({
    email: v.string(),
    code: v.string(),
    type: v.string(), // "email_verification", "password_reset"
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_expires", ["expiresAt"]),

  aiAgents: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.string(), // "booking", "support", "recommendation"
    configuration: v.any(),
    isActive: v.boolean(),
    structureId: v.optional(v.id("structures")),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_structure", ["structureId"])
    .index("by_type", ["type"]),
}); 