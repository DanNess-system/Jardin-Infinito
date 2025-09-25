# Instrucciones para FTP/SFTP

## Datos de conexión (obténlos de tu panel de Hostinger)
- Host: ftp.tu-dominio.com (o el que te proporcione Hostinger)
- Usuario: tu-usuario-ftp
- Contraseña: tu-contraseña-ftp
- Puerto: 21 (FTP) o 22 (SFTP)

## Software recomendado:
- FileZilla (gratuito)
- WinSCP (Windows)
- Cyberduck (Mac)

## Pasos:
1. Conecta vía FTP/SFTP
2. Ve a la carpeta /public_html
3. Sube todo el contenido de la carpeta dist/ 
4. Asegúrate de subir también el archivo .htaccess
5. ¡Listo!

## Estructura final en public_html:
/public_html/
├── index.html
├── .htaccess
├── _astro/
├── arreglos-florales/
├── centros-mesa/
├── ... (todas las demás carpetas)
└── favicon.svg