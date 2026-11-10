import React, { useState, useEffect } from 'react';
import {
  Scale,
  Shield,
  FileText,
  Users,
  Search,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  BookOpen,
  HeartHandshake,
  Building2,
  FileCheck,
  Send,
  FolderLock,
  DollarSign,
  MessageCircle,
  UserCheck,
  Briefcase,
  Award,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

interface LegalAidRequest {
  id: string;
  fullName: string;
  phone: string;
  governorate: string;
  category: string;
  urgency: 'عاجل جداً' | 'متوسط' | 'اعتيادي';
  details: string;
  status: 'قيد المراجعة الأولية' | 'تم تكليف محامٍ مختص' | 'بانتظار الوثائق' | 'تم تقديم المشورة';
  lawyerName?: string;
  createdAt: string;
}

interface ProgramFund {
  id: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  targetBudget: number;
  raisedBudget: number;
  beneficiariesCount: number;
  descriptionAr: string;
  descriptionEn: string;
  indicators: string[];
  imageUrl: string;
}

interface LegalGuide {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  pages: number;
  summaryAr: string;
  summaryEn: string;
  fileSize: string;
}

const PALESTINIAN_GOVERNORATES = [
  'القدس الشريف',
  'رام الله والبيرة',
  'الخليل',
  'نابلس',
  'جنين',
  'طولكرم',
  'قلقيلية',
  'بيت لحم',
  'أريحا والأغوار',
  'سلفيت',
  'طوباس والأغوار الشمالية',
  'قطاع غزة (شمال ومدينة غزة)',
  'قطاع غزة (الوسطى والجنوب)',
  'مخيمات وتجمعات الشتات'
];

const LEGAL_CATEGORIES = [
  { id: 'land', labelAr: 'قضايا الأراضي والملكية ومقاومة إخطارات الهدم', labelEn: 'Land Rights, Property & Demolition Defense' },
  { id: 'family', labelAr: 'قضايا الأسرة وحماية المرأة والطفل والنفقة', labelEn: 'Family Law, Women & Child Protection' },
  { id: 'labor', labelAr: 'قضايا العمال والنزاعات العمالية والتعويضات', labelEn: 'Labor Rights & Workplace Disputes' },
  { id: 'defense', labelAr: 'ضمانات المحاكمة العادلة وحالات التوقيف والاحتجاز', labelEn: 'Fair Trial Guarantees & Indigent Defense' },
  { id: 'civil', labelAr: 'الاستشارات المدنية وصياغة العقود وتوثيق الحقوق', labelEn: 'Civil Consultations & Legal Documentation' },
  { id: 'human_rights', labelAr: 'توثيق انتهاكات حقوق الإنسان والمناصرة الدولية', labelEn: 'Human Rights Documentation & Advocacy' }
];

const FUNDABLE_PROGRAMS: ProgramFund[] = [
  {
    id: 'mobile-clinics',
    titleAr: 'مشروع العيادات القانونية المتنقلة للمناطق المهمشة',
    titleEn: 'Mobile Legal Clinics for Marginalized Communities',
    taglineAr: 'الوصول الميداني المباشر إلى 45 قرية نائية ومخيماً',
    taglineEn: 'Direct on-the-ground legal outreach to 45 remote villages & camps',
    targetBudget: 85000,
    raisedBudget: 58000,
    beneficiariesCount: 2400,
    descriptionAr: 'تسيير طواقم محامين ومستشارين ميدانيين لتقديم الاستشارات الفورية، وعقد جلسات التوعية الحقوقية في المناطق المصنفة الأكثر تهميشاً وصعوبة وصول في الضفة الغربية والقدس وغزة.',
    descriptionEn: 'Deploying specialized legal mobile units and grassroots lawyers to provide free counseling and rights literacy sessions in underserved communities.',
    indicators: ['45 جولة ميدانية سنوياً', '2,400 مستفيد مباشر', 'استشارات أراضي وتثبيت ملكية'],
    imageUrl: '/images/mobile_legal_clinic_rural_179422590146.jpg'
  },
  {
    id: 'indigent-defense',
    titleAr: 'صندوق الدفاع القضائي المجاني للفئات الأكثر احتياجاً',
    titleEn: 'Indigent Legal Defense & Justice Access Fund',
    taglineAr: 'تمثيل قانوني قضائي كامل أمام المحاكم للأسر المتعففة',
    taglineEn: 'Full judicial court representation for underprivileged families',
    targetBudget: 120000,
    raisedBudget: 92000,
    beneficiariesCount: 420,
    descriptionAr: 'كفالة أتعاب المحامين ورسوم التقاضي والخبراء للأفراد والأسر غير القادرين مادياً على توكيل محامين، وضمان حق كل مواطن في محاكمة عادلة دون تمييز.',
    descriptionEn: 'Covering court filing expenses, independent expert fees, and specialized attorney representation for individuals who cannot afford counsel.',
    indicators: ['420 دعوى قضائية مجانية', 'نسبة إنصاف وتحصيل حقوق 89%', 'تمثيل في المحاكم النظامية والشرعية'],
    imageUrl: '/images/legal_aid_consultation_1794225900412.jpg'
  },
  {
    id: 'women-youth',
    titleAr: 'برنامج التمكين القانوني للمرأة والشباب والفئات الهشة',
    titleEn: 'Women & Youth Rights Legal Empowerment Program',
    taglineAr: 'الدعم النفسي-القانوني والتمكين الاجتماعي',
    taglineEn: 'Psycho-legal aid, alimony defense, and young worker rights',
    targetBudget: 65000,
    raisedBudget: 52000,
    beneficiariesCount: 1650,
    descriptionAr: 'تقديم الحماية والاستشارات القانونية المتخصصة للنساء في قضايا الحضانة والنفقة والإرث، بالإضافة إلى حماية حقوق الشباب والعمال في المنشآت الصغيرة.',
    descriptionEn: 'Dedicated legal aid clinic providing counseling on inheritance, custody, domestic safety, and young worker wage protection.',
    indicators: ['1,650 استشارة مجانية', '18 ورشة تدريب وتوعية', 'دعم الخط القانوني السري'],
    imageUrl: '/images/feature_dashboard_preview_179422588312.jpg'
  },
  {
    id: 'land-defense',
    titleAr: 'وحدة طوارئ الدفاع عن الأرض والمسكن والتوثيق العقاري',
    titleEn: 'Land & Housing Emergency Defense & Documentation Unit',
    taglineAr: 'التصدي لإخطارات الهدم وإثبات وتسجيل الملكيات التاريخية',
    taglineEn: 'Combating demolition orders and archiving historical land deeds',
    targetBudget: 95000,
    raisedBudget: 55000,
    beneficiariesCount: 880,
    descriptionAr: 'فريق قانوني-هندسي متخصص للتعامل العاجل مع إخطارات وقف البناء والهدم، وتجهيز الملفات القانونية والتنظيمية وإيداع الاعتراضات أمام الجهات المختصة.',
    descriptionEn: 'Interdisciplinary legal-spatial response team submitting urgent administrative appeals against demolition notices and safeguarding deed archives.',
    indicators: ['تجميد 82 أمر هدم', 'حماية 120 عقاراً ومزرعة', 'أرشفة قانونية رقمية للوثائق'],
    imageUrl: '/images/governance_transparency_report_1794225900485.jpg'
  }
];

const LEGAL_GUIDES: LegalGuide[] = [
  {
    id: 'g1',
    titleAr: 'دليل المواطن في التصدي لإخطارات الهدم ووقف العمل',
    titleEn: 'Citizens Guide to Demolition Notices & Urgent Administrative Injunctions',
    categoryAr: 'الأراضي والإسكان',
    categoryEn: 'Land & Housing',
    pages: 28,
    summaryAr: 'شرح مبسط للإجراءات الفورية المطلوبة عند استلام إخطار هدم، الأوراق الثبوتية الواجب إعدادها، والمواعيد القانونية للاعتراض.',
    summaryEn: 'Step-by-step handbook on immediate statutory procedures, essential land ownership deeds, and deadline requirements.',
    fileSize: '2.4 MB PDF'
  },
  {
    id: 'g2',
    titleAr: 'حقوق العمال ومكافأة نهاية الخدمة وفق قانون العمل الفلسطيني',
    titleEn: 'Workers Rights and Severance Under Palestinian Labor Law No. 7',
    categoryAr: 'قانون العمل',
    categoryEn: 'Labor Law',
    pages: 36,
    summaryAr: 'دليل شامل لاحتساب ساعات العمل الإضافية، الإجازات السنوية والمرضية، وإجراءات المطالبة القضائية بالحقوق العمالية.',
    summaryEn: 'Comprehensive reference detailing overtime calculation, workplace injury compensation, and formal dispute settlement.',
    fileSize: '3.1 MB PDF'
  },
  {
    id: 'g3',
    titleAr: 'حقوق المرأة في قضايا الأحوال الشخصية والميراث والنفقة',
    titleEn: 'Women Legal Protections in Personal Status & Inheritance Proceedings',
    categoryAr: 'الأحوال الشخصية',
    categoryEn: 'Personal Status',
    pages: 42,
    summaryAr: 'إيضاح إجراءات المحاكم الشرعية والكنسية، حقوق الزوجة والأبناء في النفقة، وحماية الحق في الميراث ومنع التنازل بالإكراه.',
    summaryEn: 'Legal guide covering court procedures, custody criteria, formal alimony claims, and inheritance preservation.',
    fileSize: '3.8 MB PDF'
  },
  {
    id: 'g4',
    titleAr: 'دليل الضمانات القانونية أثناء التوقيف والمحاكمة العادلة',
    titleEn: 'Handbook of Fair Trial Guarantees & Lawful Arrest Protections',
    categoryAr: 'العدالة الجنائية',
    categoryEn: 'Criminal Justice',
    pages: 24,
    summaryAr: 'حقوق الموقوف، حق الاستعانة بمحامٍ من اللحظة الأولى، مدد التوقيف القانونية، وحظر الإكراه والمعاملة الحاطة بالكرامة.',
    summaryEn: 'Essential guide on detention limits, mandatory counsel representation, right to silence, and anti-mistreatment statutes.',
    fileSize: '1.9 MB PDF'
  }
];

interface FAQItem {
  id: string;
  categoryAr: string;
  categoryEn: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    categoryAr: 'معايير الاستحقاق',
    categoryEn: 'Eligibility Criteria',
    questionAr: 'من هي الفئات المؤهلة للحصول على المساعدة القانونية المجانية من جمعية أسرار؟',
    questionEn: 'Who is eligible to receive free legal aid from Asrar Association?',
    answerAr: 'تقدم الجمعية خدماتها مجاناً لكافة الفئات المستحقة وغير القادرة مادياً على توكيل محامين، وتشمل: الأسر المتعففة ومحدودة الدخل، النساء المعيلات والأرامل والمطلقات، العمال والمياومين في النزاعات العمالية، المواطنين المتضررين من إخطارات الهدم ومصادرة الأراضي، الأشخاص ذوي الإعاقة، وحالات الاحتجاز التعسفي وضمانات المحاكمة العادلة.',
    answerEn: 'Asrar provides pro-bono legal counsel to indigent and vulnerable individuals unable to afford legal fees, including low-income families, female-headed households, day laborers in wage disputes, citizens affected by demolition orders, persons with disabilities, and individuals facing arbitrary detention.'
  },
  {
    id: 'faq-2',
    categoryAr: 'الوثائق والمستندات',
    categoryEn: 'Document Requirements',
    questionAr: 'ما هي الوثائق والمستندات الثبوتية المطلوبة عند تقديم طلب المساعدة القانونية؟',
    questionEn: 'What supporting documents are required when submitting a legal aid request?',
    answerAr: 'تختلف الوثائق باختلاف نوع القضية: (1) الهوية الشخصية لمقدم الطلب. (2) في قضايا الأراضي: نسخة من إخطار الهدم أو وقف العمل، إخراج قيد أو سند ملكية أو حجة حصر إرث ومخطط مساحي إن وجد. (3) في قضايا العمال: عقد العمل، كشوفات التحويل البنكي، أو أي إثباتات لساعات العمل والفصل. (4) في قضايا الأسرة: عقد الزواج، شهادات ميلاد الأطفال، وحكم النفقة السابق إن وجد. (5) إثبات الوضع المادي أو كتاب من المجلس المحلي/الشؤون الاجتماعية إن تيسر.',
    answerEn: 'Required documents vary by case: (1) Valid personal ID. (2) Land & Housing: copy of demolition order or stop-work notice, land deed/cadastral extract, inheritance certificate, and survey map. (3) Labor disputes: employment contract, pay slips/bank transfers, termination notice. (4) Family law: marriage certificate, children birth records, or prior custody rulings. (5) Proof of financial hardship or local council endorsement if available.'
  },
  {
    id: 'faq-3',
    categoryAr: 'إجراءات ومدة الرد',
    categoryEn: 'Review & Timeline',
    questionAr: 'كم تستغرق دراسة الطلب والرد على مقدمه وتكليف محامٍ؟',
    questionEn: 'How long does it take to review an application and assign a lawyer?',
    answerAr: 'تقوم دائرة الاستقبال والفرز بدراسة الطلب والتواصل مع مقدمه هاتفياً خلال 24 إلى 48 ساعة من التقديم. أما في الحالات المستعجلة والطارئة جداً (مثل استلام إخطار هدم بمهلة محددة، أو جلسات توقيف عاجلة)، يتم التعامل مع الملف فوراً وبشكل طارئ خلال ساعات، وتكليف محامٍ لتقديم الطلبات الاحترازية أمام الجهات القضائية المختصة.',
    answerEn: 'Our intake committee evaluates applications and contacts the applicant within 24 to 48 hours. In critical emergencies (such as imminent demolition deadlines or arrest detention hearings), files are processed urgently within hours with immediate attorney intervention.'
  },
  {
    id: 'faq-4',
    categoryAr: 'الرسوم والأتعاب',
    categoryEn: 'Fees & Costs',
    questionAr: 'هل تتقاضى الجمعية أي رسوم، أتعاب محاماة، أو نسب مئوية من التعويضات؟',
    questionEn: 'Does Asrar charge any legal fees, expenses, or percentages of settlements?',
    answerAr: 'خدمات جمعية أسرار للمساعدة القانونية مجانية بالكامل 100%. لا تتقاضى الجمعية أي أتعاب محاماة أو استشارات، ولا نقتطع أي نسبة من التعويضات المحكوم بها لصالح المستفيد. علاوة على ذلك، في القضايا المعتمدة من صندوق الدفاع القضائي، تتكفل الجمعية بتغطية رسوم المحاكم ونفقات الخبراء القانونيين والتقنيين بالكامل.',
    answerEn: 'All services provided by Asrar are 100% free of charge. We do not charge attorney fees or retainers, nor do we deduct percentages from awarded damages. Through our Indigent Defense Fund, we also cover necessary court filing expenses and expert fees for eligible beneficiaries.'
  },
  {
    id: 'faq-5',
    categoryAr: 'السرية والخصوصية',
    categoryEn: 'Confidentiality',
    questionAr: 'كيف تضمن الجمعية سرية معلوماتي وخصوصية ملفي القانوني؟',
    questionEn: 'How does Asrar ensure client confidentiality and data privacy?',
    answerAr: 'تلتزم الجمعية التزاما صارماً بأحكام السرية المهنية للمحاماة وفق أحكام قانون المحامين النظاميين الفلسطيني وميثاق شرف العمل الأهلي. لا يُطلع على وقائع الملف ومستنداته سوى المحامي المباشر المكلف والمستشار المشرف. وتُحفظ كافة السجلات الرقمية والورقية ضمن خوادم وأنظمة مشفرة وآمنة تماماً.',
    answerEn: 'All client information and evidentiary documents are protected under statutory attorney-client privilege as codified in Palestinian Bar Law. Only the assigned advocate and senior supervising jurist access the case materials, which are archived on secure encrypted systems.'
  },
  {
    id: 'faq-6',
    categoryAr: 'النطاق الجغرافي والوصول',
    categoryEn: 'Geographic Coverage',
    questionAr: 'أعيش في قرية نائية / مخيم بعيد، هل يمكنني الاستفادة من خدماتكم دون الحضور لرام الله؟',
    questionEn: 'I live in a remote village or refugee camp; can I access services without traveling?',
    answerAr: 'نعم بالتأكيد! تسير جمعية أسرار "عيادات قانونية متنقلة" تصل دورياً إلى القرى المعزولة والمحاطة بالجدار، وتجمعات الأغوار والمخيمات. كما نستقبل الطلبات عبر موقعنا الإلكتروني، ونقدم الاستشارات عبر الهاتف المباشر (0587155658) والواتساب، وننتدب محامين محليين للترافع في المحاكم الواقعة ضمن محافظتكم.',
    answerEn: 'Yes! Asrar operates Mobile Legal Clinics deploying regularly to isolated villages, border areas, and camps. You can apply through this website, consult via direct phone (0587155658), and our network of advocates will represent you before local courts in your own governorate.'
  },
  {
    id: 'faq-7',
    categoryAr: 'المتابعة والاستعلام',
    categoryEn: 'Case Follow-up',
    questionAr: 'كيف أستخدم الرقم المرجعي لمتابعة حالة طلبي بعد التقديم؟',
    questionEn: 'How can I use my reference code to follow up on my case status?',
    answerAr: 'بمجرد إرسال النموذج بنجاح، يُظهر النظام رمزاً مرجعياً فريداً (مثال: ASRAR-2026-8941). يمكنك نسخ هذا الرمز وإدخاله في أداة "تتبع مسار طلبك القانوني" الموجودة في قسم طلب المساعدة بالموقع لمعرفة اسم المحامي المكلف وآخر الإجراءات المتخذة في ملفك في أي وقت.',
    answerEn: 'Upon submission, you receive a unique tracking code (e.g. ASRAR-2026-8941). You can input this code into our Case Status Tracker on the website at any time to monitor assigned counsel and procedural updates.'
  }
];

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [requestsList, setRequestsList] = useState<LegalAidRequest[]>([
    {
      id: 'ASRAR-2026-8941',
      fullName: 'أ. م. خ.',
      phone: '0599xxxxxx',
      governorate: 'القدس الشريف',
      category: 'قضايا الأراضي والملكية ومقاومة إخطارات الهدم',
      urgency: 'عاجل جداً',
      details: 'استلام إخطار هدم لمنشأة سكنية مأهولة، والحاجة إلى استصدار أمر احترازي فوري.',
      status: 'تم تكليف محامٍ مختص',
      lawyerName: 'أ. سامر التميمي (محامي متفرغ بالجمعية)',
      createdAt: '2026-11-06'
    },
    {
      id: 'ASRAR-2026-7832',
      fullName: 'ف. ع. ر.',
      phone: '0598xxxxxx',
      governorate: 'الخليل',
      category: 'قضايا العمال والنزاعات العمالية والتعويضات',
      urgency: 'متوسط',
      details: 'فصل تعسفي بعد 7 سنوات عمل دون الحصول على مستحقات نهاية الخدمة والبدلات.',
      status: 'قيد المراجعة الأولية',
      lawyerName: 'دائرة العون القضائي العمالي',
      createdAt: '2026-11-08'
    }
  ]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(PALESTINIAN_GOVERNORATES[0]);
  const [category, setCategory] = useState(LEGAL_CATEGORIES[0].labelAr);
  const [urgency, setUrgency] = useState<'عاجل جداً' | 'متوسط' | 'اعتيادي'>('عاجل جداً');
  const [details, setDetails] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const [searchCode, setSearchCode] = useState('');
  const [searchedRequest, setSearchedRequest] = useState<LegalAidRequest | null | 'not_found'>(null);

  const [donationAmount, setDonationAmount] = useState<number>(1000);

  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const [volName, setVolName] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volBio, setVolBio] = useState('');
  const [volSubmittedCode, setVolSubmittedCode] = useState<string | null>(null);

  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName.trim() || !volPhone.trim() || !volEmail.trim()) return;
    const refCode = `VOL-ASRAR-${Math.floor(1000 + Math.random() * 9000)}`;
    setVolSubmittedCode(refCode);
    setVolName('');
    setVolPhone('');
    setVolEmail('');
    setVolBio('');
  };

  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !details.trim()) return;

    const newCode = `ASRAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: LegalAidRequest = {
      id: newCode,
      fullName: fullName.trim(),
      phone: phone.trim(),
      governorate,
      category,
      urgency,
      details: details.trim(),
      status: 'قيد المراجعة الأولية',
      lawyerName: 'دائرة الاستقبال وفرز القضايا المستعجلة',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRequestsList([newReq, ...requestsList]);
    setSubmittedCode(newCode);
    setFullName('');
    setPhone('');
    setDetails('');
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = requestsList.find(
      (r) => r.id.toLowerCase() === searchCode.trim().toLowerCase()
    );
    if (found) {
      setSearchedRequest(found);
    } else {
      setSearchedRequest('not_found');
    }
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerOrg || !partnerEmail) return;
    setPartnerSubmitted(true);
  };

  const calculateImpact = (amount: number) => {
    const cases = Math.max(1, Math.floor(amount / 250));
    const consultations = Math.floor(amount / 40);
    const outreachHours = Math.floor(amount / 75);
    const printedGuides = Math.floor(amount * 4);
    return { cases, consultations, outreachHours, printedGuides };
  };

  const impactMetrics = calculateImpact(donationAmount);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 transition-colors duration-200 dark:bg-stone-950 dark:text-stone-100">
      
      {/* 0. OFFICIAL REGISTRATION & CRISIS HOTLINE RIBBON */}
      <div className="border-b border-stone-200 bg-stone-900 px-6 py-2 text-xs text-stone-200 dark:border-stone-800 dark:bg-black">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-amber-300">
              {isRtl ? 'دولة فلسطين' : 'State of Palestine'}
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span>
              {isRtl
                ? 'جمعية أسرار للمساعدة القانونية (جمعية أهلية غير ربحية مسجلة رسمياً)'
                : 'Asrar Legal Aid Association (Officially Registered Palestinian NGO)'}
            </span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <a href="https://www.asrarlegal.org" target="_blank" rel="noopener noreferrer" className="font-mono text-stone-300 hover:text-white underline">
              www.asrarlegal.org
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="tel:0587155658" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              <span>{isRtl ? 'الهاتف المباشر: 0587155658' : 'Direct Phone: 0587155658'}</span>
            </a>
            <span aria-hidden="true" className="text-stone-600">|</span>
            <a
              href="https://www.facebook.com/profile.php?id=61572062862017"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-300 hover:text-white transition-colors"
              title="صفحة الفيسبوك الرسمية"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>{isRtl ? 'فيسبوك' : 'Facebook'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 border-b border-stone-200 bg-[#FAF8F5]/95 px-6 py-4 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95">
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-12 w-12 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            أ
          </div>
          <div>
            <a href="#" className="text-lg font-bold tracking-tight text-stone-900 dark:text-white whitespace-nowrap shrink-0 block leading-tight">
              {isRtl ? 'جمعية أسرار للمساعدة القانونية' : 'Asrar Legal Aid Association'}
            </a>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
              {isRtl ? 'رام الله، شارع مؤتة، عمارة الكواكب' : 'Ramallah, Mu\'tah St, Al-Kawakeb Bldg'}
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <a href="#about" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'عن الجمعية' : 'About Asrar'}</a>
          <a href="#services" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'الخدمات القانونية' : 'Legal Services'}</a>
          <a href="#aid-form" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'طلب مساعدة مجانية' : 'Apply for Legal Aid'}</a>
          <a href="#programs" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'مشاريع التمويل والشراكة' : 'Grant Programs & Funding'}</a>
          <a href="#contact" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'الاتصال والمقر' : 'Contact Us'}</a>
          <a href="#library" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'المكتبة الحقوقية' : 'Rights Guides'}</a>
          <a href="#volunteer" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 text-amber-800 dark:text-amber-400 font-semibold">{isRtl ? 'فرص التطوع' : 'Volunteer'}</a>
          <a href="#faq" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">{isRtl ? 'أسئلة شائعة' : 'FAQ'}</a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 dark:text-stone-300 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-stone-700 hover:text-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 dark:text-stone-300 dark:hover:text-white transition-colors shrink-0"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="#partnership"
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {isRtl ? 'دعم وتمويل البرامج' : 'Fund Our Mission'}
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION WITH UPLOADED PUBLIC IMAGE */}
      <section id="about" className="relative overflow-hidden border-b border-stone-200 bg-[#FAF8F5] py-16 lg:py-24 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-4">
                <span>{isRtl ? 'جمعية أهلية غير ربحية مرخصة في فلسطين' : 'Registered Non-Profit NGO in Palestine'}</span>
                <span aria-hidden="true">·</span>
                <span>{isRtl ? 'تعزيز سيادة القانون والمساعدة القضائية الشاملة' : 'Rule of Law & Comprehensive Legal Aid'}</span>
              </div>

              <h1 className="text-4xl font-serif font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.25]">
                {isRtl ? (
                  <>
                    جمعية أسرار <br />
                    <span className="underline decoration-amber-600 dark:decoration-amber-500 underline-offset-8">للمساعدة القانونية</span> في دولة فلسطين
                  </>
                ) : (
                  <>
                    Asrar Association <br />
                    <span className="underline decoration-amber-600 dark:decoration-amber-500 underline-offset-8">For Legal Aid</span> in Palestine
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-base text-stone-700 sm:text-lg dark:text-stone-300 leading-relaxed font-sans">
                {isRtl
                  ? 'تسعى جمعية أسرار للمساعدة القانونية إلى تعزيز سيادة القانون وتمكين المجتمع حقوقياً وقانونياً، وتلتزم بتقديم الدعم والمساعدة القانونية الشاملة والاستشارات الحقوقية للفئات المستحقة والمهمشة.'
                  : 'Asrar Association for Legal Aid promotes the rule of law and community legal empowerment across Palestine, providing free comprehensive defense and counseling to marginalized groups.'}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#aid-form"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white transition-colors shadow-sm"
                >
                  <Scale className="h-4 w-4" />
                  <span>{isRtl ? 'طلب استشارة ومساعدة قانونية مجانية' : 'Request Free Legal Aid'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 dark:text-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg transition-colors"
                >
                  <MapPin className="h-4 w-4 text-amber-800 dark:text-amber-400" />
                  <span>{isRtl ? 'مقر الجمعية ومعلومات التواصل' : 'HQ & Contact Info'}</span>
                </a>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-stone-200 pt-6 sm:grid-cols-4 dark:border-stone-800">
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">4,850+</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">{isRtl ? 'استشارة قانونية' : 'Consultations'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">820+</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">{isRtl ? 'قضية أُنجزت' : 'Cases Done'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">14</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">{isRtl ? 'محافظة وتجمع' : 'Governorates'}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">100%</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">{isRtl ? 'خدمات مجانية' : 'Free Aid'}</div>
                </div>
              </div>
            </div>

            {/* Hero Image linked from public/images */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800">
                <img
                  src="/images/hero_justice_palestine_legal_1794225801073.jpg"
                  alt="Justice and Legal Aid"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-xs font-medium">
                    <span className="block font-bold text-sm text-amber-300 mb-1">{isRtl ? 'العدالة وسيادة القانون' : 'Justice & Rule of Law'}</span>
                    {isRtl ? 'دعم قضائي واستشارات احترافية لحماية الحقوق اليومية' : 'Professional legal support safeguarding daily rights'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. LEGAL SERVICES SECTION */}
      <section id="services" className="border-b border-stone-200 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {isRtl ? 'مجالات الاختصاص' : 'Areas of Expertise'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mt-2">
              {isRtl ? 'خدماتنا القانونية والقضائية المتخصصة' : 'Specialized Legal & Judicial Services'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEGAL_CATEGORIES.map((cat, idx) => (
              <div key={cat.id} className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 flex flex-col justify-between hover:border-amber-700/50 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold mb-4 font-mono text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                    {isRtl ? cat.labelAr : cat.labelEn}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {isRtl 
                      ? 'تمثيل قانوني، صياغة لوائح دفاع، تقديم استشارات تخصصية ومواكبة إدارية وقضائية بالكامل.'
                      : 'Full legal representation, drafting defense briefs, specialized consultations, and administrative tracking.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-medium text-stone-700 dark:text-stone-300">
                  <span>{isRtl ? 'خدمة مجانية بالكامل' : 'Free Pro-Bono'}</span>
                  <a href="#aid-form" className="text-amber-800 dark:text-amber-400 hover:underline">
                    {isRtl ? 'اطلب استشارة ←' : 'Request Aid →'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LEGAL AID APPLICATION & STATUS TRACKER */}
      <section id="aid-form" className="border-b border-stone-200 bg-[#FAF8F5] py-16 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-2">
                <FileCheck className="h-4 w-4" />
                <span>{isRtl ? 'بوابة استقبال الطلبات الإلكترونية' : 'Electronic Intake Portal'}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mb-2">
                {isRtl ? 'نموذج طلب مساعدة واستشارة قانونية' : 'Legal Aid & Consultation Request Form'}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">
                {isRtl ? 'يرجى تعبئة البيانات أدناه بدقة. سيتم مراجعة طلبك بسرية تامة من قبل الدائرة القانونية.' : 'Please fill in accurate details. Your request will be reviewed with strict confidentiality.'}
              </p>

              {submittedCode ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                    {isRtl ? 'تم إرسال طلبك بنجاح!' : 'Request Submitted Successfully!'}
                  </h3>
                  <div className="inline-block bg-white dark:bg-stone-900 px-4 py-2 rounded-lg font-mono text-sm font-bold text-stone-950 dark:text-white border border-emerald-300 dark:border-emerald-700 my-3 select-all">
                    {submittedCode}
                  </div>
                  <div>
                    <button
                      onClick={() => setSubmittedCode(null)}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
                    >
                      {isRtl ? '← تقديم طلب آخر' : '← Submit Another Request'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {isRtl ? 'الاسم الكامل (أو الأحرف الأولى للسرية)*' : 'Full Name or Initials*'}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="أ. م. خ."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {isRtl ? 'رقم الهاتف / الواتساب للتواصل*' : 'Phone / WhatsApp*'}
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0599xxxxxx"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {isRtl ? 'المحافظة / منطقة السكن*' : 'Governorate / Residence*'}
                      </label>
                      <select
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-600"
                      >
                        {PALESTINIAN_GOVERNORATES.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {isRtl ? 'درجة الاستعجال*' : 'Urgency Level*'}
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-600"
                      >
                        <option value="عاجل جداً">{isRtl ? 'عاجل جداً (إخطار هدم / توقيف)' : 'Very Urgent'}</option>
                        <option value="متوسط">{isRtl ? 'متوسط (نزاع عمالي / أسري)' : 'Moderate'}</option>
                        <option value="اعتيادي">{isRtl ? 'اعتيادي (استشارة)' : 'Routine'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'تصنيف القضية القانونية*' : 'Legal Category*'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-600"
                    >
                      {LEGAL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.labelAr}>{cat.labelAr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'تفاصيل القضية والوقائع باختصار*' : 'Case Details & Summary*'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={isRtl ? 'اكتب تفاصيل مشكلتك القانونية...' : 'Describe your legal situation...'}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isRtl ? 'إرسال طلب المساعدة القانونية' : 'Submit Legal Aid Request'}</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-2">
                  <Search className="h-4 w-4" />
                  <span>{isRtl ? 'أداة تتبع مسار الطلب' : 'Case Status Tracker'}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                  {isRtl ? 'استعلم عن حالة ملفك القانوني' : 'Check Your Case Status'}
                </h3>
                <form onSubmit={handleSearchStatus} className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      placeholder="ASRAR-2026-xxxx"
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-semibold rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      {isRtl ? 'بحث' : 'Search'}
                    </button>
                  </div>
                </form>

                {searchedRequest === 'not_found' && (
                  <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 text-xs text-red-800 dark:text-red-300">
                    {isRtl ? 'لم يتم العثور على طلب بهذا الرقم المرجعي.' : 'No request found with this reference code.'}
                  </div>
                )}

                {searchedRequest && searchedRequest !== 'not_found' && (
                  <div className="mt-4 p-4 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 text-xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                      <span className="font-mono font-bold text-amber-800 dark:text-amber-400">{searchedRequest.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                        {searchedRequest.status}
                      </span>
                    </div>
                    <div><span className="text-stone-500">{isRtl ? 'صاحب الطلب:' : 'Applicant:'}</span> <strong className="text-stone-900 dark:text-white">{searchedRequest.fullName}</strong></div>
                    <div><span className="text-stone-500">{isRtl ? 'المحامي المكلف:' : 'Assigned Lawyer:'}</span> <strong className="text-stone-900 dark:text-white">{searchedRequest.lawyerName}</strong></div>
                  </div>
                )}
              </div>

              <div className="bg-stone-900 text-stone-200 rounded-2xl p-6 text-xs">
                <h4 className="font-bold text-amber-300 mb-2">{isRtl ? '💡 تجربة أداة التتبع فوراً:' : '💡 Try the Tracker:'}</h4>
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-stone-800">
                    <span>ASRAR-2026-8941</span>
                    <button onClick={() => setSearchCode('ASRAR-2026-8941')} className="text-amber-400 hover:underline">{isRtl ? 'تجربة' : 'Test'}</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FUNDABLE PROGRAMS WITH UPLOADED PUBLIC IMAGES */}
      <section id="programs" className="border-b border-stone-200 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              {isRtl ? 'الشراكة والمنح المؤسسية' : 'Institutional Grants & Funding'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mt-2">
              {isRtl ? 'مشاريعنا الاستراتيجية القابلة للتمويل' : 'Strategic Fundable Programs'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {FUNDABLE_PROGRAMS.map((prog) => {
              const progressPercent = Math.min(100, Math.round((prog.raisedBudget / prog.targetBudget) * 100));
              return (
                <div key={prog.id} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="h-48 w-full overflow-hidden relative">
                      <img src={prog.imageUrl} alt={prog.titleAr} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 right-3 bg-stone-900/90 text-amber-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full">
                        {progressPercent}% {isRtl ? 'ممول' : 'Funded'}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                        {isRtl ? prog.titleAr : prog.titleEn}
                      </h3>
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-3">
                        {isRtl ? prog.taglineAr : prog.taglineEn}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                        {isRtl ? prog.descriptionAr : prog.descriptionEn}
                      </p>

                      <div className="space-y-1.5 mb-6 text-xs">
                        <div className="flex justify-between font-mono text-stone-700 dark:text-stone-300">
                          <span>${prog.raisedBudget.toLocaleString()} {isRtl ? 'تم جمعها' : 'Raised'}</span>
                          <span className="text-stone-500">${prog.targetBudget.toLocaleString()} {isRtl ? 'المستهدف' : 'Target'}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-700 h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-200 dark:border-stone-800 mt-4">
                    <span className="text-xs text-stone-500 font-mono">
                      👥 {prog.beneficiariesCount} {isRtl ? 'مستفيد' : 'Beneficiaries'}
                    </span>
                    <a href="#partnership" className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors">
                      {isRtl ? 'دعم المشروع' : 'Support'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Donor Impact Calculator */}
          <div className="rounded-2xl bg-stone-900 text-stone-100 p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                {isRtl ? 'حاسبة الأثر الإنساني والقضائي للمتبرعين' : 'Donor Impact Calculator'}
              </h3>
              <p className="text-xs text-stone-400">
                {isRtl ? 'اسحب المؤشر وحدد قيمة المساهمة لمعرفة الأثر المباشر الذي تحققه.' : 'Drag the slider to see your direct legal impact.'}
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center">
                <span className="text-4xl font-bold font-mono text-amber-300">${donationAmount}</span>
                <span className="text-stone-400 text-xs block mt-1">{isRtl ? 'مساهمة مالية مقترحة' : 'Suggested Contribution'}</span>
              </div>

              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-4">
                <div className="bg-black/40 p-4 rounded-xl border border-stone-800">
                  <div className="text-xl font-bold font-mono text-amber-300">{impactMetrics.cases}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{isRtl ? 'قضية ودعوى' : 'Cases'}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-stone-800">
                  <div className="text-xl font-bold font-mono text-amber-300">{impactMetrics.consultations}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{isRtl ? 'استشارة مجانية' : 'Consultations'}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-stone-800">
                  <div className="text-xl font-bold font-mono text-amber-300">{impactMetrics.outreachHours}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{isRtl ? 'ساعة عيادات' : 'Outreach Hours'}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-stone-800">
                  <div className="text-xl font-bold font-mono text-amber-300">{impactMetrics.printedGuides}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{isRtl ? 'نسخة دليل' : 'Guides'}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PARTNERSHIP PROPOSAL SECTION */}
      <section id="partnership" className="border-b border-stone-200 bg-[#FAF8F5] py-16 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 lg:p-12 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                {isRtl ? 'الشراكة الاستراتيجية' : 'Strategic Partnership'}
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-1">
                {isRtl ? 'تقديم مقترح شراكة أو منحة مؤسسية' : 'Submit Partnership Proposal'}
              </h2>
            </div>

            {partnerSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                  {isRtl ? 'تم إرسال مقترح الشراكة بنجاح!' : 'Submitted Successfully!'}
                </h3>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">{isRtl ? 'اسم المؤسسة*' : 'Organization*'}</label>
                    <input type="text" required value={partnerOrg} onChange={(e) => setPartnerOrg(e.target.value)} placeholder="International Fund" className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">{isRtl ? 'البريد الإلكتروني*' : 'Email*'}</label>
                    <input type="email" required value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} placeholder="partner@org.org" className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">{isRtl ? 'تفاصيل المقترح*' : 'Details*'}</label>
                  <textarea required rows={4} value={partnerMessage} onChange={(e) => setPartnerMessage(e.target.value)} placeholder="Proposal details..." className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white" />
                </div>
                <button type="submit" className="w-full py-3 px-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-semibold rounded-lg shadow-sm">
                  {isRtl ? 'إرسال المقترح' : 'Submit Proposal'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. LEGAL GUIDES LIBRARY */}
      <section id="library" className="border-b border-stone-200 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider">{isRtl ? 'المكتبة الحقوقية' : 'Library'}</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mt-2">{isRtl ? 'الأدلة والمطبوعات القانونية' : 'Legal Handbooks'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEGAL_GUIDES.map((guide) => (
              <div key={guide.id} className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 p-6 flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-stone-200 dark:bg-stone-800 text-[11px] font-semibold text-stone-700 dark:text-stone-300">{guide.categoryAr}</span>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white my-3">{guide.titleAr}</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-6">{guide.summaryAr}</p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500">{guide.fileSize}</span>
                  <button onClick={() => alert(`Downloading: ${guide.titleAr}`)} className="px-3 py-1.5 bg-amber-800 text-white text-xs font-semibold rounded-lg">
                    {isRtl ? 'تحميل' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VOLUNTEER SECTION */}
      <section id="volunteer" className="border-b border-stone-200 bg-[#FAF8F5] py-16 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mb-2 text-center">{isRtl ? 'انضم إلى شبكة المحامين المتطوعين' : 'Join Volunteer Network'}</h2>
            {volSubmittedCode ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-lg text-center text-xs">
                {isRtl ? `تم التسجيل بنجاح! رمز التطوع: ${volSubmittedCode}` : `Registered successfully! Code: ${volSubmittedCode}`}
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-xs mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" required value={volName} onChange={(e) => setVolName(e.target.value)} placeholder={isRtl ? 'الاسم الكامل*' : 'Full Name*'} className="px-3 py-2 rounded-lg border bg-stone-50 dark:bg-stone-950" />
                  <input type="text" required value={volPhone} onChange={(e) => setVolPhone(e.target.value)} placeholder={isRtl ? 'رقم الهاتف*' : 'Phone*'} className="px-3 py-2 rounded-lg border bg-stone-50 dark:bg-stone-950 font-mono" />
                  <input type="email" required value={volEmail} onChange={(e) => setVolEmail(e.target.value)} placeholder={isRtl ? 'البريد الإلكتروني*' : 'Email*'} className="px-3 py-2 rounded-lg border bg-stone-50 dark:bg-stone-950" />
                </div>
                <textarea required rows={3} value={volBio} onChange={(e) => setVolBio(e.target.value)} placeholder={isRtl ? 'نبذة عن الخبرة والاختصاص*' : 'Bio & Expertise*'} className="w-full px-3 py-2 rounded-lg border bg-stone-50 dark:bg-stone-950" />
                <button type="submit" className="w-full py-3 bg-amber-800 text-white font-semibold rounded-lg">
                  {isRtl ? 'التسجيل للتطوع' : 'Register as Volunteer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section id="faq" className="border-b border-stone-200 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white text-center mb-12">{isRtl ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 overflow-hidden">
                  <button onClick={() => toggleFaq(faq.id)} className="w-full flex justify-between items-center p-5 text-right font-bold text-stone-900 dark:text-white text-sm">
                    <span>{isRtl ? faq.questionAr : faq.questionEn}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs text-stone-700 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
                      {isRtl ? faq.answerAr : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CONTACT SECTION */}
      <section id="contact" className="border-b border-stone-200 bg-[#FAF8F5] py-16 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-4">{isRtl ? 'تواصل مع جمعية أسرار' : 'Contact Asrar'}</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">{isRtl ? 'رام الله، شارع مؤتة، عمارة الكواكب' : 'Ramallah, Mu\'tah St'}</p>
            <div className="space-y-3 text-xs">
              <div>📞 <strong>0587155658</strong></div>
              <div>✉️ <strong>contact@asrarlegal.org</strong></div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 flex flex-col justify-center items-center text-center">
            <MapPin className="h-10 w-10 text-amber-800 dark:text-amber-400 mb-2" />
            <span className="font-bold text-stone-900 dark:text-white text-sm">{isRtl ? 'رام الله - شارع مؤتة' : 'Ramallah - Mu\'tah Street'}</span>
            <a href="https://maps.google.com/?q=Ramallah+Mutah+Street" target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-lg">
              {isRtl ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
            </a>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-xs">
        <p>© 2026 {isRtl ? 'جمعية أسرار للمساعدة القانونية. جميع الحقوق محفوظة.' : 'Asrar Association for Legal Aid. All rights reserved.'}</p>
      </footer>
    </div>
  );
}
