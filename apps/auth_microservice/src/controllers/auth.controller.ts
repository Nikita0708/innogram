import express from 'express';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { AuthService, ConflictError } from '../services/auth.service';

const router = express.Router();
const authService = new AuthService();

// POST /internal/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, display_name, birthday, bio, avatar_url } = req.body;

    if (!email || !password || !username || !display_name || !birthday) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await authService.registerUser({
      email,
      password,
      username,
      display_name,
      birthday,
      bio,
      avatar_url,
    });

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof ConflictError) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

// POST /internal/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await authService.authenticateUser({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Unauthorized' });
  }
});

// POST /internal/auth/validate
router.post('/validate', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing accessToken' });
    }

    const userData = await authService.validateToken(accessToken);
    return res.status(200).json(userData);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Unauthorized' });
  }
});

// POST /internal/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refreshToken' });
    }

    const tokens = await authService.processRefreshToken(refreshToken);
    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'Unauthorized' });
  }
});

// POST /internal/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refreshToken' });
    }

    await authService.logout(refreshToken);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
});

// GET /internal/auth/oauth/initiate?provider=google
router.get('/oauth/initiate', async (req, res) => {
  const { provider } = req.query;

  if (provider !== 'google') {
    return res.status(400).json({ error: 'Unsupported provider' });
  }

  const url = authService.buildGoogleAuthUrl();
  return res.status(200).json({ url });
});

// POST /internal/auth/oauth/exchange-code
router.post('/oauth/exchange-code', async (req, res) => {
  try {
    const { code, provider } = req.body;

    if (!code || !provider) {
      return res.status(400).json({ error: 'Missing code or provider' });
    }

    if (provider !== 'google') {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    const result = await authService.handleGoogleOAuth(code);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: error instanceof Error ? error.message : 'OAuth failed' });
  }
});

export default router;
