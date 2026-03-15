type ValidationRule = {
    required: () => ValidationRule
    min: (value: number) => ValidationRule
    max: (value: number) => ValidationRule
}

const homePreviewCard = {
    name: 'homePreviewCard',
    title: 'Home Preview Card',
    type: 'document',
    fields: [
        {
            name: 'project',
            title: 'Progetto',
            type: 'reference',
            to: [{ type: 'work' }],
            validation: (Rule: ValidationRule) => Rule.required(),
            description: 'Progetto di destinazione (Works o Series).',
        },
        {
            name: 'image',
            title: 'Immagine Card',
            type: 'image',
            options: { hotspot: true },
            description: 'Foto specifica per questa card. Se vuota, usa la mainImage del progetto.',
        },
        {
            name: 'previewLayout',
            title: 'Layout Home',
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
            name: 'order',
            title: 'Ordine',
            type: 'number',
            initialValue: 100,
            description: 'Ordine manuale delle card in home (crescente).',
        },
        {
            name: 'enabled',
            title: 'Attiva',
            type: 'boolean',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'project.title',
            subtitle: 'project.kind',
            media: 'image',
        },
        prepare(selection: { title?: string; subtitle?: string; media?: unknown }) {
            return {
                title: selection.title ?? 'Card senza progetto',
                subtitle: selection.subtitle ?? 'home preview card',
                media: selection.media,
            }
        },
    },
}

export default homePreviewCard
