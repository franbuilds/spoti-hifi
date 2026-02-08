# 🎵 Spoti-HiFi

**Spoti-HiFi** es un downloader de Spotify que te permite descargar música en alta calidad (FLAC) directamente desde la plataforma.

![Brutalist Design](https://img.shields.io/badge/Design-Brutalist-black?style=for-the-badge)
![Windows](https://img.shields.io/badge/Platform-Windows-blue?style=for-the-badge)
![Linux](https://img.shields.io/badge/Platform-Linux-orange?style=for-the-badge)
![Free](https://img.shields.io/badge/Price-Free-green?style=for-the-badge)

---

## 🔧 ¿Cómo funciona?

Spoti-HiFi utiliza APIs de terceros para obtener metadatos de spotify y descargarlo de terceros. El proceso es simple:

1. **Búsqueda**: Ingresa el nombre de una canción, artista o álbum
2. **Fetcheo**: La aplicación consulta APIs externas para localizar el audio en alta calidad
3. **Descarga**: El archivo se descarga en formato FLAC (lossless) mediante TIDAL, Qobuz y Amazon Music

> ⚠️ **Nota**: Spoti-HiFi NO almacena ni distribuye música. Simplemente actúa como intermediario para obtener audio desde fuentes de terceros.

---

## 🎨 Diseño

La interfaz de Spoti-HiFi está inspirada en el **brutalismo moderno de software** — un enfoque de diseño que prioriza:

- **Funcionalidad sobre decoración**
- **Tipografía bold y contrastes fuertes**
- **Elementos visuales directos y sin pretensiones**
- **Experiencia de usuario clara y eficiente**

---

## 🚀 Ejecución

### Windows

Simplemente ejecuta el archivo:

```
SpotiHiFi.exe
```

[![Descargar Spoti-HiFi](https://img.shields.io/badge/DESCARGAR-Spoti--HiFi-1DB954?style=for-the-badge&logo=github&logoColor=white)](https://github.com/franbuilds/spoti-hifi/releases/tag/STABLE)

No requiere instalación. Descarga, ejecuta y listo.

### Linux

Descarga el binario `SpotiHiFi` y ejecútalo:

```bash
chmod +x SpotiHiFi
./SpotiHiFi
```

---

## 🛠️ Compilar desde código fuente

### Requisitos

- [Go](https://golang.org/dl/) 1.21+
- [Wails CLI](https://wails.io/) v2.x
- [Node.js](https://nodejs.org/) 18+

### Dependencias de Linux

En **Fedora/RHEL**:
```bash
sudo dnf install gtk3-devel webkit2gtk4.1-devel glib2-devel libsoup3-devel
```

En **Ubuntu/Debian**:
```bash
sudo apt install libgtk-3-dev libwebkit2gtk-4.0-dev
```

### Build

```bash
cd spotihifi-app

# Windows
wails build -platform windows/amd64 -o SpotiHiFi.exe

# Linux (Fedora/distros con webkit2gtk 4.1)
wails build -platform linux/amd64 -o SpotiHiFi -tags webkit2_41

# Linux (Ubuntu/distros con webkit2gtk 4.0)
wails build -platform linux/amd64 -o SpotiHiFi
```

El ejecutable se genera en `build/bin/`.

---

## ❓ Preguntas Frecuentes

### ¿Es gratis?
**Sí, completamente gratis.** No hay pagos, suscripciones ni costos ocultos.

### ¿De dónde viene el audio?
El audio se obtiene a través de **APIs de terceros**. Spoti-HiFi no almacena música en sus servidores.

### ¿Por qué mi antivirus lo detecta como amenaza?
Es un **falso positivo**. Esto ocurre porque la aplicación:
- Realiza conexiones de red a APIs externas
- Está empaquetada como ejecutable portable
- No tiene firma digital de desarrollador verificado

Puedes agregar una excepción en tu antivirus o revisar el código fuente para verificar que es seguro.

### ¿Es legal?
El uso de esta herramienta es bajo tu propia responsabilidad. Asegúrate de cumplir con las leyes de derechos de autor de tu país.

---

## 🙏 Créditos

Este proyecto funciona gracias al increíble trabajo de **[afkarxyz](https://github.com/afkarxyz)** y su repositorio **[SpotiFLAC](https://github.com/afkarxyz/SpotiFLAC)**, que proporciona la lógica principal para obtener audio de Spotify en alta calidad.

<p align="center">
  <a href="https://github.com/afkarxyz/SpotiFLAC">
    <img src="https://img.shields.io/badge/Powered%20by-SpotiFLAC-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Powered by SpotiFLAC">
  </a>
</p>

---

<p align="center">
  <sub>Made with 🖤 for music lovers</sub>
</p>
