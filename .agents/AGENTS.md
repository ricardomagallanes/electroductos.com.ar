# Reglas del Agente — electroductos.com.ar

## Regla: Auto-push a GitHub

Después de cada modificación de código o archivos en este proyecto, siempre ejecutar el ciclo completo de commit y push a GitHub de forma automática, sin esperar instrucción explícita del usuario:

```bash
git add -A
git commit -m "<descripción concisa del cambio en español>"
git push
```

Esta acción debe realizarse al final de cada tarea que modifique uno o más archivos del proyecto.
