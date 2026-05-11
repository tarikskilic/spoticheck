# Spoticheck Deploy

## Ilk Kurulum

GitHub reposunu sunucuda kaynak kod olarak ayri bir klasore klonla:

```bash
cd /var/www/spoticheck
git clone GITHUB_REPO_URL app
chmod +x /var/www/spoticheck/app/deploy/deploy-server.sh
```

Backend `.env` dosyasi sunucuda `/var/www/spoticheck/backend/.env` icinde kalmali. GitHub'a yuklenmemeli.

## Her Guncellemede

Bilgisayarda:

```bash
git add .
git commit -m "Update app"
git push
```

Sunucuda:

```bash
/var/www/spoticheck/app/deploy/deploy-server.sh
```

Bu komut kaynak kodu GitHub'dan ceker, backend dosyalarini gunceller, frontend build alir, yayin klasorune koyar ve PM2 backend'i yeniden baslatir.
