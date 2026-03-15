import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import siteSettings from './siteSettings'
import homePreviewCard from './homePreviewCard'

// Registriamo tutti gli schemi qui — come registrare le @Entity in JPA
// L'ordine non conta, Sanity risolve le dipendenze automaticamente
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, siteSettings, homePreviewCard],
}
