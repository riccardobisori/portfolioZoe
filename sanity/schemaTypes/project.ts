// Schema di un singolo progetto fotografico.
// Questo documento alimenta home preview, listing e pagina dettaglio.

type ValidationRule = {
    required: () => ValidationRule
    min: (value: number) => ValidationRule
    max: (value: number) => ValidationRule
}

const project = {
    name: 'project',
    title: 'Project',
    type: 'document',

    fields: [
        {
            name: 'title',
            title: 'Titolo',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug URL',
            type: 'slug',
            options: {
                source: 'title',      // es. "Dissoluzione" → "dissoluzione"
            },
            validation: (Rule: ValidationRule) => Rule.required(),
        },
        {
            // Immagine principale del progetto.
            // Sanity gestisce upload, storage e ottimizzazione automaticamente
            name: 'mainImage',
            title: 'Immagine principale',
            type: 'image',
            options: {
                hotspot: true,        // permette di definire il punto focale dell'immagine
                // utile per il crop automatico su mobile
            },
            validation: (Rule: ValidationRule) => Rule.required(),
        },
        {
            // Galleria immagini aggiuntive per la pagina dettaglio.
            // array di image — Sanity permette upload multiplo
            name: 'gallery',
            title: 'Galleria immagini',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
        },
        {
            name: 'kind',
            title: 'Tipo Progetto',
            type: 'string',
            initialValue: 'work',
            validation: (Rule: ValidationRule) => Rule.required(),
            options: {
                list: [
                    { title: 'Works', value: 'work' },
                    { title: 'Series', value: 'series' },
                ],
                layout: 'radio',
            },
        },
        {
            name: 'year',
            title: 'Anno',
            type: 'string',
            validation: (Rule: ValidationRule) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Descrizione',
            type: 'text',
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

export default project
