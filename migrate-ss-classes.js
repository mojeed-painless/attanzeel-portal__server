const mongoose = require('mongoose');
const Result = require('./backend/models/Results');
const User = require('./backend/models/User');
require('dotenv').config();

const migrateSSClasses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const academicYear = '2025-2026';
        const result = await Result.findOne({ academicYear });

        if (!result) {
            console.log('No results found for migration');
            return;
        }

        console.log('Starting migration of SS classes...');

        for (const term of result.terms) {
            const ssClasses = term.classes.filter(cls => cls.className.startsWith('SS '));

            for (const ssClass of ssClasses) {
                if (ssClass.department && ssClass.department !== '') {
                    // Already migrated
                    continue;
                }

                console.log(`Migrating class: ${ssClass.className}`);

                // Get all students in this class
                const studentIds = ssClass.students.map(s => s.studentId);
                const students = await User.find({ _id: { $in: studentIds }, role: 'student' });

                // Group students by department
                const studentsByDept = {};
                for (const student of students) {
                    const dept = student.department || 'General';
                    if (!studentsByDept[dept]) {
                        studentsByDept[dept] = [];
                    }
                    studentsByDept[dept].push(student);
                }

                // Create department-specific classes
                const newClasses = [];
                for (const [dept, deptStudents] of Object.entries(studentsByDept)) {
                    const deptClassStudents = ssClass.students.filter(s =>
                        deptStudents.some(stud => stud._id.toString() === s.studentId.toString())
                    );

                    if (deptClassStudents.length > 0) {
                        newClasses.push({
                            className: ssClass.className,
                            department: dept,
                            approvalStatus: null,
                            removedSubjects: ssClass.removedSubjects || [],
                            students: deptClassStudents
                        });
                        console.log(`  Created ${dept} class with ${deptClassStudents.length} students`);
                    }
                }

                // Replace the old class with department-specific ones
                const classIndex = term.classes.indexOf(ssClass);
                term.classes.splice(classIndex, 1, ...newClasses);
            }
        }

        await result.save();
        console.log('Migration completed successfully!');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateSSClasses();