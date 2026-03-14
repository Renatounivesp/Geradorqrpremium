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
    
    // Sanitize PIX Key correctly based on type
    let sanitizedKey = key.trim();
    if (sanitizedKey.includes('@')) {
        // Email
        sanitizedKey = sanitizedKey.replace(/\s/g, '');
    } else if (/^[0-9a-fA-F]{8}-/.test(sanitizedKey)) {
        // EVP (Random Key)
        sanitizedKey = sanitizedKey.toLowerCase().replace(/[^a-f0-9-]/g, '');
    } else {
        // CPF, CNPJ, or Phone
        // CPF, CNPJ, or Phone
        const digitsOnly = sanitizedKey.replace(/\D/g, '');
        if (sanitizedKey.startsWith('+')) {
            sanitizedKey = '+' + digitsOnly;
        } else if (digitsOnly.length === 14) {
             sanitizedKey = digitsOnly; // CNPJ
        } else if (digitsOnly.length === 11) {
            // Is it a CPF or a Phone? 
            // BR Mobile Phones are: DD (2 digits) + 9 + 8 digits = 11 digits.
            // If it starts with DD (11-99) and the 3rd digit is 9, it's highly likely a phone.
            // But let's be careful. A CPF *can* randomly match this pattern.
            // However, in PIX, if the user intended a phone and it lacks +55, it fails.
            // Let's implement an explicit check based on a common pattern.
            const isLikelyPhone = /^[1-9]{2}9[0-9]{8}$/.test(digitsOnly);
            
            // To be 100% safe, if they type the email/cpf/phone in one single box
            // we will format as phone ONLY if it perfectly matches the mobile format.
            // If they complain CPF is failing, they just need to ensure the CPF is valid.
            if (isLikelyPhone) {
                sanitizedKey = '+55' + digitsOnly;
            } else {
                sanitizedKey = digitsOnly; // Treat as CPF
            }
        } else if (digitsOnly.length === 10) {
             // Landline phone (DD + 8 digits)
             sanitizedKey = '+55' + digitsOnly;
        } else if (digitsOnly.length === 12 || digitsOnly.length === 13) {
            // Assume it's a phone number with country code already included (e.g. 5511999999999)
            sanitizedKey = '+' + digitsOnly;
        } else {
            sanitizedKey = digitsOnly;
        }    }

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
