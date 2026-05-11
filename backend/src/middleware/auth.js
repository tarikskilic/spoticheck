const { admin } = require('../firebase');

async function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const match = header.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json({ error: 'Oturum gerekli' });
  }

  try {
    req.user = await admin.auth().verifyIdToken(match[1]);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Geçersiz oturum' });
  }
}

module.exports = { requireAuth };
