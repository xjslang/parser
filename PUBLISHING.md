# Publishing Guide

## Preparación

1. Asegúrate de estar logueado en npm con la organización `xjslang`:
   ```bash
   npm whoami
   npm login
   ```

2. Verifica que tienes acceso a la organización:
   ```bash
   npm org ls xjslang
   ```

## Build y Publicación

1. Construye el proyecto:
   ```bash
   npm run build
   ```

2. Verifica que el paquete está listo:
   ```bash
   npm pack --dry-run
   ```

3. Publica el paquete:
   ```bash
   npm publish --access public
   ```

## Verificación Post-Publicación

Una vez publicado, los usuarios podrán instalar y usar el paquete:

```bash
npm install @xjslang/parser
```

Y usar las importaciones:

```js
import { parse } from '@xjslang/parser';
import { parseDefer } from '@xjslang/parser/defer';
import { parseMut } from '@xjslang/parser/mut';
```

## Estructura del Paquete

- `@xjslang/parser` - Exporta todas las funciones (parse, parseDefer, parseMut)
- `@xjslang/parser/defer` - Solo exporta funciones relacionadas con defer
- `@xjslang/parser/mut` - Solo exporta funciones relacionadas con mut
