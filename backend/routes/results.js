const express = require('express');
const router = express.Router();
const Result = require('../models/Results');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middleware/auth');

const getDepartmentFromQuery = (req) => {
    const department = req.query.department;
    return department ? decodeURIComponent(department) : undefined;
};

const findClass = (term, className, department) => {
    if (!term) return undefined;
    if (department) {
        // First try exact match with department
        let classData = term.classes.find(c => c.className === className && c.department === department);
        if (classData) return classData;
        // Fallback: if no exact match, try classes without department (legacy data)
        classData = term.classes.find(c => c.className === className && (!c.department || c.department === ''));
        if (classData) return classData;
    }
    // No department specified: prefer classes without department, then any match
    return term.classes.find(c => c.className === className && (!c.department || c.department === ''))
        || term.classes.find(c => c.className === className);
};

const findOrCreateClass = (term, className, department) => {
    let classData = findClass(term, className, department);
    if (!classData) {
        classData = {
            className,
            department: department || '',
            approvalStatus: null,
            removedSubjects: [],
            students: []
        };
        term.classes.push(classData);
    }
    return classData;
};

// Get all results
router.get('/', authMiddleware, async (req, res) => {
    try {
        const results = await Result.find().populate('terms.classes.students.studentId', 'firstName lastName email username name');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get results by academic year
router.get('/:academicYear', authMiddleware, async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const result = await Result.findOne({ academicYear })
            .populate('terms.classes.students.studentId', 'firstName lastName email username name');
        if (!result) return res.status(404).json({ message: 'Results not found for this academic year' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get results by academic year and term
router.get('/:academicYear/:termName', authMiddleware, async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);

        const result = await Result.findOne({ academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found for this academic year' });

        const term = result.terms.find(t => t.termName === termName);
        if (!term) return res.status(404).json({ message: 'Term not found' });

        res.json(term);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get results by academic year, term, and class
router.get('/:academicYear/:termName/:className', authMiddleware, async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);

        const result = await Result.findOne({ academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found for this academic year' });

        const term = result.terms.find(t => t.termName === termName);
        if (!term) return res.status(404).json({ message: 'Term not found' });

        const department = getDepartmentFromQuery(req);
        const classData = findClass(term, className, department);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        res.json(classData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create or update results
router.post('/', authMiddleware, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { academicYear, terms } = req.body;

        let result = await Result.findOne({ academicYear });

        if (result) {
            // Update existing
            result.terms = terms;
            await result.save();
        } else {
            // Create new
            result = new Result({ academicYear, terms });
            await result.save();
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Submit for approval
router.put('/:academicYear/:termName/:className/submit-approval', authMiddleware, authorize('admin', 'teacher', 'staff'), async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);

        const result = await Result.findOne({ academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found' });

        const term = result.terms.find(t => t.termName === termName);
        if (!term) return res.status(404).json({ message: 'Term not found' });

        const department = getDepartmentFromQuery(req);
        const classData = findClass(term, className, department);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        classData.approvalStatus = 'pending';
        await result.save();

        res.json({ message: 'Submitted for approval' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Approve results
router.put('/:academicYear/:termName/:className/approve', authMiddleware, authorize('admin'), async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);

        const result = await Result.findOne({ academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found' });

        const term = result.terms.find(t => t.termName === termName);
        if (!term) return res.status(404).json({ message: 'Term not found' });

        const department = getDepartmentFromQuery(req);
        const classData = findClass(term, className, department);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        classData.approvalStatus = 'approved';
        await result.save();

        res.json({ message: 'Results approved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reject results
router.put('/:academicYear/:termName/:className/reject', authMiddleware, authorize('admin'), async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);

        const result = await Result.findOne({ academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found' });

        const term = result.terms.find(t => t.termName === termName);
        if (!term) return res.status(404).json({ message: 'Term not found' });

        const department = getDepartmentFromQuery(req);
        const classData = findClass(term, className, department);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        classData.approvalStatus = null; // Reset to allow re-submission
        await result.save();

        res.json({ message: 'Results rejected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get approval status
router.get('/:academicYear/:termName/:className/status', authMiddleware, async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);

        const result = await Result.findOne({ academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found' });

        const term = result.terms.find(t => t.termName === termName);
        if (!term) return res.status(404).json({ message: 'Term not found' });

        const department = getDepartmentFromQuery(req);
        const classData = findClass(term, className, department);
        if (!classData) return res.status(404).json({ message: 'Class not found' });

        res.json({ approvalStatus: classData.approvalStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update removed subjects for a class
router.put('/:academicYear/:termName/:className/removed-subjects', authMiddleware, authorize('admin', 'teacher', 'staff'), async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);
        const { removedSubjects } = req.body;

        if (!Array.isArray(removedSubjects)) {
            return res.status(400).json({ message: 'removedSubjects must be an array' });
        }

        const mappedRemovedSubjects = removedSubjects.map(subject => ({
            code: subject.code,
            name: subject.name || ''
        }));

        // Try atomic update for existing class using arrayFilters
        const department = getDepartmentFromQuery(req);
        const updateResult = await Result.updateOne(
            {
                academicYear,
                'terms.termName': termName,
                'terms.classes.className': className,
                $or: [
                    { 'terms.classes.department': department || '' },
                    { 'terms.classes.department': { $exists: false } },
                    { 'terms.classes.department': '' }
                ]
            },
            { $set: { 'terms.$[term].classes.$[class].removedSubjects': mappedRemovedSubjects } },
            {
                arrayFilters: [
                    { 'term.termName': termName },
                    {
                        'class.className': className,
                        $or: [
                            { 'class.department': department || '' },
                            { 'class.department': { $exists: false } },
                            { 'class.department': '' }
                        ]
                    }
                ]
            }
        );

        if (updateResult.matchedCount > 0) {
            res.json({ message: 'Removed subjects updated successfully' });
            return;
        }

        // Fallback: create or update document if class doesn't exist
        let result = await Result.findOne({ academicYear });
        if (!result) {
            // Create new result document if it doesn't exist
            result = new Result({
                academicYear,
                terms: [{
                    termName,
                    classes: [{
                        className,
                        department: department || '',
                        removedSubjects: mappedRemovedSubjects,
                        students: [],
                        approvalStatus: null
                    }]
                }]
            });
        } else {
            let term = result.terms.find(t => t.termName === termName);
            if (!term) {
                // Create new term if it doesn't exist
                term = {
                    termName,
                    classes: [{
                        className,
                        department: department || '',
                        removedSubjects: mappedRemovedSubjects,
                        students: [],
                        approvalStatus: null
                    }]
                };
                result.terms.push(term);
            } else {
                let classData = findClass(term, className, department);
                if (!classData) {
                    // Create new class if it doesn't exist
                    classData = {
                        className,
                        department: department || '',
                        removedSubjects: mappedRemovedSubjects,
                        students: [],
                        approvalStatus: null
                    };
                    term.classes.push(classData);
                } else {
                    // Update existing class
                    classData.removedSubjects = mappedRemovedSubjects;
                }
            }
        }

        await result.save();

        res.json({ message: 'Removed subjects updated successfully', removedSubjects: result.terms.find(t => t.termName === termName).classes.find(c => c.className === className && c.department === (department || ''))?.removedSubjects || [] });
    } catch (error) {
        console.error('Error updating removed subjects:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update student scores (create year/term/class/student if needed)
router.put('/:academicYear/:termName/:className/:studentId', authMiddleware, authorize('admin', 'teacher', 'staff'), async (req, res) => {
    try {
        const academicYear = decodeURIComponent(req.params.academicYear);
        const termName = decodeURIComponent(req.params.termName);
        const className = decodeURIComponent(req.params.className);
        const studentId = decodeURIComponent(req.params.studentId);
        const { scores: bodyScores, comments: bodyComments } = req.body;

        const scores = bodyScores && bodyScores.scores ? bodyScores.scores : bodyScores;
        const comments = typeof bodyComments === 'string'
            ? bodyComments
            : (typeof bodyScores?.comments === 'string' ? bodyScores.comments : '');

        console.log('PUT request for:', { academicYear, termName, className, studentId, scores, comments });

        let result = await Result.findOne({ academicYear });
        console.log('Existing result found:', !!result);

        if (!result) {
            result = new Result({ academicYear, terms: [] });
            console.log('Created new result document for academicYear:', academicYear);
        }

        let term = result.terms.find(t => t.termName === termName);
        if (!term) {
            term = { termName, classes: [] };
            result.terms.push(term);
            console.log('Added new term:', termName);
        }

        let classData = term.classes.find(c => c.className === className);
        if (!classData) {
            classData = { className, students: [] };
            term.classes.push(classData);
            console.log('Added new class:', className);
        }

        const user = await User.findById(studentId).select('username');
        const username = user?.username || '';

        let student = classData.students.find(s => s.studentId.toString() === studentId);
        if (!student) {
            student = { studentId, username, scores: scores || {}, comments: comments || '' };
            classData.students.push(student);
            console.log('Added new student:', studentId);
        } else {
            if (scores) student.scores = scores;
            if (typeof comments === 'string') student.comments = comments;
            if (!student.username && username) student.username = username;
            console.log('Updated existing student scores for:', studentId);
        }

        await result.save();
        console.log('Result saved successfully for academicYear:', academicYear);

        res.json({ message: 'Scores updated successfully' });
    } catch (error) {
        console.error('Error in PUT route:', error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:academicYear', authMiddleware, authorize('admin'), async (req, res) => {
    try {
        const result = await Result.findOneAndDelete({ academicYear: req.params.academicYear });
        if (!result) return res.status(404).json({ message: 'Results not found' });
        res.json({ message: 'Results deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;