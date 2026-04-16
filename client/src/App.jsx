import { useEffect, useRef, useState } from "react";
import "./App.css";
import talkingImg from "./assets/talking.png";
import SplashIntro from "./SplashIntro";

const translations = {
  english: {
    languageTitle: "Choose your language",
    languageSubtitle: "Pick the language you feel most comfortable with.",
    continue: "Continue",
    skip: "Skip",
    identifyTitle: "How do you identify?",
    identifySubtitle:
      "This is optional. It only helps us personalize your experience.",
    male: "Male",
    female: "Female",
    preferNot: "Prefer not to say",
    usernameTitle: "What should we call you?",
    usernameSubtitle:
      "This is optional. You can use your name or a nickname.",
    usernamePlaceholder: "Enter your name or nickname",
    homeTitle: "Need to say something?",
    homeSub: "Real people are here to listen.",
    homeInfo: "Take your time. Say what you feel.",
    talkBtn: "I want to talk",
    writeBtn: "I just want to write",
    readBtn: "Read others' thoughts",
    safeLine: "Safe space. No judgement. Just someone to listen.",
    captionTitle: "Sometimes being heard is enough.",
    captionText: "Your words stay private unless you allow sharing.",
    note: "Real human support. No bots. Usually replies within 5 minutes.",
    back: "Back",
    chatTitle: "Want to talk?",
    chatSub: "No AI. Real human support.\nSay what you feel.",
    chatPlaceholder: "Type what’s on your mind...",
    send: "Send",
    loginHint: "Log in later to save your conversations for next time.",
    writeTitle: "Just write it out",
    writeSub:
      "You can simply write here. No reply is necessary.\nSometimes writing alone helps.",
    writePlaceholder: "Write whatever you want...",
    consent:
      "If you want, your words can be shared anonymously so others can send supportive suggestions.",
    saved: "Okay. What you wrote has been saved.",
    readTitle: "You are not alone",
    readSub:
      "Sometimes reading others' thoughts can make you feel lighter.",
    suggestionPlaceholder: "Want to say something supportive?",
    suggestionBtn: "Send suggestion",
    suggestionSaved: "Your suggestion has been sent for admin review.",
    emptyRead: "Nothing is here yet... check again after some time.",
    endChat: "End Chat",
    chatEnded: "Chat Ended",
    loginAsk: "Would you like to log in?",
    login: "Login",
    continueGuest: "Continue as Guest",
    rateExperience: "Rate your experience",
    feedbackPlaceholder: "Write a short review...",
    submitFeedback: "Submit Feedback",
    close: "Close",
    feedbackThanks: "Thanks for your feedback ❤️"
  },
  hindi: {
    languageTitle: "अपनी भाषा चुनिए",
    languageSubtitle: "जिस भाषा में आप सहज महसूस करते हैं, वही चुनिए।",
    continue: "आगे बढ़ें",
    skip: "स्किप",
    identifyTitle: "आप खुद को कैसे पहचानते हैं?",
    identifySubtitle:
      "यह वैकल्पिक है। इससे हमें अनुभव को थोड़ा बेहतर बनाने में मदद मिलेगी।",
    male: "पुरुष",
    female: "महिला",
    preferNot: "बताना नहीं चाहते",
    usernameTitle: "हम आपको किस नाम से बुलाएँ?",
    usernameSubtitle:
      "यह वैकल्पिक है। आप चाहें तो अपना नाम या निकनेम लिख सकते हैं।",
    usernamePlaceholder: "अपना नाम या निकनेम लिखें",
    homeTitle: "कुछ कहना है?",
    homeSub: "यहाँ लोग सुनते हैं।",
    homeInfo: "आराम से बोलिए। जो दिल में है, कह दीजिए।",
    talkBtn: "बात करनी है",
    writeBtn: "बस लिखना है",
    readBtn: "दूसरों की बातें पढ़नी हैं",
    safeLine: "सुरक्षित जगह। कोई जज नहीं करेगा। बस कोई सुनेगा।",
    captionTitle: "कभी-कभी बस किसी का सुन लेना ही काफी होता है।",
    captionText:
      "आपकी बातें निजी रहेंगी, जब तक आप उन्हें साझा करने की अनुमति न दें।",
    note: "यहाँ असली लोग हैं। कोई बॉट नहीं। आमतौर पर 5 मिनट के भीतर जवाब मिलता है।",
    back: "वापस",
    chatTitle: "बात करनी है?",
    chatSub: "कोई AI नहीं। यहाँ इंसान हैं।\nजो दिल में है लिख दीजिए।",
    chatPlaceholder: "जो मन में है लिखिए...",
    send: "भेजो",
    loginHint:
      "बाद में लॉगिन करोगे तो अगली बार पुरानी बातें भी देख पाओगे।",
    writeTitle: "बस लिख दीजिए",
    writeSub:
      "यहाँ बस लिख दीजिए। जवाब ज़रूरी नहीं है।\nकभी-कभी सिर्फ लिख देना ही काफी होता है।",
    writePlaceholder: "जो लिखना है लिखिए...",
    consent:
      "अगर आप चाहें, तो आपकी बात को बिना नाम के साझा किया जा सकता है ताकि दूसरे लोग सहायक सुझाव दे सकें।",
    saved: "ठीक है। आपने जो लिखा, वह सेव हो गया।",
    readTitle: "आप अकेले नहीं हैं",
    readSub:
      "कभी-कभी दूसरों की बातें पढ़कर भी मन हल्का लगता है।",
    suggestionPlaceholder: "कुछ सहायक कहना चाहते हैं?",
    suggestionBtn: "सुझाव भेजें",
    suggestionSaved: "आपका सुझाव एडमिन रिव्यू के लिए भेज दिया गया है।",
    emptyRead: "अभी यहाँ कुछ नहीं है... थोड़ी देर बाद फिर देखिए।",
    endChat: "चैट खत्म करें",
    chatEnded: "चैट खत्म हुई",
    loginAsk: "क्या आप लॉगिन करना चाहेंगे?",
    login: "लॉगिन",
    continueGuest: "गेस्ट के रूप में जारी रखें",
    rateExperience: "अपना अनुभव रेट करें",
    feedbackPlaceholder: "छोटा सा रिव्यू लिखें...",
    submitFeedback: "फीडबैक भेजें",
    close: "बंद करें",
    feedbackThanks: "फीडबैक के लिए धन्यवाद ❤️"
  },
  hinglish: {
    languageTitle: "Apni language choose karo",
    languageSubtitle: "Jis language me tum comfortable ho, wahi select karo.",
    continue: "Continue",
    skip: "Skip",
    identifyTitle: "Tum khud ko kaise identify karte ho?",
    identifySubtitle:
      "Ye optional hai. Bas experience ko thoda personalize karne ke liye hai.",
    male: "Male",
    female: "Female",
    preferNot: "Prefer not to say",
    usernameTitle: "Hum tumhe kis naam se bulayen?",
    usernameSubtitle:
      "Ye optional hai. Name ya nickname kuch bhi likh sakte ho.",
    usernamePlaceholder: "Apna name ya nickname likho",
    homeTitle: "Kuch bolna hai?",
    homeSub: "Yahan log sunte hain.",
    homeInfo: "Aaram se bolo. Jo dil me hai, keh do.",
    talkBtn: "Baat karni hai",
    writeBtn: "Bas likhna hai",
    readBtn: "Dusron ki baatein padhna hai",
    safeLine: "Safe space. No judgement. Bas sunne wala koi.",
    captionTitle: "Kabhi kabhi bas kisi ka sun lena hi kaafi hota hai.",
    captionText: "Tumhari baatein private rahengi jab tak tum allow na karo.",
    note: "Real human support. No bots. Usually replies within 5 minutes.",
    back: "Wapas",
    chatTitle: "Baat karni hai?",
    chatSub: "No AI. Real human support.\nJo dil me hai likh do.",
    chatPlaceholder: "Jo dil me hai likh do...",
    send: "Bol do",
    loginHint:
      "Login karoge toh future me apni purani baatein bhi dekh paoge.",
    writeTitle: "Bas likh do",
    writeSub:
      "Yahan bas likh do. Koi reply zaroori nahi.\nKabhi kabhi sirf likh dena bhi enough hota hai.",
    writePlaceholder: "Jo likhna hai likh do...",
    consent:
      "Agar tum chaho, tumhari baat anonymous form me dusron ke supportive suggestions ke liye share ki ja sakti hai.",
    saved: "Theek hai. Jo tumne likha, woh save ho gaya.",
    readTitle: "Tum akela nahi ho",
    readSub:
      "Kabhi kabhi dusron ki baatein padhkar bhi halka feel hota hai.",
    suggestionPlaceholder: "Kuch supportive kehna chahte ho?",
    suggestionBtn: "Suggestion bhejo",
    suggestionSaved: "Suggestion admin review ke liye bhej diya gaya.",
    emptyRead: "Abhi yahan kuch nahi hai... thodi der baad dekhna.",
    endChat: "End Chat",
    chatEnded: "Chat Ended",
    loginAsk: "Kya aap login karna chahoge?",
    login: "Login",
    continueGuest: "Continue as Guest",
    rateExperience: "Rate your experience",
    feedbackPlaceholder: "Short feedback likho...",
    submitFeedback: "Submit",
    close: "Close",
    feedbackThanks: "Thanks for your feedback ❤️"
  }
};

