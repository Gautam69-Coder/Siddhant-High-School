const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    admin_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    target_entity: {
      type: String,
      required: true,
    },
    target_id: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip_address: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
