import plays from "./plays.json";
import invoices from "./invoices.json";
import type { TPlay } from "../types";

export class BackendService {
  static getPlays(): Promise<TPlay[]> {
    return new Promise((res) => res(plays as TPlay[]));
  }

  static getInvoices() {
    return invoices;
  }
}
