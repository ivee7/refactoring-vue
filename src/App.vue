<script setup>
import { BackendService } from "./api/BackendSevice";

const apiService = new BackendService();

const invoices = apiService.getInvoices();

const plays = apiService.getPlays();

var user = "BigCo";

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Счёт для ${invoice.customer}:\n`;
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`неизвестный жанр: ${play.type}`);
    }

    // Добавление бонусных баллов
    volumeCredits += Math.max(perf.audience - 30, 0);
    // Дополнительный бонус за комедию
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // Вывод строки счёта
    result += `- ${play.name}: ${format(thisAmount / 100)} (${perf.audience} мест);\n`;
    totalAmount += thisAmount;
  }

  result += `Итого с вас: ${format(totalAmount / 100)}\n`;
  result += `Вы заработали ${volumeCredits} бонусов\n`;

  return result;
}

const result = statement(invoices.find((item) => item.customer === user), plays);
</script>

<template>
  <div>
    {{ result }}
  </div>
</template>
