import { green, red } from 'chalk';
import * as cheerio from 'cheerio';
import fs from 'fs';

export const parseCoverageReport = (reportFilePath: string) => {
  const fileContent = fs.readFileSync(reportFilePath, 'utf8');
  const $ = cheerio.load(fileContent);

  const statementsCoverage = $('.pad1y.space-right2').eq(0).find('.strong').text().trim().replace('%', '');
  const branchesCoverage = $('.pad1y.space-right2').eq(1).find('.strong').text().trim().replace('%', '');
  const functionsCoverage = $('.pad1y.space-right2').eq(2).find('.strong').text().trim().replace('%', '');
  const linesCoverage = $('.pad1y.space-right2').eq(3).find('.strong').text().trim().replace('%', '');

  return { statementsCoverage, branchesCoverage, linesCoverage, functionsCoverage };
};

export const calculateTotalCoverage = ({ statementsCoverage, branchesCoverage, functionsCoverage, linesCoverage }) => {
  const parsePercentage = (percentage) => parseFloat(percentage.replace('%', ''));
  const total = Math.ceil((parsePercentage(statementsCoverage) + parsePercentage(branchesCoverage) + parsePercentage(functionsCoverage) + parsePercentage(linesCoverage)) / 4);

  return total;
};

export const displayCoverageRow = (statistic, value) => {
  console.log(`| ${statistic.padEnd(30)} | ${value.toString().padStart(80)} |`);
};

export const isCoverageAboveThreshold = (totalCoverage: number) => {
  if (totalCoverage < 100) {
    console.log(red(`Code coverage is below 100% (${totalCoverage}%). Failing the Cypress test.`));
    process.exit(1);
  } else {
    console.log(green('Code coverage passed 🟢'));
  }
};

export const validateCoveragePath = (projectPath: string) => {
  if (!projectPath) {
    console.error('Please provide the path to the report file as the first argument.');
    process.exit(1);
  }
};
