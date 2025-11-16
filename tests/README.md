# SE TradeHouse Test Suite

Comprehensive unit tests for the SE TradeHouse standalone application.

## Running the Tests

1. Open `tests/index.html` in your browser
2. Click "Run All Tests" to execute the full test suite
3. Click "Debug Profitable Filter" to investigate the profitable filter issue

## Test Coverage

### Item Parsing Tests
- ✓ MyObjectBuilder format parsing (Ingot, Ore, Component, Consumable)
- ✓ Tool identification (Welder, Grinder, Rifle)
- ✓ Plain format fallback

### Good Type Filtering Tests
- ✓ Filter by Ore
- ✓ Filter by Ingot
- ✓ Filter by Component
- ✓ Filter by Tool
- ✓ Filter by Ammo
- ✓ Filter by Bottle
- ✓ Filter by Consumable
- ✓ Show all types

### Transaction Type Filtering Tests
- ✓ Filter buy orders only
- ✓ Filter sell offers only
- ✓ Filter profitable transactions only
- ✓ Show all transactions

### Search Filtering Tests
- ✓ Search by item name
- ✓ Search by owner name
- ✓ Search by GPS name
- ✓ Empty search returns all

### Sorting Tests
- ✓ Sort by profit (descending)
- ✓ Sort by price (ascending)
- ✓ Sort by price (descending)
- ✓ Sort by quantity (descending)
- ✓ Sort by item name (alphabetically)
- ✓ Sort by store name (alphabetically)

### Profit Calculation Tests
- ✓ Calculate profit for matching buy/sell pairs
- ✓ Verify profit per unit calculation
- ✓ Exclude same-owner transactions
- ✓ Calculate distance between GPS coordinates

### CSV Parsing Tests
- ✓ Parse MyObjectBuilder format from CSV
- ✓ Parse GPS coordinates
- ✓ Parse transaction types

## Test Data

The test suite uses mock data defined in `mockData.js` with:
- 16 sample transactions across all good types
- Matching buy/sell pairs for profit testing
- Various owners and GPS locations
- CSV format examples

## Known Issues

The "Profitable Only" filter may show 0 results if:
1. Profit calculation hasn't run yet
2. No matching buy/sell pairs exist in the data
3. All matching pairs are from the same owner

Use the "Debug Profitable Filter" button to investigate specific issues.
