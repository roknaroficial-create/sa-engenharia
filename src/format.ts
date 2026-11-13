/** 1 → "01". Usado nas numerações técnicas do site (V/01, G/01...). */
export const pad = (value: number) => String(value).padStart(2, '0')
