export const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" }
];

export const DEFAULT_LANG = "en";
export const LANG_CODES = LANGS.map((l) => l.code);
export const RTL_LANGS = new Set(["ar"]);

export const CAT_LABEL = {
  en: { tours: "Cappadocia Tour", activities: "Adventure & Activity", transfer: "Transfer & Rental", experiences: "Experience", workshops: "Workshop" },
  tr: { tours: "Kapadokya Turu", activities: "Macera & Aktivite", transfer: "Transfer & Araç Kiralama", experiences: "Deneyim", workshops: "Atölye" },
  de: { tours: "Kappadokien-Tour", activities: "Abenteuer & Aktivität", transfer: "Transfer & Mietwagen", experiences: "Erlebnis", workshops: "Workshop" },
  ru: { tours: "Тур по Каппадокии", activities: "Приключения и активности", transfer: "Трансфер и аренда авто", experiences: "Впечатления", workshops: "Мастер-класс" },
  ko: { tours: "카파도키아 투어", activities: "액티비티", transfer: "전송 & 렌터카", experiences: "체험", workshops: "워크숍" },
  zh: { tours: "卡帕多奇亚游览", activities: "探险与活动", transfer: "接送与租车", experiences: "体验项目", workshops: "手工工作坊" },
  ar: { tours: "جولة كابادوكيا", activities: "مغامرة ونشاط", transfer: "نقل وتأجير سيارات", experiences: "تجربة", workshops: "ورشة عمل" }
};

export const FILTER_LABEL = {
  en: { all: "All", tours: "Tours", activities: "Adventures", transfer: "Transfer & Rental", experiences: "Experiences", workshops: "Workshops" },
  tr: { all: "Tümü", tours: "Turlar", activities: "Maceralar", transfer: "Transfer & Kiralama", experiences: "Deneyimler", workshops: "Atölyeler" },
  de: { all: "Alle", tours: "Touren", activities: "Abenteuer", transfer: "Transfer & Miete", experiences: "Erlebnisse", workshops: "Workshops" },
  ru: { all: "Все", tours: "Туры", activities: "Приключения", transfer: "Трансфер и аренда", experiences: "Впечатления", workshops: "Мастер-классы" },
  ko: { all: "전체", tours: "투어", activities: "액티비티", transfer: "전송 & 렌터카", experiences: "체험", workshops: "워크숍" },
  zh: { all: "全部", tours: "游览", activities: "探险活动", transfer: "接送租车", experiences: "体验", workshops: "工作坊" },
  ar: { all: "الكل", tours: "الجولات", activities: "المغامرات", transfer: "النقل والتأجير", experiences: "التجارب", workshops: "ورش العمل" }
};

export const BADGE_LABEL = {
  en: { "BEST SELLER": "BEST SELLER", POPULAR: "POPULAR", LIMITED: "LIMITED", "SUPER PRICE": "SUPER PRICE", NEW: "NEW", PRIVATE: "PRIVATE" },
  tr: { "BEST SELLER": "ÇOK SATAN", POPULAR: "POPÜLER", LIMITED: "SINIRLI", "SUPER PRICE": "SÜPER FİYAT", NEW: "YENİ", PRIVATE: "ÖZEL" },
  de: { "BEST SELLER": "BESTSELLER", POPULAR: "BELIEBT", LIMITED: "BEGRENZT", "SUPER PRICE": "SUPERPREIS", NEW: "NEU", PRIVATE: "PRIVAT" },
  ru: { "BEST SELLER": "ХИТ ПРОДАЖ", POPULAR: "ПОПУЛЯРНО", LIMITED: "ОГРАНИЧЕНО", "SUPER PRICE": "СУПЕРЦЕНА", NEW: "НОВИНКА", PRIVATE: "ПРИВАТНЫЙ" },
  ko: { "BEST SELLER": "베스트셀러", POPULAR: "인기", LIMITED: "한정", "SUPER PRICE": "특가", NEW: "신규", PRIVATE: "프라이빗" },
  zh: { "BEST SELLER": "畅销", POPULAR: "热门", LIMITED: "限量", "SUPER PRICE": "超值价", NEW: "新品", PRIVATE: "私人定制" },
  ar: { "BEST SELLER": "الأكثر مبيعاً", POPULAR: "شائع", LIMITED: "محدود", "SUPER PRICE": "سعر مميز", NEW: "جديد", PRIVATE: "خاص" }
};

