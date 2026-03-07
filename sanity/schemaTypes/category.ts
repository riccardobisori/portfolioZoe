// Questo schema definisce una "Categoria" — Fashion, Street, Nature ecc.
// In Sanity ogni schema è un oggetto con name, title e fields
// È come definire una @Entity in JPA

const category = {
    // name = identificatore interno, usato nelle query GROQ
    name: 'category',
    // title = nome leggibile nel pannello admin
    title: 'Categoria',
    // type: 'document' = è un documento principale (come una tabella in SQL)
    type: 'document',

    fields: [
        {
            name: 'title',
            title: 'Nome',
            type: 'string',         // campo testo semplice
            validation: (Rule: any) => Rule.required(), // obbligatorio
        },
        {
            name: 'slug',
            title: 'Slug URL',
            type: 'slug',           // tipo speciale Sanity — genera automaticamente
            options: {              // l'URL dalla stringa del titolo
                source: 'title',      // es. "Fashion" → "fashion"
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Descrizione',
            type: 'text',           // testo multiriga
        },
        {
            name: 'order',
            title: 'Ordine',
            type: 'number',         // numero per ordinare le categorie
        },
    ],
}

export default category