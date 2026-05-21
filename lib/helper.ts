import { currencies } from "./currencies";


export function DateToUTCDate(date: Date){
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
    )
}

export function GetFormmatterForCurrency(currency:string){
const locate = currencies.find((c) => c.value === currency)?.locate;
return new Intl.NumberFormat(locate, {
    style: "currency",
    currency,
})


}