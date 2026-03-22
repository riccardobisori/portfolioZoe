import GalleryFolderInput from './components/GalleryFolderInput'
import ProjectGalleryImageInput from './components/ProjectGalleryImageInput'

// Schema di un singolo progetto fotografico.
// Questo documento alimenta home preview, listing e pagina dettaglio.

type ValidationRule = {
    required: () => ValidationRule
    min: (value: number) => ValidationRule
    max: (value: number) => ValidationRule
}

const detailLayoutOptions = [
    { title: '1 verticale centrale', value: 'singlePortrait' },
    { title: '2 verticali affiancate', value: 'doublePortrait' },
    { title: '1 orizzontale full bleed', value: 'fullBleedLandscape' },
    { title: '4 orizzontali (2 per colonna)', value: 'quadLandscape' },
    { title: 'Verticale + testo', value: 'portraitWithText' },
    { title: 'Verticale + zoom', value: 'portraitWithZoom' },
]

// Nasconde i campi che non servono per il layout scelto, tenendo lo Studio più pulito.
function isLayout(parent: { layoutType?: string } | undefined, ...layouts: string[]) {
    return layouts.includes(parent?.layoutType ?? '')
}

const project = {
    name: 'project',
    title: 'Project',
    type: 'document',

    // Raccoglie i campi editabili nello Studio per contenuti, media e metadati del progetto.
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
            // L'input custom aggiunge il caricamento rapido di immagini o cartelle intere.
            name: 'gallery',
            title: 'Galleria immagini',
            type: 'array',
            description: 'Fallback automatico della pagina dettaglio quando non usi il layout editoriale.',
            components: {
                input: GalleryFolderInput,
            },
            of: [{ type: 'image', options: { hotspot: true } }],
        },
        {
            name: 'detailLayout',
            title: 'Layout dettaglio editoriale',
            type: 'array',
            description: 'Sequenza di righe editoriali della pagina progetto. Se lasci vuoto, la pagina usa la gallery classica come fallback.',
            of: [
                {
                    type: 'object',
                    name: 'detailRow',
                    title: 'Riga editoriale',
                    fields: [
                        {
                            name: 'layoutType',
                            title: 'Tipo riga',
                            type: 'string',
                            description: 'Sceglie la composizione della riga e i campi mostrati sotto.',
                            validation: (Rule: ValidationRule) => Rule.required(),
                            options: {
                                list: detailLayoutOptions,
                                layout: 'radio',
                            },
                        },
                        {
                            name: 'side',
                            title: 'Lato immagine principale',
                            type: 'string',
                            description: 'Usato solo per le righe con pannello testo o zoom.',
                            initialValue: 'left',
                            options: {
                                list: [
                                    { title: 'Sinistra', value: 'left' },
                                    { title: 'Destra', value: 'right' },
                                ],
                                layout: 'radio',
                            },
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) =>
                                !isLayout(parent, 'portraitWithText', 'portraitWithZoom'),
                        },
                        {
                            name: 'primaryImage',
                            title: 'Immagine principale',
                            type: 'image',
                            description: 'Immagine sempre richiesta per costruire la riga.',
                            components: {input: ProjectGalleryImageInput},
                            options: { hotspot: true },
                            validation: (Rule: ValidationRule) => Rule.required(),
                        },
                        {
                            name: 'secondaryImage',
                            title: 'Immagine 2',
                            type: 'image',
                            description: 'Seconda immagine per la coppia di verticali o per la colonna alta delle quad.',
                            components: {input: ProjectGalleryImageInput},
                            options: { hotspot: true },
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) =>
                                !isLayout(parent, 'doublePortrait', 'quadLandscape'),
                        },
                        {
                            name: 'tertiaryImage',
                            title: 'Immagine 3',
                            type: 'image',
                            description: 'Terza immagine usata solo nel layout con quattro orizzontali.',
                            components: {input: ProjectGalleryImageInput},
                            options: { hotspot: true },
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) => !isLayout(parent, 'quadLandscape'),
                        },
                        {
                            name: 'quaternaryImage',
                            title: 'Immagine 4',
                            type: 'image',
                            description: 'Quarta immagine usata solo nel layout con quattro orizzontali.',
                            components: {input: ProjectGalleryImageInput},
                            options: { hotspot: true },
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) => !isLayout(parent, 'quadLandscape'),
                        },
                        {
                            name: 'text',
                            title: 'Testo',
                            type: 'text',
                            description: 'Contenuto mostrato nello spazio bianco accanto alla verticale.',
                            rows: 5,
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) => !isLayout(parent, 'portraitWithText'),
                        },
                        {
                            name: 'zoomScale',
                            title: 'Intensita zoom',
                            type: 'number',
                            description: '1 = nessuno zoom, 3 = zoom molto stretto.',
                            initialValue: 1.8,
                            validation: (Rule: ValidationRule) => Rule.min(1).max(3),
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) => !isLayout(parent, 'portraitWithZoom'),
                        },
                        {
                            name: 'zoomPositionX',
                            title: 'Zoom focus X (%)',
                            type: 'number',
                            description: 'Controlla il punto focale orizzontale del riquadro zoom.',
                            initialValue: 50,
                            validation: (Rule: ValidationRule) => Rule.min(0).max(100),
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) => !isLayout(parent, 'portraitWithZoom'),
                        },
                        {
                            name: 'zoomPositionY',
                            title: 'Zoom focus Y (%)',
                            type: 'number',
                            description: 'Controlla il punto focale verticale del riquadro zoom.',
                            initialValue: 50,
                            validation: (Rule: ValidationRule) => Rule.min(0).max(100),
                            hidden: ({ parent }: { parent?: { layoutType?: string } }) => !isLayout(parent, 'portraitWithZoom'),
                        },
                    ],
                    preview: {
                        select: {
                            title: 'layoutType',
                            media: 'primaryImage',
                            layoutType: 'layoutType',
                            side: 'side',
                        },
                        prepare({
                            title,
                            layoutType,
                            media,
                            side,
                        }: {
                            title?: string
                            layoutType?: string
                            media?: unknown
                            side?: string
                        }) {
                            // Allinea l'etichetta del riepilogo alle stesse opzioni mostrate in input.
                            const titles = Object.fromEntries(
                                detailLayoutOptions.map((option) => [option.value, option.title]),
                            ) as Record<string, string>

                            const showsSideSubtitle = isLayout(
                                {layoutType},
                                'portraitWithText',
                                'portraitWithZoom',
                            )
                            const subtitle =
                                showsSideSubtitle && side
                                    ? `Immagine a ${side === 'left' ? 'sinistra' : 'destra'}`
                                    : undefined

                            return {
                                title: titles[title ?? ''] ?? 'Riga editoriale',
                                subtitle,
                                media,
                            }
                        },
                    },
                },
            ],
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
