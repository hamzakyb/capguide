import fs from "node:fs";

const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8")
  .split("\n").reduce((a, l) => { const [k, ...v] = l.split("="); if (k) a[k.trim()] = v.join("=").trim(); return a; }, {});

const REST = env.SUPABASE_URL + "/rest/v1";
const HEADERS = {
  apikey: env.SUPABASE_SECRET_KEY,
  Authorization: "Bearer " + env.SUPABASE_SECRET_KEY,
  "Content-Type": "application/json"
};

const supabase = {
  from(table) {
    return {
      async select() {
        const res = await fetch(`${REST}/${table}?id=eq.1&select=data`, { headers: HEADERS });
        const rows = await res.json();
        return { data: rows[0], error: res.ok ? null : rows };
      },
      async upsert(row) {
        const res = await fetch(`${REST}/${table}`, {
          method: "POST",
          headers: { ...HEADERS, Prefer: "resolution=merge-duplicates" },
          body: JSON.stringify(row)
        });
        if (!res.ok) return { error: await res.text() };
        return { error: null };
      }
    };
  }
};

const TOUR_I18N = {
  "Cappadocia Red Tour": {
    id: "red-tour",
    tr: { name: "Kapadokya Kırmızı Tur", desc: "Kapadokya'nın ikonik vadilerini, peri bacalarını ve nefes kesen manzara noktalarını keşfedin." },
    de: { name: "Kappadokien Rote Tour", desc: "Entdecken Sie die ikonischen Täler, Feenkamine und atemberaubenden Aussichtspunkte Kappadokiens." },
    ru: { name: "Красный тур по Каппадокии", desc: "Откройте для себя знаковые долины, каменные грибы и захватывающие смотровые площадки Каппадокии." },
    ko: { name: "카파도키아 레드 투어", desc: "카파도키아의 상징적인 계곡, 요정 굴뚝, 그리고 숨막히는 전망 포인트를 만나보세요." },
    zh: { name: "卡帕多奇亚红线之旅", desc: "探索卡帕多奇亚标志性的山谷、精灵烟囱和令人惊叹的观景点。" },
    ar: { name: "جولة كابادوكيا الحمراء", desc: "اكتشف الوديان الأيقونية والمداخن الجنية ونقاط المشاهدة الخلابة في كابادوكيا." }
  },
  "Cappadocia Green Tour": {
    id: "green-tour",
    tr: { name: "Kapadokya Yeşil Tur", desc: "Bir günde yeraltı şehirleri, derin vadiler ve Kapadokya'nın vahşi güneyi." },
    de: { name: "Kappadokien Grüne Tour", desc: "Unterirdische Städte, tiefe Täler und der wilde Süden Kappadokiens an einem Tag." },
    ru: { name: "Зелёный тур по Каппадокии", desc: "Подземные города, глубокие долины и дикий юг Каппадокии за один день." },
    ko: { name: "카파도키아 그린 투어", desc: "지하 도시, 깊은 계곡, 그리고 카파도키아의 야생적인 남부를 하루 만에 경험하세요." },
    zh: { name: "卡帕多奇亚绿线之旅", desc: "一天之内探访地下城市、深邃山谷与卡帕多奇亚狂野的南部地区。" },
    ar: { name: "جولة كابادوكيا الخضراء", desc: "المدن تحت الأرض والوديان العميقة وجنوب كابادوكيا البري في يوم واحد." }
  },
  "Cappadocia Mix Tour": {
    id: "mix-tour",
    tr: { name: "Kapadokya Karma Tur", desc: "Kırmızı ve Yeşil turların en iyi noktaları tek bir unutulmaz günde birleşiyor." },
    de: { name: "Kappadokien Mix-Tour", desc: "Die besten Highlights der Roten und Grünen Route vereint in einem unvergesslichen Tag." },
    ru: { name: "Смешанный тур по Каппадокии", desc: "Лучшие моменты Красного и Зелёного маршрутов в один незабываемый день." },
    ko: { name: "카파도키아 믹스 투어", desc: "레드 투어와 그린 투어의 하이라이트를 하루에 모두 경험하는 특별한 여정." },
    zh: { name: "卡帕多奇亚混合之旅", desc: "将红线与绿线的精华景点融合于难忘的一天之中。" },
    ar: { name: "جولة كابادوكيا المختلطة", desc: "أفضل معالم المسارين الأحمر والأخضر في يوم واحد لا يُنسى." }
  },
  "Cappadocia Private Tours": {
    id: "private-tours",
    tr: { name: "Kapadokya Özel Turlar", desc: "Kendi rehberiniz, kendi aracınız, kendi temponuz. Tamamen esnek bir Kapadokya günü." },
    de: { name: "Kappadokien Privattouren", desc: "Ihr eigener Guide, Ihr eigenes Auto, Ihr eigenes Tempo. Ein völlig flexibler Tag in Kappadokien." },
    ru: { name: "Приватные туры по Каппадокии", desc: "Свой гид, своя машина, свой темп. Полностью гибкий день в Каппадокии." },
    ko: { name: "카파도키아 프라이빗 투어", desc: "나만의 가이드, 나만의 차량, 나만의 속도로 즐기는 완전히 자유로운 카파도키아 하루." },
    zh: { name: "卡帕多奇亚私人定制游", desc: "专属向导、专属座驾、专属节奏——完全自由灵活的卡帕多奇亚一日行程。" },
    ar: { name: "جولات كابادوكيا الخاصة", desc: "مرشدك الخاص وسيارتك الخاصة ووتيرتك الخاصة. يوم مرن بالكامل في كابادوكيا." }
  },
  "Cappadocia ATV & Quad Safari": {
    id: "atv-safari",
    tr: { name: "Kapadokya ATV & Quad Safari", desc: "Aşk Vadisi'nde ve Kapadokya'nın gizli patikalarındaki gün batımı tozunda sürün." },
    de: { name: "Kappadokien ATV & Quad Safari", desc: "Fahren Sie durch das Liebestal und den Sonnenuntergangsstaub der verborgenen Pfade Kappadokiens." },
    ru: { name: "Сафари на квадроциклах по Каппадокии", desc: "Прокатитесь по Долине Любви и пыльным закатным тропам скрытых маршрутов Каппадокии." },
    ko: { name: "카파도키아 ATV & 쿼드 사파리", desc: "러브밸리와 카파도키아 숨겨진 트레일의 노을빛 흙먼지를 가르며 달려보세요." },
    zh: { name: "卡帕多奇亚ATV沙滩车探险", desc: "穿越爱情谷，在卡帕多奇亚隐秘小径的夕阳尘土中驰骋。" },
    ar: { name: "سفاري ATV والكوادات في كابادوكيا", desc: "اركب عبر وادي الحب وغبار الغروب في المسارات الخفية بكابادوكيا." }
  },
  "Cappadocia Horse Tour": {
    id: "horse-tour",
    tr: { name: "Kapadokya At Turu", desc: "Kapadokya'nın eşsiz manzaralarında sürün — güzel atlar diyarında." },
    de: { name: "Kappadokien Pferdetour", desc: "Reiten Sie durch die einzigartigen Landschaften Kappadokiens — dem Land der schönen Pferde." },
    ru: { name: "Конный тур по Каппадокии", desc: "Прокатитесь верхом по уникальным пейзажам Каппадокии — земле прекрасных лошадей." },
    ko: { name: "카파도키아 승마 투어", desc: "아름다운 말들의 고향, 카파도키아의 독특한 풍경 속을 말을 타고 달려보세요." },
    zh: { name: "卡帕多奇亚骑马之旅", desc: "骑马穿越卡帕多奇亚独特的地貌——美丽骏马的故乡。" },
    ar: { name: "جولة الخيول في كابادوكيا", desc: "امتطِ صهوة الجواد عبر مناظر كابادوكيا الفريدة — أرض الخيول الجميلة." }
  },
  "Cappadocia Jeep Safari": {
    id: "jeep-safari",
    tr: { name: "Kapadokya Jeep Safari", desc: "Vadiler, bağlar ve panoramik manzara noktaları arasında açık havada 4x4 macerası." },
    de: { name: "Kappadokien Jeep-Safari", desc: "Ein Offroad-4x4-Abenteuer durch Täler, Weinberge und Panoramaaussichtspunkte." },
    ru: { name: "Джип-сафари по Каппадокии", desc: "Приключение на внедорожнике 4x4 через долины, виноградники и панорамные смотровые площадки." },
    ko: { name: "카파도키아 지프 사파리", desc: "계곡과 포도밭, 파노라마 전망대를 가로지르는 오픈 에어 4x4 어드벤처." },
    zh: { name: "卡帕多奇亚吉普车探险", desc: "驾驶敞篷四驱吉普穿越山谷、葡萄园与全景观景点的户外冒险。" },
    ar: { name: "سفاري الجيب في كابادوكيا", desc: "مغامرة بسيارة دفع رباعي مكشوفة عبر الوديان والكروم ونقاط المشاهدة البانورامية." }
  },
  "Cappadocia Classic Car Tour": {
    id: "classic-car-tour",
    tr: { name: "Kapadokya Klasik Araba Turu", desc: "Peri bacaları arasında klasik bir üstü açık arabayla gezin — tam bir sinema nostaljisi." },
    de: { name: "Kappadokien Oldtimer-Tour", desc: "Cruisen Sie zwischen den Feenkaminen in einem Vintage-Cabrio — pure filmreife Nostalgie." },
    ru: { name: "Тур на классическом авто по Каппадокии", desc: "Прокатитесь среди каменных грибов на винтажном кабриолете — настоящая киношная ностальгия." },
    ko: { name: "카파도키아 클래식 카 투어", desc: "빈티지 오픈카를 타고 요정 굴뚝 사이를 달리는, 영화 같은 향수를 자아내는 드라이브." },
    zh: { name: "卡帕多奇亚经典老爷车之旅", desc: "驾驶复古敞篷车穿梭于精灵烟囱之间——纯粹的怀旧电影感体验。" },
    ar: { name: "جولة السيارات الكلاسيكية في كابادوكيا", desc: "تجوّل بين المداخن الجنية بسيارة كلاسيكية مكشوفة — حنين سينمائي خالص." }
  },
  "Cappadocia Trike Bike Tours": {
    id: "trike-tours",
    tr: { name: "Kapadokya Trike Bisiklet Turları", desc: "Kapadokya'nın en manzaralı yollarını keşfederken üç tekerlek üzerinde rüzgarı hissedin." },
    de: { name: "Kappadokien Trike-Touren", desc: "Spüren Sie den Wind auf drei Rädern, während Sie die malerischsten Straßen Kappadokiens erkunden." },
    ru: { name: "Тур на трайках по Каппадокии", desc: "Почувствуйте ветер на трёх колёсах, исследуя самые живописные дороги Каппадокии." },
    ko: { name: "카파도키아 트라이크 바이크 투어", desc: "세 바퀴 위에서 바람을 느끼며 카파도키아 최고의 절경 도로를 달려보세요." },
    zh: { name: "卡帕多奇亚三轮摩托之旅", desc: "骑上三轮摩托车，迎风探索卡帕多奇亚最美的风景道路。" },
    ar: { name: "جولات الدراجات ثلاثية العجلات في كابادوكيا", desc: "اشعر بالرياح على ثلاث عجلات أثناء استكشاف أجمل طرق كابادوكيا." }
  },
  "Cappadocia Camel Tour": {
    id: "camel-tour",
    tr: { name: "Kapadokya Deve Turu", desc: "Peri bacaları arasında sakin, zamansız bir sürüş — gün batımı fotoğrafları için mükemmel." },
    de: { name: "Kappadokien Kamelritt", desc: "Ein ruhiger, zeitloser Ritt zwischen den Feenkaminen — perfekt für Sonnenuntergangsfotos." },
    ru: { name: "Тур на верблюдах по Каппадокии", desc: "Спокойная, вне времени прогулка среди каменных грибов — идеально для закатных фото." },
    ko: { name: "카파도키아 낙타 투어", desc: "요정 굴뚝 사이를 여유롭게 거니는 시간을 초월한 승차감 — 노을 사진 촬영에 완벽합니다." },
    zh: { name: "卡帕多奇亚骑骆驼之旅", desc: "在精灵烟囱间悠然漫步——拍摄日落美照的绝佳选择。" },
    ar: { name: "جولة الجمال في كابادوكيا", desc: "ركوب هادئ خالد بين المداخن الجنية — مثالي لصور الغروب." }
  },
  "Cappadocia Microlight Flight": {
    id: "microlight-flight",
    tr: { name: "Kapadokya Mikrolight Uçuşu", desc: "Vadilerin üzerinde alçaktan ve özgürce uçun — çok az gezginin gördüğü bir manzara." },
    de: { name: "Kappadokien Ultraleichtflug", desc: "Fliegen Sie niedrig und frei über die Täler — ein Ausblick, den nur wenige Reisende je sehen." },
    ru: { name: "Полёт на мотодельтаплане в Каппадокии", desc: "Летите низко и свободно над долинами — вид, который видят немногие путешественники." },
    ko: { name: "카파도키아 초경량 비행", desc: "계곡 위를 낮고 자유롭게 비행하며, 소수의 여행자만이 볼 수 있는 풍경을 만나보세요." },
    zh: { name: "卡帕多奇亚轻型飞机飞行", desc: "低空自由飞越山谷，欣赏只有少数旅行者才能见到的绝美景色。" },
    ar: { name: "رحلة الطيران الخفيف في كابادوكيا", desc: "حلّق منخفضاً وبحرية فوق الوديان لمشاهدة منظر لا يراه سوى قلة من المسافرين." }
  },
  "Cappadocia Ski Tour": {
    id: "ski-tour",
    tr: { name: "Kapadokya Kayak Turu", desc: "Peri bacalarının üzerinde kar ve Erciyes Dağı'nın pistlerinde bir gün." },
    de: { name: "Kappadokien Ski-Tour", desc: "Schnee über den Feenkaminen und ein Tag an den Hängen des Erciyes-Bergs." },
    ru: { name: "Лыжный тур по Каппадокии", desc: "Снег над каменными грибами и день на склонах горы Эрджиес." },
    ko: { name: "카파도키아 스키 투어", desc: "요정 굴뚝 위에 내린 눈과 에르지예스 산 슬로프에서 보내는 하루." },
    zh: { name: "卡帕多奇亚滑雪之旅", desc: "雪落精灵烟囱之上，在埃尔吉耶斯山滑雪场度过精彩一天。" },
    ar: { name: "جولة التزلج في كابادوكيا", desc: "الثلوج فوق المداخن الجنية ويوم على منحدرات جبل أرجييس." }
  },
  "Cappadocia Airport Transfer": {
    id: "airport-transfer",
    tr: { name: "Kapadokya Havalimanı Transferi", desc: "Kayseri ve Nevşehir havalimanlarından otelinize konforlu özel transferler." },
    de: { name: "Kappadokien Flughafentransfer", desc: "Komfortable private Transfers von den Flughäfen Kayseri und Nevşehir zu Ihrem Hotel." },
    ru: { name: "Трансфер из аэропорта в Каппадокии", desc: "Комфортный частный трансфер из аэропортов Кайсери и Невшехир до вашего отеля." },
    ko: { name: "카파도키아 공항 전송", desc: "카이세리 및 네브셰히르 공항에서 호텔까지 편안한 프라이빗 전송 서비스를 제공합니다." },
    zh: { name: "卡帕多奇亚机场接送", desc: "从开塞利和内夫谢希尔机场舒适私人接送至您的酒店。" },
    ar: { name: "نقل مطار كابادوكيا", desc: "نقل خاص مريح من مطاري قيصري ونوشهير إلى فندقك." }
  },
  "Cappadocia Rent a Car": {
    id: "rent-a-car",
    tr: { name: "Kapadokya Araç Kiralama", desc: "Temiz ve güvenilir bir kiralık araçla Kapadokya'yı kendi programınızda keşfedin." },
    de: { name: "Kappadokien Mietwagen", desc: "Erkunden Sie Kappadokien nach Ihrem eigenen Zeitplan mit einem sauberen, zuverlässigen Mietwagen." },
    ru: { name: "Аренда авто в Каппадокии", desc: "Исследуйте Каппадокию по своему графику на чистом и надёжном арендованном автомобиле." },
    ko: { name: "카파도키아 렌터카", desc: "깨끗하고 믿을 수 있는 렌터카로 나만의 일정에 맞춰 카파도키아를 탐험하세요." },
    zh: { name: "卡帕多奇亚租车服务", desc: "驾驶整洁可靠的租赁车辆，按照自己的节奏自由探索卡帕多奇亚。" },
    ar: { name: "تأجير السيارات في كابادوكيا", desc: "استكشف كابادوكيا وفق جدولك الخاص بسيارة إيجار نظيفة وموثوقة." }
  },
  "Cappadocia Rent a Scooter": {
    id: "rent-a-scooter",
    tr: { name: "Kapadokya Scooter Kiralama", desc: "Vadiler ve köyler arasında ulaşımın en kolay ve en eğlenceli yolu." },
    de: { name: "Kappadokien Roller mieten", desc: "Die einfachste und unterhaltsamste Art, sich zwischen den Tälern und Dörfern zu bewegen." },
    ru: { name: "Аренда скутера в Каппадокии", desc: "Самый простой и весёлый способ передвижения между долинами и деревнями." },
    ko: { name: "카파도키아 스쿠터 대여", desc: "계곡과 마을 사이를 이동하는 가장 쉽고 재미있는 방법." },
    zh: { name: "卡帕多奇亚租摩托车", desc: "穿梭于山谷与村庄之间最轻松有趣的出行方式。" },
    ar: { name: "تأجير الدراجات النارية في كابادوكيا", desc: "أسهل وأمتع طريقة للتنقل بين الوديان والقرى." }
  },
  "Cappadocia Wine Taste": {
    id: "wine-taste",
    tr: { name: "Kapadokya Şarap Tadımı", desc: "Dünyanın en eski şarap bölgelerinden birinde kadim volkanik topraklı şarapları tadın." },
    de: { name: "Kappadokien Weinverkostung", desc: "Probieren Sie Weine aus uraltem vulkanischem Boden in einer der ältesten Weinregionen der Welt." },
    ru: { name: "Дегустация вин в Каппадокии", desc: "Попробуйте вина с древней вулканической почвы в одном из старейших винных регионов мира." },
    ko: { name: "카파도키아 와인 시음", desc: "세계에서 가장 오래된 와인 산지 중 한 곳에서 고대 화산 토양이 빚어낸 와인을 맛보세요." },
    zh: { name: "卡帕多奇亚品酒之旅", desc: "在世界最古老的葡萄酒产区之一，品尝源自古老火山土壤的美酒。" },
    ar: { name: "تذوق النبيذ في كابادوكيا", desc: "تذوق نبيذاً من تربة بركانية عريقة في واحدة من أقدم مناطق النبيذ في العالم." }
  },
  "Cappadocia Turkish Night": {
    id: "turkish-night",
    tr: { name: "Kapadokya Türk Gecesi", desc: "Canlı müzik, halk dansları ve bir mağara restoranında sıcak bir Anadolu akşamı." },
    de: { name: "Kappadokien Türkischer Abend", desc: "Live-Musik, Volkstänze und ein warmer anatolischer Abend in einem Höhlenrestaurant." },
    ru: { name: "Турецкий вечер в Каппадокии", desc: "Живая музыка, народные танцы и тёплый анатолийский вечер в пещерном ресторане." },
    ko: { name: "카파도키아 터키시 나이트", desc: "동굴 레스토랑에서 즐기는 라이브 음악과 민속춤, 그리고 따뜻한 아나톨리아의 밤." },
    zh: { name: "卡帕多奇亚土耳其之夜", desc: "在洞穴餐厅中，享受现场音乐、民族舞蹈与温馨的安纳托利亚夜晚。" },
    ar: { name: "الليلة التركية في كابادوكيا", desc: "موسيقى حية ورقصات فلكلورية وأمسية أناضولية دافئة في مطعم كهفي." }
  },
  "Cappadocia Dervish Show": {
    id: "dervish-show",
    tr: { name: "Kapadokya Semazen Gösterisi", desc: "Büyüleyici sema ayini — yüzyıllardır süren manevi bir gelenek." },
    de: { name: "Kappadokien Derwisch-Show", desc: "Die faszinierende Zeremonie der Wirbelnden Derwische — eine jahrhundertealte spirituelle Tradition." },
    ru: { name: "Шоу дервишей в Каппадокии", desc: "Завораживающая церемония кружения — духовная традиция многовековой давности." },
    ko: { name: "카파도키아 데르비시 쇼", desc: "수 세기를 이어온 영적 전통, 매혹적인 회전 의식을 만나보세요." },
    zh: { name: "卡帕多奇亚旋转苦行僧表演", desc: "令人着迷的旋转仪式——延续数百年的灵性传统。" },
    ar: { name: "عرض الدراويش في كابادوكيا", desc: "حفل الدوران الآسر — تقليد روحي يعود لقرون." }
  },
  "Cappadocia Hot Air Balloon Tour": {
    id: "balloon-tour",
    tr: { name: "Kapadokya Sıcak Hava Balonu Turu", desc: "Kapadokya'nın en ikonik deneyimi — vadilerin ve peri bacalarının üzerinde gün doğumu." },
    de: { name: "Kappadokien Heißluftballon-Tour", desc: "Das ikonischste Erlebnis Kappadokiens — Sonnenaufgang über den Tälern und Kaminen." },
    ru: { name: "Полёт на воздушном шаре в Каппадокии", desc: "Самое знаковое впечатление Каппадокии — рассвет над долинами и каменными грибами." },
    ko: { name: "카파도키아 열기구 투어", desc: "카파도키아를 대표하는 최고의 경험 — 계곡과 굴뚝 위로 떠오르는 일출." },
    zh: { name: "卡帕多奇亚热气球之旅", desc: "卡帕多奇亚最具代表性的体验——在山谷与烟囱之上迎接日出。" },
    ar: { name: "جولة المنطاد في كابادوكيا", desc: "التجربة الأكثر شهرة في كابادوكيا — شروق الشمس فوق الوديان والمداخن." }
  },
  "Cappadocia Photoshooting": {
    id: "photoshooting",
    tr: { name: "Kapadokya Fotoğraf Çekimi", desc: "Kıyafetler, balonlar ve mükemmel ışıkla profesyonel bir fotoğraf çekimi." },
    de: { name: "Kappadokien Fotoshooting", desc: "Ein professionelles Fotoshooting mit Kleidern, Ballons und perfektem Licht." },
    ru: { name: "Фотосессия в Каппадокии", desc: "Профессиональная фотосессия с нарядами, воздушными шарами и идеальным светом." },
    ko: { name: "카파도키아 포토슈팅", desc: "드레스와 열기구, 완벽한 조명이 어우러진 전문 사진 촬영." },
    zh: { name: "卡帕多奇亚专业摄影", desc: "身着华服、热气球相伴、光线完美的专业摄影体验。" },
    ar: { name: "جلسة تصوير في كابادوكيا", desc: "جلسة تصوير احترافية بالفساتين والمناطيد والإضاءة المثالية." }
  },
  "Cappadocia Turkish Bath": {
    id: "turkish-bath",
    tr: { name: "Kapadokya Türk Hamamı", desc: "Uzun bir macera gününün ardından geleneksel bir hamamda rahatlayın ve kendinizi yenileyin." },
    de: { name: "Kappadokien Türkisches Bad", desc: "Entspannen Sie sich nach einem langen Abenteuertag in einem traditionellen Hammam." },
    ru: { name: "Турецкая баня в Каппадокии", desc: "Расслабьтесь и восстановите силы в традиционном хамаме после насыщенного дня приключений." },
    ko: { name: "카파도키아 터키식 목욕", desc: "모험 가득한 하루를 보낸 후 전통 하맘에서 휴식하며 재충전하세요." },
    zh: { name: "卡帕多奇亚土耳其浴", desc: "在充实的探险之后，于传统土耳其浴室中放松身心、恢复活力。" },
    ar: { name: "الحمام التركي في كابادوكيا", desc: "استرخِ وجدد نشاطك في حمام تقليدي بعد يوم طويل من المغامرة." }
  },
  "Cappadocia Pottery Workshop": {
    id: "pottery-workshop",
    tr: { name: "Kapadokya Çömlek Atölyesi", desc: "Avanos çamurunun ustasıyla kendi Kapadokya başyapıtınızı yaratın." },
    de: { name: "Kappadokien Töpferworkshop", desc: "Erschaffen Sie Ihr eigenes kappadokisches Meisterwerk mit einem Meister des Avanos-Tons." },
    ru: { name: "Гончарная мастерская в Каппадокии", desc: "Создайте свой каппадокийский шедевр вместе с мастером аванской глины." },
    ko: { name: "카파도키아 도자기 워크숍", desc: "아바노스 점토 장인과 함께 나만의 카파도키아 걸작을 만들어보세요." },
    zh: { name: "卡帕多奇亚陶艺工作坊", desc: "跟随阿瓦诺斯制陶大师，亲手创作属于您的卡帕多奇亚杰作。" },
    ar: { name: "ورشة الفخار في كابادوكيا", desc: "اصنع تحفتك الكابادوكية الخاصة مع أحد أساتذة طين أفانوس." }
  },
  "Cappadocia Mozaic Lamp Workshop": {
    id: "mosaic-workshop",
    tr: { name: "Kapadokya Mozaik Lamba Atölyesi", desc: "Kendi el yapımı Türk mozaik lambanızı tasarlayın ve evinize götürün." },
    de: { name: "Kappadokien Mosaiklampen-Workshop", desc: "Gestalten Sie Ihre eigene handgefertigte türkische Mosaiklampe und nehmen Sie sie mit nach Hause." },
    ru: { name: "Мастер-класс по мозаичным лампам в Каппадокии", desc: "Создайте и заберите домой собственную сделанную вручную турецкую мозаичную лампу." },
    ko: { name: "카파도키아 모자이크 램프 워크숍", desc: "나만의 핸드메이드 터키 모자이크 램프를 직접 디자인하고 집으로 가져가세요." },
    zh: { name: "卡帕多奇亚马赛克灯工作坊", desc: "亲手设计并带走属于您的土耳其手工马赛克灯。" },
    ar: { name: "ورشة مصابيح الموزاييك في كابادوكيا", desc: "صمم مصباح الموزاييك التركي اليدوي الخاص بك واصطحبه معك إلى المنزل." }
  }
};

