import { type SchemaTypeDefinition } from 'sanity'
import work from './work'
import category from './category'
import siteSettings from './siteSettings'

// Registriamo tutti gli schemi qui — come registrare le @Entity in JPA
// L'ordine non conta, Sanity risolve le dipendenze automaticamente
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [work, category, siteSettings],
}
