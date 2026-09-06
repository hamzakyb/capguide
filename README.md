# Capguide Travel — Next.js

Kapadokya turları için tek sayfalık, WhatsApp odaklı tanıtım sitesi ve
gerçek zamanlı çalışan bir yönetim paneli.

## Kurulum

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Yönetim paneli: http://localhost:3000/admin  (varsayılan şifre: `capguide2026`)

Şifreyi değiştirmek için `.env.local.example` dosyasını `.env.local` olarak
kopyalayıp `ADMIN_PASSWORD` değerini güncelleyin, sonra sunucuyu yeniden başlatın.

```bash
cp .env.local.example .env.local
```

## Proje yapısı

| Yol | Açıklama |
|---|---|
| `app/(site)/` | Genel siteye özel düzen ve stiller (`site.css`) |
| `app/admin/` | Yönetim paneli sayfası ve stilleri (`admin.css`) |
| `app/api/content` | İçeriği okuma (GET) ve kaydetme (PUT, şifreli) |
| `app/api/upload` | Admin panelinden fotoğraf yükleme |
| `app/api/login` | Panel girişi / çıkışı (httpOnly cookie) |
| `components/SiteApp.jsx` | Ana sayfanın tüm arayüzü (istemci bileşeni) |
| `components/AdminApp.jsx` | Yönetim panelinin tüm arayüzü |
| `lib/content.js` | `data/content.json` dosyasını okuyup yazan yardımcılar |
| `data/content.json` | **Sitenin tek veri kaynağı** — turlar, öne çıkanlar, ayarlar |
| `public/assets/img/` | Tüm fotoğraflar, logo, favicon |

## Eski statik siteden fark

Önceki sürüm düz HTML/CSS/JS dosyalarından oluşuyordu ve admin paneli
değişiklikleri yalnızca tarayıcıda (localStorage) tutup, kalıcı hale
getirmek için elle bir `data.js` dosyası indirip yüklemenizi gerektiriyordu.

Bu Next.js sürümünde:

- Admin panelinde **Kaydet**'e bastığınızda içerik doğrudan sunucudaki
  `data/content.json` dosyasına yazılır — herkes anında yeni içeriği görür,
  dosya indirip yüklemenize gerek kalmaz.
  Panelden yüklenen fotoğraflar sunucuya kaydedilip `public/assets/img/`
  klasörüne yazılır.
- Panel girişi sunucu taraflı, `httpOnly` bir çerezle korunur (şifre artık
  tarayıcıda saklanmıyor).
- İçerik `data/content.json` dosyasında düz JSON olarak durur; isterseniz
  git ile versiyonlayabilir, isterseniz `.gitignore`'a ekleyip sunucuda
  ayrı tutabilirsiniz.

## İçeriği elle düzenlemek

Paneli hiç açmadan da `data/content.json` dosyasını doğrudan bir metin
editörüyle düzenleyebilirsiniz — dosya biçimi şu şekildedir:

```json
{
  "settings": { "whatsapp": "905391399131", "email": "info@capguidetravel.com", "...": "..." },
  "tours": [ { "cat": "tours", "badge": "BEST SELLER", "name": "...", "desc": "...", "img": "/assets/img/...", "wa": "..." } ],
  "featured": [ { "name": "...", "title": "...", "sub": "...", "img": "/assets/img/..." } ]
}
```

## Fotoğraflar

`public/assets/img/` klasöründe. Kaynak ve lisans bilgisi için
`public/assets/img/CREDITS.txt` dosyasına bakın — mevcut fotoğrafların
çoğu geçici olarak serbest lisanslı kaynaklardan (Wikimedia Commons,
Openverse/Flickr) alınmıştır; kendi fotoğraflarınızı aynı dosya adlarıyla
üzerine kaydedebilir ya da admin panelinden yeni dosya yükleyebilirsiniz.

## Dağıtım (production)

```bash
npm run build
npm start
```

`data/` ve `public/assets/img/` klasörlerinin sunucuda **yazılabilir**
olması gerekir (admin panelinin kaydetme ve fotoğraf yükleme özellikleri
için). Salt-okunur bir dosya sistemi kullanan platformlarda (bazı
serverless ortamlar) bu iki klasör için kalıcı bir disk/volume
tanımlamanız gerekir.