const FEATURED_I18N = {
  "HOT AIR BALLOON": {
    tr: { title: "SICAK HAVA BALONU", sub: "Kapadokya'nın en ikonik deneyimi" },
    de: { title: "HEISSLUFTBALLON", sub: "Das ikonischste Erlebnis Kappadokiens" },
    ru: { title: "ВОЗДУШНЫЙ ШАР", sub: "Самое знаковое впечатление Каппадокии" },
    ko: { title: "열기구", sub: "카파도키아를 대표하는 최고의 경험" },
    zh: { title: "热气球", sub: "卡帕多奇亚最具代表性的体验" },
    ar: { title: "منطاد الهواء الساخن", sub: "التجربة الأكثر شهرة في كابادوكيا" }
  },
  "ATV SAFARI": {
    tr: { title: "ATV SAFARİ", sub: "Vadiler arasında macera" },
    de: { title: "ATV-SAFARI", sub: "Abenteuer durch die Täler" },
    ru: { title: "АТВ-САФАРИ", sub: "Приключение через долины" },
    ko: { title: "ATV 사파리", sub: "계곡을 가로지르는 모험" },
    zh: { title: "ATV 探险", sub: "穿越山谷的冒险" },
    ar: { title: "سفاري ATV", sub: "مغامرة عبر الوديان" }
  },
  "HORSE TOUR": {
    tr: { title: "AT TURU", sub: "Kapadokya'nın eşsiz manzaralarında sürün" },
    de: { title: "PFERDETOUR", sub: "Reiten Sie durch die einzigartigen Landschaften Kappadokiens" },
    ru: { title: "КОННЫЙ ТУР", sub: "Прокатитесь по уникальным пейзажам Каппадокии" },
    ko: { title: "승마 투어", sub: "카파도키아의 독특한 풍경 속을 달리다" },
    zh: { title: "骑马之旅", sub: "骑马穿越卡帕多奇亚独特地貌" },
    ar: { title: "جولة الخيول", sub: "امتطِ صهوة الجواد عبر مناظر كابادوكيا الفريدة" }
  },
  "POTTERY WORKSHOP": {
    tr: { title: "ÇÖMLEK ATÖLYESİ", sub: "Kendi Kapadokya başyapıtınızı yaratın" },
    de: { title: "TÖPFERWORKSHOP", sub: "Erschaffen Sie Ihr eigenes kappadokisches Meisterwerk" },
    ru: { title: "ГОНЧАРНАЯ МАСТЕРСКАЯ", sub: "Создайте свой каппадокийский шедевр" },
    ko: { title: "도자기 워크숍", sub: "나만의 카파도키아 걸작을 만들어보세요" },
    zh: { title: "陶艺工作坊", sub: "亲手创作您的卡帕多奇亚杰作" },
    ar: { title: "ورشة الفخار", sub: "اصنع تحفتك الكابادوكية الخاصة" }
  }
};

