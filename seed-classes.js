const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('./backend/models/Class');

dotenv.config();

/**
 * Seed file for Classes and their Subjects
 */

const classesData = [
  {
    class: 'Play Group',
    department: 'Pre-basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Health Habits", code: "HHB" },
      { name: "Social Habits", code: "SHB" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Poems", code: "POM" },
      { name: "Creative and Cultural Art", code: "CCA" }
    ],
  },
  {
    class: 'Kindergarten 1',
    department: 'Pre-basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Health Habits", code: "HHB" },
      { name: "Social Habits", code: "SHB" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Poems", code: "POM" },
      { name: "Creative and Cultural Art", code: "CCA" }
    ],
  },
  {
    class: 'Kindergarten 2',
    department: 'Pre-basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Health Habits", code: "HHB" },
      { name: "Social Habits", code: "SHB" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Poems", code: "POM" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Quantitative Reasoning", code: "QTR" }
    ],
  },
  {
    class: 'Nursery 1',
    department: 'Pre-basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Health Habits", code: "HHB" },
      { name: "Social Habits", code: "SHB" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Poems", code: "POM" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'Nursery 2',
    department: 'Pre-basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Home Economics", code: "HEC" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'Primary 1',
    department: 'Basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Home Economics", code: "HEC" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'Primary 2',
    department: 'Basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Home Economics", code: "HEC" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'Primary 3',
    department: 'Basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Home Economics", code: "HEC" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'Primary 4',
    department: 'Basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Home Economics", code: "HEC" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'Primary 5',
    department: 'Basic',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Creative and Cultural Art", code: "CCA" },
      { name: "Home Economics", code: "HEC" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Quantitative Reasoning", code: "QTR" },
      { name: "Verbal Reasoning", code: "VBR" },
      { name: "Yoruba", code: "YOR" }
    ],
  },
  {
    class: 'JSS 1',
    department: 'Secondary',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Home Economics", code: "HEC" },
      { name: "Business Studies", code: "BST" },
      { name: "History", code: "HIS" },
      { name: "Creative and Cultural Art", code: "CCA" }
    ],
  },
  {
    class: 'JSS 2',
    department: 'Secondary',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Home Economics", code: "HEC" },
      { name: "Business Studies", code: "BST" },
      { name: "History", code: "HIS" },
      { name: "Creative and Cultural Art", code: "CCA" }
    ],
  },
  {
    class: 'JSS 3',
    department: 'Secondary',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Studies", code: "ENG" },
      { name: "Basic Science", code: "SCI" },
      { name: "Basic Technology", code: "TEC" },
      { name: "Physical & Health Education", code: "PHE" },
      { name: "Computer/ICT", code: "ICT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Social Studies", code: "SST" },
      { name: "Civic Education", code: "CVC" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Agricultural Science", code: "AGR" },
      { name: "Home Economics", code: "HEC" },
      { name: "Business Studies", code: "BST" },
      { name: "History", code: "HIS" },
      { name: "Creative and Cultural Art", code: "CCA" }
    ],
  },
  {
    class: 'SS 1',
    department: 'Science',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Biology", code: "BIO" },
      { name: "Physics", code: "PHY" },
      { name: "Chemistry", code: "CHE" },
      { name: "Further Mathematics", code: "FMT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 1',
    department: 'Art',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Literature-in-English", code: "LIE" },
      { name: "Government", code: "GOV" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "History", code: "HIS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 1',
    department: 'Commercial',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Commerce", code: "COM" },
      { name: "Accounting", code: "ACC" },
      { name: "Marketing", code: "MKT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 2',
    department: 'Science',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Biology", code: "BIO" },
      { name: "Physics", code: "PHY" },
      { name: "Chemistry", code: "CHE" },
      { name: "Further Mathematics", code: "FMT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 2',
    department: 'Art',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Literature-in-English", code: "LIE" },
      { name: "Government", code: "GOV" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "History", code: "HIS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 2',
    department: 'Commercial',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Commerce", code: "COM" },
      { name: "Accounting", code: "ACC" },
      { name: "Marketing", code: "MKT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 3',
    department: 'Science',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Biology", code: "BIO" },
      { name: "Physics", code: "PHY" },
      { name: "Chemistry", code: "CHE" },
      { name: "Further Mathematics", code: "FMT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 3',
    department: 'Art',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Literature-in-English", code: "LIE" },
      { name: "Government", code: "GOV" },
      { name: "Islamic Religious Studies", code: "IRS" },
      { name: "History", code: "HIS" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  },
  {
    class: 'SS 3',
    department: 'Commercial',
    subjects: [
      { name: "General Mathematics", code: "MAT" },
      { name: "English Language", code: "ENG" },
      { name: "Civic Education", code: "CVC" },
      { name: "Commerce", code: "COM" },
      { name: "Accounting", code: "ACC" },
      { name: "Marketing", code: "MKT" },
      { name: "Qur’an", code: "QUR" },
      { name: "Arabic", code: "ARA" },
      { name: "Yoruba", code: "YOR" },
      { name: "Economics", code: "ECO" },
      { name: "Agricultural Science", code: "AGR" }
    ],
  }
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