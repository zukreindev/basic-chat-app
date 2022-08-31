/**
 * Some id generator
 * @param {number} [length] default=24
 */
export default function IDGenerator(length = 24) {
    let chars = 'abcdefghijklmnopqrstuvwxyzASDDEFCHIJKLMNOPQRSTUVWXYZ0123456789';

    let token = '';

    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return token;
}
