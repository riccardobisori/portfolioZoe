// Schema singleton — esiste un solo documento di questo tipo
// Contiene le impostazioni globali del sito:
// immagine hero, testi homepage, info contatto ecc.
const siteSettings = {
    name: 'siteSettings',
    title: 'Impostazioni Sito',
    type: 'document',

    fields: [
        {
            name: 'heroImage',
            title: 'Immagine Hero',
            type: 'image',
            options: { hotspot: true },
            description: 'Immagine a tutto schermo nella homepage',
        },
        {
            name: 'heroTitle',
            title: 'Titolo Hero',
            type: 'string',
            initialValue: 'Visual Works',
        },
        {
            name: 'heroSubtitle',
            title: 'Sottotitolo Hero',
            type: 'string',
            initialValue: 'Moda · Street · Ritratti · Paesaggio',
        },
    ],

    // Forza un solo documento — icona matita invece di "New document"
    __experimental_actions: ['update', 'publish'],
}

export default siteSettings