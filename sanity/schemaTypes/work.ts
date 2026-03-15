// Schema di un singolo "Lavoro fotografico".
// Nota: questo documento alimenta piu viste diverse del sito
// (home preview, listing Works/Series, pagina dettaglio).
import PreviewLayoutInput from './components/PreviewLayoutInput'

type ValidationRule = {
    required: () => ValidationRule
    min: (value: number) => ValidationRule
    max: (value: number) => ValidationRule
}

const work = {
    name: 'work',
    title: 'Lavoro',
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
            // Il campo più importante — l'immagine principale del lavoro
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
            validation: (Rule: ValidationRule) => Rule.required(),
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
            name: 'previewLayout',
            title: 'Layout Preview Home',
            type: 'object',
            // Configurazione editoriale usata SOLO nella moodboard della home.
            // Non influisce su Works/Series listing né sulla pagina dettaglio.
            description: 'Controllo manuale della posizione nella moodboard della home (solo homepage).',
            options: { collapsible: true, collapsed: true },
            components: { input: PreviewLayoutInput },
            fields: [
                {
                    name: 'preset',
                    title: 'Preset posizione',
                    type: 'string',
                    // "Auto" usa la disposizione algoritmica frontend.
                    initialValue: 'auto',
                    options: {
                        list: [
                            { title: 'Auto', value: 'auto' },
                            { title: 'Sinistra Alta', value: 'leftTop' },
                            { title: 'Centro Alto', value: 'centerTop' },
                            { title: 'Destra Alta', value: 'rightTop' },
                            { title: 'Destra Stretta', value: 'rightNarrowTop' },
                            { title: 'Sinistra Bassa', value: 'leftBottom' },
                            { title: 'Centro Basso', value: 'centerBottom' },
                            { title: 'Destra Bassa', value: 'rightBottom' },
                            { title: 'Destra Stretta Bassa', value: 'rightNarrowBottom' },
                        ],
                    },
                },
                {
                    name: 'x',
                    title: 'X (%)',
                    type: 'number',
                    description: 'Posizione orizzontale manuale (0-90). Lascia vuoto per usare il preset.',
                    validation: (Rule: ValidationRule) => Rule.min(0).max(90),
                },
                {
                    name: 'y',
                    title: 'Y (%)',
                    type: 'number',
                    description: 'Posizione verticale manuale (0-95). Lascia vuoto per usare il preset.',
                    validation: (Rule: ValidationRule) => Rule.min(0).max(95),
                },
                {
                    name: 'width',
                    title: 'Larghezza (%)',
                    type: 'number',
                    description: 'Larghezza card (10-45). Lascia vuoto per usare il preset.',
                    validation: (Rule: ValidationRule) => Rule.min(10).max(45),
                },
                {
                    name: 'z',
                    title: 'Profondita z-index',
                    type: 'number',
                    description: 'Ordine di sovrapposizione (1-10).',
                    validation: (Rule: ValidationRule) => Rule.min(1).max(10),
                },
                {
                    name: 'preferred',
                    title: 'Preferenza orientamento',
                    type: 'string',
                    initialValue: 'any',
                    options: {
                        list: [
                            { title: 'Auto', value: 'any' },
                            { title: 'Orizzontale', value: 'landscape' },
                            { title: 'Verticale', value: 'portrait' },
                        ],
                    },
                },
                {
                    name: 'responsive',
                    title: 'Override Desktop Per Breakpoint',
                    type: 'object',
                    description:
                        'Opzionale: se valorizzato, sovrascrive i valori base per specifici breakpoint desktop. I campi vuoti usano fallback ai valori base.',
                    options: { collapsible: true, collapsed: true },
                    fields: [
                        {
                            name: 'desktop1024',
                            title: 'Desktop 1024',
                            type: 'object',
                            options: { collapsible: true, collapsed: true },
                            fields: [
                                { name: 'preset', title: 'Preset posizione', type: 'string' },
                                {
                                    name: 'x',
                                    title: 'X (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(0).max(90),
                                },
                                {
                                    name: 'y',
                                    title: 'Y (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(0).max(95),
                                },
                                {
                                    name: 'width',
                                    title: 'Larghezza (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(10).max(45),
                                },
                                {
                                    name: 'z',
                                    title: 'Profondita z-index',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(1).max(10),
                                },
                                {
                                    name: 'preferred',
                                    title: 'Preferenza orientamento',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Auto', value: 'any' },
                                            { title: 'Orizzontale', value: 'landscape' },
                                            { title: 'Verticale', value: 'portrait' },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            name: 'desktop1440',
                            title: 'Desktop 1440',
                            type: 'object',
                            options: { collapsible: true, collapsed: true },
                            fields: [
                                { name: 'preset', title: 'Preset posizione', type: 'string' },
                                {
                                    name: 'x',
                                    title: 'X (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(0).max(90),
                                },
                                {
                                    name: 'y',
                                    title: 'Y (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(0).max(95),
                                },
                                {
                                    name: 'width',
                                    title: 'Larghezza (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(10).max(45),
                                },
                                {
                                    name: 'z',
                                    title: 'Profondita z-index',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(1).max(10),
                                },
                                {
                                    name: 'preferred',
                                    title: 'Preferenza orientamento',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Auto', value: 'any' },
                                            { title: 'Orizzontale', value: 'landscape' },
                                            { title: 'Verticale', value: 'portrait' },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            name: 'desktop1920',
                            title: 'Desktop 1920',
                            type: 'object',
                            options: { collapsible: true, collapsed: true },
                            fields: [
                                { name: 'preset', title: 'Preset posizione', type: 'string' },
                                {
                                    name: 'x',
                                    title: 'X (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(0).max(90),
                                },
                                {
                                    name: 'y',
                                    title: 'Y (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(0).max(95),
                                },
                                {
                                    name: 'width',
                                    title: 'Larghezza (%)',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(10).max(45),
                                },
                                {
                                    name: 'z',
                                    title: 'Profondita z-index',
                                    type: 'number',
                                    validation: (Rule: ValidationRule) => Rule.min(1).max(10),
                                },
                                {
                                    name: 'preferred',
                                    title: 'Preferenza orientamento',
                                    type: 'string',
                                    options: {
                                        list: [
                                            { title: 'Auto', value: 'any' },
                                            { title: 'Orizzontale', value: 'landscape' },
                                            { title: 'Verticale', value: 'portrait' },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
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
