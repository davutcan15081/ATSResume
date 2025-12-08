# ATS-Pro Resume Builder 🚀

Profesyonel, ATS (Aday Takip Sistemi) uyumlu ve AI destekli modern bir CV hazırlama uygulaması.

## ✨ Özellikler

- **Canlı Önizleme:** Yazarken CV'nizin nasıl göründüğünü anlık olarak görün.
- **AI Destekli İçerik:** Google Gemini AI ile özet ve deneyim yazılarınızı profesyonelleştirin.
- **Akıllı İçe Aktarma:**
  - **PDF'den CV:** Mevcut PDF CV'nizi yükleyin, AI ile analiz edip otomatik dolduralım.
  - **JSON:** Daha önce kaydettiğiniz CV dosyalarını tekrar yükleyin.
- **Dışa Aktarma:**
  - **PDF İndir:** Yazdırmaya hazır yüksek kaliteli PDF çıktısı.
  - **JSON Kaydet:** Daha sonra düzenlemek üzere yedeğinizi alın.
- **ATS Uyumlu Tasarım:** İnsan Kaynakları sistemlerinin okuyabileceği temiz ve standart format.
- **Modern Arayüz:** Kullanıcı dostu ve responsive tasarım.

## 🛠️ Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Ön Gereksinimler
- Node.js (v18 veya üzeri önerilir)
- Bir terminal (PowerShell, CMD veya Bash)

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın
Projenin kök dizininde `.env.local` adında bir dosya oluşturun ve Google Gemini API anahtarınızı ekleyin:

```env
VITE_GEMINI_API_KEY=AIzaSy...SizinAnahtariniz
```
*Not: API anahtarınızı [Google AI Studio](https://makersuite.google.com/app/apikey) üzerinden alabilirsiniz.*

### 4. Uygulamayı Çalıştırın
```bash
npm run dev
```
Uygulama genellikle `http://localhost:3000` veya `http://localhost:5173` adresinde çalışacaktır.

## 🏗️ Teknoloji Yığını

- **Frontend:** React, TypeScript, Vite
- **Stil:** Tailwind CSS
- **AI Entegrasyonu:** Google Gemini AI (`gemini-1.5-pro` & `gemini-2.0-flash-exp`)
- **PDF İşleme:** PDF.js

## 🤝 Katkıda Bulunma

1. Bu repoyu forklayın
2. Yeni bir branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi pushlayın (`git push origin feature/YeniOzellik`)
5. Bir Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---
GitHub Deposu: [https://github.com/davutcan15081/ATSResume](https://github.com/davutcan15081/ATSResume)
