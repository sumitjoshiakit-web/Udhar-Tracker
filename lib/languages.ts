export const languageOptions = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'ur', label: 'اردو' },
  { code: 'as', label: 'অসমীয়া' },
] as const

export type LanguageCode = (typeof languageOptions)[number]['code']
type TranslationKey =
  | 'language'
  | 'overview'
  | 'customerAccounts'
  | 'transactionHistory'
  | 'greeting'
  | 'greetingNote'
  | 'addUdhar'
  | 'totalDue'
  | 'customersWithDue'
  | 'collectedThisMonth'
  | 'customerLedger'
  | 'newCustomer'
  | 'searchCustomer'
  | 'all'
  | 'due'
  | 'settled'
  | 'balance'
  | 'lastTransaction'
  | 'quickTasks'
  | 'recordCredit'
  | 'takePayment'
  | 'todaysTransactions'
  | 'help'

type LocaleStrings = Record<TranslationKey, string>

export const translations: Record<LanguageCode, LocaleStrings> = {
  hi: {
    language: 'भाषा', overview: 'डैशबोर्ड', customerAccounts: 'ग्राहक खाते', transactionHistory: 'लेन-देन इतिहास', greeting: 'नमस्ते, विक्रम जी', greetingNote: 'आज का उधार और दुकान का हाल यहाँ देखें।', addUdhar: 'उधार जोड़ें', totalDue: 'कुल बाकी उधार', customersWithDue: 'उधार वाले ग्राहक', collectedThisMonth: 'इस महीने जमा हुआ', customerLedger: 'ग्राहकों के खाते', newCustomer: 'नया ग्राहक', searchCustomer: 'नाम से खाता खोजें...', all: 'सभी', due: 'बाकी है', settled: 'चुकता', balance: 'बाकी राशि', lastTransaction: 'आखिरी लेन-देन', quickTasks: 'जल्दी काम', recordCredit: 'उधार दर्ज करें', takePayment: 'जमा राशि लें', todaysTransactions: 'आज का लेन-देन', help: 'मदद',
  },
  en: {
    language: 'Language', overview: 'Overview', customerAccounts: 'Customer accounts', transactionHistory: 'Transaction history', greeting: 'Hello, Vikram', greetingNote: 'Your shop’s credit and collections at a glance.', addUdhar: 'Add credit', totalDue: 'Total outstanding', customersWithDue: 'Customers with dues', collectedThisMonth: 'Collected this month', customerLedger: 'Customer ledger', newCustomer: 'New customer', searchCustomer: 'Search by customer name...', all: 'All', due: 'Outstanding', settled: 'Settled', balance: 'Balance due', lastTransaction: 'Last transaction', quickTasks: 'Quick actions', recordCredit: 'Record credit', takePayment: 'Record payment', todaysTransactions: 'Today’s transactions', help: 'Help',
  },
  ne: {
    language: 'भाषा', overview: 'मुख्य पृष्ठ', customerAccounts: 'ग्राहकका खाता', transactionHistory: 'कारोबारको इतिहास', greeting: 'नमस्कार, विक्रम जी', greetingNote: 'आजको उधारो र पसलको हिसाब हेर्नुहोस्।', addUdhar: 'उधारो थप्नुहोस्', totalDue: 'कुल बाँकी उधारो', customersWithDue: 'उधारो भएका ग्राहक', collectedThisMonth: 'यो महिना जम्मा', customerLedger: 'ग्राहकका खाता', newCustomer: 'नयाँ ग्राहक', searchCustomer: 'नामबाट खाता खोज्नुहोस्...', all: 'सबै', due: 'बाँकी', settled: 'तिरेको', balance: 'बाँकी रकम', lastTransaction: 'पछिल्लो कारोबार', quickTasks: 'छिटो काम', recordCredit: 'उधारो लेख्नुहोस्', takePayment: 'भुक्तानी लिनुहोस्', todaysTransactions: 'आजको कारोबार', help: 'मद्दत',
  },
  pa: {
    language: 'ਭਾਸ਼ਾ', overview: 'ਮੁੱਖ ਪੰਨਾ', customerAccounts: 'ਗਾਹਕਾਂ ਦੇ ਖਾਤੇ', transactionHistory: 'ਲੈਣ-ਦੇਣ ਦਾ ਇਤਿਹਾਸ', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਵਿਕਰਮ ਜੀ', greetingNote: 'ਅੱਜ ਦਾ ਉਧਾਰ ਅਤੇ ਦੁਕਾਨ ਦਾ ਹਿਸਾਬ ਵੇਖੋ।', addUdhar: 'ਉਧਾਰ ਜੋੜੋ', totalDue: 'ਕੁੱਲ ਬਕਾਇਆ ਉਧਾਰ', customersWithDue: 'ਉਧਾਰ ਵਾਲੇ ਗਾਹਕ', collectedThisMonth: 'ਇਸ ਮਹੀਨੇ ਜਮ੍ਹਾਂ', customerLedger: 'ਗਾਹਕਾਂ ਦੇ ਖਾਤੇ', newCustomer: 'ਨਵਾਂ ਗਾਹਕ', searchCustomer: 'ਨਾਮ ਨਾਲ ਖਾਤਾ ਲੱਭੋ...', all: 'ਸਾਰੇ', due: 'ਬਕਾਇਆ', settled: 'ਚੁਕਤਾ', balance: 'ਬਾਕੀ ਰਕਮ', lastTransaction: 'ਆਖ਼ਰੀ ਲੈਣ-ਦੇਣ', quickTasks: 'ਝਟਪਟ ਕੰਮ', recordCredit: 'ਉਧਾਰ ਦਰਜ ਕਰੋ', takePayment: 'ਜਮ੍ਹਾਂ ਰਕਮ ਲਵੋ', todaysTransactions: 'ਅੱਜ ਦਾ ਲੈਣ-ਦੇਣ', help: 'ਮਦਦ',
  },
  bn: {
    language: 'ভাষা', overview: 'সংক্ষিপ্ত বিবরণ', customerAccounts: 'গ্রাহকের খাতা', transactionHistory: 'লেনদেনের ইতিহাস', greeting: 'নমস্কার, বিক্রমজি', greetingNote: 'আজকের বাকি ও দোকানের হিসাব এক নজরে দেখুন।', addUdhar: 'বাকি যোগ করুন', totalDue: 'মোট বাকি', customersWithDue: 'বাকি আছে এমন গ্রাহক', collectedThisMonth: 'এই মাসে জমা', customerLedger: 'গ্রাহকের খাতা', newCustomer: 'নতুন গ্রাহক', searchCustomer: 'নাম দিয়ে খাতা খুঁজুন...', all: 'সব', due: 'বাকি আছে', settled: 'মিটেছে', balance: 'বাকি টাকা', lastTransaction: 'শেষ লেনদেন', quickTasks: 'দ্রুত কাজ', recordCredit: 'বাকি লিখুন', takePayment: 'জমা নিন', todaysTransactions: 'আজকের লেনদেন', help: 'সাহায্য',
  },
  mr: {
    language: 'भाषा', overview: 'आढावा', customerAccounts: 'ग्राहकांची खाती', transactionHistory: 'व्यवहाराचा इतिहास', greeting: 'नमस्कार, विक्रमजी', greetingNote: 'आजचा उधार आणि दुकानाचा हिशोब एका नजरेत.', addUdhar: 'उधार जोडा', totalDue: 'एकूण बाकी उधार', customersWithDue: 'उधार असलेले ग्राहक', collectedThisMonth: 'या महिन्यात जमा', customerLedger: 'ग्राहकांची खाती', newCustomer: 'नवीन ग्राहक', searchCustomer: 'नावाने खाते शोधा...', all: 'सर्व', due: 'बाकी', settled: 'चुकते', balance: 'बाकी रक्कम', lastTransaction: 'शेवटचा व्यवहार', quickTasks: 'जलद कामे', recordCredit: 'उधार नोंदवा', takePayment: 'जमा रक्कम घ्या', todaysTransactions: 'आजचे व्यवहार', help: 'मदत',
  },
  gu: {
    language: 'ભાષા', overview: 'ઝાંખી', customerAccounts: 'ગ્રાહકનાં ખાતાં', transactionHistory: 'લેવડદેવડનો ઇતિહાસ', greeting: 'નમસ્તે, વિક્રમજી', greetingNote: 'આજનું ઉધાર અને દુકાનનો હિસાબ એક નજરમાં.', addUdhar: 'ઉધાર ઉમેરો', totalDue: 'કુલ બાકી ઉધાર', customersWithDue: 'ઉધારવાળા ગ્રાહકો', collectedThisMonth: 'આ મહિને જમા', customerLedger: 'ગ્રાહકનાં ખાતાં', newCustomer: 'નવો ગ્રાહક', searchCustomer: 'નામથી ખાતું શોધો...', all: 'બધા', due: 'બાકી', settled: 'ચૂકવાઈ ગયું', balance: 'બાકી રકમ', lastTransaction: 'છેલ્લી લેવડદેવડ', quickTasks: 'ઝડપી કામ', recordCredit: 'ઉધાર નોંધો', takePayment: 'જમા રકમ લો', todaysTransactions: 'આજની લેવડદેવડ', help: 'મદદ',
  },
  ta: {
    language: 'மொழி', overview: 'கண்ணோட்டம்', customerAccounts: 'வாடிக்கையாளர் கணக்குகள்', transactionHistory: 'பரிவர்த்தனை வரலாறு', greeting: 'வணக்கம், விக்ரம் ஜி', greetingNote: 'இன்றைய கடன் மற்றும் கடை கணக்கை ஒரே பார்வையில் காணுங்கள்.', addUdhar: 'கடன் சேர்க்க', totalDue: 'மொத்த நிலுவை', customersWithDue: 'நிலுவை வைத்துள்ள வாடிக்கையாளர்கள்', collectedThisMonth: 'இந்த மாதம் வசூலித்தது', customerLedger: 'வாடிக்கையாளர் கணக்குகள்', newCustomer: 'புதிய வாடிக்கையாளர்', searchCustomer: 'பெயரால் கணக்கைத் தேடுங்கள்...', all: 'அனைத்தும்', due: 'நிலுவை', settled: 'செலுத்தப்பட்டது', balance: 'நிலுவைத் தொகை', lastTransaction: 'கடைசி பரிவர்த்தனை', quickTasks: 'விரைவு செயல்கள்', recordCredit: 'கடனைப் பதிவு செய்', takePayment: 'பணம் பெற்றுக் கொள்', todaysTransactions: 'இன்றைய பரிவர்த்தனைகள்', help: 'உதவி',
  },
  te: {
    language: 'భాష', overview: 'సారాంశం', customerAccounts: 'కస్టమర్ ఖాతాలు', transactionHistory: 'లావాదేవీల చరిత్ర', greeting: 'నమస్కారం, విక్రమ్ గారు', greetingNote: 'ఈరోజు బాకీ, దుకాణం లెక్కలు ఒకచోట చూడండి.', addUdhar: 'బాకీ జోడించండి', totalDue: 'మొత్తం బాకీ', customersWithDue: 'బాకీ ఉన్న కస్టమర్లు', collectedThisMonth: 'ఈ నెల వసూలు', customerLedger: 'కస్టమర్ ఖాతాలు', newCustomer: 'కొత్త కస్టమర్', searchCustomer: 'పేరుతో ఖాతా వెతకండి...', all: 'అన్నీ', due: 'బాకీ ఉంది', settled: 'చెల్లించారు', balance: 'బాకీ మొత్తం', lastTransaction: 'చివరి లావాదేవీ', quickTasks: 'త్వరిత పనులు', recordCredit: 'బాకీ నమోదు చేయండి', takePayment: 'చెల్లింపు తీసుకోండి', todaysTransactions: 'నేటి లావాదేవీలు', help: 'సహాయం',
  },
  kn: {
    language: 'ಭಾಷೆ', overview: 'ಒಳನೋಟ', customerAccounts: 'ಗ್ರಾಹಕರ ಖಾತೆಗಳು', transactionHistory: 'ವಹಿವಾಟಿನ ಇತಿಹಾಸ', greeting: 'ನಮಸ್ಕಾರ, ವಿಕ್ರಮ್ ಜಿ', greetingNote: 'ಇಂದಿನ ಸಾಲ ಮತ್ತು ಅಂಗಡಿಯ ಲೆಕ್ಕವನ್ನು ಒಟ್ಟಿಗೆ ನೋಡಿ.', addUdhar: 'ಸಾಲ ಸೇರಿಸಿ', totalDue: 'ಒಟ್ಟು ಬಾಕಿ ಸಾಲ', customersWithDue: 'ಬಾಕಿ ಹೊಂದಿರುವ ಗ್ರಾಹಕರು', collectedThisMonth: 'ಈ ತಿಂಗಳ ವಸೂಲಿ', customerLedger: 'ಗ್ರಾಹಕರ ಖಾತೆಗಳು', newCustomer: 'ಹೊಸ ಗ್ರಾಹಕ', searchCustomer: 'ಹೆಸರಿನಿಂದ ಖಾತೆ ಹುಡುಕಿ...', all: 'ಎಲ್ಲಾ', due: 'ಬಾಕಿ ಇದೆ', settled: 'ಪಾವತಿಸಲಾಗಿದೆ', balance: 'ಬಾಕಿ ಮೊತ್ತ', lastTransaction: 'ಕೊನೆಯ ವಹಿವಾಟು', quickTasks: 'ತ್ವರಿತ ಕೆಲಸಗಳು', recordCredit: 'ಸಾಲ ದಾಖಲಿಸಿ', takePayment: 'ಪಾವತಿ ಸ್ವೀಕರಿಸಿ', todaysTransactions: 'ಇಂದಿನ ವಹಿವಾಟು', help: 'ಸಹಾಯ',
  },
  ml: {
    language: 'ഭാഷ', overview: 'അവലോകനം', customerAccounts: 'ഉപഭോക്തൃ കണക്കുകൾ', transactionHistory: 'ഇടപാട് ചരിത്രം', greeting: 'നമസ്കാരം, വിക്രം ജി', greetingNote: 'ഇന്നത്തെ കടവും കടയിലെ കണക്കും ഒരുമിച്ച് കാണാം.', addUdhar: 'കടം ചേർക്കുക', totalDue: 'ആകെ കുടിശ്ശിക', customersWithDue: 'കുടിശ്ശികയുള്ള ഉപഭോക്താക്കൾ', collectedThisMonth: 'ഈ മാസം ലഭിച്ചത്', customerLedger: 'ഉപഭോക്തൃ കണക്കുകൾ', newCustomer: 'പുതിയ ഉപഭോക്താവ്', searchCustomer: 'പേര് ഉപയോഗിച്ച് തിരയുക...', all: 'എല്ലാം', due: 'കുടിശ്ശിക', settled: 'അടച്ചു', balance: 'ബാക്കി തുക', lastTransaction: 'അവസാന ഇടപാട്', quickTasks: 'വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ', recordCredit: 'കടം രേഖപ്പെടുത്തുക', takePayment: 'പണം സ്വീകരിക്കുക', todaysTransactions: 'ഇന്നത്തെ ഇടപാടുകൾ', help: 'സഹായം',
  },
  or: {
    language: 'ଭାଷା', overview: 'ସାରାଂଶ', customerAccounts: 'ଗ୍ରାହକ ଖାତା', transactionHistory: 'କାରବାର ଇତିହାସ', greeting: 'ନମସ୍କାର, ବିକ୍ରମ ଜୀ', greetingNote: 'ଆଜିର ବାକି ଓ ଦୋକାନର ହିସାବ ଏକାଠି ଦେଖନ୍ତୁ।', addUdhar: 'ବାକି ଯୋଡ଼ନ୍ତୁ', totalDue: 'ମୋଟ ବାକି', customersWithDue: 'ବାକି ଥିବା ଗ୍ରାହକ', collectedThisMonth: 'ଏହି ମାସରେ ଜମା', customerLedger: 'ଗ୍ରାହକ ଖାତା', newCustomer: 'ନୂଆ ଗ୍ରାହକ', searchCustomer: 'ନାମରେ ଖାତା ଖୋଜନ୍ତୁ...', all: 'ସମସ୍ତ', due: 'ବାକି', settled: 'ପରିଶୋଧ', balance: 'ବାକି ରାଶି', lastTransaction: 'ଶେଷ କାରବାର', quickTasks: 'ଶୀଘ୍ର କାମ', recordCredit: 'ବାକି ଲେଖନ୍ତୁ', takePayment: 'ଜମା ରାଶି ନିଅନ୍ତୁ', todaysTransactions: 'ଆଜିର କାରବାର', help: 'ସହାୟତା',
  },
  ur: {
    language: 'زبان', overview: 'جائزہ', customerAccounts: 'گاہکوں کے کھاتے', transactionHistory: 'لین دین کی تاریخ', greeting: 'السلام علیکم، وکرم جی', greetingNote: 'آج کا ادھار اور دکان کا حساب ایک نظر میں دیکھیں۔', addUdhar: 'ادھار شامل کریں', totalDue: 'کل بقایا ادھار', customersWithDue: 'بقایا والے گاہک', collectedThisMonth: 'اس ماہ وصولی', customerLedger: 'گاہکوں کے کھاتے', newCustomer: 'نیا گاہک', searchCustomer: 'نام سے کھاتہ تلاش کریں...', all: 'سب', due: 'بقایا', settled: 'ادا ہوگیا', balance: 'بقایا رقم', lastTransaction: 'آخری لین دین', quickTasks: 'فوری کام', recordCredit: 'ادھار درج کریں', takePayment: 'رقم وصول کریں', todaysTransactions: 'آج کے لین دین', help: 'مدد',
  },
  as: {
    language: 'ভাষা', overview: 'সাৰাংশ', customerAccounts: 'গ্ৰাহকৰ হিচাপ', transactionHistory: 'লেনদেনৰ ইতিহাস', greeting: 'নমস্কাৰ, বিক্ৰম ডাঙৰীয়া', greetingNote: 'আজিৰ বাকী আৰু দোকানৰ হিচাপ একেলগে চাওক।', addUdhar: 'বাকী যোগ কৰক', totalDue: 'মুঠ বাকী', customersWithDue: 'বাকী থকা গ্ৰাহক', collectedThisMonth: 'এই মাহত জমা', customerLedger: 'গ্ৰাহকৰ হিচাপ', newCustomer: 'নতুন গ্ৰাহক', searchCustomer: 'নামেৰে হিচাপ বিচাৰক...', all: 'সকলো', due: 'বাকী আছে', settled: 'পৰিশোধ কৰা', balance: 'বাকী ধন', lastTransaction: 'শেহতীয়া লেনদেন', quickTasks: 'দ্ৰুত কাম', recordCredit: 'বাকী লিখক', takePayment: 'জমা লওক', todaysTransactions: 'আজিৰ লেনদেন', help: 'সহায়',
  },
}
