const mongoose = require('mongoose');
const Result = require('./backend/models/Results');
require('dotenv').config();

const checkMigration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const academicYear = '2025-2026';
        const result = await Result.findOne({ academicYear });

        if (!result) {
            console.log('No results found');
            return;
        }

        console.log('Checking SS classes after migration...');

        for (const term of result.terms) {
            console.log(`\nTerm: ${term.termName}`);
            const ssClasses = term.classes.filter(cls => cls.className.startsWith('SS '));

            for (const ssClass of ssClasses) {
                console.log(`  Class: ${ssClass.className}, Department: ${ssClass.department || 'None'}, Students: ${ssClass.students.length}, Status: ${ssClass.approvalStatus || 'null'}`);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkMigration();