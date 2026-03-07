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
    year,
    mainImage,
    category-> {    
      title,
      slug
    }
  }
`
// category-> significa "segui il riferimento" — come una JOIN in SQL
// invece dell'ID della categoria, restituisce l'oggetto categoria completo

// Query per tutti i lavori — usata nella pagina galleria
export const allWorksQuery = groq`
  *[_type == "work"] | order(date desc) {
    _id,
    title,
    slug,
    year,
    mainImage,
    category-> {
      title,
      slug
    }
  }
`

// Query per le categorie ordinate
export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    slug,
    description,
  }
`

// Query per un singolo lavoro tramite slug — usata nella pagina dettaglio
// $slug è un parametro che passiamo alla query — come un prepared statement SQL
export const workBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    year,
    description,
    mainImage,
    gallery,
    category-> {
      title,
      slug
    }
  }
`