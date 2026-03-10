<script setup>
import { BackendService } from "./api/BackendSevice";

/*
  [interviewer]: "мы будем собирать на стороне клиента сервис через OpenAPI, поэтому будем обращаться напрямую к классу"

  Проверка на использование ключевого слова static.
  Вопросы:
    - Каких типов могут быть поля и методы в классе?
*/
const apiService = new BackendService();

/*
  [interviewer]:
   - "Опиши возвращаемый тип - DTO";
   - "Какие логические сущности будешь использовать?""
   - "Давай порисуем в FigJam?"
*/
const invoices = apiService.getInvoices();

const plays = apiService.getPlays();

var user = "BigCo";

const playsObj = plays.reduce((acc, { id, name, type }) => {
  acc[id] = { name, type };

  return acc;
}, {});

/*
    Длинная функция — делает слишком много: вычисляет сумму, бонусы и форматирует вывод

    Оператор switch по типу пьесы — при добавлении новых жанров придётся менять этот код

    Временные переменные — totalAmount и volumeCredits усложняют выделение функций

    Магические числа — 40000, 30000, 30, 20 непонятно что значат

    Сложность добавления HTML-версии — пришлось бы дублировать всю логику

    [interviewer]: 
     - "Как бы ты исправил данную функцию? Расскажи о композиции кода"
     - "Напиши на данную функцию JSDoc"

      После рефакторинга локально предложить вынести в стор или composable.
*/

function statement(invoice, playsObj) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Счёт для ${invoice.customer.name}:\n`;
  // Вынести в отдельную функцию?
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = playsObj[perf.playId];
    let thisAmount = 0;

    // Вынести в отдельную функцию?
    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audienceCount > 30) {
          thisAmount += 1000 * (perf.audienceCount - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audienceCount > 20) {
          thisAmount += 10000 + 500 * (perf.audienceCount - 20);
        }
        thisAmount += 300 * perf.audienceCount;
        break;
      default:
        throw new Error(`неизвестный жанр: ${play.type}`);
    }

    // Добавление бонусных баллов
    volumeCredits += Math.max(perf.audienceCount - 30, 0);
    // Дополнительный бонус за комедию
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audienceCount / 5);

    // Вывод строки счёта
    result += `- ${play.name}: ${format(thisAmount / 100)} (${perf.audienceCount} мест);\n`;
    totalAmount += thisAmount;
  }

  result += `Итого с вас: ${format(totalAmount / 100)}\n`;
  result += `Вы заработали ${volumeCredits} бонусов\n`;

  return result;
}

const result = statement(
  invoices.find((item) => item.customer.id === user),
  playsObj,
);
</script>

<template>
  <div>
    {{ result }}
  </div>
</template>

<style scoped>
</style>
