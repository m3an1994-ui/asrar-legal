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

// Data types
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
    indicators: ['45 جولة ميدانية سنوياً', '2,400 مستفيد مباشر', 'استشارات أراضي وتثبيت ملكية']
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
    indicators: ['420 دعوى قضائية مجانية', 'نسبة إنصاف وتحصيل حقوق 89%', 'تمثيل في المحاكم النظامية والشرعية']
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
    indicators: ['1,650 استشارة مجانية', '18 ورشة تدريب وتوعية', 'دعم الخط القانوني السري']
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
    indicators: ['تجميد 82 أمر هدم', 'حماية 120 عقاراً ومزرعة', 'أرشفة قانونية رقمية للوثائق']
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
    answerAr: 'تلتزم الجمعية التزاماً صارماً بأحكام السرية المهنية للمحاماة وفق أحكام قانون المحامين النظاميين الفلسطيني وميثاق شرف العمل الأهلي. لا يُطلع على وقائع الملف ومستنداته سوى المحامي المباشر المكلف والمستشار المشرف. وتُحفظ كافة السجلات الرقمية والورقية ضمن خوادم وأنظمة مشفرة وآمنة تماماً.',
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

  // Application & Request State
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

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(PALESTINIAN_GOVERNORATES[0]);
  const [category, setCategory] = useState(LEGAL_CATEGORIES[0].labelAr);
  const [urgency, setUrgency] = useState<'عاجل جداً' | 'متوسط' | 'اعتيادي'>('عاجل جداً');
  const [details, setDetails] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Status search state
  const [searchCode, setSearchCode] = useState('');
  const [searchedRequest, setSearchedRequest] = useState<LegalAidRequest | null | 'not_found'>(null);

  // Interactive Impact Calculator State for Donors
  const [donationAmount, setDonationAmount] = useState<number>(1000);

  // Partnership Proposal Form State
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerType, setPartnerType] = useState('منظمة دولية / مانح مؤسسي');
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // Volunteer Opportunities Form State
  const [volName, setVolName] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volRole, setVolRole] = useState('محامٍ مزاول (عضو نقابة المحامين)');
  const [volSpecialty, setVolSpecialty] = useState('قضايا الأراضي والملكية ومقاومة إخطارات الهدم');
  const [volGov, setVolGov] = useState(PALESTINIAN_GOVERNORATES[1]); // رام الله والبيرة
  const [volType, setVolType] = useState('التمثيل القضائي التطوعي والترافع أمام المحاكم');
  const [volHours, setVolHours] = useState('2 - 4 ساعات أسبوعياً');
  const [volBio, setVolBio] = useState('');
  const [volSubmittedCode, setVolSubmittedCode] = useState<string | null>(null);

  // FAQ Accordion State
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

  // Sync lang & theme
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

  // Submit legal aid request
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

  // Search request status
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

  // Submit partnership form
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerOrg || !partnerEmail) return;
    setPartnerSubmitted(true);
  };

  // Calculate impact numbers based on donation amount
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
        
        {/* Zone 1: Single text element wordmark with official logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/assets/aistudio/logo_b3627de6.png"
            alt="شعار جمعية أسرار للمساعدة القانونية"
            className="h-12 w-12 object-contain shrink-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700"
          />
          <div>
            <a href="#" className="text-lg font-bold tracking-tight text-stone-900 dark:text-white whitespace-nowrap shrink-0 block leading-tight font-arabic-serif">
              {isRtl ? 'جمعية أسرار للمساعدة القانونية' : 'Asrar Legal Aid Association'}
            </a>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
              {isRtl ? 'رام الله، شارع مؤتة، عمارة الكواكب' : 'Ramallah, Mu\'tah St, Al-Kawakeb Bldg'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <a href="#about" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'عن الجمعية' : 'About Asrar'}
          </a>
          <a href="#services" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'الخدمات القانونية' : 'Legal Services'}
          </a>
          <a href="#aid-form" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'طلب مساعدة مجانية' : 'Apply for Legal Aid'}
          </a>
          <a href="#programs" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'مشاريع التمويل والشراكة' : 'Grant Programs & Funding'}
          </a>
          <a href="#contact" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'الاتصال والمقر' : 'Contact Us'}
          </a>
          <a href="#library" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'المكتبة الحقوقية' : 'Rights Guides'}
          </a>
          <a href="#volunteer" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 text-amber-800 dark:text-amber-400 font-semibold">
            {isRtl ? 'فرص التطوع' : 'Volunteer'}
          </a>
          <a href="#faq" className="hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            {isRtl ? 'أسئلة شائعة' : 'FAQ'}
          </a>
        </nav>

        {/* Zone 3: Controls & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 dark:text-stone-300 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{isRtl ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-stone-700 hover:text-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 dark:text-stone-300 dark:hover:text-white transition-colors shrink-0"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Primary CTA for Donors & Partners */}
          <a
            href="#partnership"
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {isRtl ? 'دعم وتمويل البرامج' : 'Fund Our Mission'}
          </a>
        </div>
      </header>

      {/* 2. HERO INSTITUTIONAL MARQUEE */}
      <section id="about" className="relative overflow-hidden border-b border-stone-200 bg-[#FAF8F5] py-16 lg:py-24 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
            
            {/* Text & Institutional Narrative Column */}
            <div className="flex flex-col justify-center lg:col-span-7">
              
              {/* Unboxed institutional kicker with logo emblem */}
              <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-4">
                <img
                  src="/assets/aistudio/logo_b3627de6.png"
                  alt="شعار جمعية أسرار"
                  className="h-8 w-8 object-contain rounded-full bg-white p-0.5 shadow-xs ring-1 ring-amber-300 dark:ring-amber-800 shrink-0"
                />
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
                  ? 'تسعى جمعية أسرار للمساعدة القانونية إلى تعزيز سيادة القانون وتمكين المجتمع حقوقياً وقانونياً، وتلتزم بتقديم الدعم والمساعدة القانونية الشاملة والاستشارات الحقوقية للفئات المستحقة والمهمشة، وترسيخ مفاهيم العدالة والشفافية.'
                  : 'Asrar Association for Legal Aid promotes the rule of law and community legal empowerment across Palestine, providing free comprehensive defense and counseling to marginalized and underserved groups while entrenching justice and transparency.'}
              </p>

              {/* Action Buttons for Beneficiaries & Donors */}
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

              {/* Institutional Indicators (Quiet Unboxed Row) */}
              <div className="mt-12 grid grid-cols-2 gap-6 border-t border-stone-200 pt-6 sm:grid-cols-4 dark:border-stone-800">
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">4,850+</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    {isRtl ? 'استشارة قانونية مجانية قُدمت' : 'Free Legal Consultations'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">610+</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    {isRtl ? 'قضية أمام المحاكم تم الترافع فيها' : 'Court Cases Represented'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">45</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    {isRtl ? 'قرية ومخيماً غطتها العيادة المتنقلة' : 'Communities Reached'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">100%</div>
                  <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    {isRtl ? 'شفافية وتدقيق مالي مستقل' : 'Audited Governance'}
                  </div>
                </div>
              </div>

            </div>

            {/* Visual Column: Hero Image with Dignified Framing */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative overflow-hidden rounded-2xl border border-stone-300 bg-stone-100 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <img
                  src="/src/assets/images/hero_justice_palestine_legal_1794225901073.jpg"
                  alt="Dignified Legal Aid and Rights Center in Palestine"
                  referrerPolicy="no-referrer"
                  className="h-96 w-full object-cover lg:h-[480px]"
                />
                <div className="border-t border-stone-200 bg-white/95 p-5 backdrop-blur dark:border-stone-800 dark:bg-stone-900/95">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-2">
                      <img
                        src="/assets/aistudio/logo_b3627de6.png"
                        alt="شعار جمعية أسرار"
                        className="h-6 w-6 object-contain rounded-full bg-white p-0.5 shadow-2xs"
                      />
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{isRtl ? 'جمعية أسرار للمساعدة القانونية' : 'Asrar Legal Aid Association'}</span>
                    </div>
                    <a href="https://www.asrarlegal.org" target="_blank" rel="noopener noreferrer" className="font-mono underline hover:text-stone-900 dark:hover:text-white">
                      www.asrarlegal.org
                    </a>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-white">
                    {isRtl
                      ? 'رسالتنا: لا ينبغي أن يُحرم أحد من العدالة بسبب عدم قدرته المادية'
                      : 'Our core belief: No one should be denied justice due to inability to pay'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 DIRECT CONTACT HIGHLIGHT BANNER */}
      <section id="contact" className="py-8 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-800 text-white dark:bg-amber-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 block">
                  {isRtl ? 'العنوان والمقر الرسمي' : 'Official Headquarters'}
                </span>
                <span className="text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                  {isRtl ? 'رام الله، شارع مؤتة، عمارة الكواكب' : 'Ramallah, Mu\'tah St, Al-Kawakeb Bldg'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-800 text-white dark:bg-amber-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 block">
                  {isRtl ? 'الهاتف المباشر' : 'Direct Phone'}
                </span>
                <a href="tel:0587155658" className="text-xs font-bold text-stone-900 dark:text-white hover:underline font-mono block mt-0.5">
                  0587155658
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-800 text-white dark:bg-amber-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 block">
                  {isRtl ? 'البريد الإلكتروني' : 'Official Email'}
                </span>
                <a href="mailto:info@asrarlegal.org" className="text-xs font-bold text-stone-900 dark:text-white hover:underline font-mono block mt-0.5">
                  info@asrarlegal.org
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1877F2] text-white">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-300 block">
                  {isRtl ? 'صفحة الفيسبوك الرسمية' : 'Official Facebook Page'}
                </span>
                <a
                  href="https://www.facebook.com/profile.php?id=61572062862017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#1877F2] dark:text-blue-400 hover:underline block mt-0.5"
                >
                  {isRtl ? 'متابعة الجمعية على فيسبوك ←' : 'Follow on Facebook →'}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE LEGAL SERVICES (SERVING BENEFICIARIES) */}
      <section id="services" className="py-16 border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
              {isRtl ? '01. خدماتنا القانونية المجانية' : '01. Free Legal Services'}
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              {isRtl ? 'مساندة حقوقية متخصصة ومجانية لكافة الفئات المستحقة' : 'Dedicated Judicial Support for Underserved Groups'}
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {isRtl
                ? 'تقدم جمعية أسرار خدمات المحاماة والاستشارات القانونية المتخصصة دون أي مقابل مالي للأفراد والأسر غير القادرين، مع الحفاظ على أقصى درجات السرية المهنية.'
                : 'Comprehensive pro-bono counsel across vital legal domains protecting human rights, property, family welfare, and fair proceedings.'}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LEGAL_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.id}
                className="rounded-xl border border-stone-200 bg-[#FAF8F5] p-6 transition-all hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
              >
                <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-mono">
                  <span>{`0${idx + 1}`}</span>
                  <span>{isRtl ? 'مجاني 100%' : '100% Pro Bono'}</span>
                </div>

                <h3 className="mt-4 text-base font-bold text-stone-900 dark:text-white">
                  {isRtl ? cat.labelAr : cat.labelEn}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                  {cat.id === 'land' && (isRtl ? 'إعداد لوائح الاعتراض الإداري والقضائي، استصدار قرارات احترازية لتجميد أوامر الهدم، وتوثيق سجلات الأراضي وإثبات الملكية.' : 'Administrative appeals, injunction orders against demolition, historical land deed verification.')}
                  {cat.id === 'family' && (isRtl ? 'التمثيل في قضايا الحضانة، النفقة، المشاهدة، حماية النساء والأطفال من العنف الأسري، والمساعدة في تحصيل حقوق الميراث.' : 'Representation in custody, alimony, civil and personal status courts, domestic protection.')}
                  {cat.id === 'labor' && (isRtl ? 'متابعة حقوق عمال المياومة، قضايا الفصل التعسفي، إصابات العمل، تحصيل مكافأة نهاية الخدمة، ومراجعة عقود العمل.' : 'Defending laborers in wage disputes, wrongful termination, and workplace injury compensations.')}
                  {cat.id === 'defense' && (isRtl ? 'حضور جلسات التوقيف، تقديم طلبات إخلاء السبيل بكفالة، رصد ضمانات المحاكمة العادلة، ومناهضة التوقيف غير القانوني.' : 'Representation during interrogation, bail applications, ensuring fair trial procedural standards.')}
                  {cat.id === 'civil' && (isRtl ? 'صياغة وتدقيق العقود والاتفاقيات، الاستشارات العقارية والمدنية، وحل النزاعات المجتمعية عبر الوساطة القانونية.' : 'Drafting formal agreements, civil consultations, and community legal mediation.')}
                  {cat.id === 'human_rights' && (isRtl ? 'توثيق الانتهاكات وفق المعايير الدولية، إعداد البلاغات العاجلة للأمم المتحدة، وإصدار التقارير الحقوقية الموثقة.' : 'Standardized documentation of violations, UN urgent appeals, and evidence-based reports.')}
                </p>

                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <a
                    href="#aid-form"
                    onClick={() => setCategory(cat.labelAr)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-amber-800 dark:text-stone-200 dark:hover:text-amber-400 transition-colors"
                  >
                    <span>{isRtl ? 'طلب مساعدة في هذا المجال' : 'Request Assistance in this Field'}</span>
                    {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE APPLICATION PORTAL & TRACKER */}
      <section id="aid-form" className="py-16 border-b border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Application Form */}
            <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase mb-2">
                <FileCheck className="h-4 w-4" />
                <span>{isRtl ? 'بوابة المواطنين والجمهور' : 'Citizens Legal Aid Portal'}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                {isRtl ? 'طلب استشارة أو تمثيل قانوني مجاني' : 'Submit a Free Legal Aid Request'}
              </h2>
              <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {isRtl
                  ? 'املأ النموذج أدناه لتسجيل طلبك لدى جمعية أسرار للمساعدة القانونية. سيتم دراسة الطلب من قبل فريق المحامين وتعيين مستشار لمتابعة قضيتك بسرية تامة وتواصل مباشر.'
                  : 'Submit your case details. Asrar legal panel reviews all requests confidentially and assigns an advocate within 24 hours.'}
              </p>

              {/* Success Alert with Reference Code */}
              {submittedCode && (
                <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isRtl ? 'تم تسجيل طلبك بنجاح في سجلات الجمعية!' : 'Your request has been successfully registered!'}</span>
                  </div>
                  <p className="mt-1 text-xs">
                    {isRtl ? 'رقم ملفك القانوني للمتابعة هو:' : 'Your official tracking reference code is:'}{' '}
                    <span className="font-mono font-bold text-sm underline">{submittedCode}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                    {isRtl ? 'احتفظ بهذا الرقم؛ يمكنك استخدامه في أداة التتبع أدناه لمعرفة حالة ملفك.' : 'Keep this code to track progress in the lookup panel.'}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitRequest} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'الاسم الرباعي أو الرمز المستعار' : 'Full Name or Alias'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isRtl ? 'مثال: محمد أحمد مصطفى' : 'Full Name'}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'رقم الهاتف للتواصل المباشر' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0599xxxxxx / 0587..."
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'المحافظة / مكان السكن' : 'Governorate / Location'}
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    >
                      {PALESTINIAN_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'درجة الاستعجال' : 'Urgency Level'}
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    >
                      <option value="عاجل جداً">{isRtl ? 'عاجل جداً (إخطار هدم / توقيف / مهلة قانونية تنتهي)' : 'Urgent (Demolition / Detention / Strict Deadline)'}</option>
                      <option value="متوسط">{isRtl ? 'متوسط (دعوى قائمة / استشارة متخصصة)' : 'Medium (Ongoing dispute)'}</option>
                      <option value="اعتيادي">{isRtl ? 'اعتيادي (استفسار حقوقي عام وتدقيق عقود)' : 'Standard (General advisory)'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRtl ? 'نوع المسألة القانونية' : 'Legal Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  >
                    {LEGAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.labelAr}>
                        {isRtl ? c.labelAr : c.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRtl ? 'تفاصيل القضية أو الاستشارة القانونية' : 'Case Summary & Legal Facts'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={isRtl ? 'يرجى كتابة ملخص الوقائع، التواريخ المهمة، وما إذا كانت هناك أوراق ثبوتية أو إخطارات استلمتها...' : 'Provide relevant facts, dates, court summons, or notices...'}
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <FolderLock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <span>{isRtl ? 'بياناتكم محمية بالسرية المهنية للمحاماة' : 'Professional client confidentiality protected'}</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white rounded-lg transition-colors whitespace-nowrap shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'إرسال الطلب للمراجعة' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Application Tracker & Hotlines */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tracker Card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase mb-2">
                  <Search className="h-4 w-4" />
                  <span>{isRtl ? 'نظام الاستعلام والمتابعة' : 'Case Status Tracker'}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
                  {isRtl ? 'تتبع مسار طلبك القانوني' : 'Track Your Legal File'}
                </h3>
                <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                  {isRtl ? 'أدخل الرقم المرجعي للطلب للتحقق من الموقف القانوني والمحامي المكلف.' : 'Enter your case reference code to view progress updates.'}
                </p>

                <form onSubmit={handleSearchStatus} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="ASRAR-2026-..."
                    className="flex-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-mono text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white transition-colors"
                  >
                    {isRtl ? 'استعلام' : 'Check'}
                  </button>
                </form>

                {/* Quick Test Demo Codes */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                  <span>{isRtl ? 'جرّب أكواد تجريبية:' : 'Try sample codes:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchCode('ASRAR-2026-8941');
                      const found = requestsList.find(r => r.id === 'ASRAR-2026-8941');
                      if (found) setSearchedRequest(found);
                    }}
                    className="underline hover:text-stone-900 dark:hover:text-white font-mono"
                  >
                    ASRAR-2026-8941
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchCode('ASRAR-2026-7832');
                      const found = requestsList.find(r => r.id === 'ASRAR-2026-7832');
                      if (found) setSearchedRequest(found);
                    }}
                    className="underline hover:text-stone-900 dark:hover:text-white font-mono"
                  >
                    ASRAR-2026-7832
                  </button>
                </div>

                {/* Search Result */}
                {searchedRequest && searchedRequest !== 'not_found' && (
                  <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-amber-800 dark:text-amber-400">{searchedRequest.id}</span>
                      <span className="font-semibold px-2 py-0.5 rounded text-[11px] bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-200">
                        {searchedRequest.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                      <div><strong>{isRtl ? 'المستفيد:' : 'Beneficiary:'}</strong> {searchedRequest.fullName}</div>
                      <div><strong>{isRtl ? 'المحافظة:' : 'Location:'}</strong> {searchedRequest.governorate}</div>
                      <div><strong>{isRtl ? 'المحامي المكلف:' : 'Assigned Counsel:'}</strong> {searchedRequest.lawyerName || 'قيد التكليف'}</div>
                      <div><strong>{isRtl ? 'تاريخ التسجيل:' : 'Date Registered:'}</strong> {searchedRequest.createdAt}</div>
                    </div>
                  </div>
                )}

                {searchedRequest === 'not_found' && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                    {isRtl ? 'لم يتم العثور على ملف بهذا الرقم. يرجى التأكد من الرقم أو الاتصال بنا على 0587155658.' : 'No case found matching this reference. Please verify or call 0587155658.'}
                  </div>
                )}
              </div>

              {/* Consultation Photo Card */}
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <img
                  src="/src/assets/images/legal_aid_consultation_1794225900412.jpg"
                  alt="Legal Consultation Room"
                  referrerPolicy="no-referrer"
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    {isRtl ? 'عيادات الاستشارة المباشرة بمقر الجمعية' : 'Direct Legal Consultations at Asrar HQ'}
                  </h4>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                    {isRtl
                      ? 'تستقبل جمعية أسرار في مقرها الرئيسي (رام الله، شارع مؤتة، عمارة الكواكب) المواطنين يومياً من الأحد إلى الخميس (9:00 ص - 4:00 م) لتقديم المشورة المباشرة وتدقيق المستندات.'
                      : 'Asrar welcomes citizens at its HQ (Ramallah, Mu\'tah St, Al-Kawakeb Bldg) Sunday to Thursday (9:00 AM - 4:00 PM) for in-person consultation and document auditing.'}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. INSTITUTIONAL FUNDING & GRANT OPPORTUNITIES (FOR DONORS) */}
      <section id="programs" className="py-16 border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/50">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
                {isRtl ? '02. الشراكات البرامجية والتمويل المؤسسي' : '02. Grant Portfolios & Institutional Funding'}
              </div>
              <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white sm:text-3xl">
                {isRtl ? 'برامج ومشاريع نوعية جاهزة للشراكة والدعم' : 'High-Impact Fundable Programs for Institutional Donors'}
              </h2>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {isRtl
                  ? 'تدعو جمعية أسرار للمساعدة القانونية المانحين الدوليين، الصناديق التنموية، والمؤسسات الشريكة للمساهمة في تمويل هذه البرامج الحيوية التي تمس مباشرة صمود وحقوق الفئات المهمشة في فلسطين.'
                  : 'We invite multilateral donors, trust funds, and international partners to co-fund prioritized legal aid and justice interventions.'}
              </p>
            </div>

            <a
              href="#partnership"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <HeartHandshake className="h-4 w-4" />
              <span>{isRtl ? 'طلب ملف الشراكة والمنح' : 'Request Grant Concept Notes'}</span>
            </a>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FUNDABLE_PROGRAMS.map((prog) => {
              const percentage = Math.round((prog.raisedBudget / prog.targetBudget) * 100);
              return (
                <div
                  key={prog.id}
                  className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-6 dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-mono">
                      <span>{prog.id}</span>
                      <span>{prog.beneficiariesCount} {isRtl ? 'مستفيد مستهدف' : 'Beneficiaries'}</span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-stone-900 dark:text-white font-serif">
                      {isRtl ? prog.titleAr : prog.titleEn}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRtl ? prog.taglineAr : prog.taglineEn}
                    </p>

                    <p className="mt-4 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                      {isRtl ? prog.descriptionAr : prog.descriptionEn}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-stone-600 dark:text-stone-400">
                          {isRtl ? 'الميزانية المستهدفة:' : 'Budget Target:'} <strong>${prog.targetBudget.toLocaleString()}</strong>
                        </span>
                        <span className="font-bold text-amber-800 dark:text-amber-400">
                          {percentage}% {isRtl ? 'مغطى' : 'Funded'}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="h-full rounded-full bg-amber-800 dark:bg-amber-500"
                        />
                      </div>
                    </div>

                    {/* Key Outcome Indicators */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                      {prog.indicators.map((ind, i) => (
                        <React.Fragment key={i}>
                          <span>{ind}</span>
                          {i < prog.indicators.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const el = document.getElementById('partnership');
                        el?.scrollIntoView({ behavior: 'smooth' });
                        setPartnerMessage(`نحن مهتمون بدعم وتمويل: ${isRtl ? prog.titleAr : prog.titleEn}`);
                      }}
                      className="text-xs font-semibold text-stone-900 hover:text-amber-800 dark:text-stone-200 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                    >
                      <span>{isRtl ? 'رعاية وتمويل هذا المشروع' : 'Sponsor this Program'}</span>
                      {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    </button>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      {isRtl ? 'تقارير أثر دورية مدققة' : 'Audited Impact Reports'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Clinic Photo Spotlight */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-900">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 p-8">
                <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase mb-2">
                  {isRtl ? 'الأثر الميداني المباشر' : 'Grassroots Outreach'}
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                  {isRtl ? 'العيادات القانونية المتنقلة في القرى والمخيمات' : 'Mobile Legal Units Reaching Isolated Communities'}
                </h3>
                <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                  {isRtl
                    ? 'بفضل دعم الشركاء، تسير جمعية أسرار مركبات مجهزة كعيادات قانونية متنقلة تصل للمزارعين، النساء، وسكان التجمعات البدوية والقرى المحاطة بالجدار، لتوفير الاستشارة على الأرض وتجهيز ملفات تثبيت الملكية دون تكليف المواطن عناء السفر وتكاليفه.'
                    : 'Our mobile legal vehicles bring specialized advocates directly to rural Palestinian villages and refugee camps, establishing on-site advisory desks to draft land title objections and resolve urgent disputes.'}
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                  <span>{isRtl ? 'تغطية مستمرة على مدار العام' : 'Year-round Operations'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{isRtl ? 'استجابة سريعة لإخطارات الهدم' : 'Rapid Emergency Dispatch'}</span>
                </div>
              </div>
              <div className="lg:col-span-6">
                <img
                  src="/src/assets/images/mobile_legal_clinic_rural_1794225901745.jpg"
                  alt="Mobile Legal Aid Clinic in Rural Palestine"
                  referrerPolicy="no-referrer"
                  className="h-80 w-full object-cover lg:h-96"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE DONOR IMPACT CALCULATOR */}
      <section className="py-16 border-b border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-800 dark:bg-stone-900 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5">
                <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase mb-2">
                  {isRtl ? 'محاكي أثر المنح والتبرعات' : 'Interactive Grant Impact Simulator'}
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                  {isRtl ? 'شاهد الأثر الفعلي المباشر لمساهمتك' : 'Calculate the Tangible Impact of Your Funding'}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {isRtl
                    ? 'في جمعية أسرار، نوجه أكثر من 88% من الميزانيات مباشرة لتكاليف المحاماة الميدانية والدفاع القضائي، مع كشوفات مالية مدققة وموثقة لكل دولار يتم إنفاقه.'
                    : 'Over 88% of your contribution directly funds grassroots legal defense, expert engineering files, and court appearances for impoverished families.'}
                </p>

                {/* Amount Selector Buttons */}
                <div className="mt-6">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
                    {isRtl ? 'اختر مبلغ المساهمة التقديري:' : 'Select Contribution Amount:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[250, 500, 1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationAmount(amt)}
                        className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                          donationAmount === amt
                            ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                        }`}
                      >
                        ${amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
                    {isRtl ? 'أو أدخل مبلغاً مخصصاً ($):' : 'Or Custom Amount ($):'}
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value) || 0)}
                    className="w-full sm:w-48 rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-sm font-mono text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Dynamic Impact Metric Outputs */}
              <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-stone-950 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
                  {isRtl ? `مساهمة بقيمة $${donationAmount.toLocaleString()} تحقق على الأرض:` : `A $${donationAmount.toLocaleString()} grant directly achieves:`}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                  <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="text-2xl font-bold font-mono text-amber-800 dark:text-amber-400">
                      {impactMetrics.cases}
                    </div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-white mt-1">
                      {isRtl ? 'قضية تمثيل قضائي كامل' : 'Full Court Defense Cases'}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRtl ? 'ترافع أمام المحاكم حتى صدور الحكم' : 'Complete representation through verdict'}
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="text-2xl font-bold font-mono text-amber-800 dark:text-amber-400">
                      {impactMetrics.consultations}
                    </div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-white mt-1">
                      {isRtl ? 'ساعة استشارة قانونية فردية' : 'Pro Bono Counseling Hours'}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRtl ? 'تقديم حلول قانونية فورية وتدقيق وثائق' : 'Direct advisory for families & workers'}
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="text-2xl font-bold font-mono text-amber-800 dark:text-amber-400">
                      {impactMetrics.outreachHours}
                    </div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-white mt-1">
                      {isRtl ? 'ساعة عمل عيادة متنقلة' : 'Mobile Clinic Field Hours'}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRtl ? 'في القرى والمخيمات النائية' : 'In isolated and threatened villages'}
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="text-2xl font-bold font-mono text-amber-800 dark:text-amber-400">
                      {impactMetrics.printedGuides}
                    </div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-white mt-1">
                      {isRtl ? 'دليل حقوقي توعوي مطبوع وموزع' : 'Rights Handbooks Distributed'}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRtl ? 'تمكين المواطنين من معرفة حقوقهم' : 'Empowering communities with legal literacy'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {isRtl ? 'يتم إصدار تقارير تدقيق وشهادات استلام رسمية لكل مانح.' : 'Official financial receipts and audit certificates issued.'}
                  </span>
                  <a
                    href="#partnership"
                    className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline"
                  >
                    {isRtl ? 'تثبيت التبرع والشراكة ←' : 'Formalize Grant Partnership →'}
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. INSTITUTIONAL GOVERNANCE, TRANSPARENCY & AUDIT */}
      <section id="governance" className="py-16 border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
                {isRtl ? '03. النزاهة والحوكمة والامتثال' : '03. Transparency & Certified Governance'}
              </div>
              <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white sm:text-3xl">
                {isRtl ? 'التزام مطلق بالشفافية والتدقيق المالي المستقل' : 'Rigorous Institutional Governance & External Audits'}
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                {isRtl
                  ? 'تعمل جمعية أسرار للمساعدة القانونية وفق أعلى معايير الحوكمة الرشيدة للجمعيات الأهلية، وتخضع حساباتها لتدقيق سنوي من قبل شركة تدقيق حسابات قانونية مستقلة معتمدة، مع نشر تقارير الإنجاز والبيانات المالية سنوياً للمانحين والجمهور.'
                  : 'Asrar Legal adheres to strict civil society financial compliance and accountability. Our accounts undergo mandatory annual auditing by licensed independent auditors, with reports published transparently.'}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-900">
                  <CheckCircle2 className="h-5 w-5 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-stone-900 dark:text-white block">{isRtl ? 'التسجيل والترخيص الرسمي' : 'Official Legal Registration'}</strong>
                    <span className="text-stone-600 dark:text-stone-400">
                      {isRtl ? 'مسجلة رسمياً كجمعية خيرية غير ربحية في دولة فلسطين وممتثلة لقانون الجمعيات الخيرية والهيئات الأهلية رقم (1) لسنة 2000.' : 'Duly registered under Palestinian Law of Charitable Associations and Civil Society Organizations No. 1.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-900">
                  <CheckCircle2 className="h-5 w-5 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-stone-900 dark:text-white block">{isRtl ? 'مجلس إدارة ولجنة استشارية مستقلة' : 'Independent Board & Advisory Oversight'}</strong>
                    <span className="text-stone-600 dark:text-stone-400">
                      {isRtl ? 'تضم الجمعية نخبة من كبار المحامين والأساتذة الجامعيين والحقوقيين الفلسطينيين لضمان استقلالية القرارات وتطبيق مبادئ الشفافية.' : 'Guided by distinguished jurists, legal academics, and veteran Palestinian human rights advocates.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-900">
                  <CheckCircle2 className="h-5 w-5 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-stone-900 dark:text-white block">{isRtl ? 'التقارير المالية والسنوية المتاحة للتحميل' : 'Published Annual Audit Statements'}</strong>
                    <span className="text-stone-600 dark:text-stone-400">
                      {isRtl ? 'نوفر للمانحين كشوفات التكاليف الدقيقة والتقارير المالية المدققة للفترات السابقة مع مؤشرات الأثر.' : 'Financial statements and narrative impact evaluations are systematically provided to all funding bodies.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Sample Audit Package */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => alert(isRtl ? 'تم تجهيز ملف التقرير السنوي المدقق 2025/2026 بصيغة PDF. للتواصل مع الإدارة: info@asrarlegal.org أو الاتصال على 0587155658' : 'Annual Audit Report 2025/2026 requested. Contact: info@asrarlegal.org or call 0587155658')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 dark:text-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isRtl ? 'تحميل التقرير السنوي والمالي المدقق (PDF)' : 'Download Audited Annual Report (PDF)'}</span>
                </button>
              </div>
            </div>

            {/* Right: Governance Report Image */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-stone-300 bg-stone-100 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <img
                  src="/src/assets/images/governance_transparency_report_1794225900485.jpg"
                  alt="Certified Institutional Reports and Legal Audit"
                  referrerPolicy="no-referrer"
                  className="h-80 w-full object-cover lg:h-96"
                />
                <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center justify-between">
                    <span>{isRtl ? 'سجل الشفافية والأداء المؤسسي' : 'Institutional Oversight & Audit Record'}</span>
                    <a href="https://www.asrarlegal.org" target="_blank" rel="noopener noreferrer" className="font-mono underline">
                      www.asrarlegal.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. LEGAL RIGHTS LIBRARY & GUIDES (PUBLIC LEGAL LITERACY) */}
      <section id="library" className="py-16 border-b border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
              {isRtl ? '04. مكتبة التوعية والحقوق' : '04. Legal Literacy & Rights Guides'}
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              {isRtl ? 'أدلة حقوقية ومطبوعات إرشادية للمواطنين' : 'Empowering Citizens through Accessible Legal Knowledge'}
            </h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {isRtl
                ? 'أدلة مبسطة أعدها كبار المحامين والباحثين في جمعية أسرار لتمكين الفئات المجتمعية من حماية حقوقهم وفهم الإجراءات القانونية.'
                : 'Free practical manuals covering land rights, labor contracts, fair trial guarantees, and personal status claims.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEGAL_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400">
                    <span>{isRtl ? guide.categoryAr : guide.categoryEn}</span>
                    <span className="font-mono text-stone-400">{guide.pages} {isRtl ? 'صفحة' : 'pages'}</span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-stone-900 dark:text-white line-clamp-2">
                    {isRtl ? guide.titleAr : guide.titleEn}
                  </h3>

                  <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                    {isRtl ? guide.summaryAr : guide.summaryEn}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-400">{guide.fileSize}</span>
                  <button
                    type="button"
                    onClick={() => alert(isRtl ? `بدء تحميل: ${guide.titleAr} (${guide.fileSize})` : `Downloading: ${guide.titleEn}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-amber-800 dark:text-stone-200 dark:hover:text-amber-400 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'تحميل الدليل' : 'Download'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8.5 VOLUNTEERING OPPORTUNITIES SECTION */}
      <section id="volunteer" className="py-16 border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
              <UserCheck className="h-4 w-4" />
              <span>{isRtl ? '05. شبكة المتطوعين والخبراء' : '05. Volunteer Legal Network'}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              {isRtl ? 'فرص التطوع مع جمعية أسرار للمساعدة القانونية' : 'Volunteering Opportunities for Lawyers & Legal Researchers'}
            </h2>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              {isRtl
                ? 'ندعو المحامين المزاولين والمتدربين والباحثين القانونيين وطلبة الحقوق للانضمام إلى شبكة أسرار القانونية التطوعية. تطوعك يمثل عوناً حقيقياً ومباشراً لأسر لا تمتلك تكاليف الدفاع، ويسهم في حماية الأرض والكرامة الإنسانية في فلسطين.'
                : 'Join our dedicated pro-bono network. Whether providing court representation, community consultations, or legislative policy research, your expertise directly empowers marginalized communities.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Info & Pillars Column */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-6 dark:border-stone-800 dark:bg-stone-900">
                <h3 className="text-base font-bold font-serif text-stone-900 dark:text-white mb-4">
                  {isRtl ? 'لماذا تتطوع مع جمعية أسرار؟' : 'Why Volunteer With Asrar?'}
                </h3>
                
                <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 dark:text-white block mb-0.5">
                        {isRtl ? 'خبرة عملية وميدانية استثنائية' : 'High-Impact Practical Experience'}
                      </strong>
                      <span>
                        {isRtl ? 'المشاركة في الترافع وصياغة اللوائح أمام المحاكم النظامية والشرعية في قضايا استراتيجية.' : 'Hands-on litigation and memorandum drafting in vital human rights and land defense files.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="h-4 w-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 dark:text-white block mb-0.5">
                        {isRtl ? 'شهادات خبرة وتطوع رسمية معتمدة' : 'Official Accredited Pro Bono Certificates'}
                      </strong>
                      <span>
                        {isRtl ? 'توثيق رسمي لساعات التطوع والملفات المنجزة، مع خطابات تزكية مهنية للمنح والدراسات العليا.' : 'Certified service hours record and institutional reference letters for scholarships and fellowships.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900 dark:text-white block mb-0.5">
                        {isRtl ? 'المشاركة في العيادات المتنقلة' : 'Mobile Legal Outreach Deployment'}
                      </strong>
                      <span>
                        {isRtl ? 'النزول الميداني المباشر إلى القرى والتجمعات المهمشة والمخيمات ومساندة المواطنين على أرضهم.' : 'Direct community engagement in rural villages, bedouin communities, and refugee camps.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                  <span>{isRtl ? 'تغطية تكاليف التنقل الميداني' : 'Field Transport Stipends Provided'}</span>
                  <span>·</span>
                  <span>{isRtl ? 'إشراف كبار المحامين' : 'Mentorship by Senior Jurists'}</span>
                </div>
              </div>

              {/* Quote / Institutional Pledge */}
              <div className="rounded-2xl border border-stone-200 bg-[#FAF8F5] p-6 dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-400 text-xs font-semibold">
                  <Scale className="h-4 w-4" />
                  <span>{isRtl ? 'ميثاق التطوع المهني' : 'Pro Bono Covenant'}</span>
                </div>
                <blockquote className="text-xs italic text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  {isRtl
                    ? '"إن العمل التطوعي القانوني ليس واجباً إنسانياً فحسب، بل هو ركيزة أساسية لصمود المجتمع الفلسطيني، وضمان ألا يُترك أي مواطن مستضعف وحيداً في مواجهة الظلم."'
                    : '"Legal pro-bono service is not only a humanitarian duty, but a cornerstone of Palestinian resilience, ensuring no vulnerable citizen stands alone before injustice."'}
                </blockquote>
                <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400">
                  {isRtl ? '— منسقية العون القانوني وشؤون المتطوعين · جمعية أسرار' : '— Pro Bono Coordination Unit · Asrar Legal'}
                </div>
              </div>

            </div>

            {/* Right: Registration Form */}
            <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
                {isRtl ? 'نموذج تسجيل المحامين والباحثين المتطوعين' : 'Volunteer Registration Form'}
              </h3>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {isRtl
                  ? 'يرجى تعبئة بياناتكم المهنية ومجال التخصص القانوني المفضل. سيتواصل معكم منسق دائرة المتطوعين بجمعية أسرار لتنسيق مجالات العمل المشترك.'
                  : 'Complete your professional profile and preferred legal specialization. Our team will contact you to coordinate engagement.'}
              </p>

              {/* Success Notification */}
              {volSubmittedCode && (
                <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isRtl ? 'تم استلام طلب تطوعكم ببالغ التقدير والامتنان!' : 'Your volunteer application was received successfully!'}</span>
                  </div>
                  <p className="mt-1 text-xs">
                    {isRtl ? 'رقم طلب التطوع المرجعي:' : 'Volunteer Registration Code:'}{' '}
                    <span className="font-mono font-bold text-sm underline">{volSubmittedCode}</span>
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                    {isRtl
                      ? 'نشكر رغبتكم في إسناد قضايا شعبنا. سيتواصل معكم منسق العون القانوني قريباً عبر الهاتف أو البريد الإلكتروني.'
                      : 'Thank you for your commitment to justice. Our pro-bono coordinator will reach out shortly.'}
                  </p>
                </div>
              )}

              <form onSubmit={handleVolunteerSubmit} className="mt-6 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      placeholder={isRtl ? 'الاسم الثلاثي أو الرباعي' : 'Full Name'}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      placeholder="0599xxxxxx / 0568..."
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                      placeholder="lawyer@example.org"
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'المحافظة / مكان الإقامة' : 'Governorate / Residence'}
                    </label>
                    <select
                      value={volGov}
                      onChange={(e) => setVolGov(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    >
                      {PALESTINIAN_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'الصفة والوضع المهني' : 'Professional Role'}
                    </label>
                    <select
                      value={volRole}
                      onChange={(e) => setVolRole(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    >
                      <option value="محامٍ مزاول (عضو نقابة المحامين)">{isRtl ? 'محامٍ مزاول (عضو نقابة المحامين)' : 'Practicing Lawyer (Bar Member)'}</option>
                      <option value="محامٍ متدرب">{isRtl ? 'محامٍ متدرب' : 'Trainee Lawyer'}</option>
                      <option value="باحث قانوني / أكاديمي">{isRtl ? 'باحث قانوني / أكاديمي' : 'Legal Researcher / Academic'}</option>
                      <option value="خريج قانون / دراسات عليا">{isRtl ? 'خريج قانون / طالب دراسات عليا' : 'Law Graduate / Postgraduate'}</option>
                      <option value="طالب حقوق سنة رابعة">{isRtl ? 'طالب حقوق (سنة رابعة/تخرج)' : 'Senior Law Student'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {isRtl ? 'الساعات المتاحة أسبوعياً' : 'Weekly Availability'}
                    </label>
                    <select
                      value={volHours}
                      onChange={(e) => setVolHours(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                    >
                      <option value="2 - 4 ساعات أسبوعياً">{isRtl ? '2 - 4 ساعات أسبوعياً' : '2 - 4 hours / week'}</option>
                      <option value="5 - 8 ساعات أسبوعياً">{isRtl ? '5 - 8 ساعات أسبوعياً' : '5 - 8 hours / week'}</option>
                      <option value="أكثر من 8 ساعات أسبوعياً">{isRtl ? 'أكثر من 8 ساعات أسبوعياً' : '8+ hours / week'}</option>
                      <option value="حسب الحاجة في الحملات والمهام الطارئة">{isRtl ? 'حسب الحاجة في الحملات والمهام الطارئة' : 'On-call for emergency cases'}</option>
                    </select>
                  </div>
                </div>

                {/* THE REQUESTED LEGAL SPECIALIZATION FIELD */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRtl ? 'مجال التخصص القانوني المفضل للمساهمة فيه' : 'Legal Field of Specialization'} *
                  </label>
                  <select
                    value={volSpecialty}
                    onChange={(e) => setVolSpecialty(e.target.value)}
                    className="w-full rounded-lg border border-amber-300 bg-amber-50/50 px-3 py-2 text-sm text-stone-900 font-medium focus:border-stone-900 focus:outline-none dark:border-amber-900/60 dark:bg-stone-800 dark:text-white"
                  >
                    <option value="قضايا الأراضي والملكية ومقاومة إخطارات الهدم">{isRtl ? 'قضايا الأراضي والملكية ومقاومة إخطارات الهدم' : 'Land Rights, Property & Demolition Defense'}</option>
                    <option value="قضايا الأسرة والأحوال الشخصية وحماية المرأة والطفل">{isRtl ? 'قضايا الأسرة والأحوال الشخصية وحماية المرأة والطفل' : 'Family Law & Domestic Protection'}</option>
                    <option value="قانون العمل والنزاعات العمالية وحقوق العمال">{isRtl ? 'قانون العمل والنزاعات العمالية وحقوق العمال' : 'Labor Law & Workers Rights'}</option>
                    <option value="الدفاع الجنائي وضمانات المحاكمة العادلة">{isRtl ? 'الدفاع الجنائي وضمانات المحاكمة العادلة وحالات التوقيف' : 'Criminal Defense & Fair Trial Standards'}</option>
                    <option value="البحوث القانونية وصياغة مذكرات الموقف والدراسات">{isRtl ? 'البحوث القانونية وصياغة مذكرات الموقف والدراسات التشريعية' : 'Legal Research & Policy Memoranda'}</option>
                    <option value="التوثيق الحقوقي والرصد والمناصرة الدولية">{isRtl ? 'التوثيق الحقوقي والرصد والمناصرة الدولية' : 'Human Rights Documentation & International Advocacy'}</option>
                    <option value="الاستشارات المدنية العامة وحل النزاعات المجتمعية">{isRtl ? 'الاستشارات المدنية العامة والوساطة المجتمعية' : 'Civil Advisory & Community Mediation'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRtl ? 'شكل المساهمة والتطوع المفضل' : 'Preferred Contribution Format'}
                  </label>
                  <select
                    value={volType}
                    onChange={(e) => setVolType(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  >
                    <option value="التمثيل القضائي التطوعي والترافع أمام المحاكم">{isRtl ? 'التمثيل القضائي التطوعي والترافع أمام المحاكم (Pro Bono Cases)' : 'Pro Bono Court Representation'}</option>
                    <option value="تقديم استشارات قانونية بمقر الجمعية برام الله">{isRtl ? 'تقديم استشارات قانونية مباشرة بمقر الجمعية برام الله' : 'Direct Consultations at Asrar Ramallah HQ'}</option>
                    <option value="النزول الميداني مع طواقم العيادات المتنقلة">{isRtl ? 'النزول الميداني مع طواقم العيادات القانونية المتنقلة في القرى' : 'Mobile Clinic Field Deployments'}</option>
                    <option value="إعداد البحوث وأوراق الموقف وصياغة الأدلة">{isRtl ? 'إعداد البحوث وأوراق الموقف وصياغة الأدلة التوعوية' : 'Drafting Policy Papers & Rights Guides'}</option>
                    <option value="تنظيم وتقديم ورشات التوعية المجتمعية">{isRtl ? 'تنظيم وتقديم ورشات التوعية المجتمعية' : 'Conducting Community Awareness Workshops'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRtl ? 'نبذة عن الخبرة السابقة أو دوافع التطوع' : 'Brief Bio or Motivation'}
                  </label>
                  <textarea
                    rows={3}
                    value={volBio}
                    onChange={(e) => setVolBio(e.target.value)}
                    placeholder={isRtl ? 'أذكر نبذة موجزة عن خبراتك السابقة، وسنوات المزاولة أو مجالات الاهتمام الخاصة...' : 'Mention relevant legal experience, bar admission year, or specific interests...'}
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3 text-sm text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                    <UserCheck className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <span>{isRtl ? 'يتم حفظ السجلات بسرية وفق ميثاق التطوع المهني' : 'Handled according to our professional volunteer charter'}</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'إرسال طلب الانضمام لشبكة المتطوعين' : 'Submit Volunteer Application'}</span>
                  </button>
                </div>

              </form>
            </div>

          </div>

        </div>
      </section>

      {/* 9. INSTITUTIONAL PARTNERSHIP & GRANT PROPOSAL FORM */}
      <section id="partnership" className="py-16 bg-stone-900 text-white dark:bg-black border-t border-stone-800">
        <div className="mx-auto max-w-7xl px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                <Building2 className="h-4 w-4" />
                <span>{isRtl ? 'بوابة المنظمات والمانحين' : 'Institutional Partners & Donors'}</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white leading-tight">
                {isRtl ? 'كن شريكاً مع جمعية أسرار في ترسيخ العدالة' : 'Partner with Asrar Association to Advance Justice'}
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isRtl
                  ? 'ترحب جمعية أسرار للمساعدة القانونية (www.asrarlegal.org) بالشراكات الإستراتيجية مع الصناديق التنموية، المنظمات الحقوقية الإقليمية والدولية، والجهات المانحة لتوسيع مظلة العون القانوني والوصول للمناطق الأكثر تهميشاً.'
                  : 'We invite international donors, human rights funds, and civil society alliances to collaborate on joint project proposals, sub-grants, and advocacy campaigns.'}
              </p>

              {/* Updated Official Contact Details */}
              <div className="mt-6 space-y-3 text-xs text-stone-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{isRtl ? 'المقر: رام الله، شارع مؤتة، عمارة الكواكب' : 'Address: Ramallah, Mu\'tah St, Al-Kawakeb Bldg'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                  <a href="tel:0587155658" className="hover:text-white font-mono">0587155658</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                  <a href="mailto:info@asrarlegal.org" className="hover:text-white font-mono">info@asrarlegal.org</a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-amber-400 shrink-0" />
                  <a href="https://www.asrarlegal.org" target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono underline">
                    www.asrarlegal.org
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <a
                    href="https://www.facebook.com/profile.php?id=61572062862017"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white text-blue-300 underline"
                  >
                    {isRtl ? 'صفحة الفيسبوك الرسمية' : 'Official Facebook Page'}
                  </a>
                </div>
              </div>
            </div>

            {/* Partnership Form */}
            <div className="lg:col-span-7 bg-stone-800/90 p-8 rounded-2xl border border-stone-700 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">
                {isRtl ? 'طلب عقد شراكة / تقديم منحة أو استفسار تمويلي' : 'Submit Partnership or Grant Inquiry'}
              </h3>
              <p className="text-xs text-stone-300 mb-6">
                {isRtl
                  ? 'سنقوم بإرسال الملف التعريفي للمشاريع (Concept Notes) واللوائح المالية المعتمدة خلال 24 ساعة.'
                  : 'Our institutional development office will follow up with concept notes and certified audit records.'}
              </p>

              {partnerSubmitted ? (
                <div className="p-4 rounded-lg bg-amber-900/40 border border-amber-600 text-amber-200 text-xs">
                  <div className="font-bold flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <span>{isRtl ? 'شكراً لاهتمامكم بالشراكة!' : 'Thank you for your partnership inquiry!'}</span>
                  </div>
                  <span>{isRtl ? 'تم استلام بيانات منظمتكم، وسيتواصل معكم فريق جمعية أسرار قريباً عبر البريد أو الهاتف.' : 'Our director of institutional partnerships will contact you shortly.'}</span>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-stone-300 mb-1">{isRtl ? 'اسم المنظمة / الجهة المانحة' : 'Organization Name'} *</label>
                      <input
                        type="text"
                        required
                        value={partnerOrg}
                        onChange={(e) => setPartnerOrg(e.target.value)}
                        placeholder={isRtl ? 'مثال: مؤسسة حقوقية دولية / صندوق تنموي' : 'e.g. Foundation / Donor Agency'}
                        className="w-full rounded-lg border border-stone-600 bg-stone-900 px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-stone-300 mb-1">{isRtl ? 'البريد الإلكتروني المؤسسي' : 'Official Email'} *</label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="grants@organization.org"
                        className="w-full rounded-lg border border-stone-600 bg-stone-900 px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1">{isRtl ? 'نوع التعاون أو التمويل المستهدف' : 'Type of Collaboration / Funding'}</label>
                    <select
                      value={partnerType}
                      onChange={(e) => setPartnerType(e.target.value)}
                      className="w-full rounded-lg border border-stone-600 bg-stone-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="منظمة دولية / مانح مؤسسي">{isRtl ? 'تمويل مشروع كامل / منحة مؤسسية (Grant)' : 'Institutional Project Grant'}</option>
                      <option value="ائتلاف وشراكة برامجية">{isRtl ? 'شراكة ائتلافية في مقترح مشروع (Consortium)' : 'Programmatic Consortium / Joint Bid'}</option>
                      <option value="رعاية عيادة قانونية متنقلة">{isRtl ? 'رعاية سنوية لعيادة قانونية متنقلة' : 'Sponsoring a Mobile Legal Clinic'}</option>
                      <option value="تبرع مباشر لصندوق الدفاع القضائي">{isRtl ? 'مساهمة في صندوق الدفاع القضائي للمستضعفين' : 'Contribution to Indigent Defense Fund'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-300 mb-1">{isRtl ? 'رسالة / مجالات الاهتمام المحددة' : 'Message / Scope of Interest'}</label>
                    <textarea
                      rows={3}
                      value={partnerMessage}
                      onChange={(e) => setPartnerMessage(e.target.value)}
                      placeholder={isRtl ? 'نود الاستفسار عن تفاصيل مقترحات المشاريع وإمكانية دعم الفئات في مناطق...' : 'Please specify project focus, target governorates, or budget guidelines...'}
                      className="w-full rounded-lg border border-stone-600 bg-stone-900 p-3 text-xs text-white placeholder:text-stone-500 focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-sans shadow-sm"
                  >
                    {isRtl ? 'إرسال طلب الشراكة والتمويل' : 'Send Partnership & Grant Inquiry'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 9.5 FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      <section id="faq" className="py-16 border-b border-stone-200 bg-[#FAF8F5] dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-5xl px-6">
          
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">
              <HelpCircle className="h-4 w-4" />
              <span>{isRtl ? '06. دليل الإجابات والاستفسارات' : '06. Legal Aid FAQ'}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white sm:text-3xl">
              {isRtl ? 'أسئلة شائعة حول المساعدة القانونية' : 'Frequently Asked Questions'}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              {isRtl
                ? 'إجابات شاملة من الفريق القانوني بجمعية أسرار توضح شروط الاستحقاق، الأوراق والوثائق الثبوتية المطلوبة، مدد دراسة الملفات، وآليات متابعة القضايا وسريتها.'
                : 'Clear guidance on eligibility conditions, required supporting documentation, case assignment timelines, and confidentiality guarantees.'}
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-amber-300 bg-white shadow-sm ring-1 ring-amber-400/20 dark:border-amber-900/60 dark:bg-stone-900'
                      : 'border-stone-200 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900/70 dark:hover:border-stone-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-start transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                        {isRtl ? faq.categoryAr : faq.categoryEn}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                        {isRtl ? faq.questionAr : faq.questionEn}
                      </h3>
                    </div>
                    <div className={`p-1.5 rounded-full transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'text-stone-400 hover:text-stone-700'}`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                      <p>{isRtl ? faq.answerAr : faq.answerEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Help Card */}
          <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 dark:border-stone-800 dark:bg-stone-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-start">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                {isRtl ? 'هل لديك استفسار قانوني خاص أو لم تجد إجابة لسؤالك؟' : 'Have a specific legal question not answered above?'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRtl
                  ? 'فريق جمعية أسرار جاهز لاستقبال اتصالاتكم أو زيارتكم في مقرنا: رام الله، شارع مؤتة، عمارة الكواكب.'
                  : 'Contact our legal team directly at 0587155658 or visit our HQ in Ramallah, Mu\'tah St.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:0587155658"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 dark:text-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400" />
                <span className="font-mono">0587155658</span>
              </a>

              <a
                href="#aid-form"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors shadow-sm"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>{isRtl ? 'تقديم طلب مساعدة الآن' : 'Apply for Legal Aid'}</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 10. QUIET INSTITUTIONAL FOOTER */}
      <footer className="border-t border-stone-200 bg-white py-12 px-6 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-200 dark:border-stone-800">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/assets/aistudio/logo_b3627de6.png"
                  alt="شعار جمعية أسرار للمساعدة القانونية"
                  className="h-12 w-12 object-contain shrink-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700"
                />
                <div>
                  <span className="font-serif font-bold text-base text-stone-900 dark:text-white block">
                    {isRtl ? 'جمعية أسرار للمساعدة القانونية' : 'Asrar Association for Legal Aid'}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Charitable Legal Aid Association · ASRAR
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md leading-relaxed font-sans">
                {isRtl
                  ? 'جمعية أهلية فلسطينية غير ربحية مسجلة رسمياً. تسعى إلى تعزيز سيادة القانون وتمكين المجتمع حقوقياً وقانونياً، وتقديم الدعم والمساعدة القانونية الشاملة للفئات المستحقة والمهمشة، وترسيخ مفاهيم العدالة والشفافية.'
                  : 'An officially registered Palestinian non-profit NGO dedicated to the rule of law, comprehensive legal aid, and human dignity.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
                <a href="https://www.asrarlegal.org" target="_blank" rel="noopener noreferrer" className="text-amber-800 dark:text-amber-400 hover:underline">
                  www.asrarlegal.org
                </a>
                <span>·</span>
                <a href="mailto:info@asrarlegal.org" className="hover:underline">
                  info@asrarlegal.org
                </a>
                <span>·</span>
                <a href="tel:0587155658" className="hover:underline">
                  0587155658
                </a>
              </div>
            </div>

            <div>
              <div className="font-bold text-stone-900 dark:text-white mb-3">
                {isRtl ? 'روابط الوصول السريع' : 'Quick Access'}
              </div>
              <ul className="space-y-2 text-xs">
                <li><a href="#aid-form" className="hover:underline">{isRtl ? 'تقديم طلب مساعدة قانونية' : 'Apply for Legal Aid'}</a></li>
                <li><a href="#programs" className="hover:underline">{isRtl ? 'برامج التمويل للمانحين' : 'Grant Programs'}</a></li>
                <li><a href="#governance" className="hover:underline">{isRtl ? 'التقارير المالية والشفافية' : 'Financial Audits'}</a></li>
                <li><a href="#library" className="hover:underline">{isRtl ? 'أدلة حقوق المواطن' : 'Rights Handbooks'}</a></li>
                <li><a href="#volunteer" className="hover:underline text-amber-800 dark:text-amber-400 font-semibold">{isRtl ? 'فرص التطوع للمحامين' : 'Volunteer Pro Bono'}</a></li>
                <li><a href="#faq" className="hover:underline">{isRtl ? 'الأسئلة الشائعة' : 'FAQ'}</a></li>
                <li><a href="#contact" className="hover:underline">{isRtl ? 'معلومات المقر والتواصل' : 'Headquarters & Location'}</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-stone-900 dark:text-white mb-3">
                {isRtl ? 'العنوان والتواصل المباشر' : 'Official Contact'}
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{isRtl ? 'رام الله، شارع مؤتة، عمارة الكواكب' : 'Ramallah, Mu\'tah St, Al-Kawakeb Bldg'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                  <a href="tel:0587155658" className="font-mono hover:underline">0587155658</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                  <a href="mailto:info@asrarlegal.org" className="font-mono hover:underline">info@asrarlegal.org</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400 shrink-0" />
                  <a href="https://www.asrarlegal.org" target="_blank" rel="noopener noreferrer" className="font-mono hover:underline">www.asrarlegal.org</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <a
                    href="https://www.facebook.com/profile.php?id=61572062862017"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {isRtl ? 'صفحة الفيسبوك الرسمية' : 'Facebook Page'}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 dark:text-stone-400">
            <div>
              © 2026 {isRtl ? 'جمعية أسرار للمساعدة القانونية (www.asrarlegal.org). جميع الحقوق محفوظة.' : 'Asrar Legal Aid Association (www.asrarlegal.org). All rights reserved.'}
            </div>
            <div className="flex items-center gap-3">
              <span>{isRtl ? 'مسجلة رسمياً في دولة فلسطين' : 'Registered in the State of Palestine'}</span>
              <span aria-hidden="true">·</span>
              <span>{isRtl ? 'رام الله، شارع مؤتة، عمارة الكواكب' : 'Ramallah, Palestine'}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
