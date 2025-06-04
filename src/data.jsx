/**
 * A flexible tree data generator that creates hierarchical data with plan and forecast values
 * where all levels have entries that sum to a specific total.
 *
 * @param {Object} options - Configuration options for data generation
 * @param {Array<Array<string>>} options.levelValues - Arrays of possible values for each level
 * @param {number} options.sumConstraint - Value that each level should sum to (default: 100)
 * @param {Array<string>} options.months - Month keys to generate data for
 * @param {Object} options.valueRanges - Min/max ranges for generated values
 * @param {boolean} options.includeRel - Whether to include rel values (default: false)
 * @return {Array} Generated hierarchical data
 */
function generateTreeData({
  levelValues,
  sumConstraint = 100,
  months = ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"],
  valueRanges = {
    min: 100,
    max: 1000,
  },
  includeRel = false,
}) {
  // Validate input
  if (!Array.isArray(levelValues) || levelValues.length === 0) {
    throw new Error("levelValues must be a non-empty array of arrays");
  }

  for (const level of levelValues) {
    if (!Array.isArray(level) || level.length === 0) {
      throw new Error("Each level must be a non-empty array of values");
    }
  }

  const result = [];

  // Generate entries for all possible paths at all levels
  generateEntriesForAllLevels(
    levelValues,
    months,
    valueRanges,
    includeRel,
    sumConstraint,
    result
  );

  // For each level, normalize values to sum to the constraint
  normalizeAllLevelValues(result, levelValues, months, sumConstraint);

  return result;
}

/**
 * Generate entries for all possible paths at all levels of the hierarchy
 */
function generateEntriesForAllLevels(
  levelValues,
  months,
  valueRanges,
  includeRel,
  sumConstraint,
  result
) {
  // Level 1 entries (root level)
  for (const value of levelValues[0]) {
    result.push({
      path: [value],
      values: generateValues(months, valueRanges, includeRel),
    });
  }

  // Generate for other levels
  const generatePaths = (currentPath = [], levelIndex = 1) => {
    if (levelIndex >= levelValues.length) {
      return;
    }

    for (const value of levelValues[levelIndex]) {
      const newPath = [...currentPath, value];

      // Add entry for this level
      result.push({
        path: newPath,
        values: generateValues(months, valueRanges, includeRel),
      });

      // Continue to next level
      generatePaths(newPath, levelIndex + 1);
    }
  };

  // Start from the first level
  for (const value of levelValues[0]) {
    generatePaths([value], 1);
  }
}

/**
 * Generate plan and forecast values for a node
 */
function generateValues(months, ranges, includeRel) {
  const values = {
    plan: {},
    forecast: {},
  };

  if (includeRel) {
    values.rel = {};
  }

  // Generate random values for each month
  for (const month of months) {
    // Random value within range
    const baseValue =
      Math.floor(Math.random() * (ranges.max - ranges.min + 1)) + ranges.min;

    values.plan[month] = baseValue;

    // Forecast is slightly different from plan to make it realistic
    const variation = Math.random() * 0.1 - 0.05; // -5% to +5%
    values.forecast[month] = Math.round(baseValue * (1 + variation));

    if (includeRel) {
      values.rel[month] = Math.floor(Math.random() * 30) + 1; // Random value 1-30
    }
  }

  return values;
}

/**
 * Normalize values at all levels to sum to the constraint
 */
function normalizeAllLevelValues(data, levelValues, months, sumConstraint) {
  // Normalize for each level length
  for (let level = 1; level <= levelValues.length; level++) {
    // Get all entries at this level
    const entriesAtLevel = data.filter((item) => item.path.length === level);

    // Group by parent path (or by total if it's the first level)
    const groupedEntries = {};

    if (level === 1) {
      // For level 1, there's just one group - all entries
      groupedEntries["root"] = entriesAtLevel;
    } else {
      // Group by parent path
      for (const entry of entriesAtLevel) {
        const parentPath = entry.path.slice(0, -1).join("|");

        if (!groupedEntries[parentPath]) {
          groupedEntries[parentPath] = [];
        }

        groupedEntries[parentPath].push(entry);
      }
    }

    // For each parent/group, normalize its children
    for (const parentKey in groupedEntries) {
      const children = groupedEntries[parentKey];

      // Normalize each month separately
      for (const month of months) {
        // Normalize plan values
        normalizeValuesForMonth(children, month, "plan", sumConstraint);

        // Normalize forecast values
        normalizeValuesForMonth(children, month, "forecast", sumConstraint);
      }
    }
  }
}

/**
 * Normalize values for a specific month and value type
 */
function normalizeValuesForMonth(children, month, valueType, sumConstraint) {
  // Calculate current sum
  let currentSum = children.reduce(
    (sum, child) => sum + child.values[valueType][month],
    0
  );

  // Scale factor
  const scaleFactor = sumConstraint / currentSum;

  // Adjust all values to make the sum equal to the constraint
  for (const child of children) {
    child.values[valueType][month] = Math.round(
      child.values[valueType][month] * scaleFactor
    );
  }

  // Handle rounding errors by adjusting the last child
  const adjustedSum = children.reduce(
    (sum, child) => sum + child.values[valueType][month],
    0
  );

  if (adjustedSum !== sumConstraint) {
    children[children.length - 1].values[valueType][month] +=
      sumConstraint - adjustedSum;
  }
}

// Example usage:
export function getData() {
  let region = [
    "Poland",
    "Portugal",
    "Romania",
    "Sweden",
    "Switzerland",
    "Czech Republic",
  ];

  let tklf = ["F38CBU", "K187SKD"];

  let bm7 = [
    "113.710.1",
    "114.912.1",
    "118.614.1",
    "114.345.1",
    "132.347.1",
    "141.351.1",
    "158.354.1",
    "198.384.1",
    "218.385.1",
    "998.387.1",
  ];

  const levelValues = [region, tklf, bm7];

  const data = generateTreeData({
    levelValues,
    sumConstraint: 100,
    months: ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"],
    valueRanges: { min: 100, max: 1000 },
    includeRel: true,
  });

  // console.log(data);

  return data;
}
