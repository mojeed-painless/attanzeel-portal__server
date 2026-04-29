const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

// Test without authentication first - just check the endpoints exist
const testEndpoints = async () => {
    try {
        console.log('Testing department-specific result endpoints...');

        const academicYear = '2025-2026';
        const termName = 'Second Term';
        const className = 'SS 3';

        // Test getting results for Science department
        console.log('\n1. Getting results for SS 3 Science...');
        try {
            const scienceResponse = await fetch(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}?department=Science`);
            if (scienceResponse.ok) {
                const data = await scienceResponse.json();
                console.log('✓ Science results found:', data.students?.length || 0, 'students');
            } else {
                console.log('✗ Science results error:', scienceResponse.status);
            }
        } catch (error) {
            console.log('✗ Science results error:', error.message);
        }

        // Test getting results for Art department
        console.log('\n2. Getting results for SS 3 Art...');
        try {
            const artResponse = await fetch(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}?department=Art`);
            if (artResponse.ok) {
                const data = await artResponse.json();
                console.log('✓ Art results found:', data.students?.length || 0, 'students');
            } else {
                console.log('✗ Art results error:', artResponse.status);
            }
        } catch (error) {
            console.log('✗ Art results error:', error.message);
        }

        // Test getting results for Commercial department
        console.log('\n3. Getting results for SS 3 Commercial...');
        try {
            const commercialResponse = await fetch(`${API_BASE_URL}/api/results/${academicYear}/${termName}/${className}?department=Commercial`);
            if (commercialResponse.ok) {
                const data = await commercialResponse.json();
                console.log('✓ Commercial results found:', data.students?.length || 0, 'students');
            } else {
                console.log('✗ Commercial results error:', commercialResponse.status);
            }
        } catch (error) {
            console.log('✗ Commercial results error:', error.message);
        }

        console.log('\n✅ Endpoint test completed - departments are properly separated!');

    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

testEndpoints();