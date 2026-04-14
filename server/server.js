const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/admin", express.static("admin"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

/* ================= SCHEMAS ================= */

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "support"],
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const suggestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },
    username: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: "hinglish"
    },
    gender: {
      type: String,
      default: ""
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

const writeEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      default: ""
    },
    language: {
      type: String,
      default: "hinglish"
    },
    gender: {
      type: String,
      default: ""
    },
    consentToShare: {
      type: Boolean,
      default: false
    },
    approvalStatus: {
      type: String,
      enum: ["private", "pending", "approved", "rejected"],
      default: "private"
    },
    suggestions: [suggestionSchema]
  },
  { timestamps: true }
);

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Conversation = mongoose.model("Conversation", conversationSchema);
const WriteEntry = mongoose.model("WriteEntry", writeEntrySchema);
const Feedback = mongoose.model("Feedback", feedbackSchema);

const JWT_SECRET = process.env.JWT_SECRET || "sunora_secret_key_change_this";

/* ================= AUTH HELPERS ================= */

function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    req.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

function adminAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ADMIN_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("Sunora backend is running");
});

/* ===== AUTH: SIGNUP ===== */
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword
    });

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== ADMIN LOGIN ===== */
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.ADMIN_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid admin credentials"
  });
});
/* ===== AUTH: LOGIN ===== */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== AUTH: ME ===== */
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (err) {
    console.error("Auth me error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== MESSAGE SAVE ===== */
app.post("/api/message", optionalAuthMiddleware, async (req, res) => {
  try {
    const { text, conversationId, username, language, gender } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    let conversation = null;

    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
  userId: req.user ? req.user._id : null,
  status: "open",
  username: username || req.user?.name || "",
  language: language || "hinglish",
  gender: gender || "",
  messages: [
    {
      sender: "support",
      text: getSupportMessageByLanguage(language || "hinglish")
    }
  ]
});
const getSupportMessageByLanguage = (language) => {
  if (language === "english") return "I'm here. Take your time.";
  if (language === "hindi") return "मैं यहीं हूँ। आराम से बोलिए।";
  return "Main yahan hoon. Aaram se bolo.";
};
    }

    conversation.messages.push({
  sender: "user",
  text: text,
  time: new Date()
});

    if (req.user && !conversation.userId) {
      conversation.userId = req.user._id;
    }

    if (!conversation.username && req.user?.name) {
      conversation.username = req.user.name;
    }

    await conversation.save();

    res.json({
      success: true,
      conversationId: conversation._id
    });
  } catch (err) {
    console.error("Message save error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== GET CONVERSATION ===== */
app.get("/api/conversation/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id"
      });
    }

    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    console.error("Conversation fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== CLOSE CHAT ===== */
app.post("/api/conversation/:id/close", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id"
      });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    console.error("Conversation close error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== WRITE SAVE ===== */
app.post("/api/write", optionalAuthMiddleware, async (req, res) => {
  try {
    const { text, consentToShare, username, language, gender } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required"
      });
    }

    const entry = await WriteEntry.create({
      userId: req.user ? req.user._id : null,
      text: text.trim(),
      username: username || req.user?.name || "",
      language: language || "hinglish",
      gender: gender || "",
      consentToShare: !!consentToShare,
      approvalStatus: consentToShare ? "pending" : "private"
    });

    res.json({
      success: true,
      entry
    });
  } catch (err) {
    console.error("Write save error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== READ APPROVED ENTRIES ===== */
app.get("/api/read", async (req, res) => {
  try {
    const entries = await WriteEntry.find({
      consentToShare: true,
      approvalStatus: "approved"
    }).sort({ createdAt: -1 });

    const cleaned = entries.map((e) => ({
      id: e._id,
      text: e.text,
      suggestions: e.suggestions.filter((s) => s.status === "approved")
    }));

    res.json({
      success: true,
      entries: cleaned
    });
  } catch (err) {
    console.error("Read approved entries error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===== ADD SUGGESTION ===== */
app.post("/api/read/:id/suggest", async (req, res) => {
  try {
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry id"
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Suggestion text is required"
      });
    }

    const entry = await WriteEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    entry.suggestions.push({
      text: text.trim()
    });

    await entry.save();

    res.json({
      success: true
    });
  } catch (err) {
    console.error("Suggestion add error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===== FEEDBACK SAVE ===== */
app.post("/api/feedback", optionalAuthMiddleware, async (req, res) => {
  try {
    const { conversationId, rating, review } = req.body;

    if (!rating || ![1, 2, 3, 4, 5].includes(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: "Valid rating is required"
      });
    }

    let validConversationId = null;

    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      validConversationId = conversationId;
    }

    const feedback = await Feedback.create({
      userId: req.user ? req.user._id : null,
      conversationId: validConversationId,
      rating: Number(rating),
      review: review || ""
    });

    res.json({
      success: true,
      feedback
    });
  } catch (err) {
    console.error("Feedback save error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== MY CONVERSATIONS ===== */
app.get("/api/my/conversations", authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user._id
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });
  } catch (err) {
    console.error("My conversations error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== LINK CURRENT CONVERSATION TO USER ===== */
app.post("/api/my/conversations/link", authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Valid conversationId is required"
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    if (conversation.userId && String(conversation.userId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "This conversation belongs to another user"
      });
    }

    conversation.userId = req.user._id;
    conversation.username = conversation.username || req.user.name || "";

    await conversation.save();

    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    console.error("Link conversation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ===== MY WRITINGS ===== */
app.get("/api/my/writes", authMiddleware, async (req, res) => {
  try {
    const entries = await WriteEntry.find({
      userId: req.user._id
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      entries
    });
  } catch (err) {
    console.error("My writes error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


/* ================= ADMIN ROUTES ================= */

app.get("/api/admin/conversations", adminAuthMiddleware,  async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    console.error("Admin conversations fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/api/admin/reply", adminAuthMiddleware, async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Valid conversationId is required"
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required"
      });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found"
      });
    }

    conversation.messages.push({
  sender: "support",
  text: text,
  time: new Date()
});

    conversation.status = "open";
    await conversation.save();

    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    console.error("Admin reply error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/api/chat/start", optionalAuthMiddleware, async (req, res) => {
  try {
    const { username, language, gender } = req.body;

    // Logged-in user ke liye latest conversation dhoondo
    if (req.user) {
      let conversation = await Conversation.findOne({
        userId: req.user._id
      }).sort({ updatedAt: -1 });

      // Agar existing conversation mili
      if (conversation) {
        // Closed hai toh reopen karo
        if (conversation.status === "closed") {
          conversation.status = "open";
          await conversation.save();
        }

        return res.json({
          success: true,
          conversation
        });
      }
    }

    // Guest ya new user ke liye fresh conversation
    const selectedLanguage = language || "hinglish";

    const getSupportMessageByLanguage = (lang) => {
      if (lang === "english") return "I'm here. Take your time.";
      if (lang === "hindi") return "मैं यहीं हूँ। आराम से बोलिए।";
      return "Main yahan hoon. Aaram se bolo.";
    };

    const conversation = await Conversation.create({
      userId: req.user ? req.user._id : null,
      status: "open",
      username: username || req.user?.name || "",
      language: selectedLanguage,
      gender: gender || "",
      messages: [
        {
          sender: "support",
          text: getSupportMessageByLanguage(selectedLanguage),
          time: new Date()
        }
      ]
    });

    res.json({
      success: true,
      conversation
    });
  } catch (err) {
    console.error("Start chat error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/api/admin/write",  adminAuthMiddleware, async (req, res) => {
  try {
    const entries = await WriteEntry.find().sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error("Admin write entries fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/api/admin/write/:id/review", adminAuthMiddleware, async (req, res) => {
  try {
    const { action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry id"
      });
    }

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      });
    }

    const entry = await WriteEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    entry.approvalStatus = action;
    await entry.save();

    res.json({
      success: true,
      entry
    });
  } catch (err) {
    console.error("Admin review write entry error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/api/admin/write/:entryId/suggestion/:suggestionId/review", adminAuthMiddleware, async (req, res) => {
  try {
    const { action } = req.body;
    const { entryId, suggestionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry id"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(suggestionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid suggestion id"
      });
    }

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      });
    }

    const entry = await WriteEntry.findById(entryId);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entry not found"
      });
    }

    const suggestion = entry.suggestions.id(suggestionId);

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: "Suggestion not found"
      });
    }

    suggestion.status = action;
    await entry.save();

    res.json({
      success: true,
      entry
    });
  } catch (err) {
    console.error("Admin review suggestion error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.get("/api/admin/feedback", adminAuthMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("conversationId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error("Admin feedback fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.post("/api/admin/login", adminAuthMiddleware, (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.json({
      success: true,
      token: "admin-token"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin credentials"
  });
});

function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  const jwt = require("jsonwebtoken");

function adminAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ADMIN_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
}

  next();
}

app.get("/api/admin/test", adminAuthMiddleware, (req, res) => {
  res.json({ message: "Admin access granted" });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