export const WA_TEMPLATE = {
  en: (name) => `Hello, I would like to get information about ${name}.`,
  tr: (name) => `Merhaba, ${name} hakkında bilgi almak istiyorum.`,
  de: (name) => `Hallo, ich möchte gerne Informationen zu ${name} erhalten.`,
  ru: (name) => `Здравствуйте, хочу узнать подробнее о туре «${name}».`,
  ko: (name) => `안녕하세요, ${name}에 대한 정보를 알고 싶습니다.`,
  zh: (name) => `您好，我想了解一下「${name}」的详情。`,
  ar: (name) => `مرحباً، أود الحصول على معلومات حول ${name}.`
};

export const UI = {
  en: {
    navHome: "Home", navTours: "Tours", navActivities: "Activities", navExperiences: "Experiences",
    navWorkshops: "Workshops", navContact: "Contact", navChatWa: "Chat on WhatsApp", headerWa: "WhatsApp",
    heroEyebrow: "CAPGUIDE TRAVEL · CAPPADOCIA", heroPlan: "PLAN YOUR EXPERIENCE", heroExplore: "EXPLORE TOURS",
    trust1Title: "LOCAL EXPERIENCE", trust1Desc: "Authentic Cappadocia experiences",
    trust2Title: "BEST EXPERIENCES", trust2Desc: "Tours & activities for every traveler",
    trust3Title: "PRIVATE OPTIONS", trust3Desc: "Flexible private experiences",
    trust4Title: "WHATSAPP SUPPORT", trust4Desc: "Quick & easy communication",
    toursEyebrow: "OUR SERVICES", toursTitleTop: "EXPLORE", toursTitleEm: "CAPPADOCIA",
    toursSub: "Discover the most unforgettable tours, adventures and experiences in Cappadocia.",
    askWa: "Ask on WhatsApp", flipHint: "Hover over a card to see the details — on mobile, just tap.",
    featuredEyebrow: "HIGHLIGHTS", featuredTitleTop: "UNFORGETTABLE", featuredTitleEm: "MOMENTS", featuredCta: "Ask on WhatsApp →",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "DISCOVER.", aboutTitle2: "EXPERIENCE.", aboutTitleEm: "REMEMBER.",
    aboutP1: "Cappadocia is not a place you simply visit — it is a place you feel. We design days that go beyond sightseeing: sunrise above the valleys, dust on the trails, warm stone under your hand in an Avanos workshop.",
    aboutP2: "Tell us what you dream of, and we will shape the rest.", aboutCta: "TALK TO US ON WHATSAPP",
    contactEyebrow: "CONTACT", contactTitle1: "LET'S PLAN YOUR", contactTitleEm: "CAPPADOCIA EXPERIENCE",
    contactSub: "Have a question or looking for the perfect Cappadocia experience? Contact us on WhatsApp and we'll help you plan your trip.",
    contactWaLabel: "WHATSAPP", contactEmailLabel: "EMAIL", contactCta: "CHAT ON WHATSAPP",
    footerRights: "All Rights Reserved", footerCredit: "Photos: Wikimedia Commons & Flickr contributors (CC BY / CC BY-SA)",
    waFloatLabel: "Chat with us"
  },
  tr: {
    navHome: "Anasayfa", navTours: "Turlar", navActivities: "Aktiviteler", navExperiences: "Deneyimler",
    navWorkshops: "Atölyeler", navContact: "İletişim", navChatWa: "WhatsApp'tan Yazın", headerWa: "WhatsApp",
    heroEyebrow: "CAPGUIDE TRAVEL · KAPADOKYA", heroPlan: "DENEYİMİNİZİ PLANLAYIN", heroExplore: "TURLARI KEŞFEDİN",
    trust1Title: "YEREL DENEYİM", trust1Desc: "Otantik Kapadokya deneyimleri",
    trust2Title: "EN İYİ DENEYİMLER", trust2Desc: "Her gezgin için tur ve aktiviteler",
    trust3Title: "ÖZEL SEÇENEKLER", trust3Desc: "Esnek özel deneyimler",
    trust4Title: "WHATSAPP DESTEĞİ", trust4Desc: "Hızlı ve kolay iletişim",
    toursEyebrow: "HİZMETLERİMİZ", toursTitleTop: "KAPADOKYA'YI", toursTitleEm: "KEŞFEDİN",
    toursSub: "Kapadokya'nın en unutulmaz turlarını, maceralarını ve deneyimlerini keşfedin.",
    askWa: "WhatsApp'tan Sorun", flipHint: "Detayları görmek için kartın üzerine gelin — mobilde dokunun.",
    featuredEyebrow: "ÖNE ÇIKANLAR", featuredTitleTop: "UNUTULMAZ", featuredTitleEm: "ANLAR", featuredCta: "WhatsApp'tan Sorun →",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "KEŞFET.", aboutTitle2: "YAŞA.", aboutTitleEm: "HATIRLA.",
    aboutP1: "Kapadokya sadece ziyaret edilen bir yer değil — hissedilen bir yerdir. Vadilerin üzerinde gün doğumu, patikalarda toz, Avanos'ta bir atölyede elinizin altında sıcak toprak; gezip görmenin ötesine geçen günler tasarlıyoruz.",
    aboutP2: "Hayalinizi bize anlatın, gerisini biz şekillendirelim.", aboutCta: "WHATSAPP'TAN BİZE ULAŞIN",
    contactEyebrow: "İLETİŞİM", contactTitle1: "KAPADOKYA DENEYİMİNİZİ", contactTitleEm: "BİRLİKTE PLANLAYALIM",
    contactSub: "Bir sorunuz mu var ya da mükemmel bir Kapadokya deneyimi mi arıyorsunuz? WhatsApp'tan bize ulaşın, seyahatinizi birlikte planlayalım.",
    contactWaLabel: "WHATSAPP", contactEmailLabel: "E-POSTA", contactCta: "WHATSAPP'TAN YAZIN",
    footerRights: "Tüm Hakları Saklıdır", footerCredit: "Fotoğraflar: Wikimedia Commons ve Flickr katkıda bulunanları (CC BY / CC BY-SA)",
    waFloatLabel: "Bizimle sohbet edin"
  },
  de: {
    navHome: "Startseite", navTours: "Touren", navActivities: "Aktivitäten", navExperiences: "Erlebnisse",
    navWorkshops: "Workshops", navContact: "Kontakt", navChatWa: "Auf WhatsApp chatten", headerWa: "WhatsApp",
    heroEyebrow: "CAPGUIDE TRAVEL · KAPPADOKIEN", heroPlan: "IHR ERLEBNIS PLANEN", heroExplore: "TOUREN ENTDECKEN",
    trust1Title: "LOKALE ERFAHRUNG", trust1Desc: "Authentische Erlebnisse in Kappadokien",
    trust2Title: "BESTE ERLEBNISSE", trust2Desc: "Touren & Aktivitäten für jeden Reisenden",
    trust3Title: "PRIVATE OPTIONEN", trust3Desc: "Flexible private Erlebnisse",
    trust4Title: "WHATSAPP-SUPPORT", trust4Desc: "Schnelle & einfache Kommunikation",
    toursEyebrow: "UNSERE LEISTUNGEN", toursTitleTop: "KAPPADOKIEN", toursTitleEm: "ENTDECKEN",
    toursSub: "Entdecken Sie die unvergesslichsten Touren, Abenteuer und Erlebnisse in Kappadokien.",
    askWa: "Auf WhatsApp fragen", flipHint: "Fahren Sie über eine Karte für Details — auf dem Handy einfach antippen.",
    featuredEyebrow: "HIGHLIGHTS", featuredTitleTop: "UNVERGESSLICHE", featuredTitleEm: "MOMENTE", featuredCta: "Auf WhatsApp fragen →",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "ENTDECKEN.", aboutTitle2: "ERLEBEN.", aboutTitleEm: "ERINNERN.",
    aboutP1: "Kappadokien ist kein Ort, den man einfach besucht — man fühlt ihn. Wir gestalten Tage, die über Sightseeing hinausgehen: Sonnenaufgang über den Tälern, Staub auf den Pfaden, warmer Ton in Ihrer Hand in einer Werkstatt in Avanos.",
    aboutP2: "Erzählen Sie uns von Ihrem Traum, den Rest gestalten wir.", aboutCta: "SCHREIBEN SIE UNS AUF WHATSAPP",
    contactEyebrow: "KONTAKT", contactTitle1: "LASSEN SIE UNS IHR", contactTitleEm: "KAPPADOKIEN-ERLEBNIS PLANEN",
    contactSub: "Haben Sie eine Frage oder suchen Sie das perfekte Kappadokien-Erlebnis? Kontaktieren Sie uns auf WhatsApp — wir helfen Ihnen bei der Planung.",
    contactWaLabel: "WHATSAPP", contactEmailLabel: "E-MAIL", contactCta: "AUF WHATSAPP CHATTEN",
    footerRights: "Alle Rechte vorbehalten", footerCredit: "Fotos: Wikimedia Commons & Flickr-Mitwirkende (CC BY / CC BY-SA)",
    waFloatLabel: "Chatten Sie mit uns"
  },
  ru: {
    navHome: "Главная", navTours: "Туры", navActivities: "Активности", navExperiences: "Впечатления",
    navWorkshops: "Мастер-классы", navContact: "Контакты", navChatWa: "Написать в WhatsApp", headerWa: "WhatsApp",
    heroEyebrow: "CAPGUIDE TRAVEL · КАППАДОКИЯ", heroPlan: "СПЛАНИРОВАТЬ ПОЕЗДКУ", heroExplore: "СМОТРЕТЬ ТУРЫ",
    trust1Title: "МЕСТНЫЙ ОПЫТ", trust1Desc: "Аутентичные впечатления Каппадокии",
    trust2Title: "ЛУЧШИЕ ВПЕЧАТЛЕНИЯ", trust2Desc: "Туры и активности для каждого путешественника",
    trust3Title: "ПРИВАТНЫЕ ВАРИАНТЫ", trust3Desc: "Гибкие индивидуальные программы",
    trust4Title: "ПОДДЕРЖКА В WHATSAPP", trust4Desc: "Быстрая и удобная связь",
    toursEyebrow: "НАШИ УСЛУГИ", toursTitleTop: "ОТКРОЙТЕ", toursTitleEm: "КАППАДОКИЮ",
    toursSub: "Откройте для себя самые незабываемые туры, приключения и впечатления Каппадокии.",
    askWa: "Спросить в WhatsApp", flipHint: "Наведите на карточку, чтобы увидеть детали — на телефоне просто нажмите.",
    featuredEyebrow: "ГЛАВНОЕ", featuredTitleTop: "НЕЗАБЫВАЕМЫЕ", featuredTitleEm: "МОМЕНТЫ", featuredCta: "Спросить в WhatsApp →",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "ОТКРОЙТЕ.", aboutTitle2: "ПРОЖИВИТЕ.", aboutTitleEm: "ЗАПОМНИТЕ.",
    aboutP1: "Каппадокия — это не просто место, которое посещают, это место, которое чувствуют. Мы создаём дни, выходящие за рамки простых экскурсий: рассвет над долинами, пыль на тропах, тёплая глина в руках в мастерской Аваноса.",
    aboutP2: "Расскажите нам о своей мечте — остальное мы возьмём на себя.", aboutCta: "НАПИШИТЕ НАМ В WHATSAPP",
    contactEyebrow: "КОНТАКТЫ", contactTitle1: "ДАВАЙТЕ СПЛАНИРУЕМ ВАШЕ", contactTitleEm: "ПУТЕШЕСТВИЕ ПО КАППАДОКИИ",
    contactSub: "Есть вопрос или ищете идеальное впечатление от Каппадокии? Свяжитесь с нами в WhatsApp, и мы поможем спланировать поездку.",
    contactWaLabel: "WHATSAPP", contactEmailLabel: "ПОЧТА", contactCta: "НАПИСАТЬ В WHATSAPP",
    footerRights: "Все права защищены", footerCredit: "Фото: участники Wikimedia Commons и Flickr (CC BY / CC BY-SA)",
    waFloatLabel: "Написать нам"
  },
  ko: {
    navHome: "홈", navTours: "투어", navActivities: "액티비티", navExperiences: "체험",
    navWorkshops: "워크숍", navContact: "문의", navChatWa: "WhatsApp으로 문의", headerWa: "WhatsApp",
    heroEyebrow: "CAPGUIDE TRAVEL · 카파도키아", heroPlan: "여행 계획하기", heroExplore: "투어 둘러보기",
    trust1Title: "현지 전문성", trust1Desc: "진짜 카파도키아를 경험하세요",
    trust2Title: "최고의 체험", trust2Desc: "모든 여행자를 위한 투어 & 액티비티",
    trust3Title: "프라이빗 옵션", trust3Desc: "유연한 단독 프로그램",
    trust4Title: "WHATSAPP 지원", trust4Desc: "빠르고 간편한 소통",
    toursEyebrow: "제공 서비스", toursTitleTop: "카파도키아", toursTitleEm: "탐험하기",
    toursSub: "카파도키아의 가장 특별한 투어, 액티비티, 체험을 만나보세요.",
    askWa: "WhatsApp으로 문의", flipHint: "카드에 마우스를 올리면 상세 정보를 볼 수 있어요 — 모바일에서는 탭하세요.",
    featuredEyebrow: "하이라이트", featuredTitleTop: "잊지 못할", featuredTitleEm: "순간들", featuredCta: "WhatsApp으로 문의 →",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "발견하고.", aboutTitle2: "경험하고.", aboutTitleEm: "기억하세요.",
    aboutP1: "카파도키아는 그저 둘러보는 곳이 아니라 온몸으로 느끼는 곳입니다. 계곡 위로 떠오르는 일출, 트레일 위의 흙먼지, 아바노스 공방에서 손끝에 닿는 따뜻한 흙까지 — 단순한 관광을 넘어서는 하루를 만들어 드립니다.",
    aboutP2: "원하시는 여행을 말씀해주세요, 나머지는 저희가 준비하겠습니다.", aboutCta: "WHATSAPP으로 문의하기",
    contactEyebrow: "문의", contactTitle1: "당신만의", contactTitleEm: "카파도키아 여행을 계획해요",
    contactSub: "궁금한 점이 있거나 완벽한 카파도키아 경험을 찾고 계신가요? WhatsApp으로 연락 주시면 여행 계획을 도와드립니다.",
    contactWaLabel: "WHATSAPP", contactEmailLabel: "이메일", contactCta: "WHATSAPP으로 문의",
    footerRights: "모든 권리 보유", footerCredit: "사진: Wikimedia Commons & Flickr 기여자 (CC BY / CC BY-SA)",
    waFloatLabel: "지금 문의하기"
  },
  zh: {
    navHome: "首页", navTours: "游览", navActivities: "活动", navExperiences: "体验",
    navWorkshops: "工作坊", navContact: "联系我们", navChatWa: "WhatsApp 咨询", headerWa: "WhatsApp",
    heroEyebrow: "CAPGUIDE TRAVEL · 卡帕多奇亚", heroPlan: "规划您的行程", heroExplore: "探索游览项目",
    trust1Title: "本地专业经验", trust1Desc: "地道的卡帕多奇亚体验",
    trust2Title: "精选体验", trust2Desc: "适合每位旅行者的游览与活动",
    trust3Title: "私人定制", trust3Desc: "灵活的私人行程",
    trust4Title: "WHATSAPP 支持", trust4Desc: "快速便捷的沟通",
    toursEyebrow: "我们的服务", toursTitleTop: "探索", toursTitleEm: "卡帕多奇亚",
    toursSub: "发现卡帕多奇亚最难忘的游览、探险与体验项目。",
    askWa: "WhatsApp 咨询", flipHint: "将鼠标悬停在卡片上查看详情——手机上请点击。",
    featuredEyebrow: "精选推荐", featuredTitleTop: "难忘的", featuredTitleEm: "瞬间", featuredCta: "WhatsApp 咨询 →",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "探索。", aboutTitle2: "体验。", aboutTitleEm: "铭记。",
    aboutP1: "卡帕多奇亚不只是一个游览之地，更是一种感受。我们精心设计超越观光的行程：山谷之上的日出、小径上的尘土，以及在阿瓦诺斯工坊里手中温热的陶土。",
    aboutP2: "告诉我们您的梦想旅程，其余的交给我们。", aboutCta: "通过 WHATSAPP 联系我们",
    contactEyebrow: "联系我们", contactTitle1: "让我们一起规划您的", contactTitleEm: "卡帕多奇亚之旅",
    contactSub: "有任何问题，或正在寻找完美的卡帕多奇亚体验？通过 WhatsApp 联系我们，我们将帮您规划行程。",
    contactWaLabel: "WHATSAPP", contactEmailLabel: "邮箱", contactCta: "WHATSAPP 咨询",
    footerRights: "版权所有", footerCredit: "照片来源：Wikimedia Commons 和 Flickr 贡献者 (CC BY / CC BY-SA)",
    waFloatLabel: "与我们聊聊"
  },
  ar: {
    navHome: "الرئيسية", navTours: "الجولات", navActivities: "الأنشطة", navExperiences: "التجارب",
    navWorkshops: "ورش العمل", navContact: "تواصل معنا", navChatWa: "تواصل عبر واتساب", headerWa: "واتساب",
    heroEyebrow: "CAPGUIDE TRAVEL · كابادوكيا", heroPlan: "خطط لتجربتك", heroExplore: "استكشف الجولات",
    trust1Title: "خبرة محلية", trust1Desc: "تجارب أصيلة في كابادوكيا",
    trust2Title: "أفضل التجارب", trust2Desc: "جولات وأنشطة لكل مسافر",
    trust3Title: "خيارات خاصة", trust3Desc: "تجارب خاصة مرنة",
    trust4Title: "دعم عبر واتساب", trust4Desc: "تواصل سريع وسهل",
    toursEyebrow: "خدماتنا", toursTitleTop: "استكشف", toursTitleEm: "كابادوكيا",
    toursSub: "اكتشف أكثر الجولات والمغامرات والتجارب التي لا تُنسى في كابادوكيا.",
    askWa: "اسأل عبر واتساب", flipHint: "مرّر فوق البطاقة لرؤية التفاصيل — على الجوال اضغط عليها.",
    featuredEyebrow: "أبرز التجارب", featuredTitleTop: "لحظات", featuredTitleEm: "لا تُنسى", featuredCta: "اسأل عبر واتساب ←",
    aboutEyebrow: "CAPGUIDE TRAVEL", aboutTitle1: "اكتشف.", aboutTitle2: "عِش.", aboutTitleEm: "تذكّر.",
    aboutP1: "كابادوكيا ليست مكاناً تزوره فحسب، بل مكان تشعر به. نصمم أياماً تتجاوز مجرد التجول السياحي: شروق الشمس فوق الوديان، الغبار على الدروب، والطين الدافئ بين يديك في ورشة في أفانوس.",
    aboutP2: "أخبرنا بحلمك، وسنتكفّل بالباقي.", aboutCta: "تواصل معنا عبر واتساب",
    contactEyebrow: "تواصل معنا", contactTitle1: "دعنا نخطط", contactTitleEm: "تجربتك في كابادوكيا",
    contactSub: "لديك سؤال أو تبحث عن تجربة كابادوكيا المثالية؟ تواصل معنا عبر واتساب وسنساعدك في تخطيط رحلتك.",
    contactWaLabel: "واتساب", contactEmailLabel: "البريد الإلكتروني", contactCta: "تواصل عبر واتساب",
    footerRights: "جميع الحقوق محفوظة", footerCredit: "الصور: مساهمو Wikimedia Commons و Flickr (CC BY / CC BY-SA)",
    waFloatLabel: "تحدث معنا"
  }
};

export function t(lang, key) {
  return (UI[lang] && UI[lang][key]) ?? UI[DEFAULT_LANG][key] ?? key;
}
