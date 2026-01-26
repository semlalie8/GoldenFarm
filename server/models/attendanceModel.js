import mongoose from 'mongoose';

const attendanceSchema = mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    clockIn: Date,
    clockOut: Date,
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Half-Day', 'Holiday'],
        default: 'Present'
    },
    workHours: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    notes: String
}, {
    timestamps: true
});

// Index for quick payroll aggregation
attendanceSchema.index({ employee: 1, date: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
