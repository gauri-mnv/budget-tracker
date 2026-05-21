export const currencies = 
[
    {
        value: "USD",
        label: "$ Dollar",
        locate: "en-US",
    },
    {
        value: "GBP",
        label: "£ Pound",
        locate: "en-GB",
    },
    {
        value: "EUR",
        label: "€ Euro",
        locate: "de-DE",
    },
    {
        value: "JPY",
        label: "¥ Yen",
        locate: "ja-JP",
    },
    {
        value: "CNY",
        label: "¥ Yuan",
        locate: "zh-CN",
    },
    {
        value: "KRW",
        label: "₩ Won",
        locate: "ko-KR",
    },
    {
        value: "INR",
        label: "₹ Rupee",
        locate: "hi-IN",
    },
    {
        value: "BRL",
        label: "R$ Real",
        locate: "pt-BR",
    },
    {
        value: "IDR",
        label: "Rp Rupiah",
        locate: "id-ID",
    },
    {
        value: "MXN",
        label: "$ Peso",
        locate: "es-MX",
    },

]
export type Currency = (typeof currencies)[0];
    