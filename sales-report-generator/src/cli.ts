#!/usr/bin/env node

import { Command } from 'commander';
import { SalesGenerator } from './utils/salesGenerator';
import { MetricsCalculator } from './utils/metricsCalculator';
import path from 'path';

const program = new Command();

program
    .name('sales-report')
    .description('CLI to generate sales data and calculate metrics')
    .version('1.0.0');

program
    .command('generate')
    .description('Generate sales data CSV file and calculate metrics')
    .argument('<records>', 'Number of records to generate')
    .option('-o, --output <path>', 'Output file path', 'sales.csv')
    .option('-m, --metrics <path>', 'Output metrics file path', 'metrics.csv')
    .action(async (records: string, options: { output: string; metrics: string }) => {
        try {
            const numRecords = parseInt(records, 10);
            if (isNaN(numRecords) || numRecords <= 0) {
                console.error('Please provide a valid positive number of records');
                process.exit(1);
            }

            const generator = new SalesGenerator();
            console.log(`Generating ${numRecords} sales records...`);
            await generator.generateSalesFile(numRecords, options.output);
            console.log(`Sales data generated successfully at: ${options.output}`);

            // Automatically calculate metrics
            console.log('Calculating metrics...');
            const calculator = new MetricsCalculator();
            await calculator.calculateMonthlyMetrics(options.output, options.metrics);
            console.log(`Metrics calculated successfully and saved to: ${options.metrics}`);
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    });

program
    .command('metrics')
    .description('Calculate metrics from existing sales data')
    .argument('<input>', 'Input CSV file path')
    .option('-o, --output <path>', 'Output metrics file path', 'metrics.csv')
    .action(async (input: string, options: { output: string }) => {
        try {
            const calculator = new MetricsCalculator();
            console.log('Calculating metrics...');
            await calculator.calculateMonthlyMetrics(input, options.output);
            console.log(`Metrics calculated successfully and saved to: ${options.output}`);
        } catch (error) {
            console.error('Error calculating metrics:', error);
            process.exit(1);
        }
    });

program.parse(); 