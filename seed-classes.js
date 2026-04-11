const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('./backend/models/Class');

dotenv.config();

/**
 * Seed file for Classes and their Subjects
 */

// Classes Data
const classesData = [
  {
    class: 'Play Group',
    department: 'Pre-basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Health Habits",
        "Social Habits",
        "Islamic Religious Studies",
        "Qur’an",
        "Arabic",
        "Poems",
        "Creative and Cultural Art"
    ],
  },
  {
    class: 'Kindergarten 1',
    department: 'Pre-basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Health Habits",
        "Social Habits",
        "Islamic Religious Studies",
        "Qur’an",
        "Arabic",
        "Poems",
        "Creative and Cultural Art"
    ],
  },
  {
    class: 'Kindergarten 2',
    department: 'Pre-basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Health Habits",
        "Social Habits",
        "Islamic Religious Studies",
        "Qur’an",
        "Arabic",
        "Poems",
        "Creative and Cultural Art",
        "Verbal Reasoning",
        "Quantitative Reasoning"
    ],
  },
  {
    class: 'Nursery 1',
    department: 'Pre-basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Health Habits",
        "Social Habits",
        "Islamic Religious Studies",
        "Qur’an",
        "Arabic",
        "Poems",
        "Creative and Cultural Art",
        "Verbal Reasoning",
        "Quantitative Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'Nursery 2',
    department: 'Pre-basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Creative and Cultural Art",
        "Home Economics",
        "Agricultural Science",
        "Quantitative Reasoning",
        "Verbal Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'Primary 1',
    department: 'Basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Creative and Cultural Art",
        "Home Economics",
        "Agricultural Science",
        "Quantitative Reasoning",
        "Verbal Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'Primary 2',
    department: 'Basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Creative and Cultural Art",
        "Home Economics",
        "Agricultural Science",
        "Quantitative Reasoning",
        "Verbal Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'Primary 3',
    department: 'Basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Creative and Cultural Art",
        "Home Economics",
        "Agricultural Science",
        "Quantitative Reasoning",
        "Verbal Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'Primary 4',
    department: 'Basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Creative and Cultural Art",
        "Home Economics",
        "Agricultural Science",
        "Quantitative Reasoning",
        "Verbal Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'Primary 5',
    department: 'Basic',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Creative and Cultural Art",
        "Home Economics",
        "Agricultural Science",
        "Quantitative Reasoning",
        "Verbal Reasoning",
        "Yoruba"
    ],
  },
  {
    class: 'JSS 1',
    department: 'Secondary',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Yoruba",
        "Agricultural Science",
        "Home Economics",
        "Business Studies",
        "History",
        "Creative and Cultural Art"
    ],
  },
  {
    class: 'JSS 2',
    department: 'Secondary',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Yoruba",
        "Agricultural Science",
        "Home Economics",
        "Business Studies",
        "History",
        "Creative and Cultural Art"
    ],
  },
  {
    class: 'JSS 3',
    department: 'Secondary',
    subjects: [
        "General Mathematics",
        "English Studies",
        "Basic Science",
        "Basic Technology",
        "Physical & Health Education",
        "Computer/ICT",
        "Qur’an",
        "Social Studies",
        "Civic Education",
        "Islamic Religious Studies",
        "Arabic",
        "Yoruba",
        "Agricultural Science",
        "Home Economics",
        "Business Studies",
        "History",
        "Creative and Cultural Art"
    ],
  },
  {
    class: 'SS 1',
    department: 'Science',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Biology",
        "Physics",
        "Chemistry",
        "Further Mathematics",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 1',
    department: 'Art',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Literature-in-English",
        "Government",
        "Islamic Religious Studies",
        "History",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 1',
    department: 'Commercial',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Commerce",
        "Accounting",
        "Marketing",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 2',
    department: 'Science',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Biology",
        "Physics",
        "Chemistry",
        "Further Mathematics",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 2',
    department: 'Art',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Literature-in-English",
        "Government",
        "Islamic Religious Studies",
        "History",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 2',
    department: 'Commercial',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Commerce",
        "Accounting",
        "Marketing",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 3',
    department: 'Science',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Biology",
        "Physics",
        "Chemistry",
        "Further Mathematics",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 3',
    department: 'Art',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Literature-in-English",
        "Government",
        "Islamic Religious Studies",
        "History",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },
  {
    class: 'SS 3',
    department: 'Commercial',
    subjects: [
        "General Mathematics",
        "English Language",
        "Civic Education",
        "Commerce",
        "Accounting",
        "Marketing",
        "Qur’an",
        "Arabic",
        "Yoruba",
        "Economics",
        "Agricultural Science"
    ],
  },


];

async function seedClasses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing classes and stale indexes
    await Class.deleteMany({});
    await Class.collection.dropIndexes().catch((err) => {
      if (err.codeName !== 'NamespaceNotFound') {
        throw err;
      }
    });
    console.log('✓ Cleared existing classes and stale indexes');

    // Insert new classes
    const insertedClasses = await Class.insertMany(classesData);
    console.log(`✓ Seeded ${insertedClasses.length} classes`);

    // List seeded classes
    console.log('\nSeeded Classes:');
    insertedClasses.forEach(cls => {
      console.log(`- ${cls.class} (${cls.department}): ${cls.subjects.length} subjects`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding classes:', error.message);
    process.exit(1);
  }
}

seedClasses();