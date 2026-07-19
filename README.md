# موقع لُمّة

مشروع موقع ثابت، ثنائي اللغة، مبني على التصميم والمحتوى الأصليين للصفحة الرئيسية. لا يحتاج إلى إطار عمل أو مكتبات JavaScript خارجية، ويمكن نشره مباشرة على GitHub Pages أو أي استضافة ثابتة.

## هيكل المشروع

```text
lamma-site/
├─ index.html                  # الصفحة الرئيسية
├─ gatherings/index.html      # اللمات
├─ fellowship/index.html      # الزمالة الإبداعية
├─ spaces/index.html          # المساحات المشتركة
├─ contact/index.html         # التواصل والانضمام
├─ 404.html                   # صفحة عدم العثور لـ GitHub Pages
├─ assets/
│  ├─ css/styles.css          # الهوية والتنسيقات والاستجابة
│  ├─ js/config.js            # روابط Tally وحسابات التواصل
│  ├─ js/main.js              # اللغة والقائمة والتنقل المشترك
│  ├─ icons/                  # Favicon وأيقونات الأجهزة
│  └─ images/
│     ├─ logo/
│     ├─ gatherings/
│     ├─ fellowship/
│     ├─ spaces/
│     ├─ community/
│     └─ general/
└─ scripts/                   # تشغيل محلي وفحص الروابط
```

## إضافة الشعار

استبدل الملف التالي بالشعار الرسمي مع الحفاظ على الاسم والمسار نفسه:

`assets/images/logo/lamma-logo.svg`

لا يلزم تعديل HTML أو CSS بعد الاستبدال.

## إضافة Favicon وأيقونات الموقع

استبدل الملفات التالية مع الحفاظ على أسمائها:

- `assets/icons/favicon.svg`
- `assets/icons/favicon-32.png`
- `assets/icons/apple-touch-icon.png`

جميع الصفحات مرتبطة بهذه الملفات مسبقًا.

## إضافة الصور

ضع الصور النهائية في المجلد المناسب داخل `assets/images/`. ملفات `placeholder.svg` مؤقتة وتوضح أماكن الصور الحالية. راجع أيضًا `assets/images/README.md`.

## تعديل روابط Tally وروابط التواصل

عدّل القيم فقط في:

`assets/js/config.js`

القيم المجهزة هي:

- `TALLY_GATHERINGS_URL`
- `TALLY_FELLOWSHIP_URL`
- `TALLY_SPACES_URL`
- `TALLY_CONTACT_URL`
- `INSTAGRAM_URL`
- `TIKTOK_URL`
- `LINKEDIN_URL`
- `X_URL`

عند وضع رابط كامل يبدأ بـ `https://` سيتم تفعيله تلقائيًا في جميع الصفحات. قبل ذلك، تتجه أزرار الصفحات إلى صفحة التواصل الداخلية، وتظهر خيارات Tally داخل صفحة التواصل بحالة غير مفعلة بدل إرسال الزائر إلى رابط مكسور.

## تشغيل الموقع

يتطلب Node.js 18 أو أحدث:

```bash
npm run dev
```

أو بدون npm:

```bash
node scripts/serve.mjs
```

ثم افتح `http://127.0.0.1:4173`.

لفحص الروابط والملفات المحلية:

```bash
npm run check
```

أو: `node scripts/check-links.mjs`.

يمكن أيضًا فتح `index.html` مباشرة، لكن الخادم المحلي هو الطريقة المفضلة أثناء التطوير.

## النشر

المشروع ثابت ولا يحتاج إلى عملية بناء. ارفع محتويات المجلد إلى مستودع GitHub، ثم فعّل GitHub Pages من جذر الفرع المطلوب. جميع المسارات نسبية لتعمل عند النشر داخل مسار مستودع فرعي.
