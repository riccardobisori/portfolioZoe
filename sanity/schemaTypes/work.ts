// Questo schema definisce un singolo "Lavoro fotografico"
// È il documento principale del portfolio

const work = {
    name: 'work',
    title: 'Lavoro',
    type: 'document',

    fields: [
        {
            name: 'title',
            title: 'Titolo',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug URL',
            type: 'slug',
            options: {
                source: 'title',      // es. "Dissoluzione" → "dissoluzione"
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            // Il campo più importante — l'immagine principale del lavoro
            // Sanity gestisce upload, storage e ottimizzazione automaticamente
            name: 'mainImage',
            title: 'Immagine principale',
            type: 'image',
            options: {
                hotspot: true,        // permette di definire il punto focale dell'immagine
                // utile per il crop automatico su mobile
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            // Galleria di immagini aggiuntive per il dettaglio del lavoro
            // array di image — Sanity permette upload multiplo
            name: 'gallery',
            title: 'Galleria immagini',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        },
        {
            // Riferimento alla categoria — come una foreign key in SQL
            // Sanity crea automaticamente il link tra i documenti
            name: 'category',
            title: 'Categoria',
            type: 'reference',      // tipo speciale — punta a un altro documento
            to: [{ type: 'category' }], // punta a un documento di tipo 'category'
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'year',
            title: 'Anno',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Descrizione',
            type: 'text',
        },
        {
            // Campo per mettere in evidenza il lavoro nella homepage
            // come un booleano — true = appare in "Ultimi lavori"
            name: 'featured',
            title: 'In evidenza',
            type: 'boolean',
            description: 'Mostra questo lavoro nella homepage',
            initialValue: false,    // default: non in evidenza
        },
        {
            name: 'date',
            title: 'Data',
            type: 'date',           // tipo data — usato per ordinare i lavori
        },
    ],

    // Anteprima nel pannello admin — cosa vedi nella lista dei documenti
    // Senza questo vedresti solo l'ID del documento
    preview: {
        select: {
            title: 'title',         // mostra il titolo
            media: 'mainImage',     // mostra l'immagine come thumbnail
            subtitle: 'year',       // mostra l'anno sotto il titolo
        },
    },
}

export default work