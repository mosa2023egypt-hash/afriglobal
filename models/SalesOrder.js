const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    contactPerson: { type: String },
    phone: { type: String },
    deliveryCity: { type: String },
    warehouseText: { type: String },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productNameAr: { type: String },
        origin: { type: mongoose.Schema.Types.ObjectId, ref: 'Origin' },
        originNameAr: { type: String },
        qtyTons: { type: Number },
        offeredPricePerTon: { type: Number },
    }],
    contactMethod: { type: String },
    customerReply: { type: String },
    notes: { type: String },
    importantNotes: { type: String },
    status: { 
        type: String, 
        enum: ['draft', 'submitted_to_procurement', 'procurement_responded', 'confirmed', 'cancelled'],
        default: 'draft'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedToProcurementAt: { type: Date },
    procurementRespondedAt: { type: Date },
}, { timestamps: true });

salesOrderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        // Use findOneAndUpdate on a counters collection for atomic sequence generation
        const Counter = mongoose.models.Counter || mongoose.model('Counter', new mongoose.Schema({
            _id: String,
            seq: { type: Number, default: 0 }
        }));
        const counter = await Counter.findByIdAndUpdate(
            'salesOrder',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.orderNumber = `SO-${String(counter.seq).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('SalesOrder', salesOrderSchema);
