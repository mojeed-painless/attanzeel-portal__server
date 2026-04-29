const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    academicYear: {
        type: String,
        required: true,
        trim: true
    },
    terms: [{
        termName: {
            type: String,
            required: true,
            enum: ['First Term', 'Second Term', 'Third Term']
        },
        classes: [{
            className: {
                type: String,
                required: true,
                trim: true
            },
            department: {
                type: String,
                trim: true,
                default: ''
            },
            approvalStatus: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: null
            },
            removedSubjects: {
                type: [{
                    code: { type: String, trim: true },
                    name: { type: String, trim: true }
                }],
                default: []
            },
            students: [{
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                username: {
                    type: String,
                    trim: true,
                    required: true
                },
                scores: {
                    type: Map,
                    of: {
                        test: {
                            type: Number,
                            min: 0,
                            max: 100,
                            default: 0
                        },
                        exam: {
                            type: Number,
                            min: 0,
                            max: 100,
                            default: 0
                        }
                    },
                    default: {}
                },
                comments: {
                    type: String,
                    default: ''
                }
            }]
        }]
    }]
}, {
    timestamps: true
});

// Index for efficient queries
resultSchema.index({ academicYear: 1 });
resultSchema.index({ 'terms.termName': 1 });
resultSchema.index({ 'terms.classes.className': 1 });
resultSchema.index({ 'terms.classes.department': 1 });

module.exports = mongoose.model('Result', resultSchema);