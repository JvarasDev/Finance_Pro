# Finance Pro - Plataforma Financiera Premium

Una plataforma financiera moderna y premium para gestionar ingresos, gastos, metas y recibir recomendaciones personalizadas.

## 🚀 Características

- **Dashboard Premium**: Interfaz moderna con diseño glassmorphism
- **Gestión de Ingresos**: Registro y categorización de ingresos
- **Control de Gastos**: Seguimiento detallado de gastos por categorías
- **Metas Financieras**: Establecimiento y seguimiento de objetivos
- **Análisis Avanzado**: Visualizaciones y estadísticas
- **Recomendaciones**: Consejos personalizados basados en tu comportamiento
- **Diseño Responsive**: Optimizado para móviles y desktop
- **Autenticación JWT**: Sistema seguro de login/registro

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: SQLite (local) / PostgreSQL (producción)
- **Estilos**: CSS personalizado con diseño premium
- **Autenticación**: JWT con bcryptjs
- **Deployment**: Vercel

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JvarasDev/Finance_Pro.git
   cd Finance_Pro
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="tu-secreto-super-seguro-aqui"
   ```

4. **Configurar base de datos**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🌐 Deployment en Vercel

### Variables de Entorno en Vercel:
- `DATABASE_URL`: `file::memory:?connection_limit=1`
- `JWT_SECRET`: Tu secreto JWT seguro

### Credenciales de Demo:
- **Email**: `demo@financepro.cl`
- **Contraseña**: `demo123`

### Pasos para Deploy:
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

## 📱 Uso

### Registro/Login
- Crear cuenta nueva o usar credenciales de demo
- Sistema de autenticación seguro

### Dashboard
- Vista general de finanzas
- Resumen de ingresos y gastos
- Progreso de metas

### Gestión de Ingresos
- Agregar nuevos ingresos
- Categorizar por tipo
- Establecer frecuencia

### Control de Gastos
- Registrar gastos
- Categorización automática
- Análisis de patrones

### Metas Financieras
- Crear objetivos
- Seguimiento de progreso
- Fechas límite

## 🎨 Diseño

- **Paleta de colores**: Dorado premium (#f59e0b)
- **Tipografía**: Inter (Google Fonts)
- **Efectos**: Glassmorphism, sombras, animaciones
- **Responsive**: Mobile-first design

## 🔧 Desarrollo

### Estructura del Proyecto
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   ├── dashboard/      # Páginas del dashboard
│   ├── login/          # Página de login
│   └── register/       # Página de registro
├── components/         # Componentes React
├── contexts/          # Contextos (Auth)
├── lib/               # Utilidades y configuraciones
└── prisma/            # Esquema de base de datos
```

### Scripts Disponibles
- `npm run dev`: Desarrollo con Turbopack
- `npm run build`: Build de producción
- `npm run start`: Servidor de producción
- `npm run lint`: Linting del código

## 📊 Base de Datos

### Modelos Principales
- **User**: Usuarios y autenticación
- **Income**: Ingresos del usuario
- **Expense**: Gastos del usuario
- **Goal**: Metas financieras
- **Recommendation**: Recomendaciones personalizadas

## 🔐 Seguridad

- Contraseñas hasheadas con bcryptjs
- JWT para autenticación
- Validación de datos con Zod
- Protección de rutas

## 📈 Roadmap

- [ ] Integración con APIs bancarias
- [ ] Exportación de datos
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con servicios de pago

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@financepro.cl
- **Documentación**: [docs.financepro.cl](https://docs.financepro.cl)

---

Desarrollado con ❤️ por el equipo de Finance Pro
