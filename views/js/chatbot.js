const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const languageSelect = document.getElementById("language-select");

// Knowledge base for farming-related questions
const knowledgeBase = {
  en: {
    greetings: {
      hi: "Hello! I'm your farming assistant. How can I help you today?",
      hello:
        "Hello! I'm here to help you with all your farming questions.",
      help: "I can help you with various farming topics including soil testing, crop selection, pest control, and weather impact. What would you like to know about?",
      how_are_you:
        "I'm doing well, thank you! How can I assist you with your farming needs today?",
    },
    crops: {
      seasonal:
        "Based on the current season and climate in Maharashtra, you can consider growing Kharif crops like soybean, cotton, or paddy. Make sure to check local soil and rainfall conditions before finalizing.",
      organic:
        "Use compost or organic manure, avoid synthetic fertilizers and pesticides, rotate crops, and select disease-resistant varieties. Maintain good irrigation and monitor soil health regularly.",
      tomatoes:
        "Tomatoes grow best in slightly acidic soil with a pH between 6.0 and 6.8.",
      wheat:
        "Use a balanced mix of nitrogen (N), phosphorus (P), and potassium (K). Typically, 120:60:40 NPK per hectare is used, but adjust based on soil test results.",
    },
    weather: {
      forecast:
        "Please share your location or pin code so I can check the local weather forecast for you.",
      irrigation:
        "For sugarcane, drip irrigation requires about 60–80 liters per day per meter row length. However, the exact amount can vary based on soil type and climate.",
    },
    soil: {
      testing:
        "You can get a soil health card through your nearest Krishi Vigyan Kendra (KVK) or agriculture department. Alternatively, private labs also offer soil testing services.",
      ph: "The ideal pH level for most crops is between 6.0 and 7.0. You can adjust soil pH by adding lime to increase it or sulfur to decrease it.",
    },
    pesticides: {
      neem: "Yes, neem oil is an effective organic pesticide that works against many pests like aphids, whiteflies, and caterpillars.",
    },
    schemes: {
      pmkisan:
        "PM-KISAN is a government scheme that provides ₹6,000 annually to eligible farmers in three equal installments. You can apply through the pmkisan.gov.in portal or visit your local agriculture office.",
      drip: "Yes, the government offers subsidies up to 50–70% for drip irrigation under the Pradhan Mantri Krishi Sinchai Yojana. Contact your state agriculture department for application details.",
    },
    technology: {
      drones:
        "Yes, drones are used for spraying pesticides, monitoring crop health, and mapping fields. They save time, reduce chemical usage, and improve accuracy.",
      precision:
        "Precision farming uses technology like GPS, sensors, and data analytics to optimize crop yields, reduce input costs, and improve farm efficiency.",
    },
  },
  hi: {
    greetings: {
      hi: "नमस्ते! मैं आपका कृषि सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?",
      hello:
        "नमस्ते! मैं आपके सभी कृषि संबंधित प्रश्नों में मदद के लिए यहां हूं।",
      help: "मैं आपकी मिट्टी परीक्षण, फसल चयन, कीट नियंत्रण और मौसम के प्रभाव जैसे विभिन्न कृषि विषयों में मदद कर सकता हूं। आप किस बारे में जानना चाहेंगे?",
      how_are_you:
        "मैं ठीक हूं, धन्यवाद! मैं आपकी कृषि संबंधित आवश्यकताओं में कैसे मदद कर सकता हूं?",
    },
    crops: {
      seasonal:
        "महाराष्ट्र में वर्तमान मौसम और जलवायु के आधार पर, आप सोयाबीन, कपास या धान जैसी खरीफ फसलें उगा सकते हैं। अंतिम निर्णय लेने से पहले स्थानीय मिट्टी और वर्षा की स्थिति की जांच करना सुनिश्चित करें।",
      organic:
        "कम्पोस्ट या जैविक खाद का उपयोग करें, सिंथेटिक उर्वरकों और कीटनाशकों से बचें, फसलों को घुमाएं, और रोग प्रतिरोधी किस्मों का चयन करें। अच्छी सिंचाई बनाए रखें और मिट्टी के स्वास्थ्य की नियमित निगरानी करें।",
      tomatoes:
        "टमाटर थोड़ा अम्लीय मिट्टी में सबसे अच्छा बढ़ता है जिसका पीएच 6.0 से 6.8 के बीच होता है।",
      wheat:
        "नाइट्रोजन (N), फॉस्फोरस (P), और पोटेशियम (K) का संतुलित मिश्रण उपयोग करें। आमतौर पर, प्रति हेक्टेयर 120:60:40 NPK का उपयोग किया जाता है, लेकिन मिट्टी परीक्षण के परिणामों के आधार पर समायोजित करें।",
    },
    weather: {
      forecast:
        "कृपया अपना स्थान या पिन कोड साझा करें ताकि मैं आपके लिए स्थानीय मौसम पूर्वानुमान की जांच कर सकूं।",
      irrigation:
        "गन्ने के लिए, ड्रिप सिंचाई के लिए प्रति मीटर पंक्ति लंबाई में प्रतिदिन लगभग 60-80 लीटर पानी की आवश्यकता होती है। हालांकि, सटीक मात्रा मिट्टी के प्रकार और जलवायु के आधार पर भिन्न हो सकती है।",
    },
    soil: {
      testing:
        "आप अपने निकटतम कृषि विज्ञान केंद्र (KVK) या कृषि विभाग के माध्यम से मृदा स्वास्थ्य कार्ड प्राप्त कर सकते हैं। वैकल्पिक रूप से, निजी प्रयोगशालाएं भी मिट्टी परीक्षण सेवाएं प्रदान करती हैं।",
      ph: "अधिकांश फसलों के लिए आदर्श पीएच स्तर 6.0 से 7.0 के बीच होता है। आप चूने को जोड़कर इसे बढ़ा सकते हैं या सल्फर को जोड़कर इसे कम कर सकते हैं।",
    },
    pesticides: {
      neem: "हां, नीम का तेल एक प्रभावी जैविक कीटनाशक है जो एफिड्स, व्हाइटफ्लाइज और कैटरपिलर यांसारख्या अनेक कीटों के खिलाफ काम करता है।",
    },
    schemes: {
      pmkisan:
        "पीएम-किसान एक सरकारी योजना है जो पात्र किसानों को तीन समान हप्त्यांमध्ये दरवर्षी ₹6,000 प्रदान करते हैं। आप pmkisan.gov.in पोर्टल के माध्यम से या अपने स्थानीय कृषी कार्यालय में जाकर आवेदन कर सकते हैं।",
      drip: "हां, सरकार प्रधानमंत्री कृषी सिंचाई योजना के तहत ड्रिप सिंचाई के लिए 50-70% तक की सब्सिडी प्रदान करती है। अर्जाच्या तपशीलांसाठी तुमच्या राज्य कृषी विभागाशी संपर्क करें।",
    },
    technology: {
      drones:
        "हां, ड्रोन्सचा वापर कीटकनाशकांच्या फवारणी, पीक आरोग्याच्या निगराणी आणि शेतांच्या मॅपिंगसाठी केला जातो. ते वेळ वाचवतात, रसायनांचा वापर कमी करतात आणि अचूकता सुधारतात.",
      precision:
        "सुक्ष्म शेती जीपीएस, सेंसर और डेटा विश्लेषण यासारख्या तंत्रज्ञानाचा वापर करते जेणेकरून पीक उत्पन्न ऑप्टिमाइझ करता येईल, इनपुट खર્ચ कमी करता येईल आणि शेताची कार्यक्षमता सुधारता येईल.",
    },
  },
  mr: {
    greetings: {
      hi: "नमस्कार! मी तुमचा शेती सहायक आहे. मी तुम्हाला कशी मदत करू शकतो?",
      hello:
        "नमस्कार! मी तुमच्या सर्व शेती संबंधित प्रश्नांमध्ये मदतीसाठी इथे आहे.",
      help: "मी तुम्हाला मातीची चाचणी, पीक निवड, कीटक नियंत्रण आणि हवामानाचा परिणाम यासारख्या विवિધ शेती वિષयांमध्ये मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?",
      how_are_you:
        "मी चांगला आहे, धन्यवाद! मी तुमच्या शेती संबंधित गरजांमध्ये कशी मदत करू शकतो?",
    },
    crops: {
      seasonal:
        "महाराष्ट्रातील सध्याच्या हंगामात आणि हवामानाच्या आधारे, तुम्ही सोयाबીन, कापूस किंवा भात यासारख्या खरीप पिकांची लागवड करू शकता. अंतिम निर्णय घेण्यापूर्वी स्थानिक माती आणि पाऊस परिस्थिती तपासण्याची खात्री करा.",
      organic:
        "कंपोस्ट किंवा सेंद्रिय खत वापरा, कृत्रिम खते आणि कीटकनाशकો ટાળો, પાકો ફેરવો, आणि રોગ પ્રતિરોધક જાતો પસંદ કરો. સારી સિંચાઈ જાળવો અને માટીના સ્વાસ્થ્યની નિયમિત દેખરેખ રાખો.",
      tomatoes:
        "टोमॅटो थोडા एसडी माटीमાં सर्वोत्तम वाढतात ज्याचा pH 6.0 अन्य 6.8 वच्चे होते.",
      wheat:
        "नाइट्रोजन (N), फोस्फरस (P), अन्य पोटेशियम (K) चे संतुलित मिश्रण वापरा. सामान्यतः, प्रति हेक्टर 120:60:40 NPK वापरले जाते, परंतु मातीच्या चाचणीच्या निकालांनुसार समायोजિत करा.",
    },
    weather: {
      forecast:
        "कृपया तुमचे स्थान किंवा पिन कोड सामायिक करा जेणेकरून मी तुमच्यासाठी स्थानिक हवामान अंदाज तपासू शकेन.",
      irrigation:
        "ऊसासाठी, ड्रिप सिंचाईसाठी प्रति मीटर पंक्ती लांबीला दररોज सुमारे 60-80 लिटर पाणी लागते. तथापि, अचूक रक्कम मातीच्या प्रकार आणि हवामानावर अवलंबून बदलू शकते.",
    },
    soil: {
      testing:
        "तुम्ही तुमच्या जवळच्या कृषी विज्ञान केंद्र (KVK) किंवा कृषी विभागाद्वारे मातीचे आरोग्य कार्ड मिळवू शकता. पर्यायीरित्या, खाजगी प्रयोगशाळा देखील मातीची चाचणी सेवा देतात.",
      ph: "बहुतेक पिकांसाठी आदर्श पीएच पातळी 6.0 ते 7.0 दरम्यान असते. तुम्ही चूनો उमेरीनે ते वाढवू शकता किंवा सल्फर उमेरीनે ते कमी करू शकता.",
    },
    pesticides: {
      neem: "होय, निंबाचे तेल एक प्रभावी सेंद्रिय कीटकनाशक आहे जे एफिड्स, व્હાઇટફ્લાય્સ अनે कેટरपિલર્સ जਿवो अनेक कीटकો सामਾ करते.",
    },
    schemes: {
      pmkisan:
        "पीएम-किसान ही एक सरकारी योजना आहे जो पात्र शेतकऱ्यांना तीन समान हप्त्यांमध्ये दरवर्षी ₹6,000 प्रदान करते. तुम्ही pmkisan.gov.in पोर्टलद्वारे किंवा तुमच्या स्थानिक कृषी कार्यालयात जाऊन अर्ज करू शकता.",
      drip: "होय, सरकार प्रधानमंत्रી कृषी सिंचन योजनेअंतर्गत ड्रिप सिंचनासाठी 50-70% पर्यंत सब्सिडी देते. अर्जाच्या तपशीलांसाठी तुमच्या राज્યના कृषी विभागाशी संपर्क साधा.",
    },
    technology: {
      drones:
        "होय, ड्रोन्सचा वापर कीटकनाशकांच्या फवारणी, पीक आरोग्याच्या निगराणी आणि शेतांच्या मॅपिंगसाठी केला जातो. ते वेळ वाचवतात, रसायनांचा वापर कमी करतात आणि अचूकता सुधारतात.",
      precision:
        "सुक्ष्म शेती जीपीएस, सेंसर आणि डेटा विश्लेषण यासारख्या तंत्रज्ञानाचा वापर करते जेणेकरून पीक उत्पन्न ऑप्टिमाइझ करता येईल, इनपुट खर्च कमी करता येईल आणि शेताची कार्यक्षमता सुधारता येईल.",
    },
  },
  gu: {
    greetings: {
      hi: "નમસ્તે! હું તમારો ખેતી સહાયક છું. હું તમને કેવી રીતે મદદ કરી શકું?",
      hello:
        "નમસ્તે! હું તમારા બધા ખેતી સંબંધિત પ્રશ્નોમાં મદદ માટે અહીં છું.",
      help: "હું તમને માટી પરીક્ષણ, પાક પસંદગી, કીટક નિયંત્રણ અને હવામાનના પ્રભાવ જેવા વિવિધ ખેતી વિષયોમાં મદદ કરી શકું છું. તમે શું જાણવા માંગો છો?",
      how_are_you:
        "હું સારો છું, આભાર! હું તમારી ખેતી સંબંધિત જરૂરિયાતોમાં કેવી રીતે મદદ કરી શકું?",
    },
    crops: {
      seasonal:
        "મહારાષ્ટ્રમાં વર્તમાન ઋતુ અને આબોહવાના આધારે, તમે સોયાબીન, કપાસ અથવા ડાંગર જેવા ખરીફ પાક ઉગાડી શકો છો. અંતિમ નિર્ણય લેતા પહેલા સ્થાનિક માટી અને વરસાદની સ્થિતિ તપાસવાની ખાતરી કરો.",
      organic:
        "કમ્પોસ્ટ અથવા ઓર્ગેનિક ખાતરનો ઉપયોગ કરો, સિન્થેટિક ખાતરો અને કીટકનાશકો ટાળો, પાકો ફેરવો, અને રોગ પ્રતિરોધક જાતો પસંદ કરો. સારી સિંચાઈ જાળવો અને માટીના સ્વાસ્થ્યની નિયમિત દેખરેખ રાખો.",
      tomatoes:
        "ટમેટા થોડા એસિડિક માટीમાં સૌથી સારી રીતે વધે છે જેનો pH 6.0 અને 6.8 વચ્ચે હोય છે.",
      wheat:
        "નાઇટ્રોજન (N), ફોસ્ફરસ (P), અને પોટેશિયમ (K) નું સંતુલિત મિશ્રણ વાપરો. સામાન્ય રીતે, પ્રતિ હેક્ટર 120:60:40 NPK વપરાય છે, પરંતુ માટી પરીક્ષણના પરિણામોના આધારે સમાયોજિત કરો.",
    },
    weather: {
      forecast:
        "કૃપા કરીને તમારું સ્થાન અથવા પિન કોડ શેર કરો જેથી હું તમારા માટે સ્થાનિક હવામાનની આગાહી તપાસી શકું.",
      irrigation:
        "ખાંડના ગોળા માટે, ડ્રિપ સિંચાઈ માટે પ્રતિ મીટર પંક્તિ લંબાઈ દીઠ દરરોજ લગભગ 60-80 લિટર પાણીની જરૂર પડે છે. જો કે, ચોક્કસ રકમ માટીના પ્રકાર અને આબોહવા પર આધારિત બદલાઈ શકે છે.",
    },
    soil: {
      testing:
        "તમે તમારા નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) અથવા કૃષિ વિભાગ દ્વારા માટી સ્વાસ્થ્ય કાર્ડ મેળવી શકો છો. વૈકલ્પિક રીતે, ખાનગી લેબોરેટરીઓ પણ માટી પરીક્ષણ સેવાઓ પ્રદાન કરે છે.",
      ph: "મોટાભાગના પાકો માટે આદર્શ pH સ્તર 6.0 અને 7.0 વચ્ચે હોય છે. તમે ચૂનો ઉમેરીને તેને વધારી શકો છો અથવા સલ્ફર ઉમેરીને તેને ઘટાડી શકો છો.",
    },
    pesticides: {
      neem: "હા, નીમનું તેલ એક અસરકારક ઓર્ગેનિક કીટકનાશક છે જે એફિડ્સ, વ્હાઇટફ્લાય્સ અને કેટરપિલર્સ જેવા ઘણા કીટકો સામે કામ કરે છે.",
    },
    schemes: {
      pmkisan:
        "PM-KISAN એ એક સરકારી યોજના છે જે પાત્ર ખેડૂતોને ત્રણ સમાન હપ્તામાં વાર્ષિક ₹6,000 પ્રદાન કરે છે. તમે pmkisan.gov.in પોર્ટલ દ્વારા અથવા તમારા સ્થાનિક કૃષિ કાર્યાલયની મુલાકાત લઈને અરજી કરી શકો છો.",
      drip: "હા, સરકાર પ્રધાનમંત્રી કૃષિ સિંચાઈ યોજના હેઠળ ડ્રિપ સિંચાઈ માટે 50-70% સુધીની સબ્સિડી આપે છે. અરજીની વિગતો માટે તમારા રાજ્યના કૃષિ વિભાગનો સંપર્ક કરો.",
    },
    technology: {
      drones:
        "હા, ડ્રોન્સનો ઉપયોગ કીટકનાશકો છાંટવા, પાકના સ્વાસ્થ્યની દેખરેખ અને ખેતરોનું મેપિંગ કરવા માટે થાય છે. તેઓ સમય બચાવે છે, રસાયણોનો ઉપયોગ ઘટાડે છે અને ચોકસાઈ સુધારે છે.",
      precision:
        "પ્રેસિઝન ફાર્મિંગ GPS, સેન્સર્સ અને ડેટા એનાલિટિક્સ જેવી ટેકનોલોજીનો ઉપયોગ કરે છે જેથી પાકની ઉપજ ઑપ્ટિમાઇઝ કરી શકાય, ઇનપુટ ખર્ચ ઘટાડી શકાય અને ફાર્મની કાર્યક્ષમતા સુધારી શકાય.",
    },
  },
};

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${
    isUser ? "user-message" : "bot-message"
  }`;
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function findAnswer(question, language) {
  const langKB = knowledgeBase[language] || knowledgeBase.en;
  const lowerQuestion = question.toLowerCase();

  // Check for greetings and help-related questions
  if (
    lowerQuestion.includes("hi") ||
    lowerQuestion.includes("hello") ||
    lowerQuestion.includes("नमस्ते") ||
    lowerQuestion.includes("नमस्कार") ||
    lowerQuestion.includes("નમસ્તે")
  ) {
    return langKB.greetings.hi;
  }
  if (
    lowerQuestion.includes("help") ||
    lowerQuestion.includes("मदद") ||
    lowerQuestion.includes("सहायता") ||
    lowerQuestion.includes("મદદ")
  ) {
    return langKB.greetings.help;
  }
  if (
    lowerQuestion.includes("how are you") ||
    lowerQuestion.includes("कैसे हो") ||
    lowerQuestion.includes("कसे आहात") ||
    lowerQuestion.includes("કેમ છો")
  ) {
    return langKB.greetings.how_are_you;
  }

  // Check for crop-related questions
  if (
    lowerQuestion.includes("crop") ||
    lowerQuestion.includes("season") ||
    lowerQuestion.includes("पीक") ||
    lowerQuestion.includes("मौसम") ||
    lowerQuestion.includes("पिक") ||
    lowerQuestion.includes("ऋतू")
  ) {
    return langKB.crops.seasonal;
  }
  if (
    lowerQuestion.includes("organic") ||
    lowerQuestion.includes("जैविक") ||
    lowerQuestion.includes("सेंद्रिय") ||
    lowerQuestion.includes("ઓર્ગેનિક")
  ) {
    return langKB.crops.organic;
  }
  if (
    lowerQuestion.includes("tomato") ||
    lowerQuestion.includes("टमाटर") ||
    lowerQuestion.includes("टोमॅटो") ||
    lowerQuestion.includes("ટમેટા")
  ) {
    return langKB.crops.tomatoes;
  }
  if (
    lowerQuestion.includes("wheat") ||
    lowerQuestion.includes("गेहूं") ||
    lowerQuestion.includes("गहू") ||
    lowerQuestion.includes("ઘઉં")
  ) {
    return langKB.crops.wheat;
  }

  // Check for weather-related questions
  if (
    lowerQuestion.includes("rain") ||
    lowerQuestion.includes("weather") ||
    lowerQuestion.includes("बारिश") ||
    lowerQuestion.includes("मौसम") ||
    lowerQuestion.includes("पाऊस") ||
    lowerQuestion.includes("હવામાન")
  ) {
    return langKB.weather.forecast;
  }
  if (
    lowerQuestion.includes("irrigation") ||
    lowerQuestion.includes("sugarcane") ||
    lowerQuestion.includes("सिंचाई") ||
    lowerQuestion.includes("गन्ना") ||
    lowerQuestion.includes("सिंचन") ||
    lowerQuestion.includes("ખાંડ")
  ) {
    return langKB.weather.irrigation;
  }

  // Check for soil-related questions
  if (
    lowerQuestion.includes("soil test") ||
    lowerQuestion.includes("मिट्टी परीक्षण") ||
    lowerQuestion.includes("मातीची चाचणी") ||
    lowerQuestion.includes("માટી પરીક્ષણ")
  ) {
    return langKB.soil.testing;
  }
  if (
    lowerQuestion.includes("ph") ||
    lowerQuestion.includes("पीएच") ||
    lowerQuestion.includes("पीएच") ||
    lowerQuestion.includes("pH")
  ) {
    return langKB.soil.ph;
  }

  // Check for pesticide-related questions
  if (
    lowerQuestion.includes("neem") ||
    lowerQuestion.includes("नीम") ||
    lowerQuestion.includes("निंब") ||
    lowerQuestion.includes("નીમ")
  ) {
    return langKB.pesticides.neem;
  }

  // Check for scheme-related questions
  if (
    lowerQuestion.includes("pmkisan") ||
    lowerQuestion.includes("पीएम किसान") ||
    lowerQuestion.includes("पीएम किसान") ||
    lowerQuestion.includes("PM-KISAN")
  ) {
    return langKB.schemes.pmkisan;
  }
  if (
    lowerQuestion.includes("drip") ||
    lowerQuestion.includes("ड्रिप") ||
    lowerQuestion.includes("ड्रिप") ||
    lowerQuestion.includes("ડ્રિપ")
  ) {
    return langKB.schemes.drip;
  }

  // Check for technology-related questions
  if (
    lowerQuestion.includes("drone") ||
    lowerQuestion.includes("ड्रोन") ||
    lowerQuestion.includes("ड्रोन") ||
    lowerQuestion.includes("ડ્રોન")
  ) {
    return langKB.technology.drones;
  }
  if (
    lowerQuestion.includes("precision") ||
    lowerQuestion.includes("सटीक") ||
    lowerQuestion.includes("सुक्ष्म") ||
    lowerQuestion.includes("પ્રેસિઝન")
  ) {
    return langKB.technology.precision;
  }

  // Default response if no specific answer is found
  return language === "en"
    ? "I'm sorry, I couldn't find specific information about that. Could you please rephrase your question or ask about crops, weather, soil, or farming technology?"
    : language === "hi"
    ? "क्षमा करें, मुझे इसके बारे में विशिष्ट जानकारी नहीं मिली। क्या आप कृपया अपना प्रश्न दोबारा लिख सकते हैं या फसलों, मौसम, मिट्टी या कृषि प्रौद्योगिकी के बारे में पूछ सकते हैं?"
    : language === "mr"
    ? "क्षमा करा, मला याबद्दल विशिष्ट माहिती सापडली नाही. कृपया तुम्ही तुमचा प्रश्न पुन्हा लिहू शकता किंवा पिके, हवामान, माती किंवा शेती तंत्रज्ञानाबद्दल विचारू शकता?"
    : "માફ કરશો, મને તેના વિશે ચોક્કસ માહિતી મળી નથી. કૃપા કરીને તમે તમારો प्रश्न ફરીથી लખી શકો છો અથવા પાક, હવામાન, માટી અથવા ખેતી ટેકનોલોજી વિશે पूछી શકો છો?";
}

async function checkAuth() {
    try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
}

async function handleUserInput() {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, true);
    userInput.value = "";

    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message bot-message typing";
    typingIndicator.textContent = "...";
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate processing time & Get Answer
    setTimeout(async () => {
      typingIndicator.remove();
      const answer = findAnswer(message, languageSelect.value);
      addMessage(answer);

      // Save to DB if logged in
      const auth = await checkAuth();
      if(auth && auth.user) {
         try {
             await fetch("/api/chat/save", {
                 method: "POST",
                 headers: {"Content-Type": "application/json"},
                 body: JSON.stringify({
                     userId: auth.user._id,
                     question: message,
                     answer: answer,
                     language: languageSelect.value
                 })
             });
         } catch(err) {
             console.error("Failed to save chat history", err);
         }
      }
    }, 1000);
  }
}

sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleUserInput();
});

// Load History
async function loadHistory() {
    const auth = await checkAuth();
    if(auth && auth.user) {
        try {
            const res = await fetch(`/api/chat/history/${auth.user._id}`);
            const data = await res.json();
            if(data.success && data.chats) {
                // Clear default message if history exists
                if(data.chats.length > 0) {
                     chatMessages.innerHTML = "";
                     data.chats.forEach(chat => {
                         addMessage(chat.question, true);
                         addMessage(chat.answer, false);
                     });
                }
            }
        } catch(err) {
            console.error("Failed to load history", err);
        }
    }
}
loadHistory();

// End of file

