"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesGenerator = void 0;
const csv_writer_1 = require("csv-writer");
const cli_progress_1 = __importDefault(require("cli-progress"));
const date_fns_1 = require("date-fns");
class SalesGenerator {
    constructor() {
        this.currentId = 1;
        this.currentOrderId = 1000;
    }
    generateRandomSale() {
        const total = parseFloat((Math.random() * 1000 + 10).toFixed(2));
        const customerId = Math.floor(Math.random() * 1000) + 1;
        // Generate date within the last 5 years
        const endDate = new Date();
        const startDate = (0, date_fns_1.subYears)(endDate, 5);
        const fecha = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        return {
            id: this.currentId++,
            order_id: this.currentOrderId++,
            customer_id: customerId,
            total,
            fecha
        };
    }
    generateSalesFile(numRecords, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                path: outputPath,
                header: [
                    { id: 'id', title: 'id' },
                    { id: 'order_id', title: 'order_id' },
                    { id: 'customer_id', title: 'customer_id' },
                    { id: 'total', title: 'total' },
                    { id: 'fecha', title: 'fecha' }
                ]
            });
            const progressBar = new cli_progress_1.default.SingleBar({}, cli_progress_1.default.Presets.shades_classic);
            progressBar.start(numRecords, 0);
            const BATCH_SIZE = 10000;
            for (let i = 0; i < numRecords; i += BATCH_SIZE) {
                const batchSize = Math.min(BATCH_SIZE, numRecords - i);
                const batch = Array.from({ length: batchSize }, () => this.generateRandomSale());
                yield csvWriter.writeRecords(batch);
                progressBar.update(i + batchSize);
            }
            progressBar.stop();
        });
    }
}
exports.SalesGenerator = SalesGenerator;
