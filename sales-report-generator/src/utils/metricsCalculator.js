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
exports.MetricsCalculator = void 0;
const fs_1 = require("fs");
const csv_parse_1 = require("csv-parse");
const csv_writer_1 = require("csv-writer");
const cli_progress_1 = __importDefault(require("cli-progress"));
class MetricsCalculator {
    processStreamInBatches(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const salesByMonth = new Map();
            return new Promise((resolve, reject) => {
                const parser = (0, csv_parse_1.parse)({
                    columns: true,
                    cast: (value, context) => {
                        if (context.column === 'fecha') {
                            return new Date(value);
                        }
                        if (context.column === 'total') {
                            return parseFloat(value);
                        }
                        return value;
                    }
                });
                const progressBar = new cli_progress_1.default.SingleBar({}, cli_progress_1.default.Presets.shades_classic);
                progressBar.start(100, 0); // We'll update based on rough progress
                (0, fs_1.createReadStream)(filePath)
                    .pipe(parser)
                    .on('data', (record) => {
                    const date = new Date(record.fecha);
                    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    if (!salesByMonth.has(key)) {
                        salesByMonth.set(key, []);
                    }
                    salesByMonth.get(key).push(record.total);
                })
                    .on('end', () => {
                    progressBar.stop();
                    resolve(salesByMonth);
                })
                    .on('error', (error) => {
                    progressBar.stop();
                    reject(error);
                });
            });
        });
    }
    calculateMetrics(values) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const sum = values.reduce((acc, val) => acc + val, 0);
        const mean = sum / values.length;
        // Optimized standard deviation calculation
        const squaredDiffs = values.reduce((acc, val) => {
            const diff = val - mean;
            return acc + (diff * diff);
        }, 0);
        const standardDeviation = Math.sqrt(squaredDiffs / values.length);
        return { min, max, mean, standardDeviation };
    }
    calculateMonthlyMetrics(inputPath, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const salesByMonth = yield this.processStreamInBatches(inputPath);
            const metrics = [];
            const progressBar = new cli_progress_1.default.SingleBar({}, cli_progress_1.default.Presets.shades_classic);
            progressBar.start(salesByMonth.size, 0);
            let progress = 0;
            for (const [key, values] of salesByMonth.entries()) {
                const [year, month] = key.split('-').map(Number);
                const { min, max, mean, standardDeviation } = this.calculateMetrics(values);
                metrics.push({
                    year,
                    month,
                    count: values.length,
                    min,
                    max,
                    mean,
                    standardDeviation
                });
                progressBar.update(++progress);
            }
            progressBar.stop();
            const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                path: outputPath,
                header: [
                    { id: 'year', title: 'Year' },
                    { id: 'month', title: 'Month' },
                    { id: 'count', title: 'Number of Sales' },
                    { id: 'min', title: 'Minimum' },
                    { id: 'max', title: 'Maximum' },
                    { id: 'mean', title: 'Mean' },
                    { id: 'standardDeviation', title: 'Standard Deviation' }
                ]
            });
            yield csvWriter.writeRecords(metrics);
        });
    }
}
exports.MetricsCalculator = MetricsCalculator;
