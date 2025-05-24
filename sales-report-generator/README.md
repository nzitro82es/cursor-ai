# Sales Report Generator

A command-line tool for generating sales data and calculating metrics. This tool can handle large datasets efficiently and provides progress bars for long-running operations.

## Features

- Generate sales data with customizable number of records
- Automatic calculation of monthly metrics during generation
- Calculate monthly metrics including:
  - Number of sales
  - Minimum sale value
  - Maximum sale value
  - Mean sale value
  - Standard deviation
- Progress bars for all operations
- Efficient memory usage for large datasets
- CSV output format

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd sales-report-generator

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Generate Sales Data and Metrics

```bash
# Generate 1000 sales records and calculate metrics
npm start generate 1000

# Generate 1000000 sales records with custom output paths
npm start generate 1000000 -o custom-sales.csv -m custom-metrics.csv
```

### Calculate Metrics Only (for existing sales data)

```bash
# Calculate metrics from existing sales data
npm start metrics sales.csv

# Calculate metrics with custom output path
npm start metrics sales.csv -o custom-metrics.csv
```

### Direct CLI Usage (after global installation)

```bash
# Install globally
npm install -g .

# Generate sales and metrics
sales-report generate 1000

# Calculate metrics from existing data
sales-report metrics sales.csv
```

## Command Options

### Generate Command
- `<records>`: Number of records to generate (required)
- `-o, --output <path>`: Sales data output file path (default: "sales.csv")
- `-m, --metrics <path>`: Metrics output file path (default: "metrics.csv")

### Metrics Command
- `<input>`: Input CSV file path (required)
- `-o, --output <path>`: Output metrics file path (default: "metrics.csv")

## Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

## File Format

### Sales Data CSV Format
```csv
id,order_id,customer_id,total,fecha
1,1001,1,100.50,2024-02-28T10:30:00.000Z
```

### Metrics CSV Format
```csv
Year,Month,Number of Sales,Minimum,Maximum,Mean,Standard Deviation
2024,2,100,50.25,150.75,100.50,25.5
```

## Performance Considerations

- The tool uses streaming for both reading and writing CSV files
- Batch processing is implemented for large datasets
- Memory usage is optimized for handling millions of records
- Progress bars provide feedback for long-running operations

## License

ISC 