const SETTINGS_I18N = {
  tr: { heroTitleTop: "KEŞFET", heroTitleBottom: "KAPADOKYA", heroSub: "Turlar • Maceralar • Deneyimler", defaultMsg: "Merhaba, Kapadokya turlarınız ve aktiviteleriniz hakkında bilgi almak istiyorum.", seoTitle: "Capguide Travel — Kapadokya'yı Keşfedin", seoDescription: "Capguide Travel — Kapadokya'da turlar, maceralar, deneyimler ve atölyeler. Deneyiminizi WhatsApp'tan planlayın." },
  de: { heroTitleTop: "ENTDECKEN", heroTitleBottom: "KAPPADOKIEN", heroSub: "Touren • Abenteuer • Erlebnisse", defaultMsg: "Hallo, ich möchte gerne Informationen zu Ihren Kappadokien-Touren und Aktivitäten erhalten.", seoTitle: "Capguide Travel — Kappadokien entdecken", seoDescription: "Capguide Travel — Touren, Abenteuer, Erlebnisse und Workshops in Kappadokien. Planen Sie Ihr Erlebnis über WhatsApp." },
  ru: { heroTitleTop: "ОТКРОЙТЕ", heroTitleBottom: "КАППАДОКИЮ", heroSub: "Туры • Приключения • Впечатления", defaultMsg: "Здравствуйте, хочу узнать подробнее о ваших турах и активностях в Каппадокии.", seoTitle: "Capguide Travel — Откройте Каппадокию", seoDescription: "Capguide Travel — туры, приключения, впечатления и мастер-классы в Каппадокии. Спланируйте поездку через WhatsApp." },
  ko: { heroTitleTop: "발견하다", heroTitleBottom: "카파도키아", heroSub: "투어 • 액티비티 • 체험", defaultMsg: "안녕하세요, 카파도키아 투어 및 액티비티에 대한 정보를 알고 싶습니다.", seoTitle: "Capguide Travel — 카파도키아를 발견하세요", seoDescription: "Capguide Travel — 카파도키아의 투어, 액티비티, 체험, 워크숍. WhatsApp으로 여행을 계획하세요." },
  zh: { heroTitleTop: "探索", heroTitleBottom: "卡帕多奇亚", heroSub: "游览 • 探险 • 体验", defaultMsg: "您好，我想了解一下贵公司的卡帕多奇亚游览与活动项目。", seoTitle: "Capguide Travel — 探索卡帕多奇亚", seoDescription: "Capguide Travel — 卡帕多奇亚的游览、探险、体验与工作坊。通过 WhatsApp 规划您的行程。" },
  ar: { heroTitleTop: "اكتشف", heroTitleBottom: "كابادوكيا", heroSub: "جولات • مغامرات • تجارب", defaultMsg: "مرحباً، أود الحصول على معلومات حول جولاتكم وأنشطتكم في كابادوكيا.", seoTitle: "Capguide Travel — اكتشف كابادوكيا", seoDescription: "Capguide Travel — جولات ومغامرات وتجارب وورش عمل في كابادوكيا. خطط لتجربتك عبر واتساب." }
};

