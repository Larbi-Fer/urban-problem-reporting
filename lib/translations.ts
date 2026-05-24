export type Language = "ar" | "fr";

export interface Translations {
  dir: "rtl" | "ltr";
  nav: {
    home: string;
    features: string;
    faq: string;
    contact: string;
    getApp: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    cta: string;
    download: string;
  };
  download: {
    title: string;
    subtitle: string;
    android: string;
    ios: string;
    iosComingSoon: string;
    availableText: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  statistics: {
    title: string;
    subtitle: string;
    reports: string;
    resolved: string;
    activeUsers: string;
    cities: string;
  };
  whyUs: {
    title: string;
    subtitle: string;
    cards: { title: string; description: string }[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    headline: string;
    downloadApp: string;
    sendReport: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    copyright: string;
    home: string;
    features: string;
    faq: string;
    contact: string;
  };
}

export const translations: Record<Language, Translations> = {
  ar: {
    dir: "rtl",
    nav: {
      home: "الرئيسية",
      features: "المميزات",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
      getApp: "حمّل التطبيق",
    },
    hero: {
      headline: "ساهم في تحسين مدينتك",
      subtitle:
        "أبلغ عن مشاكل الطرق، الإنارة، النفايات والبنية التحتية بسهولة عبر تطبيق إنشغالاتي",
      cta: "ابدأ الآن",
      download: "تحميل التطبيق",
    },
    download: {
      title: "حمّل تطبيق إنشغالاتي",
      subtitle: "ابدأ بالإبلاغ عن المشاكل الحضرية في مدينتك",
      android: "تحميل من Google Play",
      ios: "تحميل من App Store",
      iosComingSoon: "قريباً",
      availableText: "متوفر حالياً على أندرويد",
    },
    timeline: {
      title: "كيف يعمل التطبيق؟",
      subtitle: "أربع خطوات بسيطة للمساهمة في تحسين مدينتك",
      steps: [
        {
          title: "التقاط صورة",
          description: "التقط صورة واضحة للمشكلة في مدينتك",
        },
        {
          title: "إرسال البلاغ",
          description: "أرسل البلاغ مع تحديد الموقع والوصف",
        },
        {
          title: "مراجعة البلاغ",
          description: "يتم مراجعة البلاغ والتحقق من صحته",
        },
        {
          title: "تحسين المدينة",
          description: "يتم معالجة المشكلة وتحسين المدينة",
        },
      ],
    },
    statistics: {
      title: "إنشغالاتي بالأرقام",
      subtitle: "أرقام تعكس تأثيرنا في تحسين المدن",
      reports: "بلاغ",
      resolved: "تم حلها",
      activeUsers: "مستخدم نشط",
      cities: "مدينة مدعومة",
    },
    whyUs: {
      title: "لماذا إنشغالاتي؟",
      subtitle: "منصة مصممة لتسهيل التواصل بين المواطن والبلدية",
      cards: [
        {
          title: "إبلاغ سريع",
          description: "أبلغ عن أي مشكلة حضرية في ثوانٍ معدودة",
        },
        {
          title: "مشاركة مجتمعية",
          description: "شارك في بناء مدينة أفضل مع مجتمعك",
        },
        {
          title: "مدن أذكى",
          description: "ساهم في جعل مدينتك أذكى وأكثر استجابة",
        },
        {
          title: "تواصل أفضل",
          description: "تواصل مباشر وفعّال مع الجهات المسؤولة",
        },
      ],
    },
    faq: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات على أكثر الأسئلة شيوعاً",
      items: [
        {
          question: "هل التطبيق مجاني؟",
          answer: "نعم، التطبيق مجاني تماماً ومتاح للجميع.",
        },
        {
          question: "كيف يتم التحقق من البلاغات؟",
          answer:
            "يتم مراجعة البلاغات باستخدام الموقع الجغرافي، الصور، والتحقق اليدوي من قبل فريقنا.",
        },
        {
          question: "هل يمكنني متابعة بلاغاتي؟",
          answer:
            "نعم، يمكن للمستخدمين متابعة حالة بلاغاتهم ومعرفة مراحل المعالجة.",
        },
        {
          question: "هل الموقع الجغرافي مطلوب؟",
          answer:
            "نعم، الموقع الجغرافي مطلوب للتحقق الميداني ومعالجة المشكلة بشكل دقيق.",
        },
        {
          question: "ما هي المدن المدعومة؟",
          answer: "حالياً التطبيق يدعم مدينة بشار، وسيتم التوسع لمدن أخرى قريباً.",
        },
      ],
    },
    cta: {
      headline: "ابدأ بالمساهمة في تحسين مدينتك اليوم",
      downloadApp: "تحميل التطبيق",
      sendReport: "إرسال بلاغ",
    },
    footer: {
      description:
        "منصة إنشغالاتي للإبلاغ عن المشاكل الحضرية وتحسين جودة الحياة في المدن الجزائرية.",
      quickLinks: "روابط سريعة",
      legal: "قانوني",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      copyright: "© 2025 إنشغالاتي. جميع الحقوق محفوظة.",
      home: "الرئيسية",
      features: "المميزات",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
    },
  },
  fr: {
    dir: "ltr",
    nav: {
      home: "Accueil",
      features: "Fonctionnalités",
      faq: "FAQ",
      contact: "Contact",
      getApp: "Télécharger",
    },
    hero: {
      headline: "Participez à l'amélioration de votre ville",
      subtitle:
        "Signalez facilement les problèmes urbains grâce à Inchighalati",
      cta: "Commencer",
      download: "Télécharger l'app",
    },
    download: {
      title: "Téléchargez Inchighalati",
      subtitle: "Commencez à signaler les problèmes urbains dans votre ville",
      android: "Télécharger sur Google Play",
      ios: "Télécharger sur App Store",
      iosComingSoon: "Bientôt disponible",
      availableText: "Disponible actuellement sur Android",
    },
    timeline: {
      title: "Comment ça marche ?",
      subtitle: "Quatre étapes simples pour améliorer votre ville",
      steps: [
        {
          title: "Prendre une photo",
          description: "Prenez une photo claire du problème dans votre ville",
        },
        {
          title: "Envoyer le signalement",
          description:
            "Envoyez le signalement avec la localisation et la description",
        },
        {
          title: "Vérification du problème",
          description: "Le signalement est examiné et vérifié par notre équipe",
        },
        {
          title: "Amélioration de la ville",
          description: "Le problème est traité et la ville est améliorée",
        },
      ],
    },
    statistics: {
      title: "Inchighalati en chiffres",
      subtitle: "Des chiffres qui reflètent notre impact sur les villes",
      reports: "Signalements",
      resolved: "Résolus",
      activeUsers: "Utilisateurs actifs",
      cities: "Ville supportée",
    },
    whyUs: {
      title: "Pourquoi Inchighalati ?",
      subtitle:
        "Une plateforme conçue pour faciliter la communication entre citoyens et municipalités",
      cards: [
        {
          title: "Signalement rapide",
          description:
            "Signalez tout problème urbain en quelques secondes",
        },
        {
          title: "Participation citoyenne",
          description:
            "Participez à la construction d'une ville meilleure avec votre communauté",
        },
        {
          title: "Ville intelligente",
          description:
            "Contribuez à rendre votre ville plus intelligente et réactive",
        },
        {
          title: "Communication efficace",
          description:
            "Communication directe et efficace avec les autorités responsables",
        },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      subtitle: "Réponses aux questions les plus courantes",
      items: [
        {
          question: "L'application est-elle gratuite ?",
          answer:
            "Oui, l'application est entièrement gratuite et accessible à tous.",
        },
        {
          question: "Comment les signalements sont-ils vérifiés ?",
          answer:
            "Les signalements sont examinés à l'aide de la géolocalisation, des images et d'une vérification manuelle par notre équipe.",
        },
        {
          question: "Puis-je suivre mes signalements ?",
          answer:
            "Oui, les utilisateurs peuvent suivre l'état de leurs signalements et connaître les étapes du traitement.",
        },
        {
          question: "La géolocalisation est-elle requise ?",
          answer:
            "Oui, la géolocalisation est nécessaire pour la vérification sur le terrain et le traitement précis du problème.",
        },
        {
          question: "Quelles villes sont supportées ?",
          answer:
            "Actuellement, l'application supporte la ville de Béchar, avec une expansion prévue vers d'autres villes prochainement.",
        },
      ],
    },
    cta: {
      headline: "Commencez à améliorer votre ville dès aujourd'hui",
      downloadApp: "Télécharger l'app",
      sendReport: "Envoyer un signalement",
    },
    footer: {
      description:
        "Plateforme Inchighalati pour signaler les problèmes urbains et améliorer la qualité de vie dans les villes algériennes.",
      quickLinks: "Liens rapides",
      legal: "Juridique",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      copyright: "© 2025 Inchighalati. Tous droits réservés.",
      home: "Accueil",
      features: "Fonctionnalités",
      faq: "FAQ",
      contact: "Contact",
    },
  },
};
