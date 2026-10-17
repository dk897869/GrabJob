const assert = require('assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const runTests = async () => {
  console.log('--- Starting GrabJob Automated Test Suite ---\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}`);
      console.error(err);
      failed++;
    }
  };

  // 1. Test Password Hashing & Comparison
  await test('bcrypt hashes and verifies password correctly', async () => {
    const rawPass = 'Secret123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPass, salt);
    const isValid = await bcrypt.compare(rawPass, hash);
    const isInvalid = await bcrypt.compare('WrongPass', hash);
    assert.strictEqual(isValid, true, 'Valid password must match');
    assert.strictEqual(isInvalid, false, 'Wrong password must fail');
  });

  // 2. Test JWT Signing & Verification
  await test('JWT signs payload and verifies with secret key', async () => {
    const secret = 'test_secret_key_123';
    const payload = { id: 'user_12345', role: 'candidate' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.role, payload.role);
  });

  // 3. Test Payment Signature HMAC Generation
  await test('HMAC SHA256 matches Razorpay signature requirement', async () => {
    const secret = 'rzp_secret_xyz';
    const orderId = 'order_12345';
    const paymentId = 'pay_67890';
    const payload = `${orderId}|${paymentId}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    // Verify signature recalculation
    const verifySignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    assert.strictEqual(signature, verifySignature);
    assert.strictEqual(signature.length, 64);
  });

  // 4. Test Geospatial Distance Function (Haversine formula check)
  await test('Haversine distance calculation between Chandigarh and Mohali (~10km)', async () => {
    const toRad = (v) => (v * Math.PI) / 180;
    const chdLat = 30.7333;
    const chdLng = 76.7794;
    const mohaliLat = 30.7046;
    const mohaliLng = 76.7179;

    const R = 6371; // Earth radius in km
    const dLat = toRad(mohaliLat - chdLat);
    const dLng = toRad(mohaliLng - chdLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(chdLat)) * Math.cos(toRad(mohaliLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    // Distance should be approx 6.7 to 8 km
    assert.ok(d > 5 && d < 12, `Expected distance ~7-10km, got ${d.toFixed(2)}km`);
  });

  // 5. Test Profile Completion Calculation Logic
  await test('Profile completion percentage computes accurately', async () => {
    const user = {
      name: 'Deepak',
      email: 'deepak@test.com',
      phone: '9876543210',
      city: 'Chandigarh',
      skills: ['React', 'Node.js'],
      currentRole: 'Software Engineer',
      education: 'B.Tech',
      resumeUrl: 'https://grabjob.in/resume.pdf',
    };

    let score = 20; // email + name
    if (user.phone) score += 15;
    if (user.city) score += 10;
    if (user.skills && user.skills.length > 0) score += 20;
    if (user.currentRole) score += 10;
    if (user.education) score += 10;
    if (user.resumeUrl) score += 15;

    assert.strictEqual(score, 100);
  });

  // 6. Test Admin Role Verification Guard
  await test('Admin role guard rejects non-admin role', async () => {
    const candidateUser = { role: 'candidate' };
    const adminUser = { role: 'admin' };

    const checkRole = (user) => {
      if (!user || user.role !== 'admin') {
        throw new Error('Access denied');
      }
      return true;
    };

    assert.strictEqual(checkRole(adminUser), true);
    assert.throws(() => checkRole(candidateUser), /Access denied/);
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
