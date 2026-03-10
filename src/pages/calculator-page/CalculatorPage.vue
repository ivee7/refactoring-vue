<script setup lang="ts">
import { BackendService } from "../../api/BackendSevice";
import {
  EnumPlayTypes,
  type TCustomer,
  type TInvoice,
  type TPerformance,
  type TPlay,
} from "../../types";

type PlaysObj = Record<TPlay["id"], Pick<TPlay, "name" | "type">>;

const invoices = BackendService.getInvoices();

const plays = await BackendService.getPlays();

const user: TCustomer["id"] = "Cisco";

const playsObj = plays.reduce<PlaysObj>((acc, { id, name, type }) => {
  acc[id] = { name, type };

  return acc;
}, {});

function calcReceipt(invoice: TInvoice, playsObj: PlaysObj) {
  const PERF_PRICES: Record<EnumPlayTypes, number> = {
    comedy: 30000,
    tragedy: 40000,
    drama: 20000,
  };
  const rubleFormatterInst = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2,
  });

  let totalAmount = 0;
  let totalBonuses = 0;
  let result = `Счёт для ${invoice.customer.name}:\n`;

  for (let performance of invoice.performances) {
    const play = playsObj[performance.playId];

    if (!play) {
      throw new Error(`Cant calculate sum for ${performance.playId}`);
    }

    const sumForPerformance = calcPriceForPerformance(performance, play);
    const bonusesCount = calcBonusesForPerformance(performance, play);

    totalAmount += sumForPerformance;
    totalBonuses += bonusesCount;

    result += generateReceiptPoint({ performance, play, sumForPerformance });
  }

  result += `Итого с вас: ${rubleFormatterInst.format(totalAmount / 100)}\n`;
  result += `Вы заработали ${totalBonuses} бонусов\n`;

  return result;

  function calcPriceForPerformance(
    { audienceCount }: TPerformance,
    play: Pick<TPlay, "name" | "type">,
  ) {
    let thisAmount = 0;

    switch (play.type) {
      case EnumPlayTypes.TRAGEDY:
        thisAmount = PERF_PRICES[play.type];

        if (audienceCount > 30) {
          thisAmount += 1000 * (audienceCount - 30);
        }

        return thisAmount;
      case EnumPlayTypes.DRAMA:
        thisAmount = PERF_PRICES[play.type];

        return thisAmount * audienceCount;
      case EnumPlayTypes.COMEDY:
        thisAmount = PERF_PRICES[play.type];

        if (audienceCount > 20) {
          thisAmount += 10000 + 500 * (audienceCount - 20);
        }

        thisAmount += 300 * audienceCount;

        return thisAmount;
      default:
        throw new Error(`неизвестный жанр: ${play.type}`);
    }
  }

  function calcBonusesForPerformance(
    { audienceCount }: TPerformance,
    play: Pick<TPlay, "name" | "type">,
  ) {
    let volumeCredits = Math.max(audienceCount - 30, 0);

    if ("comedy" === play.type) {
      volumeCredits += Math.floor(audienceCount / 5);
    }

    return volumeCredits;
  }

  function generateReceiptPoint({
    performance,
    play,
    sumForPerformance,
  }: {
    performance: TPerformance;
    play: Pick<TPlay, "name" | "type">;
    sumForPerformance: number;
  }) {
    return `- ${play.name}: ${rubleFormatterInst.format(sumForPerformance / 100)} (${performance.audienceCount} мест);\n`;
  }
}

const targetInVoice = invoices.find((item) => item.customer.id === user);

let result: string | null = null;

if (targetInVoice) {
  result = calcReceipt(targetInVoice, playsObj);
}
</script>

<template>
  <div v-if="result">
    {{ result }}
  </div>
  <div v-else>Error: unable to calc receipt</div>
</template>
