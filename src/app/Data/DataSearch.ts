export interface Translation {
    detected_source_language: string;
    text: string;
}

export interface Translations {
    translations: Translation[];
}