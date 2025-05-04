
import express from 'express';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase.js';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = await User.create({
      email,
      name,
      firebaseUid: userCredential.user.uid,
      isGuest: false
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await User.findOne({ firebaseUid: userCredential.user.uid });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Guest login
router.post('/guest', async (req, res) => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = await User.create({
      firebaseUid: userCredential.user.uid,
      name: 'Guest User',
      isGuest: true
    });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Google Sign In
router.post('/google', async (req, res) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    let user = await User.findOne({ firebaseUid: userCredential.user.uid });
    
    if (!user) {
      user = await User.create({
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        firebaseUid: userCredential.user.uid,
        isGuest: false
      });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
