import plays from './plays.json';
import invoices from './invoices.json';

export class BackendService {
    getPlays() {
        return plays;
    }

    getInvoices() {
        return invoices;
    }
}
