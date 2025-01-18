// merge-coverage.ts
// this is AI generated code, except my corrections... :)
// corrections : 1. fix imports, 2. go for TS, 3. fix type issues
import * as fs from 'fs';
import * as path from 'path';
import { create } from 'istanbul-reports';
import { createContext } from 'istanbul-lib-report';
import { createCoverageMap, CoverageMap } from 'istanbul-lib-coverage';

// Define valid reporter types
type ReporterType = 'clover' | 'json' | 'lcov' | 'text' | 'html' | 'json-summary';
const reporters: ReporterType[] = ['clover', 'json', 'lcov', 'text', 'html', 'json-summary'];

const coverageMap: CoverageMap = createCoverageMap();

// Read and merge both coverage files
const unitTestCoverage = JSON.parse(
  fs.readFileSync(path.resolve('./coverage/coverage-final.json'), 'utf8'),
);
const e2eCoverage = JSON.parse(
  fs.readFileSync(path.resolve('./coverage-e2e/coverage-final.json'), 'utf8'),
);

// Add both coverage maps
coverageMap.merge(unitTestCoverage);
coverageMap.merge(e2eCoverage);

// Create a context for the report
const context = createContext({
  dir: './coverage-combined',
  coverageMap,
});

// Generate combined reports
reporters.forEach((reporter) => {
  create(reporter, {}).execute(context);
});