const LANGS = ["tr", "de", "ru", "ko", "zh", "ar"];

function waTemplate(lang, name) {
  const t = {
    en: (n) => `Hello, I would like to get information about ${n}.`,
    tr: (n) => `Merhaba, ${n} hakkında bilgi almak istiyorum.`,
    de: (n) => `Hallo, ich möchte gerne Informationen zu ${n} erhalten.`,
    ru: (n) => `Здравствуйте, хочу узнать подробнее о туре «${n}».`,
    ko: (n) => `안녕하세요, ${n}에 대한 정보를 알고 싶습니다.`,
    zh: (n) => `您好，我想了解一下「${n}」的详情。`,
    ar: (n) => `مرحباً، أود الحصول على معلومات حول ${n}.`
  };
  return t[lang](name);
}

async function run() {
  const { data, error } = await supabase.from("content").select();
  if (error) throw new Error(JSON.stringify(error));
  const old = data.data;

  const newTours = old.tours.map((t) => {
    const tr = TOUR_I18N[t.name];
    if (!tr) throw new Error("Missing translation for: " + t.name);
    const i18n = { en: { name: t.name, desc: t.desc, wa: t.wa } };
    for (const lang of LANGS) {
      i18n[lang] = { name: tr[lang].name, desc: tr[lang].desc, wa: waTemplate(lang, tr[lang].name) };
    }
    return { id: tr.id, cat: t.cat, badge: t.badge || "", price: t.price || "", time: t.time || "", img: t.img, i18n };
  });

  const newFeatured = old.featured.map((f) => {
    const tourMatch = old.tours.find((t) => t.name === f.name);
    const trTour = tourMatch ? TOUR_I18N[tourMatch.name] : null;
    const trFeat = FEATURED_I18N[f.title];
    if (!trFeat) throw new Error("Missing featured translation for: " + f.title);
    const i18n = { en: { title: f.title, sub: f.sub } };
    for (const lang of LANGS) {
      i18n[lang] = { title: trFeat[lang].title, sub: trFeat[lang].sub };
    }
    return { tourId: trTour ? trTour.id : null, img: f.img, i18n };
  });

  const settingsI18n = { en: {
    heroTitleTop: old.settings.heroTitleTop, heroTitleBottom: old.settings.heroTitleBottom,
    heroSub: old.settings.heroSub, defaultMsg: old.settings.defaultMsg,
    seoTitle: old.settings.seoTitle, seoDescription: old.settings.seoDescription
  } };
  for (const lang of LANGS) settingsI18n[lang] = SETTINGS_I18N[lang];

  const newSettings = {
    whatsapp: old.settings.whatsapp, email: old.settings.email,
    heroImg: old.settings.heroImg, aboutImg: old.settings.aboutImg,
    logoImg: old.settings.logoImg, faviconImg: old.settings.faviconImg,
    i18n: settingsI18n
  };

  const newData = { settings: newSettings, tours: newTours, featured: newFeatured };

  const { error: writeErr } = await supabase.from("content").upsert({ id: 1, data: newData, updated_at: new Date().toISOString() });
  if (writeErr) throw writeErr;

  console.log("Migration complete.");
  console.log("Tours:", newTours.length, "Featured:", newFeatured.length);
}

run().catch((e) => { console.error(e); process.exit(1); });