const emojiCategories = {
  "😀": ["😀", "😄", "😊", "🙂", "😌", "🥺", "😔", "😢", "😭", "😤", "😴", "😵‍💫"],
  "❤️": ["❤️", "🩷", "💜", "💙", "🤍", "💖", "💕", "💘", "💓", "💞"],
 "🫂": ["🫂", "🌈", "✨", "🙏", "🤝", "💪", "🌸", "🍀", "☀️", "🌙", "🕊️"],
  "👍": ["👍", "👎", "👏", "🙌", "🤞", "👀", "😶‍🌫️", "😮", "😣", "😞", "😡"]
};

function App() {
  const [screen, setScreen] = useState("splash");
  const [profile, setProfile] = useState({
    language: "",
    gender: "",
    username: ""
  });

  const [text, setText] = useState("");
  const [writeText, setWriteText] = useState("");
  const [messages, setMessages] = useState([]);

  const [readEntries, setReadEntries] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [writeSaved, setWriteSaved] = useState(false);
  const [consentToShare, setConsentToShare] = useState(false);
  const [suggestions, setSuggestions] = useState({});
  const [suggestionSavedId, setSuggestionSavedId] = useState(null);

  const [showEndModal, setShowEndModal] = useState(false);
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const [rating, setRating] = useState("5");
  const [review, setReview] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState("chat");

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [authTarget, setAuthTarget] = useState("home");

  const [myChats, setMyChats] = useState([]);
  const [myWrites, setMyWrites] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChatEmojiPicker, setShowChatEmojiPicker] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("sunoraTheme") || "light");
  const [isSupportTyping, setIsSupportTyping] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const chatBoxRef = useRef(null);

  const lang = profile.language || "hinglish";
  const t = translations[lang];
  const API_BASE = "https://sunora.onrender.com";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const requestAuth = (target = "home") => {
    setAuthError("");
    setAuthMode("login");
    setAuthTarget(target);
    setShowProfileMenu(false);
    setScreen("auth");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTo({
          top: chatBoxRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  const getInitialSupportMessage = () => {
    if (lang === "english") return "I'm here. Take your time.";
    if (lang === "hindi") return "मैं यहीं हूँ। आराम से बोलिए।";
    return "Main yahan hoon. Aaram se bolo.";
  };

  const toggleTheme = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem("sunoraTheme", nextTheme);
    setShowThemeMenu(false);
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        alert("Voice note is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setAudioPreviewUrl("");
      setRecordingSeconds(0);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm"
        });

        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(previewUrl);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Voice recording error:", err);
      alert("Mic permission allow karo bhai.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const cancelVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    }

    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }

    setAudioPreviewUrl("");
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  const sendVoiceNote = async () => {
    if (!audioChunksRef.current.length) return;

    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm"
    });

    const tempUrl = URL.createObjectURL(audioBlob);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        audioUrl: tempUrl
      }
    ]);

    setIsSupportTyping(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-note.webm");
      formData.append("conversationId", conversationId || "");
      formData.append("username", profile.username || "");
      formData.append("language", profile.language || "");
      formData.append("gender", profile.gender || "");

      const res = await fetch(`${API_BASE}/api/voice`, {
        method: "POST",
        headers: {
          ...getAuthHeaders()
        },
        body: formData
      });

      const data = await res.json();

      if (data.success && data.conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem("conversationId", data.conversationId);
      }
    } catch (err) {
      console.error("Voice note save error:", err);
      alert("Voice note bhejne me issue aaya.");
    } finally {
      setAudioPreviewUrl("");
      setRecordingSeconds(0);
      audioChunksRef.current = [];
      setTimeout(() => {
        setIsSupportTyping(false);
      }, 1500);
    }
  };

  const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
    setShowProfileMenu(false);

    if (user?.name) {
      setProfile((prev) => ({
        ...prev,
        username: user.name
      }));
    }
  };

  const logout = () => {
    const oldName = currentUser?.name || "";

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("conversationId");

    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }

    setCurrentUser(null);
    setConversationId(null);
    setMessages([
      {
        sender: "support",
        text: getInitialSupportMessage()
      }
    ]);
    setText("");
    setMyChats([]);
    setMyWrites([]);
    setShowProfileMenu(false);
    setShowEndModal(false);
    setShowFeedbackBox(false);
    setShowChatEmojiPicker(false);
    setShowThemeMenu(false);
    setShowEmojiPanel(false);
    setIsSupportTyping(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioPreviewUrl("");
    audioChunksRef.current = [];

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setRating("5");
    setReview("");
    setAuthForm({
      name: "",
      email: "",
      password: ""
    });
    setAuthError("");
    setAuthTarget("home");

    setProfile((prev) => ({
      ...prev,
      username: prev.username === oldName ? "" : prev.username
    }));

    setScreen("home");
  };

  const loadCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          ...getAuthHeaders()
        }
      });

      const data = await res.json();

      if (data.success) {
        setCurrentUser(data.user);
        if (data.user?.name) {
          setProfile((prev) => ({
            ...prev,
            username: prev.username || data.user.name
          }));
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Load current user error:", err);
    }
  };

  const loadMyChats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/my/conversations`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      const data = await res.json();

      if (data.success) {
        setMyChats(data.conversations || []);
      }
    } catch (err) {
      console.error("Load my chats error:", err);
    }
  };

  const loadMyWrites = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/my/writes`, {
        headers: {
          ...getAuthHeaders()
        }
      });
      const data = await res.json();

      if (data.success) {
        setMyWrites(data.entries || []);
      }
    } catch (err) {
      console.error("Load my writes error:", err);
    }
  };

  const linkCurrentConversationToUser = async () => {
    try {
      const savedConversationId = localStorage.getItem("conversationId");
      const token = localStorage.getItem("token");

      if (!savedConversationId || !token) return false;

      const res = await fetch(`${API_BASE}/api/my/conversations/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          conversationId: savedConversationId
        })
      });

      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error("Link current conversation error:", err);
      return false;
    }
  };

  const openMyChats = async () => {
    if (!currentUser) {
      requestAuth("chat_history");
      return;
    }

    await loadMyChats();
    setScreen("myChats");
  };

  const openMyWrites = async () => {
    if (!currentUser) {
      requestAuth("write_history");
      return;
    }

    await loadMyWrites();
    setScreen("myWrites");
  };

  const submitAuth = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");

      const endpoint =
        authMode === "login"
          ? `${API_BASE}/api/auth/login`
          : `${API_BASE}/api/auth/signup`;

      const payload =
        authMode === "login"
          ? {
              email: authForm.email.trim(),
              password: authForm.password
            }
          : {
              name: authForm.name.trim(),
              email: authForm.email.trim(),
              password: authForm.password
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.message || "Something went wrong");
        return;
      }

      saveAuth(data.token, data.user);

      if (authTarget === "link_current_chat") {
        await linkCurrentConversationToUser();
        await loadMyChats();
        setScreen("chat");
      } else if (authTarget === "chat_history") {
        await linkCurrentConversationToUser();
        await loadMyChats();
        setScreen("myChats");
      } else if (authTarget === "write_history") {
        await loadMyWrites();
        setScreen("myWrites");
      } else {
        setScreen("home");
      }

      setAuthForm({
        name: "",
        email: "",
        password: ""
      });

      setAuthTarget("home");
    } catch (err) {
      console.error("Auth submit error:", err);
      setAuthError("Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  const resetChatState = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }

    setText("");
    setConversationId(null);
    setMessages([
      {
        sender: "support",
        text: getInitialSupportMessage()
      }
    ]);
    setShowEndModal(false);
    setShowFeedbackBox(false);
    setShowChatEmojiPicker(false);
    setShowThemeMenu(false);
    setShowEmojiPanel(false);
    setIsSupportTyping(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioPreviewUrl("");
    audioChunksRef.current = [];

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setRating("5");
    setReview("");
    localStorage.removeItem("conversationId");
  };

  const closeConversationOnServer = async () => {
    try {
      const id = conversationId || localStorage.getItem("conversationId");
      if (id) {
        await fetch(`${API_BASE}/api/conversation/${id}/close`, {
          method: "POST"
        });
      }
    } catch (err) {
      console.error("Close conversation error:", err);
    }
  };

  const goHomeFromChat = async () => {
    await closeConversationOnServer();
    resetChatState();
    setScreen("home");
  };

  const startFreshChat = async () => {
    try {
      localStorage.removeItem("conversationId");
      setConversationId(null);
      setText("");
      setShowEndModal(false);
      setShowFeedbackBox(false);
      setShowChatEmojiPicker(false);
      setShowThemeMenu(false);
      setShowEmojiPanel(false);
      setIsSupportTyping(false);
      setIsRecording(false);
      setRecordingSeconds(0);
      setAudioPreviewUrl("");
      audioChunksRef.current = [];

      const res = await fetch(`${API_BASE}/api/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          username: profile.username,
          language: profile.language,
          gender: profile.gender
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.conversation) {
        alert("Chat start karne me issue aaya.");
        return;
      }

      const conv = data.conversation;

      setConversationId(conv._id);
      localStorage.setItem("conversationId", conv._id);
      setMessages(conv.messages || []);
      setScreen("chat");
    } catch (err) {
      console.error("Start chat error:", err);
      alert("Chat start karne me issue aaya.");
    }
  };

  const openSavedConversation = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/conversation/${id}`);
      const data = await res.json();

      if (data.success && data.conversation) {
        setConversationId(id);
        localStorage.setItem("conversationId", id);
        setMessages(data.conversation.messages || []);
        setScreen("chat");
      }
    } catch (err) {
      console.error("Open saved conversation error:", err);
    }
  };

 const endChatNow = async () => {
  const confirmEnd = window.confirm("Are you sure you want to end this chat?");
  if (!confirmEnd) return;

  await closeConversationOnServer();
  setShowEndModal(true);
};
  const goToLogin = async () => {
    setShowEndModal(false);
    requestAuth("link_current_chat");
  };

  const submitFeedback = async () => {
    try {
      setFeedbackSubmitting(true);

      const id = conversationId || localStorage.getItem("conversationId");

      await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          conversationId: id,
          rating: Number(rating),
          review: review.trim()
        })
      });

      alert(t.feedbackThanks);
      resetChatState();
      setScreen("home");
    } catch (err) {
      console.error("Feedback submit error:", err);
      alert("Feedback submit nahi hua.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const addEmojiToWrite = (emoji) => {
    setWriteText((prev) => prev + emoji);
  };

  const addEmojiToChat = (emoji) => {
    setText((prev) => prev + emoji);
  };

  const handleEmojiSelect = (emoji) => {
    if (emojiTarget === "write") {
      setWriteText((prev) => prev + emoji);
    } else {
      setText((prev) => prev + emoji);
    }
  };

  const sendMessage = async () => {
    const currentText = text.trim();
    if (!currentText) return;

    const userMessage = {
      sender: "user",
      text: currentText
    };

    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setShowChatEmojiPicker(false);
    setShowEmojiPanel(false);
    setIsSupportTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          text: currentText,
          conversationId,
          username: profile.username,
          language: profile.language,
          gender: profile.gender
        })
      });

      const data = await res.json();

      if (data.success && data.conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem("conversationId", data.conversationId);
      }
    } catch (err) {
      console.error("Message save error:", err);
    } finally {
      setTimeout(() => {
        setIsSupportTyping(false);
      }, 1500);
    }
  };

  const saveWrite = async () => {
    const currentText = writeText.trim();
    if (!currentText) return;

    try {
      await fetch(`${API_BASE}/api/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          text: currentText,
          consentToShare,
          username: profile.username,
          language: profile.language,
          gender: profile.gender
        })
      });

      setWriteText("");
      setConsentToShare(false);
      setWriteSaved(true);
      setShowEmojiPanel(false);

      setTimeout(() => {
        setWriteSaved(false);
      }, 3000);
    } catch (err) {
      console.error("Write save error:", err);
    }
  };

  const loadReadEntries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/read`);
      const data = await res.json();

      if (data.success) {
        setReadEntries(data.entries);
      }
    } catch (err) {
      console.error("Read entries fetch error:", err);
    }
  };

  const sendSuggestion = async (entryId) => {
    const currentText = (suggestions[entryId] || "").trim();
    if (!currentText) return;

    try {
      const res = await fetch(`${API_BASE}/api/read/${entryId}/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: currentText })
      });

      const data = await res.json();

      if (data.success) {
        setSuggestions((prev) => ({
          ...prev,
          [entryId]: ""
        }));
        setSuggestionSavedId(entryId);

        setTimeout(() => {
          setSuggestionSavedId(null);
        }, 2500);
      }
    } catch (err) {
      console.error("Suggestion save error:", err);
    }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleWriteKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveWrite();
    }
  };

  const handleSuggestionKeyDown = (e, entryId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendSuggestion(entryId);
    }
  };

  useEffect(() => {
    if (screen === "chat") {
      scrollToBottom();
    }
  }, [messages, screen, isSupportTyping]);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadMyChats();
      loadMyWrites();
    }
  }, [currentUser]);

  useEffect(() => {
    setShowProfileMenu(false);
    setShowChatEmojiPicker(false);
    setShowThemeMenu(false);
    setShowEmojiPanel(false);
  }, [screen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".emoji-panel") && !e.target.closest(".emoji-toggle-btn")) {
        setShowEmojiPanel(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!conversationId || screen !== "chat") return;

    const fetchConversation = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/conversation/${conversationId}`);
        const data = await res.json();

        if (data.success && data.conversation) {
       setMessages((prev) => {
  const newMsgs = data.conversation.messages || [];

  // agar length same hai aur content bhi same hai → update mat kar
  if (
    prev.length === newMsgs.length &&
    JSON.stringify(prev) === JSON.stringify(newMsgs)
  ) {
    return prev;
  }

  return newMsgs;
});

          const lastMsg =
            data.conversation.messages?.[data.conversation.messages.length - 1];

          if (lastMsg?.sender === "support") {
            setIsSupportTyping(false);
          }
        }
      } catch (err) {
        console.error("Conversation fetch error:", err);
      }
    };

    fetchConversation();
    const interval = setInterval(fetchConversation, 6000);

    return () => clearInterval(interval);
  }, [conversationId, screen]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl]);

  const renderOnboarding = () => {
    if (screen === "splash") {
      return <SplashIntro onFinish={() => setScreen("language")} />;
    }

    if (screen === "language") {
      return (
        <div className="onboarding-screen">
          <div className="content">
            <div className="brand">☾ Sunora</div>
            <div className="onboarding-card">
              <h1>{t.languageTitle}</h1>
              <p className="soft">{t.languageSubtitle}</p>

              <div className="action-buttons">
                <button
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, language: "english" }))
                  }
                >
                  English
                </button>
                <button
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, language: "hindi" }))
                  }
                >
                  हिन्दी
                </button>
                <button
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, language: "hinglish" }))
                  }
                >
                  Hinglish
                </button>
              </div>

              <button
                className="send-btn single-continue-btn"
                onClick={() => {
                  if (!profile.language) return;
                  setScreen("gender");
                }}
              >
                {t.continue}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (screen === "gender") {
      return (
        <div className="onboarding-screen">
          <div className="content">
            <div className="onboarding-topbar">
              <button
                className="mini-skip-btn"
                onClick={() => setScreen("username")}
              >
                {t.skip}
              </button>
            </div>

            <div className="brand">☾ Sunora</div>
            <div className="onboarding-card">
              <h1>{t.identifyTitle}</h1>
              <p className="soft">{t.identifySubtitle}</p>

              <div className="action-buttons">
                <button
                  onClick={() => {
                    setProfile((prev) => ({ ...prev, gender: "male" }));
                    setScreen("username");
                  }}
                >
                  {t.male}
                </button>

                <button
                  onClick={() => {
                    setProfile((prev) => ({ ...prev, gender: "female" }));
                    setScreen("username");
                  }}
                >
                  {t.female}
                </button>

                <button
                  onClick={() => {
                    setProfile((prev) => ({
                      ...prev,
                      gender: "prefer_not_to_say"
                    }));
                    setScreen("username");
                  }}
                >
                  {t.preferNot}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (screen === "username") {
      return (
        <div className="onboarding-screen">
          <div className="content">
            <div className="onboarding-topbar">
              <button className="mini-skip-btn" onClick={() => setScreen("home")}>
                {t.skip}
              </button>
            </div>

            <div className="brand">☾ Sunora</div>
            <div className="onboarding-card">
              <h1>{t.usernameTitle}</h1>
              <p className="soft">{t.usernameSubtitle}</p>

              <input
                className="name-input"
                type="text"
                placeholder={t.usernamePlaceholder}
                value={profile.username}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, username: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setScreen("home");
                  }
                }}
              />

              <button
                className="send-btn single-continue-btn"
                onClick={() => setScreen("home")}
              >
                {t.continue}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (["splash", "language", "gender", "username"].includes(screen)) {
    return renderOnboarding();
  }

  return (
    <div
      className={`app ${
        screen === "chat" || screen === "write" || screen === "read"
          ? "chat-mode"
          : ""
      } ${theme === "dark" ? "theme-dark" : "theme-light"}`}
    >
      <div
        className={`content ${
          screen === "chat" || screen === "write" || screen === "read"
            ? "chat-layout"
            : ""
        }`}
      >
        {screen !== "chat" && screen !== "write" && screen !== "read" && (
          <div className="top-right-profile">
            <button
              className="profile-icon-btn"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              type="button"
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "👤"}
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                {currentUser ? (
                  <>
                    <div className="profile-user-name">{currentUser.name}</div>
                    <div className="profile-user-email">{currentUser.email}</div>
                    <button className="profile-menu-btn" onClick={logout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    className="profile-menu-btn"
                    onClick={() => {
                      requestAuth("home");
                    }}
                  >
                    Login / Signup
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {screen !== "chat" && screen !== "write" && screen !== "read" && (
          <div className="brand">☾ Sunora</div>
        )}

        {screen === "home" && (
          <>
            <div className="hero-top compact-hero">
              <h2>
                {profile.username
                  ? `${t.homeTitle} ${lang === "english" ? profile.username : ""}`
                  : t.homeTitle}
              </h2>
              <p className="sub">{t.homeSub}</p>
              <p className="soft hero-info">{t.homeInfo}</p>
            </div>

            <div className="action-buttons">
              <button onClick={startFreshChat}>
                <span className="btn-icon">💬</span>
                <span>{t.talkBtn}</span>
              </button>

              <button onClick={() => setScreen("write")}>
                <span className="btn-icon">✍️</span>
                <span>{t.writeBtn}</span>
              </button>

              <button
                onClick={async () => {
                  setScreen("read");
                  await loadReadEntries();
                }}
              >
                <span className="btn-icon">🫂</span>
                <span>{t.readBtn}</span>
              </button>
            </div>

            <div className="illustration-zone single-img">
              <div className="img-shell">
                <div className="img-bg-glow"></div>
                <img src={talkingImg} alt="support" />
              </div>

              <p className="img-line">{t.safeLine}</p>
            </div>

            <div className="scene-caption">
              <p>{t.captionTitle}</p>
              <span>{t.captionText}</span>
            </div>

            <div className="home-note">{t.note}</div>
          </>
        )}

        {screen === "auth" && (
          <div className="write-screen">
            <button className="back-btn" onClick={() => setScreen("home")}>
              ← {t.back}
            </button>

            <h1>{authMode === "login" ? "Welcome back" : "Create account"}</h1>
            <p className="soft">
              {authMode === "login"
                ? "Login karke apni chats aur future history save kar paoge."
                : "Account banao taaki tumhari conversations future me bhi safe rahein."}
            </p>

            <div className="write-wrap">
              {authMode === "signup" && (
                <input
                  className="name-input"
                  type="text"
                  placeholder="Your name"
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              )}

              <input
                className="name-input"
                type="email"
                placeholder="Email address"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <input
                className="name-input"
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />

              {authError && (
                <div className="write-saved" style={{ color: "#9f1239" }}>
                  {authError}
                </div>
              )}

              <button
                className="send-btn"
                onClick={submitAuth}
                disabled={authLoading}
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "login"
                  ? "Login"
                  : "Create Account"}
              </button>

              <button
                className="mini-send-btn auth-switch-btn"
                onClick={() => {
                  setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
                  setAuthError("");
                }}
              >
                {authMode === "login"
                  ? "New here? Create account"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        )}

        {screen === "myChats" && (
          <div className="read-screen">
            <button className="back-btn" onClick={() => setScreen("chat")}>
              ← {t.back}
            </button>

            <h1>My Chats</h1>
            <p className="soft">Tumhari saved conversations yahan milengi.</p>

            <div className="read-wrap">
              {myChats.length > 0 ? (
                myChats.map((chat) => {
                  const lastMsg = chat.messages?.[chat.messages.length - 1];
                  return (
                    <div key={chat._id} className="wall-card">
                      <div className="entry-text">
                        <strong>Status:</strong> {chat.status}
                      </div>
                      <div className="entry-text">
                        <strong>Last message:</strong>{" "}
                        {lastMsg?.text || (lastMsg?.audioUrl ? "Voice note" : "No messages yet")}
                      </div>
                      <button
                        className="mini-send-btn"
                        onClick={() => openSavedConversation(chat._id)}
                      >
                        Open Chat
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="empty-read">
                  Abhi tumhari koi saved chat nahi hai.
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "myWrites" && (
          <div className="read-screen">
            <button className="back-btn" onClick={() => setScreen("write")}>
              ← {t.back}
            </button>

            <h1>My Writings</h1>
            <p className="soft">Tumne jo likha tha, woh yahan safe rahega.</p>

            <div className="read-wrap">
              {myWrites.length > 0 ? (
                myWrites.map((entry) => (
                  <div key={entry._id} className="wall-card">
                    <div className="entry-text">{entry.text}</div>
                    <div className="approved-suggestions">
                      <div className="approved-suggestion-item">
                        Status: {entry.approvalStatus}
                      </div>
                      <div className="approved-suggestion-item">
                        Consent to share: {entry.consentToShare ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-read">
                  Abhi tumhari koi writing saved nahi hai.
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "chat" && (
          <div className="chat-screen whatsapp-chat-screen">
            <div className="chat-topbar">
              <div className="chat-topbar-left">
               <div className="chat-contact-block">
                  <div className="chat-contact-avatar">
                    {profile.username?.trim()
                      ? profile.username.trim().charAt(0).toUpperCase()
                      : "S"}
                  </div>

                  <div className="chat-contact-meta">
                    <div className="chat-contact-name">Sunora Support</div>
                    <div className="chat-contact-status">
                      {t.chatSub.split("\n")[0]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="chat-topbar-right">
                <div className="theme-menu-wrap">
                  <button
                    className="chat-icon-btn"
                    type="button"
                    onClick={() => setShowThemeMenu((prev) => !prev)}
                  >
                    🎨
                  </button>

                  {showThemeMenu && (
                    <div className="theme-menu-dropdown">
                      <button onClick={() => toggleTheme("light")}>Light</button>
                      <button onClick={() => toggleTheme("dark")}>Dark</button>
                    </div>
                  )}
                </div>

                <button className="chat-chip-btn" onClick={openMyChats}>
                  My Chats
                </button>

                <div className="chat-profile-wrap">
                  <button
                    className="chat-icon-btn profile-mini-btn"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    type="button"
                  >
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "👤"}
                  </button>

                  {showProfileMenu && (
                    <div className="profile-dropdown profile-dropdown-chat">
                      {currentUser ? (
                        <>
                          <div className="profile-user-name">{currentUser.name}</div>
                          <div className="profile-user-email">{currentUser.email}</div>
                          <button className="profile-menu-btn" onClick={logout}>
                            Logout
                          </button>
                        </>
                      ) : (
                        <button
                          className="profile-menu-btn"
                          onClick={() => {
                            requestAuth("home");
                          }}
                        >
                          Login / Signup
                        </button>
                      )}
                    </div>
                  )}
                </div>

               <button
  className="chat-icon-btn end-chat-float-btn"
  onClick={endChatNow}
  title="End Chat"
>
  ✘
</button>
              </div>
            </div>

            <div className="chat-thread" ref={chatBoxRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-row ${
                    msg.sender === "user" ? "user-row" : "support-row"
                  }`}
                >
                  <div
                    className={`chat-bubble ${
                      msg.sender === "user" ? "user-bubble" : "support-bubble"
                    }`}
                  >
                    {msg.audioUrl ? (
                      <audio controls src={msg.audioUrl} className="voice-note-player" />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {isSupportTyping && (
                <div className="chat-row support-row">
                  <div className="chat-bubble support-bubble typing-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-bottom-wrap">
              {showEmojiPanel && emojiTarget === "chat" && (
                <div className="emoji-panel">
                  {Object.keys(emojiCategories).map((category) => (
                    <div key={category} className="emoji-section">
                      <div className="emoji-title">{category}</div>
                      <div className="emoji-grid">
                        {emojiCategories[category].map((emoji, index) => (
                          <button
                            key={`${category}-${index}`}
                            type="button"
                            className="emoji-item"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {audioPreviewUrl && (
                <div className="voice-preview-bar">
                  <div className="voice-preview-left">
                    <span className="voice-dot"></span>
                    <span>Voice note ready</span>
                  </div>
                  <audio controls src={audioPreviewUrl} className="voice-note-player preview-player" />
                  <div className="voice-preview-actions">
                    <button
                      type="button"
                      className="voice-action-btn cancel"
                      onClick={cancelVoiceRecording}
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      className="voice-action-btn send"
                      onClick={sendVoiceNote}
                    >
                      ➤
                    </button>
                  </div>
                </div>
              )}

              <div className="chat-composer">
                <button
                  className="chat-composer-icon emoji-toggle-btn"
                  type="button"
                  onClick={() => {
                    setEmojiTarget("chat");
                    setShowEmojiPanel((prev) => !prev);
                  }}
                  title="Emoji"
                >
                  😊
                </button>

                {!isRecording && !audioPreviewUrl && (
                  <textarea
                    className="chat-textarea whatsapp-textarea"
                    placeholder={t.chatPlaceholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    rows={1}
                  />
                )}

                {isRecording && (
                  <div className="recording-status">
                    <span className="recording-pulse"></span>
                    <span>Recording {formatRecordingTime(recordingSeconds)}</span>
                  </div>
                )}

                {!isRecording && !audioPreviewUrl && (
                  <button
                    className={`chat-composer-icon mic-btn`}
                    type="button"
                    onClick={startVoiceRecording}
                    title="Voice note"
                  >
                    🎙️
                  </button>
                )}

                {isRecording && (
                  <button
                    className="chat-composer-icon mic-btn recording-btn"
                    type="button"
                    onClick={stopVoiceRecording}
                    title="Stop recording"
                  >
                    ⏹
                  </button>
                )}

                {!isRecording && !audioPreviewUrl && (
                  <button
                    className={`chat-send-fab ${text.trim() ? "active" : ""}`}
                    onClick={sendMessage}
                    type="button"
                    disabled={!text.trim()}
                  >
                    ➤
                  </button>
                )}
              </div>

              <p className="login-hint chat-login-hint">{t.loginHint}</p>
            </div>

            {showEndModal && (
              <div className="modal-overlay" onClick={() => setShowEndModal(false)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                  <h3>{t.chatEnded} 💬</h3>
                  <p>{t.loginAsk}</p>

                  <div className="modal-btn-row">
                    <button className="modal-btn primary" onClick={goToLogin}>
                      {t.login}
                    </button>
                    <button
                      className="modal-btn secondary"
                      onClick={() => setShowFeedbackBox(true)}
                    >
                      {t.continueGuest}
                    </button>
                  </div>

                  {showFeedbackBox && (
                    <div className="feedback-box">
                      <p className="feedback-title">{t.rateExperience} ⭐</p>

                      <select
                        className="feedback-select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>

                      <textarea
                        className="feedback-textarea"
                        placeholder={t.feedbackPlaceholder}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />

                      <div className="modal-btn-row">
                        <button
                          className="modal-btn submit"
                          onClick={submitFeedback}
                          disabled={feedbackSubmitting}
                        >
                          {feedbackSubmitting ? "Submitting..." : t.submitFeedback}
                        </button>
                        <button
                          className="modal-btn close"
                          onClick={() => setShowEndModal(false)}
                        >
                          {t.close}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "write" && (
          <div className="chat-screen whatsapp-chat-screen">
            <div className="chat-topbar">
              <div className="chat-topbar-left">
                <button
                  className="chat-icon-btn back-circle-btn"
                  onClick={() => setScreen("home")}
                >
                  ←
                </button>

                <div className="chat-contact-block">
                  <div className="chat-contact-avatar">✍️</div>
                  <div className="chat-contact-meta">
                    <div className="chat-contact-name">{t.writeTitle}</div>
                    <div className="chat-contact-status">
                      {t.writeSub.split("\n")[0]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="chat-topbar-right">
                <div className="theme-menu-wrap">
                  <button
                    className="chat-icon-btn"
                    type="button"
                    onClick={() => setShowThemeMenu((prev) => !prev)}
                  >
                    🎨
                  </button>

                  {showThemeMenu && (
                    <div className="theme-menu-dropdown">
                      <button onClick={() => toggleTheme("light")}>Light</button>
                      <button onClick={() => toggleTheme("dark")}>Dark</button>
                    </div>
                  )}
                </div>

                <button className="chat-chip-btn" onClick={openMyWrites}>
                  My Writings
                </button>
              </div>
            </div>

            <div className="write-full-area">
              <textarea
                className="write-full-textarea"
                placeholder={t.writePlaceholder}
                value={writeText}
                onChange={(e) => setWriteText(e.target.value)}
                onKeyDown={handleWriteKeyDown}
              />

              <label className="consent-box full-consent-box">
                <input
                  type="checkbox"
                  checked={consentToShare}
                  onChange={(e) => setConsentToShare(e.target.checked)}
                />
                <span>{t.consent}</span>
              </label>

              {writeSaved && <div className="write-saved">{t.saved}</div>}
            </div>

            <div className="chat-bottom-wrap">
              {showEmojiPanel && emojiTarget === "write" && (
                <div className="emoji-panel">
                  {Object.keys(emojiCategories).map((category) => (
                    <div key={category} className="emoji-section">
                      <div className="emoji-title">{category}</div>
                      <div className="emoji-grid">
                        {emojiCategories[category].map((emoji, index) => (
                          <button
                            key={`${category}-${index}`}
                            type="button"
                            className="emoji-item"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="chat-composer write-composer">
                <button
                  className="chat-composer-icon emoji-toggle-btn"
                  type="button"
                  onClick={() => {
                    setEmojiTarget("write");
                    setShowEmojiPanel((prev) => !prev);
                  }}
                >
                  😊
                </button>

                <div className="write-footer-text">Write freely. No judgement.</div>

                <button
                  className="chat-send-fab active"
                  onClick={saveWrite}
                  type="button"
                >
                  ✔
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "read" && (
          <div className="chat-screen whatsapp-chat-screen">
            <div className="chat-topbar">
              <div className="chat-topbar-left">
                <button
                  className="chat-icon-btn back-circle-btn"
                  onClick={() => setScreen("home")}
                >
                  ←
                </button>

                <div className="chat-contact-block">
                  <div className="chat-contact-avatar">🫂</div>
                  <div className="chat-contact-meta">
                    <div className="chat-contact-name">{t.readTitle}</div>
                    <div className="chat-contact-status">{t.readSub}</div>
                  </div>
                </div>
              </div>

              <div className="chat-topbar-right">
                <div className="theme-menu-wrap">
                  <button
                    className="chat-icon-btn"
                    type="button"
                    onClick={() => setShowThemeMenu((prev) => !prev)}
                  >
                    🎨
                  </button>

                  {showThemeMenu && (
                    <div className="theme-menu-dropdown">
                      <button onClick={() => toggleTheme("light")}>Light</button>
                      <button onClick={() => toggleTheme("dark")}>Dark</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="read-feed-area">
              {readEntries.length > 0 ? (
                readEntries.map((entry) => (
                  <div key={entry.id || entry._id} className="read-feed-card">
                    <div className="read-feed-text">“{entry.text}”</div>

                    {entry.suggestions?.length > 0 && (
                      <div className="approved-suggestions">
                        {entry.suggestions.map((s, index) => (
                          <div key={index} className="approved-suggestion-item">
                            💙 {s.text}
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      className="suggest-textarea"
                      placeholder={t.suggestionPlaceholder}
                      value={suggestions[entry.id || entry._id] || ""}
                      onChange={(e) =>
                        setSuggestions((prev) => ({
                          ...prev,
                          [entry.id || entry._id]: e.target.value
                        }))
                      }
                      onKeyDown={(e) =>
                        handleSuggestionKeyDown(e, entry.id || entry._id)
                      }
                    />

                    <button
                      className="mini-send-btn"
                      onClick={() => sendSuggestion(entry.id || entry._id)}
                    >
                      {t.suggestionBtn}
                    </button>

                    {suggestionSavedId === (entry.id || entry._id) && (
                      <div className="suggestion-saved">{t.suggestionSaved}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-read full-empty-read">{t.emptyRead}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;