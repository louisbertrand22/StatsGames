# Type Conversion Utilities

This module provides utilities for safely converting string boolean values to actual booleans. This is particularly useful when working with API data that stores booleans as strings.

## Problem

When loading data from APIs (like Supabase, REST APIs, etc.), boolean values are sometimes stored as strings:

```javascript
const userData = {
  isPremium: "1",        // Should be boolean
  darkMode: "false",     // Should be boolean
  notifications: "true"  // Should be boolean
};
```

Using these string values directly in conditionals can lead to unexpected behavior:

```javascript
// ❌ This will always be true because any non-empty string is truthy
if (userData.darkMode) {
  // This runs even though darkMode is "false"!
}
```

## Solution

Use the type conversion utilities to properly convert string booleans to actual booleans.

### `parseBoolean(value)`

Converts a single value to a boolean if it's a string representation of a boolean:

```javascript
import { parseBoolean } from '../utils/typeConversion';

parseBoolean("true")  // true
parseBoolean("false") // false
parseBoolean("1")     // true
parseBoolean("0")     // false
parseBoolean(true)    // true (already a boolean)
parseBoolean("hello") // "hello" (not a boolean string)
```

### `parseBooleanFields(obj, booleanFields)`

Converts specific fields in an object to booleans:

```javascript
import { parseBooleanFields } from '../utils/typeConversion';

const userData = {
  name: "John",
  isPremium: "1",
  darkMode: "false"
};

const processed = parseBooleanFields(userData, ['isPremium', 'darkMode']);
// Result:
// {
//   name: "John",
//   isPremium: true,
//   darkMode: false
// }
```

### `autoConvertBooleans(obj)`

Automatically detects and converts all potential boolean strings in an object:

```javascript
import { autoConvertBooleans } from '../utils/typeConversion';

const userData = {
  name: "John",
  isPremium: "1",
  darkMode: "false",
  bio: "Hello world"  // Not converted because it's not "true"/"false"/"1"/"0"
};

const processed = autoConvertBooleans(userData);
// Result:
// {
//   name: "John",
//   isPremium: true,
//   darkMode: false,
//   bio: "Hello world"
// }
```

## Usage in the App

The `autoConvertBooleans` function is already integrated into the `AuthContext` to ensure profile data from Supabase is properly typed:

```javascript
// In app/contexts/AuthContext.js
const fetchProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (data) {
    // Convert any string boolean values to actual booleans
    const processedData = autoConvertBooleans(data);
    setProfile(processedData);
  }
};
```

This ensures that any boolean fields stored as strings in the database are automatically converted to proper booleans before being used in the app.
