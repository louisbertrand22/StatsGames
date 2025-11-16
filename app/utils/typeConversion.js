/**
 * Converts string boolean values to actual booleans.
 * Handles common string representations: "true", "false", "1", "0"
 * 
 * @param {any} value - The value to convert
 * @returns {boolean|any} - Boolean if the value is a string boolean, otherwise returns the original value
 */
export const parseBoolean = (value) => {
  // If already a boolean, return as is
  if (typeof value === 'boolean') {
    return value;
  }

  // If it's a string, check for boolean representations
  if (typeof value === 'string') {
    const lowercased = value.toLowerCase().trim();
    
    // Handle "true", "false"
    if (lowercased === 'true') return true;
    if (lowercased === 'false') return false;
    
    // Handle "1", "0"
    if (lowercased === '1') return true;
    if (lowercased === '0') return false;
  }

  // If it's a number, use JavaScript's truthy/falsy behavior
  if (typeof value === 'number') {
    return value !== 0;
  }

  // Return original value for any other type
  return value;
};

/**
 * Converts all string boolean fields in an object to actual booleans.
 * This is useful when receiving data from APIs that store booleans as strings.
 * 
 * @param {Object} obj - The object to process
 * @param {Array<string>} booleanFields - Array of field names that should be treated as booleans
 * @returns {Object} - New object with converted boolean fields
 */
export const parseBooleanFields = (obj, booleanFields = []) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = { ...obj };

  booleanFields.forEach(field => {
    if (field in result) {
      result[field] = parseBoolean(result[field]);
    }
  });

  return result;
};

/**
 * Automatically detects and converts potential string boolean values in an object.
 * This scans all fields and converts values that look like booleans.
 * 
 * @param {Object} obj - The object to process
 * @returns {Object} - New object with converted values
 */
export const autoConvertBooleans = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const lowercased = value.toLowerCase().trim();
      // Only auto-convert if it's clearly a boolean string
      if (['true', 'false', '1', '0'].includes(lowercased)) {
        result[key] = parseBoolean(value);
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};
