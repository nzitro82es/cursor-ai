#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const salesGenerator_1 = require("./utils/salesGenerator");
const metricsCalculator_1 = require("./utils/metricsCalculator");
const program = new commander_1.Command();
program
    .name('sales-report')
    .description('CLI to generate sales data and calculate metrics')
    .version('1.0.0');
program
    .command('generate')
    .description('Generate sales data CSV file')
    .argument('<records>', 'Number of records to generate')
    .option('-o, --output <path>', 'Output file path', 'sales.csv')
    .action((records, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numRecords = parseInt(records, 10);
        if (isNaN(numRecords) || numRecords <= 0) {
            console.error('Please provide a valid positive number of records');
            process.exit(1);
        }
        const generator = new salesGenerator_1.SalesGenerator();
        console.log(`Generating ${numRecords} sales records...`);
        yield generator.generateSalesFile(numRecords, options.output);
        console.log(`Sales data generated successfully at: ${options.output}`);
    }
    catch (error) {
        console.error('Error generating sales data:', error);
        process.exit(1);
    }
}));
program
    .command('metrics')
    .description('Calculate metrics from sales data')
    .argument('<input>', 'Input CSV file path')
    .option('-o, --output <path>', 'Output metrics file path', 'metrics.csv')
    .action((input, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calculator = new metricsCalculator_1.MetricsCalculator();
        console.log('Calculating metrics...');
        yield calculator.calculateMonthlyMetrics(input, options.output);
        console.log(`Metrics calculated successfully and saved to: ${options.output}`);
    }
    catch (error) {
        console.error('Error calculating metrics:', error);
        process.exit(1);
    }
}));
program.parse();
