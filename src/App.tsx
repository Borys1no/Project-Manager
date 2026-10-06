import { AppShell } from './app/AppShell'
import { MarkdownRenderer } from './components/ui/MarkdownRenderer'

function App() {
  return (
    <AppShell>
      <h2 className="text-2xl font-semibold">Prueba de Markdown</h2>

      <MarkdownRenderer
        content={`
## Cómo desarrollar esta tarea

Implementar la primera versión del proyecto.

### Pasos

- [ ] Crear estructura inicial
- [ ] Configurar Tailwind
- [ ] Crear App Shell
- [x] Configurar Markdown

### Notas

> Mantener la aplicación simple.

\`\`\`typescript
const projectName = 'Project Manager'
\`\`\`
        `}
      />
    </AppShell>
  )
}

export default App