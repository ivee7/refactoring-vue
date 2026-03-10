enum EnumPlayTypes {
  TRAGEDY = "tragedy",
  COMEDY = "comedy",
  DRAMA = "drama",
}

type TPlay = {
  id: string;
  type: EnumPlayTypes;
  name: string;
};

type TPerformance = {
  playId: TPlay["id"];
  audienceCount: number;
};

type TCustomer = {
  id: string;
  name: string;
};

type TInvoice = {
  customer: TCustomer;
  performances: TPerformance[];
  purchaseDate: number;
};

export type { TPlay, TPerformance, TCustomer, TInvoice };
export { EnumPlayTypes };
