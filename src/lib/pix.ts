export interface PixParams {
    key: string;
    name: string;
    city: string;
    amount?: number;
    description?: string;
    transactionId?: string;
}

export function generatePixPayload(params: PixParams): string {
    const normalize = (text: string) => {
        return text.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .replace(/[^A-Z0-9 ]/g, '');
    };

    const { key, name, city, amount, description, transactionId = '***' } = params;
    
    // Sanitize key (remove everything except alphanumeric and @.- for email keys)
    const sanitizedKey = key.replace(/[^a-zA-Z0-9@.\-_]/g, '');

    const payloadFormatIndicator = '000201';
    const pointOfInitiationMethod = '010211'; // Static PIX

    // Merchant Account Information
    const gui = '0014br.gov.bcb.pix';
    const keyField = `01${sanitizedKey.length.toString().padStart(2, '0')}${sanitizedKey}`;
    const infoField = description ? `02${description.substring(0, 40).length.toString().padStart(2, '0')}${description.substring(0, 40)}` : '';
    const merchantAccountInfo = `26${(gui.length + keyField.length + infoField.length).toString().padStart(2, '0')}${gui}${keyField}${infoField}`;

    const merchantCategoryCode = '52040000';
    const transactionCurrency = '5303986';

    const cleanAmount = amount ? amount.toFixed(2) : '';
    const transactionAmount = cleanAmount ? `54${cleanAmount.length.toString().padStart(2, '0')}${cleanAmount}` : '';

    const countryCode = '5802BR';
    
    const sanitizedName = normalize(name).substring(0, 25);
    const merchantName = `59${sanitizedName.length.toString().padStart(2, '0')}${sanitizedName}`;
    
    const sanitizedCity = normalize(city).substring(0, 15);
    const merchantCity = `60${sanitizedCity.length.toString().padStart(2, '0')}${sanitizedCity}`;

    // Additional Data Field Template
    const txId = transactionId.substring(0, 25);
    const txIdField = `05${txId.length.toString().padStart(2, '0')}${txId}`;
    const additionalDataField = `62${txIdField.length.toString().padStart(2, '0')}${txIdField}`;

    let payload = `${payloadFormatIndicator}${pointOfInitiationMethod}${merchantAccountInfo}${merchantCategoryCode}${transactionCurrency}${transactionAmount}${countryCode}${merchantName}${merchantCity}${additionalDataField}6304`;

    payload += calculateCRC16(payload);

    return payload;
}

function calculateCRC16(str: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
