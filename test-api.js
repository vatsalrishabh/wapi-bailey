// test-api.js
import fetch from 'node-fetch';

async function testSendBulkMessage() {
  try {
    console.log('Testing send bulk message API...');
    
    const response = await fetch('http://localhost:3000/api/whatsapp/send-bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numbers: ['918123573669', '919876543210'], // Added country code (91 for India)
        message: 'Test message from WhatsApp API'
      })
    });
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Test passed!');
    } else {
      console.log('❌ Test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

// Run the test
testSendBulkMessage();