import axios, { AxiosError } from 'axios';

export async function translateText(
    clientId: string,
    clientSecret: string,
    sourceLanguageCode: string,
    targetLanguageCode: string,
    textToTranslate: string
): Promise<string> {
    try {
        const apiUrl = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
        const requestData = new URLSearchParams();
        requestData.append('source', sourceLanguageCode);
        requestData.append('target', targetLanguageCode);
        requestData.append('text', textToTranslate);
        const config = {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': clientId,
                'X-NCP-APIGW-API-KEY': clientSecret,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const response = await axios.post(apiUrl, requestData, config);
        return response.data.message.result.translatedText;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('HTTP 요청 오류:', axiosError.message);
        } else {
            console.error('번역 요청 중 오류 발생:', error);
        }
        return '';
    }
}
