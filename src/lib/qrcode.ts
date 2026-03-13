import QRCode from 'qrcode'

export async function generateQRCode(text: string) {
    try {
        return await QRCode.toDataURL(text, {
            width: 400,
            margin: 2,
            color: {
                dark: '#4F46E5', // Indigo-600
                light: '#FFFFFF',
            },
        })
    } catch (err) {
        console.error(err)
        return null
    }
}
