const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';
const TOKEN = 'your-admin-token-here'; // You'll need to get this from the browser after logging in

const testDepartmentApprovals = async () => {
    try {
        console.log('Testing department-specific approvals...');

        const academicYear = '2025-2026';
        const termName = 'First Term';
        const className = 'SS 3';

        // Test 1: Submit Science department for approval
        console.log('\n1. Submitting Science department for approval...');
        await axios.put(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/submit-approval?department=Science`, {}, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('✓ Science department submitted for approval');

        // Test 2: Check approval status for Science
        const scienceStatus = await axios.get(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/status?department=Science`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Science status:', scienceStatus.data.approvalStatus);

        // Test 3: Check approval status for Art (should be null)
        const artStatus = await axios.get(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/status?department=Art`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Art status:', artStatus.data.approvalStatus);

        // Test 4: Check approval status for Commercial (should be null)
        const commercialStatus = await axios.get(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/status?department=Commercial`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Commercial status:', commercialStatus.data.approvalStatus);

        // Test 5: Approve Art department
        console.log('\n2. Approving Art department...');
        await axios.put(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/approve?department=Art`, {}, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('✓ Art department approved');

        // Test 6: Check all statuses again
        const scienceStatus2 = await axios.get(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/status?department=Science`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const artStatus2 = await axios.get(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/status?department=Art`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const commercialStatus2 = await axios.get(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}/status?department=Commercial`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });

        console.log('\nFinal statuses:');
        console.log('Science:', scienceStatus2.data.approvalStatus);
        console.log('Art:', artStatus2.data.approvalStatus);
        console.log('Commercial:', commercialStatus2.data.approvalStatus);

        // Verification
        if (scienceStatus2.data.approvalStatus === 'pending' &&
            artStatus2.data.approvalStatus === 'approved' &&
            commercialStatus2.data.approvalStatus === null) {
            console.log('\n✅ SUCCESS: Department approvals are independent!');
        } else {
            console.log('\n❌ FAILURE: Department approvals are not independent');
        }

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
};

testDepartmentApprovals();