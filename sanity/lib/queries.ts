import { groq } from 'next-sanity'

// Query per i lavori in evidenza — usata nella homepage
// *[...] = prendi tutti i documenti che soddisfano la condizione
// _type == "work" = solo documenti di tipo work
// featured == true = solo quelli in evidenza
// | order(date desc) = ordinati per data, più recenti prima
export const featuredWorksQuery = groq`
  *[_type == "work" && featured == true] | order(date desc) {
    _id,
    title,
    slug,
    "kind": coalesce(kind, select(category->slug.current == "series" => "series", "work")),
    year,
    mainImage,
    // Dati layout manuale per la moodboard home.
    previewLayout
  }
`

// Query per tutti i lavori — usata nella pagina galleria
export const allWorksQuery = groq`
  *[_type == "work"] | order(date desc) {
    _id,
    title,
    slug,
    "kind": coalesce(kind, select(category->slug.current == "series" => "series", "work")),
    year,
    description,
    mainImage
  }
`

// Query per un singolo lavoro tramite slug — usata nella pagina dettaglio
// $slug è un parametro che passiamo alla query — come un prepared statement SQL
export const workBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "kind": coalesce(kind, select(category->slug.current == "series" => "series", "work")),
    year,
    description,
    mainImage,
    gallery,
    previewLayout
  }
`

// Query per le impostazioni globali del sito
// [0] prende il primo (e unico) documento di tipo siteSettings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroImage,
    heroTitle,
    heroSubtitle,
  }
`

export const homePreviewCardsQuery = groq`
  *[_type == "homePreviewCard" && coalesce(enabled, true) == true] | order(order asc, _createdAt asc) {
    _id,
    image,
    previewLayout,
    project->{
      _id,
      title,
      slug,
      "kind": coalesce(kind, select(category->slug.current == "series" => "series", "work")),
      year,
      mainImage,
      previewLayout
    }
  }
`
