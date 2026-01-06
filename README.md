# Minería - Generador de Cronograma de Perforación

Aplicación React que genera cronogramas de perforación optimizados para 3 equipos de trabajo (S1, S2, S3).

## 📋 Descripción

Calcula un calendario inteligente donde:
- **S1**: Equipo base con ciclos regulares (Subida → Inducción → Perforación → Bajada → Descanso)
- **S2 y S3**: Se coordinan automáticamente para mantener perforación activa y evitar descansos simultáneos

## 🚀 Características

- Ingreso de parámetros: Régimen trabajo/descanso, días de inducción, total de días
- Validación de datos con errores específicos
- Tabla visual con código de colores por actividad
- Leyenda interactiva con significado de cada estado
- Conteo automático de perforaciones (#P) por día

## 🎨 Estados de Actividad

| Estado | Código | Color | Significado |
|--------|--------|-------|-------------|
| Subida | S | Azul | Subida del equipo |
| Inducción | I | Amarillo | Capacitación (primer ciclo) |
| Perforación | P | Verde | Actividad principal de trabajo |
| Bajada | B | Rojo | Bajada del equipo |
| Descanso | D | Gris | Tiempo de inactividad |

## 🛠️ Stack Tecnológico

- **React 19.2** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS 4** - Estilos
- **Lucide React** - Iconografía
- **ESLint** - Linting

## 📦 Comandos

```bash
pnpm install    # Instalar dependencias
pnpm run dev    # Desarrollo (Vite HMR)
pnpm run build  # Producción
pnpm run lint   # Validar código
```
