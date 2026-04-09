# Xarz Studio — دليل النشر على Vercel

## هيكل المشروع
```
xarz-studio/
├── vercel.json          ← إعدادات Vercel
├── api/
│   └── auth.js          ← Serverless function للتحقق من تسجيل الدخول
└── public/
    ├── index.html       ← الواجهة الرئيسية
    ├── style.css        ← كل الأنماط
    └── app.js           ← كل منطق التطبيق
```

## خطوات النشر

### 1. ارفع المشروع على GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/USERNAME/xarz-studio.git
git push -u origin main
```

### 2. اربط المشروع بـ Vercel
- افتح [vercel.com](https://vercel.com)
- اضغط **Add New → Project**
- اختر الـ repository من GitHub
- اضغط **Deploy**

### 3. أضف Environment Variables (الـ Secrets) ⚠️
بعد النشر، افتح:
**Project → Settings → Environment Variables**

أضف هذين المتغيرين:

| Name       | Value                    | Environment |
|------------|--------------------------|-------------|
| `EMAIL`    | بريدك الإلكتروني          | Production  |
| `PASSWORD` | كلمة المرور              | Production  |

ثم اضغط **Redeploy** حتى تأخذ المتغيرات مفعولها.

### 4. جاهز ✓
الأداة ستكون متاحة على رابط Vercel الخاص بك.

---

## كيف يعمل نظام المصادقة؟
1. المستخدم يدخل الإيميل وكلمة المرور
2. الواجهة ترسل `POST /api/auth` بالبيانات
3. الـ serverless function تقارنها مع `process.env.EMAIL` و `process.env.PASSWORD`
4. إذا صحيحة → ترجع token، يُخزَّن في `sessionStorage`
5. عند تحديث الصفحة، يتحقق من وجود الـ token في الـ session

> ملاحظة: الـ secrets لا تظهر أبداً في كود الواجهة — كلها على الـ server فقط.
