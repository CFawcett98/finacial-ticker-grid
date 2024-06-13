import { TickerGrid } from './TickerGrid';

// Paths to the CSV files
const snapshotUrl = './mnt/data/snapshot.csv';
const deltasUrl = './mnt/data/Deltas.csv';

// Function to fetch CSV data from the given URL
async function fetchCsvData(url: string): Promise<string> {
    const response = await fetch(url);
    return await response.text();
}

// Main function to initialize the TickerGrid
async function main() {
    const snapshotData = await fetchCsvData(snapshotUrl);
    const deltasData = await fetchCsvData(deltasUrl);

    const tickerGrid = new TickerGrid(snapshotData, deltasData);
    tickerGrid.initialize();
}

// Call the main function to start the process
main();
